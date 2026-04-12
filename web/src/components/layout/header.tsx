'use client';

import { SidebarLeftTrigger } from '@/components/layout/sidebar-left';
import { SidebarRightTrigger } from '@/components/layout/sidebar-right';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { TooltipText } from '@/components/ui/tooltip';
import { Moon, Sun } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { BREAD_CRUMBS } from '@/settings/bread-crumbs';
import { BreadCrumbs } from '@/components/layout/bread-crumbs';
import { useCallback, useEffect } from 'react';
import { Authenticated } from '@/supabase/auth';

const THEME_KEYBOARD_SHORTCUT = 't';

const HeaderThemeBtn = () => {
  const { setTheme, theme } = useTheme();
  const handleChangeTheme = useCallback(
    () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    [theme, setTheme]
  );

  // keyboard shortcut to toggle/hide the sidebar.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // && (event.metaKey || event.ctrlKey)
      if (event.key === THEME_KEYBOARD_SHORTCUT) {
        event.preventDefault();
        handleChangeTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleChangeTheme]);

  return (
    <TooltipText title="switch theme" side="left">
      <Button variant="ghost" size="icon" onClick={handleChangeTheme} className="grow-0">
        <Moon className="rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
        <Sun className="rotate-0 scale-100 transition-transform ease-in-out duration-500 dark:-rotate-90 dark:scale-0 absolute" />
      </Button>
    </TooltipText>
  );
};

const HeaderRight = () => {
  return (
    <nav className="grow-0 flex gap-4">
      <HeaderThemeBtn />
      {/*<HeaderUserBtn />*/}
      <Authenticated>
        <SidebarRightTrigger />
      </Authenticated>
    </nav>
  );
};

const HeaderLeft = () => {
  const pathname = usePathname();
  const breadCrumbs = BREAD_CRUMBS[pathname];
  return (
    <div className="grow flex flex-wrap gap-4">
      <Authenticated>
        <SidebarLeftTrigger />
      </Authenticated>
      <BreadCrumbs breadCrumbs={breadCrumbs} home />
    </div>
  );
};

const Header = () => {
  return (
    <header className="flex flex-col w-full z-8 sticky top-0">
      <div className="flex gap-4 justify-end items-start p-4 w-full bg-background">
        <HeaderLeft />
        <HeaderRight />
      </div>
    </header>
  );
};

export { Header };
