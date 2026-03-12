// Geocode a city and country to get latitude and longitude
export async function geocodeLocation(city, country) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    // Fallback to Nominatim (OpenStreetMap) if no Google API key
    return geocodeWithNominatim(city, country)
  }

  try {
    const address = `${city}, ${country}`
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    )
    const data = await response.json()

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location
      return {
        latitude: location.lat,
        longitude: location.lng,
        success: true
      }
    }

    // If Google fails, try Nominatim as backup
    return geocodeWithNominatim(city, country)
  } catch (error) {
    console.error('Geocoding error with Google:', error)
    // Try Nominatim as backup
    return geocodeWithNominatim(city, country)
  }
}

// Backup geocoding with OpenStreetMap Nominatim (free, no API key required)
async function geocodeWithNominatim(city, country) {
  try {
    const query = `${city}, ${country}`
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'NYUAD-Travel-Guide/2.0'
        }
      }
    )
    const data = await response.json()

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        success: true
      }
    }

    return {
      success: false,
      error: 'Location not found. Please check the city and country names.'
    }
  } catch (error) {
    console.error('Geocoding error with Nominatim:', error)
    return {
      success: false,
      error: 'Unable to geocode location. Please try again.'
    }
  }
}
