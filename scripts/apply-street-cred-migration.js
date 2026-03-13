import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  console.log('Applying street cred migration...')

  try {
    // Check if columns already exist
    const { data: testData, error: testError } = await supabase
      .from('guides')
      .select('street_cred')
      .limit(1)

    if (!testError) {
      console.log('Migration already applied!')
      return
    }

    console.log('Note: Cannot add columns via JS client. Please run the migration SQL directly in Supabase dashboard.')
    console.log('\nSQL to run:')
    console.log('---')
    console.log(`
ALTER TABLE guides
ADD COLUMN IF NOT EXISTS street_cred VARCHAR(50),
ADD COLUMN IF NOT EXISTS street_cred_years INTEGER;

UPDATE guides
SET street_cred = 'from_here'
WHERE is_legacy = TRUE;

UPDATE guides
SET street_cred = 'lived_here',
    street_cred_years = 4
WHERE author_name = 'Alyssa Yu'
  AND city = 'Dubai'
  AND is_legacy = FALSE;
    `)
    console.log('---')

  } catch (error) {
    console.error('Error:', error.message)
  }
}

applyMigration()
