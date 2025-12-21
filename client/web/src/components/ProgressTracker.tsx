'use client'

import { motion } from 'framer-motion'
import { Target, TrendingUp } from 'lucide-react'

export default function ProgressTracker() {
  const progressData = [
    { label: 'Level Progress', value: 68, color: 'from-emerald-500 to-green-600' },
    { label: 'Weekly Goals', value: 85, color: 'from-blue-500 to-cyan-600' },
    { label: 'Monthly Challenge', value: 42, color: 'from-purple-500 to-pink-600' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border-2 border-blue-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
          <p className="text-sm text-gray-600">Track your farming journey</p>
        </div>
      </div>

      <div className="space-y-6">
        {progressData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              <span className="text-sm font-bold text-gray-900">{item.value}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                className={`h-full bg-gradient-to-r ${item.color} rounded-full relative`}
              >
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/30 rounded-full"
                ></motion.div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <div>
            <p className="font-semibold text-gray-900">Great Progress!</p>
            <p className="text-sm text-gray-600">You&apos;re on track for this week&apos;s goals</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}


