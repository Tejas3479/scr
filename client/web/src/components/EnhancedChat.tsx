'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Image as ImageIcon, Loader, CheckCircle, AlertCircle, X, Lightbulb, MessageSquare } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'expert' | 'ai-verification'
  content: string
  image?: string
  timestamp: Date
  status?: 'sending' | 'sent' | 'verifying' | 'verified' | 'needs-more-info'
  expert?: string
}

export default function EnhancedChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'expert',
      expert: 'Dr. Harish Patel',
      content: 'Hello! I\'m Dr. Harish Patel, a soil management expert. How can I help you with your farming questions today?',
      timestamp: new Date(Date.now() - 5000)
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedExpert, setSelectedExpert] = useState('Dr. Harish Patel')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const experts = [
    { name: 'Dr. Harish Patel', specialty: 'Soil & Fertilizer', online: true, emoji: '🧪' },
    { name: 'Priya Sharma', specialty: 'Crop Management', online: true, emoji: '🌾' },
    { name: 'Rajesh Kumar', specialty: 'Pest Control', online: false, emoji: '🐛' },
    { name: 'Aisha Gupta', specialty: 'Water Management', online: true, emoji: '💧' }
  ]

  const quickQuestions = [
    '🤔 How to test soil pH?',
    '💧 When should I irrigate?',
    '🐛 How to manage pests naturally?',
    '📸 Is my soil healthy?',
    '🌾 Best crop for monsoon?'
  ]

  // Mock AI verification responses
  const aiResponses = [
    { status: 'verified' as const, message: 'Perfect! Your soil looks healthy with good texture and color. The moisture level appears optimal for tomato cultivation. 📊' },
    { status: 'verified' as const, message: 'Excellent work! I can see proper compost decomposition. The color and structure indicate readiness for use. ✓' },
    { status: 'needs-more-info' as const, message: 'Good effort! However, I need closer photos of the pest damage area and surrounding leaves to provide accurate identification.' },
    { status: 'verified' as const, message: 'Outstanding! Your irrigation system is properly installed. Water flow distribution looks uniform. Great work! 💧' },
    { status: 'needs-more-info' as const, message: 'I can see the process, but I need photos from different angles to verify the soil test kit readings.' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      image: imagePreview || undefined,
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setSelectedImage(null)
    setImagePreview(null)
    setIsLoading(true)

    // Simulate AI verification if image is uploaded
    if (imagePreview) {
      setTimeout(() => {
        const verificationMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai-verification',
          content: 'Analyzing image...',
          timestamp: new Date(),
          status: 'verifying'
        }
        setMessages(prev => [...prev, verificationMessage])

        // Simulate verification process
        setTimeout(() => {
          const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
          setMessages(prev => [
            ...prev.slice(0, -1),
            {
              id: (Date.now() + 1).toString(),
              type: 'ai-verification',
              content: randomResponse.message,
              timestamp: new Date(),
              status: randomResponse.status
            }
          ])

          // Add expert follow-up
          setTimeout(() => {
            const expertMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              type: 'expert',
              expert: selectedExpert,
              content: randomResponse.status === 'verified'
                ? 'Great! Now, would you like detailed guidance on the next steps for your field? I can provide a customized plan based on your soil conditions.'
                : 'Could you provide more detailed information or additional photos? This will help me give you more accurate advice.',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, expertMessage])
            setIsLoading(false)
          }, 1500)
        }, 2000)
      }, 1000)
    } else {
      // Regular expert response for text messages
      setTimeout(() => {
        const expertMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'expert',
          expert: selectedExpert,
          content: getExpertResponse(inputMessage),
          timestamp: new Date()
        }
        setMessages(prev => [...prev, expertMessage])
        setIsLoading(false)
      }, 1500)
    }
  }

  const getExpertResponse = (question: string): string => {
    const responses: { [key: string]: string } = {
      'soil': 'Great question! To test your soil, you can use a simple soil test kit. Here\'s the process:\n1. Collect samples from 6-8 inches depth\n2. Mix samples from 5-10 spots in your field\n3. Test pH, nutrient levels\n4. Compare with optimal ranges for your crop\n\nWould you like specific recommendations?',
      'irrigate': 'The best time to irrigate depends on:\n• Soil moisture (use finger test - if soil is dry 1-2 inches deep)\n• Weather conditions\n• Crop stage\n\nMost crops need watering when top 1-2 inches are dry. Would you like a schedule?',
      'pest': 'Natural pest management includes:\n1. Neem oil spray (most effective)\n2. Chili-garlic spray\n3. Beneficial insects introduction\n4. Regular monitoring\n\nWhich pests are you dealing with?',
      'soil health': 'To check soil health, look for:\n• Dark color (good organic matter)\n• Crumbly texture (good structure)\n• Earthworm presence\n• Moisture retention\n\nYour soil appears good! What specific crops are you planning?',
      'crop': 'For monsoon season, I recommend:\n• Rice (if flooded)\n• Sugarcane\n• Maize\n• Vegetables (tomato, capsicum)\n\nBased on your location and soil, which interests you most?'
    }

    for (const [key, response] of Object.entries(responses)) {
      if (question.toLowerCase().includes(key)) {
        return response
      }
    }

    return `That's an interesting question! Based on my experience with various farms, I\'d recommend conducting a detailed assessment of your field. Could you share more details or upload a photo for better analysis?`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2000ms' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col">
        {/* Header */}
        <div className="pt-6 pb-4 border-b border-emerald-500/20">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">🤖 Expert AI Chat</h1>
          <p className="text-emerald-300/60 text-sm">Get verified advice with AI photo analysis</p>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 overflow-hidden flex gap-6">
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 py-6">
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md ${msg.type === 'user' ? 'bg-emerald-600/20 border-l-4 border-emerald-500' : 'bg-slate-700/30 border-l-4 border-cyan-500'} rounded-xl px-4 py-3 backdrop-blur-sm`}>
                      {msg.type === 'expert' && (
                        <p className="text-cyan-400 text-xs font-bold mb-1">👨‍🌾 {msg.expert}</p>
                      )}
                      {msg.type === 'ai-verification' && (
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-yellow-400 text-xs font-bold">🤖 AI Verification</p>
                          {msg.status === 'verifying' && <Loader className="w-3 h-3 animate-spin text-yellow-400" />}
                          {msg.status === 'verified' && <CheckCircle className="w-3 h-3 text-green-400" />}
                          {msg.status === 'needs-more-info' && <AlertCircle className="w-3 h-3 text-orange-400" />}
                        </div>
                      )}
                      
                      {msg.image && (
                        <div className="mb-3 rounded-lg overflow-hidden max-h-40">
                          <img src={msg.image} alt="Uploaded" className="w-full object-cover" />
                        </div>
                      )}

                      <p className="text-emerald-200/90 text-sm whitespace-pre-line">{msg.content}</p>

                      <p className="text-emerald-300/40 text-xs mt-2">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="pt-4 pb-6 border-t border-emerald-500/20 space-y-3">
              {/* Image Preview */}
              <AnimatePresence>
                {imagePreview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative inline-block"
                  >
                    <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg" />
                    <button
                      onClick={() => {
                        setImagePreview(null)
                        setSelectedImage(null)
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Field */}
              <div className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 w-12 h-12 bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 rounded-xl flex items-center justify-center text-cyan-400 transition-all"
                  title="Upload image for AI verification"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe your farm concern or question..."
                  className="flex-1 bg-slate-700/50 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-200 placeholder-emerald-300/40 focus:outline-none focus:border-emerald-400/50 transition-colors"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
                  className="flex-shrink-0 w-12 h-12 bg-emerald-600/20 hover:bg-emerald-600/40 disabled:opacity-50 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Questions */}
              <div className="hidden md:block space-y-2">
                <p className="text-emerald-300/60 text-xs">Quick Questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputMessage(q)
                      }}
                      className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700/80 border border-emerald-500/20 rounded-lg text-xs text-emerald-300 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experts Sidebar */}
          <div className="w-64 hidden lg:flex flex-col border-l border-emerald-500/20 pl-6">
            <div className="mb-6">
              <h3 className="text-emerald-400 font-bold mb-4">Available Experts</h3>
              <div className="space-y-3">
                {experts.map((expert) => (
                  <motion.button
                    key={expert.name}
                    onClick={() => setSelectedExpert(expert.name)}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedExpert === expert.name
                        ? 'bg-emerald-600/30 border border-emerald-500/50'
                        : 'bg-slate-700/30 border border-emerald-500/20 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-emerald-400 text-sm">{expert.emoji} {expert.name}</p>
                        <p className="text-emerald-300/60 text-xs">{expert.specialty}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${expert.online ? 'bg-green-400' : 'bg-slate-500'}`}></div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-slate-700/30 border border-emerald-500/20 rounded-lg p-3 space-y-2 mt-auto">
              <div className="flex gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <p className="text-xs text-emerald-300/70">
                  Upload photos of your farm for AI-powered verification and expert analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
