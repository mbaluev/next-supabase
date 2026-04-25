const DEFAULT_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

type SetCookieOptions = {
  maxAge?: number;
  path?: string;
  sameSite?: 'Lax' | 'Strict' | 'None';
};

/**
 * Read a cookie by name in the browser.
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Set a cookie. Defaults: path=/, max-age=1y, SameSite=Lax. No Secure (works on http://localhost).
 */
export function setCookie(
  name: string,
  value: string,
  { maxAge = DEFAULT_MAX_AGE, path = '/', sameSite = 'Lax' }: SetCookieOptions = {}
): void {
  if (typeof document === 'undefined') return;
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `path=${path}`,
    `max-age=${maxAge}`,
    `SameSite=${sameSite}`,
  ];
  document.cookie = parts.join('; ');
}
