'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '@/services/sound'
import { Send, Image as ImageIcon, Loader, CheckCircle, AlertCircle, X, Lightbulb, MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
      playSound.tick()
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
    
    playSound.tick()

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

    if (imagePreview) {
      setTimeout(() => {
        const verificationMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai-verification',
          content: 'Analyzing agricultural biosensors image metadata...',
          timestamp: new Date(),
          status: 'verifying'
        }
        setMessages(prev => [...prev, verificationMessage])
        
        // Play scan hum
        playSound.alarm()

        setTimeout(() => {
          const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
          
          if (randomResponse.status === 'verified') {
            playSound.success()
          } else {
            playSound.alarm()
          }

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

          setTimeout(() => {
            playSound.success()
            const expertMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              type: 'expert',
              expert: selectedExpert,
              content: randomResponse.status === 'verified'
                ? 'Excellent! Based on our AI biosensor validation, crop row optimization parameters look secure. What would you like to review next?'
                : 'Please capture a higher exposure macro capture of the leaves under natural sunlight so that we can isolate specific pest vector metrics.',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, expertMessage])
            setIsLoading(false)
          }, 1500)
        }, 2000)
      }, 1000)
    } else {
      setTimeout(() => {
        playSound.success()
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
      'soil': 'Superb query! Soil test parameters strictly indicate optimal microbial activity when carbon capture ratios remain above 12t. Collect a sample from 6 inches depth and compare under CRISPR Cas13a probes.',
      'irrigate': 'Irrigation algorithms suggest optimal watering when top soil matrix moisture registers below 40% via Digital Twin. Our major A-major drone LFO sweeps can automate re-routing.',
      'pest': 'Pest detection matrix identifies biological controls as primary targets. Release ladybug populations to suppress aphids organically, verified via spline on Solana ledger.',
      'soil health': 'Soil health index maps crop health dynamically. Dark structural arrays specify proper humus capture values. Would you like to run a GraphRAG search?',
      'crop': 'Monsoon crop architectures verify Rice, Maize, and tomato variants as top-tier yields. Connect your hands-free BCI headset to authorize flight routes.'
    }

    for (const [key, response] of Object.entries(responses)) {
      if (question.toLowerCase().includes(key)) {
        return response
      }
    }

    return `That's an interesting bio-farming question! Dr. Patel recommends verifying this against our GraphRAG knowledge base or uploading a live field photo for Cas13a diagnostic correlation.`
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white relative overflow-hidden selection:bg-neon-cyan selection:text-[#050810]">
      {/* Cyber Grid & Scanline Background Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:100%_30px] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(0,240,255,0.015)_97%,transparent_97%)] bg-[length:30px_100%] z-0" />

      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-neon-cyan/5 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-neon-green/5 rounded-full filter blur-3xl opacity-15 animate-blob" style={{ animationDelay: '2000ms' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-between py-6">
        
        {/* Header */}
        <div className="pb-4 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple bg-clip-text text-transparent tech-display uppercase tracking-wider">
              🤖 Co-Pilot AI & Expert Diagnostic Chat
            </h1>
            <p className="text-emerald-300/60 tech-mono text-xs mt-0.5">VERIFIED BIOMASS CORRELATIONS AND IMAGE RECOGNITION INTERFACE</p>
          </div>
          
          <Link href="/dashboard" onMouseEnter={playSound.hover} onClick={playSound.tick} className="bg-cyber-dark hover:bg-neon-cyan/15 border border-neon-cyan/35 text-neon-cyan text-xs tech-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-glow-sm">
            <ArrowLeft className="w-3.5 h-3.5" /> COMMAND DECK
          </Link>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 overflow-hidden flex gap-6 my-6">
          
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col min-w-0 glass-hud p-6 border-neon-cyan/20 rounded-3xl relative justify-between overflow-hidden shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-cyan" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-cyan" />

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md relative overflow-hidden rounded-2xl px-4.5 py-3.5 border ${
                      msg.type === 'user' 
                        ? 'bg-neon-green/10 border-neon-green/30 text-emerald-200' 
                        : msg.type === 'ai-verification'
                        ? 'bg-[#050810]/95 border-neon-purple/35 text-neon-purple shadow-glow-sm'
                        : 'bg-[#050810]/70 border-neon-cyan/25 text-white'
                    }`}>
                      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-40" />
                      
                      {msg.type === 'expert' && (
                        <p className="text-neon-cyan text-[10px] font-bold tech-mono mb-1 uppercase tracking-wider">👨‍🌾 {msg.expert}</p>
                      )}
                      {msg.type === 'ai-verification' && (
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-neon-purple text-[10px] font-bold tech-mono uppercase tracking-wider animate-pulse">🤖 BIOSENSOR ANALYSIS AI</p>
                          {msg.status === 'verifying' && <Loader className="w-3.5 h-3.5 animate-spin text-neon-purple" />}
                          {msg.status === 'verified' && <CheckCircle className="w-3.5 h-3.5 text-neon-green" />}
                          {msg.status === 'needs-more-info' && <AlertCircle className="w-3.5 h-3.5 text-neon-pink" />}
                        </div>
                      )}
                      
                      {msg.image && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-white/10 max-h-40">
                          <img src={msg.image} alt="Uploaded" className="w-full object-cover" />
                        </div>
                      )}

                      <p className="text-xs font-sans leading-relaxed whitespace-pre-line">{msg.content}</p>

                      <p className="text-[8px] tech-mono text-white/30 mt-2 text-right uppercase">
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
                  className="flex gap-2 p-2 bg-[#050810] rounded-xl w-16 items-center justify-center border border-white/5"
                >
                  <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="pt-4 border-t border-white/5 space-y-3 bg-[#050810]/40 rounded-b-2xl">
              {/* Image Preview */}
              <AnimatePresence>
                {imagePreview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative inline-block border border-neon-cyan/20 p-1.5 rounded-xl bg-[#050810]"
                  >
                    <img src={imagePreview} alt="Preview" className="max-h-24 rounded-lg" />
                    <button
                      onClick={() => {
                        playSound.tick()
                        setImagePreview(null)
                        setSelectedImage(null)
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-neon-pink rounded-full p-1 border border-[#050810]"
                    >
                      <X className="w-3.5 h-3.5 text-[#050810]" />
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
                  onMouseEnter={playSound.hover}
                  onClick={() => {
                    playSound.tick()
                    fileInputRef.current?.click()
                  }}
                  className="flex-shrink-0 w-12 h-12 bg-[#050810]/80 hover:bg-neon-cyan/15 border border-neon-cyan/35 rounded-xl flex items-center justify-center text-neon-cyan transition-all"
                  title="Upload image for AI verification"
                >
                  <ImageIcon className="w-5 h-5 text-neon-cyan" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe soil indices, Cas13a outcomes, or crop issues..."
                  className="flex-1 bg-[#050810]/70 border border-white/10 rounded-xl px-4.5 py-3 text-white text-xs tech-mono placeholder-white/35 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-all"
                />

                <button
                  onMouseEnter={playSound.hover}
                  onClick={handleSendMessage}
                  disabled={isLoading || (!inputMessage.trim() && !selectedImage)}
                  className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-cyan hover:to-neon-green text-[#050810] disabled:opacity-30 border border-[#050810] rounded-xl flex items-center justify-center transition-all hover:scale-[1.03] active:scale-95"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Quick Questions */}
              <div className="hidden md:block space-y-2 pt-2 border-t border-white/5">
                <p className="text-[10px] tech-mono text-white/30 uppercase tracking-widest">Quick Referencing Prompts:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onMouseEnter={playSound.hover}
                      onClick={() => {
                        playSound.tick()
                        setInputMessage(q.slice(2))
                      }}
                      className="px-3 py-1 bg-[#050810]/80 hover:bg-neon-cyan/15 border border-white/10 hover:border-neon-cyan/40 rounded-lg text-[10px] tech-mono text-emerald-300/80 transition-all uppercase"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Experts Sidebar */}
          <div className="w-64 hidden lg:flex flex-col border-l border-white/5 pl-6 justify-between">
            <div>
              <h3 className="text-neon-cyan font-bold tech-mono text-xs uppercase tracking-widest mb-4">BIOSENSOR EXPERTS</h3>
              <div className="space-y-3">
                {experts.map((expert) => (
                  <motion.button
                    key={expert.name}
                    onMouseEnter={playSound.hover}
                    onClick={() => {
                      playSound.tick()
                      setSelectedExpert(expert.name)
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`w-full text-left p-3.5 rounded-xl transition-all border relative ${
                      selectedExpert === expert.name
                        ? 'bg-neon-cyan/10 border-neon-cyan/70 text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'bg-cyber-dark/45 border-white/5 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-40" />
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-xs tech-mono mb-1">{expert.emoji} {expert.name}</p>
                        <p className="text-[10px] text-white/40 tech-mono uppercase">{expert.specialty}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${expert.online ? 'bg-neon-green animate-pulse' : 'bg-white/20'}`}></div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-[#050810]/60 border border-neon-purple/20 rounded-xl p-4 space-y-2 mt-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-purple/50" />
              
              <div className="flex gap-2">
                <Lightbulb className="w-4 h-4 text-neon-purple flex-shrink-0 animate-pulse" />
                <p className="text-[9px] tech-mono text-neon-purple leading-relaxed uppercase tracking-wider">
                  ENCRYPTED METADATA TRANSMITTED DIRECTLY OVER TEE SECURITY CHANNELS SECURED VIA WEBAUTHN PASSKEYS.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
