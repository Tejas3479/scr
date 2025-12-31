"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WeatherWidget from '@/components/WeatherWidget'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const level = 5
  const xp = 2450
  const nextLevelXp = 3000
  const xpProgress = (xp / nextLevelXp) * 100

  useEffect(() => {
    setMounted(true)
    const storedUser = localStorage.getItem('ef_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/auth/login')
    }
  }, [router])

  if (!mounted || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-emerald-300">Loading your farm...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header: User Greeting */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">
            Welcome back, {user.name}! 🚜
          </h1>
          <p className="text-emerald-300/70">Keep grinding and level up your farming skills</p>
        </div>

        {/* Level & XP Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 mb-8 hover:border-emerald-400/50 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Level Card */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="55" stroke="url(#grad1)" strokeWidth="3" opacity="0.5" />
                  <circle cx="60" cy="60" r="55" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="345.6" strokeDashoffset="0" />
                  <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  <text x="60" y="65" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#10b981" fontFamily="Arial">
                    {level}
                  </text>
                </svg>
              </div>
              <p className="text-emerald-300/70 text-sm font-medium">Current Level</p>
              <p className="text-emerald-400 font-semibold">Expert Farmer</p>
            </div>

            {/* XP Progress */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-emerald-300 font-medium">Experience Points</span>
                  <span className="text-emerald-400 font-bold">{xp} / {nextLevelXp}</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden border border-emerald-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500 ease-out shadow-lg shadow-emerald-500/50"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-emerald-300/70 text-sm">
                {nextLevelXp - xp} XP until next level. Complete missions to gain XP faster!
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-500/30 rounded-xl p-6 hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
            <div className="text-3xl mb-2">🔥</div>
            <p className="text-orange-300/70 text-sm font-medium mb-1">Current Streak</p>
            <p className="text-2xl font-bold text-orange-400">7 days</p>
          </div>

          {/* Missions Card */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-blue-300/70 text-sm font-medium mb-1">Completed</p>
            <p className="text-2xl font-bold text-blue-400">12 this month</p>
          </div>

          {/* FarmTokens Card */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-yellow-300/70 text-sm font-medium mb-1">FarmTokens</p>
            <p className="text-2xl font-bold text-yellow-400">1,250</p>
          </div>

          {/* Badges Card */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="text-3xl mb-2">🎖️</div>
            <p className="text-purple-300/70 text-sm font-medium mb-1">Badges Earned</p>
            <p className="text-2xl font-bold text-purple-400">8</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Link href="/missions">
            <button className="w-full bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 active:scale-95">
              📋 Missions
            </button>
          </Link>
          <Link href="/learning">
            <button className="w-full bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 active:scale-95">
              📚 Learn
            </button>
          </Link>
          <Link href="/schemes">
            <button className="w-full bg-gradient-to-br from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/50 active:scale-95">
              💡 Schemes
            </button>
          </Link>
          <Link href="/chat">
            <button className="w-full bg-gradient-to-br from-cyan-600 to-teal-700 hover:from-cyan-500 hover:to-teal-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 active:scale-95">
              💬 Chat
            </button>
          </Link>
          <button className="w-full bg-gradient-to-br from-pink-600 to-rose-700 hover:from-pink-500 hover:to-rose-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50 active:scale-95">
            🏪 Shop
          </button>
          <button className="w-full bg-gradient-to-br from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/50 active:scale-95">
            🏆 Leader
          </button>
        </div>

        {/* Weather Widget */}
        <div className="mb-8">
          <WeatherWidget />
        </div>

        {/* Featured Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Featured Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Harvest Master */}
            <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 group">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🌾</div>
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Harvest Master</h3>
              <p className="text-yellow-300/70 text-sm mb-4">Complete 50 harvesting missions</p>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 w-3/4" />
              </div>
              <p className="text-yellow-300/60 text-xs mt-2">38 / 50</p>
            </div>

            {/* Water Wizard */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 group">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">💧</div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Water Wizard</h3>
              <p className="text-blue-300/70 text-sm mb-4">Complete 30 irrigation missions</p>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-full" />
              </div>
              <p className="text-blue-300/60 text-xs mt-2">30 / 30 ✓</p>
            </div>

            {/* Eco Guardian */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 group">
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">♻️</div>
              <h3 className="text-lg font-bold text-emerald-400 mb-2">Eco Guardian</h3>
              <p className="text-emerald-300/70 text-sm mb-4">Use organic farming for 20 days</p>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 w-full" />
              </div>
              <p className="text-emerald-300/60 text-xs mt-2">20 / 20 ✓</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
