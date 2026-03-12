import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

function GlobeView({ guides, onMarkerClick }) {
  const globeEl = useRef()
  const [selectedGuide, setSelectedGuide] = useState(null)

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate the globe
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.5
    }
  }, [])

  // Convert guides to globe markers
  const markers = guides.map(guide => ({
    lat: guide.latitude,
    lng: guide.longitude,
    size: 0.3,
    color: '#8B4513',
    guide: guide
  }))

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        backgroundColor="rgba(0,0,0,0)"
        width={600}
        height={600}

        // Points (markers)
        pointsData={markers}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude={0.01}
        pointRadius="size"

        // Labels on hover
        pointLabel={d => `
          <div style="background: #3D3D3D; color: #F5E6D3; padding: 8px 12px; border-radius: 8px; font-family: monospace;">
            <strong>${d.guide.city}, ${d.guide.country_name}</strong><br/>
            by ${d.guide.author_name}
          </div>
        `}

        // Click handler
        onPointClick={(point) => {
          setSelectedGuide(point.guide)
          if (onMarkerClick) onMarkerClick(point.guide)
        }}

        // Atmosphere
        atmosphereColor="#F5E6D3"
        atmosphereAltitude={0.15}

        // Camera
        enablePointerInteraction={true}
      />

      {/* Selected guide info */}
      {selectedGuide && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#3D3D3D] text-[#F5E6D3] p-4 rounded-lg max-w-md">
          <button
            onClick={() => setSelectedGuide(null)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center hover:bg-[#5D5D5D] rounded"
          >
            ×
          </button>
          <h3 className="font-bold mb-1">{selectedGuide.city}</h3>
          <p className="text-sm opacity-80 mb-2">by {selectedGuide.author_name}</p>
          {selectedGuide.dish && (
            <p className="text-xs mt-2">🍽️ {selectedGuide.dish.slice(0, 100)}...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default GlobeView
