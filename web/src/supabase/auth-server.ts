import { createClient } from '@/supabase/server';

export const useServerAuth = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return {
    user: data?.user,
    isAuth: !!data?.user,
  };
};
