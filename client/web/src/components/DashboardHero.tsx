'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Target, Zap, Award, TrendingUp, Users, Calendar, Sparkles } from 'lucide-react'

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getMotivationalQuote = () => {
    const quotes = [
      "Every seed you plant is a step towards a greener future 🌱",
      "Your farm, your legacy. Grow with purpose today! 🌾",
      "Small actions, big impact. Keep farming sustainably! 🌍",
      "Innovation meets tradition in modern farming! 🚀",
      "Your dedication to farming creates ripples of change! 💚"
    ]
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-4 right-12 w-20 h-20 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl lg:text-4xl font-bold mb-2"
            >
              {getGreeting()}, {user?.name || 'Farmer'}! 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-emerald-100 text-lg"
            >
              {getMotivationalQuote()}
            </motion.p>
          </div>

          {/* Weather Widget */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 lg:mt-0 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{weather.icon}</span>
              <div>
                <p className="font-semibold">{weather.temp}°C</p>
                <p className="text-sm text-emerald-100">{weather.condition}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <div>
                <p className="text-2xl font-bold">{user?.level || 1}</p>
                <p className="text-xs text-emerald-100">Level</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-300" />
              <div>
                <p className="text-2xl font-bold">{user?.points?.toLocaleString() || '1,250'}</p>
                <p className="text-xs text-emerald-100">Points</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-300" />
              <div>
                <p className="text-2xl font-bold">{user?.streak || 7}</p>
                <p className="text-xs text-emerald-100">Day Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-300" />
              <div>
                <p className="text-2xl font-bold">{user?.badges || 12}</p>
                <p className="text-xs text-emerald-100">Badges</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Level Progress</span>
            <span className="text-sm text-emerald-100">750 / 1000 XP</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '75%' }}
              transition={{ delay: 0.8, duration: 1 }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-3"
        >
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2 border border-white/20">
            <TrendingUp className="w-4 h-4" />
            <span>View Analytics</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2 border border-white/20">
            <Users className="w-4 h-4" />
            <span>Join Community</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center space-x-2 border border-white/20">
            <Calendar className="w-4 h-4" />
            <span>Today's Missions</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}


