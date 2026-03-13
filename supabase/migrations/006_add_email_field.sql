-- Add email field to guides table
ALTER TABLE guides
ADD COLUMN IF NOT EXISTS email VARCHAR(255);
