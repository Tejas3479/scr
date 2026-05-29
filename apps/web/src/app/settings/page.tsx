'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import { Sliders, Cpu, ShieldAlert, Wifi, CheckCircle, Save } from 'lucide-react'

export default function SettingsPage() {
  const [sovereignMode, setSovereignMode] = useState<'encrypted' | 'local' | 'ledger'>('local')
  const [bciThreshold, setBciThreshold] = useState<number>(75)
  const [hrvAlert, setHrvAlert] = useState<boolean>(true)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [devices] = useState([
    { name: 'STM32 Soil Moisture Node Alpha', type: 'LoRaWAN Edge', status: 'connected', signal: 'Good' },
    { name: 'MQTT Mosquitto Gateway Node', type: 'Bridge Router', status: 'connected', signal: 'Excellent' },
    { name: 'ROS2 Drone Octocopter Vector', type: 'Robotic Fleet', status: 'standby', signal: 'N/A' }
  ])

  const handleSave = () => {
    setLoading(true)
    setSaved(false)
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-cyber-darker text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[15%] right-[10%] w-[35vw] h-[35vw] bg-neon-cyan/5 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-[10%] left-[5%] w-[30vw] h-[30vw] bg-neon-purple/5 rounded-full filter blur-[120px]" />
        </div>

        {/* Back Link */}
        <div className="mb-6">
          <Link href="/dashboard" className="tech-mono text-xs text-neon-cyan hover:text-neon-green transition-colors flex items-center gap-2">
            ◀ BACK TO COMMAND DECK
          </Link>
        </div>

        {/* Title */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/15 pb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent tracking-wider">
              ⚙ Sovereign Settings & Hardware HUD
            </h1>
            <p className="text-neon-cyan/60 tech-mono text-xs mt-2">
              BCI/EEG CHANNELS CALIBRATION & LOCAL EDGE DEVICE REGISTRY
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-neon-cyan hover:bg-neon-green text-cyber-dark font-tech font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'SAVING SYNC...' : 'SAVE ENCLAVE SYNC'}
          </button>
        </div>

        {/* Saved Alert Banner */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-neon-green/10 border border-neon-green/50 text-neon-green text-xs tech-mono p-4 rounded-xl mb-6 flex items-center gap-2 animate-pulse justify-center"
            >
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>SETTINGS SECURELY SYNCED TO THE LOCAL INTEL TDX ENCLAVE!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sovereign Sharing & BCI Dials */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass-hud p-6 border-neon-cyan/30 rounded-3xl relative overflow-hidden">
              <h2 className="tech-mono text-sm font-bold text-neon-cyan mb-6 uppercase tracking-widest flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Sovereign Data Share Thresholds
              </h2>

              {/* Share Selector */}
              <div className="mb-8">
                <label className="text-xs tech-mono text-neon-cyan/60 block mb-3">DATA SOVEREIGNTY MODE</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['encrypted', 'local', 'ledger'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSovereignMode(mode)}
                      className={`p-3.5 rounded-xl border text-xs tech-mono transition-all text-center capitalize ${
                        sovereignMode === mode
                          ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'border-white/10 bg-cyber-dark/60 text-white/70 hover:border-white/20'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-white/40 mt-2 tech-mono">
                  {sovereignMode === 'encrypted' && 'ENCRYPTED VAULT: All telemetry data is locally sealed and fully encrypted under Dilithium keys.'}
                  {sovereignMode === 'local' && 'LOCAL AGENT: Data is processed inside your local node for offline GraphRAG queries.'}
                  {sovereignMode === 'ledger' && 'PUBLIC LEDGER: Environmental summaries are anchored on the Solana carbon credits Spl-ledger.'}
                </div>
              </div>

              {/* BCI EEG Channels */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2 tech-mono text-xs">
                  <span className="text-neon-cyan/60">EEG COGNITIVE LIMIT (ATTENTION INTERRUPT)</span>
                  <span className="text-neon-purple font-bold">{bciThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={bciThreshold}
                  onChange={(e) => setBciThreshold(parseInt(e.target.value))}
                  className="w-full accent-neon-purple cursor-pointer bg-white/15 h-2 rounded-lg"
                />
                <p className="text-[10px] text-white/40 mt-1 tech-mono">
                  Configures the attention score threshold at which safety overrides reduce automated drone flight velocities.
                </p>
              </div>

              {/* HRV Alerts */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div className="tech-mono text-xs">
                  <span className="text-white/90 font-bold block mb-1">Optical HRV Video Pulse Filter</span>
                  <span className="text-white/40 text-[10px]">
                    Track cardiovascular variances to verify operator stress factors.
                  </span>
                </div>
                <button
                  onClick={() => setHrvAlert(prev => !prev)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${
                    hrvAlert ? 'bg-neon-green' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-cyber-dark transition-all ${
                      hrvAlert ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Active Devices Registry */}
          <div className="glass-hud p-6 border-neon-purple/30 rounded-2xl relative overflow-hidden">
            <h2 className="tech-mono text-sm font-bold text-neon-purple mb-6 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Active Hardware Nodes
            </h2>

            <div className="space-y-4">
              {devices.map((device, idx) => (
                <div key={idx} className="bg-cyber-dark border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between items-center tech-mono text-[10px]">
                    <span className="text-neon-cyan font-bold">{device.name}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase flex items-center gap-1 ${
                      device.status === 'connected' ? 'text-neon-green border-neon-green/30 bg-neon-green/10' : 'text-neon-orange border-neon-orange/30 bg-neon-orange/10'
                    }`}>
                      <Wifi className="w-3 h-3 animate-pulse" />
                      {device.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center tech-mono text-xs pt-1 border-t border-white/5 text-white/50">
                    <span>Node Type: {device.type}</span>
                    {device.signal !== 'N/A' && <span className="text-neon-green">Signal: {device.signal}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
