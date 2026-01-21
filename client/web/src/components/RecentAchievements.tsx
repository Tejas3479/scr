'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AchievementIcon } from '@/components/GamingIcons'
import api from '@/services/api'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  earnedAt: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface LevelUpNotification {
  id: string
  newLevel: number
  show: boolean
}

export default function RecentAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [levelUp, setLevelUp] = useState<LevelUpNotification | null>(null)

  useEffect(() => {
    api.get('/api/v1/gamification/recent-achievements?limit=3')
      .then(response => {
        const achData = response.data.achievements.map((a: any) => ({
          id: a.id || Math.random().toString(),
          title: a.title || '🏆 Achievement',
          description: a.description || 'Completed a mission',
          icon: a.icon || '🏆',
          points: a.points || 100,
          earnedAt: a.earned_at ? new Date(a.earned_at).toLocaleString() : 'Recently',
          rarity: a.rarity || 'common'
        }))
        setAchievements(achData.length > 0 ? achData : getMockAchievements())
      })
      .catch(err => {
        console.error('Error fetching achievements:', err)
        setAchievements(getMockAchievements())
      })

    // Simulate level up notification
    const timer = setTimeout(() => {
      setLevelUp({ id: '1', newLevel: 8, show: true })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getMockAchievements = (): Achievement[] => {
    return [
      {
        id: '1',
        title: 'GENESIS HARVEST',
        description: 'Completed your first mission. Welcome to the Nexus.',
        icon: '🌱',
        points: 100,
        earnedAt: '2 hours ago',
        rarity: 'common',
      },
      {
        id: '2',
        title: 'HYDRO SENTINEL',
        description: 'Saved 1000L of water. Conservation protocols engaged.',
        icon: '💧',
        points: 250,
        earnedAt: '1 day ago',
        rarity: 'rare',
      },
      {
        id: '3',
        title: 'ORGANIC NEXUS',
        description: 'Completed 10 organic missions. Bio-synthesis achieved.',
        icon: '🌟',
        points: 500,
        earnedAt: '3 days ago',
        rarity: 'epic',
      },
    ]
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return { border: 'border-yellow-400', bg: 'from-yellow-600 to-orange-600', glow: 'neon-orange' }
      case 'epic':
        return { border: 'border-neon-purple', bg: 'from-neon-purple to-neon-pink', glow: 'neon-purple' }
      case 'rare':
        return { border: 'border-neon-cyan', bg: 'from-neon-cyan to-tech-blue', glow: 'neon-cyan' }
      default:
        return { border: 'border-neon-green', bg: 'from-neon-green to-matrix-green', glow: 'neon-green' }
    }
  }

  return (
    <>
      {/* LEVEL UP SPLASH SCREEN */}
      <AnimatePresence>
        {levelUp?.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="relative">
              {/* Background Glow */}
              <motion.div
                className="absolute -inset-20 bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple rounded-full blur-3xl opacity-30"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Level Up Card */}
              <motion.div
                className="relative hud-panel p-12 text-center border-2 border-neon-green max-w-md"
                animate={{ y: [0, -20, 0], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 1, type: 'spring' }}
              >
                {/* Scanlines */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-green/10 to-transparent opacity-50" />
                </motion.div>

                <div className="relative space-y-6">
                  {/* LEVEL UP Text */}
                  <motion.div
                    animate={{ scale: [0.8, 1.2, 1] }}
                    transition={{ duration: 0.8, type: 'spring' }}
                  >
                    <h1 className="tech-display text-6xl font-black mb-2">
                      <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent">
                        LEVEL UP!
                      </span>
                    </h1>
                    <p className="tech-mono text-neon-cyan text-sm tracking-widest">━━━━━━━━━━━━━━━</p>
                  </motion.div>

                  {/* Level Number */}
                  <motion.div
                    className="text-8xl font-black neon-glow-green drop-shadow-[0_0_30px_rgba(0,255,65,0.8)]"
                    animate={{
                      scale: [0, 1.5, 1],
                      rotate: [-180, 0],
                    }}
                    transition={{ duration: 1, type: 'spring', stiffness: 50 }}
                  >
                    {levelUp.newLevel}
                  </motion.div>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <p className="tech-mono text-neon-cyan text-sm">New Abilities Unlocked</p>
                    <p className="tech-mono text-neon-green/70 text-xs">★ Advanced Analytics Access</p>
                    <p className="tech-mono text-neon-green/70 text-xs">★ Premium Badge: NEXUS OPERATOR</p>
                  </motion.div>

                  {/* Particle Effects */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-neon-green rounded-full"
                      animate={{
                        x: Math.cos((i / 8) * Math.PI * 2) * 100,
                        y: Math.sin((i / 8) * Math.PI * 2) * 100,
                        opacity: [1, 0],
                      }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Auto dismiss */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-green to-neon-cyan"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, delay: 1 }}
                onAnimationComplete={() => setLevelUp(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACHIEVEMENTS LIST */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hud-panel p-6 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neon-green/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 glass-card border-neon-purple/50">
              <Sparkles className="w-6 h-6 text-neon-purple drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]" />
            </div>
            <div>
              <h2 className="tech-display text-xl font-bold text-neon-cyan">ACHIEVEMENT UNLOCKS</h2>
              <p className="tech-mono text-xs text-neon-cyan/50">Latest badge acquisitions</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            <span className="text-2xl">⭐</span>
          </motion.div>
        </div>

        {/* Achievements Grid */}
        <div className="space-y-3">
          {achievements.map((achievement, index) => {
            const rarity = getRarityColor(achievement.rarity)

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 8, boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)' }}
                className={`glass-card border-2 ${rarity.border} p-4 relative group cursor-pointer overflow-hidden`}
              >
                {/* Hover Glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/10 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />

                <div className="relative z-10 flex items-start gap-4">
                  {/* Badge Icon */}
                  <motion.div
                    className={`flex-shrink-0 w-16 h-16 rounded bg-gradient-to-br ${rarity.bg} p-3 flex items-center justify-center text-3xl relative`}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {achievement.icon}

                    {/* Rarity Glow */}
                    <motion.div
                      className={`absolute -inset-1 rounded bg-${rarity.glow} blur-lg opacity-30 -z-10`}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Corner Indicators */}
                    {achievement.rarity !== 'common' && (
                      <>
                        <div className="absolute top-0 left-0 w-2 h-2 bg-neon-green rounded-br" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-neon-green rounded-tl" />
                      </>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="tech-display font-bold text-neon-cyan text-sm truncate">
                        {achievement.title}
                      </h3>
                      <motion.span
                        className={`tech-mono text-xs font-bold px-2 py-1 rounded border ${
                          achievement.rarity === 'legendary'
                            ? 'border-yellow-400 text-yellow-400'
                            : achievement.rarity === 'epic'
                              ? 'border-neon-purple text-neon-purple'
                              : achievement.rarity === 'rare'
                                ? 'border-neon-cyan text-neon-cyan'
                                : 'border-neon-green text-neon-green'
                        } whitespace-nowrap`}
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {achievement.rarity.toUpperCase()}
                      </motion.span>
                    </div>

                    <p className="tech-mono text-xs text-neon-cyan/70 mb-2">
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <motion.span
                        className="tech-mono text-neon-green font-bold flex items-center gap-1"
                        animate={{ textShadow: ['0 0 5px rgba(0,255,65,0.3)', '0 0 15px rgba(0,255,65,0.6)', '0 0 5px rgba(0,255,65,0.3)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ▲ +{achievement.points} XP
                      </motion.span>
                      <span className="tech-mono text-neon-cyan/50">
                        {achievement.earnedAt}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer */}
        <motion.div
          className="pt-4 border-t border-neon-green/20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="tech-mono text-xs text-neon-cyan/60 animate-data-pulse">
            >>> EXPLORE MORE ACHIEVEMENTS <<<
          </p>
        </motion.div>
      </motion.div>
    </>
  )
}
