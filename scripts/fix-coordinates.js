import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xerzfjinbidnqcvqhvja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcnpmamluYmlkbnFjdnFodmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyODk3OTQsImV4cCI6MjA4ODg2NTc5NH0.Y8BW85CKY3_um6n1jM9FlBvVdZArFRqj7kF5Lrw9zu0'

const supabase = createClient(supabaseUrl, supabaseKey)

const cityCoordinates = {
  'Bombay': { lat: 19.0760, lng: 72.8777 }, // Mumbai
  'Salisbury': { lat: 51.0693, lng: -1.7944 }, // UK
  'Osaka': { lat: 34.6937, lng: 135.5023 },
  'Lahore': { lat: 31.5204, lng: 74.3587 },
  'Poznań': { lat: 52.4064, lng: 16.9252 },
  'Bilbao': { lat: 43.2630, lng: -2.9350 },
  'Chitwan': { lat: 27.5291, lng: 84.3542 },
  'Casablanca': { lat: 33.5731, lng: -7.5898 },
  'Guwahati': { lat: 26.1445, lng: 91.7362 },
  'Dearborn, Michigan': { lat: 42.3223, lng: -83.1763 },
  'Bulawayo': { lat: -20.1500, lng: 28.5833 },
  'Shanghai': { lat: 31.2304, lng: 121.4737 },
  'Quetzaltenango': { lat: 14.8333, lng: -91.5167 },
  'Escazu': { lat: 9.9167, lng: -84.1333 },
  'Kirov': { lat: 58.6035, lng: 49.6680 },
  'Cairns': { lat: -16.9186, lng: 145.7781 },
  'Charleston, SC': { lat: 32.7765, lng: -79.9311 },
  'Montreal': { lat: 45.5017, lng: -73.5673 },
  'Kyiv': { lat: 50.4501, lng: 30.5234 },
  'Igarra': { lat: 7.3000, lng: 6.1167 },
  'Quezon City': { lat: 14.6760, lng: 121.0437 },
  'Oskemen': { lat: 49.9787, lng: 82.6147 },
}

async function fixCoordinates() {
  console.log('🔧 Fixing coordinates for cities with 0,0...\n')

  let fixedCount = 0
  let errorCount = 0

  for (const [city, coords] of Object.entries(cityCoordinates)) {
    try {
      const { data: guides, error: fetchError } = await supabase
        .from('guides')
        .select('id')
        .eq('city', city)
        .eq('latitude', 0)

      if (fetchError) throw fetchError

      if (!guides || guides.length === 0) {
        console.log(`⚠️  No guides found for ${city}`)
        continue
      }

      for (const guide of guides) {
        const { error: updateError } = await supabase
          .from('guides')
          .update({
            latitude: coords.lat,
            longitude: coords.lng
          })
          .eq('id', guide.id)

        if (updateError) throw updateError
      }

      console.log(`✅ Fixed ${guides.length} guide(s) in ${city} → ${coords.lat}, ${coords.lng}`)
      fixedCount += guides.length

    } catch (err) {
      console.log(`❌ Error fixing ${city}: ${err.message}`)
      errorCount++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Fixed: ${fixedCount} guides`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log('\n🎉 Done! Refresh your map to see all cities.')
}

fixCoordinates().catch(console.error)
