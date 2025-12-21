'use client'

import { motion } from 'framer-motion'
import { Award, Sparkles, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
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

export default function RecentAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([])

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
  }, [])

  const getMockAchievements = (): Achievement[] => {
    return [
      {
        id: '1',
        title: '🌱 First Harvest',
        description: 'Completed your first mission',
        icon: '🌱',
        points: 100,
        earnedAt: '2 hours ago',
        rarity: 'common',
      },
      {
        id: '2',
        title: '💧 Water Warrior',
        description: 'Saved 1000L of water',
        icon: '💧',
        points: 250,
        earnedAt: '1 day ago',
        rarity: 'rare',
      },
      {
        id: '3',
        title: '🌟 Organic Master',
        description: 'Completed 10 organic missions',
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
        return 'from-yellow-400 via-orange-500 to-red-500'
      case 'epic':
        return 'from-purple-500 to-pink-500'
      case 'rare':
        return 'from-blue-500 to-cyan-500'
      default:
        return 'from-green-500 to-emerald-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-purple-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Achievements</h2>
            <p className="text-sm text-gray-600">Latest unlocks & badges</p>
          </div>
        </div>
        <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
      </div>

      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="relative group"
          >
            <div className="bg-gradient-to-r from-white to-purple-50 rounded-2xl p-5 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 shadow-md hover:shadow-xl">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="relative"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} p-1`}>
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-3xl">
                      {achievement.icon}
                    </div>
                  </div>
                  {achievement.rarity === 'legendary' && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-yellow-400 rounded-2xl blur-xl -z-10"
                    ></motion.div>
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      +{achievement.points} points
                    </span>
                    <span className="text-gray-500">{achievement.earnedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
