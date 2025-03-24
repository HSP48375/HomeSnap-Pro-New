
-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  price decimal(10, 2) NOT NULL,
  photo_edits integer NOT NULL,
  photo_price decimal(10, 2) NOT NULL,
  savings text NOT NULL,
  twilight_conversions text,
  virtual_staging integer,
  listing_descriptions integer,
  floorplans integer,
  turnaround text NOT NULL,
  rollover integer,
  team_members text,
  white_label boolean DEFAULT false,
  vip_manager boolean DEFAULT false,
  color text NOT NULL,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES subscription_plans(id) NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_credits table
CREATE TABLE IF NOT EXISTS subscription_credits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  photo_edits integer DEFAULT 0,
  twilight_conversions integer,
  virtual_staging integer,
  listing_descriptions integer,
  floorplans integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

-- Create team_members table for team plans
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES auth.users(id),
  email text,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (team_id, member_id),
  UNIQUE (team_id, email),
  CHECK (member_id IS NOT NULL OR email IS NOT NULL)
);

-- Create subscription_transactions table for payment history
CREATE TABLE IF NOT EXISTS subscription_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
  amount decimal(10, 2) NOT NULL,
  status text NOT NULL CHECK (status IN ('succeeded', 'failed', 'pending')),
  transaction_date timestamptz NOT NULL,
  payment_method_id text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create credit_usage_log table to track credit usage
CREATE TABLE IF NOT EXISTS credit_usage_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credit_type text NOT NULL CHECK (credit_type IN ('photo_edits', 'twilight_conversions', 'virtual_staging', 'listing_descriptions', 'floorplans')),
  amount integer NOT NULL,
  order_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, photo_edits, photo_price, savings, twilight_conversions, virtual_staging, listing_descriptions, floorplans, turnaround, rollover, team_members, white_label, vip_manager, color, popular)
VALUES
  ('Starter Package', 49, 40, 1.22, '19%', NULL, 1, NULL, NULL, '24-hour', 20, NULL, false, false, '#4B9CD3', false),
  ('Realtor Pro', 99, 100, 0.99, '34%', '2', 0, 1, NULL, '16-hour', 50, NULL, false, false, '#6C5CE7', true),
  ('Team Basic', 249, 250, 0.99, '34%', '5', 3, 3, 3, 'under 16-hour', NULL, '3', false, false, '#00B894', false),
  ('Agency Premium', 499, 600, 0.83, '45%', '10', 8, 6, 5, '12-hour', NULL, '7', false, false, '#F39C12', false),
  ('Enterprise', 999, 1500, 0.66, '56%', 'Unlimited', 20, 15, 10, '8-10 hour', NULL, 'Unlimited', true, true, '#E74C3C', false);

-- Create RLS policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_usage_log ENABLE ROW LEVEL SECURITY;

-- Subscription plans are readable by anyone
CREATE POLICY "Anyone can read subscription plans" 
  ON subscription_plans FOR SELECT USING (true);

-- Subscriptions are readable only by the user who owns them or team admins
CREATE POLICY "Users can read their own subscriptions" 
  ON subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

-- Only authenticated users can insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions" 
  ON subscriptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Only the owner can update or delete their subscription
CREATE POLICY "Users can update their own subscriptions" 
  ON subscriptions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Subscription credits are only readable by their owner
CREATE POLICY "Users can read their own subscription credits" 
  ON subscription_credits FOR SELECT 
  USING (auth.uid() = user_id);

-- Only authenticated users can insert their own subscription credits
CREATE POLICY "Users can insert their own subscription credits" 
  ON subscription_credits FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Only the owner can update their subscription credits
CREATE POLICY "Users can update their own subscription credits" 
  ON subscription_credits FOR UPDATE 
  USING (auth.uid() = user_id);

-- Team members can be read by the team owner
CREATE POLICY "Team owners can read team members" 
  ON team_members FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = team_members.team_id
        AND subscriptions.user_id = auth.uid()
    )
  );

-- Team members can be managed by the team owner
CREATE POLICY "Team owners can manage team members" 
  ON team_members FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = team_members.team_id
        AND subscriptions.user_id = auth.uid()
    )
  );

-- Add payment history policies
CREATE POLICY "Users can read their own payment history" 
  ON subscription_transactions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = subscription_transactions.subscription_id
        AND subscriptions.user_id = auth.uid()
    )
  );

-- Add credit usage log policies
CREATE POLICY "Users can read their own credit usage" 
  ON credit_usage_log FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credit usage" 
  ON credit_usage_log FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
