/*
  # Create venues table

  1. New Tables
    - `venues`
      - `venue_id` (uuid, primary key)
      - `name` (text, not null)
      - `address` (text, not null)
      - `city` (text, not null)
      - `state` (text, not null)
      - `zipcode` (text, not null)
      - `capacity` (integer, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `venues` table
    - Add policy for public read access
    - Add policy for admin and organizer users to create, update, and delete venues
*/

CREATE TABLE IF NOT EXISTS venues (
  venue_id SERIAL PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zipcode text NOT NULL,
  capacity integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Venues are viewable by everyone"
  ON venues
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin and organizers can create venues"
  ON venues
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );

CREATE POLICY "Admin and organizers can update venues"
  ON venues
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );

CREATE POLICY "Admin and organizers can delete venues"
  ON venues
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );