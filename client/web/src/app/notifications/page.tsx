'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import RealTimeNotifications from '@/components/RealTimeNotifications'
import { ArrowLeft, Bell, Settings } from 'lucide-react'
import Link from 'next/link'

export default function NotificationsPage() {
  const [user, setUser] = useState<{id: string, name: string} | null>(null)

  useEffect(() => {
    // Mock user data - in real app, fetch from API
    setUser({
      id: '1',
      name: 'Rajesh Kumar'
    })
  }, [])

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

            {/* Notification Settings */}
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Settings</span>
              </button>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔔 Live Notifications
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay updated with real-time alerts, market prices, weather updates,
            and community activities. Never miss an important farming opportunity!
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Notification Summary</h2>
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-blue-600">Always Connected!</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <div className="text-sm text-gray-600">Unread</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">Total Today</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-gray-600">Delivery Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Notifications Component */}
        <RealTimeNotifications userId={user?.id} />
      </div>
    </div>
  )
}