-- Allow deletes for legacy entries (user_id IS NULL)
DROP POLICY IF EXISTS "Users can delete their own guides" ON guides;

CREATE POLICY "Users can delete guides"
  ON guides FOR DELETE
  USING (
    (auth.uid() = user_id) OR (user_id IS NULL)
  );
