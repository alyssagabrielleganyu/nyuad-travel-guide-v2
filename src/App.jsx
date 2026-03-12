import { useAuth } from './hooks/useAuth'
import { useGuides } from './hooks/useGuides'
import MapView from './components/Map/MapView'

function App() {
  const { user } = useAuth()
  const { guides, loading, error } = useGuides()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <div className="text-2xl text-white">Loading travel guides...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-red-400">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-2xl">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                🌍 NYUAD Travel Guide
              </h1>
              <p className="text-gray-400">
                {guides.length} destinations • From NYUAD students around the world
              </p>
            </div>
            <div className="text-right">
              {user ? (
                <div className="text-white">
                  <div className="text-sm text-gray-400">Logged in as</div>
                  <div className="font-semibold">{user.email}</div>
                </div>
              ) : (
                <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl font-bold text-white">{guides.length}</div>
            <div className="text-sm text-gray-400">Total Guides</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl font-bold text-white">
              {guides.filter(g => g.is_legacy).length}
            </div>
            <div className="text-sm text-gray-400">Legacy (2018)</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl font-bold text-white">
              {new Set(guides.map(g => g.country)).size}
            </div>
            <div className="text-sm text-gray-400">Countries</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-3xl font-bold text-white">
              {new Set(guides.map(g => g.city)).size}
            </div>
            <div className="text-sm text-gray-400">Cities</div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            🗺️ Explore the World
          </h2>
          <p className="text-gray-400 mb-4">
            Click on any marker to see travel recommendations from NYUAD students
          </p>
          <MapView guides={guides} />
        </div>

        {/* Guide List Preview */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            📍 Recent Guides
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {guides.slice(0, 6).map((guide) => (
              <div
                key={guide.id}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white">{guide.city}</h3>
                    <p className="text-sm text-gray-400">{guide.country_name}</p>
                  </div>
                  {guide.is_legacy && (
                    <span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-1 rounded">
                      2018
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-2">by {guide.author_name}</p>
                {guide.dish && (
                  <p className="text-xs text-gray-400 line-clamp-2">
                    🍽️ {guide.dish}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>NYUAD Travel Guide v2 • Preserving memories from 2018 to 2026</p>
        </div>
      </div>
    </div>
  )
}

export default App
