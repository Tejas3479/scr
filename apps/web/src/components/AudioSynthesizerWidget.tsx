'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Music, Play, Square, Settings2, Sparkles, RefreshCw } from 'lucide-react'
import { playSound } from '@/services/sound'

export default function AudioSynthesizerWidget() {
  const [frequency, setFrequency] = useState(880)
  const [waveform, setWaveform] = useState<'sine' | 'triangle' | 'sawtooth' | 'square'>('sine')
  const [volume, setVolume] = useState(0.2) // range 0 to 1
  const [isDroneActive, setIsDroneActive] = useState(false)
  const [visualizerPhase, setVisualizerPhase] = useState(0)
  const [activeTrigger, setActiveTrigger] = useState<string | null>(null)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const droneNodesRef = useRef<{ oscillators: OscillatorNode[]; biquadFilter: BiquadFilterNode; gainNode: GainNode } | null>(null)
  const requestRef = useRef<number | null>(null)

  // 1. Get Web Audio Context
  const getContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioCtxRef.current
  }

  // 2. Animate the SVG Waveform Visualizer
  useEffect(() => {
    const animate = () => {
      setVisualizerPhase(prev => (prev + 0.15) % (Math.PI * 2))
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  // 3. Play Custom Test Frequency Blip
  const playCustomBlip = () => {
    const ctx = getContext()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.type = waveform
    osc.frequency.setValueAtTime(frequency, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(frequency / 3, ctx.currentTime + 0.15)

    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.17)

    triggerFlash('CUSTOM_BLIP')
  }

  // 4. Synthesize organic ambient Solar-Drone Loop
  const startDrone = () => {
    const ctx = getContext()
    if (!ctx) return
    if (ctx.state === 'suspended') ctx.resume()

    // Stop existing drone nodes
    stopDrone()

    const gainNode = ctx.createGain()
    const biquadFilter = ctx.createBiquadFilter()

    // Low-pass filter sweeps
    biquadFilter.type = 'lowpass'
    biquadFilter.frequency.setValueAtTime(120, ctx.currentTime)
    biquadFilter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 2)
    biquadFilter.Q.setValueAtTime(5, ctx.currentTime)

    // Base minor 9th / solarpunk arpeggio chord frequencies
    const baseFreqs = [220, 275, 330, 440] // A3, C#4, E4, A4 (lush organic major intervals)
    const oscillators = baseFreqs.map((freq, idx) => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      // Detune slightly for lush chorusing feel
      osc.frequency.setValueAtTime(freq + (idx - 1.5) * 1.5, ctx.currentTime)
      return osc
    })

    // Connect nodes
    oscillators.forEach(osc => osc.connect(biquadFilter))
    biquadFilter.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Fade in major chord drone
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(volume * 0.18, ctx.currentTime + 1.5)

    // Start oscillators
    oscillators.forEach(osc => osc.start())

    // Modulate biquad filter dynamically to simulate wind / crop waves
    const sweepLFO = ctx.createOscillator()
    const sweepLFOGain = ctx.createGain()
    sweepLFO.frequency.setValueAtTime(0.12, ctx.currentTime) // slow wave (0.12 Hz)
    sweepLFOGain.gain.setValueAtTime(300, ctx.currentTime) // filter sweep depth
    
    sweepLFO.connect(sweepLFOGain)
    sweepLFOGain.connect(biquadFilter.frequency)
    
    sweepLFO.start()

    droneNodesRef.current = {
      oscillators: [...oscillators, sweepLFO],
      biquadFilter,
      gainNode
    }
    setIsDroneActive(true)
  }

  const stopDrone = () => {
    if (droneNodesRef.current) {
      const { oscillators, gainNode } = droneNodesRef.current
      try {
        oscillators.forEach(osc => osc.stop())
      } catch (e) {}
      setIsDroneActive(false)
      droneNodesRef.current = null
    }
  }

  const toggleDrone = () => {
    playSound.tick()
    if (isDroneActive) {
      stopDrone()
    } else {
      startDrone()
    }
  }

  // Adjust drone volume dynamically
  useEffect(() => {
    if (droneNodesRef.current?.gainNode) {
      droneNodesRef.current.gainNode.gain.linearRampToValueAtTime(
        volume * 0.18,
        audioCtxRef.current?.currentTime || 0
      )
    }
  }, [volume])

  const triggerFlash = (label: string) => {
    setActiveTrigger(label)
    setTimeout(() => setActiveTrigger(null), 300)
  }

  // Trigger standard pre-synthesized cues
  const playStandardCue = (type: 'tick' | 'hover' | 'success' | 'alarm') => {
    triggerFlash(type.toUpperCase())
    if (type === 'tick') playSound.tick()
    if (type === 'hover') playSound.hover()
    if (type === 'success') playSound.success()
    if (type === 'alarm') playSound.alarm()
  }

  // Generate Visualizer Waveform String
  const generateWavePath = () => {
    let points = []
    const width = 280
    const height = 60
    const amplitude = isDroneActive ? 18 : 6
    const numPoints = 60

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * width
      const ratio = i / numPoints
      const envelope = Math.sin(ratio * Math.PI) // smooth fade-in at edges
      
      let y = height / 2
      if (waveform === 'sine') {
        y += Math.sin(ratio * (frequency / 80) + visualizerPhase) * amplitude * envelope
      } else if (waveform === 'triangle') {
        const trig = Math.abs((((ratio * (frequency / 80) + visualizerPhase) % (Math.PI * 2)) / Math.PI) - 1) * 2 - 1
        y += trig * amplitude * envelope
      } else if (waveform === 'sawtooth') {
        const saw = (((ratio * (frequency / 80) + visualizerPhase) % (Math.PI * 2)) / (Math.PI * 2)) * 2 - 1
        y += saw * amplitude * envelope
      } else if (waveform === 'square') {
        const sq = Math.sin(ratio * (frequency / 80) + visualizerPhase) >= 0 ? 1 : -1
        y += sq * amplitude * envelope
      }
      
      points.push(`${x},${y}`)
    }
    return `M ${points.join(' L ')}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDrone()
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  return (
    <div className="glass-hud p-6 border-neon-cyan/30 rounded-2xl relative overflow-hidden flex flex-col justify-between shadow-[0_4px_30px_rgba(0,240,255,0.08)]">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full filter blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-neon-cyan/20">
        <h3 className="text-xs font-bold tech-mono text-neon-cyan uppercase tracking-widest flex items-center gap-2">
          <Settings2 className="w-4 h-4 animate-pulse text-neon-cyan" />
          AUDIO SYNTHESIS MODULATOR
        </h3>
        <span className="text-[9px] tech-mono text-emerald-300/50 bg-[#050810]/60 px-2 py-0.5 rounded border border-neon-cyan/20 uppercase">
          OS v3.0 Native Sound
        </span>
      </div>

      {/* Waveform Drawing Visualizer */}
      <div className="bg-[#050810]/75 border border-neon-cyan/20 rounded-xl p-3 mb-5 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1.5 left-2 flex items-center gap-1.5 text-[8px] tech-mono text-neon-cyan/50">
          <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-ping" />
          OSCILLOSCOPE MESH MONITOR
        </div>

        <svg width="280" height="60" className="w-full max-w-[280px]">
          {/* Wave Path */}
          <path
            d={generateWavePath()}
            fill="none"
            stroke={waveform === 'sine' ? '#00F0FF' : waveform === 'triangle' ? '#FF00FF' : waveform === 'sawtooth' ? '#00FF41' : '#FF6B00'}
            strokeWidth="2"
            strokeLinecap="round"
            className="transition-all"
            filter="drop-shadow(0px 0px 8px currentColor)"
          />
        </svg>

        <span className="text-[9px] tech-mono text-neon-cyan/70 mt-1 uppercase">
          Wave: <span className="font-bold">{waveform}</span> @ {frequency}Hz
        </span>
      </div>

      {/* Sliders Container */}
      <div className="space-y-4 mb-5">
        {/* Oscillator Frequency */}
        <div>
          <div className="flex justify-between text-[10px] tech-mono text-neon-cyan/70 mb-1">
            <span>OSCILLATOR FREQUENCY</span>
            <span className="font-bold text-neon-cyan">{frequency} Hz</span>
          </div>
          <input
            type="range"
            min="220"
            max="1800"
            step="10"
            value={frequency}
            onChange={(e) => {
              setFrequency(parseInt(e.target.value))
              if (Math.random() > 0.8) playSound.tick()
            }}
            className="w-full accent-neon-cyan cursor-pointer bg-white/10 h-1 rounded-lg"
          />
        </div>

        {/* Master Gain Volume */}
        <div>
          <div className="flex justify-between text-[10px] tech-mono text-neon-cyan/70 mb-1">
            <span>SYNTH GAIN VOLUME</span>
            <span className="font-bold text-neon-cyan">{(volume * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-3">
            {volume === 0 ? <VolumeX className="w-4 h-4 text-white/30" /> : <Volume2 className="w-4 h-4 text-neon-cyan animate-pulse" />}
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-neon-cyan cursor-pointer bg-white/10 h-1 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Waveform Selector */}
      <div className="mb-5">
        <label className="text-[9px] tech-mono text-neon-cyan/50 block mb-2 uppercase tracking-wide">SELECT WAVEFORM ARCHITECTURE</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(['sine', 'triangle', 'sawtooth', 'square'] as const).map(w => (
            <button
              key={w}
              onClick={() => {
                playSound.tick()
                setWaveform(w)
              }}
              className={`text-[8px] tech-mono font-bold py-2 rounded-lg border uppercase transition-all ${
                waveform === w
                  ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Play Custom Pulse */}
        <button
          onClick={playCustomBlip}
          className="flex items-center justify-center gap-2 py-3 bg-[#050810]/70 border border-neon-cyan/30 hover:border-neon-cyan text-neon-cyan text-[10px] font-bold tech-mono uppercase rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          TEST PULSE
        </button>

        {/* Ambient Major Chord Drone Toggle */}
        <button
          onClick={toggleDrone}
          className={`flex items-center justify-center gap-2 py-3 border text-[10px] font-bold tech-mono uppercase rounded-xl transition-all hover:scale-[1.03] active:scale-[0.97] ${
            isDroneActive
              ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(255,0,255,0.25)]'
              : 'bg-[#050810]/70 border-neon-purple/30 hover:border-neon-purple text-neon-purple/80 hover:text-neon-purple'
          }`}
        >
          {isDroneActive ? <Square className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />}
          {isDroneActive ? 'STOP DRONE' : 'AMB-DRONE'}
        </button>
      </div>

      {/* Sound System Tester Rack */}
      <div className="border-t border-white/5 pt-4">
        <label className="text-[9px] tech-mono text-white/40 block mb-2 uppercase tracking-wide">Standard OS Cues Deck</label>
        <div className="grid grid-cols-4 gap-1.5">
          {(['tick', 'hover', 'success', 'alarm'] as const).map(c => (
            <button
              key={c}
              onClick={() => playStandardCue(c)}
              className={`py-2 rounded-lg border text-[8px] tech-mono font-bold uppercase transition-all flex flex-col items-center justify-center gap-1.5 ${
                activeTrigger === c.toUpperCase()
                  ? c === 'alarm'
                    ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-glow-sm'
                    : c === 'success'
                    ? 'bg-neon-green/20 border-neon-green text-neon-green shadow-glow-sm'
                    : 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-glow-sm'
                  : 'bg-cyber-dark border-white/5 text-white/40 hover:text-white/80 hover:border-white/10'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${
                c === 'alarm' ? 'bg-neon-pink' : c === 'success' ? 'bg-neon-green' : 'bg-neon-cyan'
              }`} />
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
