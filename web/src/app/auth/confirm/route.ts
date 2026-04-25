import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';

function safePath(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const nextParam = safePath(searchParams.get('next'));

  const defaultNext =
    type === 'recovery' ? '/auth/update-password' : '/';
  const nextPath = nextParam ?? defaultNext;

  const errorUrl = new URL('/auth/error', origin);

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(nextPath, origin));
    }
  }

  return NextResponse.redirect(errorUrl);
}

export const dynamic = 'force-dynamic';
