/*
  # Create order items table

  1. New Tables
    - `order_items`
      - `order_item_id` (serial, primary key)
      - `order_id` (integer, foreign key to orders)
      - `ticket_id` (integer, foreign key to tickets)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `order_items` table
    - Add policy for users to read their own order items
    - Add policy for users to create their own order items
    - Add policy for admin users to read all order items
*/

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id integer REFERENCES orders(order_id) ON DELETE CASCADE,
  ticket_id integer REFERENCES tickets(ticket_id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.order_id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin users can read all order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.user_type = 'admin'
    )
  );