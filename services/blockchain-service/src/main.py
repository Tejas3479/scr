from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import hashlib
import time
import uvicorn

app = FastAPI(
    title="FarmQuest Solarpunk Green Ledger & Blockchain Service",
    description="Audits environmental benchmarks and issues green reward tokens",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory mock block ledger
BLOCKCHAIN_LEDGER = []

class CarbonAuditRequest(BaseModel):
    user_id: str
    farm_twin_id: str
    regenerative_practice_score: float # 0.0 to 1.0 based on soil, water, composting data
    soil_carbon_sequestration_metric: float # Metric tons per hectare

class MintTokenRequest(BaseModel):
    user_id: str
    amount: float
    achievement_key: str # 'GENESIS_HARVEST', 'HYDRO_SENTINEL'

class CropBatchCertRequest(BaseModel):
    user_id: str
    crop_batch_id: str
    pcr_pathogen_hash: str # Diagnostic reference from bioinformatics-service
    nitrogen_level_average: float

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "blockchain-service",
        "ledger_size": len(BLOCKCHAIN_LEDGER),
        "consensus_protocol": "Proof-of-Stake (Green-Solar)"
    }

@app.post("/api/blockchain/carbon-audit/verify")
async def verify_carbon_audit(request: CarbonAuditRequest):
    """
    Audits soil carbon metrics and generates a secure ledger block candidate
    """
    try:
        # Calculate carbon credits based on practices and metrics
        earned_credits = request.soil_carbon_sequestration_metric * 10.5 * request.regenerative_practice_score
        
        # Generate tamper-proof cryptographic audit hash
        audit_payload = f"{request.user_id}:{request.farm_twin_id}:{earned_credits}:{time.time()}"
        sha256_hash = hashlib.sha256(audit_payload.encode()).hexdigest()
        
        block = {
            "index": len(BLOCKCHAIN_LEDGER) + 1,
            "previous_hash": BLOCKCHAIN_LEDGER[-1]["block_hash"] if BLOCKCHAIN_LEDGER else "0" * 64,
            "timestamp": time.time(),
            "data": {
                "user_id": request.user_id,
                "earned_credits": round(earned_credits, 4),
                "practice_score": request.regenerative_practice_score
            },
            "block_hash": sha256_hash
        }
        
        BLOCKCHAIN_LEDGER.append(block)
        
        return {
            "success": True,
            "message": "Carbon credit audit verified and locked onto the Solarpunk ledger.",
            "block_index": block["index"],
            "earned_credits": round(earned_credits, 4),
            "audit_hash": sha256_hash
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ledger audit insertion error: {str(e)}")

@app.post("/api/blockchain/tokens/mint")
async def mint_farm_tokens(request: MintTokenRequest):
    """
    Mints FarmTokens (decentralized token assets) to reward farming achievements
    """
    try:
        tx_payload = f"{request.user_id}:{request.amount}:{request.achievement_key}:{time.time()}"
        tx_hash = hashlib.sha256(tx_payload.encode()).hexdigest()
        
        return {
            "success": True,
            "message": f"Successfully minted {request.amount} FarmTokens to user wallet.",
            "recipient_wallet": request.user_id,
            "mint_transaction_hash": tx_hash,
            "consensus": "validated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token contract invocation failure: {str(e)}")

@app.post("/api/blockchain/crop-batch/certify")
async def certify_crop_batch(request: CropBatchCertRequest):
    """
    Issues a bio-safety and organic certificate for a harvest crop batch
    """
    try:
        # Determine safety index based on Average Nitrogen and Pathogen diagnostics
        safe = request.nitrogen_level_average < 120.0 and request.pcr_pathogen_hash != "pathogen-positive"
        
        cert_payload = f"{request.crop_batch_id}:{safe}:{time.time()}"
        cert_hash = hashlib.sha256(cert_payload.encode()).hexdigest()
        
        return {
            "crop_batch_id": request.crop_batch_id,
            "organic_certified": safe,
            "safety_rating": "AAA" if safe else "unverified",
            "safety_certificate_hash": cert_hash,
            "consensus_status": "certified"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Genomic certification hashing failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3009)
