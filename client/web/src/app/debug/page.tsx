'use client'

import { useState } from 'react'
import api from '@/services/api'

export default function DebugPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const testResults: any = {}

    // Test 1: API Gateway health
    try {
      const res = await fetch('http://localhost:3000/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        data = { raw: text.substring(0, 200) }
      }
      testResults.apiGateway = {
        status: res.status,
        ok: res.ok,
        statusText: res.statusText,
        data: data,
        message: res.ok ? '✅ API Gateway is running' : '⚠️ API Gateway returned error'
      }
    } catch (err: any) {
      testResults.apiGateway = { 
        error: err.message,
        message: '❌ Cannot connect to API Gateway. Is it running on port 3000?',
        suggestion: 'Run: docker-compose up -d'
      }
    }

    // Test 2: User Service health (direct connection)
    try {
      const res = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        data = { raw: text.substring(0, 200) }
      }
      testResults.userService = {
        status: res.status,
        ok: res.ok,
        statusText: res.statusText,
        data: data,
        message: res.ok ? '✅ User Service is running' : '⚠️ User Service returned error'
      }
    } catch (err: any) {
      testResults.userService = { 
        error: err.message,
        message: '❌ Cannot connect to User Service. Is it running on port 3001?',
        suggestion: 'Run: docker-compose up -d user-service'
      }
    }

    // Test 3: API Gateway via API calls
    if (testResults.apiGateway?.ok) {
      try {
        const res = await api.post('/api/v1/users/auth/register', {
          phone: '+919876543210',
          password: 'test123',
          name: 'Test User',
          language: 'en'
        })
        testResults.createUser = {
          success: true,
          message: '✅ Test user created successfully',
          data: res.data
        }
      } catch (err: any) {
        if (err.response?.status === 409) {
          testResults.createUser = {
            success: true,
            message: 'ℹ️ Test user already exists',
            error: err.response?.data?.error
          }
        } else {
          testResults.createUser = {
            error: err.response?.data?.error || err.message,
            status: err.response?.status,
            message: err.response?.status === 404 ? '❌ API endpoint not found. Check API Gateway routing.' : '❌ Failed to create user'
          }
        }
      }

      // Test 4: Login
      try {
        const res = await api.post('/api/v1/users/auth/login', {
          phone: '+919876543210',
          password: 'test123'
        })
        testResults.login = {
          success: true,
          message: '✅ Login successful!',
          hasToken: !!res.data.token,
          hasUser: !!res.data.user
        }
      } catch (err: any) {
        testResults.login = {
          error: err.response?.data?.error || err.message,
          status: err.response?.status,
          details: err.response?.data?.details,
          message: err.response?.status === 404 ? '❌ Login endpoint not found' : err.response?.status === 401 ? '❌ Invalid credentials or user does not exist' : '❌ Login failed'
        }
      }
    } else {
      testResults.createUser = {
        skipped: true,
        message: '⏭️ Skipped - API Gateway not available'
      }
      testResults.login = {
        skipped: true,
        message: '⏭️ Skipped - API Gateway not available'
      }
    }

    // Test 5: Debug endpoint (direct to user service)
    if (testResults.userService?.ok) {
      try {
        const res = await fetch('http://localhost:3001/api/debug/test-user')
        const data = await res.json()
        testResults.debugEndpoint = {
          status: res.status,
          message: res.ok ? '✅ Debug endpoint accessible' : '⚠️ Debug endpoint returned error',
          data: data
        }
      } catch (err: any) {
        testResults.debugEndpoint = { 
          error: err.message,
          message: '❌ Cannot access debug endpoint'
        }
      }
    } else {
      testResults.debugEndpoint = {
        skipped: true,
        message: '⏭️ Skipped - User Service not available'
      }
    }

    setResults(testResults)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Diagnostics</h1>
        
        <button
          onClick={runTests}
          disabled={loading}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Running Tests...' : 'Run Diagnostic Tests'}
        </button>

        {Object.keys(results).length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Test Results</h2>
            
            {Object.entries(results).map(([key, value]: [string, any]) => (
              <div key={key} className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                {value.message && (
                  <p className={`mt-1 ${
                    value.message.includes('✅') ? 'text-green-600' :
                    value.message.includes('⚠️') ? 'text-yellow-600' :
                    value.message.includes('❌') ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {value.message}
                  </p>
                )}
                {value.suggestion && (
                  <p className="text-sm text-gray-500 mt-1">💡 {value.suggestion}</p>
                )}
                {value.error && (
                  <p className="text-sm text-red-600 mt-1">Error: {value.error}</p>
                )}
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Raw Results:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
            
            {(!results.apiGateway?.ok || !results.userService?.ok) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Services Not Running</h3>
                <p className="text-sm text-yellow-800 mb-2">To start services, run:</p>
                <code className="block bg-yellow-100 p-2 rounded text-sm">docker-compose up -d</code>
                <p className="text-sm text-yellow-800 mt-2">Or use the PowerShell script:</p>
                <code className="block bg-yellow-100 p-2 rounded text-sm">.\scripts\start-services.ps1</code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

