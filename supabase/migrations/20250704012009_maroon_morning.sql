/*
  # Add demo data for MtaaniFix

  1. Demo Data
    - Sample profiles (admin, fundis, customers)
    - Fundi professional information
    - Sample bookings and reviews
    - Ensure all services exist

  2. Conflict Handling
    - Use ON CONFLICT clauses to prevent duplicate key errors
    - Safe to run multiple times
*/

-- First, let's ensure we have the services we need
DO $$
BEGIN
  -- Check if services exist, if not insert them
  IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Plumbing Services') THEN
    INSERT INTO services (name, description, category, base_price, icon) VALUES
    ('Plumbing Services', 'Professional plumbing repairs and installations', 'plumbing', 1500.00, 'wrench');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Electrical Services') THEN
    INSERT INTO services (name, description, category, base_price, icon) VALUES
    ('Electrical Services', 'Licensed electrical work and installations', 'electrical', 2000.00, 'zap');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'Mechanical Services') THEN
    INSERT INTO services (name, description, category, base_price, icon) VALUES
    ('Mechanical Services', 'Vehicle and machinery repairs', 'mechanics', 2500.00, 'car');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM services WHERE name = 'ICT Support') THEN
    INSERT INTO services (name, description, category, base_price, icon) VALUES
    ('ICT Support', 'Computer and network technical support', 'ict', 1200.00, 'smartphone');
  END IF;
END $$;

-- Insert demo profiles with proper conflict handling
INSERT INTO profiles (id, user_id, email, full_name, phone, role, location) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', null, 'admin@mtaanifix.ke', 'Admin User', '+254700000001', 'admin', 'Nairobi'),
  ('550e8400-e29b-41d4-a716-446655440002', null, 'fundi@mtaanifix.ke', 'John Mwangi', '+254701234567', 'fundi', 'Westlands, Nairobi'),
  ('550e8400-e29b-41d4-a716-446655440003', null, 'customer@mtaanifix.ke', 'Jane Doe', '+254712345678', 'customer', 'Kilimani, Nairobi'),
  ('550e8400-e29b-41d4-a716-446655440004', null, 'grace.wanjiku@email.com', 'Grace Wanjiku', '+254733567890', 'fundi', 'Kilimani, Nairobi'),
  ('550e8400-e29b-41d4-a716-446655440005', null, 'david.kamau@email.com', 'David Kamau', '+254745678901', 'fundi', 'Karen, Nairobi'),
  ('550e8400-e29b-41d4-a716-446655440006', null, 'mary.njeri@email.com', 'Mary Njeri', '+254767890123', 'fundi', 'CBD, Nairobi')
ON CONFLICT (id) DO NOTHING;

-- Insert fundi professional profiles with conflict handling
INSERT INTO fundis (
  id,
  profile_id,
  specialties,
  experience_years,
  hourly_rate,
  availability,
  location,
  bio,
  verification_status,
  rating,
  total_jobs,
  completed_jobs,
  total_earnings
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440002',
  ARRAY['Plumbing', 'Kitchen Plumbing', 'Bathroom Repairs'],
  8,
  1500.00,
  'available',
  'Westlands, Nairobi',
  'Experienced plumber with 8 years in the field. Specializing in kitchen and bathroom installations.',
  true,
  4.9,
  187,
  182,
  125000.00
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440004',
  ARRAY['Electrical', 'Wiring', 'Solar Installation'],
  6,
  1800.00,
  'busy',
  'Kilimani, Nairobi',
  'Licensed electrician specializing in residential and commercial electrical work.',
  true,
  4.8,
  156,
  151,
  98000.00
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440005',
  ARRAY['Mechanics', 'Engine Repair', 'Brake Systems'],
  10,
  2000.00,
  'available',
  'Karen, Nairobi',
  'Experienced mechanic with expertise in all vehicle types.',
  true,
  4.7,
  143,
  138,
  110000.00
),
(
  '550e8400-e29b-41d4-a716-446655440013',
  '550e8400-e29b-41d4-a716-446655440006',
  ARRAY['ICT Support', 'Network Setup', 'Computer Repair'],
  4,
  1200.00,
  'available',
  'CBD, Nairobi',
  'IT specialist providing comprehensive computer and network support.',
  true,
  4.6,
  89,
  85,
  67000.00
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings with proper conflict handling
DO $$
DECLARE
  plumbing_service_id uuid;
  electrical_service_id uuid;
BEGIN
  -- Get service IDs
  SELECT id INTO plumbing_service_id FROM services WHERE name = 'Plumbing Services' LIMIT 1;
  SELECT id INTO electrical_service_id FROM services WHERE name = 'Electrical Services' LIMIT 1;

  -- Insert bookings only if they don't exist and service IDs are found
  IF plumbing_service_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM bookings WHERE id = '550e8400-e29b-41d4-a716-446655440020') THEN
    INSERT INTO bookings (
      id,
      booking_number,
      customer_id,
      fundi_id,
      service_id,
      title,
      description,
      location,
      scheduled_date,
      status,
      amount,
      commission_amount
    ) VALUES (
      '550e8400-e29b-41d4-a716-446655440020',
      'BK001234',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440010',
      plumbing_service_id,
      'Kitchen Sink Repair',
      'Kitchen sink is leaking and needs urgent repair',
      'Kilimani, Nairobi',
      now() + interval '2 hours',
      'confirmed',
      2500.00,
      375.00
    );
  END IF;

  IF electrical_service_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM bookings WHERE id = '550e8400-e29b-41d4-a716-446655440021') THEN
    INSERT INTO bookings (
      id,
      booking_number,
      customer_id,
      fundi_id,
      service_id,
      title,
      description,
      location,
      scheduled_date,
      status,
      amount,
      commission_amount
    ) VALUES (
      '550e8400-e29b-41d4-a716-446655440021',
      'BK001235',
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440011',
      electrical_service_id,
      'Power Outlet Installation',
      'Need additional power outlets installed in the living room',
      'Kilimani, Nairobi',
      now() + interval '1 day',
      'pending',
      3200.00,
      480.00
    );
  END IF;
END $$;

-- Insert sample reviews with conflict handling
INSERT INTO reviews (
  id,
  booking_id,
  customer_id,
  fundi_id,
  rating,
  comment
) VALUES (
  '550e8400-e29b-41d4-a716-446655440030',
  '550e8400-e29b-41d4-a716-446655440020',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440010',
  5,
  'Excellent work! John was professional, punctual, and fixed the issue quickly. Highly recommended!'
)
ON CONFLICT (id) DO NOTHING;