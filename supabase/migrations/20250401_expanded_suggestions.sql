
-- Create tables for image analysis
CREATE TABLE IF NOT EXISTS image_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  scene_type TEXT,
  time_of_day TEXT,
  clutter_score FLOAT,
  detected_objects TEXT[],
  confidence FLOAT,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_image_analysis_image_url ON image_analysis(image_url);

-- Create table for suggestion rules
CREATE TABLE IF NOT EXISTS suggestion_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT true,
  trigger_type TEXT NOT NULL,
  trigger_threshold INTEGER DEFAULT 1,
  weight FLOAT DEFAULT 1.0,
  conditions JSONB DEFAULT '{}'::jsonb,
  actions JSONB DEFAULT '[]'::jsonb,
  ab_test JSONB DEFAULT '{}'::jsonb,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create table for suggestion interactions
CREATE TABLE IF NOT EXISTS suggestion_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for A/B test segments
CREATE TABLE IF NOT EXISTS ab_test_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  segment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_suggestion_interactions_suggestion_id ON suggestion_interactions(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_interactions_user_id ON suggestion_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_interactions_action ON suggestion_interactions(action);
CREATE INDEX IF NOT EXISTS idx_ab_test_segments_user_id ON ab_test_segments(user_id);

-- Add some default suggestion rules
INSERT INTO suggestion_rules (name, description, trigger_type, trigger_threshold, conditions, actions, priority)
VALUES 
(
  'virtual_staging', 
  'Suggests virtual staging for empty rooms',
  'image_analysis',
  1,
  '{"emptyRoom": true}',
  '[{"type": "add_service", "payload": {"service": "virtual_staging", "title": "This room would look amazing with virtual staging", "description": "See how this space could look fully furnished without renting expensive furniture.", "ctaText": "Add Virtual Staging", "imageUrl": "/assets/VirtualStaging_After.JPEG"}}]',
  10
),
(
  'twilight_conversion', 
  'Suggests twilight conversion for exterior shots',
  'image_analysis',
  1,
  '{"exterior": true}',
  '[{"type": "add_service", "payload": {"service": "twilight_conversion", "title": "Transform this exterior to a stunning twilight shot", "description": "Day-to-dusk conversion creates a magical evening atmosphere that makes listings stand out.", "ctaText": "Add Twilight Effect", "imageUrl": "/assets/Twilight_After.JPG"}}]',
  9
),
(
  'decluttering', 
  'Suggests virtual decluttering for cluttered spaces',
  'image_analysis',
  1,
  '{"cluttered": true}',
  '[{"type": "add_service", "payload": {"service": "decluttering", "title": "Remove clutter for a cleaner look", "description": "Digitally remove distracting items to make the space look more appealing and spacious.", "ctaText": "Add Decluttering", "imageUrl": "/assets/Decluttering_After.JPEG"}}]',
  8
),
(
  'subscription_upsell', 
  'Suggests subscription plans for frequent users',
  'order_count',
  5,
  '{"orderCount": {"min": 5}}',
  '[{"type": "navigate", "payload": {"screen": "SubscriptionPlans", "title": "Save up to 56% with a monthly plan", "description": "You\'re a frequent user! Switch to a subscription plan and save on every edit.", "ctaText": "View Plans", "discountAmount": 20, "discountCode": "LOYAL20"}}]',
  7
);

-- Add RLS policies
ALTER TABLE image_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_segments ENABLE ROW LEVEL SECURITY;

-- Only admins can manage suggestion rules
CREATE POLICY "Admins can manage suggestion rules"
  ON suggestion_rules
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- All authenticated users can view suggestion rules  
CREATE POLICY "Authenticated users can view suggestion rules"
  ON suggestion_rules
  FOR SELECT
  TO authenticated
  USING (enabled = true);

-- Users can track their own interactions
CREATE POLICY "Users can track own suggestion interactions"
  ON suggestion_interactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can see their own interactions
CREATE POLICY "Users can view own suggestion interactions"
  ON suggestion_interactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can see their own A/B test segment
CREATE POLICY "Users can view own ab test segment"
  ON ab_test_segments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create functions to analyze user behavior for suggestions
CREATE OR REPLACE FUNCTION get_suggestion_effectiveness(
  rule_id UUID,
  time_period TEXT DEFAULT '30 days'
)
RETURNS TABLE (
  suggestion_rule_id UUID,
  rule_name TEXT,
  impressions BIGINT,
  clicks BIGINT,
  dismissals BIGINT,
  click_through_rate FLOAT,
  effectiveness_score FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
  start_date TIMESTAMPTZ;
BEGIN
  -- Calculate start date based on time period
  IF time_period = '7 days' THEN
    start_date := NOW() - INTERVAL '7 days';
  ELSIF time_period = '30 days' THEN
    start_date := NOW() - INTERVAL '30 days';
  ELSIF time_period = '90 days' THEN
    start_date := NOW() - INTERVAL '90 days';
  ELSE
    start_date := NOW() - INTERVAL '30 days';
  END IF;

  RETURN QUERY
  WITH stats AS (
    SELECT
      rule_id AS suggestion_rule_id,
      r.name AS rule_name,
      COUNT(CASE WHEN si.action = 'view' THEN 1 END) AS impressions,
      COUNT(CASE WHEN si.action = 'click' THEN 1 END) AS clicks,
      COUNT(CASE WHEN si.action = 'dismiss' THEN 1 END) AS dismissals
    FROM suggestion_interactions si
    JOIN suggestion_rules r ON si.metadata->>'ruleId' = r.id::text
    WHERE 
      r.id = rule_id
      AND si.created_at >= start_date
    GROUP BY rule_id, r.name
  )
  SELECT
    s.suggestion_rule_id,
    s.rule_name,
    s.impressions,
    s.clicks,
    s.dismissals,
    CASE WHEN s.impressions > 0 THEN s.clicks::FLOAT / s.impressions ELSE 0 END AS click_through_rate,
    CASE 
      WHEN s.impressions > 0 THEN 
        (s.clicks * 2 - s.dismissals)::FLOAT / s.impressions 
      ELSE 0 
    END AS effectiveness_score
  FROM stats s;
END;
$$;
