'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, Clock, Award, Sparkles, CheckCircle, Play, Lock } from 'lucide-react'
import Link from 'next/link'
import api from '@/services/api'

interface Mission {
  id: string
  title: string
  description: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  timeRemaining: string
  progress: number
  icon: string
  status: 'available' | 'in_progress' | 'completed' | 'locked'
  category: string
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all')
  const [user, setUser] = useState<{id: string, name: string} | null>(null)

  useEffect(() => {
    // Mock user data - in real app, fetch from API
    setUser({
      id: '1',
      name: 'Rajesh Kumar'
    })

    // Mock missions data - in real app, fetch from API
    const mockMissions: Mission[] = [
      {
        id: '1',
        title: '🌱 Set Up Composting',
        description: 'Create an organic compost pit on your farm to reduce waste and improve soil quality',
        points: 500,
        difficulty: 'easy',
        timeRemaining: '7 days left',
        progress: 0,
        icon: '🌱',
        status: 'available',
        category: 'sustainability'
      },
      {
        id: '2',
        title: '💧 Water Conservation',
        description: 'Install drip irrigation system to save 30% water usage',
        points: 750,
        difficulty: 'medium',
        timeRemaining: '14 days left',
        progress: 25,
        icon: '💧',
        status: 'in_progress',
        category: 'sustainability'
      },
      {
        id: '3',
        title: '🌾 Crop Rotation Master',
        description: 'Implement proper crop rotation for 3 seasons',
        points: 1000,
        difficulty: 'hard',
        timeRemaining: '21 days left',
        progress: 0,
        icon: '🌾',
        status: 'available',
        category: 'farming'
      },
      {
        id: '4',
        title: '🐛 Pest Control Expert',
        description: 'Use natural pest control methods for entire farm',
        points: 600,
        difficulty: 'medium',
        timeRemaining: '10 days left',
        progress: 60,
        icon: '🐛',
        status: 'in_progress',
        category: 'farming'
      },
      {
        id: '5',
        title: '📊 Farm Analytics',
        description: 'Set up basic farm monitoring and analytics system',
        points: 800,
        difficulty: 'hard',
        timeRemaining: 'Locked',
        progress: 0,
        icon: '📊',
        status: 'locked',
        category: 'technology'
      },
      {
        id: '6',
        title: '🤝 Community Helper',
        description: 'Help 5 neighboring farmers with their challenges',
        points: 400,
        difficulty: 'easy',
        timeRemaining: '15 days left',
        progress: 0,
        icon: '🤝',
        status: 'available',
        category: 'community'
      }
    ]

    setMissions(mockMissions)
    setLoading(false)
  }, [])

  const categories = [
    { id: 'all', name: 'All Missions', icon: '🎯' },
    { id: 'farming', name: 'Farming', icon: '🌾' },
    { id: 'sustainability', name: 'Sustainability', icon: '🌱' },
    { id: 'technology', name: 'Technology', icon: '📊' },
    { id: 'community', name: 'Community', icon: '🤝' }
  ]

  const filteredMissions = selectedCategory === 'all'
    ? missions
    : missions.filter(mission => mission.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-green-600'
      case 'medium': return 'from-yellow-500 to-orange-600'
      case 'hard': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'locked': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-emerald-100">
          <p className="text-gray-500">Loading missions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-bold text-gray-900">Missions Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Farm Missions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete challenging quests to earn XP, unlock achievements, and improve your farming skills
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 mb-8 justify-center"
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Missions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredMissions.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                mission.status === 'locked' ? 'border-gray-200 opacity-60' : 'border-emerald-100'
              }`}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(mission.status)}`}>
                  {mission.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-2xl">{mission.icon}</span>
              </div>

              {/* Mission Content */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{mission.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{mission.description}</p>

                {/* Difficulty & Points */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getDifficultyColor(mission.difficulty)} text-white`}>
                    {mission.difficulty.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-gray-900">{mission.points} XP</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {mission.status === 'in_progress' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{mission.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mission.progress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                      />
                    </div>
                  </div>
                )}

                {/* Time Remaining */}
                <div className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{mission.timeRemaining}</span>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={mission.status === 'locked'}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  mission.status === 'completed'
                    ? 'bg-purple-600 text-white'
                    : mission.status === 'in_progress'
                    ? 'bg-blue-600 text-white'
                    : mission.status === 'locked'
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {mission.status === 'completed' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Completed!</span>
                  </div>
                ) : mission.status === 'in_progress' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Continue</span>
                  </div>
                ) : mission.status === 'locked' ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Locked</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Start Mission</span>
                  </div>
                )}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredMissions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No missions found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}