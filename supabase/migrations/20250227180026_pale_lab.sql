/*
  # Create orders table

  1. New Tables
    - `orders`
      - `order_id` (serial, primary key)
      - `user_id` (uuid, foreign key to users)
      - `total_price` (numeric, not null)
      - `date` (timestamptz, default now())
      - `status` (text, not null, default 'pending')
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `orders` table
    - Add policy for users to read their own orders
    - Add policy for users to create their own orders
    - Add policy for admin users to read all orders
*/

CREATE TABLE IF NOT EXISTS orders (
  order_id SERIAL PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  total_price numeric NOT NULL,
  date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin users can read all orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.user_type = 'admin'
    )
  );