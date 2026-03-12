-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Guides table (travel entries)
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Location data
  country VARCHAR(3) NOT NULL,              -- ISO 3166-1 alpha-3
  country_name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,

  -- Author info
  author_name VARCHAR(255) NOT NULL,

  -- Guide content (preserved from 2018 schema)
  dish TEXT,
  sunset TEXT,
  family TEXT,
  friend TEXT,
  date TEXT,
  overrated TEXT,
  instead TEXT,
  walk TEXT,
  tips TEXT,

  -- New fields
  google_maps_url TEXT,                     -- Link to Google Maps place

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_legacy BOOLEAN DEFAULT FALSE,          -- Mark 2018 entries

  -- Search & indexing
  search_vector TSVECTOR
);

-- Photos table (new feature)
CREATE TABLE guide_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  photo_url TEXT NOT NULL,                  -- Supabase storage URL
  caption TEXT,
  order_index INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_guides_country ON guides(country);
CREATE INDEX idx_guides_city ON guides(city);
CREATE INDEX idx_guides_location ON guides USING GIST(
  ST_MakePoint(longitude, latitude)
);
CREATE INDEX idx_guides_search ON guides USING GIN(search_vector);
CREATE INDEX idx_guides_user ON guides(user_id);
CREATE INDEX idx_guide_photos_guide ON guide_photos(guide_id);

-- Full-text search trigger
CREATE OR REPLACE FUNCTION guides_search_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.author_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.country_name, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.dish, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.sunset, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.tips, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER guides_search_update
  BEFORE INSERT OR UPDATE ON guides
  FOR EACH ROW
  EXECUTE FUNCTION guides_search_trigger();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON guides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row-level security
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_photos ENABLE ROW LEVEL SECURITY;

-- Policies for guides table
CREATE POLICY "Guides are viewable by everyone"
  ON guides FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert guides"
  ON guides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guides"
  ON guides FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guides"
  ON guides FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous legacy entries (user_id is NULL)
CREATE POLICY "Legacy entries are viewable"
  ON guides FOR SELECT
  USING (user_id IS NULL OR true);

-- Policies for guide_photos table
CREATE POLICY "Photos are viewable by everyone"
  ON guide_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert photos"
  ON guide_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photos"
  ON guide_photos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos"
  ON guide_photos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('guide-photos', 'guide-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'guide-photos');

CREATE POLICY "Authenticated users can upload photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'guide-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'guide-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
