import { ReactNode } from 'react';
import {
  CircleOff,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  UserRoundCog,
  ListCollapse,
  ListRestart,
  CodeXml,
} from 'lucide-react';

const EMPTY_PATH = '#';
const IS_PATH = (path?: string) => path !== EMPTY_PATH;

type TRouteDTO = {
  name: string;
  path: string;
  label?: string;
  icon?: ReactNode;
  dialog?: boolean;
};

const ROUTES: Record<string, TRouteDTO> = {
  HOME: {
    name: 'home',
    label: 'home',
    path: '/',
  },
  PRIVACY_POLICY: {
    name: 'privacy-policy',
    label: 'privacy policy',
    path: EMPTY_PATH,
    icon: <ShieldCheck />,
    dialog: true,
  },
  TERMS_CONDITIONS: {
    name: 'terms-conditions',
    label: 'terms & conditions',
    path: EMPTY_PATH,
    icon: <ReceiptText />,
    dialog: true,
  },
  PROFILE: {
    name: 'profile',
    label: 'profile',
    path: '/profile',
    icon: <UserRoundCog />,
  },
  DASHBOARD: {
    name: 'dashboard',
    label: 'dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard />,
  },
  DEBUG: {
    name: 'debug',
    label: 'debug',
    path: '/debug',
    icon: <CodeXml />,
  },
  DEBUG_LIST_STATIC: {
    name: 'debug-list-static',
    label: 'list static',
    path: '/debug/list-static',
    icon: <ListCollapse />,
  },
  DEBUG_LIST_LOAD: {
    name: 'debug-list-load',
    label: 'list load',
    path: '/debug/list-load',
    icon: <ListRestart />,
  },
  DEBUG_XXX: {
    name: 'debug-xxx',
    label: 'xxx',
    path: '/debug/xxx',
    icon: <CircleOff />,
  },
};

export { IS_PATH, ROUTES };
export type { TRouteDTO };
