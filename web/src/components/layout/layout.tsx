import { ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import {
  SidebarLeft,
  SidebarLeftProvider,
  SidebarLeftResize,
} from '@/components/layout/sidebar-left';
import {
  SidebarRight,
  SidebarRightProvider,
  SidebarRightResize,
} from '@/components/layout/sidebar-right';
import { MenuLeftContent, MenuRightContent } from '@/components/layout/menu';
import { useServerAuth } from '@/supabase/auth-server';
import { menuLeft } from '@/settings/menu';

type LayoutProps = {
  children: ReactNode;
  leftOpen?: boolean;
  leftWidth?: number;
  rightOpen?: boolean;
  rightWidth?: number;
};
export const Layout = async (props: LayoutProps) => {
  const { children, leftOpen, leftWidth, rightOpen, rightWidth } = props;
  return (
    <LayoutSidebarLeft open={leftOpen} width={leftWidth}>
      <LayoutSidebarRight open={rightOpen} width={rightWidth}>
        <div className="flex flex-col grow">
          <Header />
          <main className="flex flex-col grow">{children}</main>
          <Footer />
        </div>
      </LayoutSidebarRight>
    </LayoutSidebarLeft>
  );
};

interface ILayoutSidebarProps {
  children: ReactNode;
  open?: boolean;
  width?: number;
}
export const LayoutSidebarLeft = async (props: ILayoutSidebarProps) => {
  const { children, open, width } = props;
  const { isAuth } = await useServerAuth();
  const menuData = menuLeft.toObject();
  return (
    <SidebarLeftProvider
      data={menuData}
      name="menu-left"
      collapsed
      defaultOpen={open ?? false}
      defaultWidth={width}
    >
      {isAuth && (
        <SidebarLeft className="z-20 group/sidebar-left">
          <MenuLeftContent />
          <SidebarLeftResize className="group-hover/sidebar-left:opacity-100 group-active/sidebar-left:opacity-100" />
        </SidebarLeft>
      )}
      {children}
    </SidebarLeftProvider>
  );
};
export const LayoutSidebarRight = async (props: ILayoutSidebarProps) => {
  const { children, open, width } = props;
  const { isAuth } = await useServerAuth();
  return (
    <SidebarRightProvider
      name="menu-right"
      collapsed
      defaultOpen={open ?? false}
      defaultWidth={width}
    >
      {children}
      {isAuth && (
        <SidebarRight className="z-10 group/sidebar-right">
          <SidebarRightResize className="group-hover/sidebar-right:opacity-100 group-active/sidebar-right:opacity-100" />
          <MenuRightContent />
        </SidebarRight>
      )}
    </SidebarRightProvider>
  );
};
