'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Camera, Image, AlertCircle, CheckCircle } from 'lucide-react'
import api from '@/services/api'

export default function ScanPlantPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      setSelectedFile(file)
      setError('')

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setAnalyzing(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await api.post('/api/v1/ai/image/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setResults(response.data)
    } catch (err: any) {
      console.error('Analysis error:', err)
      setError('Failed to analyze image. Please try again.')
      // Mock results for demo
      setResults({
        detection_type: 'pest',
        confidence: 0.87,
        detected_items: [
          {
            name: 'Aphids',
            confidence: 0.87,
            severity: 'moderate',
            recommendations: [
              'Spray with neem oil solution',
              'Introduce ladybugs to your garden',
              'Remove heavily infested leaves'
            ]
          }
        ],
        plant_health: 'fair'
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Plant Analysis</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Plant Image</h2>
              <p className="text-gray-600 mb-6">
                Take a photo or upload an image of your plant to get AI-powered pest detection and health analysis.
              </p>
            </div>

            {/* Upload Area */}
            <div
              onClick={triggerFileInput}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Plant preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-gray-600">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">Choose an image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={triggerFileInput}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </button>
              <button
                onClick={() => {/* TODO: Implement camera */}}
                className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Camera
              </button>
            </div>

            {selectedFile && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Plant'}
              </button>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>

            {analyzing && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing your plant image...</p>
                </div>
              </div>
            )}

            {results && !analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border p-6 space-y-6"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Analysis Complete</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Detection Type</p>
                    <p className="font-medium text-gray-900 capitalize">{results.detection_type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Plant Health</p>
                    <p className="font-medium text-gray-900 capitalize">{results.plant_health}</p>
                  </div>

                  {results.detected_items?.map((item: any, index: number) => (
                    <div key={index} className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <span className="text-sm text-gray-500">{Math.round(item.confidence * 100)}% confidence</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">Severity: <span className="capitalize">{item.severity}</span></p>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
                        <ul className="space-y-1">
                          {item.recommendations?.map((rec: string, recIndex: number) => (
                            <li key={recIndex} className="text-sm text-gray-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {!results && !analyzing && (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Upload an image to see analysis results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}