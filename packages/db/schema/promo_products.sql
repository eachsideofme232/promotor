-- Promotion-Products join table schema
-- N:M relationship between promotions and products

-- Promo products join table
CREATE TABLE IF NOT EXISTS promo_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- Optional: promotion-specific pricing for this product
  promo_price INTEGER, -- In KRW (원)

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(promotion_id, product_id)
);

-- Indexes
CREATE INDEX idx_promo_products_promotion_id ON promo_products(promotion_id);
CREATE INDEX idx_promo_products_product_id ON promo_products(product_id);

-- Row Level Security
ALTER TABLE promo_products ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Inherits access from promotions table
-- Users can access promo_products if they can access the related promotion
CREATE POLICY "Users can view promo products for their team's promotions"
  ON promo_products
  FOR SELECT
  USING (
    promotion_id IN (
      SELECT id FROM promotions
      WHERE team_id IN (
        SELECT team_id FROM team_members
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage promo products for their team's promotions"
  ON promo_products
  FOR ALL
  USING (
    promotion_id IN (
      SELECT id FROM promotions
      WHERE team_id IN (
        SELECT team_id FROM team_members
        WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'member')
      )
    )
  );
