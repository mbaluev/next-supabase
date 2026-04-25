/**
 * Shared between the browser client, the server client, and the middleware so
 * that all three read/write the SAME auth cookie regardless of which URL each
 * uses to reach Supabase. Without this, @supabase/ssr derives the cookie name
 * from the URL's hostname (e.g. `sb-localhost-auth-token` in the browser vs
 * `sb-kong-auth-token` in a Docker container), causing the server to never
 * find the cookie set by the browser.
 */
export const SUPABASE_COOKIE_NAME = 'sb-auth-token';
