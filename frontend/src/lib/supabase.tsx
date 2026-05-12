import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are not set.\n' +
    'Authentication and data features will not work.\n' +
    'Add these to your Vercel project → Settings → Environment Variables.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type UserRole = 'user' | 'volunteer' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url: string;
  is_active: boolean;
  created_at: string;
}

export interface EmergencyContact {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface SosAlert {
  id: string;
  user_id: string;
  status: 'active' | 'responding' | 'resolved' | 'cancelled';
  latitude: number | null;
  longitude: number | null;
  address: string;
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  resolved_at: string | null;
}

export interface AlertResponse {
  id: string;
  alert_id: string;
  volunteer_id: string;
  status: 'accepted' | 'declined' | 'completed';
  eta_minutes: number | null;
  notes: string;
  created_at: string;
}

export interface VolunteerProfile {
  id: string;
  skills: string[];
  area_of_operation: string;
  is_verified: boolean;
  is_available: boolean;
  total_responses: number;
  rating: number;
}
