/*
  # Create speakers table

  1. New Tables
    - `speakers`
      - `speaker_id` (serial, primary key)
      - `name` (text, not null)
      - `bio` (text, not null)
      - `event_id` (integer, foreign key to events)
      - `image_url` (text)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `speakers` table
    - Add policy for public read access
    - Add policy for admin and organizer users to create, update, and delete speakers
*/

CREATE TABLE IF NOT EXISTS speakers (
  speaker_id SERIAL PRIMARY KEY,
  name text NOT NULL,
  bio text NOT NULL,
  event_id integer REFERENCES events(event_id) ON DELETE CASCADE,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE speakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Speakers are viewable by everyone"
  ON speakers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin and organizers can create speakers"
  ON speakers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );

CREATE POLICY "Admin and organizers can update speakers"
  ON speakers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );

CREATE POLICY "Admin and organizers can delete speakers"
  ON speakers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND (users.user_type = 'admin' OR users.user_type = 'organizer')
    )
  );