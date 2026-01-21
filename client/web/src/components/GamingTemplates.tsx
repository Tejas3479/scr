'use client'

/**
 * GAMING AESTHETIC COMPONENT TEMPLATES
 * 
 * These are ready-to-use component templates that follow the Cyber-Agri gaming aesthetic.
 * Copy and modify these as needed for your specific use cases.
 */

import { motion } from 'framer-motion'
import { DataIcon, TargetIcon, ShieldIcon, ScannerIcon } from '@/components/GamingIcons'

/**
 * TEMPLATE 1: Progress Tracker HUD
 * Use this for tracking mission progress, level advancement, or resource collection
 */
export function ProgressTrackerTemplate() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="hud-panel p-6 space-y-6"
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-neon-green/30 pb-4">
        <div className="flex items-center gap-3">
          <TargetIcon className="w-5 h-5" color="green" animated={true} />
          <h2 className="tech-display text-lg neon-glow-green">MISSION PROGRESS</h2>
        </div>
        <span className="tech-mono text-xs text-neon-cyan/50">3 / 5</span>
      </div>

      {/* Progress Items */}
      {['Initialize Farm', 'Complete Soil Test', 'Plant Seeds'].map((task, idx) => (
        <motion.div key={idx} variants={itemVariants} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="tech-mono text-sm text-neon-cyan">{task}</span>
            <motion.span
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-neon-green text-sm"
            >
              ✓
            </motion.span>
          </div>
          <div className="h-2 bg-cyber-darker border border-neon-green/20 rounded overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-green to-neon-cyan"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: idx * 0.2, duration: 1.5 }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

/**
 * TEMPLATE 2: Status Dashboard
 * Real-time system status with indicator lights
 */
export function StatusDashboardTemplate() {
  const statusItems = [
    { name: 'NEURAL LINK', status: 'ACTIVE', color: 'text-neon-green' },
    { name: 'WATER SYSTEM', status: 'OPTIMAL', color: 'text-neon-cyan' },
    { name: 'SOIL SENSORS', status: 'ACTIVE', color: 'text-neon-green' },
    { name: 'BACKUP POWER', status: 'STANDBY', color: 'text-neon-orange' },
  ]

  return (
    <div className="glass-hud p-6 space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-neon-green/30">
        <ScannerIcon className="w-5 h-5 animated={true}" />
        <h2 className="tech-display text-lg neon-glow-cyan">SYSTEM STATUS</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statusItems.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ x: 4 }}
            className="glass-card border-neon-green/20 p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${item.color}`}
                animate={{ boxShadow: `0 0 10px currentColor` }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="tech-mono text-xs text-neon-cyan/70">{item.name}</span>
            </div>
            <p className={`tech-mono text-sm font-bold ${item.color}`}>{item.status}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/**
 * TEMPLATE 3: Notification Panel
 * Gaming-style alert and notification display
 */
export function NotificationPanelTemplate() {
  const notifications = [
    {
      type: 'alert',
      title: 'WEATHER WARNING',
      message: 'Heavy rainfall expected in 2 hours',
      color: 'border-neon-orange'
    },
    {
      type: 'success',
      title: 'MISSION COMPLETE',
      message: 'Soil analysis verified. +150 XP',
      color: 'border-neon-green'
    },
    {
      type: 'info',
      title: 'PROTOCOL UPDATE',
      message: 'New sustainability guidelines available',
      color: 'border-neon-cyan'
    }
  ]

  return (
    <div className="space-y-3">
      {notifications.map((notif, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`glass-card border-2 ${notif.color} p-4`}
        >
          <div className="flex items-start gap-3">
            <motion.div
              className={`w-3 h-3 rounded mt-1 ${
                notif.type === 'alert'
                  ? 'bg-neon-orange'
                  : notif.type === 'success'
                    ? 'bg-neon-green'
                    : 'bg-neon-cyan'
              }`}
              animate={{ boxShadow: 'var(--shadow-glow)' }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <div className="flex-1">
              <p className="tech-mono text-sm font-bold text-neon-cyan">{notif.title}</p>
              <p className="tech-mono text-xs text-neon-cyan/70 mt-1">{notif.message}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.2 }}
              className="text-neon-cyan/50 hover:text-neon-cyan"
            >
              ✕
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/**
 * TEMPLATE 4: Resource Meter
 * Circular or linear display of resources (water, energy, etc.)
 */
export function ResourceMeterTemplate() {
  const resources = [
    { name: 'WATER', value: 75, max: 100 },
    { name: 'ENERGY', value: 92, max: 100 },
    { name: 'NUTRIENTS', value: 45, max: 100 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {resources.map((resource, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.05 }}
          className="glass-card border-neon-cyan/40 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="tech-mono text-xs text-neon-cyan/70">{resource.name}</span>
            <span className="tech-mono text-sm font-bold neon-glow-green">
              {resource.value}%
            </span>
          </div>

          {/* Linear Meter */}
          <div className="h-3 bg-cyber-darker rounded-full overflow-hidden border border-neon-cyan/20">
            <motion.div
              className={`h-full bg-gradient-to-r from-neon-cyan to-neon-green`}
              initial={{ width: 0 }}
              animate={{ width: `${resource.value}%` }}
              transition={{ delay: idx * 0.2, duration: 1.5 }}
              style={{
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.6)'
              }}
            />
          </div>

          {/* Danger Threshold */}
          {resource.value < 30 && (
            <motion.div
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="tech-mono text-xs text-neon-orange mt-2"
            >
              ⚠ CRITICAL LEVEL
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * TEMPLATE 5: Data Chart Wrapper
 * Wrap existing charts (Recharts) with gaming aesthetic
 */
export function GamedDataChartTemplate() {
  return (
    <div className="glass-hud p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-neon-green/30">
        <div>
          <h3 className="tech-display text-lg neon-glow-cyan">YIELD ANALYTICS</h3>
          <p className="tech-mono text-xs text-neon-cyan/50">Real-time farm metrics</p>
        </div>
        <DataIcon className="w-5 h-5" animated={true} />
      </div>

      {/* Chart Container with Glow Border */}
      <div className="p-4 bg-cyber-darker/40 border border-neon-green/20 rounded">
        {/* Your Recharts component goes here */}
        <div className="h-64 flex items-center justify-center text-neon-cyan/50">
          [Chart renders here]
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {['Daily Avg', 'Weekly Avg', 'Peak Load'].map((label, idx) => (
          <div key={idx} className="tech-mono text-xs">
            <span className="inline-block w-2 h-2 rounded bg-neon-green mr-2" />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * TEMPLATE 6: Modal/Dialog
 * Gaming-style popup dialog
 */
export function GamedModalTemplate({ isOpen }: { isOpen: boolean }) {
  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-hud border-2 border-neon-cyan p-6 max-w-md w-full mx-4 relative"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neon-green/30">
              <h2 className="tech-display text-lg neon-glow-cyan">CONFIRM ACTION</h2>
              <button className="text-neon-orange hover:text-neon-orange/80 text-2xl leading-none">
                ✕
              </button>
            </div>

            {/* Content */}
            <p className="tech-mono text-sm text-neon-cyan/80 mb-6">
              Are you sure you want to proceed with this action?
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex-1 glass-card border-neon-green/50 py-2 tech-mono text-xs font-bold text-neon-green"
              >
                CONFIRM
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex-1 glass-card border-neon-orange/50 py-2 tech-mono text-xs font-bold text-neon-orange"
              >
                CANCEL
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

/**
 * Export all templates for use throughout the application
 */
export const GamedTemplates = {
  ProgressTracker: ProgressTrackerTemplate,
  StatusDashboard: StatusDashboardTemplate,
  NotificationPanel: NotificationPanelTemplate,
  ResourceMeter: ResourceMeterTemplate,
  DataChart: GamedDataChartTemplate,
  Modal: GamedModalTemplate,
}
