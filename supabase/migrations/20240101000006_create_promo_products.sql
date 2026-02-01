-- Promotion-Products join table (N:M relationship)
CREATE TABLE IF NOT EXISTS promo_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,

  -- Optional: promotion-specific pricing for this product
  promo_price INTEGER, -- In KRW (won)

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(promotion_id, product_id)
);

-- Indexes
CREATE INDEX idx_promo_products_promotion_id ON promo_products(promotion_id);
CREATE INDEX idx_promo_products_product_id ON promo_products(product_id);

-- Row Level Security
ALTER TABLE promo_products ENABLE ROW LEVEL SECURITY;

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
