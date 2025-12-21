'use client'

import { useEffect, useState } from 'react'
import DashboardHero from '@/components/DashboardHero'
import StatsCards from '@/components/StatsCards'
import ActiveMissions from '@/components/ActiveMissions'
import Leaderboard from '@/components/Leaderboard'
import RecentAchievements from '@/components/RecentAchievements'
import ProgressTracker from '@/components/ProgressTracker'
import WeatherWidget from '@/components/WeatherWidget'
import QuickActions from '@/components/QuickActions'
import api from '@/services/api'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    missionsCompleted: 0,
    totalPoints: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set default user (no authentication required)
    setUser({
      id: 1,
      name: 'Demo User',
      phone: '+919876543210',
      role: 'user'
    })

    // Fetch dashboard stats
    api.get('/api/v1/admin/stats')
      .then(response => {
        setStats(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching stats:', err)
        // Use default stats on error
        setStats({
          totalUsers: 0,
          activeUsers: 0,
          missionsCompleted: 0,
          totalPoints: 0,
        })
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <DashboardHero user={user} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StatsCards stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <ActiveMissions />
              <RecentAchievements />
            </div>
            
            <div className="space-y-6">
              <WeatherWidget />
              <ProgressTracker />
              <Leaderboard />
            </div>
          </div>

          <QuickActions />
        </div>
      </div>
    </div>
  )
}
