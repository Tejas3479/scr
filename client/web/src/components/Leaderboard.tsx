'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '@/services/api'

interface Leader {
  rank: number
  name: string
  points: number
  avatar: string
  level: number
  user_id?: string
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try to get leaderboard with user details from admin endpoint
    Promise.all([
      api.get('/api/v1/admin/leaderboard/users?limit=5'),
      api.get('/api/v1/gamification/leaderboard?limit=5')
    ])
      .then(([usersRes, leaderboardRes]) => {
        const users = usersRes.data.users || []
        const leaderboard = leaderboardRes.data.leaderboard || []
        
        // Merge user data with leaderboard points
        const merged = leaderboard.map((lb: any, index: number) => {
          const user = users.find((u: any) => u.id === lb.user_id) || users[index] || {}
          return {
            rank: lb.rank || index + 1,
            name: user.name || `User ${lb.user_id}`,
            points: lb.points || 0,
            avatar: user.avatar_url || '👨‍🌾',
            level: user.level || 1,
            user_id: lb.user_id || user.id
          }
        })
        
        setLeaders(merged.length > 0 ? merged : getMockLeaders())
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err)
        setLeaders(getMockLeaders())
        setLoading(false)
      })
  }, [])

  const getMockLeaders = (): Leader[] => {
    return [
      { rank: 1, name: 'Rajesh Kumar', points: 12500, avatar: '👨‍🌾', level: 25 },
      { rank: 2, name: 'Priya Sharma', points: 11800, avatar: '👩‍🌾', level: 23 },
      { rank: 3, name: 'Amit Singh', points: 11000, avatar: '👨‍🌾', level: 22 },
      { rank: 4, name: 'Sneha Patel', points: 9800, avatar: '👩‍🌾', level: 20 },
      { rank: 5, name: 'Vikram Reddy', points: 9200, avatar: '👨‍🌾', level: 19 },
    ]
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Award className="w-5 h-5 text-gray-400" />
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600'
      default:
        return 'bg-white'
    }
  }

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-yellow-100">
        <p className="text-gray-500">Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-yellow-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
          <p className="text-sm text-gray-600">Top farmers this month</p>
        </div>
      </div>

      <div className="space-y-3">
        {leaders.map((leader, index) => (
          <motion.div
            key={leader.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, x: 5 }}
            className={`relative ${getRankBg(leader.rank)} rounded-2xl p-4 border-2 ${
              leader.rank <= 3 ? 'border-white/50' : 'border-gray-200'
            } shadow-md hover:shadow-xl transition-all duration-300`}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {leader.rank <= 3 ? (
                  <div className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full">
                    {getRankIcon(leader.rank)}
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full font-bold text-gray-600">
                    {leader.rank}
                  </div>
                )}
              </div>
              
              <div className="text-3xl">{leader.avatar}</div>
              
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold truncate ${leader.rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                  {leader.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm ${leader.rank <= 3 ? 'text-white/90' : 'text-gray-600'}`}>
                    Level {leader.level}
                  </span>
                  <span className={`text-sm font-semibold ${leader.rank <= 3 ? 'text-white' : 'text-yellow-600'}`}>
                    ⭐ {leader.points.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {leader.rank <= 3 && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-2xl"
                >
                  🏆
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
      >
        View Full Leaderboard
      </motion.button>
    </motion.div>
  )
}
