-- Channels table (reference data for Korean e-commerce platforms)
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  logo_url TEXT,
  color VARCHAR(20) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (permissive - reference data)
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Channels are viewable by authenticated users"
  ON channels
  FOR SELECT
  TO authenticated
  USING (true);
