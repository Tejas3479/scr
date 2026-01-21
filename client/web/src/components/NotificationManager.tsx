'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NotificationService from '@/services/NotificationService'
import { Bell, Check, AlertCircle } from 'lucide-react'

export interface NotificationState {
  isSupported: boolean
  isEnabled: boolean
  isLoading: boolean
  error: string | null
}

export default function NotificationManager() {
  const [state, setState] = useState<NotificationState>({
    isSupported: false,
    isEnabled: false,
    isLoading: false,
    error: null,
  })

  // Initialize notification service on mount
  useEffect(() => {
    const checkNotifications = async () => {
      const isSupported = 'Notification' in window && 'serviceWorker' in navigator
      
      setState(prev => ({
        ...prev,
        isSupported,
        isEnabled: NotificationService.isNotificationEnabled(),
      }))

      if (isSupported) {
        await NotificationService.initialize()
      }
    }

    checkNotifications()
  }, [])

  // Handle notification toggle
  const toggleNotifications = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      if (state.isEnabled) {
        const success = await NotificationService.unsubscribeFromNotifications()
        if (success) {
          setState(prev => ({ ...prev, isEnabled: false }))
        }
      } else {
        const subscription = await NotificationService.subscribeToNotifications()
        if (subscription) {
          setState(prev => ({ ...prev, isEnabled: true }))
        } else {
          setState(prev => ({
            ...prev,
            error: 'Failed to enable notifications. Please check browser permissions.',
          }))
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // Send test notification
  const sendTestNotification = async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      await NotificationService.sendTestNotification()
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to send test notification',
      }))
    } finally {
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }

  // Don't render if notifications not supported
  if (!state.isSupported) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 p-4 glass-card border border-neon-cyan/30 rounded-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-neon-cyan" />
        <h3 className="tech-mono font-semibold text-neon-cyan">Push Notifications</h3>
      </div>

      {/* Status Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              state.isEnabled ? 'bg-neon-green animate-pulse' : 'bg-neon-orange'
            }`}
          />
          <span className="tech-mono text-sm text-gray-300">
            {state.isEnabled ? '✓ Enabled' : '✗ Disabled'}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 p-3 bg-neon-orange/10 border border-neon-orange/30 rounded text-sm text-neon-orange"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{state.error}</p>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleNotifications}
          disabled={state.isLoading}
          className={`flex-1 px-4 py-2 rounded tech-mono text-xs font-bold transition-all ${
            state.isEnabled
              ? 'bg-neon-orange/20 border border-neon-orange/50 text-neon-orange hover:border-neon-orange'
              : 'bg-neon-green/20 border border-neon-green/50 text-neon-green hover:border-neon-green'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {state.isLoading ? (
            <span className="animate-spin inline-block">⟳</span>
          ) : state.isEnabled ? (
            'Disable'
          ) : (
            'Enable'
          )}
        </motion.button>

        {state.isEnabled && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendTestNotification}
            disabled={state.isLoading}
            className="px-4 py-2 rounded tech-mono text-xs font-bold bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:border-neon-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isLoading ? (
              <span className="animate-spin inline-block">⟳</span>
            ) : (
              'Test'
            )}
          </motion.button>
        )}
      </div>

      {/* Description */}
      <p className="tech-mono text-xs text-gray-400">
        {state.isEnabled
          ? 'You will receive notifications about missions, achievements, and updates.'
          : 'Enable notifications to receive real-time alerts about farming activities and achievements.'}
      </p>
    </motion.div>
  )
}
