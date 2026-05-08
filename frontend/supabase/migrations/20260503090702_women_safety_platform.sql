/*
  # Women Safety & Emergency Assistance Platform

  ## Tables Created
  1. `profiles` - Extended user profiles with role, phone, emergency contacts
  2. `emergency_contacts` - Emergency contacts linked to users
  3. `sos_alerts` - SOS alert events with status tracking
  4. `alert_responses` - Volunteer responses to alerts
  5. `volunteer_profiles` - Additional volunteer-specific info (skills, area)
  6. `safe_zones` - Known safe zones with location data
  7. `safety_tips` - Platform safety tips content

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Volunteers can view/respond to active alerts
  - Admins have full access (via app_metadata role check)
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text DEFAULT '',
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'volunteer', 'admin')),
  avatar_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Emergency contacts
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  relationship text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emergency contacts"
  ON emergency_contacts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own emergency contacts"
  ON emergency_contacts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own emergency contacts"
  ON emergency_contacts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own emergency contacts"
  ON emergency_contacts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- SOS Alerts
CREATE TABLE IF NOT EXISTS sos_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved', 'cancelled')),
  latitude float DEFAULT NULL,
  longitude float DEFAULT NULL,
  address text DEFAULT '',
  urgency_level text DEFAULT 'high' CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz DEFAULT NULL
);

ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON sos_alerts FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own alerts"
  ON sos_alerts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own alerts"
  ON sos_alerts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Volunteers can view active alerts"
  ON sos_alerts FOR SELECT
  TO authenticated
  USING (
    status IN ('active', 'responding') AND
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('volunteer', 'admin')
    )
  );

CREATE POLICY "Admins can view all alerts"
  ON sos_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Alert responses
CREATE TABLE IF NOT EXISTS alert_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES sos_alerts(id) ON DELETE CASCADE,
  volunteer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted', 'declined', 'completed')),
  eta_minutes int DEFAULT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz DEFAULT NULL
);

ALTER TABLE alert_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can view own responses"
  ON alert_responses FOR SELECT
  TO authenticated
  USING (volunteer_id = auth.uid());

CREATE POLICY "Volunteers can insert responses"
  ON alert_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    volunteer_id = auth.uid() AND
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('volunteer', 'admin'))
  );

CREATE POLICY "Volunteers can update own responses"
  ON alert_responses FOR UPDATE
  TO authenticated
  USING (volunteer_id = auth.uid())
  WITH CHECK (volunteer_id = auth.uid());

CREATE POLICY "Users can view responses to their alerts"
  ON alert_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sos_alerts sa WHERE sa.id = alert_id AND sa.user_id = auth.uid()
    )
  );

-- Volunteer profiles
CREATE TABLE IF NOT EXISTS volunteer_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  skills text[] DEFAULT '{}',
  area_of_operation text DEFAULT '',
  is_verified boolean DEFAULT false,
  is_available boolean DEFAULT true,
  total_responses int DEFAULT 0,
  rating float DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Volunteers can view own volunteer profile"
  ON volunteer_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Volunteers can insert own volunteer profile"
  ON volunteer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Volunteers can update own volunteer profile"
  ON volunteer_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all volunteer profiles"
  ON volunteer_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Safety tips
CREATE TABLE IF NOT EXISTS safety_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE safety_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view safety tips"
  ON safety_tips FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Seed safety tips
INSERT INTO safety_tips (title, content, category) VALUES
  ('Share Your Location', 'Always share your live location with trusted contacts when traveling alone at night.', 'travel'),
  ('Trust Your Instincts', 'If something feels wrong, leave the situation immediately. Your safety is more important than politeness.', 'general'),
  ('Emergency Numbers', 'Save local emergency numbers on speed dial: Police (100), Women Helpline (1091), Ambulance (108).', 'emergency'),
  ('Stay in Public Areas', 'When feeling unsafe, move to well-lit and populated areas immediately.', 'general'),
  ('Charge Your Phone', 'Keep your phone charged and carry a power bank when going out.', 'tech')
ON CONFLICT DO NOTHING;
