-- Enable required extensions (pgcrypto for gen_random_uuid if needed)
-- Note: gen_random_uuid() is built-in to PostgreSQL 13+ and Supabase

-- Helper function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
