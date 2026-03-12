-- Fix policy to allow inserting legacy entries with NULL user_id
DROP POLICY IF EXISTS "Authenticated users can insert guides" ON guides;

CREATE POLICY "Users can insert guides"
  ON guides FOR INSERT
  WITH CHECK (
    -- Allow authenticated users to insert their own guides
    (auth.uid() = user_id) OR
    -- Allow inserting legacy entries with NULL user_id
    (user_id IS NULL)
  );
