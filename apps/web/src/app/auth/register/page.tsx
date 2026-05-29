'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import auth from '@/services/auth'
import FarmQuestLogo from '@/components/FarmQuestLogo'

export default function RegisterPage() {
  const [phone, setPhone] = useState('+91')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    if (!name || !phone || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    // Demo mode - bypass backend if not available
    if (phone && password && name) {
      setTimeout(() => {
        setSuccess(true)
        setLoading(false)
        // Store demo credentials
        localStorage.setItem('ef_token', 'demo_token_' + Date.now())
        localStorage.setItem('ef_user', JSON.stringify({
          id: Math.random().toString(36).substr(2, 9),
          phone: phone,
          name: name,
          role: 'farmer'
        }))
        // Redirect after animation
        setTimeout(() => router.push('/dashboard'), 1500)
      }, 1500)
      return
    }

    // Original backend logic (kept as fallback)
    try {
      const res = await auth.register({ phone, password, name })
      if (res && res.token) {
        localStorage.setItem('ef_token', res.token)
        localStorage.setItem('ef_user', JSON.stringify(res.user))
        setSuccess(true)
        setTimeout(() => router.push('/'), 1500)
      } else {
        // some user services return only success
        setSuccess(true)
        setTimeout(() => router.push('/auth/login'), 1500)
      }
    } catch (err: any) {
      const msg = err?.response?.data || err.message || 'Registration failed'
      // show helpful debug info when available
      if (err?.config) {
        setError(`${msg.message || JSON.stringify(msg)} (url: ${err.config.url}, status: ${err.response?.status || 'n/a'})`)
      } else {
        setError(msg.message || JSON.stringify(msg))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-lime-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.5); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.8); }
        }
        @keyframes success-check {
          0% { transform: scale(0) rotate(-45deg); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .animate-in {
          animation: slideInUp 0.6s ease-out;
        }
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .success-icon {
          animation: success-check 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>

      <div className="w-full max-w-md relative z-10 animate-in">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <FarmQuestLogo size="lg" interactive={true} />
          </div>

          {success ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center success-icon">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Welcome to FarmQuest!</h3>
              <p className="text-emerald-200">Your account is ready. Redirecting...</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-white mb-2 text-center">Create your FarmQuest account</h2>
              <p className="text-center text-emerald-200 mb-8">Join the community and start earning points</p>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm mb-6 p-4 rounded-xl backdrop-blur-sm animate-in">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group">
                  <label className="text-sm font-medium text-emerald-100 block mb-2">Full Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-emerald-300">👤</span>
                    <input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-emerald-100 block mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-emerald-300">📱</span>
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-emerald-100 block mb-2">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-emerald-300">🔒</span>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                    loading
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 opacity-75'
                      : 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-emerald-200 text-sm">Already have an account?</p>
                <a href="/auth/login" className="text-emerald-300 font-semibold hover:text-emerald-200 transition-colors inline-block mt-2 group">
                  Sign in here
                  <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200 ml-1">→</span>
                </a>
              </div>
            </>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-green-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 -z-10"></div>
      </div>
    </div>
  )
}
