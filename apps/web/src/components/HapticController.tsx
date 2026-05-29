'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Eye, Wifi, Shield, RefreshCw } from 'lucide-react'
import { playSound } from '@/services/sound'

export default function HapticController() {
  const [overrideActive, setOverrideActive] = useState(false)
  const [feedbackForce, setFeedbackForce] = useState(0.0) // Force reflection (0.0 to 10.0 Newtons)
  const [latency, setLatency] = useState(12) // WebRTC latency in ms
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected')

  // Simulate haptic force feedback oscillations during machinery operations
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (overrideActive) {
      interval = setInterval(() => {
        // Reflect tactile variations when robotic arms hit soil or plant stems
        const simulatedForce = 2.5 + Math.sin(Date.now() / 300) * 1.5 + (Math.random() * 0.4)
        setFeedbackForce(Number(simulatedForce.toFixed(2)))
        setLatency(Math.floor(10 + Math.random() * 6))
      }, 200)
    } else {
      setFeedbackForce(0.0)
    }
    return () => clearInterval(interval)
  }, [overrideActive])

  const toggleOverride = () => {
    playSound.tick()
    if (!overrideActive) {
      playSound.alarm()
      setOverrideActive(true)
    } else {
      setOverrideActive(false)
    }
  }

  return (
    <div className="bg-cyber-dark/40 border border-neon-purple/20 rounded-2xl p-6 glass-panel relative overflow-hidden hover:border-neon-purple/50 transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/5 rounded-full filter blur-xl pointer-events-none" />
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neon-purple" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neon-purple" />

      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-sm font-bold tech-mono text-neon-purple uppercase tracking-widest flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-neon-purple animate-pulse" />
            Robotic Haptic Control Deck
          </h3>
          <p className="text-white/40 text-[9px] font-sans mt-0.5">Bilateral Force Feedback Teleoperation (ROS 2)</p>
        </div>

        <button
          onClick={toggleOverride}
          className={`px-3 py-1.5 rounded-lg text-[9px] tech-mono font-bold border transition-all ${
            overrideActive
              ? 'bg-neon-pink/15 border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(255,0,107,0.2)] animate-pulse'
              : 'bg-[#050810]/80 border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20'
          }`}
        >
          {overrideActive ? 'DISENGAGE OVERRIDE' : 'ENGAGE ROBOT OVERRIDE'}
        </button>
      </div>

      {/* Force Reflection HUD */}
      <div className="bg-[#050810]/75 border border-white/5 rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center text-[10px] tech-mono mb-2 text-white/50">
          <span>HAPTIC FORCE REFLECTION</span>
          <span className={overrideActive ? 'text-neon-cyan font-bold' : 'text-white/30'}>
            {overrideActive ? `${feedbackForce} N` : '0.0 N (IDLE)'}
          </span>
        </div>

        {/* Tactile feedback progress bar */}
        <div className="w-full bg-[#050810] h-2.5 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink rounded-full"
            style={{ width: `${overrideActive ? (feedbackForce / 10) * 100 : 0}%` }}
            animate={overrideActive ? { opacity: [0.7, 1, 0.7] } : {}}
            transition={{ repeat: Infinity, duration: 1.0 }}
          />
        </div>

        {/* Visualized Force Matrix Grid */}
        <div className="grid grid-cols-5 gap-1 mt-3">
          {Array.from({ length: 5 }).map((_, i) => {
            const isActive = overrideActive && (feedbackForce / 2) > i
            return (
              <div
                key={i}
                className={`h-1.5 rounded transition-all duration-300 ${
                  isActive
                    ? 'bg-neon-cyan shadow-[0_0_5px_rgba(0,240,255,0.4)]'
                    : 'bg-white/5 border border-white/5'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Teleoperation Metrics */}
      <div className="grid grid-cols-2 gap-3 text-[10px] tech-mono text-white/60">
        <div className="bg-[#050810]/60 p-3 rounded-lg border border-white/5 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-neon-green" /> LATENCY:</span>
          <span className="font-bold text-neon-green">{overrideActive ? `${latency} ms` : 'N/A'}</span>
        </div>

        <div className="bg-[#050810]/60 p-3 rounded-lg border border-white/5 flex items-center justify-between">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-neon-cyan" /> SECURITY:</span>
          <span className="font-bold text-neon-cyan">TLS 1.3 mTLS</span>
        </div>
      </div>
    </div>
  )
}
