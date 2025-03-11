/*
  # Payment Integration

  1. New Columns
    - Add payment_id to orders table
    - Add payment_method to orders table
    - Add payment_amount to orders table
  
  2. Updates
    - Enhance payment_status with more states
  
  3. Security
    - No changes to existing policies
*/

-- Add payment-related columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_amount numeric;

-- Create payment_history table to track payment status changes
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  payment_id text,
  payment_status text NOT NULL,
  payment_amount numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on payment_history
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for payment_history
CREATE POLICY "Users can view their own payment history"
  ON payment_history
  FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
  );

-- Create function to track payment status changes
CREATE OR REPLACE FUNCTION track_payment_status_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.payment_status IS NULL OR NEW.payment_status <> OLD.payment_status THEN
    INSERT INTO payment_history (
      order_id, 
      payment_id, 
      payment_status, 
      payment_amount, 
      notes
    )
    VALUES (
      NEW.id, 
      NEW.payment_id, 
      NEW.payment_status, 
      NEW.payment_amount, 
      'Payment status changed from ' || COALESCE(OLD.payment_status, 'new') || ' to ' || NEW.payment_status
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to track payment status changes
DROP TRIGGER IF EXISTS track_payment_status ON orders;
CREATE TRIGGER track_payment_status
AFTER UPDATE OF payment_status ON orders
FOR EACH ROW
EXECUTE FUNCTION track_payment_status_changes();

-- Create function to update order status when payment is completed
CREATE OR REPLACE FUNCTION update_order_status_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- If payment is successful, update order status to processing
  IF NEW.payment_status = 'succeeded' AND OLD.payment_status <> 'succeeded' THEN
    -- Only update if the order is not already completed or failed
    IF OLD.status = 'pending' THEN
      UPDATE orders SET status = 'processing' WHERE id = NEW.id;
    END IF;
  -- If payment fails, update order status to failed
  ELSIF NEW.payment_status = 'failed' AND OLD.payment_status <> 'failed' THEN
    UPDATE orders SET status = 'failed' WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update order status when payment status changes
DROP TRIGGER IF EXISTS update_order_on_payment ON orders;
CREATE TRIGGER update_order_on_payment
AFTER UPDATE OF payment_status ON orders
FOR EACH ROW
EXECUTE FUNCTION update_order_status_on_payment();