'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neon-green mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The resource you're looking for doesn't exist or has been moved.</p>
        
        <div className="space-y-4">
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-neon-green text-cyber-dark font-bold rounded-lg hover:bg-neon-cyan transition">
            Go to Dashboard
          </Link>
          <br />
          <Link href="/" className="inline-block px-6 py-3 border-2 border-neon-green text-neon-green font-bold rounded-lg hover:bg-neon-green hover:text-cyber-dark transition">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
