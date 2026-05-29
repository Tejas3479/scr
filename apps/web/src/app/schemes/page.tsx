'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SchemesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    setMounted(true)
    const storedUser = localStorage.getItem('ef_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/auth/login')
    }
  }, [router])

  const schemes = [
    {
      id: 1,
      name: 'PM-KISAN Samman Nidhi',
      category: 'subsidy',
      description: 'Direct income support to farmers',
      amount: '₹6,000 per year',
      eligibility: 'Farmers with land up to 2 hectares',
      benefits: ['Three installments per year', 'Direct bank transfer'],
      status: 'approved',
      disbursed: '₹12,000',
      icon: '💰'
    },
    {
      id: 2,
      name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
      category: 'certification',
      description: 'Promotes organic farming practices',
      amount: '₹50,000 per hectare (3 years)',
      eligibility: 'Farmers adopting organic farming',
      benefits: ['Organic certification', 'Technical guidance', 'Market linkage'],
      status: 'pending',
      disbursed: '₹0',
      icon: '🌱'
    },
    {
      id: 3,
      name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      category: 'insurance',
      description: 'Crop insurance for natural calamities',
      amount: 'Varies by crop',
      eligibility: 'All farmers including tenant farmers',
      benefits: ['Protection against crop loss', 'Premium subsidy', 'Quick claim settlement'],
      status: 'active',
      disbursed: '₹5,000',
      icon: '🛡️'
    },
    {
      id: 4,
      name: 'Kisan Credit Card (KCC)',
      category: 'loans',
      description: 'Credit facility for farming activities',
      amount: '₹1,00,000 - ₹3,00,000',
      eligibility: 'Individual farmers and tenant farmers',
      benefits: ['Low interest rates', 'Easy repayment', 'No collateral required'],
      status: 'approved',
      disbursed: '₹1,50,000',
      icon: '💳'
    },
    {
      id: 5,
      name: 'Agricultural Technology Management Agency (ATMA)',
      category: 'training',
      description: 'Training and technology transfer programs',
      amount: 'Free training programs',
      eligibility: 'All farmers and rural youth',
      benefits: ['Modern farming techniques', 'Skill development', 'Networking opportunities'],
      status: 'active',
      disbursed: 'N/A',
      icon: '🎓'
    },
    {
      id: 6,
      name: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
      category: 'training',
      description: 'Irrigation infrastructure development',
      amount: '₹75,000 per hectare (subsidy)',
      eligibility: 'Farmers with suitable land for irrigation',
      benefits: ['Irrigation efficiency', 'Water conservation', 'Increased productivity'],
      status: 'pending',
      disbursed: '₹0',
      icon: '💧'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Schemes', color: 'slate' },
    { id: 'subsidy', label: 'Subsidies', color: 'yellow' },
    { id: 'certification', label: 'Certification', color: 'green' },
    { id: 'insurance', label: 'Insurance', color: 'purple' },
    { id: 'loans', label: 'Loans', color: 'blue' },
    { id: 'training', label: 'Training', color: 'cyan' },
  ]

  const filteredSchemes = selectedCategory === 'all' 
    ? schemes 
    : schemes.filter(scheme => scheme.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'border-green-500/30 bg-green-500/5'
      case 'active': return 'border-emerald-500/30 bg-emerald-500/5'
      case 'pending': return 'border-yellow-500/30 bg-yellow-500/5'
      default: return 'border-slate-500/30 bg-slate-500/5'
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return '✅'
      case 'active': return '🟢'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  if (!mounted || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-emerald-300">Loading schemes...</p>
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard" className="text-emerald-400/70 hover:text-emerald-400 transition-colors">
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">
            Government Schemes 💡
          </h1>
          <p className="text-emerald-300/70">Explore available subsidies, loans, and support programs</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Filter by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? `bg-${cat.color}-500/30 text-${cat.color}-300 border border-${cat.color}-500/50`
                    : `bg-slate-700/50 text-emerald-300/70 border border-slate-600/50 hover:border-emerald-500/30`
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredSchemes.map(scheme => (
            <div
              key={scheme.id}
              className={`backdrop-blur-xl rounded-xl p-6 border transition-all duration-300 hover:shadow-lg hover:border-emerald-400/50 group ${getStatusColor(scheme.status)}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-4xl">{scheme.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors mb-1">
                      {scheme.name}
                    </h3>
                    <p className="text-emerald-300/70 text-sm">{scheme.description}</p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-4 flex gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-semibold text-sm border ${getStatusBadgeColor(scheme.status)}`}>
                  <span>{getStatusIcon(scheme.status)}</span>
                  <span className="capitalize">{scheme.status}</span>
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-emerald-500/20">
                {/* Amount */}
                <div>
                  <p className="text-emerald-300/60 text-xs font-medium mb-1 uppercase tracking-wider">Amount</p>
                  <p className="text-emerald-300 font-semibold">{scheme.amount}</p>
                </div>

                {/* Disbursed */}
                <div>
                  <p className="text-emerald-300/60 text-xs font-medium mb-1 uppercase tracking-wider">Disbursed</p>
                  <p className="text-emerald-300 font-semibold">{scheme.disbursed}</p>
                </div>
              </div>

              {/* Eligibility */}
              <div className="mb-4">
                <p className="text-emerald-300/60 text-xs font-medium mb-2 uppercase tracking-wider">Eligibility</p>
                <p className="text-emerald-300/80 text-sm">{scheme.eligibility}</p>
              </div>

              {/* Benefits */}
              <div className="mb-4">
                <p className="text-emerald-300/60 text-xs font-medium mb-2 uppercase tracking-wider">Benefits</p>
                <ul className="space-y-1">
                  {scheme.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-emerald-300/80 text-sm flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/40 hover:to-green-500/40 border border-emerald-500/30 hover:border-emerald-400/50 text-emerald-300 hover:text-emerald-200 font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                📋 Apply for Scheme
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-2">No schemes found</h3>
            <p className="text-emerald-300/70">Try selecting a different category</p>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-emerald-400 mb-4">📌 About Government Schemes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-emerald-300/80 text-sm">
            <div>
              <p className="mb-2">Government provides various schemes to support farmers including:</p>
              <ul className="space-y-1 ml-4">
                <li>• Direct income support programs</li>
                <li>• Crop insurance schemes</li>
                <li>• Subsidized credit facilities</li>
              </ul>
            </div>
            <div>
              <p className="mb-2">Additional benefits available:</p>
              <ul className="space-y-1 ml-4">
                <li>• Organic certification support</li>
                <li>• Irrigation development funds</li>
                <li>• Technical training programs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
