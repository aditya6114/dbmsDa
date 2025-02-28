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
    'Three days of amazing performances from top artists across multiple genres. Experience the best in rock, pop, hip-hop, and electronic music on multiple stages. The festival will also feature food vendors, art installations, and interactive experiences for all attendees.',
    'Los Angeles', 
    '2025-07-10', 
    '12:00 PM', 
    2, 
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ),
  (
    'Business Leadership Summit', 
    'Learn from successful entrepreneurs and business leaders about the future of work. This summit brings together executives, entrepreneurs, and thought leaders to discuss business strategy, leadership, innovation, and organizational transformation in a rapidly changing world.',
    'New York', 
    '2025-09-05', 
    '10:00 AM', 
    1, 
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ),
  (
    'Sports Championship', 
    'Witness the ultimate showdown between the top teams competing for the championship title. Experience the thrill of competition, the energy of the crowd, and the drama of high-stakes sports at its finest. Food, beverages, and merchandise will be available throughout the venue.',
    'Chicago', 
    '2025-11-20', 
    '07:00 PM', 
    4, 
    'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  ),
  (
    'Country Music Awards', 
    'Celebrate the best in country music with performances from award-winning artists. The ceremony will honor the achievements of country music artists, songwriters, and industry professionals, featuring live performances, special tributes, and memorable moments throughout the evening.',
    'Nashville', 
    '2025-10-15', 
    '06:30 PM', 
    5, 
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
  )
ON CONFLICT DO NOTHING;

-- Seed speakers
INSERT INTO speakers (name, bio, event_id, image_url)
VALUES
  (
    'Sarah Johnson', 
    'CEO of TechGiant and pioneer in artificial intelligence research with over 20 years of industry experience.',
    1,
    NULL
  ),
  (
    'Michael Chen', 
    'Renowned software architect and author of "The Future of Code" who has led development teams at major tech companies.',
    1,
    NULL
  ),
  (
    'Dr. Aisha Patel', 
    'Leading researcher in quantum computing and recipient of the National Science Award for her groundbreaking work.',
    1,
    NULL
  ),
  (
    'Robert Williams', 
    'Serial entrepreneur who has founded three successful startups and specializes in venture capital and business growth strategies.',
    3,
    NULL
  ),
  (
    'Jennifer Lopez', 
    'Executive coach and leadership consultant who has worked with Fortune 500 companies to transform their organizational culture.',
    3,
    NULL
  ),
  (
    'David Kim', 
    'Financial strategist and author of "Sustainable Growth" with expertise in helping businesses scale efficiently.',
    3,
    NULL
  )
ON CONFLICT DO NOTHING;

-- Seed tickets for Tech Conference
INSERT INTO tickets (type, price, seat_number, event_id, is_available)
VALUES
  ('VIP', 499.99, 'A1', 1, true),
  ('VIP', 499.99, 'A2', 1, true),
  ('VIP', 499.99, 'A3', 1, true),
  ('Premium', 299.99, 'B1', 1, true),
  ('Premium', 299.99, 'B2', 1, true),
  ('Premium', 299.99, 'B3', 1, true),
  ('Standard', 149.99, 'C1', 1, true),
  ('Standard', 149.99, 'C2', 1, true),
  ('Standard', 149.99, 'C3', 1, true),
  ('Standard', 149.99, 'C4', 1, true)
ON CONFLICT DO NOTHING;

-- Seed tickets for Summer Music Festival
INSERT INTO tickets (type, price, seat_number, event_id, is_available)
VALUES
  ('3-Day Pass', 349.99, 'GA-001', 2, true),
  ('3-Day Pass', 349.99, 'GA-002', 2, true),
  ('3-Day Pass', 349.99, 'GA-003', 2, true),
  ('3-Day VIP', 599.99, 'VIP-001', 2, true),
  ('3-Day VIP', 599.99, 'VIP-002', 2, true),
  ('1-Day Pass', 129.99, 'DAY1-001', 2, true),
  ('1-Day Pass', 129.99, 'DAY1-002', 2, true),
  ('1-Day Pass', 129.99, 'DAY2-001', 2, true),
  ('1-Day Pass', 129.99, 'DAY2-002', 2, true),
  ('1-Day Pass', 129.99, 'DAY3-001', 2, true)
ON CONFLICT DO NOTHING;

-- Seed tickets for Business Leadership Summit
INSERT INTO tickets (type, price, seat_number, event_id, is_available)
VALUES
  ('Executive', 799.99, 'EX-01', 3, true),
  ('Executive', 799.99, 'EX-02', 3, true),
  ('Executive', 799.99, 'EX-03', 3, true),
  ('Professional', 499.99, 'PRO-01', 3, true),
  ('Professional', 499.99, 'PRO-02', 3, true),
  ('Professional', 499.99, 'PRO-03', 3, true),
  ('Standard', 299.99, 'STD-01', 3, true),
  ('Standard', 299.99, 'STD-02', 3, true),
  ('Standard', 299.99, 'STD-03', 3, true),
  ('Standard', 299.99, 'STD-04', 3, true)
ON CONFLICT DO NOTHING;

-- Seed tickets for Sports Championship
INSERT INTO tickets (type, price, seat_number, event_id, is_available)
VALUES
  ('Courtside', 1299.99, 'CS-01', 4, true),
  ('Courtside', 1299.99, 'CS-02', 4, true),
  ('Premium', 799.99, 'P-01', 4, true),
  ('Premium', 799.99, 'P-02', 4, true),
  ('Premium', 799.99, 'P-03', 4, true),
  ('Mid-Level', 499.99, 'ML-01', 4, true),
  ('Mid-Level', 499.99, 'ML-02', 4, true),
  ('Upper Level', 199.99, 'UL-01', 4, true),
  ('Upper Level', 199.99, 'UL-02', 4, true),
  ('Upper Level', 199.99, 'UL-03', 4, true)
ON CONFLICT DO NOTHING;

-- Seed tickets for Country Music Awards
INSERT INTO tickets (type, price, seat_number, event_id, is_available)
VALUES
  ('Front Row', 899.99, 'FR-01', 5, true),
  ('Front Row', 899.99, 'FR-02', 5, true),
  ('Orchestra', 599.99, 'OR-01', 5, true),
  ('Orchestra', 599.99, 'OR-02', 5, true),
  ('Orchestra', 599.99, 'OR-03', 5, true),
  ('Mezzanine', 399.99, 'MZ-01', 5, true),
  ('Mezzanine', 399.99, 'MZ-02', 5, true),
  ('Balcony', 199.99, 'BA-01', 5, true),
  ('Balcony', 199.99, 'BA-02', 5, true),
  ('Balcony', 199.99, 'BA-03', 5, true)
ON CONFLICT DO NOTHING;