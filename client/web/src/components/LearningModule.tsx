'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Play, CheckCircle, Lock, Star, Clock, Users, Award, ChevronDown, ChevronUp, Youtube } from 'lucide-react'

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
    },
    {
      id: 'precision-farming',
      title: 'Precision Agriculture & Tech',
      description: 'Using technology and data for better farming decisions',
      level: 'advanced',
      instructor: 'Dr. Arun Kumar',
      rating: 4.6,
      reviews: 124,
      students: 650,
      thumbnail: '📊',
      category: 'Technology',
      progress: 0,
      lessons: [
        {
          id: 'l11',
          title: 'IoT Sensors in Farming',
          description: 'Use sensors for soil and crop monitoring',
          duration: 28,
          type: 'video',
          youtubeUrl: 'https://youtube.com/watch?v=iot-farming',
          completed: false,
          locked: true,
          difficulty: 'advanced',
          order: 1
        }
      ]
    }
  ]

  const selectedCourseData = courses.find(c => c.id === selectedCourse)

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-2">📚 Learning Center</h1>
          <p className="text-emerald-300/70">Master farming with expert-led courses tailored to your journey</p>
        </div>

        {!selectedCourse ? (
          <>
            {/* Learning Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-6 hover:border-emerald-400/50 transition-all">
                <div className="text-3xl font-bold text-emerald-400">4</div>
                <p className="text-emerald-300/70 text-sm mt-2">Active Courses</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:border-blue-400/50 transition-all">
                <div className="text-3xl font-bold text-blue-400">28 hrs</div>
                <p className="text-blue-300/70 text-sm mt-2">Hours Learned</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="text-3xl font-bold text-yellow-400">12</div>
                <p className="text-yellow-300/70 text-sm mt-2">Certificates</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all">
                <div className="text-3xl font-bold text-purple-400">89%</div>
                <p className="text-purple-300/70 text-sm mt-2">Avg Score</p>
              </div>
            </div>

            {/* Filter by Category */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-emerald-400 mb-4">Explore Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <motion.button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 hover:border-emerald-400/50 transition-all text-left group"
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{course.thumbnail}</div>
                    <h3 className="text-lg font-bold text-emerald-400 mb-2">{course.title}</h3>
                    <p className="text-emerald-300/70 text-sm mb-4">{course.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-emerald-300/70">Progress</span>
                        <span className="font-bold text-emerald-400">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-emerald-300/60">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                      <span>{course.students} students</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8"
          >
            {/* Course Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => {
                      setSelectedCourse(null)
                      setExpandedLesson(null)
                    }}
                    className="bg-slate-700/50 hover:bg-slate-700 text-emerald-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                </div>
                <h2 className="text-3xl font-bold text-emerald-400 mb-2">{selectedCourseData?.title}</h2>
                <p className="text-emerald-300/70 mb-4">{selectedCourseData?.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-emerald-300/70">
                    <Users className="w-4 h-4" />
                    {selectedCourseData?.students} students
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300/70">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {selectedCourseData?.rating} ({selectedCourseData?.reviews} reviews)
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300/70">
                    <BookOpen className="w-4 h-4" />
                    {selectedCourseData?.lessons.length} lessons
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-emerald-300/70 mb-2">
                <span>Course Progress</span>
                <span className="font-bold text-emerald-400">{selectedCourseData?.progress}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-emerald-500/30">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-green-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${selectedCourseData?.progress}%` }}
                />
              </div>
            </div>

            {/* Lessons List */}
            <div className="space-y-3">
              {selectedCourseData?.lessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  className="bg-slate-700/30 border border-emerald-500/20 rounded-xl overflow-hidden hover:border-emerald-400/50 transition-all"
                >
                  <button
                    onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
                    disabled={lesson.locked}
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      {lesson.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : lesson.locked ? (
                        <Lock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <Play className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      )}
                      
                      <div>
                        <h4 className="font-semibold text-emerald-400">{lesson.title}</h4>
                        <p className="text-emerald-300/60 text-sm">{lesson.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-emerald-300/60 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {lesson.duration}m
                      </div>
                      {expandedLesson === lesson.id ? (
                        <ChevronUp className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-emerald-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedLesson === lesson.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-4 bg-slate-800/50 border-t border-emerald-500/20"
                      >
                        {lesson.type === 'video' && lesson.youtubeUrl && (
                          <a
                            href={lesson.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 rounded-lg text-red-400 transition-all"
                          >
                            <Youtube className="w-4 h-4" />
                            Watch on YouTube
                          </a>
                        )}
                        
                        {lesson.type === 'quiz' && (
                          <button className="mt-4 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 rounded-lg text-blue-400 transition-all">
                            Start Quiz
                          </button>
                        )}

                        {!lesson.completed && (
                          <button className="mt-4 px-4 py-2 ml-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/30 rounded-lg text-emerald-400 transition-all">
                            Mark Complete
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
