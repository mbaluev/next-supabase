'use client';

import { Dot } from 'lucide-react';
import { SvgLogo } from '@/components/icons/components/logo';
import { Unauthenticated } from '@/supabase/auth-client';
import { ButtonLogin } from '@/components/domains/auth/button-login';

export default function Home() {
  return (
    <div className="space-y-10 text-center">
      <div className="flex gap-8 flex-col items-center justify-center">
        <SvgLogo strokeWidth={1.5} className="text-5xl" />
        <h1 className="text-5xl font-semibold">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
      </div>
      <div className="flex gap-1 flex-col items-center text-muted-foreground">
        <div className="flex gap-x-2 gap-y-1 flex-wrap justify-center">
          <p>next.js</p>
          <Dot />
          <p>supabase</p>
          <Dot />
          <p>d3.js</p>
        </div>
        <div className="flex gap-x-2 gap-y-1 flex-wrap justify-center">
          <p>tailwind</p>
          <Dot />
          <p>lucide icons</p>
        </div>
      </div>
      <Unauthenticated>
        <div className="grid grid-cols-1">
          <ButtonLogin variant="default" mode="redirect">
            sign in
          </ButtonLogin>
        </div>
      </Unauthenticated>
    </div>
  );
}
