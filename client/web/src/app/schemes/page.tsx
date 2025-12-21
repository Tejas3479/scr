'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GovernmentSchemes from '../../components/GovernmentSchemes'
import { ArrowLeft, IndianRupee, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function SchemesPage() {
  const [user, setUser] = useState<{id: string, name: string, location: string} | null>(null)

  useEffect(() => {
    // Mock user data - in real app, fetch from API
    setUser({
      id: '1',
      name: 'Rajesh Kumar',
      location: 'Maharashtra, India'
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

            {/* User Location */}
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">{user?.location || 'Location'}</span>
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
            🏛️ Government Schemes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access government subsidies, insurance, loans, and training programs
            designed to support farmers like you. Maximize your benefits and grow sustainably!
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
            <h2 className="text-2xl font-bold text-gray-900">Your Benefits Overview</h2>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Potential Savings!</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <IndianRupee className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">₹1,26,000</div>
              <div className="text-sm text-gray-600">Total Eligible Amount</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Available Schemes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">75%</div>
              <div className="text-sm text-gray-600">Utilization Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Government Schemes Component */}
        <GovernmentSchemes userId={user?.id} />
      </div>
    </div>
  )
}