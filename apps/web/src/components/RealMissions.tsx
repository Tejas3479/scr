'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '@/services/sound'
import { Upload, CheckCircle, Lock, FileText, MapPin, Cloud, Droplet, Target, Star, ChevronDown, ChevronUp, X, Camera, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
      title: 'Precision Irrigation Setup',
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
    }
  ]

  const difficultyColors = {
    easy: 'border-neon-green/30 text-neon-green bg-neon-green/5 hover:border-neon-green/60 hover:shadow-[0_0_15px_rgba(0,255,65,0.08)]',
    medium: 'border-neon-orange/30 text-neon-orange bg-neon-orange/5 hover:border-neon-orange/60 hover:shadow-[0_0_15px_rgba(255,107,0,0.08)]',
    hard: 'border-neon-pink/30 text-neon-pink bg-neon-pink/5 hover:border-neon-pink/60 hover:shadow-[0_0_15px_rgba(255,0,107,0.08)]',
    expert: 'border-neon-purple/30 text-neon-purple bg-neon-purple/5 hover:border-neon-purple/60 hover:shadow-[0_0_15px_rgba(255,0,255,0.08)]'
  }

  const handleDifficultyFilter = (diff: 'all' | 'easy' | 'medium' | 'hard' | 'expert') => {
    playSound.tick()
    setFilterDifficulty(diff)
  }

  const handleExpandMission = (missionId: string) => {
    playSound.tick()
    setExpandedMission(expandedMission === missionId ? null : missionId)
  }

  const filteredMissions = filterDifficulty === 'all'
    ? missions
    : missions.filter(m => m.difficulty === filterDifficulty)

  return (
    <div className="min-h-screen bg-[#050810] text-white relative overflow-hidden selection:bg-neon-cyan selection:text-[#050810]">
      {/* Cyber Grid & Scanline Background Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:100%_30px] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:30px_100%] z-0" />

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-neon-cyan/5 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-neon-green/5 rounded-full filter blur-3xl opacity-15 animate-blob" style={{ animationDelay: '2000ms' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent uppercase tracking-wider font-display">🎯 Real Farm Missions</h1>
            <p className="text-emerald-300/60 tech-mono text-xs mt-0.5">COMPLETE REAL-WORLD VERIFICATION TASKS TO CLAIM SPL REWARDS</p>
          </div>
          
          <Link href="/dashboard" onMouseEnter={playSound.hover} onClick={playSound.tick} className="bg-cyber-dark hover:bg-neon-cyan/15 border border-neon-cyan/35 text-neon-cyan text-xs tech-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-glow-sm">
            <ArrowLeft className="w-3.5 h-3.5" /> COMMAND DECK
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {(['all', 'easy', 'medium', 'hard', 'expert'] as const).map(diff => (
            <button
              key={diff}
              onMouseEnter={playSound.hover}
              onClick={() => handleDifficultyFilter(diff)}
              className={`px-4 py-2 text-xs tech-mono font-bold rounded-lg transition-all capitalize border ${
                filterDifficulty === diff
                  ? 'bg-neon-cyan border-neon-cyan text-[#050810] shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'bg-[#050810]/75 border-white/10 text-white/70 hover:border-white/20'
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
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                difficultyColors[mission.difficulty]
              }`}
            >
              <button
                onMouseEnter={playSound.hover}
                onClick={() => handleExpandMission(mission.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/3 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 text-left">
                  <div className="text-3xl">{mission.category === 'Assessment' ? '🔍' : mission.category === 'Sustainability' ? '♻️' : mission.category === 'Water Management' ? '💧' : '🌾'}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white font-display text-base uppercase tracking-wider">{mission.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase border font-mono ${
                        mission.difficulty === 'easy' ? 'border-neon-green text-neon-green' : mission.difficulty === 'medium' ? 'border-neon-orange text-neon-orange' : 'border-neon-pink text-neon-pink'
                      }`}>
                        {mission.difficulty}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs font-sans leading-relaxed">{mission.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex gap-3 text-xs tech-mono">
                      <span className="text-neon-cyan font-bold">+{mission.reward.xp} XP</span>
                      <span className="text-neon-purple font-bold">+{mission.reward.tokens} SPL</span>
                    </div>
                    {mission.photoVerification.required && (
                      <div className="text-[10px] tech-mono text-emerald-300/40 mt-1 uppercase">
                        📸 {mission.photoVerification.uploadedPhotos}/{mission.photoVerification.minPhotos} UPLOADS
                      </div>
                    )}
                  </div>

                  {expandedMission === mission.id ? (
                    <ChevronUp className="w-5 h-5 text-white/50" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/50" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedMission === mission.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 pt-2 bg-[#050810] border-t border-white/5 space-y-6"
                  >
                    {/* Mission Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#050810]/80 p-4 rounded-xl border border-white/5">
                      <div>
                        <p className="text-white/40 text-[9px] tech-mono uppercase">SOIL PROFILE</p>
                        <p className="text-neon-cyan font-bold text-xs tech-mono uppercase">{mission.soilType}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-[9px] tech-mono uppercase">JURISDICTION</p>
                        <p className="text-neon-green font-bold text-xs tech-mono uppercase flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {mission.location}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-[9px] tech-mono uppercase">ATMOSPHERE</p>
                        <p className="text-neon-purple font-bold text-xs tech-mono uppercase flex items-center gap-1"><Cloud className="w-3.5 h-3.5" /> {mission.weather}</p>
                      </div>
                      {mission.deadline && (
                        <div>
                          <p className="text-white/40 text-[9px] tech-mono uppercase">DEADLINE LOCK</p>
                          <p className="text-neon-pink font-bold text-xs tech-mono uppercase">{mission.deadline}</p>
                        </div>
                      )}
                    </div>

                    {/* Progress */}
                    <div className="bg-[#050810]/50 p-4 border border-white/5 rounded-xl">
                      <div className="flex justify-between text-[10px] tech-mono mb-2 uppercase">
                        <span className="text-white/40">MISSION VECTOR PROGRESS</span>
                        <span className="text-neon-cyan font-bold">{mission.progress}%</span>
                      </div>
                      <div className="w-full bg-[#050810] rounded-full h-2 overflow-hidden border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-neon-green to-neon-cyan h-2 rounded-full shadow-glow-sm"
                          style={{ width: `${mission.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div>
                      <h4 className="font-bold text-white text-xs tech-mono mb-3 uppercase tracking-wider">Instructions Guidelines:</h4>
                      <ol className="space-y-2">
                        {mission.instructions.map((inst, idx) => (
                          <li key={idx} className="text-white/70 text-xs font-sans flex gap-3 leading-relaxed">
                            <span className="font-bold text-neon-cyan tech-mono flex-shrink-0">{idx + 1}.</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Tips */}
                    <div>
                      <h4 className="font-bold text-white text-xs tech-mono mb-3 uppercase tracking-wider">💡 Bio-Tips:</h4>
                      <ul className="space-y-2">
                        {mission.tips.map((tip, idx) => (
                          <li key={idx} className="text-white/60 text-xs font-sans flex gap-2 leading-relaxed">
                            <span className="text-neon-green flex-shrink-0">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Photo Upload Section */}
                    {mission.photoVerification.required && (
                      <div className="bg-[#050810]/80 border border-white/5 rounded-xl p-4 relative">
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-neon-cyan/40" />
                        
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-white text-xs tech-mono flex items-center gap-2 uppercase tracking-widest">
                            <Camera className="w-4 h-4 text-neon-cyan animate-pulse" />
                            GPS PHOTO VERIFICATION LAYER
                          </h4>
                          <span className="text-[10px] tech-mono text-neon-cyan font-bold">
                            {mission.photoVerification.uploadedPhotos}/{mission.photoVerification.minPhotos} PHOTOS
                          </span>
                        </div>

                        {mission.photoVerification.uploadedPhotos < mission.photoVerification.minPhotos ? (
                          <motion.button
                            onMouseEnter={playSound.hover}
                            onClick={() => {
                              playSound.tick();
                              setShowPhotoUpload(showPhotoUpload === mission.id ? null : mission.id);
                            }}
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            className="w-full py-3.5 border border-dashed border-neon-cyan/40 hover:border-neon-cyan rounded-xl text-neon-cyan text-xs tech-mono font-bold transition-all flex items-center justify-center gap-2 uppercase"
                          >
                            <Upload className="w-4.5 h-4.5 text-neon-cyan" />
                            UPLOAD PROOF IMAGES ({mission.photoVerification.uploadedPhotos}/{mission.photoVerification.minPhotos})
                          </motion.button>
                        ) : (
                          <div className="flex items-center gap-2 text-neon-green tech-mono text-xs font-bold uppercase animate-pulse">
                            <CheckCircle className="w-5 h-5 text-neon-green" />
                            Secure photo verification complete
                          </div>
                        )}

                        <AnimatePresence>
                          {showPhotoUpload === mission.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-4 pt-4 border-t border-white/5 overflow-hidden"
                            >
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="w-full text-xs tech-mono text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-neon-cyan file:bg-[#050810] file:text-neon-cyan file:text-xs file:font-bold file:tech-mono file:cursor-pointer"
                                onChange={(e) => {
                                  playSound.success()
                                  const count = (e.target.files?.length || 0) + mission.photoVerification.uploadedPhotos
                                  setUploadedPhotos({
                                    ...uploadedPhotos,
                                    [mission.id]: Math.min(count, mission.photoVerification.minPhotos)
                                  })
                                }}
                              />
                              <button 
                                onMouseEnter={playSound.hover}
                                onClick={() => {
                                  playSound.success()
                                  setShowPhotoUpload(null)
                                }}
                                className="mt-4 w-full px-4 py-2.5 bg-neon-cyan/15 hover:bg-neon-cyan/25 border border-neon-cyan/35 rounded-xl text-neon-cyan text-xs tech-mono font-bold transition-all uppercase tracking-wider"
                              >
                                Submit Photos to Enclave verification
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Action Button */}
                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onMouseEnter={playSound.hover}
                      onClick={() => {
                        playSound.success()
                      }}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold tech-mono uppercase tracking-wider border transition-all ${
                        mission.status === 'completed'
                          ? 'bg-neon-green/10 border-neon-green text-neon-green'
                          : mission.status === 'submitted'
                          ? 'bg-neon-purple/10 border-neon-purple text-neon-purple shadow-glow-sm'
                          : 'bg-[#050810] hover:bg-neon-cyan/15 border-neon-cyan text-neon-cyan'
                      }`}
                    >
                      {mission.status === 'completed' && '✓ Completed & Certified'}
                      {mission.status === 'submitted' && '⏳ Attestation Challenge Pending'}
                      {mission.status === 'in-progress' && 'Resume Mission Sequence'}
                      {mission.status === 'available' && 'Start Bio-Mission'}
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
