'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Leaf, Trophy, Zap, UserPlus, LogIn } from 'lucide-react'
import api from '@/services/api'

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // First, try to register the test user if it's test credentials
      if (phone === '+919876543210' && password === 'test123') {
        try {
          await api.post('/api/v1/users/auth/register', {
            phone: '+919876543210',
            password: 'test123',
            name: 'Test User',
            language: 'en'
          })
        } catch (registerErr: any) {
          // Ignore if user already exists
          if (!registerErr.response?.data?.error?.includes('already registered')) {
            console.warn('Registration attempt failed (may already exist):', registerErr.response?.data?.error)
          }
        }
      }

      const response = await api.post('/api/v1/users/auth/login', {
        phone,
        password,
      })

      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/')
        }, 500)
      } else {
        setError('Invalid response from server')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      const errorMessage = err.response?.data?.error || err.response?.data?.details || err.message || 'Login failed. Please check your credentials.'
      setError(errorMessage)
      
      // If it's test credentials and login failed, suggest creating account
      if (phone === '+919876543210' && password === 'test123') {
        setError(`${errorMessage} Try clicking "Create Test Account First" button below.`)
      }
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!name.trim()) {
      setError('Please enter your name')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/api/v1/users/auth/register', {
        phone,
        password,
        name: name.trim(),
        language: 'en',
      })

      setSuccess('Account created successfully! Logging you in...')
      
      // Auto-login after registration
      setTimeout(async () => {
        try {
          const loginResponse = await api.post('/api/v1/users/auth/login', {
            phone,
            password,
          })
          localStorage.setItem('token', loginResponse.data.token)
          localStorage.setItem('user', JSON.stringify(loginResponse.data.user))
          router.push('/')
        } catch (loginErr: any) {
          setError('Registration successful but auto-login failed. Please login manually.')
          setIsRegister(false)
        }
      }, 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Phone number may already be registered.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 via-green-500 to-lime-500 p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl"
        ></motion.div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            🌾
          </motion.div>
          <h1 className="text-5xl font-extrabold text-white mb-2 drop-shadow-lg">
            Eco Farm
          </h1>
          <p className="text-xl text-emerald-50 font-semibold">
            Gamified Farming Platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-4 border-white/50"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {isRegister ? 'Create Account' : 'Welcome Back!'}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isRegister ? (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRegister}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-lg"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="phone-register" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone-register"
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-lg"
                    placeholder="+91 12345 67890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password-register" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password (min. 6 characters)
                  </label>
                  <input
                    id="password-register"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-lg"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      ></motion.div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <UserPlus className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-lg"
                    placeholder="+91 12345 67890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-lg"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      ></motion.div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {!isRegister && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Quick Login</span>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <motion.button
                  type="button"
                  onClick={async () => {
                    setPhone('+919876543210')
                    setPassword('test123')
                    setError('')
                    setSuccess('Test credentials loaded. Click "Sign In" to login.')
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Load Test Credentials
                </motion.button>
                <motion.button
                  type="button"
                  onClick={async () => {
                    setError('')
                    setSuccess('Creating test account...')
                    setLoading(true)
                    try {
                      const response = await api.post('/api/v1/users/auth/register', {
                        phone: '+919876543210',
                        password: 'test123',
                        name: 'Test User',
                        language: 'en'
                      })
                      setSuccess('Test account created! Now logging in...')
                      setPhone('+919876543210')
                      setPassword('test123')
                      
                      // Auto-login
                      setTimeout(async () => {
                        try {
                          const loginResponse = await api.post('/api/v1/users/auth/login', {
                            phone: '+919876543210',
                            password: 'test123'
                          })
                          localStorage.setItem('token', loginResponse.data.token)
                          localStorage.setItem('user', JSON.stringify(loginResponse.data.user))
                          router.push('/')
                        } catch (err: any) {
                          setError(err.response?.data?.error || 'Account created but login failed. Please try logging in manually.')
                          setLoading(false)
                        }
                      }, 500)
                    } catch (err: any) {
                      if (err.response?.data?.error?.includes('already registered')) {
                        setSuccess('Test account already exists! Loading credentials...')
                        setPhone('+919876543210')
                        setPassword('test123')
                        setLoading(false)
                      } else {
                        setError(err.response?.data?.error || 'Failed to create test account. Please try manually.')
                        setLoading(false)
                      }
                    }
                  }}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
                >
                  <UserPlus className="w-3 h-3" />
                  Create Test Account First
                </motion.button>
              </div>
              <p className="mt-2 text-xs text-center text-gray-500">
                Test Credentials: Phone: +919876543210 | Password: test123
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            {isRegister ? (
              <>
                <p className="text-center text-sm text-gray-600 mb-4">
                  Already have an account?
                </p>
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsRegister(false)
                    setError('')
                    setSuccess('')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In Instead
                </motion.button>
              </>
            ) : (
              <>
                <p className="text-center text-sm text-gray-600 mb-4">
                  Don&apos;t have an account?
                </p>
                <motion.button
                  type="button"
                  onClick={() => {
                    setIsRegister(true)
                    setError('')
                    setSuccess('')
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </motion.button>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Leaf className="w-4 h-4" />
              <span>Organic</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>Gamified</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
