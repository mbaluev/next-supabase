'use client';

import { Dot } from 'lucide-react';
import { SvgLogo } from '@/components/icons/components/logo';
import { Unauthenticated } from '@/supabase/auth';
import { ButtonLogin } from '@/components/layout/button-login';

export default function Home() {
  return (
    <div className="space-y-10 text-center">
      <div className="flex gap-8 flex-col items-center justify-center">
        <SvgLogo className="text-5xl" />
        <h1 className="text-5xl font-semibold">{process.env.APP_NAME}</h1>
      </div>
      <div className="flex gap-1 flex-col items-center text-muted-foreground">
        <p>authentication service</p>
        <div className="flex gap-2 flex-wrap justify-center">
          <p>next.js</p>
          <Dot />
          <p>tailwind</p>
          <Dot />
          <p>lucide icons</p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <p>layouts</p>
          <Dot />
          <p>sidebar resizable</p>
        </div>
        <p>d3.js charts</p>
      </div>
      <Unauthenticated>
        <div className="grid grid-cols-1 gap-6">
          <ButtonLogin variant="default" mode="redirect">
            sign in
          </ButtonLogin>
          <ButtonLogin variant="outline" mode="modal">
            sign in dialog
          </ButtonLogin>
        </div>
      </Unauthenticated>
    </div>
  );
}
