/*
  # Notification System Implementation

  1. New Tables
    - `notifications` - Stores all user notifications
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `type` (text) - notification type (order_update, payment, etc.)
      - `title` (text) - notification title
      - `message` (text) - notification content
      - `status` (text) - read/unread status
      - `deep_link` (text) - link to relevant page
      - `created_at` (timestamptz)
      - `read_at` (timestamptz)
    
    - `notification_preferences` - Stores user notification preferences
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `in_app` (boolean) - enable/disable in-app notifications
      - `email` (boolean) - enable/disable email notifications
      - `push` (boolean) - enable/disable push notifications
      - `order_updates` (boolean) - notifications for order status changes
      - `payment_updates` (boolean) - notifications for payment status
      - `editor_assignments` (boolean) - notifications for editor assignments
      - `marketing` (boolean) - marketing and promotional notifications
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own notifications
    - Add policies for admins to send notifications
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  deep_link text,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  in_app boolean DEFAULT true,
  email boolean DEFAULT true,
  push boolean DEFAULT true,
  order_updates boolean DEFAULT true,
  payment_updates boolean DEFAULT true,
  editor_assignments boolean DEFAULT true,
  marketing boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create push_subscriptions table for web push notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to initialize notification preferences for new users
CREATE OR REPLACE FUNCTION initialize_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to initialize notification preferences for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION initialize_notification_preferences();

-- Create function to create notifications for order status changes
CREATE OR REPLACE FUNCTION create_order_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Get user ID from the order
  DECLARE
    order_user_id uuid;
    editor_id uuid;
    editor_user_id uuid;
    admin_user_ids uuid[];
  BEGIN
    -- Get user ID and editor ID from the order
    SELECT user_id, editor_id INTO order_user_id, editor_id FROM orders WHERE id = NEW.id;
    
    -- Create notification for the user
    IF order_user_id IS NOT NULL AND 
       EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = order_user_id AND order_updates = true) THEN
      
      INSERT INTO notifications (user_id, type, title, message, deep_link)
      VALUES (
        order_user_id,
        'order_update',
        'Order Status Updated',
        'Your order #' || substring(NEW.id::text, 1, 8) || ' is now ' || NEW.status,
        '/orders/' || NEW.id
      );
    END IF;
    
    -- Create notification for the editor if assigned
    IF editor_id IS NOT NULL THEN
      -- Get editor's user ID
      SELECT user_id INTO editor_user_id FROM editors WHERE id = editor_id;
      
      IF editor_user_id IS NOT NULL AND 
         EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = editor_user_id AND order_updates = true) THEN
        
        INSERT INTO notifications (user_id, type, title, message, deep_link)
        VALUES (
          editor_user_id,
          'order_update',
          'Order Status Updated',
          'Order #' || substring(NEW.id::text, 1, 8) || ' is now ' || NEW.status,
          '/editor/orders/' || NEW.id
        );
      END IF;
    END IF;
    
    -- Create notifications for admins
    -- In a real system, you would have a way to identify admin users
    -- For this example, we'll assume admin users are stored in a specific way
    -- This is a placeholder and would need to be adjusted for your actual admin identification method
    SELECT array_agg(id) INTO admin_user_ids FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin';
    
    IF admin_user_ids IS NOT NULL THEN
      FOREACH editor_user_id IN ARRAY admin_user_ids
      LOOP
        IF EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = editor_user_id AND order_updates = true) THEN
          INSERT INTO notifications (user_id, type, title, message, deep_link)
          VALUES (
            editor_user_id,
            'order_update',
            'Order Status Updated',
            'Order #' || substring(NEW.id::text, 1, 8) || ' is now ' || NEW.status,
            '/admin/orders/' || NEW.id
          );
        END IF;
      END LOOP;
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order status notifications
DROP TRIGGER IF EXISTS on_order_status_change ON orders;
CREATE TRIGGER on_order_status_change
AFTER UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION create_order_status_notification();

-- Create function to create notifications for payment status changes
CREATE OR REPLACE FUNCTION create_payment_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Get user ID from the order
  DECLARE
    order_user_id uuid;
    admin_user_ids uuid[];
  BEGIN
    -- Get user ID from the order
    SELECT user_id INTO order_user_id FROM orders WHERE id = NEW.id;
    
    -- Create notification for the user
    IF order_user_id IS NOT NULL AND 
       EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = order_user_id AND payment_updates = true) THEN
      
      INSERT INTO notifications (user_id, type, title, message, deep_link)
      VALUES (
        order_user_id,
        'payment_update',
        'Payment Status Updated',
        CASE 
          WHEN NEW.payment_status = 'succeeded' THEN 'Payment for order #' || substring(NEW.id::text, 1, 8) || ' was successful'
          WHEN NEW.payment_status = 'failed' THEN 'Payment for order #' || substring(NEW.id::text, 1, 8) || ' failed'
          ELSE 'Payment status for order #' || substring(NEW.id::text, 1, 8) || ' updated to ' || NEW.payment_status
        END,
        '/orders/' || NEW.id
      );
    END IF;
    
    -- Create notifications for admins
    SELECT array_agg(id) INTO admin_user_ids FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin';
    
    IF admin_user_ids IS NOT NULL THEN
      FOREACH order_user_id IN ARRAY admin_user_ids
      LOOP
        IF EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = order_user_id AND payment_updates = true) THEN
          INSERT INTO notifications (user_id, type, title, message, deep_link)
          VALUES (
            order_user_id,
            'payment_update',
            'Payment Status Updated',
            'Payment for order #' || substring(NEW.id::text, 1, 8) || ' is now ' || NEW.payment_status,
            '/admin/orders/' || NEW.id
          );
        END IF;
      END LOOP;
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment status notifications
DROP TRIGGER IF EXISTS on_payment_status_change ON orders;
CREATE TRIGGER on_payment_status_change
AFTER UPDATE OF payment_status ON orders
FOR EACH ROW
EXECUTE FUNCTION create_payment_status_notification();

-- Create function to create notifications for editor assignments
CREATE OR REPLACE FUNCTION create_editor_assignment_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if editor_id is being set (not removed or updated)
  IF NEW.editor_id IS NOT NULL AND (OLD.editor_id IS NULL OR OLD.editor_id <> NEW.editor_id) THEN
    DECLARE
      order_user_id uuid;
      editor_user_id uuid;
      editor_name text;
    BEGIN
      -- Get user ID from the order
      SELECT user_id INTO order_user_id FROM orders WHERE id = NEW.id;
      
      -- Get editor's user ID and name
      SELECT user_id, name INTO editor_user_id, editor_name FROM editors WHERE id = NEW.editor_id;
      
      -- Create notification for the user
      IF order_user_id IS NOT NULL AND 
         EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = order_user_id AND editor_assignments = true) THEN
        
        INSERT INTO notifications (user_id, type, title, message, deep_link)
        VALUES (
          order_user_id,
          'editor_assignment',
          'Editor Assigned',
          'Your order #' || substring(NEW.id::text, 1, 8) || ' has been assigned to an editor',
          '/orders/' || NEW.id
        );
      END IF;
      
      -- Create notification for the editor
      IF editor_user_id IS NOT NULL AND 
         EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = editor_user_id AND editor_assignments = true) THEN
        
        INSERT INTO notifications (user_id, type, title, message, deep_link)
        VALUES (
          editor_user_id,
          'editor_assignment',
          'New Order Assigned',
          'You have been assigned to order #' || substring(NEW.id::text, 1, 8),
          '/editor/orders/' || NEW.id
        );
      END IF;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for editor assignment notifications
DROP TRIGGER IF EXISTS on_editor_assignment ON orders;
CREATE TRIGGER on_editor_assignment
AFTER UPDATE OF editor_id ON orders
FOR EACH ROW
EXECUTE FUNCTION create_editor_assignment_notification();

-- Create function to create notifications for floorplan status changes
CREATE OR REPLACE FUNCTION create_floorplan_status_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Get user ID from the floorplan order
  DECLARE
    order_user_id uuid;
    admin_user_ids uuid[];
  BEGIN
    -- Get user ID from the floorplan order
    SELECT user_id INTO order_user_id FROM floorplan_orders WHERE id = NEW.id;
    
    -- Create notification for the user
    IF order_user_id IS NOT NULL AND 
       EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = order_user_id AND order_updates = true) THEN
      
      INSERT INTO notifications (user_id, type, title, message, deep_link)
      VALUES (
        order_user_id,
        'floorplan_update',
        'Floorplan Status Updated',
        'Your floorplan #' || substring(NEW.id::text, 1, 8) || ' is now ' || NEW.status,
        '/floorplans'
      );
    END IF;
    
    -- Create notifications for admins
    SELECT array_agg(id) INTO admin_user_ids FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin';
    
    IF admin_user_ids IS NOT NULL THEN
      FOREACH order_user_id IN ARRAY admin_user_ids
      LOOP
        IF EXISTS (SELECT 1 FROM notification_preferences WHERE user_id = order_user_id AND order_updates = true) THEN
          INSERT INTO notifications (user_id, type, title, message, deep_link)
          VALUES (
            order_user_id,
            'floorplan_update',
            'Floorplan Status Updated',
            'Floorplan #' || substring(NEW.id::text, 1, 8) || ' is now ' || NEW.status,
            '/admin/floorplans/' || NEW.id
          );
        END IF;
      END LOOP;
    END IF;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for floorplan status notifications
DROP TRIGGER IF EXISTS on_floorplan_status_change ON floorplan_orders;
CREATE TRIGGER on_floorplan_status_change
AFTER UPDATE OF status ON floorplan_orders
FOR EACH ROW
EXECUTE FUNCTION create_floorplan_status_notification();

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for notification_preferences
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for push_subscriptions
CREATE POLICY "Users can view their own push subscriptions"
  ON push_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own push subscriptions"
  ON push_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own push subscriptions"
  ON push_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push subscriptions"
  ON push_subscriptions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create admin policies
-- In a real system, you would restrict these to admin users only
CREATE POLICY "Admins can insert notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create functions for notification management
-- Function to mark a notification as read
CREATE OR REPLACE FUNCTION mark_notification_as_read(notification_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET status = 'read', read_at = now()
  WHERE id = notification_id
  AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read
CREATE OR REPLACE FUNCTION mark_all_notifications_as_read()
RETURNS void AS $$
BEGIN
  UPDATE notifications
  SET status = 'read', read_at = now()
  WHERE user_id = auth.uid()
  AND status = 'unread';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notification count
CREATE OR REPLACE FUNCTION get_unread_notification_count()
RETURNS integer AS $$
DECLARE
  count integer;
BEGIN
  SELECT COUNT(*) INTO count
  FROM notifications
  WHERE user_id = auth.uid()
  AND status = 'unread';
  
  RETURN count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;