'use client'

import { motion } from 'framer-motion'
import { Target, Clock, Award, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/services/api'
import Link from 'next/link'

interface Mission {
  id: string
  title: string
  description: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  timeRemaining: string
  progress: number
  icon: string
}

export default function ActiveMissions() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    const userId = user ? JSON.parse(user).id : null

    if (userId) {
      api.get(`/api/v1/gamification/missions?user_id=${userId}&limit=3`)
        .then(response => {
          const missionData = response.data.missions.map((m: any) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            points: m.points,
            difficulty: m.difficulty,
            timeRemaining: m.time_remaining || `${Math.floor(Math.random() * 7) + 1} days left`,
            progress: m.progress || Math.floor(Math.random() * 100),
            icon: m.icon || '🌾',
          }))
          setMissions(missionData)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching missions:', err)
          // Fallback to mock data
          setMissions([
            {
              id: '1',
              title: '🌱 Set Up Composting',
              description: 'Create an organic compost pit on your farm',
              points: 500,
              difficulty: 'easy',
              timeRemaining: '2 days left',
              progress: 65,
              icon: '🌱',
            },
          ])
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'hard':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-emerald-100">
        <p className="text-gray-500">Loading missions...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-emerald-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Active Missions</h2>
            <p className="text-sm text-gray-600">Complete quests to earn rewards</p>
          </div>
        </div>
        <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
      </div>

      <div className="space-y-4">
        {missions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active missions available</p>
        ) : (
          missions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="relative group"
            >
              <div className="bg-gradient-to-r from-white to-emerald-50 rounded-2xl p-5 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-4xl">{mission.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{mission.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(mission.difficulty)}`}>
                          {mission.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Award className="w-4 h-4" />
                          <span className="font-semibold">{mission.points} pts</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{mission.timeRemaining}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-semibold">{mission.progress}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mission.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={`h-full bg-gradient-to-r ${getDifficultyColor(mission.difficulty)}`}
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Link href="/missions">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          View All Missions →
        </motion.button>
      </Link>
    </motion.div>
  )
}
