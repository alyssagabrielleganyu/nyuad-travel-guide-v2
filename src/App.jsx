import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useGuides } from './hooks/useGuides'
import GlobeView from './components/Map/GlobeView'

function App() {
  const { user } = useAuth()
  const { guides, loading } = useGuides()
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGuide, setSelectedGuide] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <div className="text-2xl text-[#3D3D3D] font-mono">loading horizons...</div>
        </div>
      </div>
    )
  }

  // Calculate current location (average of all guides or selected guide)
  const currentLat = selectedGuide ? selectedGuide.latitude :
    guides.length > 0 ? guides.reduce((sum, g) => sum + g.latitude, 0) / guides.length : 0
  const currentLng = selectedGuide ? selectedGuide.longitude :
    guides.length > 0 ? guides.reduce((sum, g) => sum + g.longitude, 0) / guides.length : 0

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#F5E6D3] rounded-3xl shadow-2xl overflow-hidden border-8 border-[#E5D6C3]">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#3D3D3D] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#3D3D3D]"></div>
              </div>
              <h1 className="text-4xl font-serif text-[#3D3D3D]">hello, world!</h1>
            </div>
            <button className="w-12 h-12 rounded-full bg-[#3D3D3D] text-[#F5E6D3] flex items-center justify-center hover:bg-[#5D5D5D] transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search for a lost horizon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white bg-opacity-40 rounded-2xl text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeTab === 'all'
                  ? 'bg-[#3D3D3D] text-[#F5E6D3]'
                  : 'bg-white bg-opacity-40 text-[#3D3D3D] hover:bg-opacity-60'
              }`}
            >
              EXPLORE ALL
            </button>
            <button
              onClick={() => setActiveTab('curated')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeTab === 'curated'
                  ? 'bg-[#3D3D3D] text-[#F5E6D3]'
                  : 'bg-white bg-opacity-40 text-[#3D3D3D] hover:bg-opacity-60'
              }`}
            >
              CURATED GUIDES
            </button>
            <button
              onClick={() => setActiveTab('hidden')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                activeTab === 'hidden'
                  ? 'bg-[#3D3D3D] text-[#F5E6D3]'
                  : 'bg-white bg-opacity-40 text-[#3D3D3D] hover:bg-opacity-60'
              }`}
            >
              HIDDEN GEMS
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#3D3D3D] rounded-full overflow-hidden mb-8">
            <div className="h-full bg-[#8B4513] w-1/3 transition-all"></div>
          </div>
        </div>

        {/* Globe */}
        <div className="px-8 pb-6">
          <div className="relative w-full aspect-square bg-gradient-radial from-[#D5C6B3] to-[#F5E6D3] rounded-full overflow-hidden shadow-inner flex items-center justify-center">
            <GlobeView guides={guides} onMarkerClick={setSelectedGuide} />
          </div>
        </div>

        {/* Location Feed */}
        <div className="px-8 pb-6">
          <div className="border-t-2 border-[#3D3D3D] pt-4">
            <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-2 font-mono">
              LOCATION FEED
            </p>
            <p className="text-sm font-mono text-[#3D3D3D]">
              LAT: {currentLat.toFixed(4)}° {currentLat >= 0 ? 'N' : 'S'}
            </p>
            <p className="text-sm font-mono text-[#3D3D3D]">
              LONG: {currentLng.toFixed(4)}° {currentLng >= 0 ? 'E' : 'W'}
            </p>
            {selectedGuide && (
              <p className="text-sm font-mono text-[#8B4513] mt-2">
                → {selectedGuide.city}, {selectedGuide.country_name}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="px-4 pb-4">
          <div className="bg-[#3D3D3D] rounded-full px-6 py-4 flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-[#F5E6D3] hover:text-[#8B4513] transition">
              <div className="w-6 h-6 rounded-full bg-[#8B4513] flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM2 10a8 8 0 1116 0 8 8 0 01-16 0z"/>
                </svg>
              </div>
              <span className="text-xs font-medium">ATLAS</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#F5E6D3] hover:text-[#8B4513] transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium">JOURNAL</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#F5E6D3] hover:text-[#8B4513] transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs font-medium">CHAT</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#F5E6D3] hover:text-[#8B4513] transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs font-medium">POCKET</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
