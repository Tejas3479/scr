'use client'

import React from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Lock, Star, Zap, Leaf, Droplets, Sun, Wind } from 'lucide-react'

interface Skill {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  level: number
  maxLevel: number
  pointsRequired: number
  unlocked: boolean
  category: 'farming' | 'sustainability' | 'technology' | 'community'
}

interface SkillTreeProps {
  userSkills?: Skill[]
}

export default function SkillTree({ userSkills }: SkillTreeProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Skill['category']>('all')

  // Mock skills data - in real app, this would come from API
  const skills: Skill[] = [
    {
      id: 'crop_rotation',
      name: 'Crop Rotation Master',
      description: 'Master sustainable crop rotation techniques',
      icon: <Leaf className="w-6 h-6" />,
      level: 2,
      maxLevel: 5,
      pointsRequired: 500,
      unlocked: true,
      category: 'farming'
    },
    {
      id: 'water_conservation',
      name: 'Water Conservation Expert',
      description: 'Learn advanced irrigation techniques',
      icon: <Droplets className="w-6 h-6" />,
      level: 1,
      maxLevel: 3,
      pointsRequired: 300,
      unlocked: true,
      category: 'sustainability'
    },
    {
      id: 'pest_management',
      name: 'Pest Management Pro',
      description: 'Identify and manage pests naturally',
      icon: <Zap className="w-6 h-6" />,
      level: 0,
      maxLevel: 4,
      pointsRequired: 750,
      unlocked: false,
      category: 'farming'
    },
    {
      id: 'solar_power',
      name: 'Solar Power Pioneer',
      description: 'Implement solar solutions for farming',
      icon: <Sun className="w-6 h-6" />,
      level: 0,
      maxLevel: 3,
      pointsRequired: 1000,
      unlocked: false,
      category: 'technology'
    },
    {
      id: 'wind_energy',
      name: 'Wind Energy Expert',
      description: 'Harness wind power for your farm',
      icon: <Wind className="w-6 h-6" />,
      level: 0,
      maxLevel: 2,
      pointsRequired: 1200,
      unlocked: false,
      category: 'technology'
    },
    {
      id: 'community_leader',
      name: 'Community Leader',
      description: 'Help and mentor other farmers',
      icon: <Star className="w-6 h-6" />,
      level: 1,
      maxLevel: 5,
      pointsRequired: 400,
      unlocked: true,
      category: 'community'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Skills', color: 'bg-gray-100 text-gray-800' },
    { id: 'farming', name: 'Farming', color: 'bg-green-100 text-green-800' },
    { id: 'sustainability', name: 'Sustainability', color: 'bg-blue-100 text-blue-800' },
    { id: 'technology', name: 'Technology', color: 'bg-purple-100 text-purple-800' },
    { id: 'community', name: 'Community', color: 'bg-orange-100 text-orange-800' }
  ]

  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory)

  const getSkillProgress = (skill: Skill) => {
    return (skill.level / skill.maxLevel) * 100
  }

  const getCategoryColor = (category: Skill['category']) => {
    const colors = {
      farming: 'border-green-200 bg-green-50',
      sustainability: 'border-blue-200 bg-blue-50',
      technology: 'border-purple-200 bg-purple-50',
      community: 'border-orange-200 bg-orange-50'
    }
    return colors[category]
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Skill Tree</h2>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-600">Level up your farming expertise!</span>
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

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
              skill.unlocked
                ? getCategoryColor(skill.category)
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            {/* Lock overlay for locked skills */}
            {!skill.unlocked && (
              <div className="absolute inset-0 bg-gray-900/10 rounded-xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                skill.unlocked ? 'bg-white shadow-sm' : 'bg-gray-200'
              }`}>
                {skill.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{skill.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{skill.description}</p>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Level {skill.level}/{skill.maxLevel}</span>
                    <span>{skill.pointsRequired} XP needed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getSkillProgress(skill)}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  {skill.unlocked ? (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">Unlocked</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">Locked</span>
                    </div>
                  )}

                  {skill.level > 0 && (
                    <div className="text-xs text-gray-500">
                      {Math.round(getSkillProgress(skill))}% Complete
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skill Tree Visualization Hint */}
      <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
        <div className="flex items-center space-x-2 mb-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">How Skill Trees Work</h3>
        </div>
        <p className="text-sm text-gray-600">
          Complete missions and challenges to earn XP and unlock new skills. Higher level skills provide better rewards and unlock advanced farming techniques. Connect with the community to learn from experienced farmers!
        </p>
      </div>
    </div>
  )
}