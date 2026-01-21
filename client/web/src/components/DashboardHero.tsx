'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Calendar } from 'lucide-react'
import { LevelUpIcon, TargetIcon, DataIcon, ScannerIcon } from '@/components/GamingIcons'

interface User {
  id: string
  name: string
  level: number
  points: number
  avatar?: string
  streak: number
  badges: number
}

interface DashboardHeroProps {
  user: User | null
}

export default function DashboardHero({ user }: DashboardHeroProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState({ temp: 28, condition: 'Sunny', icon: '☀️' })
  const [displayXP, setDisplayXP] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Animate XP bar on load
    const interval = setInterval(() => {
      setDisplayXP((prev) => (prev < 750 ? prev + 25 : 750))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'DAWN CYCLE'
    if (hour < 17) return 'PEAK HOURS'
    return 'DUSK MODE'
  }

  const getMotivationalQuote = () => {
    const quotes = [
      "⚡ CULTIVATE. DOMINATE. ASCEND. Every harvest is a victory.",
      "🌾 NEURAL LINK ACTIVE: Syncing with eco-systems worldwide.",
      "🚀 FARMING EVOLVED: Your legacy in real-time data.",
      "💚 CARBON CREDITS RISING: Innovation meets intention.",
      "🌍 IMPACT MULTIPLIER: Small actions, exponential growth."
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  const animationVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, type: 'spring', stiffness: 100 }
      }
    }
  }

  return (
    <motion.div
      variants={animationVariants.container}
      initial="hidden"
      animate="visible"
      className="hud-panel space-y-6 p-6"
    >
      {/* HUD Scanner Effect */}
      <motion.div
        className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden rounded-lg"
        animate={{ y: '100%' }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-neon-green to-transparent" />
      </motion.div>

      <div className="relative z-10 space-y-6">
        {/* System Status Bar */}
        <motion.div variants={animationVariants.item} className="flex items-center justify-between border-b border-neon-green/30 pb-4">
          <div className="flex items-center gap-3">
            <ScannerIcon className="w-5 h-5" animated={true} />
            <span className="tech-mono text-xs neon-glow-green uppercase">FARMQUEST NEXUS v2.0</span>
          </div>
          <span className="tech-mono text-xs text-neon-cyan/70">
            {currentTime.toLocaleTimeString()}
          </span>
        </motion.div>

        {/* Welcome Header */}
        <motion.div variants={animationVariants.item} className="space-y-3">
          <h1 className="text-4xl lg:text-5xl font-bold tech-display">
            <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,65,0.3)]">
              {getGreeting()}, {user?.name || 'OPERATOR'}
            </span>
            <span className="animate-pulse ml-2">▌</span>
          </h1>
          <p className="tech-mono text-sm text-neon-cyan/80 animate-fadeIn">
            {getMotivationalQuote()}
          </p>
        </motion.div>

        {/* Stats HUD Grid */}
        <motion.div variants={animationVariants.item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Level Card */}
          <div className="glass-card border-neon-green/40 p-4 relative group hover:border-neon-green/60 transition-all">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-neon-green rounded transition-opacity duration-300" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <span className="tech-mono text-xs text-neon-cyan/70">LVL</span>
                <LevelUpIcon className="w-4 h-4" color="green" animated={false} />
              </div>
              <p className="text-3xl font-bold neon-glow-green">{user?.level || 1}</p>
              <div className="h-1 bg-cyber-darker rounded overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Points Card */}
          <div className="glass-card border-neon-cyan/40 p-4 relative group hover:border-neon-cyan/60 transition-all">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-neon-cyan rounded transition-opacity duration-300" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <span className="tech-mono text-xs text-neon-green/70">XP</span>
                <DataIcon className="w-4 h-4" animated={true} />
              </div>
              <p className="text-3xl font-bold neon-glow-cyan data-readout-cyan">
                {(user?.points || 1250).toLocaleString()}
              </p>
              <span className="tech-mono text-xs text-neon-cyan/50">+{Math.floor(Math.random() * 50 + 20)}/s</span>
            </div>
          </div>

          {/* Streak Card */}
          <div className="glass-card border-neon-orange/40 p-4 relative group hover:border-neon-orange/60 transition-all">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-neon-orange rounded transition-opacity duration-300" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <span className="tech-mono text-xs text-neon-cyan/70">STREAK</span>
                <span className="text-lg">🔥</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: '#FF6B00', textShadow: '0 0 10px rgba(255, 107, 0, 0.6)' }}>
                {user?.streak || 7}
              </p>
              <span className="tech-mono text-xs text-neon-orange/50">Active Days</span>
            </div>
          </div>

          {/* Badges Card */}
          <div className="glass-card border-neon-purple/40 p-4 relative group hover:border-neon-purple/60 transition-all">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-neon-purple rounded transition-opacity duration-300" />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <span className="tech-mono text-xs text-neon-cyan/70">BADGES</span>
                <span className="text-lg animate-badge-bounce">⭐</span>
              </div>
              <p className="text-3xl font-bold neon-glow-purple">{user?.badges || 12}</p>
              <span className="tech-mono text-xs text-neon-purple/50">Collected</span>
            </div>
          </div>
        </motion.div>

        {/* XP Progress Bar */}
        <motion.div variants={animationVariants.item} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="tech-mono text-sm text-neon-cyan/80">EXPERIENCE PROGRESSION</span>
            <span className="tech-mono text-sm neon-glow-green">{displayXP} / 1000 XP</span>
          </div>
          <div className="h-3 bg-cyber-darker border border-neon-green/20 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-green via-neon-cyan to-neon-green rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(displayXP / 1000) * 100}%` }}
              transition={{ duration: 2, delay: 0.5 }}
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.6), inset 0 0 10px rgba(0, 255, 65, 0.2)'
              }}
            />
          </div>
          <p className="tech-mono text-xs text-neon-cyan/50">→ 250 XP until LEVEL UP</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={animationVariants.item} className="flex flex-wrap gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card border-neon-cyan/50 hover:border-neon-cyan px-4 py-2 tech-mono text-xs font-bold text-neon-cyan flex items-center gap-2 transition-all hover:shadow-neon-cyan"
          >
            <TrendingUp className="w-4 h-4" />
            ANALYTICS
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card border-neon-green/50 hover:border-neon-green px-4 py-2 tech-mono text-xs font-bold text-neon-green flex items-center gap-2 transition-all hover:shadow-neon-green"
          >
            <Users className="w-4 h-4" />
            COMMUNITY
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card border-neon-orange/50 hover:border-neon-orange px-4 py-2 tech-mono text-xs font-bold hover:text-neon-orange flex items-center gap-2 transition-all"
            style={{ color: '#FF6B00' }}
          >
            <Calendar className="w-4 h-4" />
            MISSIONS
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}




