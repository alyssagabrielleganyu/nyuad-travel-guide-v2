import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user, loading } = useAuth()
  const [dbStatus, setDbStatus] = useState('checking...')

  useEffect(() => {
    // Test database connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('guides').select('count')
        if (error) throw error
        setDbStatus('✅ Connected')
      } catch (error) {
        setDbStatus('❌ Connection failed: ' + error.message)
      }
    }
    testConnection()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">
              🌍 NYUAD Travel Guide v2
            </h1>
            <p className="text-xl text-gray-600">
              Modernized 2026 Edition - From 2018 with Love
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Database Status
              </h3>
              <p className="text-gray-600">{dbStatus}</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Authentication
              </h3>
              <p className="text-gray-600">
                {user ? `✅ Logged in as ${user.email}` : '🔓 Not logged in'}
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🚀 Coming Soon
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Interactive Map</h4>
                  <p className="text-sm text-gray-600">Explore 49 legacy travel guides</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📸</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Photo Uploads</h4>
                  <p className="text-sm text-gray-600">Share your travel moments</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔍</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Search & Filter</h4>
                  <p className="text-sm text-gray-600">Find guides by city or country</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Real-time Updates</h4>
                  <p className="text-sm text-gray-600">See new guides instantly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Built with modern technologies</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                React 18
              </span>
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Supabase
              </span>
              <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Tailwind CSS
              </span>
              <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">
                React Leaflet
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
