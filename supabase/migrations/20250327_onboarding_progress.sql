
-- Create table to track user onboarding progress
CREATE TABLE IF NOT EXISTS user_onboarding (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  completed_tour BOOLEAN DEFAULT FALSE,
  completed_steps JSONB DEFAULT '[]',
  last_step_seen TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_user_onboarding_timestamp
BEFORE UPDATE ON user_onboarding
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
