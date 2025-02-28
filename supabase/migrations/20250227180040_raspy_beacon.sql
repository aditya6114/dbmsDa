/*
  # Seed data for the event ticketing system

  This migration adds initial data to the database for testing and development purposes.
  
  1. Seed Data
    - Venues
    - Events
    - Speakers
    - Tickets
*/

-- Seed venues
INSERT INTO venues (name, address, city, state, zipcode, capacity)
VALUES
  ('Grand Convention Center', '123 Main St', 'New York', 'NY', '10001', 1000),
  ('Riverside Amphitheater', '456 Park Ave', 'Los Angeles', 'CA', '90001', 2500),
  ('Tech Hub Conference Center', '789 Innovation Blvd', 'San Francisco', 'CA', '94105', 500),
  ('Downtown Arena', '101 Sports Way', 'Chicago', 'IL', '60601', 5000),
  ('Harmony Hall', '202 Music Lane', 'Nashville', 'TN', '37203', 800)
ON CONFLICT DO NOTHING;

-- Seed events
INSERT INTO events (name, description, location, date, time, venue_id, image_url)
VALUES
  (
    'Tech Conference 2025', 
    'Join the biggest tech conference of the year with industry leaders and innovators. Learn about the latest technologies, network with professionals, and gain insights into future trends. The conference will feature keynote speeches, panel discussions, workshops, and networking opportunities.',
    'San Francisco', 
    '2025-05-15', 
    '09:00 AM', 
    3, 
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ),
  (
    'Summer Music Festival', 
    'Three days of amazing performances from top artists across multiple genres. Experience the best in rock, pop, hip-hop, and electronic music on multiple stages. The festival will also feature food vendors, art installations, and interactive