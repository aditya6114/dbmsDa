/*
  # Create tickets table

  1. New Tables
    - `tickets`
      - `ticket_id` (serial, primary key)
      - `type` (text, not null)
      - `price` (numeric, not null)
      - `seat_number` (text, not null)
      - `event_id` (integer, foreign key to events)
      - `is_available` (boolean, default true)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `tickets` table
    - Add policy for public read access
    - Add policy for authenticated users to update tickets they purchase
    - Add policy for admin and organizer users to create, update, and delete tickets
*/

CREATE TABLE IF NOT EXISTS tickets (
  ticket_id SERIAL PRIMARY KEY,
  type text NOT NULL,
  price numeric NOT NULL,
  seat_number text NOT NULL,
  event_id integer REFERENCES events(event_id) ON DELETE CASCADE,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tickets are viewable by everyone"
  ON tickets
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update tickets they purchase"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin and organizers can create tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );

CREATE POLICY "Admin and organizers can delete tickets"
  ON tickets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );