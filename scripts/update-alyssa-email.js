import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xerzfjinbidnqcvqhvja.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcnpmamluYmlkbnFjdnFodmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyODk3OTQsImV4cCI6MjA4ODg2NTc5NH0.Y8BW85CKY3_um6n1jM9FlBvVdZArFRqj7kF5Lrw9zu0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateAlyssaEmail() {
  console.log('Updating email for Alyssa Yu entries...')

  try {
    // First, make sure the email column exists
    console.log('\n⚠️  Make sure you ran this SQL first:')
    console.log('ALTER TABLE guides ADD COLUMN IF NOT EXISTS email VARCHAR(255);\n')

    // Update entries for Alyssa Yu
    const { data, error } = await supabase
      .from('guides')
      .update({ email: 'alyssagabrielleyu@gmail.com' })
      .eq('author_name', 'Alyssa Yu')
      .in('city', ['Manila', 'Dubai'])
      .select()

    if (error) {
      console.error('Error updating entries:', error)
    } else {
      console.log(`✓ Updated ${data.length} entry/entries:`)
      data.forEach(entry => {
        console.log(`  - ${entry.city}, ${entry.country_name}`)
      })
    }

    console.log('\n✅ Done!')

  } catch (error) {
    console.error('Error:', error.message)
  }
}

updateAlyssaEmail()
