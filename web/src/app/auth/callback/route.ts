import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';

function safePath(value: string | null): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return null;
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextPath = safePath(searchParams.get('next')) ?? '/dashboard';
  const errorUrl = new URL('/auth/error', origin);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(nextPath, origin));
    }
  }

  return NextResponse.redirect(errorUrl);
}

export const dynamic = 'force-dynamic';
