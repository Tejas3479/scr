'use client'

import { motion } from 'framer-motion'
import { DataIcon, TargetIcon, ScannerIcon } from '@/components/GamingIcons'

interface DashboardStatsProps {
  stats: {
    totalUsers: number
    activeUsers: number
    missionsCompleted: number
    totalPoints: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'TOTAL OPERATORS',
      value: stats.totalUsers.toLocaleString(),
      icon: ScannerIcon,
      color: 'cyan',
      trend: '+12%',
    },
    {
      title: 'ACTIVE NEXUS',
      value: stats.activeUsers.toLocaleString(),
      icon: DataIcon,
      color: 'green',
      trend: '+8%',
    },
    {
      title: 'MISSIONS EXECUTED',
      value: stats.missionsCompleted.toLocaleString(),
      icon: TargetIcon,
      color: 'orange',
      trend: '+24%',
    },
    {
      title: 'ECOSYSTEM POINTS',
      value: stats.totalPoints.toLocaleString(),
      icon: DataIcon,
      color: 'purple',
      trend: '+15%',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: 'spring', stiffness: 100 }
    }
  }

  const colorMap = {
    cyan: { text: 'text-neon-cyan', glow: 'glow-border-cyan', shadow: 'shadow-neon-cyan' },
    green: { text: 'text-neon-green', glow: 'glow-border-green', shadow: 'shadow-neon-green' },
    orange: { text: 'text-neon-orange', glow: 'border-neon-orange/50', shadow: 'shadow-neon-orange' },
    purple: { text: 'text-neon-purple', glow: 'border-neon-purple/50', shadow: 'shadow-neon-purple' }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon
        const colors = colorMap[stat.color as keyof typeof colorMap]

        return (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`glass-hud p-6 relative group overflow-hidden ${colors.glow}`}
          >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-neon-cyan via-neon-green to-neon-purple transition-opacity duration-300" />

            {/* Scanner Line Animation */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none"
              animate={{ y: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-neon-green to-transparent" />
            </motion.div>

            <div className="relative z-10 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="tech-mono text-xs font-bold text-neon-cyan/70 uppercase tracking-wider">
                  {stat.title}
                </h3>
                <IconComponent className={`w-5 h-5 ${colors.text}`} animated={true} color={stat.color as any} />
              </div>

              {/* Main Value */}
              <div className="space-y-1">
                <motion.p
                  className={`text-4xl font-bold ${colors.text} drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                >
                  {stat.value}
                </motion.p>

                {/* Trend Indicator */}
                <div className="flex items-center gap-2">
                  <span className="tech-mono text-xs text-neon-green animate-data-pulse">▲</span>
                  <span className={`tech-mono text-xs font-mono ${colors.text} opacity-80`}>
                    {stat.trend}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1 bg-cyber-darker rounded-full overflow-hidden border border-neon-green/20">
                <motion.div
                  className={`h-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600`}
                  initial={{ width: 0 }}
                  animate={{ width: `${60 + Math.random() * 35}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1.5 }}
                  style={{
                    background: stat.color === 'cyan'
                      ? 'linear-gradient(90deg, #00F0FF, #00FF41)'
                      : stat.color === 'green'
                        ? 'linear-gradient(90deg, #00FF41, #00F0FF)'
                        : stat.color === 'orange'
                          ? 'linear-gradient(90deg, #FF6B00, #FF00FF)'
                          : 'linear-gradient(90deg, #FF00FF, #00F0FF)'
                  }}
                />
              </div>

              {/* Footer Status */}
              <div className="pt-2 border-t border-neon-green/10">
                <span className="tech-mono text-xs text-neon-cyan/50">ACTIVE • {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Corner Brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-neon-green/30 rounded-tl" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-neon-green/30 rounded-br" />
          </motion.div>
        )
      })}
    </motion.div>
  )
}


