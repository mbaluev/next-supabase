'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  href: string;
  label: string;
}

export const ButtonBack = ({ href, label }: BackButtonProps) => {
  return (
    <Button variant="link" className="px-0 py-0 h-auto w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};
