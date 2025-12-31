'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NotificationsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setMounted(true)
    const storedUser = localStorage.getItem('ef_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/auth/login')
    }
  }, [router])

  const allNotifications = [
    {
      id: 1,
      type: 'weather',
      icon: '🌤️',
      title: 'Heavy Rain Alert',
      message: 'Prepare your crops. Heavy rainfall expected in 2 hours',
      timestamp: '2 min ago',
      read: false,
      color: 'text-yellow-300'
    },
    {
      id: 2,
      type: 'scheme',
      icon: '🌾',
      title: 'New Scheme Available',
      message: 'PM-KISAN subsidy now available for your region',
      timestamp: '15 min ago',
      read: false,
      color: 'text-green-300'
    },
    {
      id: 3,
      type: 'mission',
      icon: '✅',
      title: 'Mission Completed',
      message: 'Your soil testing mission was verified! +150 XP',
      timestamp: '45 min ago',
      read: true,
      color: 'text-emerald-300'
    },
    {
      id: 4,
      type: 'market',
      icon: '📊',
      title: 'Market Price Update',
      message: 'Tomato prices increased by 15% in your region',
      timestamp: '2 hours ago',
      read: true,
      color: 'text-blue-300'
    },
    {
      id: 5,
      type: 'pest',
      icon: '🐛',
      title: 'Pest Alert',
      message: 'Armyworm detected in nearby farms. Take preventive measures',
      timestamp: '3 hours ago',
      read: true,
      color: 'text-red-300'
    },
    {
      id: 6,
      type: 'system',
      icon: '📢',
      title: 'System Update',
      message: 'New features added to Learning module. Check them out!',
      timestamp: '1 day ago',
      read: true,
      color: 'text-cyan-300'
    },
    {
      id: 7,
      type: 'achievement',
      icon: '🏆',
      title: 'Achievement Unlocked',
      message: 'You unlocked the "Water Wizard" badge! 💧',
      timestamp: '2 days ago',
      read: true,
      color: 'text-purple-300'
    },
    {
      id: 8,
      type: 'scheme',
      icon: '💡',
      title: 'Loan Scheme Updated',
      message: 'KCC interest rate reduced to 7%. Apply now!',
      timestamp: '3 days ago',
      read: true,
      color: 'text-green-300'
    },
  ]

  const filteredNotifications = filter === 'all' 
    ? allNotifications 
    : allNotifications.filter(n => n.type === filter)

  const unreadCount = allNotifications.filter(n => !n.read).length

  if (!mounted || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-emerald-300">Loading notifications...</p>
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/dashboard" className="text-emerald-400/70 hover:text-emerald-400 transition-colors text-sm">
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">
            🔔 All Notifications
          </h1>
          <p className="text-emerald-300/70">You have {unreadCount} unread notifications</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-700/50 text-emerald-300/70 border border-slate-600/50 hover:border-emerald-500/30'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('weather')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 ${
                filter === 'weather'
                  ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                  : 'bg-slate-700/50 text-emerald-300/70 border border-slate-600/50 hover:border-yellow-500/30'
              }`}
            >
              <span>🌤️</span> Weather
            </button>
            <button
              onClick={() => setFilter('scheme')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 ${
                filter === 'scheme'
                  ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                  : 'bg-slate-700/50 text-emerald-300/70 border border-slate-600/50 hover:border-green-500/30'
              }`}
            >
              <span>💡</span> Schemes
            </button>
            <button
              onClick={() => setFilter('mission')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 ${
                filter === 'mission'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-700/50 text-emerald-300/70 border border-slate-600/50 hover:border-emerald-500/30'
              }`}
            >
              <span>✅</span> Missions
            </button>
            <button
              onClick={() => setFilter('pest')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 ${
                filter === 'pest'
                  ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                  : 'bg-slate-700/50 text-emerald-300/70 border border-slate-600/50 hover:border-red-500/30'
              }`}
            >
              <span>🐛</span> Pests
            </button>
            <button
              onClick={() => setFilter('system')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-1 ${
                filter === 'system'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-700/50 text-emerald-300/70 border border-slate-600/50 hover:border-cyan-500/30'
              }`}
            >
              <span>📢</span> System
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`backdrop-blur-xl rounded-lg p-4 border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                notification.read
                  ? 'bg-slate-800/30 border-slate-500/20 hover:border-emerald-400/30'
                  : 'bg-slate-800/50 border-emerald-500/30 hover:border-emerald-400/50 shadow-lg shadow-emerald-500/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-3xl mt-1">{notification.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${notification.color}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-emerald-300/70 text-sm mb-2">
                      {notification.message}
                    </p>
                    <p className="text-emerald-400/50 text-xs">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">No notifications</h3>
            <p className="text-emerald-300/70">You're all caught up! No {filter} notifications.</p>
          </div>
        )}
      </div>
    </div>
  )
}
