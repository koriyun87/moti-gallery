import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Content = {
  id: string;
  title: string;
  centerName: string;
  location: string;
  centerType: 'rehabilitation' | 'pilates' | 'fitness' | 'performance';
  purpose: string[];
  mediaType: 'youtube' | 'instagram' | 'image';
  mediaLink: string;
  description: string;
  tags: string[];
  createdAt: string;
  isPublished: boolean;
};
