import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icons issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapView({ guides }) {
  // Group guides by city to show count
  const guidesByLocation = guides.reduce((acc, guide) => {
    const key = `${guide.latitude},${guide.longitude}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(guide)
    return acc
  }, {})

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-xl">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Object.entries(guidesByLocation).map(([key, locationGuides]) => {
          const guide = locationGuides[0]
          const count = locationGuides.length

          return (
            <Marker
              key={key}
              position={[guide.latitude, guide.longitude]}
            >
              <Popup maxWidth={400}>
                <div className="p-2">
                  <h3 className="text-lg font-bold mb-2">
                    {guide.city}, {guide.country_name}
                  </h3>

                  {count > 1 && (
                    <p className="text-sm text-gray-600 mb-2">
                      {count} guides from this city
                    </p>
                  )}

                  {locationGuides.map((g, idx) => (
                    <div key={g.id} className={idx > 0 ? 'mt-4 pt-4 border-t' : ''}>
                      <p className="font-semibold text-indigo-600">
                        by {g.author_name}
                        {g.is_legacy && ' (2018)'}
                      </p>

                      {g.dish && (
                        <div className="mt-2">
                          <span className="text-xs font-semibold text-gray-700">🍽️ FOOD:</span>
                          <p className="text-sm text-gray-800 mt-1">{g.dish}</p>
                        </div>
                      )}

                      {g.sunset && (
                        <div className="mt-2">
                          <span className="text-xs font-semibold text-gray-700">🌅 VIEWS:</span>
                          <p className="text-sm text-gray-800 mt-1">{g.sunset}</p>
                        </div>
                      )}

                      {g.tips && (
                        <div className="mt-2">
                          <span className="text-xs font-semibold text-gray-700">💡 TIPS:</span>
                          <p className="text-sm text-gray-800 mt-1">{g.tips}</p>
                        </div>
                      )}

                      {g.google_maps_url && (
                        <a
                          href={g.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Open in Google Maps →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

export default MapView
