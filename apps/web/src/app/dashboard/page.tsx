"use client"
 
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import WeatherWidget from '@/components/WeatherWidget'
import SpatialTwinCanvas from '@/components/SpatialTwinCanvas'
import BCIInputManager from '@/components/BCIInputManager'
import RPPGTracker from '@/components/rPPGTracker'
import HapticController from '@/components/HapticController'
import AudioSynthesizerWidget from '@/components/AudioSynthesizerWidget'
import { playSound } from '@/services/sound'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [stressLevel, setStressLevel] = useState(25)
  const [attentionLevel, setAttentionLevel] = useState(55)
  const level = 5
  const xp = 2450
  const nextLevelXp = 3000
  const xpProgress = (xp / nextLevelXp) * 100

  // Generative UI: Cognitive state adaptation variables
  const isHighStressMode = stressLevel > 70
  const isHighlyFocused = attentionLevel > 75

  useEffect(() => {
    setMounted(true)
    const storedUser = localStorage.getItem('ef_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/auth/login')
    }
  }, [router])

  // Play success sound when dashboard mounts successfully
  useEffect(() => {
    if (mounted && user) {
      setTimeout(() => {
        playSound.success()
      }, 500)
    }
  }, [mounted, user])

  // Play warning sirens when stress indices transition to critical threshold
  useEffect(() => {
    if (isHighStressMode) {
      playSound.alarm()
    }
  }, [isHighStressMode])

  if (!mounted || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050810]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neon-cyan tech-mono text-sm tracking-wider animate-pulse">CONNECTING NEURAL ENCLAVE FEED...</p>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen bg-[#050810] text-white relative overflow-hidden transition-all duration-500 selection:bg-neon-cyan selection:text-[#050810] ${isHighStressMode ? 'contrast-125 filter saturate-75 brightness-95' : ''}`}>
      
      {/* Cyber Grid & Scanline Background Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(0,240,255,0.018)_97%,transparent_97%)] bg-[length:100%_30px] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,rgba(0,240,255,0.018)_97%,transparent_97%)] bg-[length:30px_100%] z-0" />
      
      {/* Animated background glowing atmospheric blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[35vw] h-[35vw] bg-neon-cyan/5 rounded-full filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-neon-green/5 rounded-full filter blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] right-[30%] w-[25vw] h-[25vw] bg-neon-purple/3 rounded-full filter blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Generative UI Dynamic Alert Banner */}
      <AnimatePresence>
        {isHighStressMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-neon-pink/90 to-[#FF0000]/90 border-b border-neon-pink py-3.5 px-4 text-center text-white font-semibold tech-mono text-[11px] tracking-widest z-50 relative flex justify-center items-center gap-2.5 animate-pulse"
          >
            <span className="text-sm">⚠️</span>
            <span>COGNITIVE OVERLOAD DETECTED — ASSISTED SAFETY CRITICAL AUTOPILOT ENABLED</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header: User Greeting */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className={`font-bold bg-gradient-to-r from-neon-cyan via-neon-green to-neon-purple bg-clip-text text-transparent mb-2 transition-all tracking-wide uppercase font-display ${isHighStressMode ? 'text-4xl font-black' : 'text-3xl'}`}>
              🌾 FARMQUEST.NEXUS OS // {user.name}
            </h1>
            <p className={`tech-mono text-[10px] uppercase transition-all tracking-wider ${isHighStressMode ? 'text-neon-pink font-bold' : 'text-emerald-300/60'}`}>
              {isHighStressMode ? '>> Cognitive distress verified. Re-routing computational safety flows.' : '>> System status: OPTIMAL. Digital Twins synced.'}
            </p>
          </div>

          <button 
            onMouseEnter={playSound.hover}
            onClick={() => {
              playSound.tick();
              localStorage.removeItem('ef_user');
              router.push('/auth/login');
            }}
            className="bg-neon-pink/10 border border-neon-pink/30 hover:border-neon-pink text-neon-pink text-[10px] tech-mono font-bold px-4 py-2 rounded-xl transition-all"
          >
            DISCONNECT INTERFACE
          </button>
        </div>

        {/* Level & XP Section */}
        <div className="glass-hud p-8 mb-8 border-neon-green/30 rounded-2xl relative overflow-hidden hover:border-neon-green/50 transition-all duration-300">
          <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-green" />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-green" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Level Card */}
            <div className="text-center">
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg className="w-full h-full" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="55" stroke="rgba(0, 255, 65, 0.1)" strokeWidth="3" />
                  <circle cx="60" cy="60" r="55" stroke="#00FF41" strokeWidth="2.5" strokeDasharray="345.6" strokeDashoffset="0" className="animate-glow-pulse" />
                  <text x="60" y="68" textAnchor="middle" fontSize="30" fontWeight="bold" fill="#00FF41" fontFamily="Courier" className="neon-glow-green">
                    0{level}
                  </text>
                </svg>
              </div>
              <p className="text-emerald-300/40 text-[9px] font-bold tech-mono tracking-widest uppercase">COGNITIVE LEVEL</p>
              <p className="text-neon-green text-xs font-bold tech-mono uppercase tracking-wider">Expert Bio-Farmer</p>
            </div>

            {/* XP Progress */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <div className="flex justify-between mb-2 tech-mono text-xs">
                  <span className="text-emerald-300/80 tracking-widest uppercase">EXPERIENCE CAPTURED Matrix</span>
                  <span className="text-neon-green font-bold">{xp} / {nextLevelXp} XP</span>
                </div>
                <div className="w-full bg-[#050810]/70 rounded-full h-3.5 overflow-hidden border border-neon-green/20">
                  <div
                    className="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(0,255,65,0.4)]"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
              <p className="text-emerald-300/60 tech-mono text-[10px] uppercase">
                {nextLevelXp - xp} XP REQUIRED TO COMPLETE NEXT COGNITIVE SYNAPSE ALIGNMENT. Complete tasks.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Streak Card */}
          <div 
            onMouseEnter={playSound.hover}
            className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-orange/20 rounded-2xl p-6 hover:border-neon-orange/60 hover:shadow-[0_0_20px_rgba(255,107,0,0.1)] transition-all duration-300 relative group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neon-orange/60" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neon-orange/60" />
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🔥</div>
            <p className="text-neon-orange/60 tech-mono text-[9px] uppercase tracking-wider font-semibold mb-1">STREAK SEQUENCE</p>
            <p className="text-2xl font-bold text-neon-orange font-mono">07 CYCLES</p>
          </div>

          {/* Missions Card */}
          <div 
            onMouseEnter={playSound.hover}
            className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-cyan/20 rounded-2xl p-6 hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] transition-all duration-300 relative group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neon-cyan/60" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neon-cyan/60" />
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">✅</div>
            <p className="text-neon-cyan/60 tech-mono text-[9px] uppercase tracking-wider font-semibold mb-1">MISSIONS CLOSED</p>
            <p className="text-2xl font-bold text-neon-cyan font-mono">12 TOTAL</p>
          </div>

          {/* FarmTokens Card */}
          <div 
            onMouseEnter={playSound.hover}
            className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-purple/20 rounded-2xl p-6 hover:border-neon-purple/60 hover:shadow-[0_0_20px_rgba(255,0,255,0.1)] transition-all duration-300 relative group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neon-purple/60" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neon-purple/60" />
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">💰</div>
            <p className="text-neon-purple/60 tech-mono text-[9px] uppercase tracking-wider font-semibold mb-1">MINTED TOKENS</p>
            <p className="text-2xl font-bold text-neon-purple font-mono">1,250 SPL</p>
          </div>

          {/* Badges Card */}
          <div 
            onMouseEnter={playSound.hover}
            className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-green/20 rounded-2xl p-6 hover:border-neon-green/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-all duration-300 relative group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-neon-green/60" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-neon-green/60" />
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🎖️</div>
            <p className="text-neon-green/60 tech-mono text-[9px] uppercase tracking-wider font-semibold mb-1">BIO-SEAL BADGES</p>
            <p className="text-2xl font-bold text-neon-green font-mono">08 EARNED</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Link href="/missions" onMouseEnter={playSound.hover} onClick={playSound.tick}>
            <button className="w-full bg-[#050810]/70 border border-neon-cyan/35 hover:border-neon-cyan hover:bg-neon-cyan/15 text-neon-cyan font-semibold py-4 rounded-xl tech-mono text-xs uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 shadow-glow-sm">
              📋 Missions
            </button>
          </Link>
          <Link href="/learning" onMouseEnter={playSound.hover} onClick={playSound.tick}>
            <button className="w-full bg-[#050810]/70 border border-neon-purple/35 hover:border-neon-purple hover:bg-neon-purple/15 text-neon-purple font-semibold py-4 rounded-xl tech-mono text-xs uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 shadow-glow-sm">
              📚 Learn
            </button>
          </Link>
          <Link href="/schemes" onMouseEnter={playSound.hover} onClick={playSound.tick}>
            <button className="w-full bg-[#050810]/70 border border-neon-green/35 hover:border-neon-green hover:bg-neon-green/15 text-neon-green font-semibold py-4 rounded-xl tech-mono text-xs uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 shadow-glow-sm">
              💡 Schemes
            </button>
          </Link>
          <Link href="/chat" onMouseEnter={playSound.hover} onClick={playSound.tick}>
            <button className="w-full bg-[#050810]/70 border border-neon-cyan/35 hover:border-neon-cyan hover:bg-neon-cyan/15 text-neon-cyan font-semibold py-4 rounded-xl tech-mono text-xs uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 shadow-glow-sm">
              💬 Chat
            </button>
          </Link>
          <button onMouseEnter={playSound.hover} onClick={playSound.tick} className="w-full bg-[#050810]/70 border border-neon-pink/35 hover:border-neon-pink hover:bg-neon-pink/15 text-neon-pink font-semibold py-4 rounded-xl tech-mono text-xs uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 shadow-glow-sm">
            🏪 Shop
          </button>
          <button onMouseEnter={playSound.hover} onClick={playSound.tick} className="w-full bg-[#050810]/70 border border-neon-green/35 hover:border-neon-green hover:bg-neon-green/15 text-neon-green font-semibold py-4 rounded-xl tech-mono text-xs uppercase tracking-wider transition-all transform hover:scale-[1.03] active:scale-95 shadow-glow-sm">
            🏆 Leader
          </button>
        </div>

        {/* Advanced Cyber-Agri Interfaces Grid */}
        <div className="mb-8">
          <h3 className="text-xs font-bold tech-mono text-neon-cyan uppercase tracking-widest mb-3.5 flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse animate-ping" />
            🌾 Advanced Cognitive OS Subsystems
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <Link href="/dashboard/crispr" onMouseEnter={playSound.hover} onClick={playSound.tick}>
              <button className="w-full border border-neon-green/30 hover:border-neon-green bg-[#050810]/80 hover:bg-neon-green/10 text-neon-green font-bold py-3.5 rounded-xl tech-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-glow-sm">
                🧬 CRISPR
              </button>
            </Link>
            <Link href="/dashboard/twin" onMouseEnter={playSound.hover} onClick={playSound.tick}>
              <button className="w-full border border-neon-cyan/30 hover:border-neon-cyan bg-[#050810]/80 hover:bg-neon-cyan/10 text-neon-cyan font-bold py-3.5 rounded-xl tech-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-glow-sm">
                🌐 3D Twin
              </button>
            </Link>
            <Link href="/dashboard/knowledge" onMouseEnter={playSound.hover} onClick={playSound.tick}>
              <button className="w-full border border-neon-purple/30 hover:border-neon-purple bg-[#050810]/80 hover:bg-neon-purple/10 text-neon-purple font-bold py-3.5 rounded-xl tech-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-glow-sm">
                🧠 GraphRAG
              </button>
            </Link>
            <Link href="/dashboard/ledger" onMouseEnter={playSound.hover} onClick={playSound.tick}>
              <button className="w-full border border-neon-green/30 hover:border-neon-green bg-[#050810]/80 hover:bg-neon-green/10 text-neon-green font-bold py-3.5 rounded-xl tech-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-glow-sm">
                🪙 Ledger
              </button>
            </Link>
            <Link href="/compliance" onMouseEnter={playSound.hover} onClick={playSound.tick}>
              <button className="w-full border border-neon-cyan/30 hover:border-neon-cyan bg-[#050810]/80 hover:bg-neon-cyan/10 text-neon-cyan font-bold py-3.5 rounded-xl tech-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-glow-sm">
                ⚖ Compliance
              </button>
            </Link>
            <Link href="/forensics" onMouseEnter={playSound.hover} onClick={playSound.tick}>
              <button className="w-full border border-neon-pink/30 hover:border-neon-pink bg-[#050810]/80 hover:bg-neon-pink/10 text-neon-pink font-bold py-3.5 rounded-xl tech-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-glow-sm">
                🛡 Forensics
              </button>
            </Link>
            <Link href="/settings" onMouseEnter={playSound.hover} onClick={playSound.tick}>
              <button className="w-full border border-neon-purple/30 hover:border-neon-purple bg-[#050810]/80 hover:bg-neon-purple/10 text-neon-purple font-bold py-3.5 rounded-xl tech-mono text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-glow-sm">
                ⚙ Settings
              </button>
            </Link>
          </div>
        </div>

        {/* Next-Gen Solarpunk Digital Twin & Neural Command Center */}
        <div className="mb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent mb-4 tech-mono uppercase flex items-center gap-2">
              <span className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse" />
              🌐 Spatial Digital Twin (3D Real-Time Mesh)
            </h2>
            <div className="border border-neon-cyan/20 rounded-2xl overflow-hidden glass-panel">
              <SpatialTwinCanvas />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-4 tech-mono uppercase flex items-center gap-2">
              <span className="w-3 h-3 bg-neon-purple rounded-full animate-pulse" />
              🧠 Bio-Sensory Control Deck
            </h2>
            <BCIInputManager onStateChange={({ stress, attention }) => {
              setStressLevel(stress)
              setAttentionLevel(attention)
            }} />
            <RPPGTracker onStressUpdate={(stress) => setStressLevel(stress)} />
            
            {/* Real-time Audio Synthesizer Widget Embedded */}
            <AudioSynthesizerWidget />

            {/* Bilateral Haptic Robotic Override Widget */}
            <HapticController />
          </div>
        </div>

        {/* Weather Widget */}
        <div className="mb-8">
          <WeatherWidget />
        </div>

        {/* Featured Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-neon-green mb-6 tech-mono uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-green rounded-full" />
            🏆 Verified Bio-Solar Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Harvest Master */}
            <div 
              onMouseEnter={playSound.hover}
              className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-orange/20 rounded-2xl p-6 hover:border-neon-orange/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,107,0,0.1)] group relative"
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-orange/50" />
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🌾</div>
              <h3 className="text-lg font-bold text-neon-orange mb-2 tech-mono uppercase">Harvest Master</h3>
              <p className="text-white/60 text-xs mb-4">Complete 50 harvesting missions</p>
              <div className="w-full bg-[#050810] rounded-full h-2 overflow-hidden border border-neon-orange/10">
                <div className="h-full bg-gradient-to-r from-neon-orange to-yellow-500 w-3/4" />
              </div>
              <p className="text-neon-orange/50 text-[10px] tech-mono mt-2 uppercase font-bold">38 / 50 MISSION VECTORS</p>
            </div>

            {/* Water Wizard */}
            <div 
              onMouseEnter={playSound.hover}
              className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-cyan/20 rounded-2xl p-6 hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] group relative"
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan/50" />
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">💧</div>
              <h3 className="text-lg font-bold text-neon-cyan mb-2 tech-mono uppercase">Water Wizard</h3>
              <p className="text-white/60 text-xs mb-4">Complete 30 irrigation missions</p>
              <div className="w-full bg-[#050810] rounded-full h-2 overflow-hidden border border-neon-cyan/10">
                <div className="h-full bg-gradient-to-r from-neon-cyan to-blue-500 w-full" />
              </div>
              <p className="text-neon-cyan/70 text-[10px] tech-mono mt-2 uppercase font-bold">30 / 30 COMPLETE ✓</p>
            </div>

            {/* Eco Guardian */}
            <div 
              onMouseEnter={playSound.hover}
              className="bg-cyber-dark/40 backdrop-blur-xl border border-neon-green/20 rounded-2xl p-6 hover:border-neon-green/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] group relative"
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-green/50" />
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">♻️</div>
              <h3 className="text-lg font-bold text-neon-green mb-2 tech-mono uppercase">Eco Guardian</h3>
              <p className="text-white/60 text-xs mb-4">Use organic farming for 20 days</p>
              <div className="w-full bg-[#050810] rounded-full h-2 overflow-hidden border border-neon-green/10">
                <div className="h-full bg-gradient-to-r from-neon-green to-teal-500 w-full" />
              </div>
              <p className="text-neon-green/70 text-[10px] tech-mono mt-2 uppercase font-bold">20 / 20 COMPLETE ✓</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
