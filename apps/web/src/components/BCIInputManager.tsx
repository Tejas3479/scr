'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Wifi, Eye, RefreshCw, Radio, Play, Pause } from 'lucide-react'

export default function BCIInputManager({ onStateChange }: { onStateChange?: (state: { stress: number; attention: number }) => void }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)
  
  // Cognitive States
  const [attention, setAttention] = useState(55)
  const [stress, setStress] = useState(30)
  const [cognitiveLoad, setCognitiveLoad] = useState(40)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isSimulating, setIsSimulating] = useState(true)

  // Simulation parameters for brain waves
  const waveParams = {
    alpha: { freq: 10, amp: 15, color: '#00F0FF' }, // Relaxed Focus
    beta: { freq: 20, amp: 8, color: '#FF00FF' },   // Active Attention
    theta: { freq: 6, amp: 20, color: '#00FF41' }    // Deep Processing
  }

  // Handle Web Bluetooth Pairing simulation
  const connectHeadset = async () => {
    setConnecting(true)
    setTimeout(() => {
      setConnected(true)
      setConnecting(false)
    }, 2000)
  }

  const disconnectHeadset = () => {
    setConnected(false)
    setActiveCommand(null)
  }

  // Draw EEG Waves onto HTML Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const render = () => {
      time += 0.05
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Background grid lines (futuristic oscilloscope style)
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)'
      ctx.lineWidth = 1
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.beginPath()
        ctx.moveTo(0, j)
        ctx.lineTo(canvas.width, j)
        ctx.stroke()
      }

      if (connected || isSimulating) {
        // Draw waves
        Object.entries(waveParams).forEach(([name, wave]) => {
          ctx.beginPath()
          ctx.strokeStyle = wave.color
          ctx.lineWidth = 1.5
          ctx.shadowBlur = 4
          ctx.shadowColor = wave.color

          for (let x = 0; x < canvas.width; x++) {
            // Complex wave generation incorporating multiple harmonics
            const y = canvas.height / 2 + 
              Math.sin(x * 0.05 * wave.freq + time) * wave.amp * (connected ? (1 + attention * 0.005) : 1) + 
              Math.cos(x * 0.02 * (wave.freq / 2) - time) * (wave.amp * 0.3)
            
            if (x === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.stroke()
          ctx.shadowBlur = 0 // Reset
        })

        // Dynamically adjust parameters slowly
        if (Math.random() > 0.95) {
          setAttention(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 11) - 5)))
          setStress(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 9) - 4)))
          setCognitiveLoad(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 7) - 3)))
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [connected, isSimulating, attention])

  // Propagate state changes upwards to Generative UI style controller
  useEffect(() => {
    if (onStateChange && (connected || isSimulating)) {
      onStateChange({ stress, attention })
    }
  }, [stress, attention, connected, isSimulating, onStateChange])

  // Dispatch mock Neural Commands (e.g. focus spike, blink)
  const dispatchCommand = (command: string) => {
    setActiveCommand(command)
    setTimeout(() => {
      setActiveCommand(null)
    }, 2000)
  }

  return (
    <div className="bg-cyber-dark/40 border border-neon-cyan/20 rounded-2xl p-6 glass-panel relative overflow-hidden hover:border-neon-cyan/50 transition-all duration-300">
      
      {/* Background neon pulse aura */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full filter blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent tech-mono flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-cyan animate-pulse" />
            Neural BCI Command Deck
          </h3>
          <p className="text-emerald-300/60 text-xs font-sans mt-0.5">Hands-free biosensor machine override</p>
        </div>

        <button
          onClick={connected ? disconnectHeadset : connectHeadset}
          disabled={connecting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tech-mono border transition-all ${
            connected
              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
              : connecting
              ? 'bg-slate-800 border-neon-cyan/20 text-neon-cyan/50 cursor-not-allowed'
              : 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/20 hover:border-neon-cyan/60 shadow-lg shadow-neon-cyan/10'
          }`}
        >
          {connecting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              PAIRING...
            </>
          ) : connected ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              DISCONNECT
            </>
          ) : (
            <>
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              CONNECT HEADSET
            </>
          )}
        </button>
      </div>

      {/* Oscillosope Oscillating Waveform Canvas */}
      <div className="relative border border-neon-cyan/10 rounded-xl overflow-hidden bg-cyber-darker/60 mb-6">
        <canvas ref={canvasRef} width={600} height={120} className="w-full block" />
        
        {/* Status Indicators */}
        <div className="absolute top-2 left-2 flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${connected ? 'bg-neon-cyan' : 'bg-neon-purple'}`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? 'bg-neon-cyan' : 'bg-neon-purple'}`} />
          </span>
          <span className="text-[10px] text-emerald-300/70 tech-mono uppercase">
            {connected ? 'Real-Time EEG Feed Active' : 'Simulating Local Signal'}
          </span>
        </div>
      </div>

      {/* Grid: Cognitive Readout HUDs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Attention */}
        <div className="bg-slate-900/30 border border-neon-cyan/20 rounded-xl p-4 tech-mono relative">
          <p className="text-neon-cyan/70 text-xs font-semibold mb-1 flex items-center gap-1">
            <Play className="w-3.5 h-3.5 fill-neon-cyan" /> Focus Attention
          </p>
          <p className="text-3xl font-bold text-neon-cyan">{attention}%</p>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-neon-cyan h-full transition-all duration-500" style={{ width: `${attention}%` }} />
          </div>
        </div>

        {/* Cognitive Load */}
        <div className="bg-slate-900/30 border border-neon-purple/20 rounded-xl p-4 tech-mono relative">
          <p className="text-neon-purple/70 text-xs font-semibold mb-1 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Neural Workload
          </p>
          <p className="text-3xl font-bold text-neon-purple">{cognitiveLoad}%</p>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-neon-purple h-full transition-all duration-500" style={{ width: `${cognitiveLoad}%` }} />
          </div>
        </div>

        {/* Stress */}
        <div className="bg-slate-900/30 border border-neon-green/20 rounded-xl p-4 tech-mono relative">
          <p className="text-neon-green/70 text-xs font-semibold mb-1 flex items-center gap-1">
            <Pause className="w-3.5 h-3.5 fill-neon-green" /> Stress Index
          </p>
          <p className="text-3xl font-bold text-neon-green">{stress}%</p>
          <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-neon-green h-full transition-all duration-500" style={{ width: `${stress}%` }} />
          </div>
        </div>
      </div>

      {/* Action Deck: Motor Command triggers */}
      <div className="border-t border-neon-cyan/10 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-emerald-300 text-xs font-bold tech-mono">NEURAL MOTOR COMMAND OVERRIDE KEYS</h4>
          <p className="text-emerald-300/40 text-[10px] font-sans">Focus mind on focused imagery to activate</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => dispatchCommand('Spike Attention')}
            className="flex-1 md:flex-initial px-4 py-2 text-[10px] tech-mono border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 rounded-xl transition-all"
          >
            🧠 FOCUS SPIKE
          </button>
          <button
            onClick={() => dispatchCommand('Blink Confirm')}
            className="flex-1 md:flex-initial px-4 py-2 text-[10px] tech-mono border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 rounded-xl transition-all"
          >
            👁️ DOUBLE BLINK
          </button>
        </div>
      </div>

      {/* Command Notification Banner */}
      <AnimatePresence>
        {activeCommand && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-cyber-darker/95 z-20 flex items-center justify-center border border-neon-cyan/40 rounded-2xl"
          >
            <div className="text-center">
              <Zap className="w-12 h-12 text-neon-cyan animate-bounce mx-auto mb-2" />
              <h3 className="text-neon-cyan font-bold tech-mono text-lg uppercase tracking-widest">Neural Command Dispatched!</h3>
              <p className="text-emerald-300/80 text-sm mt-1 tech-mono">Action: {activeCommand}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
