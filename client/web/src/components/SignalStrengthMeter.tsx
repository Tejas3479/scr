'use client'

import { useEffect, useState } from 'react'
import { ShieldIcon } from '@/components/GamingIcons'

interface SignalStrengthMeterProps {
  isOnline?: boolean
  className?: string
}

export default function SignalStrengthMeter({ isOnline = true, className = '' }: SignalStrengthMeterProps) {
  const [signal, setSignal] = useState(100)
  const [simulateFluctuation, setSimulateFluctuation] = useState(true)

  useEffect(() => {
    if (!simulateFluctuation) return

    const interval = setInterval(() => {
      setSignal((prev) => {
        const change = (Math.random() - 0.5) * 20
        const newSignal = Math.max(50, Math.min(100, prev + change))
        return newSignal
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [simulateFluctuation])

  const getSignalStatus = () => {
    if (!isOnline) return { status: 'OFFLINE', color: 'text-neon-orange', bars: 0 }
    if (signal >= 80) return { status: 'EXCELLENT', color: 'text-neon-green', bars: 4 }
    if (signal >= 60) return { status: 'GOOD', color: 'text-neon-cyan', bars: 3 }
    if (signal >= 40) return { status: 'FAIR', color: 'text-neon-orange', bars: 2 }
    return { status: 'WEAK', color: 'text-neon-pink', bars: 1 }
  }

  const { status, color, bars } = getSignalStatus()

  return (
    <div className={`glass-card p-4 space-y-3 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="tech-mono text-sm neon-glow-green uppercase tracking-wider">
          ╔═══════════════════╗<br />
          ║ SIGNAL STRENGTH ║<br />
          ╚═══════════════════╝
        </h3>
        <ShieldIcon className="w-5 h-5" color="cyan" animated={isOnline} />
      </div>

      {/* Signal Bars */}
      <div className="flex items-end justify-center gap-1 bg-cyber-dark/40 p-3 rounded border border-neon-green/20">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`transition-all duration-300 ${
              bar <= bars
                ? `${color} drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]`
                : 'bg-cyber-darker/60 border border-neon-green/10'
            }`}
            style={{
              width: '12px',
              height: `${bar * 12}px`,
              borderRadius: '2px',
            }}
          />
        ))}
      </div>

      {/* Status Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="tech-mono text-xs text-neon-cyan/70">STATUS:</span>
          <span className={`tech-mono text-sm font-bold ${color} drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]`}>
            {status}
          </span>
        </div>

        {/* Signal Percentage */}
        <div className="flex items-center justify-between">
          <span className="tech-mono text-xs text-neon-cyan/70">SIGNAL:</span>
          <span className="tech-mono text-sm neon-glow-green font-mono">{isOnline ? Math.round(signal) : 0}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-cyber-darker border border-neon-green/20 rounded overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              signal >= 80
                ? 'bg-gradient-to-r from-neon-green to-neon-cyan'
                : signal >= 60
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-orange'
                  : 'bg-gradient-to-r from-neon-orange to-neon-pink'
            } shadow-[0_0_10px_rgba(0,255,65,0.5)]`}
            style={{ width: `${isOnline ? signal : 0}%` }}
          />
        </div>
      </div>

      {/* Offline Mode Badge */}
      {!isOnline && (
        <div className="pt-2 border-t border-neon-orange/30">
          <div className="tech-mono text-xs text-neon-orange/80 text-center animate-data-pulse">
            ⚠ OFFLINE MODE ACTIVE
          </div>
          <div className="tech-mono text-xs text-neon-orange/60 text-center mt-1">
            Sync pending: changes will sync when connection restored
          </div>
        </div>
      )}

      {/* Connection Info */}
      {isOnline && (
        <div className="pt-2 border-t border-neon-cyan/20">
          <div className="tech-mono text-xs text-neon-cyan/60 text-center">
            ★ CONNECTION: ACTIVE ★
          </div>
        </div>
      )}
    </div>
  )
}
