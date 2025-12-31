'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import FarmQuestLogo from '@/components/FarmQuestLogo'
import { Bell } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

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
    return pathname?.startsWith(path) ? 'text-emerald-400 font-semibold underline underline-offset-4 decoration-2' : 'text-emerald-300/70 hover:text-emerald-400'
  }

  const navigationItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Missions', path: '/missions' },
    { label: 'Learning', path: '/learning' },
    { label: 'Schemes', path: '/schemes' },
    { label: 'Help', path: '/help' },
    { label: 'Chat', path: '/chat' },
  ]

  return (
    <header className="bg-slate-800/50 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-slate-900/50 border-b border-emerald-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <FarmQuestLogo size="md" interactive={true} />
              <div>
                <div className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-green-200 transition-all">FarmQuest</div>
                <div className="text-xs text-emerald-400/50">Gamified Farming</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 ml-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm py-4 px-1 transition-all duration-200 ${isActive(item.path)}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative group">
                  <button className="relative p-2 text-emerald-300 hover:text-emerald-400 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
                  </button>
                  
                  {/* Notifications Dropdown */}
                  <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-emerald-500/30 rounded-lg shadow-xl shadow-slate-900/50 hidden group-hover:block group-hover:animate-fadeIn">
                    <div className="p-4 border-b border-emerald-500/20">
                      <h3 className="text-emerald-400 font-semibold text-sm">Notifications</h3>
                    </div>
                    <div className="divide-y divide-emerald-500/20 max-h-96 overflow-y-auto">
                      <div className="p-3 hover:bg-slate-700/30 cursor-pointer transition-colors">
                        <p className="text-sm text-emerald-200 font-medium">⚠️ Heavy Rain Alert</p>
                        <p className="text-xs text-emerald-300/60 mt-1">Prepare your crops. Heavy rainfall expected in 2 hours</p>
                        <p className="text-xs text-emerald-400/50 mt-1">2 min ago</p>
                      </div>
                      <div className="p-3 hover:bg-slate-700/30 cursor-pointer transition-colors">
                        <p className="text-sm text-emerald-200 font-medium">🌾 New Scheme Available</p>
                        <p className="text-xs text-emerald-300/60 mt-1">PM-KISAN subsidy now available for your region</p>
                        <p className="text-xs text-emerald-400/50 mt-1">15 min ago</p>
                      </div>
                      <div className="p-3 hover:bg-slate-700/30 cursor-pointer transition-colors">
                        <p className="text-sm text-emerald-200 font-medium">✅ Mission Completed</p>
                        <p className="text-xs text-emerald-300/60 mt-1">Your soil testing mission was verified! +150 XP</p>
                        <p className="text-xs text-emerald-400/50 mt-1">45 min ago</p>
                      </div>
                    </div>
                    <Link href="/notifications" className="block p-3 text-center border-t border-emerald-500/20 text-xs text-emerald-400/80 hover:text-emerald-300 transition-colors duration-300">
                      All notifications shown above →
                    </Link>
                  </div>
                </div>

                <div className="hidden sm:block text-right mr-4 border-r border-emerald-500/30 pr-4">
                  <span className="text-sm font-semibold text-emerald-400">{user.name}</span>
                  <span className="block text-xs text-emerald-400/60">{user.phone}</span>
                </div>
                <button onClick={handleSignOut} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">Sign in</Link>
                <Link href="/auth/register" className="ml-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">Create account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
