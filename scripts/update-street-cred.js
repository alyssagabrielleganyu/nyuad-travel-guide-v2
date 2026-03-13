import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xerzfjinbidnqcvqhvja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcnpmamluYmlkbnFjdnFodmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyODk3OTQsImV4cCI6MjA4ODg2NTc5NH0.Y8BW85CKY3_um6n1jM9FlBvVdZArFRqj7kF5Lrw9zu0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateStreetCred() {
  console.log('Updating street cred for existing guides...')

  try {
    // Note: We need to run the ALTER TABLE commands in Supabase SQL Editor
    console.log('\n⚠️  Please run these SQL commands in Supabase SQL Editor first:')
    console.log('---')
    console.log(`
ALTER TABLE guides
ADD COLUMN IF NOT EXISTS street_cred VARCHAR(50),
ADD COLUMN IF NOT EXISTS street_cred_years INTEGER;
    `)
    console.log('---\n')

    // Update legacy entries
    const { data: legacyData, error: legacyError } = await supabase
      .from('guides')
      .update({ street_cred: 'from_here' })
      .eq('is_legacy', true)
      .select()

    if (legacyError) {
      console.error('Error updating legacy entries:', legacyError)
    } else {
      console.log(`✓ Updated ${legacyData.length} legacy entries to "from_here"`)
    }

    // Update Alyssa Yu's Dubai guide
    const { data: dubaiData, error: dubaiError } = await supabase
      .from('guides')
      .update({
        street_cred: 'lived_here',
        street_cred_years: 4
      })
      .eq('author_name', 'Alyssa Yu')
      .eq('city', 'Dubai')
      .eq('is_legacy', false)
      .select()

    if (dubaiError) {
      console.error('Error updating Dubai guide:', dubaiError)
    } else {
      console.log(`✓ Updated ${dubaiData.length} Dubai guide(s) to "lived here for 4 years"`)
    }

    console.log('\n✅ Migration complete!')

  } catch (error) {
    console.error('Error:', error.message)
  }
}

updateStreetCred()
