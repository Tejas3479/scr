'use client'

import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, ExternalLink, AlertCircle, FileText, Calendar, IndianRupee, Users, TrendingUp } from 'lucide-react'

interface GovernmentScheme {
  id: string
  name: string
  description: string
  category: 'subsidy' | 'insurance' | 'loan' | 'training'
  eligibility: string[]
  benefits: string[]
  applicationDeadline?: string
  status: 'eligible' | 'applied' | 'approved' | 'not_eligible'
  appliedDate?: string
  approvalDate?: string
  amount?: number
}

interface GovernmentSchemesProps {
  userId?: string
}

export default function GovernmentSchemes({ userId }: GovernmentSchemesProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | GovernmentScheme['category']>('all')

  // Mock schemes data - in real app, this would come from API
  const schemes: GovernmentScheme[] = [
    {
      id: 'pm-kisan',
      name: 'PM-KISAN',
      description: 'Pradhan Mantri Kisan Samman Nidhi - Direct income support to farmers',
      category: 'subsidy',
      eligibility: ['Small and marginal farmers', 'Landholding up to 2 hectares', 'Valid Aadhaar number'],
      benefits: ['₹6,000 per year in three installments', 'Direct bank transfer', 'No repayment required'],
      status: 'eligible',
      amount: 6000
    },
    {
      id: 'pkvy',
      name: 'PKVY',
      description: 'Paramparagat Krishi Vikas Yojana - Organic farming promotion',
      category: 'subsidy',
      eligibility: ['Farmers interested in organic farming', 'Group of 50 farmers minimum', 'Valid land records'],
      benefits: ['₹50,000 per hectare for 3 years', 'Training and certification', 'Market linkage support'],
      status: 'applied',
      appliedDate: '2024-01-15',
      amount: 50000
    },
    {
      id: 'pmfby',
      name: 'PMFBY',
      description: 'Pradhan Mantri Fasal Bima Yojana - Crop insurance scheme',
      category: 'insurance',
      eligibility: ['All farmers growing notified crops', 'Loanee and non-loanee farmers', 'Seasonal crops coverage'],
      benefits: ['Low premium rates', 'Comprehensive risk coverage', 'Quick claim settlement'],
      status: 'approved',
      appliedDate: '2024-02-01',
      approvalDate: '2024-02-15',
      amount: 25000
    },
    {
      id: 'kcc',
      name: 'Kisan Credit Card',
      description: 'Kisan Credit Card scheme for agricultural credit',
      category: 'loan',
      eligibility: ['Farmers with land records', 'Good credit history', 'Agricultural activities'],
      benefits: ['Credit limit up to ₹3 lakh', 'Low interest rates', 'Flexible repayment'],
      status: 'eligible',
      amount: 300000
    },
    {
      id: 'atma',
      name: 'ATMA',
      description: 'Agricultural Technology Management Agency - Farmer training',
      category: 'training',
      eligibility: ['Progressive farmers', 'Farmers interested in new technologies', 'Active in farming'],
      benefits: ['Free training programs', 'Exposure visits', 'Technology demonstrations'],
      status: 'not_eligible'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Schemes', color: 'bg-gray-100 text-gray-800' },
    { id: 'subsidy', name: 'Subsidies', color: 'bg-green-100 text-green-800' },
    { id: 'insurance', name: 'Insurance', color: 'bg-blue-100 text-blue-800' },
    { id: 'loan', name: 'Loans', color: 'bg-purple-100 text-purple-800' },
    { id: 'training', name: 'Training', color: 'bg-orange-100 text-orange-800' }
  ]

  const filteredSchemes = selectedCategory === 'all'
    ? schemes
    : schemes.filter(scheme => scheme.category === selectedCategory)

  const getStatusColor = (status: GovernmentScheme['status']) => {
    const colors = {
      eligible: 'bg-green-100 text-green-800',
      applied: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      not_eligible: 'bg-red-100 text-red-800'
    }
    return colors[status]
  }

  const getStatusIcon = (status: GovernmentScheme['status']) => {
    switch (status) {
      case 'eligible':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'applied':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case 'not_eligible':
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getCategoryIcon = (category: GovernmentScheme['category']) => {
    switch (category) {
      case 'subsidy':
        return <IndianRupee className="w-5 h-5" />
      case 'insurance':
        return <TrendingUp className="w-5 h-5" />
      case 'loan':
        return <FileText className="w-5 h-5" />
      case 'training':
        return <Users className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Government Schemes</h2>
        <div className="flex items-center space-x-2">
          <IndianRupee className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-600">Maximize your benefits!</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? category.color + ' ring-2 ring-offset-2 ring-gray-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getCategoryIcon(scheme.category)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                  <p className="text-sm text-gray-600">{scheme.description}</p>
                </div>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(scheme.status)}`}>
                {getStatusIcon(scheme.status)}
                <span className="capitalize">{scheme.status.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Eligibility */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Eligibility:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {scheme.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {scheme.benefits.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Amount & Dates */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                {scheme.amount && (
                  <div className="flex items-center space-x-1 text-green-600 font-medium">
                    <IndianRupee className="w-4 h-4" />
                    <span>₹{scheme.amount.toLocaleString()}</span>
                  </div>
                )}
                {scheme.appliedDate && (
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Applied: {new Date(scheme.appliedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium">
                <ExternalLink className="w-4 h-4" />
                <span>Apply</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200"
      >
        <h3 className="font-semibold text-gray-900 mb-4">Your Scheme Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">Eligible Schemes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-sm text-gray-600">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">₹1,26,000</div>
            <div className="text-sm text-gray-600">Total Benefits</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}