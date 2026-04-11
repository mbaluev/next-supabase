import { useEffect, useState } from 'react';

export const MEDIA_XS = 0;
export const MEDIA_SM = 640;
export const MEDIA_MD = 768; // mobile
export const MEDIA_LG = 1024;
export const MEDIA_XL = 1280;
export const MEDIA_2XL = 1400;

export function useMatchMedia(px: number) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${px - 1}px)`);
    const onChange = () => setIsMobile(window.innerWidth < px);
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < px);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
