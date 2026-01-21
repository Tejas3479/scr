'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FarmQuestLogo from '@/components/FarmQuestLogo'
import { Bell, LogOut, User } from 'lucide-react'
import { ScannerIcon } from '@/components/GamingIcons'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  useEffect(() => {
    try {
      const token = localStorage.getItem('ef_token')
      const u = localStorage.getItem('ef_user')
      if (token && u) setUser(JSON.parse(u))
    } catch (e) {
      setUser(null)
    }
  }, [pathname])

  const handleSignOut = () => {
    localStorage.removeItem('ef_token')
    localStorage.removeItem('ef_user')
    setUser(null)
    router.push('/')
  }

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
      ? 'text-neon-green neon-glow-green font-bold border-b-2 border-neon-green'
      : 'text-neon-cyan/60 hover:text-neon-cyan transition-colors'
  }

  const navigationItems = [
    { label: 'NEXUS', path: '/dashboard' },
    { label: 'MISSIONS', path: '/missions' },
    { label: 'TRAINING', path: '/learning' },
    { label: 'PROTOCOLS', path: '/schemes' },
    { label: 'SUPPORT', path: '/help' },
    { label: 'NEURAL', path: '/chat' },
  ]

  return (
    <header className="glass-hud sticky top-0 z-50 border-b border-neon-green/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FarmQuestLogo size="md" interactive={true} />
              </motion.div>
              <div>
                <motion.div
                  className="font-bold text-lg tech-display bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,65,0.3)]"
                  whileHover={{ textShadow: '0 0 20px rgba(0, 255, 65, 0.6)' }}
                >
                  FARMQUEST NEXUS
                </motion.div>
                <motion.div
                  className="text-xs tech-mono text-neon-cyan/50"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  v2.0 CYBER-AGRI ▌
                </motion.div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1 ml-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`tech-mono text-xs py-2 px-3 transition-all duration-300 relative group uppercase ${isActive(item.path)}`}
                >
                  {item.label}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-neon-green/0 via-neon-green/20 to-neon-green/0 rounded opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-neon-cyan hover:text-neon-green transition-colors group"
                  >
                    <Bell className="w-5 h-5" />
                    <motion.span
                      className="absolute top-0 right-0 w-3 h-3 bg-neon-orange rounded-full text-white text-xs flex items-center justify-center font-bold tech-mono"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      3
                    </motion.span>
                    <div className="absolute -inset-2 bg-neon-orange/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                  </motion.button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-96 glass-hud border-neon-cyan/50 shadow-neon-cyan rounded-lg overflow-hidden"
                    >
                      <div className="p-4 border-b border-neon-cyan/30">
                        <h3 className="tech-mono text-sm neon-glow-cyan font-bold">INCOMING SIGNALS</h3>
                      </div>
                      <div className="divide-y divide-neon-green/10 max-h-96 overflow-y-auto">
                        <motion.div
                          whileHover={{ backgroundColor: 'rgba(0, 255, 65, 0.05)' }}
                          className="p-4 cursor-pointer transition-colors"
                        >
                          <p className="tech-mono text-sm neon-glow-green">⚠ WEATHER ALERT</p>
                          <p className="text-xs text-neon-cyan/70 mt-2">Heavy rainfall incoming. Secure your crops in 2 hours.</p>
                          <p className="tech-mono text-xs text-neon-cyan/40 mt-2">2 min ago</p>
                        </motion.div>
                        <motion.div
                          whileHover={{ backgroundColor: 'rgba(0, 255, 65, 0.05)' }}
                          className="p-4 cursor-pointer transition-colors"
                        >
                          <p className="tech-mono text-sm neon-glow-cyan">★ SUBSIDY UPDATE</p>
                          <p className="text-xs text-neon-cyan/70 mt-2">PM-KISAN protocol activated for your region.</p>
                          <p className="tech-mono text-xs text-neon-cyan/40 mt-2">15 min ago</p>
                        </motion.div>
                        <motion.div
                          whileHover={{ backgroundColor: 'rgba(0, 255, 65, 0.05)' }}
                          className="p-4 cursor-pointer transition-colors"
                        >
                          <p className="tech-mono text-sm neon-glow-green">✓ MISSION VERIFIED</p>
                          <p className="text-xs text-neon-cyan/70 mt-2">Soil analysis mission complete. +150 XP awarded.</p>
                          <p className="tech-mono text-xs text-neon-cyan/40 mt-2">45 min ago</p>
                        </motion.div>
                      </div>
                      <Link
                        href="/notifications"
                        className="block p-3 text-center border-t border-neon-green/20 tech-mono text-xs text-neon-cyan/60 hover:text-neon-green transition-colors"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        VIEW ALL SIGNALS →
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* User Profile */}
                <div className="hidden sm:flex items-center gap-3 px-3 py-2 glass-card border-neon-cyan/30">
                  <div className="flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-neon-green to-neon-cyan">
                    <span className="tech-mono text-xs font-bold text-cyber-dark">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="tech-mono text-xs font-bold text-neon-green">{user.name}</p>
                    <p className="tech-mono text-xs text-neon-cyan/50">{user.phone}</p>
                  </div>
                </div>

                {/* Sign Out Button */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255, 0, 107, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="glass-card border-neon-pink/40 hover:border-neon-pink px-4 py-2 tech-mono text-xs font-bold text-neon-pink flex items-center gap-2 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="tech-mono text-xs text-neon-cyan hover:text-neon-green transition-colors"
                >
                  LOGIN
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/register"
                    className="glass-card border-neon-green/50 hover:border-neon-green px-4 py-2 tech-mono text-xs font-bold text-neon-green hover:shadow-neon-green transition-all"
                  >
                    CREATE ACCOUNT
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
