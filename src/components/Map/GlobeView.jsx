import { useEffect, useRef, useState } from 'react'
import Globe from 'react-globe.gl'

function GlobeView({ guides, onMarkerClick }) {
  const globeEl = useRef()
  const containerRef = useRef()
  const [isHovering, setIsHovering] = useState(false)
  const [countries, setCountries] = useState({ features: [] })
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 })

  // Get unique countries that have guides
  const countriesWithGuides = new Set(guides.map(guide => guide.country_name))

  // Country name mapping for GeoJSON to our database names
  const countryNameMap = {
    'United States of America': 'United States',
    'United Kingdom': 'United Kingdom',
    'UAE': 'United Arab Emirates',
    'Russia': 'Russia',
    'South Korea': 'South Korea',
    'North Korea': 'North Korea',
    'Czech Republic': 'Czech Republic',
    'Republic of the Congo': 'Congo',
    'Democratic Republic of the Congo': 'Congo',
    'Tanzania': 'Tanzania',
    'Czechia': 'Czech Republic'
  }

  const hasGuides = (geoCountryName) => {
    // Direct match
    if (countriesWithGuides.has(geoCountryName)) return true

    // Check mapping
    const mappedName = countryNameMap[geoCountryName]
    if (mappedName && countriesWithGuides.has(mappedName)) return true

    // Partial match (e.g., "United States" matches "United States of America")
    for (const country of countriesWithGuides) {
      if (geoCountryName.includes(country) || country.includes(geoCountryName)) {
        return true
      }
    }

    return false
  }

  useEffect(() => {
    // Fetch country borders data
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries)
  }, [])

  useEffect(() => {
    // Update dimensions on resize
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current
        setDimensions({ width: clientWidth, height: clientHeight })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls()

      // Auto-rotate the globe
      controls.autoRotate = true
      controls.autoRotateSpeed = isHovering ? 0.1 : 0.5

      // Set zoom limits to prevent cutting off globe edges
      controls.minDistance = 120  // Don't zoom in too close
      controls.maxDistance = 400  // Don't zoom out too far

      // Enable damping for smoother controls
      controls.enableDamping = true
      controls.dampingFactor = 0.1

    }
  }, [isHovering])

  // Group guides by location
  const guidesByLocation = guides.reduce((acc, guide) => {
    const key = `${guide.latitude},${guide.longitude}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(guide)
    return acc
  }, {})

  // Convert to globe markers (one per location)
  const markers = Object.entries(guidesByLocation).map(([key, locationGuides]) => {
    const [lat, lng] = key.split(',').map(Number)
    return {
      lat,
      lng,
      size: 0.6,
      color: '#8B4513',
      guides: locationGuides,
      count: locationGuides.length
    }
  })

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
        backgroundColor="rgba(0,0,0,0)"
        width={dimensions.width}
        height={dimensions.height}

        // Country borders
        polygonsData={countries.features}
        polygonCapColor={(d) => {
          const countryName = d.properties.NAME || d.properties.name || d.properties.ADMIN
          // Check if this country has guides
          if (hasGuides(countryName)) {
            return 'rgba(150, 200, 230, 0.3)' // Light blue
          }
          return 'rgba(0, 0, 0, 0)' // Transparent
        }}
        polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
        polygonStrokeColor={() => 'rgba(150, 200, 230, 0.4)'}
        polygonAltitude={0}

        // HTML Elements (custom markers with proper occlusion and tooltips)
        htmlElementsData={markers}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0}
        htmlElement={d => {
          const wrapper = document.createElement('div')
          wrapper.style.position = 'relative'
          wrapper.style.pointerEvents = 'auto'

          const el = document.createElement('div')
          el.style.width = '12px'
          el.style.height = '12px'
          el.style.borderRadius = '50%'
          el.style.backgroundColor = d.color
          el.style.cursor = 'pointer'
          el.style.border = '1px solid rgba(61, 61, 61, 0.3)'
          el.style.boxShadow = '0 0 4px rgba(0,0,0,0.2)'
          el.style.position = 'relative'

          const guide = d.guides[0]
          const count = d.count

          // Create tooltip
          const tooltip = document.createElement('div')
          tooltip.style.position = 'absolute'
          tooltip.style.bottom = '16px'
          tooltip.style.left = '50%'
          tooltip.style.transform = 'translateX(-50%)'
          tooltip.style.background = '#3D3D3D'
          tooltip.style.color = '#F5E6D3'
          tooltip.style.padding = '8px 12px'
          tooltip.style.borderRadius = '8px'
          tooltip.style.fontFamily = 'monospace'
          tooltip.style.fontSize = '12px'
          tooltip.style.whiteSpace = 'nowrap'
          tooltip.style.pointerEvents = 'none'
          tooltip.style.opacity = '0'
          tooltip.style.transition = 'opacity 0.2s'
          tooltip.style.zIndex = '10000'
          tooltip.innerHTML = `<strong>${guide.city}, ${guide.country_name}</strong><br/>${count > 1 ? `${count} guides from this city` : `by ${guide.author_name}`}`

          wrapper.appendChild(el)
          wrapper.appendChild(tooltip)

          wrapper.onmouseenter = () => {
            tooltip.style.opacity = '1'
          }

          wrapper.onmouseleave = () => {
            tooltip.style.opacity = '0'
          }

          wrapper.onclick = (e) => {
            e.stopPropagation()
            if (onMarkerClick) onMarkerClick(d.guides)
          }

          return wrapper
        }}

        // Labels on hover
        pointLabel={d => {
          const guide = d.guides[0]
          const count = d.count
          return `
            <div style="background: #3D3D3D; color: #F5E6D3; padding: 8px 12px; border-radius: 8px; font-family: monospace;">
              <strong>${guide.city}, ${guide.country_name}</strong><br/>
              ${count > 1 ? `${count} guides from this city` : `by ${guide.author_name}`}
            </div>
          `
        }}

        // Click handler
        onPointClick={(point) => {
          if (onMarkerClick) onMarkerClick(point.guides)
        }}

        // Globe material - light blue water, beige land (flat surface)
        globeMaterial={{
          color: '#D4C4A8',
          emissive: '#B8D8E8',
          emissiveIntensity: 0.2,
          bumpScale: 0
        }}

        // Atmosphere
        atmosphereColor="#A8C8E0"
        atmosphereAltitude={0.15}

        // Camera
        enablePointerInteraction={true}
      />

      {/* Selected guide info - removed, now shown in main detail panel */}
    </div>
  )
}

export default GlobeView
