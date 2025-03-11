/*
  # Order Tracking System

  1. New Tables
    - None (using existing tables)
  
  2. Updates
    - Add payment_status to orders table
    - Add estimated_completion_time to orders table
    - Add tracking_number to orders table
  
  3. Security
    - No changes to existing policies
*/

-- Add new columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_completion_time timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;

-- Create function to automatically set estimated completion time
CREATE OR REPLACE FUNCTION set_estimated_completion_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Set estimated completion time to 16 hours from now
  NEW.estimated_completion_time := NOW() + interval '16 hours';
  
  -- Generate a tracking number
  NEW.tracking_number := 'HSP-' || to_char(NOW(), 'YYYYMMDD') || '-' || substring(NEW.id::text, 1, 8);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set estimated completion time on new orders
DROP TRIGGER IF EXISTS set_order_tracking_info ON orders;
CREATE TRIGGER set_order_tracking_info
BEFORE INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION set_estimated_completion_time();

-- Create order_history table to track status changes
CREATE TABLE IF NOT EXISTS order_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on order_history
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;

-- Create policies for order_history
CREATE POLICY "Users can view their own order history"
  ON order_history
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own order history"
  ON order_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Create function to track order status changes
CREATE OR REPLACE FUNCTION track_order_status_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status <> OLD.status THEN
    INSERT INTO order_history (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || COALESCE(OLD.status, 'new') || ' to ' || NEW.status);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to track order status changes
DROP TRIGGER IF EXISTS track_order_status ON orders;
CREATE TRIGGER track_order_status
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION track_order_status_changes();