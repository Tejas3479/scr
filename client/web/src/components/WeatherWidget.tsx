'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    },
    {
      id: 'heat',
      weatherType: 'Extreme Heat',
      title: 'Managing Heat Stress on Crops',
      tips: [
        'Increase irrigation frequency during heat waves',
        'Use shade cloth for sensitive crops',
        'Mulch soil to retain moisture',
        'Avoid fertilizing during peak heat',
        'Harvest early morning or evening',
        'Provide windbreaks for cooling effect',
        'Monitor for heat stress symptoms'
      ]
    },
    {
      id: 'cold',
      weatherType: 'Cold Weather',
      title: 'Cold Weather Protection',
      tips: [
        'Cover plants with frost cloth or blankets',
        'Use row covers for vegetable crops',
        'Water plants before cold snap to provide insulation',
        'Avoid pruning during cold periods',
        'Protect irrigation pipes from freezing',
        'Bring potted plants indoors if possible',
        'Monitor temperature forecasts closely'
      ]
    }
  ]

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-600 text-white'
      case 'high': return 'bg-orange-600 text-white'
      case 'medium': return 'bg-yellow-600 text-black'
      case 'low': return 'bg-blue-600 text-white'
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-slate-800/50 via-cyan-700/40 to-blue-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden hover:border-cyan-400/50 transition-all"
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10">
        {/* Header with Location and Time */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4" />
              <h2 className="text-lg font-bold">{weather.location}</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <Clock className="w-3 h-3" />
              <span>{formatTime(currentTime)}</span>
              <span>•</span>
              <span>{formatDate(currentTime)}</span>
            </div>
          </div>
          <div className="text-4xl">{weather.icon}</div>
        </div>

        {/* Current Weather */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="text-5xl font-extrabold">{weather.temperature}°C</div>
            <div className="text-sm text-blue-100">
              <div>Feels like {weather.feelsLike}°C</div>
              <div>Dew point {weather.dewPoint}°C</div>
            </div>
          </div>
          <p className="text-blue-100 text-lg">{weather.condition}</p>
          <p className="text-xs text-blue-200 mt-1">
            Last updated: {formatTime(weather.lastUpdated)}
          </p>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center justify-between bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <span className="text-xs">Humidity</span>
            </div>
            <span className="font-semibold text-sm">{weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-between bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span className="text-xs">Wind</span>
            </div>
            <span className="font-semibold text-sm">{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center justify-between bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-xs">Visibility</span>
            </div>
            <span className="font-semibold text-sm">{weather.visibility} km</span>
          </div>
          <div className="flex items-center justify-between bg-slate-700/30 backdrop-blur-sm rounded-xl p-3 border border-cyan-500/20 hover:border-cyan-400/50 transition-all">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span className="text-xs">Pressure</span>
            </div>
            <span className="font-semibold text-sm">{weather.pressure} hPa</span>
          </div>
        </div>

        {/* Weather Alerts Section */}
        {weatherAlerts.length > 0 && (
          <div className="mb-6">
            <motion.button
              onClick={() => setShowAlerts(!showAlerts)}
              className="w-full flex items-center justify-between bg-red-600/40 hover:bg-red-600/60 border border-red-500/30 backdrop-blur-sm rounded-xl p-3 text-sm font-semibold transition-all"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Weather Alerts ({weatherAlerts.length})</span>
              </div>
              {showAlerts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                      className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-red-500/20 hover:border-red-500/40 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getAlertSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                          </div>
                          <p className="text-xs text-blue-100 mb-2">{alert.description}</p>
                          <div className="text-xs text-blue-200">
                            <div>Starts: {formatTime(alert.startTime)} {formatDate(alert.startTime)}</div>
                            <div>Ends: {formatTime(alert.endTime)} {formatDate(alert.endTime)}</div>
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
        <div className="mb-6">
          <motion.button
            onClick={() => setShowSafety(!showSafety)}
            className="w-full flex items-center justify-between bg-green-600/40 hover:bg-green-600/60 border border-green-500/30 backdrop-blur-sm rounded-xl p-3 text-sm font-semibold transition-all"
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Safety Guidelines</span>
            </div>
            {showSafety ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                    className="bg-slate-700/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-300 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-2">{tip.weatherType}: {tip.title}</h4>
                        <ul className="space-y-1">
                          {tip.tips.map((safetyTip, index) => (
                            <li key={index} className="text-xs text-blue-100 flex items-start gap-2">
                              <span className="text-green-300 mt-0.5">•</span>
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
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-cyan-500/30 border border-cyan-500/30 hover:bg-cyan-500/50 hover:border-cyan-400/50 backdrop-blur-sm rounded-xl text-sm font-semibold transition-all"
          >
            View 7-Day Forecast
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 bg-slate-700/30 border border-cyan-500/20 hover:bg-slate-700/50 hover:border-cyan-400/40 backdrop-blur-sm rounded-xl text-sm font-semibold transition-all"
          >
            Weather History
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

