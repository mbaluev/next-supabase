import type { NextRequest } from 'next/server';

/**
 * Returns the origin of an incoming request, computed from the actual
 * `Host` (and `X-Forwarded-Proto`) header instead of `request.url` /
 * `request.nextUrl`.
 *
 * In Next.js standalone mode, `request.url` is built from the *bind*
 * hostname (the `HOSTNAME` env var, which is `0.0.0.0` inside Docker),
 * NOT from the request's `Host` header. That means redirects derived
 * from `request.url` send the browser to the wrong URL — e.g.
 * `http://0.0.0.0:3000/...` instead of `http://localhost:3000/...`.
 *
 * Reference:
 *   node_modules/next/dist/server/lib/router-utils/resolve-routes.js:104
 *
 * The `experimental.trustHostHeader` flag would fix the host but it
 * also hardcodes `https://`, which breaks local HTTP setups. Computing
 * the origin manually here avoids both pitfalls.
 */
export function getRequestOrigin(request: NextRequest): string {
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const protocol = forwardedProto ?? request.nextUrl.protocol.replace(':', '');
  const host = forwardedHost ?? request.headers.get('host') ?? request.nextUrl.host;
  return `${protocol}://${host}`;
}
