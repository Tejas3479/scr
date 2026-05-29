'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playSound } from '@/services/sound'
import { Cloud, Sun, Droplet, Wind, AlertTriangle, MapPin, Clock, Shield, ChevronDown, ChevronUp, Thermometer, Eye, Zap } from 'lucide-react'

interface WeatherAlert {
  id: string
  type: 'storm' | 'flood' | 'drought' | 'heat' | 'cold' | 'wind'
  severity: 'low' | 'medium' | 'high' | 'extreme'
  title: string
  description: string
  startTime: Date
  endTime: Date
}

interface SafetyTip {
  id: string
  weatherType: string
  title: string
  tips: string[]
}

export default function WeatherWidget() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showAlerts, setShowAlerts] = useState(false)
  const [showSafety, setShowSafety] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const weather = {
    location: 'Maharashtra, India',
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 8,
    uvIndex: 6,
    pressure: 1013,
    icon: '🌤️',
    feelsLike: 32,
    dewPoint: 22,
    lastUpdated: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  }

  const weatherAlerts: WeatherAlert[] = [
    {
      id: '1',
      type: 'storm',
      severity: 'high',
      title: 'Heavy Rain Warning',
      description: 'Heavy rainfall expected in the next 24 hours. Possible flooding in low-lying areas.',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000) // 26 hours from now
    },
    {
      id: '2',
      type: 'wind',
      severity: 'medium',
      title: 'Strong Wind Advisory',
      description: 'Winds up to 35 km/h expected. Secure loose structures and equipment.',
      startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      endTime: new Date(Date.now() + 18 * 60 * 60 * 1000) // 18 hours from now
    }
  ]

  const safetyTips: SafetyTip[] = [
    {
      id: 'rain',
      weatherType: 'Heavy Rain/Flood',
      title: 'Protecting Crops During Heavy Rain',
      tips: [
        'Move equipment and tools to higher ground',
        'Cover harvested crops with waterproof tarps',
        'Ensure proper drainage to prevent waterlogging',
        'Harvest mature crops before heavy rain arrives',
        'Use raised beds for better water management',
        'Apply mulch to reduce soil erosion',
        'Monitor soil moisture levels regularly'
      ]
    },
    {
      id: 'wind',
      weatherType: 'Strong Winds',
      title: 'Safeguarding Against Wind Damage',
      tips: [
        'Secure greenhouse structures with additional supports',
        'Remove or tie down loose plastic coverings',
        'Protect young plants with windbreaks',
        'Store loose equipment and tools indoors',
        'Check and reinforce irrigation systems',
        'Harvest wind-sensitive crops early',
        'Use netting for fruit trees'
      ]
    }
  ]

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-neon-pink text-[#050810]'
      case 'high': return 'bg-neon-orange text-[#050810]'
      case 'medium': return 'bg-neon-purple text-white'
      case 'low': return 'bg-neon-cyan text-[#050810]'
      default: return 'bg-gray-600 text-white'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'storm': return '⛈️'
      case 'flood': return '🌊'
      case 'drought': return '🏜️'
      case 'heat': return '🔥'
      case 'cold': return '❄️'
      case 'wind': return '💨'
      default: return '⚠️'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-hud border-neon-cyan/20 rounded-3xl p-6 text-white relative overflow-hidden hover:border-neon-cyan/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.05)] transition-all"
    >
      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-neon-cyan/30" />
      
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-neon-green/3 rounded-full -ml-12 -mb-12 pointer-events-none" />

      <div className="relative z-10">
        {/* Header with Location and Time */}
        <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-neon-cyan" />
              <h2 className="text-base font-bold tech-mono tracking-wider">{weather.location.toUpperCase()}</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] tech-mono text-emerald-300/60">
              <Clock className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{formatTime(currentTime)}</span>
              <span>•</span>
              <span>{formatDate(currentTime)}</span>
            </div>
          </div>
          <div className="text-3xl animate-pulse">{weather.icon}</div>
        </div>

        {/* Current Weather */}
        <div className="mb-6 flex justify-between items-center bg-[#050810]/40 p-4 border border-neon-cyan/10 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
          
          <div className="flex items-center gap-4">
            <div className="text-4xl font-extrabold text-neon-cyan font-mono">{weather.temperature}°C</div>
            <div className="text-[10px] tech-mono text-emerald-300/70 leading-relaxed">
              <div>FEELS LIKE: {weather.feelsLike}°C</div>
              <div>DEW POINT: {weather.dewPoint}°C</div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-neon-green text-xs font-bold tech-mono uppercase tracking-widest">{weather.condition}</p>
            <p className="text-[8px] tech-mono text-white/30 mt-0.5">
              SYNCED: {formatTime(weather.lastUpdated)}
            </p>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="flex items-center justify-between bg-[#050810]/50 rounded-xl p-3 border border-white/5 hover:border-neon-cyan/30 transition-all">
            <div className="flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-[10px] tech-mono text-white/50">Humidity</span>
            </div>
            <span className="font-bold text-xs font-mono text-neon-cyan">{weather.humidity}%</span>
          </div>
          
          <div className="flex items-center justify-between bg-[#050810]/50 rounded-xl p-3 border border-white/5 hover:border-neon-cyan/30 transition-all">
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-[10px] tech-mono text-white/50">Wind</span>
            </div>
            <span className="font-bold text-xs font-mono text-neon-cyan">{weather.windSpeed} km/h</span>
          </div>

          <div className="flex items-center justify-between bg-[#050810]/50 rounded-xl p-3 border border-white/5 hover:border-neon-cyan/30 transition-all">
            <div className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-[10px] tech-mono text-white/50">Visibility</span>
            </div>
            <span className="font-bold text-xs font-mono text-neon-cyan">{weather.visibility} km</span>
          </div>

          <div className="flex items-center justify-between bg-[#050810]/50 rounded-xl p-3 border border-white/5 hover:border-neon-cyan/30 transition-all">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-[10px] tech-mono text-white/50">Pressure</span>
            </div>
            <span className="font-bold text-xs font-mono text-neon-cyan">{weather.pressure} hPa</span>
          </div>
        </div>

        {/* Weather Alerts Section */}
        {weatherAlerts.length > 0 && (
          <div className="mb-4">
            <motion.button
              onMouseEnter={playSound.hover}
              onClick={() => {
                playSound.tick()
                setShowAlerts(!showAlerts)
              }}
              className="w-full flex items-center justify-between bg-neon-pink/10 hover:bg-neon-pink/20 border border-neon-pink/30 rounded-xl p-3 text-xs tech-mono font-bold transition-all text-neon-pink uppercase tracking-widest shadow-glow-sm"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-neon-pink animate-pulse" />
                <span>ACTIVE ALERTS ({weatherAlerts.length})</span>
              </div>
              {showAlerts ? <ChevronUp className="w-4 h-4 text-neon-pink" /> : <ChevronDown className="w-4 h-4 text-neon-pink" />}
            </motion.button>

            <AnimatePresence>
              {showAlerts && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 space-y-3 overflow-hidden"
                >
                  {weatherAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="bg-[#050810]/60 rounded-xl p-4 border border-neon-pink/20 relative"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase ${getAlertSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            <h4 className="font-bold text-xs tech-mono">{alert.title}</h4>
                          </div>
                          <p className="text-[10px] text-white/70 mb-2 leading-relaxed">{alert.description}</p>
                          <div className="text-[8px] tech-mono text-emerald-300/40">
                            <div>VALID FROM: {formatTime(alert.startTime)} {formatDate(alert.startTime)}</div>
                            <div>EXPIRES: {formatTime(alert.endTime)} {formatDate(alert.endTime)}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Safety Guidelines Section */}
        <div className="mb-5">
          <motion.button
            onMouseEnter={playSound.hover}
            onClick={() => {
              playSound.tick()
              setShowSafety(!showSafety)
            }}
            className="w-full flex items-center justify-between bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/30 rounded-xl p-3 text-xs tech-mono font-bold transition-all text-neon-green uppercase tracking-widest"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-green" />
              <span>SAFETY GUIDELINES MESH</span>
            </div>
            {showSafety ? <ChevronUp className="w-4 h-4 text-neon-green" /> : <ChevronDown className="w-4 h-4 text-neon-green" />}
          </motion.button>

          <AnimatePresence>
            {showSafety && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 space-y-3 overflow-hidden"
              >
                {safetyTips.map((tip) => (
                  <motion.div
                    key={tip.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-[#050810]/60 rounded-xl p-4 border border-neon-green/20"
                  >
                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-neon-green mt-0.5 animate-pulse" />
                      <div className="flex-1">
                        <h4 className="font-bold text-xs tech-mono mb-2 text-neon-green uppercase">{tip.weatherType}: {tip.title}</h4>
                        <ul className="space-y-1.5">
                          {tip.tips.map((safetyTip, index) => (
                            <li key={index} className="text-[10px] tech-mono text-white/70 flex items-start gap-2 leading-relaxed">
                              <span className="text-neon-green mt-0.5">•</span>
                              <span>{safetyTip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={playSound.hover}
            onClick={playSound.tick}
            className="py-2.5 bg-neon-cyan/15 border border-neon-cyan/30 hover:bg-neon-cyan/25 hover:border-neon-cyan text-neon-cyan rounded-xl text-[10px] tech-mono font-bold uppercase transition-all"
          >
            7-Day Forecast
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={playSound.hover}
            onClick={playSound.tick}
            className="py-2.5 bg-[#050810]/60 border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-xl text-[10px] tech-mono font-bold uppercase transition-all"
          >
            History Ledger
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
