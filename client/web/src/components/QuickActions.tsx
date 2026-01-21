'use client'

import { motion } from 'framer-motion'
import { Plus, Camera, Upload, MessageSquare, Settings, HelpCircle, Star, FileText, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    { icon: Plus, label: 'New Mission', color: 'from-emerald-500 to-green-600', hover: 'hover:from-emerald-600 hover:to-green-700', action: () => router.push('/mission/new') },
    { icon: Camera, label: 'Scan Plant', color: 'from-blue-500 to-cyan-600', hover: 'hover:from-blue-600 hover:to-cyan-700', action: () => router.push('/scan') },
    { icon: Upload, label: 'Upload Photo', color: 'from-purple-500 to-pink-600', hover: 'hover:from-purple-600 hover:to-pink-700', action: () => router.push('/scan') },
    { icon: MessageSquare, label: 'Ask AI', color: 'from-yellow-500 to-orange-600', hover: 'hover:from-yellow-600 hover:to-orange-700', action: () => router.push('/chat') },
    { icon: Star, label: 'Skills', color: 'from-orange-500 to-red-600', hover: 'hover:from-orange-600 hover:to-red-700', action: () => router.push('/skills') },
    { icon: FileText, label: 'Schemes', color: 'from-teal-500 to-cyan-600', hover: 'hover:from-teal-600 hover:to-cyan-700', action: () => router.push('/schemes') },
    { icon: Bell, label: 'Alerts', color: 'from-pink-500 to-rose-600', hover: 'hover:from-pink-600 hover:to-rose-700', action: () => router.push('/notifications') },
    { icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-600', hover: 'hover:from-gray-600 hover:to-gray-700', action: () => router.push('/settings') },
    { icon: HelpCircle, label: 'Help', color: 'from-indigo-500 to-blue-600', hover: 'hover:from-indigo-600 hover:to-blue-700', action: () => router.push('/help') },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className={`bg-gradient-to-br ${action.color} ${action.hover} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
            >
              <Icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-semibold">{action.label}</p>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}




