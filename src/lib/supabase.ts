import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export type Major = '応用物理主専攻' | '電子・量子工学主専攻' | '物性工学主専攻' | '物質・分子工学主専攻';

export interface Lab {
  id: string;
  name: string;
  professor: string | null;
  major: Major;
  capacity: number;
  created_at: string;
}

export interface Student {
  id: string;
  email: string;
  gpa: number;
  lab_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LabApplicant {
  id: string;
  email: string;
  gpa: number;
  lab_id: string;
  lab_name: string;
  lab_major: Major;
  capacity: number;
  professor: string | null;
  rank: number;
  applicant_count: number;
}