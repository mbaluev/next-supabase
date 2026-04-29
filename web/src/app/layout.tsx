import type { Viewport } from 'next';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import { ReactNode, Suspense } from 'react';
import { Check, Info, OctagonX, TriangleAlert } from 'lucide-react';
import { SupabaseAuthProvider } from '@/supabase/auth-client';
import { ThemeProvider } from '@/components/layout/theme';
import { Layout } from '@/components/layout/layout';
import { Toaster } from '@/components/ui/sonner';
import { DialogPrivacyPolicy } from '@/components/domains/profile/dialog-privacy-policy';
import { DialogTermsConditions } from '@/components/domains/profile/dialog-terms-conditions';
import { Spinner } from '@/components/ui/spinner';
import { SIDEBAR_RIGHT_DEFAULT } from '@/components/layout/sidebar-right';
import { SIDEBAR_LEFT_DEFAULT } from '@/components/layout/sidebar-left';
import './globals.css';

const font = JetBrains_Mono({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'authentication service',
  icons: {
    icon: {
      url: '/favicon.ico',
      href: '/favicon.ico',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const c = await cookies();
  const leftOpen = c.get('menu-left')?.value === 'true';
  const leftWidthRaw = c.get('menu-left_width')?.value;
  const leftWidth = Number.isFinite(Number(leftWidthRaw))
    ? Number(leftWidthRaw)
    : SIDEBAR_LEFT_DEFAULT;
  const rightOpen = c.get('menu-right')?.value === 'true';
  const rightWidthRaw = c.get('menu-right_width')?.value;
  const rightWidth = Number.isFinite(Number(rightWidthRaw))
    ? Number(rightWidthRaw)
    : SIDEBAR_RIGHT_DEFAULT;
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <SupabaseAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Suspense>
              <Layout
                leftOpen={leftOpen}
                leftWidth={leftWidth}
                rightOpen={rightOpen}
                rightWidth={rightWidth}
              >
                {children}
              </Layout>
              <DialogPrivacyPolicy />
              <DialogTermsConditions />
            </Suspense>
            <Toaster
              visibleToasts={5}
              position="bottom-right"
              style={{ fontFamily: font.style.fontFamily }}
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast: 'flex gap-x-3 px-5 py-4 w-full rounded-lg border-2 bg-card',
                  title: '',
                  icon: 'm-0',
                  closeButton: 'bg-background hover:bg-secondary border-none',
                  success: 'text-success border-success',
                  warning: 'text-warning border-warning',
                  error: 'text-destructive border-destructive',
                  info: 'text-primary border-primary',
                },
              }}
              icons={{
                success: <Check />,
                info: <Info />,
                warning: <TriangleAlert />,
                error: <OctagonX />,
                loading: <Spinner />,
              }}
            />
          </ThemeProvider>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
