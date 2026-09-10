import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Service {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  short_desc: string;
  practitioner_name?: string;
  practitioner_role?: string;
  overview: string;
  schedule_location?: string;
  eligibility?: string;
  contact_info?: string;
}

export interface ServiceCategory {
  id: string;
  category_title: string;
  category_desc: string;
  display_order: number;
  services: Service[];
}