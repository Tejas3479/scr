'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import { playSound } from '@/services/sound'
import { Scale, CheckCircle, AlertTriangle, FileText, Download, Fingerprint, ArrowLeft } from 'lucide-react'

interface ComplianceProtocol {
  id: string
  name: string
  region: string
  status: 'compliant' | 'warning' | 'audit-required'
  progress: number
  description: string
}

export default function CompliancePage() {
  const [protocols] = useState<ComplianceProtocol[]>([
    {
      id: 'EU-CAP-2026',
      name: 'EU Common Agricultural Policy (CAP)',
      region: 'Europe',
      status: 'compliant',
      progress: 94,
      description: 'Verifies active organic pesticide ratios, carbon capture soil thresholds, and ecological area ratios.'
    },
    {
      id: 'US-FB-2026',
      name: 'US Farm Bill (Title II - Conservation)',
      region: 'United States',
      status: 'compliant',
      progress: 88,
      description: 'Enforces soil erosion prevention guidelines and water conservation flow metrics.'
    },
    {
      id: 'IN-PK-2026',
      name: 'PM-KISAN Solarpunk Protocol',
      region: 'India',
      status: 'warning',
      progress: 68,
      description: 'Tracks micro-irrigation compliance and verified organic farming practices to release localized incentives.'
    }
  ])

  return (
    <div className="min-h-screen bg-[#050810] text-white relative overflow-hidden selection:bg-neon-cyan selection:text-[#050810]">
      {/* Cyber Grid & Scanline Background Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:100%_30px] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:30px_100%] z-0" />

      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[5%] w-[35vw] h-[35vw] bg-neon-cyan/4 rounded-full filter blur-[120px] animate-blob" />
          <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-neon-green/4 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
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
              ⚖ Multi-Jurisdiction Compliance Center
            </h1>
            <p className="text-neon-cyan/60 tech-mono text-xs mt-2">
              ACTIVE ALIGNMENT VERIFIER WITH LOCAL AND JURISDICTIONAL AGRICULTURE ACTS
            </p>
          </div>
          
          <div className="bg-neon-green/10 border border-neon-green/50 text-neon-green px-4 py-2 rounded-xl text-xs tech-mono font-bold flex items-center gap-2 animate-pulse shadow-[0_0_15px_rgba(0,255,65,0.15)]">
            <CheckCircle className="w-4 h-4 text-neon-green" />
            GLOBAL AUDIT STATUS: COMPLIANT
          </div>
        </div>

        {/* Compliance Dials / Scoreboards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {protocols.map((p) => (
            <div
              key={p.id}
              onMouseEnter={playSound.hover}
              className={`glass-hud p-6 border rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[250px] transition-all hover:scale-[1.02] ${
                p.status === 'warning' 
                  ? 'border-neon-orange/40 hover:border-neon-orange/70 hover:shadow-[0_0_20px_rgba(255,107,0,0.1)]' 
                  : 'border-neon-cyan/30 hover:border-neon-cyan/70 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]'
              }`}
            >
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-current opacity-45" style={{ color: p.status === 'warning' ? '#FF6B00' : '#00F0FF' }} />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[9px] tech-mono text-white/40 uppercase tracking-wider">{p.region} REGULATION</span>
                  <span className={`tech-mono text-[9px] font-bold px-2 py-0.5 rounded border ${
                    p.status === 'compliant' ? 'text-neon-green border-neon-green/30 bg-neon-green/15' : 'text-neon-orange border-neon-orange/30 bg-neon-orange/15'
                  }`}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                
                <h3 className="font-display font-bold text-base mb-2 text-white leading-snug">{p.name}</h3>
                <p className="text-xs text-white/60 leading-relaxed font-sans mb-4">{p.description}</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 tech-mono text-[10px]">
                  <span className="text-white/40">Compliance Progress:</span>
                  <span className={p.status === 'warning' ? 'text-neon-orange font-bold' : 'text-neon-cyan font-bold'}>
                    {p.progress}%
                  </span>
                </div>
                <div className="w-full bg-[#050810]/70 h-2.5 rounded-full overflow-hidden border border-white/5 relative">
                  <div
                    className={`h-full rounded-full ${p.status === 'warning' ? 'bg-neon-orange' : 'bg-neon-cyan'}`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Logs Table */}
        <div className="glass-hud p-8 border-neon-cyan/30 rounded-3xl relative overflow-hidden shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-cyan" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-cyan" />

          <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
            <h2 className="tech-mono text-sm font-bold text-neon-cyan uppercase tracking-widest flex items-center gap-2">
              <Scale className="w-4 h-4 text-neon-cyan animate-pulse" />
              ECOLOGICAL JURISDICTIONAL COMPLIANCE LOGS
            </h2>
            <button 
              onMouseEnter={playSound.hover}
              onClick={() => {
                playSound.success();
              }}
              className="bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-[#050810] px-4 py-2.5 rounded-xl text-xs tech-mono font-bold flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5" />
              DOWNLOAD EXPORT RECEIPT
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs tech-mono">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-[10px] tracking-wider">
                  <th className="pb-3 uppercase">CRITERIA IDENTIFIER</th>
                  <th className="pb-3 uppercase">POLICY GUIDELINE</th>
                  <th className="pb-3 uppercase">ON-FARM VALUE</th>
                  <th className="pb-3 uppercase">THRESHOLD VALUE</th>
                  <th className="pb-3 uppercase">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr 
                  onMouseEnter={playSound.hover}
                  className="hover:bg-neon-cyan/5 transition-all group"
                >
                  <td className="py-4 text-neon-cyan font-bold pl-2">SOIL-ROTATION-X9</td>
                  <td className="py-4 text-white/80">Crop Rotation diversity vector</td>
                  <td className="py-4 text-neon-green">5 crops/year</td>
                  <td className="py-4 text-white/50">&gt; 3 crops/year</td>
                  <td className="py-4 text-neon-green font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> SECURE</td>
                </tr>
                <tr 
                  onMouseEnter={playSound.hover}
                  className="hover:bg-neon-cyan/5 transition-all group"
                >
                  <td className="py-4 text-neon-cyan font-bold pl-2">PEST-RATIO-B3</td>
                  <td className="py-4 text-white/80">Bio-pesticide organic utilization</td>
                  <td className="py-4 text-neon-green">94.2% organic</td>
                  <td className="py-4 text-white/50">&gt; 90% organic</td>
                  <td className="py-4 text-neon-green font-bold flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> SECURE</td>
                </tr>
                <tr 
                  onMouseEnter={playSound.hover}
                  className="hover:bg-neon-cyan/5 transition-all group"
                >
                  <td className="py-4 text-neon-cyan font-bold pl-2">FLOW-CONSERVE-W7</td>
                  <td className="py-4 text-white/80">Irrigation water flow index</td>
                  <td className="py-4 text-neon-orange">1.4m³/hr max</td>
                  <td className="py-4 text-white/50">&lt; 1.2m³/hr target</td>
                  <td className="py-4 text-neon-orange font-bold flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 animate-pulse" /> RE-ROUTE FLOW</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Audit Verification Stamp */}
          <div className="mt-8 border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] tech-mono text-white/40">
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-4 h-4 text-neon-purple animate-pulse" />
              CRYPTOGRAPHIC DILITHIUM RECEIPT: 0x8a927dff00021cbf3a8f
            </span>
            <span>VERIFIED ON-CHAIN AT 2026-05-29T22:38:20+05:30</span>
          </div>
        </div>
      </main>
    </div>
  )
}
