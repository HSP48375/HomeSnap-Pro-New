
-- Create revision_requests table
CREATE TABLE IF NOT EXISTS revision_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_order_id uuid REFERENCES orders(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  photos jsonb NOT NULL, -- Array of photo_id and feedback
  total_price numeric NOT NULL,
  status text DEFAULT 'pending', -- pending, processing, completed, rejected
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS policies
ALTER TABLE revision_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own revision requests"
  ON revision_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create revision requests"
  ON revision_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
