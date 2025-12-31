'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, CheckCircle, Lock, FileText, MapPin, Cloud, Droplet, Target, Star, ChevronDown, ChevronUp, X, Camera } from 'lucide-react'

interface Mission {
  id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  category: string
  soilType?: string
  location?: string
  weather?: string
  reward: { xp: number; tokens: number; badge?: string }
  tasks: Task[]
  progress: number
  photoVerification: {
    required: boolean
    minPhotos: number
    uploadedPhotos: number
    verified: boolean
  }
  status: 'available' | 'in-progress' | 'submitted' | 'completed'
  deadline?: string
  instructions: string[]
  tips: string[]
}

interface Task {
  id: string
  description: string
  completed: boolean
}

export default function RealMissions() {
  const [expandedMission, setExpandedMission] = useState<string | null>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard' | 'expert'>('all')
  const [showPhotoUpload, setShowPhotoUpload] = useState<string | null>(null)
  const [uploadedPhotos, setUploadedPhotos] = useState<{ [key: string]: number }>({})

  const missions: Mission[] = [
    {
      id: 'm1',
      title: 'Soil Testing & Documentation',
      description: 'Conduct soil test and document findings with photos at 3 different spots in your field',
      difficulty: 'easy',
      category: 'Assessment',
      soilType: 'Loamy',
      location: 'Maharashtra',
      weather: 'Sunny',
      reward: { xp: 150, tokens: 100, badge: '🧪 Soil Expert' },
      status: 'available',
      progress: 0,
      photoVerification: { required: true, minPhotos: 3, uploadedPhotos: 0, verified: false },
      tasks: [
        { id: 't1', description: 'Collect soil samples from 3 locations', completed: false },
        { id: 't2', description: 'Test pH, moisture, and fertility', completed: false },
        { id: 't3', description: 'Upload 3+ clear photos', completed: false }
      ],
      instructions: [
        'Collect soil samples from 3 different locations in your field',
        'Take photos of each soil test location (GPS location if possible)',
        'Test pH, moisture, and fertility using soil test kit',
        'Document results in the provided form',
        'Upload at least 3 clear photos showing the process'
      ],
      tips: [
        'Test soil at 6-8 inches depth for best results',
        'Take photos during daylight for clarity',
        'Include landmarks or field markers in photos',
        'Document exact location coordinates if possible'
      ]
    },
    {
      id: 'm2',
      title: 'Organic Compost Preparation',
      description: 'Prepare organic compost and document the entire process with photos',
      difficulty: 'medium',
      category: 'Sustainability',
      soilType: 'All',
      location: 'All Regions',
      weather: 'Any',
      reward: { xp: 250, tokens: 200, badge: '♻️ Eco Guardian' },
      status: 'in-progress',
      progress: 40,
      photoVerification: { required: true, minPhotos: 5, uploadedPhotos: 2, verified: false },
      tasks: [
        { id: 't1', description: 'Gather organic materials', completed: true },
        { id: 't2', description: 'Build compost pile with proper layering', completed: true },
        { id: 't3', description: 'Maintain for 4-6 weeks', completed: false },
        { id: 't4', description: 'Upload 5+ documentation photos', completed: false }
      ],
      instructions: [
        'Gather organic materials (kitchen waste, leaves, grass)',
        'Build a compost pile with proper layering',
        'Document each layer with photos',
        'Maintain compost for 4-6 weeks (take weekly photos)',
        'Create finished compost and take final photos',
        'Upload at least 5 photos showing the complete process'
      ],
      tips: [
        'Use brown and green materials in 2:1 ratio',
        'Keep moisture like a wrung-out sponge',
        'Turn compost every 1-2 weeks for faster decomposition',
        'Temperature should reach 60-70°C at center'
      ]
    },
    {
      id: 'm3',
      title: 'Precision Irrigation System Setup',
      description: 'Install drip irrigation system and document installation with 10 photos',
      difficulty: 'hard',
      category: 'Water Management',
      soilType: 'All',
      location: 'Water-Scarce Areas',
      weather: 'Dry',
      reward: { xp: 400, tokens: 350, badge: '💧 Water Wizard' },
      status: 'available',
      progress: 0,
      photoVerification: { required: true, minPhotos: 10, uploadedPhotos: 0, verified: false },
      tasks: [
        { id: 't1', description: 'Plan irrigation layout', completed: false },
        { id: 't2', description: 'Install main and secondary pipelines', completed: false },
        { id: 't3', description: 'Install drippers and test system', completed: false },
        { id: 't4', description: 'Upload 10+ installation photos', completed: false }
      ],
      instructions: [
        'Plan irrigation layout for your field',
        'Install main pipeline from water source',
        'Install secondary lines and drippers',
        'Test system for proper water flow',
        'Adjust drip spacing based on crop needs',
        'Document entire installation process',
        'Upload at least 10 detailed photos'
      ],
      tips: [
        'Use quality pipes to minimize leakage',
        'Adjust drip spacing: 60cm for vegetables, 90cm for crops',
        'Install filters to prevent clogging',
        'Test system before regular use'
      ]
    },
    {
      id: 'm4',
      title: 'Natural Pest Management Implementation',
      description: 'Implement natural pest control methods and document with photo evidence',
      difficulty: 'medium',
      category: 'Pest Control',
      soilType: 'All',
      location: 'All Regions',
      weather: 'Warm',
      reward: { xp: 300, tokens: 250, badge: '🐛 Pest Master' },
      status: 'available',
      progress: 0,
      photoVerification: { required: true, minPhotos: 8, uploadedPhotos: 0, verified: false },
      tasks: [
        { id: 't1', description: 'Identify pests in field', completed: false },
        { id: 't2', description: 'Prepare natural pesticide', completed: false },
        { id: 't3', description: 'Apply pesticide and document results', completed: false },
        { id: 't4', description: 'Upload 8+ verification photos', completed: false }
      ],
      instructions: [
        'Identify pests in your field',
        'Prepare natural pesticide (neem oil, chili spray)',
        'Apply pesticide using appropriate method',
        'Document affected plants before treatment (photos)',
        'Document treatment process (photos)',
        'Document results after 1-2 weeks (photos)',
        'Record pest count changes',
        'Upload at least 8 verification photos'
      ],
      tips: [
        'Apply early morning or late evening',
        'Use neem oil for soft-bodied insects',
        'Rotate methods to prevent resistance',
        'Monitor plants for 2-3 weeks after treatment'
      ]
    },
    {
      id: 'm5',
      title: 'Crop Rotation Planning & Execution',
      description: 'Plan and execute crop rotation for soil health improvement',
      difficulty: 'expert',
      category: 'Sustainable Agriculture',
      soilType: 'All',
      location: 'All Regions',
      weather: 'Any',
      reward: { xp: 500, tokens: 450, badge: '🌾 Harvest Master' },
      status: 'available',
      progress: 0,
      photoVerification: { required: true, minPhotos: 10, uploadedPhotos: 0, verified: false },
      deadline: '90 days',
      tasks: [
        { id: 't1', description: 'Plan crop rotation strategy', completed: false },
        { id: 't2', description: 'Prepare field for new crop', completed: false },
        { id: 't3', description: 'Plant and maintain new crop', completed: false },
        { id: 't4', description: 'Document with 10+ photos and generate report', completed: false }
      ],
      instructions: [
        'Document current crop in field',
        'Plan rotation based on soil type and requirements',
        'Prepare field for new crop',
        'Plant new crop according to plan',
        'Maintain crop for full cycle',
        'Document each step with photos (minimum 10)',
        'Record yield and observations',
        'Generate rotation summary report'
      ],
      tips: [
        'Follow legume-cereal-root vegetable rotation',
        'Use nitrogen-fixing crops to restore soil',
        'Plan 2-3 years ahead',
        'Consider market demand for chosen crops'
      ]
    }
  ]

  const difficultyColors = {
    easy: 'bg-green-600/20 border-green-500/30 text-green-400',
    medium: 'bg-yellow-600/20 border-yellow-500/30 text-yellow-400',
    hard: 'bg-orange-600/20 border-orange-500/30 text-orange-400',
    expert: 'bg-red-600/20 border-red-500/30 text-red-400'
  }

  const filteredMissions = filterDifficulty === 'all'
    ? missions
    : missions.filter(m => m.difficulty === filterDifficulty)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">🎯 Real Farm Missions</h1>
          <p className="text-emerald-300/70">Complete real-world tasks with photo verification for authentic learning</p>
        </div>

        {/* Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {['all', 'easy', 'medium', 'hard', 'expert'].map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                filterDifficulty === diff
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/50'
                  : 'bg-slate-700/50 text-emerald-300/70 hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Missions Grid */}
        <div className="space-y-4">
          {filteredMissions.map((mission) => (
            <motion.div
              key={mission.id}
              className={`bg-slate-800/50 backdrop-blur-xl border rounded-2xl overflow-hidden hover:border-emerald-400/50 transition-all ${
                difficultyColors[mission.difficulty]
              }`}
            >
              <button
                onClick={() => setExpandedMission(expandedMission === mission.id ? null : mission.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div className="text-3xl">{mission.category === 'Assessment' ? '🔍' : mission.category === 'Sustainability' ? '♻️' : mission.category === 'Water Management' ? '💧' : mission.category === 'Pest Control' ? '🐛' : '🌾'}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-emerald-400">{mission.title}</h3>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize border ${difficultyColors[mission.difficulty]}`}>
                        {mission.difficulty}
                      </span>
                    </div>
                    <p className="text-emerald-300/70 text-sm">{mission.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex gap-3 text-sm">
                      <span className="text-emerald-400 font-bold">{mission.reward.xp} XP</span>
                      <span className="text-yellow-400 font-bold">{mission.reward.tokens} 💰</span>
                    </div>
                    {mission.photoVerification.required && (
                      <div className="text-xs text-emerald-300/60 mt-1">
                        📸 {mission.photoVerification.uploadedPhotos}/{mission.photoVerification.minPhotos}
                      </div>
                    )}
                  </div>

                  {expandedMission === mission.id ? (
                    <ChevronUp className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedMission === mission.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 bg-slate-800/80 border-t border-emerald-500/20 space-y-6"
                  >
                    {/* Mission Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <p className="text-emerald-300/60 text-xs">Soil Type</p>
                        <p className="text-emerald-400 font-semibold">{mission.soilType}</p>
                      </div>
                      <div>
                        <p className="text-emerald-300/60 text-xs">Location</p>
                        <p className="text-emerald-400 font-semibold flex items-center gap-1"><MapPin className="w-3 h-3" /> {mission.location}</p>
                      </div>
                      <div>
                        <p className="text-emerald-300/60 text-xs">Weather</p>
                        <p className="text-emerald-400 font-semibold flex items-center gap-1"><Cloud className="w-3 h-3" /> {mission.weather}</p>
                      </div>
                      {mission.deadline && (
                        <div>
                          <p className="text-emerald-300/60 text-xs">Deadline</p>
                          <p className="text-emerald-400 font-semibold">{mission.deadline}</p>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-emerald-300/70">Mission Progress</span>
                        <span className="text-emerald-400 font-bold">{mission.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full"
                          style={{ width: `${mission.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h4 className="font-bold text-emerald-400 mb-3">Instructions:</h4>
                      <ol className="space-y-2">
                        {mission.instructions.map((inst, idx) => (
                          <li key={idx} className="text-emerald-300/70 text-sm flex gap-3">
                            <span className="font-bold text-emerald-400 flex-shrink-0">{idx + 1}.</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Tips */}
                    <div>
                      <h4 className="font-bold text-emerald-400 mb-3">💡 Tips:</h4>
                      <ul className="space-y-2">
                        {mission.tips.map((tip, idx) => (
                          <li key={idx} className="text-emerald-300/70 text-sm flex gap-2">
                            <span className="text-emerald-400 flex-shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Photo Upload Section */}
                    {mission.photoVerification.required && (
                      <div className="bg-slate-700/50 border border-emerald-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Photo Verification
                          </h4>
                          <span className="text-sm text-emerald-300/70">
                            {mission.photoVerification.uploadedPhotos}/{mission.photoVerification.minPhotos} photos
                          </span>
                        </div>

                        {mission.photoVerification.uploadedPhotos < mission.photoVerification.minPhotos ? (
                          <motion.button
                            onClick={() => setShowPhotoUpload(showPhotoUpload === mission.id ? null : mission.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 rounded-xl text-emerald-400 font-semibold transition-all flex items-center justify-center gap-2"
                          >
                            <Upload className="w-5 h-5" />
                            Upload Photos ({mission.photoVerification.uploadedPhotos}/{mission.photoVerification.minPhotos})
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            All required photos uploaded
                          </div>
                        )}

                        <AnimatePresence>
                          {showPhotoUpload === mission.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-4 pt-4 border-t border-emerald-500/20"
                            >
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="w-full"
                                onChange={(e) => {
                                  const count = (e.target.files?.length || 0) + mission.photoVerification.uploadedPhotos
                                  setUploadedPhotos({
                                    ...uploadedPhotos,
                                    [mission.id]: Math.min(count, mission.photoVerification.minPhotos)
                                  })
                                }}
                              />
                              <button className="mt-3 w-full px-4 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/30 rounded-lg text-emerald-400 transition-all">
                                Submit for Verification
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        mission.status === 'completed'
                          ? 'bg-green-600/30 border border-green-500/30 text-green-400'
                          : mission.status === 'submitted'
                          ? 'bg-blue-600/30 border border-blue-500/30 text-blue-400'
                          : 'bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {mission.status === 'completed' && '✓ Completed'}
                      {mission.status === 'submitted' && '⏳ Under Verification'}
                      {mission.status === 'in-progress' && 'Continue Mission'}
                      {mission.status === 'available' && 'Start Mission'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
