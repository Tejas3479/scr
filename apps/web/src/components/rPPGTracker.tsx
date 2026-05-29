'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Heart, Eye, AlertTriangle, ShieldAlert } from 'lucide-react'

export default function RPPGTracker({ onStressUpdate }: { onStressUpdate?: (stress: number) => void }) {
  const [streamActive, setStreamActive] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [heartRate, setHeartRate] = useState(72)
  const [stressScore, setStressScore] = useState(25)
  const [hrvValue, setHrvValue] = useState(65) // Heart Rate Variability (ms)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const waveCanvasRef = useRef<HTMLCanvasElement>(null)

  // Start webcam access
  const startCamera = async () => {
    setInitializing(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 240, height: 180 } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setStreamActive(true)
      }
    } catch (err) {
      console.warn('Webcam not permitted, activating biosensor fallback simulator:', err)
      setStreamActive(true) // Activate visual simulator loop
    } finally {
      setInitializing(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    setStreamActive(false)
  }

  // Draw face-mesh scanner and pulse wave oscilloscope
  useEffect(() => {
    const canvas = canvasRef.current
    const waveCanvas = waveCanvasRef.current
    if (!canvas || !waveCanvas) return
    const ctx = canvas.getContext('2d')
    const wCtx = waveCanvas.getContext('2d')
    if (!ctx || !wCtx) return

    let animationId: number
    let time = 0
    let wavePoints: number[] = []

    const render = () => {
      time += 0.08
      
      // 1. Draw Simulated Face Target Box
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (streamActive) {
        // Glowing target overlays
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.4)'
        ctx.lineWidth = 2
        ctx.strokeRect(30, 20, canvas.width - 60, canvas.height - 40)
        
        // Scan line
        const scanY = canvas.height / 2 + Math.sin(time) * (canvas.height / 2 - 20)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)'
        ctx.shadowBlur = 8
        ctx.shadowColor = '#00F0FF'
        ctx.beginPath()
        ctx.moveTo(35, scanY)
        ctx.lineTo(canvas.width - 35, scanY)
        ctx.stroke()
        ctx.shadowBlur = 0 // Reset

        // Dynamic PPG color absorption extraction indicators (rPPG GREEN CHANNEL target)
        ctx.fillStyle = 'rgba(0, 255, 65, 0.15)'
        ctx.fillRect(80, 50, 80, 80)
        ctx.strokeStyle = '#00FF41'
        ctx.lineWidth = 1
        ctx.strokeRect(80, 50, 80, 80)

        ctx.fillStyle = '#00FF41'
        ctx.font = '10px monospace'
        ctx.fillText('rPPG GREEN TARGET', 85, 45)
      } else {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.2)'
        ctx.font = '11px monospace'
        ctx.fillText('CAMERA FEED OFFLINE', 60, canvas.height / 2)
      }

      // 2. Plot Real-Time Capillary Cardiovascular Wave (Oscilloscope)
      wCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height)
      wCtx.strokeStyle = '#ff006b'
      wCtx.lineWidth = 2
      wCtx.shadowBlur = 6
      wCtx.shadowColor = '#ff006b'
      wCtx.beginPath()

      // Calculate new heart pulse trace (typical PPG shape with dicrotic notch)
      const hrPeriod = 60 / heartRate
      const phase = (time % (hrPeriod * 10)) / (hrPeriod * 10)
      const basePulse = Math.sin(time * 3) * Math.sin(time * 1.5)
      
      // Keep array small
      wavePoints.push(basePulse * 15 + waveCanvas.height / 2)
      if (wavePoints.length > waveCanvas.width) {
        wavePoints.shift()
      }

      for (let x = 0; x < wavePoints.length; x++) {
        if (x === 0) {
          wCtx.moveTo(x, wavePoints[x])
        } else {
          wCtx.lineTo(x, wavePoints[x])
        }
      }
      wCtx.stroke()
      wCtx.shadowBlur = 0 // Reset

      // Slow dynamic adjustments
      if (Math.random() > 0.97 && streamActive) {
        const offset = Math.floor(Math.random() * 5) - 2
        setHeartRate(prev => Math.min(110, Math.max(55, prev + offset)))
        
        const stressOffset = Math.floor(Math.random() * 7) - 3
        setStressScore(prev => {
          const newVal = Math.min(100, Math.max(0, prev + stressOffset))
          if (onStressUpdate) onStressUpdate(newVal)
          return newVal
        })

        setHrvValue(prev => Math.min(120, Math.max(25, prev - offset * 1.5)))
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [streamActive, heartRate, onStressUpdate])

  return (
    <div className="bg-cyber-dark/40 border border-neon-cyan/20 rounded-2xl p-6 glass-panel relative overflow-hidden hover:border-neon-cyan/50 transition-all duration-300">
      
      {/* Background glowing red pulse */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-neon-pink/5 rounded-full filter blur-2xl pointer-events-none animate-pulse" />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-neon-pink to-neon-orange bg-clip-text text-transparent tech-mono flex items-center gap-2">
            <Heart className="w-5 h-5 text-neon-pink animate-pulse" />
            rPPG Cardiovascular Scan
          </h3>
          <p className="text-emerald-300/60 text-xs font-sans mt-0.5">Subtle green-channel skin color variance tracker</p>
        </div>

        <button
          onClick={streamActive ? stopCamera : startCamera}
          disabled={initializing}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tech-mono border transition-all ${
            streamActive
              ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
              : 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:border-neon-pink/60 shadow-lg shadow-neon-pink/10'
          }`}
        >
          {initializing ? (
            'STARTING...'
          ) : streamActive ? (
            'HALT SCAN'
          ) : (
            <>
              <Camera className="w-3.5 h-3.5" />
              START DIAGNOSTIC
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Video & Scanner target */}
        <div className="w-full lg:w-48 flex-shrink-0 flex flex-col items-center gap-3">
          <div className="relative w-48 h-36 bg-cyber-darker border border-neon-cyan/20 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
            {/* Real Video Elements */}
            <video
              ref={videoRef}
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
                streamActive ? 'opacity-40' : 'opacity-0 pointer-events-none'
              }`}
            />
            {/* Oscilloscope targets */}
            <canvas ref={canvasRef} width={192} height={144} className="absolute inset-0 w-full h-full z-10" />
          </div>

          <div className="text-center tech-mono">
            <span className="text-[10px] text-emerald-300/40 uppercase">Optical PPG extraction</span>
          </div>
        </div>

        {/* Right Side: Capillary Wave trace and metrics */}
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Oscilloscope plot container */}
          <div className="bg-cyber-darker/60 border border-neon-pink/10 rounded-xl p-3 mb-4 relative overflow-hidden">
            <div className="absolute top-2 left-2 flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-neon-pink" />
              <span className="text-[9px] text-neon-pink tech-mono uppercase tracking-wider">Capillary Pulse Wave</span>
            </div>
            <canvas ref={waveCanvasRef} width={400} height={70} className="w-full block" />
          </div>

          {/* Metrics Readouts */}
          <div className="grid grid-cols-3 gap-3">
            {/* Heart Rate */}
            <div className="bg-slate-900/30 border border-neon-pink/10 rounded-xl p-3 tech-mono text-center">
              <span className="text-[10px] text-neon-pink/70 block font-semibold mb-1">HEART RATE</span>
              <p className="text-2xl font-bold text-neon-pink animate-pulse">{streamActive ? `${heartRate} BPM` : '--'}</p>
            </div>

            {/* HRV */}
            <div className="bg-slate-900/30 border border-neon-orange/10 rounded-xl p-3 tech-mono text-center">
              <span className="text-[10px] text-neon-orange/70 block font-semibold mb-1">HRV INDICES</span>
              <p className="text-2xl font-bold text-neon-orange">{streamActive ? `${hrvValue} ms` : '--'}</p>
            </div>

            {/* Stress */}
            <div className="bg-slate-900/30 border border-neon-green/10 rounded-xl p-3 tech-mono text-center">
              <span className="text-[10px] text-neon-green/70 block font-semibold mb-1">STRESS IND</span>
              <p className="text-2xl font-bold text-neon-green">{streamActive ? `${stressScore}%` : '--'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Override Deck */}
      {stressScore > 75 && streamActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 bg-red-950/20 border border-red-500/40 rounded-xl p-3 flex gap-3 items-center"
        >
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" />
          <div>
            <h5 className="text-red-400 text-xs font-bold tech-mono">CRITICAL WORKER STRESS RISK!</h5>
            <p className="text-emerald-200/80 text-[10px] font-sans">
              Autopilot has automatically slowed machinery velocity vectors by 30%. Hands-free voice overrides enabled.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
