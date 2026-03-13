-- Add street cred fields to guides table
ALTER TABLE guides
ADD COLUMN street_cred VARCHAR(50),
ADD COLUMN street_cred_years INTEGER;

-- Update all legacy entries to "I'm from here"
UPDATE guides
SET street_cred = 'from_here'
WHERE is_legacy = TRUE;

-- Update Alyssa Yu's Dubai guide to "lived here for 4 years"
UPDATE guides
SET street_cred = 'lived_here',
    street_cred_years = 4
WHERE author_name = 'Alyssa Yu'
  AND city = 'Dubai'
  AND is_legacy = FALSE;
