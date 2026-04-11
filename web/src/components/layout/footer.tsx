'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Copyright, Dot } from 'lucide-react';
import { ROUTES } from '@/settings/routes';
import { handleDialogOpen } from '@/components/ui/dialog-handlers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const Footer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePrivacyPolicy = () => {
    const params = new URLSearchParams(searchParams.toString());
    const _params = handleDialogOpen(params, ROUTES.PRIVACY_POLICY.name);
    const _pathname = _params.size > 0 ? `${pathname}?${_params.toString()}` : pathname;
    router.replace(_pathname);
  };
  const handleTermsConditions = () => {
    const params = new URLSearchParams(searchParams.toString());
    const _params = handleDialogOpen(params, ROUTES.TERMS_CONDITIONS.name);
    const _pathname = _params.size > 0 ? `${pathname}?${_params.toString()}` : pathname;
    router.replace(_pathname);
  };

  return (
    <footer className="flex flex-wrap gap-x-2 gap-y-2 p-6 z-[8] justify-start md:justify-center">
      <Button variant="link" className="px-0 py-0 h-auto" asChild>
        <Link href={ROUTES.HOME.path}>
          <Copyright />
          <p>{`${new Date().getFullYear()} ${process.env.APP_NAME}`}</p>
        </Link>
      </Button>
      <Dot className="text-primary" />
      <Button variant="link" className="px-0 py-0 h-auto" onClick={handlePrivacyPolicy}>
        {ROUTES.PRIVACY_POLICY.icon}
        <p className="flex-1 text-left">{ROUTES.PRIVACY_POLICY.label}</p>
      </Button>
      <Dot className="text-primary" />
      <Button variant="link" className="px-0 py-0 h-auto" onClick={handleTermsConditions}>
        {ROUTES.TERMS_CONDITIONS.icon}
        <p className="flex-1 text-left">{ROUTES.TERMS_CONDITIONS.label}</p>
      </Button>
    </footer>
  );
};
