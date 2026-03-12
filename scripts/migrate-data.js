import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Supabase credentials
const supabaseUrl = 'https://xerzfjinbidnqcvqhvja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcnpmamluYmlkbnFjdnFodmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyODk3OTQsImV4cCI6MjA4ODg2NTc5NH0.Y8BW85CKY3_um6n1jM9FlBvVdZArFRqj7kF5Lrw9zu0'

const supabase = createClient(supabaseUrl, supabaseKey)

// Country code to name mapping
const countryNames = {
  'AUS': 'Australia',
  'CAN': 'Canada',
  'CHN': 'China',
  'COL': 'Colombia',
  'CRI': 'Costa Rica',
  'CZE': 'Czech Republic',
  'DNK': 'Denmark',
  'EGY': 'Egypt',
  'ERI': 'Eritrea',
  'EST': 'Estonia',
  'FIN': 'Finland',
  'GBR': 'United Kingdom',
  'GEO': 'Georgia',
  'GTM': 'Guatemala',
  'HKG': 'Hong Kong',
  'HUN': 'Hungary',
  'IND': 'India',
  'JAM': 'Jamaica',
  'JOR': 'Jordan',
  'JPN': 'Japan',
  'KAZ': 'Kazakhstan',
  'LBN': 'Lebanon',
  'LTU': 'Lithuania',
  'MAR': 'Morocco',
  'MEX': 'Mexico',
  'MNE': 'Montenegro',
  'NGA': 'Nigeria',
  'NPL': 'Nepal',
  'NZL': 'New Zealand',
  'PAK': 'Pakistan',
  'PER': 'Peru',
  'PHL': 'Philippines',
  'POL': 'Poland',
  'QAT': 'Qatar',
  'RUS': 'Russia',
  'RWA': 'Rwanda',
  'SGP': 'Singapore',
  'ESP': 'Spain',
  'TZA': 'Tanzania',
  'UKR': 'Ukraine',
  'USA': 'United States',
  'VEN': 'Venezuela',
  'ZWE': 'Zimbabwe',
}

// Simple geocoding fallback data (approximate city coordinates)
const cityCoordinates = {
  'Doha': { lat: 25.2854, lng: 51.5310 },
  'Madrid': { lat: 40.4168, lng: -3.7038 },
  'Mumbai': { lat: 19.0760, lng: 72.8777 },
  'Delhi': { lat: 28.7041, lng: 77.1025 },
  'Bangalore': { lat: 12.9716, lng: 77.5946 },
  'Chennai': { lat: 13.0827, lng: 80.2707 },
  'Moscow': { lat: 55.7558, lng: 37.6173 },
  'Harare': { lat: -17.8252, lng: 31.0335 },
  'Caracas': { lat: 10.4806, lng: -66.9036 },
  'Kiev': { lat: 50.4501, lng: 30.5234 },
  'Dar es Salaam': { lat: -6.7924, lng: 39.2083 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Kigali': { lat: -1.9536, lng: 30.0606 },
  'Islamabad': { lat: 33.6844, lng: 73.0479 },
  'Auckland': { lat: -36.8485, lng: 174.7633 },
  'Kathmandu': { lat: 27.7172, lng: 85.3240 },
  'Lagos': { lat: 6.5244, lng: 3.3792 },
  'Podgorica': { lat: 42.4304, lng: 19.2594 },
  'Mexico City': { lat: 19.4326, lng: -99.1332 },
  'Rabat': { lat: 34.0209, lng: -6.8416 },
  'Vilnius': { lat: 54.6872, lng: 25.2797 },
  'Beirut': { lat: 33.8886, lng: 35.4955 },
  'Almaty': { lat: 43.2220, lng: 76.8512 },
  'Tokyo': { lat: 35.6762, lng: 139.6503 },
  'Amman': { lat: 31.9454, lng: 35.9284 },
  'Kingston': { lat: 17.9712, lng: -76.7936 },
  'Budapest': { lat: 47.4979, lng: 19.0402 },
  'Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Guatemala City': { lat: 14.6349, lng: -90.5069 },
  'Tbilisi': { lat: 41.7151, lng: 44.8271 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Copenhagen': { lat: 55.6761, lng: 12.5683 },
  'Cairo': { lat: 30.0444, lng: 31.2357 },
  'Asmara': { lat: 15.3229, lng: 38.9251 },
  'Tallinn': { lat: 59.4370, lng: 24.7536 },
  'Helsinki': { lat: 60.1699, lng: 24.9384 },
  'Prague': { lat: 50.0755, lng: 14.4378 },
  'San Jose': { lat: 9.9281, lng: -84.0907 },
  'Bogota': { lat: 4.7110, lng: -74.0721 },
  'Beijing': { lat: 39.9042, lng: 116.4074 },
  'Toronto': { lat: 43.6532, lng: -79.3832 },
  'Sydney': { lat: -33.8688, lng: 151.2093 },
  'Manila': { lat: 14.5995, lng: 120.9842 },
  'Warsaw': { lat: 52.2297, lng: 21.0122 },
  'Lima': { lat: -12.0464, lng: -77.0428 },
}

async function migrateData() {
  console.log('🚀 Starting data migration...\n')

  // Read the legacy data
  const dataPath = path.join(__dirname, '../../MASHUPS FINAL 3/data-backup-2026.json')

  if (!fs.existsSync(dataPath)) {
    console.error('❌ Error: data-backup-2026.json not found at:', dataPath)
    console.log('   Make sure the original project is at: /Users/alyssayu/Downloads/MASHUPS FINAL 3/')
    process.exit(1)
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8')
  const data = JSON.parse(rawData)

  console.log(`📊 Found ${data.total_rows} entries to migrate\n`)

  let successCount = 0
  let errorCount = 0

  for (const row of data.rows) {
    const doc = row.doc

    // Skip design documents or invalid entries
    if (!doc.name || !doc.country || !doc.citi) {
      console.log(`⚠️  Skipping invalid entry: ${doc._id}`)
      continue
    }

    // Get coordinates for the city
    const cityName = doc.citi.trim()
    const coords = cityCoordinates[cityName] || { lat: 0, lng: 0 }

    if (coords.lat === 0 && coords.lng === 0) {
      console.log(`⚠️  No coordinates for city: ${cityName}`)
    }

    // Transform the data
    const guide = {
      user_id: null, // Legacy entries are anonymous
      country: doc.country,
      country_name: countryNames[doc.country] || doc.country,
      city: cityName,
      latitude: coords.lat,
      longitude: coords.lng,
      author_name: doc.name,
      dish: doc.dish || null,
      sunset: doc.sunset || null,
      family: doc.family || null,
      friend: doc.friend || null,
      date: doc.date || null,
      overrated: doc.over || null,
      instead: doc.instead || null,
      walk: doc.walk || null,
      tips: doc.tips || null,
      google_maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cityName + ', ' + (countryNames[doc.country] || doc.country))}`,
      is_legacy: true,
    }

    // Insert into Supabase
    try {
      const { error } = await supabase
        .from('guides')
        .insert(guide)

      if (error) {
        console.log(`❌ Error inserting ${doc.name} (${cityName}): ${error.message}`)
        errorCount++
      } else {
        console.log(`✅ Migrated: ${doc.name} - ${cityName}, ${guide.country_name}`)
        successCount++
      }
    } catch (err) {
      console.log(`❌ Exception for ${doc.name}: ${err.message}`)
      errorCount++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n📊 Migration Summary:')
  console.log(`   ✅ Successfully migrated: ${successCount} guides`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log('\n🎉 Migration complete!')

  // Verify data
  const { data: guides, error } = await supabase
    .from('guides')
    .select('country, city, author_name, is_legacy')
    .eq('is_legacy', true)

  if (!error) {
    console.log(`\n✅ Verification: Found ${guides.length} legacy entries in database`)
  }
}

// Run migration
migrateData().catch(console.error)
