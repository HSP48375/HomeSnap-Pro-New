/*
  # Create floorplan system tables

  1. New Tables
    - `floorplan_orders` - Stores floorplan orders
    - `property_videos` - Storage bucket for property videos
    - `property_assets` - Storage bucket for logos and other assets

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create floorplan_orders table
CREATE TABLE IF NOT EXISTS floorplan_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  package_id text NOT NULL,
  measurement_unit text NOT NULL DEFAULT 'imperial',
  status text NOT NULL DEFAULT 'pending',
  total_price numeric NOT NULL DEFAULT 0,
  has_priority boolean NOT NULL DEFAULT false,
  video_path text,
  logo_path text,
  branding jsonb,
  download_url text,
  revision_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  estimated_completion_time timestamptz
);

-- Create function to automatically set estimated completion time
CREATE OR REPLACE FUNCTION set_floorplan_estimated_completion_time()
RETURNS TRIGGER AS $$
BEGIN
  -- Set estimated completion time based on priority
  IF NEW.has_priority THEN
    -- Priority: 6-8 hours
    NEW.estimated_completion_time := NOW() + interval '7 hours';
  ELSE
    -- Standard: 12-16 hours
    NEW.estimated_completion_time := NOW() + interval '14 hours';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set estimated completion time on new floorplan orders
DROP TRIGGER IF EXISTS set_floorplan_tracking_info ON floorplan_orders;
CREATE TRIGGER set_floorplan_tracking_info
BEFORE INSERT ON floorplan_orders
FOR EACH ROW
EXECUTE FUNCTION set_floorplan_estimated_completion_time();

-- Create storage buckets for videos and assets
INSERT INTO storage.buckets (id, name, public) VALUES ('property-videos', 'property-videos', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('property-assets', 'property-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on floorplan_orders
ALTER TABLE floorplan_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for floorplan_orders
CREATE POLICY "Users can view their own floorplan orders"
  ON floorplan_orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own floorplan orders"
  ON floorplan_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own floorplan orders"
  ON floorplan_orders
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Set up storage policies for property-videos
CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own videos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'property-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Set up storage policies for property-assets
CREATE POLICY "Authenticated users can upload assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own assets"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'property-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to track floorplan order status changes
CREATE OR REPLACE FUNCTION track_floorplan_order_status_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NULL OR NEW.status <> OLD.status THEN
    INSERT INTO order_history (order_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Floorplan status changed from ' || COALESCE(OLD.status, 'new') || ' to ' || NEW.status);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to track floorplan order status changes
DROP TRIGGER IF EXISTS track_floorplan_order_status ON floorplan_orders;
CREATE TRIGGER track_floorplan_order_status
AFTER UPDATE OF status ON floorplan_orders
FOR EACH ROW
EXECUTE FUNCTION track_floorplan_order_status_changes();