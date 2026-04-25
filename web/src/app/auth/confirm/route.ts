import { type EmailOtpType } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { getRequestOrigin } from '@/utils/request-origin';

function safePath(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  return value;
}

export async function GET(request: NextRequest) {
  const origin = getRequestOrigin(request);
  const token_hash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null;
  const nextParam = safePath(request.nextUrl.searchParams.get('next'));
  const defaultNext = type === 'recovery' ? '/auth/update-password' : '/';
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
