'use client'

import React from 'react'

interface GamingIconProps {
  className?: string
  animated?: boolean
  color?: 'green' | 'cyan' | 'purple' | 'orange'
}

export const GamingIconBase = ({ className = '', animated = false }: GamingIconProps) => (
  <svg
    className={`${className} ${animated ? 'animate-data-pulse' : ''}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* SVG content varies by icon */}
  </svg>
)

export const LevelUpIcon = ({ className = '', animated = true, color = 'green' }: GamingIconProps) => {
  const colorClasses = {
    green: 'text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]',
    cyan: 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]',
    purple: 'text-neon-purple drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]',
    orange: 'text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.6)]',
  }
  
  return (
    <svg
      className={`${className} ${colorClasses[color]} ${animated ? 'animate-level-up' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

export const AchievementIcon = ({ className = '', animated = true, color = 'cyan' }: GamingIconProps) => {
  const colorClasses = {
    green: 'text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]',
    cyan: 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]',
    purple: 'text-neon-purple drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]',
    orange: 'text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.6)]',
  }

  return (
    <svg
      className={`${className} ${colorClasses[color]} ${animated ? 'animate-badge-bounce' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8 14 12 17 16 14" />
      <line x1="12" y1="17" x2="12" y2="23" />
      <line x1="9" y1="20" x2="15" y2="20" />
    </svg>
  )
}

export const SignalIcon = ({ className = '', strength = 100 }: { className?: string; strength?: number }) => {
  const bars = Math.ceil((strength / 100) * 4)
  
  return (
    <svg
      className={`${className} text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Signal strength bars */}
      {[1, 2, 3, 4].map((bar) => (
        <path
          key={bar}
          d={`M${bar * 4} ${24 - bar * 4} L${bar * 4} 24`}
          stroke={bar <= bars ? 'currentColor' : 'rgba(0, 255, 65, 0.2)'}
          strokeWidth="2"
          opacity={bar <= bars ? '1' : '0.3'}
        />
      ))}
    </svg>
  )
}

export const ScannerIcon = ({ className = '', animated = true }: { className?: string; animated?: boolean }) => (
  <svg
    className={`${className} text-neon-cyan ${animated ? 'animate-scan-line' : ''}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <line x1="6" y1="6" x2="18" y2="6" />
    <line x1="6" y1="12" x2="18" y2="12" />
    <line x1="6" y1="18" x2="18" y2="18" />
  </svg>
)

export const DataIcon = ({ className = '', animated = true }: { className?: string; animated?: boolean }) => (
  <svg
    className={`${className} text-neon-green ${animated ? 'animate-data-pulse' : ''}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

export const ShieldIcon = ({ className = '', animated = false, color = 'cyan' }: GamingIconProps) => {
  const colorClasses = {
    green: 'text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]',
    cyan: 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    purple: 'text-neon-purple drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]',
    orange: 'text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.5)]',
  }

  return (
    <svg
      className={`${className} ${colorClasses[color]} ${animated ? 'animate-glow-pulse' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export const TargetIcon = ({ className = '', animated = true, color = 'green' }: GamingIconProps) => {
  const colorClasses = {
    green: 'text-neon-green drop-shadow-[0_0_10px_rgba(0,255,65,0.6)]',
    cyan: 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]',
    purple: 'text-neon-purple drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]',
    orange: 'text-neon-orange drop-shadow-[0_0_10px_rgba(255,107,0,0.6)]',
  }

  return (
    <svg
      className={`${className} ${colorClasses[color]} ${animated ? 'animate-glow-pulse' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}
