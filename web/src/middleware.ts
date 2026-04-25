import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_COOKIE_NAME } from '@/supabase/const';
import { getRequestOrigin } from '@/utils/request-origin';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/debug',
  '/files',
  '/illustrations',
  '/partners',
  '/users',
  '/auth/update-password',
];

function matchesPath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function withSupabaseCookies(target: NextResponse, source: NextResponse): NextResponse {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  target.headers.set('Cache-Control', 'private, no-store');
  return target;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: SUPABASE_COOKIE_NAME },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const { user } = data;
  const pathname = request.nextUrl.pathname;
  const origin = getRequestOrigin(request);
  const isProtected = PROTECTED_PREFIXES.some((p) => matchesPath(pathname, p));

  if (isProtected && !user) {
    const url = new URL('/auth/login', origin);
    url.searchParams.set('next', pathname);
    return withSupabaseCookies(NextResponse.redirect(url), supabaseResponse);
  }
  if (user && (matchesPath(pathname, '/auth/login') || matchesPath(pathname, '/auth/register'))) {
    const url = new URL('/', origin);
    return withSupabaseCookies(NextResponse.redirect(url), supabaseResponse);
  }

  supabaseResponse.headers.set('Cache-Control', 'private, no-store');
  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
