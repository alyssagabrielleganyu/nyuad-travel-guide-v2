-- Allow updates to legacy entries (user_id IS NULL)
DROP POLICY IF EXISTS "Users can update their own guides" ON guides;

CREATE POLICY "Users can update guides"
  ON guides FOR UPDATE
  USING (
    (auth.uid() = user_id) OR (user_id IS NULL)
  );
