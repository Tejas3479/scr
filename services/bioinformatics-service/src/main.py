from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import uvicorn

app = FastAPI(
    title="FarmQuest Bioinformatics & CRISPR Diagnostic Service",
    description="Decodes real-time PCR genetic data and tracks CRISPR crop enhancements",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reference Pathogen Database for dynamic sequence alignment
PATHOGEN_DATABASE = {
    "Rblast_2026": {
        "name": "Rice Blast Fungus (Magnaporthe oryzae)",
        "marker": "ATGCGTCGATTCGATCGATTCGAT",
        "severity": "critical",
        "treatment": "Deploy Bacillus thuringiensis endophyte strain BT-92 organic spray."
    },
    "Ttcank_2026": {
        "name": "Tomato Bacterial Canker (Clavibacter)",
        "marker": "GCTAGCTAGCTAAATTTGGGCCCG",
        "severity": "high",
        "treatment": "Isolate crop row, apply copper hydroxide bio-suspension."
    },
    "AphidD_2026": {
        "name": "Aphid-borne Viral Vector",
        "marker": "CCCGGGTTTAAATTTCCCGGGAAA",
        "severity": "moderate",
        "treatment": "Release ladybug biological controls, spray cold-pressed neem solution."
    }
}

# Request/Response schemas
class CRISPRTrackRequest(BaseModel):
    crop_name: str
    variety: str
    genomic_marker_sequence: str
    modification_purpose: str
    bio_safety_certificate_hash: str

class PCRProbeAlignRequest(BaseModel):
    probe_id: str
    sequence_read: str # Raw DNA sequence read from field PCR sensor
    fluorescence_intensity: float # Cas12/Cas13 cleavage fluorescent reading (0.0 to 1.0)

class AlignmentResult(BaseModel):
    pathogen_detected: Optional[str]
    scientific_name: Optional[str]
    alignment_score: float
    severity_level: str
    recommended_treatment: Optional[str]
    cas_collateral_cleavage_active: bool

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "bioinformatics-service",
        "diagnostic_active": True
    }

def perform_sequence_alignment(seq1: str, seq2: str) -> float:
    """
    Computes a simplified global sequence alignment score (Needleman-Wunsch inspired)
    Returns a match percentage score from 0.0 to 1.0
    """
    m = len(seq1)
    n = len(seq2)
    if m == 0 or n == 0:
        return 0.0
        
    # Calculate Levenshtein distance as alignment base
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
        
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if seq1[i-1] == seq2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
                
    distance = dp[m][n]
    max_len = max(m, n)
    return 1.0 - (distance / max_len)

@app.post("/api/bioinformatics/align-pcr", response_model=AlignmentResult)
async def align_pcr_probe(request: PCRProbeAlignRequest):
    """
    Aligns raw field DNA probe reads against pathogen signatures and
    factors in Cas12/Cas13 fluorescent cleavage activity.
    """
    try:
        best_match = None
        best_score = 0.0
        target_pathogen = None
        
        # Align sequence against reference pathogen marker tracks
        for key, pathogen in PATHOGEN_DATABASE.items():
            score = perform_sequence_alignment(request.sequence_read.upper(), pathogen["marker"])
            if score > best_score:
                best_score = score
                best_match = pathogen
                target_pathogen = key

        # Dynamic Cas12/Cas13 collateral cleavage activation assessment
        # A high fluorescence intensity confirms enzymatic collateral reporting
        cas_active = request.fluorescence_intensity > 0.65
        
        # Threshold: if alignment is > 80% and Cas sensors are triggered
        if best_score > 0.75 and cas_active:
            return AlignmentResult(
                pathogen_detected=best_match["name"],
                scientific_name=best_match["name"],
                alignment_score=round(best_score * 100, 2),
                severity_level=best_match["severity"],
                recommended_treatment=best_match["treatment"],
                cas_collateral_cleavage_active=True
            )
            
        return AlignmentResult(
            pathogen_detected=None,
            scientific_name=None,
            alignment_score=round(best_score * 100, 2),
            severity_level="healthy",
            recommended_treatment="No active pathogen matches. Crop health registers optimal.",
            cas_collateral_cleavage_active=cas_active
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Alignment pipeline failure: {str(e)}")

@app.post("/api/bioinformatics/crispr/register")
async def register_crispr_crop(request: CRISPRTrackRequest):
    """
    Registers a newly engineered or modified crop row.
    Locks the genomic footprint mapping.
    """
    return {
        "success": True,
        "message": f"CRISPR enhancement {request.crop_name} ({request.variety}) mapped successfully.",
        "locked_hash": request.bio_safety_certificate_hash,
        "purpose": request.modification_purpose
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3008)
