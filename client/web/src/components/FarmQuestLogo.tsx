'use client'

import React, { useEffect, useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  interactive?: boolean
}

export default function FarmQuestLogo({ size = 'md', showLabel = false, interactive = true }: LogoProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 64
  }

  const svgSize = sizeMap[size]

  if (!mounted) {
    return <div style={{ width: svgSize, height: svgSize }} className="rounded-lg bg-emerald-600" />
  }

  return (
    <div className="flex items-center space-x-2">
      <style>{`
        @keyframes sproutGrow {
          0% { transform: scaleY(0); opacity: 0; transform-origin: bottom; }
          60% { transform: scaleY(1.1); opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes leafFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(2deg); }
        }

        @keyframes hexPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes levelGlow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(46, 204, 113, 0.4)); }
          50% { filter: drop-shadow(0 0 6px rgba(46, 204, 113, 0.8)); }
        }

        .farmquest-logo-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .farmquest-logo-wrapper:hover {
          filter: drop-shadow(0 0 10px rgba(46, 204, 113, 0.6));
        }

        .logo-svg {
          filter: drop-shadow(0 0 4px rgba(46, 204, 113, 0.3));
          transition: filter 0.3s ease;
        }

        .sprout-stem {
          animation: sproutGrow 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .sprout-leaf {
          animation: leafFloat 3s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .hex-ring {
          animation: hexPulse 2s ease-in-out infinite;
        }

        .level-badge {
          animation: levelGlow 2.5s ease-in-out infinite;
        }
      `}</style>

      <div className="farmquest-logo-wrapper" style={{ width: svgSize, height: svgSize }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg"
        >
          {/* Define Gradients */}
          <defs>
            {/* Main gradient for leaves */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2ecc71" />
              <stop offset="100%" stopColor="#27ae60" />
            </linearGradient>

            {/* Glow gradient */}
            <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2ecc71" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2ecc71" stopOpacity="0" />
            </radialGradient>

            {/* Stem gradient */}
            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2ecc71" />
              <stop offset="100%" stopColor="#229954" />
            </linearGradient>
          </defs>

          {/* Glow background */}
          <circle cx="32" cy="32" r="30" fill="url(#glowGrad)" />

          {/* Hexagonal frame */}
          <g className="hex-ring">
            <path
              d="M 32 8 L 48 16 L 48 32 L 32 40 L 16 32 L 16 16 Z"
              stroke="#2ecc71"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            />
          </g>

          {/* Central stem */}
          <g className="sprout-stem">
            <line
              x1="32"
              y1="40"
              x2="32"
              y2="24"
              stroke="url(#stemGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Stem nodes */}
            <circle cx="32" cy="32" r="1.5" fill="#2ecc71" opacity="0.6" />
            <circle cx="32" cy="28" r="1.5" fill="#2ecc71" opacity="0.6" />
          </g>

          {/* Left leaf */}
          <g className="sprout-leaf" style={{ transformOrigin: '32px 28px' }}>
            <path
              d="M 32 28 Q 22 24 20 18 Q 20 20 22 24 Q 26 28 32 28 Z"
              fill="url(#leafGrad)"
              opacity="0.9"
            />
            <line
              x1="32"
              y1="28"
              x2="20"
              y2="18"
              stroke="#27ae60"
              strokeWidth="0.8"
              opacity="0.5"
            />
          </g>

          {/* Right leaf */}
          <g className="sprout-leaf" style={{ transformOrigin: '32px 28px', animationDelay: '0.5s' }}>
            <path
              d="M 32 28 Q 42 24 44 18 Q 44 20 42 24 Q 38 28 32 28 Z"
              fill="url(#leafGrad)"
              opacity="0.9"
            />
            <line
              x1="32"
              y1="28"
              x2="44"
              y2="18"
              stroke="#27ae60"
              strokeWidth="0.8"
              opacity="0.5"
            />
          </g>

          {/* Top leaf accent */}
          <g className="sprout-leaf" style={{ animationDelay: '1s' }}>
            <path
              d="M 32 24 L 32 12 Q 30 16 32 20 Z"
              fill="#2ecc71"
              opacity="0.8"
            />
          </g>

          {/* Decorative soil particles */}
          <g opacity="0.5">
            <circle cx="16" cy="44" r="1" fill="#8B7355" />
            <circle cx="20" cy="46" r="0.8" fill="#8B7355" />
            <circle cx="48" cy="42" r="1.2" fill="#8B7355" />
            <circle cx="52" cy="44" r="0.9" fill="#8B7355" />
          </g>
        </svg>
      </div>

      {showLabel && (
        <div>
          <div className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
            FarmQuest
          </div>
          <div className="text-xs text-gray-500">Gamified Farming</div>
        </div>
      )}
    </div>
  )
}
