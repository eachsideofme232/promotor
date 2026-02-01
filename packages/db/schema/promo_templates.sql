-- Promotion templates schema
-- Reusable templates for recurring promotions

-- Promo templates table
CREATE TABLE IF NOT EXISTS promo_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id),

  name VARCHAR(200) NOT NULL,
  description TEXT,

  -- Default promotion settings
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'bogo', 'coupon', 'gift', 'bundle')),
  discount_value VARCHAR(50),

  -- Recurrence pattern (optional)
  -- e.g., "monthly", "quarterly", or null for one-time templates
  recurrence_type VARCHAR(20) CHECK (recurrence_type IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  recurrence_day INTEGER, -- Day of week (0-6) or day of month (1-31)

  -- Duration in days (used to calculate end_date from start_date)
  default_duration_days INTEGER,

  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX idx_promo_templates_team_id ON promo_templates(team_id);
CREATE INDEX idx_promo_templates_channel_id ON promo_templates(channel_id);
CREATE INDEX idx_promo_templates_is_active ON promo_templates(is_active);

-- Row Level Security
ALTER TABLE promo_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access templates from their teams
CREATE POLICY "Users can view their team's templates"
  ON promo_templates
  FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert templates to their teams"
  ON promo_templates
  FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Users can update their team's templates"
  ON promo_templates
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
    )
  );

CREATE POLICY "Admins can delete their team's templates"
  ON promo_templates
  FOR DELETE
  USING (
    team_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER promo_templates_updated_at
  BEFORE UPDATE ON promo_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
