import { useState, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useGuides } from './hooks/useGuides'
import GlobeView from './components/Map/GlobeView'
import GuideForm from './components/Guide/GuideForm'
import GuideEditForm from './components/Guide/GuideEditForm'
import SignInModal from './components/Auth/SignInModal'

// Helper function to get continent from country
const getContinent = (countryName) => {
  const continents = {
    'Africa': ['Egypt', 'Eritrea', 'Morocco', 'Nigeria', 'Rwanda', 'Tanzania', 'Zimbabwe'],
    'Asia': ['China', 'Georgia', 'Hong Kong', 'India', 'Japan', 'Jordan', 'Kazakhstan', 'Lebanon', 'Nepal', 'Pakistan', 'Philippines', 'Qatar', 'Singapore', 'United Arab Emirates'],
    'Europe': ['Czech Republic', 'Denmark', 'Estonia', 'Finland', 'Hungary', 'Lithuania', 'Montenegro', 'Poland', 'Russia', 'Spain', 'Ukraine', 'United Kingdom'],
    'North America': ['Canada', 'Costa Rica', 'Guatemala', 'Jamaica', 'Mexico', 'United States'],
    'South America': ['Colombia', 'Peru', 'Venezuela'],
    'Oceania': ['Australia', 'New Zealand']
  }

  for (const [continent, countries] of Object.entries(continents)) {
    if (countries.includes(countryName)) {
      return continent
    }
  }
  return 'Other'
}

function App() {
  const { user } = useAuth()
  const { guides, loading } = useGuides()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGuides, setSelectedGuides] = useState([])
  const [currentGuideIndex, setCurrentGuideIndex] = useState(0)
  const [expandedContinent, setExpandedContinent] = useState(null)
  const [expandedCountry, setExpandedCountry] = useState(null)
  const [showCuratedDropdown, setShowCuratedDropdown] = useState(false)
  const [showGuideForm, setShowGuideForm] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [signedInUser, setSignedInUser] = useState(null)
  const [viewingMyGuides, setViewingMyGuides] = useState(false)
  const [editingGuide, setEditingGuide] = useState(null)

  // Auto-select when search has results
  useEffect(() => {
    if (!searchQuery.trim()) {
      // No search query - clear selection
      setSelectedGuides([])
      setCurrentGuideIndex(0)
      return
    }

    // Filter guides based on search
    const query = searchQuery.toLowerCase()
    const filtered = guides.filter(guide => {
      // If viewing my guides, only show user's guides
      if (viewingMyGuides && signedInUser) {
        if (guide.email !== signedInUser.email) return false
      }

      return (
        guide.city?.toLowerCase().includes(query) ||
        guide.country_name?.toLowerCase().includes(query) ||
        guide.author_name?.toLowerCase().includes(query) ||
        guide.dish?.toLowerCase().includes(query) ||
        guide.sunset?.toLowerCase().includes(query) ||
        guide.tips?.toLowerCase().includes(query)
      )
    })

    if (filtered.length > 0) {
      // Show all filtered guides with navigation
      setSelectedGuides(filtered)
      setCurrentGuideIndex(0)
    } else {
      // No results - clear selection
      setSelectedGuides([])
      setCurrentGuideIndex(0)
    }
  }, [searchQuery, guides, viewingMyGuides, signedInUser])


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5E6D3] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" stroke="#3D3D3D" strokeWidth="2">
                {/* Outer petals - evenly distributed in a circle */}
                <ellipse cx="50" cy="22" rx="18" ry="14"/>
                <ellipse cx="72" cy="36" rx="18" ry="14" transform="rotate(72 72 36)"/>
                <ellipse cx="64" cy="64" rx="18" ry="14" transform="rotate(144 64 64)"/>
                <ellipse cx="36" cy="64" rx="18" ry="14" transform="rotate(216 36 64)"/>
                <ellipse cx="28" cy="36" rx="18" ry="14" transform="rotate(288 28 36)"/>
                {/* Middle layer */}
                <ellipse cx="50" cy="35" rx="14" ry="11"/>
                <ellipse cx="62" cy="44" rx="14" ry="11" transform="rotate(72 62 44)"/>
                <ellipse cx="56" cy="56" rx="14" ry="11" transform="rotate(144 56 56)"/>
                <ellipse cx="44" cy="56" rx="14" ry="11" transform="rotate(216 44 56)"/>
                <ellipse cx="38" cy="44" rx="14" ry="11" transform="rotate(288 38 44)"/>
                {/* Center */}
                <circle cx="50" cy="50" r="10" stroke="#3D3D3D" strokeWidth="2"/>
                <circle cx="50" cy="50" r="6"/>
              </g>
            </svg>
          </div>
          <div className="text-2xl text-[#3D3D3D] font-mono">picking a rose from every garden</div>
        </div>
      </div>
    )
  }

  // Filter guides based on search query and viewing mode
  const filteredGuides = guides.filter(guide => {
    // If viewing my guides, only show user's guides
    if (viewingMyGuides && signedInUser) {
      if (guide.email !== signedInUser.email) return false
    }

    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()
    return (
      guide.city?.toLowerCase().includes(query) ||
      guide.country_name?.toLowerCase().includes(query) ||
      guide.author_name?.toLowerCase().includes(query) ||
      guide.dish?.toLowerCase().includes(query) ||
      guide.sunset?.toLowerCase().includes(query) ||
      guide.tips?.toLowerCase().includes(query)
    )
  })

  // Calculate current location (average of all guides or selected guide)
  const selectedGuide = selectedGuides.length > 0 ? selectedGuides[currentGuideIndex] : null
  const currentLat = selectedGuide ? selectedGuide.latitude :
    filteredGuides.length > 0 ? filteredGuides.reduce((sum, g) => sum + g.latitude, 0) / filteredGuides.length : 0
  const currentLng = selectedGuide ? selectedGuide.longitude :
    filteredGuides.length > 0 ? filteredGuides.reduce((sum, g) => sum + g.longitude, 0) / filteredGuides.length : 0

  return (
    <div className="min-h-screen bg-[#F5E6D3]">
      {/* Header */}
      <div className="border-b-2 border-[#3D3D3D] px-4 md:px-12 py-4 md:py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 md:w-16 md:h-16">
                <g fill="none" stroke="#3D3D3D" strokeWidth="2">
                  {/* Outer petals - evenly distributed in a circle */}
                  <ellipse cx="50" cy="22" rx="18" ry="14"/>
                  <ellipse cx="72" cy="36" rx="18" ry="14" transform="rotate(72 72 36)"/>
                  <ellipse cx="64" cy="64" rx="18" ry="14" transform="rotate(144 64 64)"/>
                  <ellipse cx="36" cy="64" rx="18" ry="14" transform="rotate(216 36 64)"/>
                  <ellipse cx="28" cy="36" rx="18" ry="14" transform="rotate(288 28 36)"/>
                  {/* Middle layer */}
                  <ellipse cx="50" cy="35" rx="14" ry="11"/>
                  <ellipse cx="62" cy="44" rx="14" ry="11" transform="rotate(72 62 44)"/>
                  <ellipse cx="56" cy="56" rx="14" ry="11" transform="rotate(144 56 56)"/>
                  <ellipse cx="44" cy="56" rx="14" ry="11" transform="rotate(216 44 56)"/>
                  <ellipse cx="38" cy="44" rx="14" ry="11" transform="rotate(288 38 44)"/>
                  {/* Center */}
                  <circle cx="50" cy="50" r="10" stroke="#3D3D3D" strokeWidth="2"/>
                  <circle cx="50" cy="50" r="6"/>
                </g>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif text-[#3D3D3D] mb-1">
                {viewingMyGuides ? 'my guides' : 'hello, world!'}
              </h1>
              <p className="text-xs md:text-sm text-[#8B7355] font-mono">
                {viewingMyGuides ? (
                  <>
                    {signedInUser?.email} • {filteredGuides.length} {filteredGuides.length === 1 ? 'guide' : 'guides'}
                  </>
                ) : (
                  <>
                    {searchQuery ? `${filteredGuides.length} of ${guides.length}` : `${guides.length}`} destinations mapped
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto relative">
            {/* Back to All Guides button when viewing my guides */}
            {viewingMyGuides && (
              <button
                onClick={() => {
                  setViewingMyGuides(false)
                  setSelectedGuides([])
                  setCurrentGuideIndex(0)
                }}
                className="px-3 md:px-4 py-2 md:py-3 bg-[#3D3D3D] text-[#F5E6D3] rounded-full hover:bg-[#5D5D5D] transition text-xs md:text-sm font-medium whitespace-nowrap"
              >
                ← All Guides
              </button>
            )}

            {/* Search Bar with Browse */}
            <div className="relative flex-1 md:flex-none">
              <div className="flex items-center gap-2">
                {!viewingMyGuides && (
                  <button
                    onClick={() => setShowCuratedDropdown(!showCuratedDropdown)}
                    className="px-3 md:px-4 py-2 md:py-3 bg-[#3D3D3D] text-[#F5E6D3] rounded-full hover:bg-[#5D5D5D] transition text-xs md:text-sm font-medium whitespace-nowrap"
                  >
                    Browse ☰
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Search cities, countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 px-4 md:px-6 py-2 md:py-3 bg-white bg-opacity-40 rounded-full text-[#3D3D3D] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] text-sm md:text-base"
                />
              </div>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#3D3D3D] transition"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <svg className="w-4 h-4 md:w-5 md:h-5 absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[#8B7355] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}

              {/* Curated Guides Dropdown */}
              {!viewingMyGuides && showCuratedDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 md:right-auto md:w-96 max-w-full bg-white bg-opacity-95 rounded-2xl shadow-2xl p-4 z-50 max-h-[500px] overflow-y-auto"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8B4513 transparent'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-[#3D3D3D]">Browse by Continent</p>
                    <button
                      onClick={() => setShowCuratedDropdown(false)}
                      className="text-[#8B7355] hover:text-[#3D3D3D]"
                    >
                      ×
                    </button>
                  </div>
                  {(() => {
                    // Organize guides by continent → country → city
                    const organized = {}
                    guides.forEach(guide => {
                      const continent = getContinent(guide.country_name)
                      if (!organized[continent]) organized[continent] = {}
                      if (!organized[continent][guide.country_name]) organized[continent][guide.country_name] = {}
                      if (!organized[continent][guide.country_name][guide.city]) {
                        organized[continent][guide.country_name][guide.city] = []
                      }
                      organized[continent][guide.country_name][guide.city].push(guide)
                    })

                    return Object.keys(organized).sort().map(continent => (
                      <div key={continent} className="mb-2">
                        <button
                          onClick={() => setExpandedContinent(expandedContinent === continent ? null : continent)}
                          className="w-full text-left px-3 py-2 bg-[#3D3D3D] rounded-lg transition flex items-center justify-between hover:bg-[#4D4D4D]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#F5E6D3]">{expandedContinent === continent ? '▼' : '▶'}</span>
                            <span className="text-base font-bold text-[#F5E6D3] uppercase tracking-wide">{continent}</span>
                          </div>
                          <span className="text-xs text-[#D4C4A8]">
                            {Object.keys(organized[continent]).length}
                          </span>
                        </button>

                        {expandedContinent === continent && (
                          <div className="ml-2 mt-1 space-y-1">
                            {Object.keys(organized[continent]).sort().map(country => (
                              <div key={country}>
                                <button
                                  onClick={() => setExpandedCountry(expandedCountry === country ? null : country)}
                                  className="w-full text-left px-3 py-1.5 bg-white bg-opacity-30 hover:bg-opacity-50 rounded transition flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">{expandedCountry === country ? '▼' : '▶'}</span>
                                    <span className="text-xs font-medium text-[#3D3D3D]">{country}</span>
                                  </div>
                                  <span className="text-xs text-[#8B7355]">
                                    {Object.keys(organized[continent][country]).length}
                                  </span>
                                </button>

                                {expandedCountry === country && (
                                  <div className="ml-2 mt-1 space-y-0.5">
                                    {Object.keys(organized[continent][country]).sort().map(city => {
                                      const cityGuides = organized[continent][country][city]
                                      return (
                                        <button
                                          key={city}
                                          onClick={() => {
                                            setSelectedGuides(cityGuides)
                                            setCurrentGuideIndex(0)
                                            setShowCuratedDropdown(false)
                                          }}
                                          className="w-full text-left px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-40 rounded transition flex items-center gap-2"
                                        >
                                          <span className="text-xs">📍</span>
                                          <span className="text-xs text-[#3D3D3D]">
                                            {city}
                                            {cityGuides.length > 1 && (
                                              <span className="text-[#8B7355] ml-1">({cityGuides.length})</span>
                                            )}
                                          </span>
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  })()}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowGuideForm(true)}
              className="px-3 md:px-4 py-2 md:py-3 bg-[#8B4513] text-[#F5E6D3] rounded-full hover:bg-[#6D3410] transition text-xs md:text-sm font-medium whitespace-nowrap"
            >
              + Add Guide
            </button>

            {viewingMyGuides && signedInUser && (
              <button
                onClick={() => {
                  setSignedInUser(null)
                  setViewingMyGuides(false)
                }}
                className="px-3 md:px-4 py-2 md:py-3 bg-[#3D3D3D] text-[#F5E6D3] rounded-full hover:bg-[#5D5D5D] transition text-xs md:text-sm font-medium whitespace-nowrap"
              >
                Sign Out
              </button>
            )}

            <button
              onClick={() => {
                if (signedInUser) {
                  setViewingMyGuides(!viewingMyGuides)
                  setShowCuratedDropdown(false)
                } else {
                  setShowSignIn(true)
                }
              }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#3D3D3D] text-[#F5E6D3] flex items-center justify-center hover:bg-[#5D5D5D] transition"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6 order-2 lg:order-1">
            {/* Location Feed */}
            <div className="bg-white bg-opacity-40 rounded-2xl md:rounded-3xl p-4 md:p-6">
                <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-2 md:mb-3 font-mono">
                  LOCATION FEED
                </p>
                <p className="text-xs md:text-sm font-mono text-[#3D3D3D] mb-1">
                  LAT: {currentLat.toFixed(4)}° {currentLat >= 0 ? 'N' : 'S'}
                </p>
                <p className="text-xs md:text-sm font-mono text-[#3D3D3D]">
                  LONG: {currentLng.toFixed(4)}° {currentLng >= 0 ? 'E' : 'W'}
                </p>
                {selectedGuide && (
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-[#3D3D3D]">
                    <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-2 font-mono">
                      SELECTED
                    </p>
                    <p className="text-base md:text-lg font-mono text-[#8B4513] font-bold">
                      {selectedGuide.city}
                    </p>
                    <p className="text-xs md:text-sm text-[#3D3D3D]">{selectedGuide.country_name}</p>
                    <p className="text-xs text-[#8B7355] mt-2">
                      by {selectedGuide.author_name}
                      {selectedGuides.length > 1 && ` (${currentGuideIndex + 1} of ${selectedGuides.length})`}
                    </p>
                  </div>
                )}
              </div>

            {/* Selected Guide Detail */}
            {selectedGuide && (
              <div className="bg-white bg-opacity-40 rounded-2xl md:rounded-3xl p-4 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-serif text-[#3D3D3D] mb-2">
                      {selectedGuide.city}, {selectedGuide.country_name}
                    </h2>
                    <p className="text-xs md:text-sm text-[#8B7355]">
                      by {selectedGuide.author_name}
                      {selectedGuide.is_legacy && " • Local • 2018 Legacy Entry"}
                      {!selectedGuide.is_legacy && selectedGuide.street_cred === 'from_here' && " • Local"}
                      {!selectedGuide.is_legacy && selectedGuide.street_cred === 'lived_here' && ` • Lived here for ${selectedGuide.street_cred_years} years`}
                      {!selectedGuide.is_legacy && selectedGuide.street_cred === 'tourist' && " • Tourist"}
                      {!selectedGuide.is_legacy && selectedGuide.created_at && (() => {
                        const date = new Date(selectedGuide.created_at)
                        if (date.getFullYear() >= 2026) {
                          return ` • ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
                        }
                        return ''
                      })()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {viewingMyGuides && signedInUser && selectedGuide.email === signedInUser.email && (
                      <button
                        onClick={() => setEditingGuide(selectedGuide)}
                        className="px-3 py-2 bg-[#8B4513] text-[#F5E6D3] rounded-full hover:bg-[#6D3410] transition text-xs font-medium"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedGuides([])
                        setCurrentGuideIndex(0)
                      }}
                      className="text-2xl text-[#8B7355] hover:text-[#3D3D3D] transition flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Navigation arrows for multiple guides */}
                {selectedGuides.length > 1 && (
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => setCurrentGuideIndex((currentGuideIndex - 1 + selectedGuides.length) % selectedGuides.length)}
                      className="px-3 py-2 bg-[#3D3D3D] text-[#F5E6D3] rounded-full hover:bg-[#5D5D5D] transition text-xs font-medium"
                    >
                      ← Prev
                    </button>
                    <span className="px-3 py-1 bg-[#8B4513] text-[#F5E6D3] rounded-full text-xs font-mono">
                      {currentGuideIndex + 1}/{selectedGuides.length}
                    </span>
                    <button
                      onClick={() => setCurrentGuideIndex((currentGuideIndex + 1) % selectedGuides.length)}
                      className="px-3 py-2 bg-[#3D3D3D] text-[#F5E6D3] rounded-full hover:bg-[#5D5D5D] transition text-xs font-medium"
                    >
                      Next →
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#8B4513 transparent'
                  }}
                >
                  {selectedGuide.dish && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        🍽️ LOCAL CUISINE
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.dish}</p>
                    </div>
                  )}
                  {selectedGuide.sunset && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        🌅 BEST VIEWS
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.sunset}</p>
                    </div>
                  )}
                  {selectedGuide.family && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        👨‍👩‍👧 FAMILY SPOTS
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.family}</p>
                    </div>
                  )}
                  {selectedGuide.friend && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        👥 WITH FRIENDS
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.friend}</p>
                    </div>
                  )}
                  {selectedGuide.date && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        💑 DATE IDEAS
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.date}</p>
                    </div>
                  )}
                  {selectedGuide.overrated && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        ⚠️ OVERRATED
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.overrated}</p>
                    </div>
                  )}
                  {selectedGuide.instead && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        ✨ TRY INSTEAD
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.instead}</p>
                    </div>
                  )}
                  {selectedGuide.walk && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        🚶 WALKING ROUTES
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.walk}</p>
                    </div>
                  )}
                  {selectedGuide.tips && (
                    <div>
                      <p className="text-xs text-[#8B7355] uppercase tracking-widest mb-1 font-mono">
                        💡 LOCAL TIPS
                      </p>
                      <p className="text-xs text-[#3D3D3D]">{selectedGuide.tips}</p>
                    </div>
                  )}
                </div>

                {selectedGuide.google_maps_url && (
                  <a
                    href={selectedGuide.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-[#3D3D3D] text-[#F5E6D3] rounded-full hover:bg-[#5D5D5D] transition text-xs font-medium"
                  >
                    Open in Google Maps →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Globe - Center */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            {filteredGuides.length === 0 && searchQuery ? (
              <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[calc(100vh-200px)] flex items-center justify-center bg-white bg-opacity-20 rounded-3xl">
                <div className="text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  {viewingMyGuides && signedInUser ? (
                    <>
                      <p className="text-xl md:text-2xl text-[#3D3D3D] font-serif mb-2">You have no guides for this area</p>
                      <p className="text-sm text-[#8B7355] mb-4">Share your travel experiences!</p>
                      <button
                        onClick={() => setShowGuideForm(true)}
                        className="px-6 py-3 bg-[#8B4513] text-[#F5E6D3] rounded-full hover:bg-[#6D3410] transition text-sm font-medium"
                      >
                        + Add Guide
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xl md:text-2xl text-[#3D3D3D] font-serif mb-2">No destinations found</p>
                      <p className="text-sm text-[#8B7355]">Try searching for a different city, country, or author</p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[calc(100vh-200px)]">
                <GlobeView
                  guides={filteredGuides}
                  onMarkerClick={(guidesAtLocation) => {
                    setSelectedGuides(Array.isArray(guidesAtLocation) ? guidesAtLocation : [guidesAtLocation])
                    setCurrentGuideIndex(0)
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guide Form Modal */}
      {showGuideForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <GuideForm
              onSuccess={(newGuide) => {
                setShowGuideForm(false)
                // Auto-select the new guide
                setSelectedGuides([newGuide])
                setCurrentGuideIndex(0)
              }}
              onCancel={() => setShowGuideForm(false)}
            />
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <SignInModal
            onSuccess={({ email, guides }) => {
              setSignedInUser({ email, guides })
              setShowSignIn(false)
              setViewingMyGuides(true)
            }}
            onCancel={() => setShowSignIn(false)}
          />
        </div>
      )}

      {/* Edit Guide Modal */}
      {editingGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <GuideEditForm
              guide={editingGuide}
              onSuccess={(updatedGuide) => {
                setEditingGuide(null)
                // Update the guide in signedInUser.guides
                setSignedInUser(prev => ({
                  ...prev,
                  guides: prev.guides.map(g => g.id === updatedGuide.id ? updatedGuide : g)
                }))
                // Update selected guide if it's the one being edited
                if (selectedGuides.length > 0 && selectedGuides[currentGuideIndex].id === updatedGuide.id) {
                  setSelectedGuides(prev => prev.map(g => g.id === updatedGuide.id ? updatedGuide : g))
                }
              }}
              onCancel={() => {
                setEditingGuide(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
