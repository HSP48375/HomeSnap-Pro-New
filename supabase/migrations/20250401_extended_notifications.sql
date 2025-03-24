
-- Extend notification_preferences table with new fields
ALTER TABLE notification_preferences
ADD COLUMN IF NOT EXISTS custom_sound TEXT DEFAULT 'default',
ADD COLUMN IF NOT EXISTS silent_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS silent_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS silent_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS group_by_property BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS interactive_actions BOOLEAN DEFAULT true;

-- Add new fields to notifications table
ALTER TABLE notifications
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id),
ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id),
ADD COLUMN IF NOT EXISTS group_id TEXT;

-- Create notification_actions table
CREATE TABLE IF NOT EXISTS notification_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  action_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_payload JSONB,
  executed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create push_tokens table to store device tokens
CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  device TEXT,
  platform TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add RLS policies
ALTER TABLE notification_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification_actions"
  ON notification_actions
  FOR SELECT
  USING (notification_id IN (
    SELECT id FROM notifications WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own notification_actions"
  ON notification_actions
  FOR INSERT
  WITH CHECK (notification_id IN (
    SELECT id FROM notifications WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view own push_tokens"
  ON push_tokens
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own push_tokens"
  ON push_tokens
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own push_tokens"
  ON push_tokens
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own push_tokens"
  ON push_tokens
  FOR DELETE
  USING (user_id = auth.uid());

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_notifications_property_id ON notifications(property_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_group_id ON notifications(group_id);
CREATE INDEX IF NOT EXISTS idx_notification_actions_notification_id ON notification_actions(notification_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON push_tokens(user_id);
