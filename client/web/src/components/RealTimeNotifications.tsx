'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, AlertTriangle, TrendingUp, CloudRain, Zap, MessageSquare, X, CheckCircle } from 'lucide-react'

interface Notification {
  id: string
  type: 'alert' | 'market' | 'weather' | 'mission' | 'social' | 'system'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  actionText?: string
}

interface RealTimeNotificationsProps {
  userId?: string
}

export default function RealTimeNotifications({ userId }: RealTimeNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showAll, setShowAll] = useState(false)
  const [filter, setFilter] = useState<'all' | Notification['type']>('all')

  // Mock notifications data - in real app, this would come from WebSocket/API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'weather',
        title: 'Heavy Rain Alert',
        message: 'Heavy rainfall expected in your area tomorrow. Protect your crops!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        priority: 'high',
        actionUrl: '/weather',
        actionText: 'View Details'
      },
      {
        id: '2',
        type: 'market',
        title: 'Tomato Price Update',
        message: 'Tomato prices increased by 15% in local market. Good time to sell!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        priority: 'medium',
        actionUrl: '/market',
        actionText: 'Check Prices'
      },
      {
        id: '3',
        type: 'mission',
        title: 'Mission Completed!',
        message: 'Congratulations! You completed "Sustainable Water Usage" mission.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'alert',
        title: 'Pest Detection Alert',
        message: 'Pests detected in your tomato field. Take immediate action!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        read: false,
        priority: 'high',
        actionUrl: '/scan',
        actionText: 'View Report'
      },
      {
        id: '5',
        type: 'social',
        title: 'New Community Message',
        message: 'Rajesh shared tips on organic pest control in the community forum.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        read: true,
        priority: 'low',
        actionUrl: '/community',
        actionText: 'Join Discussion'
      },
      {
        id: '6',
        type: 'system',
        title: 'New Feature Available',
        message: 'Voice commands are now available! Try saying "Show my missions"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        read: true,
        priority: 'low'
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'market':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-500" />
      case 'mission':
        return <CheckCircle className="w-5 h-5 text-purple-500" />
      case 'social':
        return <MessageSquare className="w-5 h-5 text-orange-500" />
      case 'system':
        return <Zap className="w-5 h-5 text-yellow-500" />
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-blue-500 bg-blue-50'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(notif => notif.type === filter)

  const displayedNotifications = showAll ? filteredNotifications : filteredNotifications.slice(0, 5)
  const unreadCount = notifications.filter(n => !n.read).length

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'alert', label: 'Alerts', count: notifications.filter(n => n.type === 'alert').length },
    { value: 'market', label: 'Market', count: notifications.filter(n => n.type === 'market').length },
    { value: 'weather', label: 'Weather', count: notifications.filter(n => n.type === 'weather').length },
    { value: 'mission', label: 'Missions', count: notifications.filter(n => n.type === 'mission').length },
    { value: 'social', label: 'Social', count: notifications.filter(n => n.type === 'social').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Live Notifications</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600">Live</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as any)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === option.value
                ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label} ({option.count})
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {displayedNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`relative p-4 rounded-xl border-l-4 transition-all hover:shadow-md ${
                getPriorityColor(notification.priority)
              } ${!notification.read ? 'ring-1 ring-gray-200' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      {notification.actionUrl && notification.actionText && (
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          {notification.actionText}
                        </button>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less Button */}
      {notifications.length > 5 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {showAll ? 'Show Less' : `Show ${notifications.length - 5} More`}
          </button>
        </div>
      )}

      {/* Empty State */}
      {displayedNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
        </div>
      )}

      {/* Real-time Indicator */}
      <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 font-medium">Real-time updates active</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Get instant notifications for weather alerts, market changes, and mission updates.
        </p>
      </div>
    </div>
  )
}