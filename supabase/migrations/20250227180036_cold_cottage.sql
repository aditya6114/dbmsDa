/*
  # Create payments table

  1. New Tables
    - `payments`
      - `payment_id` (serial, primary key)
      - `order_id` (integer, foreign key to orders)
      - `payment_method` (text, not null)
      - `transaction_id` (text, not null)
      - `amount` (numeric, not null)
      - `status` (text, not null, default 'pending')
      - `date` (timestamptz, default now())
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `payments` table
    - Add policy for users to read their own payments
    - Add policy for users to create their own payments
    - Add policy for admin users to read all payments
*/

CREATE TABLE IF NOT EXISTS payments (
  payment_id SERIAL PRIMARY KEY,
  order_id integer REFERENCES orders(order_id) ON DELETE CASCADE,
  payment_method text NOT NULL,
  transaction_id text NOT NULL,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = payments.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can read all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.user_type = 'admin'
    )
  );