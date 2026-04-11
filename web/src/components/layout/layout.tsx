'use client';

import { ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MenuLeft, MenuRight } from '@/components/layout/menu';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <MenuLeft>
      <MenuRight>
        <div className="flex flex-col grow">
          <Header />
          <main className="flex flex-col grow">{children}</main>
          <Footer />
        </div>
      </MenuRight>
    </MenuLeft>
  );
};
