-- Products and SKU table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  name VARCHAR(200) NOT NULL,
  sku VARCHAR(100),
  barcode VARCHAR(100),
  brand VARCHAR(100),
  category VARCHAR(100),

  description TEXT,
  image_url TEXT,

  -- Pricing (in KRW, stored as integer for accuracy)
  base_price INTEGER,
  cost_price INTEGER,

  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_team_id ON products(team_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_is_active ON products(is_active);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their team's products"
  ON products
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert products to their teams"
  ON products
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Users can update their team's products"
  ON products
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Admins can delete their team's products"
  ON products
  FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
