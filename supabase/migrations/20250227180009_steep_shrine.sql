/*
  # Create events table

  1. New Tables
    - `events`
      - `event_id` (serial, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `location` (text, not null)
      - `date` (date, not null)
      - `time` (text, not null)
      - `venue_id` (integer, foreign key to venues)
      - `image_url` (text)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `events` table
    - Add policy for public read access
    - Add policy for admin and organizer users to create, update, and delete events
*/

CREATE TABLE IF NOT EXISTS events (
  event_id SERIAL PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  venue_id integer REFERENCES venues(venue_id),
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin and organizers can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );

CREATE POLICY "Admin and organizers can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );

CREATE POLICY "Admin and organizers can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );