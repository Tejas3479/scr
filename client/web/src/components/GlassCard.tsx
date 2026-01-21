'use client'

import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface GlassCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'green' | 'cyan' | 'purple' | 'orange' | 'pink'
  interactive?: boolean
  variant?: 'default' | 'elevated' | 'panel'
}

/**
 * GlassCard Component
 * A reusable glassmorphism card component for the Cyber-Agri theme
 * Features:
 * - Backdrop blur: 10px (default) with configurable intensity
 * - Glowing borders with neon effects
 * - Multiple glow color variants
 * - Interactive hover states
 * - Multiple visual variants
 */
export default function GlassCard({
  children,
  className = '',
  glowColor = 'cyan',
  interactive = false,
  variant = 'default',
}: GlassCardProps) {
  const baseStyles =
    'relative rounded-lg overflow-hidden backdrop-blur-[10px] border transition-all duration-300'

  const variantStyles = {
    default: 'bg-cyber-dark/40 border-neon-cyan/20 shadow-lg',
    elevated: 'bg-cyber-dark/60 border-neon-cyan/40 shadow-2xl shadow-neon-cyan/20',
    panel: 'bg-cyber-dark/30 border-neon-green/15 shadow-neon-green/10',
  }

  const glowColorStyles = {
    green: 'border-neon-green/40 hover:border-neon-green/60 hover:shadow-neon-green hover:shadow-lg',
    cyan: 'border-neon-cyan/30 hover:border-neon-cyan/60 hover:shadow-neon-cyan hover:shadow-lg',
    purple:
      'border-neon-purple/30 hover:border-neon-purple/60 hover:shadow-neon-purple hover:shadow-lg',
    orange:
      'border-neon-orange/30 hover:border-neon-orange/60 hover:shadow-neon-orange hover:shadow-lg',
    pink: 'border-neon-pink/30 hover:border-neon-pink/60 hover:shadow-neon-pink hover:shadow-lg',
  }

  const hoverStyles = interactive ? 'hover:scale-105 cursor-pointer' : ''

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${glowColorStyles[glowColor]} ${hoverStyles} ${className}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={combinedStyles}
      whileHover={interactive ? { scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-green/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

/**
 * GlassCardHeader - Semantic header component for GlassCard
 */
export function GlassCardHeader({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
}) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-neon-cyan/10">
      {icon && <div className="text-neon-cyan flex-shrink-0">{icon}</div>}
      <div className="flex-1">
        <h3 className="tech-mono font-semibold text-neon-green text-lg">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}

/**
 * GlassCardContent - Semantic content wrapper for GlassCard
 */
export function GlassCardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}

/**
 * GlassCardFooter - Semantic footer component for GlassCard
 */
export function GlassCardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`pt-4 border-t border-neon-cyan/10 flex gap-2 ${className}`}>
      {children}
    </div>
  )
}
