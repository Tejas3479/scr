'use client'

import { motion } from 'framer-motion'
import { Users, UserCheck, CheckCircle, Star } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    totalUsers: number
    activeUsers: number
    missionsCompleted: number
    totalPoints: number
  }
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Farmers',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      delay: 0,
    },
    {
      title: 'Active Today',
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      delay: 0.1,
    },
    {
      title: 'Missions Done',
      value: stats.missionsCompleted,
      icon: CheckCircle,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      delay: 0.2,
    },
    {
      title: 'Total Points',
      value: stats.totalPoints,
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      delay: 0.3,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: card.delay }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}></div>
            <div className={`relative ${card.bgColor} rounded-2xl p-6 shadow-lg border-2 border-transparent group-hover:border-white/50 transition-all duration-300`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-white ${card.iconColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-1">
                    {card.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((card.value / 10000) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: card.delay + 0.3 }}
                  className={`h-full bg-gradient-to-r ${card.color}`}
                ></motion.div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}




