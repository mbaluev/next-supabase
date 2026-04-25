import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { getRequestOrigin } from '@/utils/request-origin';

export async function GET(request: NextRequest) {
  const origin = getRequestOrigin(request);
  const code = request.nextUrl.searchParams.get('code');
  const nextDefault = '/';
  const nextPath = request.nextUrl.searchParams.get('next') ?? nextDefault;
  const errorUrl = new URL('/auth/error', origin);
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(nextPath, origin));
  }
  return NextResponse.redirect(errorUrl);
}

export const dynamic = 'force-dynamic';
