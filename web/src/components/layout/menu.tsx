'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SvgLogo } from '@/components/icons/components/logo';
import {
  ChevronRight,
  BookOpen,
  LogOut,
  User,
  ArrowRightToLine,
  SlidersHorizontal,
  ArrowLeftToLine,
} from 'lucide-react';
import { TTreeDTO } from '@/utils/tree';
import { Fragment, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { TRouteDTO, IS_PATH, ROUTES } from '@/settings/routes';
import {
  SidebarLeft,
  SidebarLeftButton,
  SidebarLeftProvider,
  SidebarLeftResize,
  useSidebarLeft,
} from '@/components/layout/sidebar-left';
import {
  SidebarRight,
  SidebarRightButton,
  SidebarRightProvider,
  SidebarRightResize,
  useSidebarRight,
} from '@/components/layout/sidebar-right';
import { Separator } from '@/components/ui/separator';
import { handleDialogOpen } from '@/components/ui/dialog-handlers';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { menuLeft } from '@/settings/menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Authenticated, useSupabaseUser, useSupabaseAuth } from '@/supabase/auth';

const MENU_PADDING_ITEM = 15;
const MENU_TRANSITION_DURATION = 100;

interface IMenuItemProps<T> {
  node: TTreeDTO<T>;
  toggleNode?: (node: TTreeDTO<TRouteDTO>) => void;
}

// menu-item

const MenuItemPadding = (props: IMenuItemProps<TRouteDTO>) => {
  const { node } = props;
  if (!node.state.level || node.state.level <= 1) return null;
  return <div style={{ width: `${(node.state.level - 1) * MENU_PADDING_ITEM}px` }} />;
};
MenuItemPadding.displayName = 'MenuItemPadding';

const MenuItemContent = (props: IMenuItemProps<TRouteDTO>) => {
  const { node } = props;
  const classNameChevron = cn(
    `transition-transform transform duration-${MENU_TRANSITION_DURATION}`,
    !node.state.collapsed && 'rotate-90'
  );
  return (
    <Fragment>
      {node.data?.icon}
      <p className="flex-1 text-left">{node.data?.label}</p>
      {Boolean(node.data?.dialog) && <BookOpen />}
      {node.items.length > 0 && <ChevronRight className={classNameChevron} />}
    </Fragment>
  );
};
MenuItemContent.displayName = 'MenuItemContent';

const MenuItemToggle = (props: IMenuItemProps<TRouteDTO>) => {
  const { node, toggleNode } = props;
  const handleToggle = () => {
    if (toggleNode) toggleNode(node);
  };
  return (
    <Button
      variant={node.state.selected ? 'ghost-primary' : 'ghost'}
      onClick={handleToggle}
      className="w-full justify-start"
    >
      <MenuItemPadding {...props} />
      <MenuItemContent {...props} />
    </Button>
  );
};
MenuItemToggle.displayName = 'MenuItemToggle';

const MenuItemLeft = (props: IMenuItemProps<TRouteDTO>) => {
  const { node } = props;
  const { toggleNode } = useSidebarLeft();
  const _props = { node, toggleNode };

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  if (!node.data) return null;

  // item dialog
  if (!IS_PATH(node.data.path) && Boolean(node.data.dialog)) {
    const handleClick = () => {
      const params = new URLSearchParams(searchParams.toString());
      const _params = handleDialogOpen(params, ROUTES.PROFILE.name);
      const _pathname = _params.size > 0 ? `${pathname}?${_params.toString()}` : pathname;
      router.replace(_pathname);
    };
    return (
      <SidebarLeftButton
        variant={node.state.selected ? 'ghost-primary' : 'ghost'}
        className="w-full"
        onClick={handleClick}
      >
        <MenuItemPadding {..._props} />
        <MenuItemContent {..._props} />
      </SidebarLeftButton>
    );
  }

  // item toggle
  if (!IS_PATH(node.data.path)) return <MenuItemToggle {..._props} />;

  // item link
  return (
    <SidebarLeftButton
      variant={node.state.selected ? 'ghost-primary' : 'ghost'}
      className="w-full"
      asChild
    >
      <Link href={node.data.path}>
        <MenuItemPadding {..._props} />
        <MenuItemContent {..._props} />
      </Link>
    </SidebarLeftButton>
  );
};
MenuItemLeft.displayName = 'MenuItemLeft';

const MenuItemRight = (props: IMenuItemProps<TRouteDTO>) => {
  const { node } = props;
  const { toggleNode } = useSidebarRight();
  const _props = { node, toggleNode };

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  if (!node.data) return null;

  // item dialog
  if (!IS_PATH(node.data.path) && Boolean(node.data.dialog)) {
    const handleClick = () => {
      const params = new URLSearchParams(searchParams.toString());
      const _params = handleDialogOpen(params, ROUTES.PROFILE.name);
      const _pathname = _params.size > 0 ? `${pathname}?${_params.toString()}` : pathname;
      router.replace(_pathname);
    };
    return (
      <SidebarRightButton
        variant={node.state.selected ? 'ghost-primary' : 'ghost'}
        className="w-full"
        onClick={handleClick}
      >
        <MenuItemPadding {..._props} />
        <MenuItemContent {..._props} />
      </SidebarRightButton>
    );
  }

  // item toggle
  if (!IS_PATH(node.data.path)) return <MenuItemToggle {..._props} />;

  // item link
  return (
    <SidebarRightButton
      variant={node.state.selected ? 'ghost-primary' : 'ghost'}
      className="w-full"
      asChild
    >
      <Link href={node.data.path}>
        <MenuItemPadding {..._props} />
        <MenuItemContent {..._props} />
      </Link>
    </SidebarRightButton>
  );
};
MenuItemRight.displayName = 'MenuItemRight';

// menu-left

interface IMenuProps {
  children: ReactNode;
}
const MenuLeft = (props: IMenuProps) => {
  const { children } = props;
  return (
    <SidebarLeftProvider data={menuLeft} name="menu-left" collapsed>
      <Authenticated>
        <SidebarLeft className="z-20 group/sidebar-left">
          <MenuLeftContent />
          <SidebarLeftResize className="group-hover/sidebar-left:opacity-100 group-active/sidebar-left:opacity-100" />
        </SidebarLeft>
      </Authenticated>
      {children}
    </SidebarLeftProvider>
  );
};
MenuLeft.displayName = 'MenuLeft';

const MenuLeftContent = () => {
  const { toggleSidebar, data } = useSidebarLeft();
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-4 flex space-x-4 justify-between">
        <SidebarLeftButton asChild variant="ghost" className="flex-1">
          <Link href={ROUTES.HOME.path}>
            <SvgLogo className="w-6 h-6" />
            <p>{process.env.NEXT_PUBLIC_APP_NAME}</p>
          </Link>
        </SidebarLeftButton>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <ArrowLeftToLine />
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col overflow-y-auto">
        <MenuUserInfo />
        <Separator />
        <div className="p-4 flex flex-col space-y-2">
          {data
            ?.flat()
            ?.filter((d) => !d.state.hidden)
            .map((node, index) => (
              <MenuItemLeft key={index} node={node} />
            ))}
        </div>
      </div>
    </div>
  );
};
MenuLeftContent.displayName = 'MenuLeftContent';

const MenuUserInfo = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { user, pending } = useSupabaseUser();
  const { signOut } = useSupabaseAuth();

  const handleLogout = async () => {
    await signOut();
  };
  const handleProfile = () => {
    const params = new URLSearchParams(searchParams.toString());
    const _params = handleDialogOpen(params, ROUTES.PROFILE.name);
    const _pathname = _params.size > 0 ? `${pathname}?${_params.toString()}` : pathname;
    router.replace(_pathname);
  };

  if (pending) return null;
  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url ?? '';
  const displayName = user.user_metadata?.full_name ?? '-';

  return (
    <div className="p-4 flex flex-col space-y-4">
      <div className="flex space-x-4 items-center">
        <Avatar className="w-20 h-20 bg-secondary rounded-md">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="bg-secondary">
            <User className="text-xl" />
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 overflow-hidden flex-1">
          <p className="overflow-hidden text-ellipsis">{user.email ?? '-'}</p>
          <p className="overflow-hidden text-ellipsis">{displayName}</p>
        </div>
      </div>
      <div className="flex flex-col space-y-2 ">
        <SidebarLeftButton variant="ghost" onClick={handleLogout}>
          <LogOut />
          logout
        </SidebarLeftButton>
        <SidebarLeftButton variant="ghost" onClick={handleProfile}>
          {ROUTES.PROFILE.icon}
          <p className="flex-1 text-left">{ROUTES.PROFILE.label}</p>
          {ROUTES.PROFILE.dialog && <BookOpen />}
        </SidebarLeftButton>
      </div>
    </div>
  );
};
MenuUserInfo.displayName = 'MenuUserInfo';

// menu-right

const MenuRight = (props: IMenuProps) => {
  const { children } = props;
  return (
    <SidebarRightProvider name="menu-right" collapsed defaultOpen={false}>
      {children}
      <Authenticated>
        <SidebarRight className="z-10 group/sidebar-right">
          <SidebarRightResize className="group-hover/sidebar-right:opacity-100 group-active/sidebar-right:opacity-100" />
          <MenuRightContent />
        </SidebarRight>
      </Authenticated>
    </SidebarRightProvider>
  );
};
MenuRight.displayName = 'MenuRight';

const MenuRightContent = () => {
  const { toggleSidebar, data } = useSidebarRight();
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-4 flex gap-4 justify-between items-center">
        <SidebarRightButton variant="static" className="flex-1">
          <SlidersHorizontal />
          <p>details</p>
        </SidebarRightButton>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <ArrowRightToLine />
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col overflow-y-auto">
        <div className="p-4 flex flex-col space-y-2">
          {data
            ?.flat()
            ?.filter((d) => !d.state.hidden)
            .map((node, index) => (
              <MenuItemRight key={index} node={node} />
            ))}
        </div>
      </div>
    </div>
  );
};
MenuRightContent.displayName = 'MenuRightContent';

export { MenuLeft, MenuRight };
