/*
  # MtaaniFix Database Schema

  1. New Tables
    - `profiles` - User profiles (customers, fundi's, admins)
    - `services` - Service categories (plumbing, electrical, etc.)
    - `fundis` - Fundi-specific information and ratings
    - `bookings` - Job bookings and appointments
    - `payments` - Payment records and transactions
    - `reviews` - Customer reviews and ratings
    - `whatsapp_messages` - WhatsApp bot conversation logs
    - `locations` - Service locations and areas

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Proper access control based on user roles

  3. Features
    - Real-time booking management
    - Rating and review system
    - Payment tracking
    - WhatsApp integration logs
    - Location-based matching
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'fundi', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE fundi_availability AS ENUM ('available', 'busy', 'unavailable');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  phone text,
  full_name text NOT NULL,
  role user_role DEFAULT 'customer',
  avatar_url text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  base_price decimal(10,2),
  icon text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Fundis table
CREATE TABLE IF NOT EXISTS fundis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  service_ids uuid[] DEFAULT '{}',
  specialties text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  hourly_rate decimal(10,2),
  availability fundi_availability DEFAULT 'available',
  location text,
  bio text,
  verification_status boolean DEFAULT false,
  rating decimal(3,2) DEFAULT 0.0,
  total_jobs integer DEFAULT 0,
  completed_jobs integer DEFAULT 0,
  total_earnings decimal(12,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  fundi_id uuid REFERENCES fundis(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id),
  title text NOT NULL,
  description text,
  location text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  estimated_duration integer, -- in minutes
  status booking_status DEFAULT 'pending',
  amount decimal(10,2),
  commission_rate decimal(5,2) DEFAULT 15.0,
  commission_amount decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  fundi_id uuid REFERENCES fundis(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  commission_amount decimal(10,2) NOT NULL,
  fundi_amount decimal(10,2) NOT NULL,
  payment_method text, -- 'mpesa', 'card', 'cash'
  transaction_id text,
  status payment_status DEFAULT 'pending',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  fundi_id uuid REFERENCES fundis(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- WhatsApp messages table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  customer_id uuid REFERENCES profiles(id),
  message_type text, -- 'incoming', 'outgoing'
  message_content text NOT NULL,
  intent text, -- 'booking_request', 'inquiry', 'complaint', etc.
  bot_response text,
  session_id text,
  processed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  county text NOT NULL,
  latitude decimal(10,8),
  longitude decimal(11,8),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insert sample services
INSERT INTO services (name, description, category, base_price, icon) VALUES
('Plumbing Services', 'Professional plumbing repairs and installations', 'plumbing', 1500.00, 'wrench'),
('Electrical Services', 'Licensed electrical work and installations', 'electrical', 2000.00, 'zap'),
('Mechanical Services', 'Vehicle and machinery repairs', 'mechanics', 2500.00, 'car'),
('ICT Support', 'Computer and network technical support', 'ict', 1200.00, 'smartphone');

-- Insert sample locations
INSERT INTO locations (name, county, latitude, longitude) VALUES
('Westlands', 'Nairobi', -1.2676, 36.8108),
('Kilimani', 'Nairobi', -1.2921, 36.7851),
('Karen', 'Nairobi', -1.3197, 36.7022),
('CBD', 'Nairobi', -1.2841, 36.8155),
('Parklands', 'Nairobi', -1.2633, 36.8116);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE fundis ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read public profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (role = 'fundi');

-- Services policies
CREATE POLICY "Anyone can read services"
  ON services FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Fundis policies
CREATE POLICY "Anyone can read active fundis"
  ON fundis FOR SELECT
  TO authenticated
  USING (verification_status = true);

CREATE POLICY "Fundis can update own profile"
  ON fundis FOR UPDATE
  TO authenticated
  USING (profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  ));

-- Bookings policies
CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    fundi_id IN (SELECT id FROM fundis WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  );

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Payments policies
CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
    fundi_id IN (SELECT id FROM fundis WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  );

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Customers can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (customer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- WhatsApp messages policies
CREATE POLICY "Admins can read all messages"
  ON whatsapp_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Locations policies
CREATE POLICY "Anyone can read locations"
  ON locations FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_fundis_profile_id ON fundis(profile_id);
CREATE INDEX idx_fundis_location ON fundis(location);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_fundi_id ON bookings(fundi_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_reviews_fundi_id ON reviews(fundi_id);
CREATE INDEX idx_whatsapp_phone ON whatsapp_messages(phone_number);

-- Create functions for updating ratings
CREATE OR REPLACE FUNCTION update_fundi_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE fundis 
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews 
    WHERE fundi_id = NEW.fundi_id
  )
  WHERE id = NEW.fundi_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
CREATE TRIGGER update_fundi_rating_trigger
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_fundi_rating();

-- Create function for generating booking numbers
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.booking_number := 'BK' || LPAD(nextval('booking_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for booking numbers
CREATE SEQUENCE IF NOT EXISTS booking_number_seq START 1000;

-- Create trigger for booking number generation
CREATE TRIGGER generate_booking_number_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_number();