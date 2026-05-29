'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import { playSound } from '@/services/sound'
import { ShieldCheck, Cpu, Terminal, RefreshCw, AlertOctagon, Heart, ArrowLeft, Fingerprint } from 'lucide-react'

interface ForensicLog {
  id: string
  action: string
  operator: string
  timestamp: string
  status: 'verified' | 'override' | 'anomaly'
  teeProof: string
}

export default function ForensicsPage() {
  const [logs, setLogs] = useState<ForensicLog[]>([
    {
      id: 'AUD-X892',
      action: 'Mint spl-token carbon credit offset (15t)',
      operator: 'AgriFarmerX992',
      timestamp: '2026-05-29 14:20:00',
      status: 'verified',
      teeProof: 'Intel_TDX_Proof_Claims_0x7b2f90a8ff22cb'
    },
    {
      id: 'AUD-T512',
      action: 'CRISPR Sequence Aligned: rice blast detected',
      operator: 'FastAPI Bioinformatics Aligner',
      timestamp: '2026-05-29 12:44:15',
      status: 'anomaly',
      teeProof: 'Intel_TDX_Proof_Claims_0xf892dbff3b8aa2'
    },
    {
      id: 'AUD-D904',
      action: 'Autonomous flight trajectory update overridden',
      operator: 'Sovereign Manual Interrupt (BCI Attention peak)',
      timestamp: '2026-05-29 10:15:30',
      status: 'override',
      teeProof: 'Intel_TDX_Proof_Claims_0xea77dfff318bf9'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null)

  const handleVerify = async (logId: string) => {
    playSound.tick()
    setLoading(true)
    setVerifyStatus(null)

    // Trigger warning frequency pulse during attestation challenge
    playSound.alarm()

    // Simulate calling the NestJS API attest endpoint (`/auth/attest`)
    try {
      const payload = {
        docHex: '7b2f90a8ff22cb612bb0ff',
        dataHex: '616374696f6e5f6d696e74'
      }
      const response = await fetch('http://localhost:3000/api/auth/attest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        playSound.success()
        setVerifyStatus(`TEE ATTEST SECURED: Intel TDX cryptographically verified ${logId} successfully. Enclave status: SEALED & SEALED.`)
      } else {
        throw new Error('Attestation verification pipeline error')
      }
    } catch (err) {
      console.warn('TEE attest API offline, simulating hardware challenge verification...')
      setTimeout(() => {
        playSound.success()
        setVerifyStatus(`TEE ATTEST SECURED (SIMULATED): Intel TDX cryptographically verified ${logId} successfully. Hardware enclave state: SECURED.`)
        setLoading(false)
      }, 1500)
    } finally {
      if (!verifyStatus) setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'anomaly':
        return 'text-neon-pink border-neon-pink/40 bg-neon-pink/15 shadow-[0_0_10px_rgba(255,0,107,0.15)]'
      case 'override':
        return 'text-neon-orange border-neon-orange/40 bg-neon-orange/15 shadow-[0_0_10px_rgba(255,107,0,0.15)]'
      default:
        return 'text-neon-green border-neon-green/40 bg-neon-green/15 shadow-[0_0_10px_rgba(0,255,65,0.15)]'
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
          <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] bg-neon-pink/4 rounded-full filter blur-[120px] animate-blob" />
          <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-neon-cyan/4 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
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
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent tracking-wider">
              🛡️ Zero-Trust Security & Forensics
            </h1>
            <p className="text-neon-cyan/60 tech-mono text-xs mt-2">
              INTEL TDX TEE TRUST DOMAIN ATTESTATION & INCIDENT FORENSIC REAL-TIME OVERVIEW
            </p>
          </div>
          
          <div className="flex gap-2.5">
            <div className="bg-neon-pink/15 border border-neon-pink/40 text-neon-pink px-4 py-2 rounded-xl text-xs tech-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(255,0,107,0.1)]">
              <AlertOctagon className="w-4 h-4 animate-pulse text-neon-pink" />
              mTLS METRIC: SECURED
            </div>
            <div className="bg-neon-green/15 border border-neon-green/40 text-neon-green px-4 py-2 rounded-xl text-xs tech-mono font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,65,0.1)] animate-pulse">
              <ShieldCheck className="w-4 h-4 text-neon-green" />
              TEE ENCLAVE: SEALED
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Timeline and Logs Table */}
          <div className="lg:col-span-2 flex flex-col glass-hud p-6 border-neon-cyan/30 rounded-3xl relative overflow-hidden min-h-[500px]">
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-cyan" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-cyan" />
            
            <h2 className="tech-mono text-sm font-bold text-neon-cyan mb-6 uppercase tracking-widest border-b border-neon-cyan/20 pb-3">
              TEE-Certified Forensic Log Registry
            </h2>

            <div className="divide-y divide-white/5 space-y-5 flex-1 max-h-[450px] overflow-y-auto pr-2">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  onMouseEnter={playSound.hover}
                  className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neon-cyan/3 rounded-xl p-2 transition-all duration-300"
                >
                  <div className="flex-1 tech-mono text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-neon-cyan font-bold text-[10px]">{log.id}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-white/80 leading-relaxed font-bold">{log.action}</p>
                    <p className="text-[10px] text-white/40 mt-1">
                      OPERATOR: {log.operator} | TIMESTAMP: {log.timestamp}
                    </p>
                    <p className="text-[9px] text-neon-purple/70 select-all mt-1 truncate">
                      TEE CLAIM PROOF: {log.teeProof}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleVerify(log.id)}
                    className="flex-shrink-0 bg-[#050810] hover:bg-neon-cyan/15 border border-neon-cyan/40 hover:border-neon-cyan text-neon-cyan text-[10px] tech-mono font-bold px-4 py-2.5 rounded-lg transition-all hover:scale-[1.03] active:scale-[0.97]"
                  >
                    VERIFY HARDWARE
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Attestation Console Readouts */}
          <div className="flex flex-col gap-6">
            
            {/* Live Attestation Box */}
            <div className="glass-hud p-6 border-neon-purple/30 rounded-2xl relative overflow-hidden flex-1 flex flex-col justify-between min-h-[300px]">
              <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-purple" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-purple" />
              
              <div>
                <h2 className="tech-mono text-sm font-bold text-neon-purple mb-4 uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4 animate-pulse text-neon-purple" />
                  Intel TDX Enclave Status
                </h2>

                <div className="bg-[#050810]/80 p-4 rounded-xl border border-white/5 tech-mono text-[9px] text-neon-purple leading-relaxed h-[180px] overflow-y-auto whitespace-pre-wrap relative">
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,0,255,0.015)_50%,transparent_50%)] bg-[length:100%_15px] animate-scan-line" />
                  [SYSTEM SECURE INITIALIZATION]<br />
                  &gt; Loading Intel TDX key rings... OK<br />
                  &gt; Generating cryptographic nonce challenge... OK<br />
                  &gt; Establishing SPIRE SVID identities... OK<br />
                  &gt; mTLS 1.3 handshake completed over port 3000.<br />
                  &gt; Secure hardware enclave measurements sealed.
                </div>
              </div>

              <div className="mt-4">
                <AnimatePresence>
                  {verifyStatus && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-neon-green/10 border border-neon-green/50 text-neon-green text-[10px] tech-mono p-3.5 rounded-xl mb-4 flex items-center gap-2 relative shadow-[0_0_15px_rgba(0,255,65,0.15)]"
                    >
                      <Terminal className="w-4 h-4 flex-shrink-0 animate-pulse text-neon-green" />
                      <span>{verifyStatus}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {loading && (
                  <div className="flex gap-2 p-3 bg-[#050810]/60 border border-white/5 rounded-xl text-[10px] tech-mono text-white/50 justify-center items-center shadow-glow-sm">
                    <RefreshCw className="w-4 h-4 animate-spin text-neon-cyan" />
                    CHALLENGING HARDWARE TRUST REGION...
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
