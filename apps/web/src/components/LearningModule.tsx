'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '@/services/sound'
import { BookOpen, Play, CheckCircle, Lock, Star, Clock, Users, Award, ChevronDown, ChevronUp, Youtube, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  title: string
  description: string
  duration: number
  type: 'video' | 'lecture' | 'article' | 'quiz'
  youtubeUrl?: string
  content?: string
  completed: boolean
  locked: boolean
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  order: number
}

interface Course {
  id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  instructor: string
  rating: number
  reviews: number
  students: number
  thumbnail: string
  lessons: Lesson[]
  progress: number
  category: string
}

export default function LearningModule() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null)

  const courses: Course[] = [
    {
      id: 'soil-health',
      title: 'Soil Health & Management',
      description: 'Learn about soil composition, testing, and organic matter management',
      level: 'beginner',
      instructor: 'Dr. Priya Sharma',
      rating: 4.8,
      reviews: 234,
      students: 1250,
      thumbnail: '🌱',
      category: 'Fundamentals',
      progress: 45,
      lessons: [
        {
          id: 'l1',
          title: 'Introduction to Soil Types',
          description: 'Understanding clay, sandy, and loam soils',
          duration: 12,
          type: 'video',
          youtubeUrl: 'https://youtube.com/watch?v=soil101',
          completed: true,
          locked: false,
          difficulty: 'beginner',
          order: 1
        },
        {
          id: 'l2',
          title: 'Soil pH & Testing',
          description: 'How to test and adjust soil pH for optimal growth',
          duration: 15,
          type: 'video',
          youtubeUrl: 'https://youtube.com/watch?v=soilph',
          completed: true,
          locked: false,
          difficulty: 'beginner',
          order: 2
        },
        {
          id: 'l3',
          title: 'Organic Matter Management',
          description: 'Adding compost and organic materials to improve soil',
          duration: 18,
          type: 'lecture',
          completed: false,
          locked: false,
          difficulty: 'intermediate',
          order: 3
        },
        {
          id: 'l4',
          title: 'Soil Testing Lab',
          description: 'Interactive soil testing guide with recommendations',
          duration: 20,
          type: 'article',
          completed: false,
          locked: false,
          difficulty: 'intermediate',
          order: 4
        }
      ]
    },
    {
      id: 'crop-selection',
      title: 'Smart Crop Selection',
      description: 'Choose the right crops based on your soil, climate, and market',
      level: 'beginner',
      instructor: 'Rajesh Patel',
      rating: 4.7,
      reviews: 189,
      students: 950,
      thumbnail: '🌾',
      category: 'Planning',
      progress: 20,
      lessons: [
        {
          id: 'l5',
          title: 'Climate & Crop Matching',
          description: 'Best crops for your region and season',
          duration: 14,
          type: 'video',
          youtubeUrl: 'https://youtube.com/watch?v=cropclimate',
          completed: true,
          locked: false,
          difficulty: 'beginner',
          order: 1
        },
        {
          id: 'l6',
          title: 'Soil Type Compatibility',
          description: 'Which crops grow best in your soil type',
          duration: 16,
          type: 'video',
          youtubeUrl: 'https://youtube.com/watch?v=soilcrops',
          completed: false,
          locked: false,
          difficulty: 'beginner',
          order: 2
        },
        {
          id: 'l7',
          title: 'Market Demand Analysis',
          description: 'Understand market trends and demand',
          duration: 22,
          type: 'lecture',
          completed: false,
          locked: true,
          difficulty: 'intermediate',
          order: 3
        }
      ]
    },
    {
      id: 'organic-farming',
      title: 'Organic Farming Practices',
      description: 'Complete guide to sustainable and organic farming methods',
      level: 'intermediate',
      instructor: 'Meera Deshmukh',
      rating: 4.9,
      reviews: 456,
      students: 2100,
      thumbnail: '♻️',
      category: 'Sustainable',
      progress: 65,
      lessons: [
        {
          id: 'l8',
          title: 'Composting Basics',
          description: 'Create high-quality compost for your farm',
          duration: 18,
          type: 'video',
          youtubeUrl: 'https://youtube.com/watch?v=composting',
          completed: true,
          locked: false,
          difficulty: 'beginner',
          order: 1
        },
        {
          id: 'l9',
          title: 'Natural Pest Control',
          description: 'Organic solutions for common pests',
          duration: 25,
          type: 'lecture',
          completed: true,
          locked: false,
          difficulty: 'intermediate',
          order: 2
        },
        {
          id: 'l10',
          title: 'Certification Process',
          description: 'Steps to get organic farming certification',
          duration: 20,
          type: 'article',
          completed: false,
          locked: false,
          difficulty: 'intermediate',
          order: 3
        }
      ]
    }
  ]

  const selectedCourseData = courses.find(c => c.id === selectedCourse)

  const handleCourseSelect = (id: string) => {
    playSound.success()
    setSelectedCourse(id)
  }

  const handleLessonClick = (lessonId: string, locked: boolean) => {
    if (locked) {
      playSound.alarm()
      return
    }
    playSound.tick()
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId)
  }

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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent uppercase tracking-wider font-display">📚 Cognitive Academy</h1>
            <p className="text-emerald-300/60 tech-mono text-xs mt-0.5">VERIFIED EXPERT-LED COGNITIVE FARMING PROTOCOLS</p>
          </div>
          
          <Link href="/dashboard" onMouseEnter={playSound.hover} onClick={playSound.tick} className="bg-cyber-dark hover:bg-neon-cyan/15 border border-neon-cyan/35 text-neon-cyan text-xs tech-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-glow-sm">
            <ArrowLeft className="w-3.5 h-3.5" /> COMMAND DECK
          </Link>
        </div>

        {!selectedCourse ? (
          <>
            {/* Learning Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div 
                onMouseEnter={playSound.hover}
                className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-green/20 rounded-2xl p-6 hover:border-neon-green/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-green/50" />
                <div className="text-2xl font-bold text-neon-green font-mono">03</div>
                <p className="text-emerald-300/60 tech-mono text-[9px] uppercase mt-2 tracking-wider">ACTIVE COURSES</p>
              </div>

              <div 
                onMouseEnter={playSound.hover}
                className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-cyan/20 rounded-2xl p-6 hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan/50" />
                <div className="text-2xl font-bold text-neon-cyan font-mono">28 HRS</div>
                <p className="text-emerald-300/60 tech-mono text-[9px] uppercase mt-2 tracking-wider">TIME LEARNED</p>
              </div>

              <div 
                onMouseEnter={playSound.hover}
                className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-orange/20 rounded-2xl p-6 hover:border-neon-orange/60 hover:shadow-[0_0_20px_rgba(255,107,0,0.1)] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-orange/50" />
                <div className="text-2xl font-bold text-neon-orange font-mono">12</div>
                <p className="text-emerald-300/60 tech-mono text-[9px] uppercase mt-2 tracking-wider">CERTIFICATES</p>
              </div>

              <div 
                onMouseEnter={playSound.hover}
                className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-purple/20 rounded-2xl p-6 hover:border-neon-purple/60 hover:shadow-[0_0_20px_rgba(255,0,255,0.1)] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-purple/50" />
                <div className="text-2xl font-bold text-neon-purple font-mono">89%</div>
                <p className="text-emerald-300/60 tech-mono text-[9px] uppercase mt-2 tracking-wider">AVG SCORE</p>
              </div>
            </div>

            {/* Explore Courses */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-neon-cyan mb-4 tech-mono uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-neon-cyan animate-pulse" />
                EXPLORING BIO-COGNITIVE MODULES
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <motion.button
                    key={course.id}
                    onMouseEnter={playSound.hover}
                    onClick={() => handleCourseSelect(course.id)}
                    whileHover={{ scale: 1.02 }}
                    className="glass-hud border-neon-cyan/20 hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] rounded-2xl p-6 text-left relative overflow-hidden flex flex-col justify-between min-h-[300px]"
                  >
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neon-cyan/40" />
                    
                    <div>
                      <div className="text-4xl mb-4">{course.thumbnail}</div>
                      <h3 className="text-base font-bold text-white mb-2 font-display uppercase tracking-wider">{course.title}</h3>
                      <p className="text-white/60 text-xs mb-4 leading-relaxed font-sans">{course.description}</p>
                    </div>
                    
                    <div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-[10px] tech-mono">
                          <span className="text-white/40 uppercase">Module Progress</span>
                          <span className="font-bold text-neon-green">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-[#050810] rounded-full h-2 overflow-hidden border border-white/5">
                          <div 
                            className="bg-gradient-to-r from-neon-green to-neon-cyan h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] tech-mono text-white/40 pt-2.5 border-t border-white/5 uppercase">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-neon-purple text-neon-purple" />
                          <span className="text-neon-purple font-bold">{course.rating}</span>
                        </div>
                        <span>{course.students} ENROLLED</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-hud border-neon-cyan/30 rounded-3xl p-8 relative shadow-glow-sm"
          >
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-cyan" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-cyan" />
            
            {/* Course Header */}
            <div className="flex items-start justify-between mb-8 pb-4 border-b border-white/5">
              <div>
                <button
                  onMouseEnter={playSound.hover}
                  onClick={() => {
                    playSound.tick()
                    setSelectedCourse(null)
                    setExpandedLesson(null)
                  }}
                  className="bg-[#050810] border border-neon-cyan/40 hover:border-neon-cyan text-neon-cyan text-[10px] tech-mono font-bold px-4 py-2 rounded-xl transition-all uppercase tracking-wider mb-4 flex items-center gap-1.5"
                >
                  ← BACK TO ACADEMY
                </button>
                
                <h2 className="text-2xl font-bold text-white font-display uppercase tracking-wider mb-2">{selectedCourseData?.title}</h2>
                <p className="text-white/60 text-sm mb-4 leading-relaxed font-sans">{selectedCourseData?.description}</p>
                
                <div className="flex flex-wrap gap-4 text-[10px] tech-mono uppercase">
                  <div className="flex items-center gap-2 text-white/50">
                    <Users className="w-4 h-4 text-neon-cyan" />
                    {selectedCourseData?.students} enrolled
                  </div>
                  <div className="flex items-center gap-2 text-neon-purple font-bold">
                    <Star className="w-4 h-4 fill-neon-purple text-neon-purple animate-pulse" />
                    {selectedCourseData?.rating} rating
                  </div>
                  <div className="flex items-center gap-2 text-white/50">
                    <BookOpen className="w-4 h-4 text-neon-cyan" />
                    {selectedCourseData?.lessons.length} lessons
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 bg-[#050810]/50 p-4 border border-white/5 rounded-2xl">
              <div className="flex justify-between text-xs tech-mono mb-2 uppercase">
                <span className="text-white/40">MODULE COMPLETION PROFILE</span>
                <span className="font-bold text-neon-green">{selectedCourseData?.progress}%</span>
              </div>
              <div className="w-full bg-[#050810] rounded-full h-3 overflow-hidden border border-white/10">
                <div 
                  className="bg-gradient-to-r from-neon-green to-neon-cyan h-3 rounded-full transition-all duration-500 shadow-glow-sm"
                  style={{ width: `${selectedCourseData?.progress}%` }}
                />
              </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-3">
              {selectedCourseData?.lessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className="bg-[#050810]/60 border border-white/5 rounded-2xl overflow-hidden hover:border-neon-cyan/30 transition-all"
                >
                  <button
                    onMouseEnter={playSound.hover}
                    onClick={() => handleLessonClick(lesson.id, lesson.locked)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-neon-cyan/3 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0 animate-pulse" />
                      ) : lesson.locked ? (
                        <Lock className="w-5 h-5 text-white/30 flex-shrink-0" />
                      ) : (
                        <Play className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                      )}
                      
                      <div>
                        <h4 className="font-bold text-white text-sm tech-display uppercase tracking-wider">{lesson.title}</h4>
                        <p className="text-white/50 text-xs mt-0.5 leading-relaxed font-sans">{lesson.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-[10px] tech-mono text-white/40 flex items-center gap-1.5 uppercase">
                        <Clock className="w-3.5 h-3.5 text-neon-cyan" />
                        {lesson.duration}m
                      </div>
                      {expandedLesson === lesson.id ? (
                        <ChevronUp className="w-5 h-5 text-neon-cyan" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-neon-cyan" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedLesson === lesson.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-5 pt-3 bg-[#050810] border-t border-white/5"
                      >
                        {lesson.type === 'video' && lesson.youtubeUrl && (
                          <a
                            href={lesson.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={playSound.hover}
                            onClick={playSound.tick}
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-xs tech-mono font-bold transition-all hover:scale-[1.02]"
                          >
                            <Youtube className="w-4 h-4 text-red-400" />
                            WATCH STREAM VIDEO
                          </a>
                        )}
                        
                        {lesson.type === 'quiz' && (
                          <button 
                            onMouseEnter={playSound.hover}
                            onClick={() => {
                              playSound.success()
                            }}
                            className="mt-2 px-4 py-2.5 bg-neon-cyan/15 hover:bg-neon-cyan/25 border border-neon-cyan/35 rounded-xl text-neon-cyan text-xs tech-mono font-bold transition-all hover:scale-[1.02]"
                          >
                            START SECURED QUIZ CHALLENGE
                          </button>
                        )}

                        {!lesson.completed && (
                          <button 
                            onMouseEnter={playSound.hover}
                            onClick={() => {
                              playSound.success()
                            }}
                            className="mt-2 px-4 py-2.5 ml-2 bg-neon-green/15 hover:bg-neon-green/25 border border-neon-green/35 rounded-xl text-neon-green text-xs tech-mono font-bold transition-all hover:scale-[1.02]"
                          >
                            MARK MODULE AS COMPLETED
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
