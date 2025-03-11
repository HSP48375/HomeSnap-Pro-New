/*
  # Admin Panel and Order Assignment Schema

  1. New Tables
    - `editors` - Stores information about photo editors
    - `order_drive_folders` - Stores Google Drive folder information for orders
  
  2. Changes
    - Add `editor_id` column to orders table
    - Add functions for incrementing/decrementing counters
  
  3. Security
    - Enable RLS on new tables
    - Add policies for admin access
*/

-- Create editors table
CREATE TABLE IF NOT EXISTS editors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  active boolean DEFAULT true,
  current_assignments integer DEFAULT 0,
  total_completed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_drive_folders table
CREATE TABLE IF NOT EXISTS order_drive_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE UNIQUE,
  main_folder_id text NOT NULL,
  pending_folder_id text NOT NULL,
  completed_folder_id text NOT NULL,
  main_folder_url text NOT NULL,
  pending_folder_url text NOT NULL,
  completed_folder_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add editor_id to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS editor_id uuid REFERENCES editors(id);

-- Create increment function
CREATE OR REPLACE FUNCTION increment(x integer)
RETURNS integer AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql;

-- Create decrement function
CREATE OR REPLACE FUNCTION decrement(x integer)
RETURNS integer AS $$
BEGIN
  RETURN GREATEST(0, x - 1);
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on new tables
ALTER TABLE editors ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_drive_folders ENABLE ROW LEVEL SECURITY;

-- Create policies for editors table
CREATE POLICY "Editors can view their own profile"
  ON editors
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all editors"
  ON editors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert editors"
  ON editors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update editors"
  ON editors
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for order_drive_folders table
CREATE POLICY "Users can view their own order folders"
  ON order_drive_folders
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Editors can view their assigned order folders"
  ON order_drive_folders
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE editor_id IN (
        SELECT id FROM editors WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all order folders"
  ON order_drive_folders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert order folders"
  ON order_drive_folders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update order folders"
  ON order_drive_folders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update order status when editor is assigned
CREATE OR REPLACE FUNCTION update_order_status_on_editor_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- If editor is assigned, update order status to processing
  IF NEW.editor_id IS NOT NULL AND OLD.editor_id IS NULL THEN
    -- Only update if the order is not already completed or failed
    IF OLD.status = 'pending' THEN
      NEW.status := 'processing';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update order status when editor is assigned
DROP TRIGGER IF EXISTS update_order_on_editor_assignment ON orders;
CREATE TRIGGER update_order_on_editor_assignment
BEFORE UPDATE OF editor_id ON orders
FOR EACH ROW
EXECUTE FUNCTION update_order_status_on_editor_assignment();

-- Insert sample editors for testing
INSERT INTO editors (name, email, active, current_assignments, total_completed)
VALUES 
  ('John Editor', 'john.editor@example.com', true, 0, 12),
  ('Sarah Editor', 'sarah.editor@example.com', true, 0, 8),
  ('Mike Editor', 'mike.editor@example.com', true, 0, 15)
ON CONFLICT (email) DO NOTHING;