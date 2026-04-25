import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_COOKIE_NAME } from '@/supabase/const';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: SUPABASE_COOKIE_NAME },
    }
  );
}
