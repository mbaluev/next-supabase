'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/supabase/client';

interface SupabaseAuthContext {
  user: User | null;
  pending: boolean;
  signOut: () => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContext | null>(null);

const SupabaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setPending(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setPending(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const value = useMemo<SupabaseAuthContext>(
    () => ({ user, pending, signOut }),
    [user, pending, signOut],
  );

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

function useSupabaseUser() {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) throw new Error('useSupabaseUser must be used within SupabaseAuthProvider');
  return { user: ctx.user, pending: ctx.pending };
}

function useSupabaseAuth() {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) throw new Error('useSupabaseAuth must be used within SupabaseAuthProvider');
  return { signOut: ctx.signOut };
}

const Authenticated = ({ children }: { children: ReactNode }) => {
  const { user, pending } = useSupabaseUser();
  if (pending || !user) return null;
  return <>{children}</>;
};

export { SupabaseAuthProvider, Authenticated, useSupabaseUser, useSupabaseAuth };
