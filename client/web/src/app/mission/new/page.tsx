'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, Calendar, MapPin, CheckCircle, Plus } from 'lucide-react'

export default function NewMissionPage() {
  const [missionType, setMissionType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [difficulty, setDifficulty] = useState('medium')

  const missionTypes = [
    { id: 'planting', name: 'Planting', icon: '🌱', color: 'bg-green-100 text-green-800' },
    { id: 'watering', name: 'Watering', icon: '💧', color: 'bg-blue-100 text-blue-800' },
    { id: 'pest_control', name: 'Pest Control', icon: '🐛', color: 'bg-red-100 text-red-800' },
    { id: 'harvesting', name: 'Harvesting', icon: '🌾', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'soil_testing', name: 'Soil Testing', icon: '🧪', color: 'bg-purple-100 text-purple-800' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧', color: 'bg-gray-100 text-gray-800' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit mission to API
    console.log('Creating mission:', { missionType, title, description, targetDate, difficulty })
    // For now, just show success
    alert('Mission created successfully!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Create New Mission</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mission Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Choose Mission Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {missionTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setMissionType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    missionType === type.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-gray-900">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mission Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Mission Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter mission title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your mission goals..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}