'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import { playSound } from '@/services/sound'
import { Dna, ShieldAlert, CheckCircle, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react'

// Presets matching apps/bioinformatics/src/main.py databases
const PRESETS = [
  {
    id: 'Rblast_2026',
    name: 'Rice Blast Fungus (Magnaporthe oryzae)',
    sequence: 'ATGCGTCGATTCGATCGATTCGAT',
    intensity: 0.85,
    severity: 'critical'
  },
  {
    id: 'Ttcank_2026',
    name: 'Tomato Bacterial Canker (Clavibacter)',
    sequence: 'GCTAGCTAGCTAAATTTGGGCCCG',
    intensity: 0.72,
    severity: 'high'
  },
  {
    id: 'AphidD_2026',
    name: 'Aphid-borne Viral Vector',
    sequence: 'CCCGGGTTTAAATTTCCCGGGAAA',
    intensity: 0.50,
    severity: 'moderate'
  },
  {
    id: 'Healthy_2026',
    name: 'Healthy Crop (Negative Control)',
    sequence: 'TTAACCGGTTGGCCAATTGGCCAA',
    intensity: 0.15,
    severity: 'healthy'
  }
]

export default function CRISPRPage() {
  const [probeId, setProbeId] = useState('PROBE-X902')
  const [sequence, setSequence] = useState(PRESETS[0].sequence)
  const [intensity, setIntensity] = useState(PRESETS[0].intensity)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    playSound.tick()
    setSequence(preset.sequence)
    setIntensity(preset.intensity)
    setProbeId(`PROBE-${preset.id.slice(0, 6).toUpperCase()}`)
  }

  const handleAlign = async () => {
    playSound.tick()
    setLoading(true)
    setError('')
    setResults(null)

    const payload = {
      probe_id: probeId,
      sequence_read: sequence,
      fluorescence_intensity: intensity
    }

    try {
      const response = await fetch('http://localhost:3008/api/bioinformatics/align-pcr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
        
        // Play corresponding diagnostic sounds
        if (data.pathogen_detected) {
          if (data.severity_level === 'critical' || data.severity_level === 'high') {
            playSound.alarm()
          } else {
            playSound.success()
          }
        } else {
          playSound.success()
        }
      } else {
        throw new Error('Bioinformatics service alignment failure')
      }
    } catch (err) {
      console.warn('Bioinformatics service offline, initiating simulated local alignment...')
      // Simulated alignment calculation (fallback matching backend algorithm)
      setTimeout(() => {
        let matchedPathogen: any = null
        let maxScore = 0.0

        const targets = [
          { name: 'Rice Blast Fungus (Magnaporthe oryzae)', marker: 'ATGCGTCGATTCGATCGATTCGAT', severity: 'critical', treatment: 'Deploy Bacillus thuringiensis endophyte strain BT-92 organic spray.' },
          { name: 'Tomato Bacterial Canker (Clavibacter)', marker: 'GCTAGCTAGCTAAATTTGGGCCCG', severity: 'high', treatment: 'Isolate crop row, apply copper hydroxide bio-suspension.' },
          { name: 'Aphid-borne Viral Vector', marker: 'CCCGGGTTTAAATTTCCCGGGAAA', severity: 'moderate', treatment: 'Release ladybug biological controls, spray cold-pressed neem solution.' }
        ]

        targets.forEach(t => {
          let matches = 0
          const minLen = Math.min(sequence.length, t.marker.length)
          for (let i = 0; i < minLen; i++) {
            if (sequence.toUpperCase()[i] === t.marker[i]) matches++
          }
          const score = matches / Math.max(sequence.length, t.marker.length)
          if (score > maxScore) {
            maxScore = score
            matchedPathogen = t
          }
        })

        const isCasActive = intensity > 0.65

        if (maxScore > 0.75 && isCasActive && matchedPathogen) {
          playSound.alarm()
          setResults({
            pathogen_detected: matchedPathogen.name,
            scientific_name: matchedPathogen.name,
            alignment_score: Math.round(maxScore * 10000) / 100,
            severity_level: matchedPathogen.severity,
            recommended_treatment: matchedPathogen.treatment,
            cas_collateral_cleavage_active: true,
            simulated: true
          })
        } else {
          playSound.success()
          setResults({
            pathogen_detected: null,
            scientific_name: null,
            alignment_score: Math.round(maxScore * 10000) / 100,
            severity_level: 'healthy',
            recommended_treatment: 'No active pathogen matches. Crop health registers optimal.',
            cas_collateral_cleavage_active: isCasActive,
            simulated: true
          })
        }
        setLoading(false)
      }, 1500)
    } finally {
      if (!results) setLoading(false)
    }
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { text: 'text-neon-pink', border: 'border-neon-pink/50', bg: 'bg-neon-pink/15', glow: 'neon-glow-pink' }
      case 'high':
        return { text: 'text-neon-orange', border: 'border-neon-orange/50', bg: 'bg-neon-orange/15', glow: 'neon-glow-orange' }
      case 'moderate':
        return { text: 'text-neon-purple', border: 'border-neon-purple/50', bg: 'bg-neon-purple/15', glow: 'neon-glow-purple' }
      default:
        return { text: 'text-neon-green', border: 'border-neon-green/50', bg: 'bg-neon-green/15', glow: 'neon-glow-green' }
    }
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white relative overflow-hidden selection:bg-neon-cyan selection:text-[#050810]">
      {/* Cyber Grid & Scanline Background Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:100%_30px] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:30px_100%] z-0" />
      
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] bg-neon-cyan/4 rounded-full filter blur-[120px] animate-blob" />
          <div className="absolute bottom-[20%] left-[5%] w-[35vw] h-[35vw] bg-neon-green/4 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
        </div>

        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            onMouseEnter={playSound.hover} 
            onClick={playSound.tick} 
            className="tech-mono text-xs text-neon-cyan hover:text-neon-green transition-all flex items-center gap-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> 
            ◀ BACK TO COMMAND DECK
          </Link>
        </div>

        {/* Title */}
        <div className="mb-10 pb-4 border-b border-white/10">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent tracking-wider">
            🧬 CRISPR-Cas13a Pathogen Diagnostics
          </h1>
          <p className="text-neon-cyan/60 tech-mono text-xs mt-2">
            PROTOCOL: REAL-TIME GENOMIC SEQUENCE AMPLIFICATION & ENZYMATIC REPORTING HUD
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-hud p-6 border-neon-cyan/30 rounded-2xl relative overflow-hidden shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-cyan" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-cyan" />
              
              <h2 className="tech-mono text-sm font-bold text-neon-cyan mb-6 uppercase tracking-widest flex items-center gap-2">
                <Dna className="w-4 h-4 text-neon-cyan animate-pulse" />
                PATHO-GENOMIC PROBE EMULATOR
              </h2>
              
              {/* Presets Grid */}
              <div className="mb-6">
                <label className="text-[10px] tech-mono text-neon-cyan/50 block mb-3 uppercase tracking-wide">SELECT PATHO-GENOMIC REFERENCE TARGET</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onMouseEnter={playSound.hover}
                      onClick={() => handlePresetSelect(p)}
                      className={`text-left p-3.5 rounded-xl border text-xs tech-mono transition-all hover:scale-[1.015] relative group ${
                        sequence === p.sequence
                          ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'border-white/10 bg-[#050810]/60 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.severity === 'critical' ? 'bg-neon-pink animate-pulse' : p.severity === 'high' ? 'bg-neon-orange' : p.severity === 'moderate' ? 'bg-neon-purple' : 'bg-neon-green'
                        }`} />
                        {p.name.split(' (')[0]}
                      </div>
                      <div className="text-[10px] text-white/40 truncate font-mono">{p.sequence}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="md:col-span-1">
                  <label className="text-[10px] tech-mono text-neon-cyan/50 block mb-2 uppercase tracking-wide">PROBE IDENTIFIER</label>
                  <input
                    type="text"
                    value={probeId}
                    onChange={(e) => setProbeId(e.target.value)}
                    className="w-full bg-[#050810] border border-white/10 rounded-xl px-4 py-3 text-xs tech-mono text-neon-green focus:border-neon-cyan focus:outline-none transition-all uppercase"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] tech-mono text-neon-cyan/50 block mb-2 uppercase tracking-wide">TARGET DNA AMPLIFIED SEQUENCE</label>
                  <input
                    type="text"
                    value={sequence}
                    onChange={(e) => setSequence(e.target.value.toUpperCase())}
                    className="w-full bg-[#050810] border border-white/10 rounded-xl px-4 py-3 text-xs tech-mono text-neon-cyan focus:border-neon-cyan focus:outline-none transition-all uppercase"
                  />
                </div>
              </div>

              {/* Cleavage Cleaving Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2 tech-mono text-xs">
                  <span className="text-neon-cyan/60 uppercase tracking-wider">CAS12A/CAS13A FLUORESCENCE REPORTING</span>
                  <span className={intensity > 0.65 ? 'text-neon-pink font-bold' : 'text-neon-green'}>
                    {(intensity * 100).toFixed(0)}% {intensity > 0.65 ? '(ACTIVE COLLATERAL CLEAVAGE)' : '(IDLE)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={intensity}
                  onChange={(e) => {
                    setIntensity(parseFloat(e.target.value));
                    if (Math.random() > 0.7) playSound.tick();
                  }}
                  className="w-full accent-neon-pink cursor-pointer bg-white/15 h-2 rounded-lg"
                />
                
                {/* Visualizer bar */}
                <div className="w-full bg-[#050810] rounded-full h-3.5 overflow-hidden border border-white/5 mt-4 relative">
                  <motion.div
                    className={`h-full ${intensity > 0.65 ? 'bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink' : 'bg-gradient-to-r from-neon-green to-neon-cyan'}`}
                    style={{ width: `${intensity * 100}%` }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
              </div>

              {/* Align Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={playSound.hover}
                onClick={handleAlign}
                disabled={loading}
                className="w-full bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-cyan hover:to-neon-green text-cyber-darker font-mono font-black py-4.5 rounded-xl shadow-glow-sm hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin h-4.5 w-4.5 text-[#050810]" />
                    RUNNING SEQUENTIAL BIOMAP MATCHING...
                  </>
                ) : (
                  <>🧬 INITIATE PATHOGEN GENOMIC ALIGNMENT</>
                )}
              </motion.button>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="glass-hud p-6 border-neon-purple/30 rounded-2xl relative min-h-[350px] flex flex-col justify-between shadow-[0_4px_30px_rgba(255,0,255,0.05)]">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-purple" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-purple" />
              
              <div>
                <h2 className="tech-mono text-sm font-bold text-neon-purple mb-6 uppercase tracking-widest border-b border-neon-purple/20 pb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-neon-purple animate-pulse" />
                  DIAGNOSTIC HUD OUTPUT
                </h2>

                <AnimatePresence mode="wait">
                  {results ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="flex flex-col flex-1"
                    >
                      {/* Severity Card */}
                      <div className={`p-4 border rounded-xl mb-6 flex flex-col gap-2 relative overflow-hidden ${getSeverityStyles(results.severity_level).bg} ${getSeverityStyles(results.severity_level).border}`}>
                        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-[linear-gradient(90deg,transparent,currentColor,transparent)] animate-scan-line" style={{ color: 'inherit' }} />
                        
                        <div className="flex justify-between items-center tech-mono text-[9px]">
                          <span className="text-white/60">SEVERITY LEVEL</span>
                          <span className={`font-bold px-2 py-0.5 rounded ${getSeverityStyles(results.severity_level).text} border border-current bg-[#050810]`}>
                            {results.severity_level.toUpperCase()}
                          </span>
                        </div>
                        
                        {results.pathogen_detected ? (
                          <>
                            <div className={`font-display font-extrabold text-base ${getSeverityStyles(results.severity_level).text} ${getSeverityStyles(results.severity_level).glow}`}>
                              {results.pathogen_detected}
                            </div>
                            <div className="text-[10px] text-white/50 italic leading-relaxed">
                              Cas13a reporter cleavage triggered. Pathogen matched references.
                            </div>
                          </>
                        ) : (
                          <div className="font-display font-extrabold text-base text-neon-green neon-glow-green">
                            NO PATHO-GENOMIC TARGET MATCHED
                          </div>
                        )}
                      </div>

                      {/* Stats List */}
                      <div className="divide-y divide-white/5 text-xs tech-mono space-y-3 pb-6">
                        <div className="flex justify-between pt-3">
                          <span className="text-white/40">MATCH ALIGNMENT</span>
                          <span className="text-neon-cyan font-bold">{results.alignment_score}%</span>
                        </div>
                        <div className="flex justify-between pt-3">
                          <span className="text-white/40">CAS ENZYME CLEAVAGE</span>
                          <span className={results.cas_collateral_cleavage_active ? 'text-neon-pink font-bold' : 'text-white/30'}>
                            {results.cas_collateral_cleavage_active ? 'ACTIVE CLEAVING' : 'INACTIVE'}
                          </span>
                        </div>
                        <div className="flex justify-between pt-3">
                          <span className="text-white/40">COMPLIANCE LEDGER</span>
                          <span className="text-neon-green font-bold">VERIFIED SPL MINT</span>
                        </div>
                        {results.simulated && (
                          <div className="flex justify-between pt-3 text-[9px]">
                            <span className="text-white/30">CALCULATION NODE</span>
                            <span className="text-neon-cyan/40">SIMULATED LOCAL FAILBACK</span>
                          </div>
                        )}
                      </div>

                      {/* Treatment Recommendation Card */}
                      <div className="bg-[#050810]/80 border border-white/5 rounded-xl p-4 text-[11px] tech-mono leading-relaxed relative">
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-cyan/40" />
                        <div className="text-neon-cyan font-bold mb-2">RECOMMENDED TREATMENT ACTION:</div>
                        <p className="text-white/70">
                          {results.recommended_treatment}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 border border-white/5 border-dashed rounded-xl bg-[#050810]/40"
                    >
                      <div className="text-4xl mb-4 opacity-40 animate-bounce">🧬</div>
                      <div className="tech-mono text-[10px] text-white/40 uppercase leading-relaxed tracking-wider">
                        Awaiting sequential diagnostic target inputs... Click alignment to amplify.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
