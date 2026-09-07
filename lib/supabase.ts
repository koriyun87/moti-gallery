import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// createBrowserClient (대신 createClient)를 써야 로그인 세션이 쿠키에 저장되고,
// middleware.ts가 서버에서 같은 세션을 읽어 /admin 접근을 막을 수 있습니다.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export type Content = {
  id: string;
  title: string;
  centerName: string;
  location: string;
  centerType: 'rehab' | 'athleteTraining' | 'hospital' | 'school';
  mediaType: 'youtube' | 'instagram' | 'image';
  mediaLink: string;
  description: string;
  tags: string[];
  sports: string[];
  createdAt: string;
  isPublished: boolean;
};

export type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  createdAt: string;
};
