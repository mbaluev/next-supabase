import { ReactNode } from 'react';
import {
  CircleOff,
  Code,
  FolderClosed,
  LayoutDashboard,
  ReceiptText,
  ShieldCheck,
  UserRoundCog,
  Image as ImageIcon,
  BriefcaseBusiness,
  Users,
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
  PROFILE: {
    name: 'profile',
    label: 'profile',
    path: EMPTY_PATH,
    icon: <UserRoundCog />,
    dialog: true,
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
  DASHBOARD: {
    name: 'dashboard',
    label: 'dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard />,
  },
  FILES: {
    name: 'files',
    label: 'files',
    path: '/files',
    icon: <FolderClosed />,
  },
  PARTNERS: {
    name: 'partners',
    label: 'partners',
    path: '/partners',
    icon: <BriefcaseBusiness />,
  },
  USERS: {
    name: 'users',
    label: 'users',
    path: '/users',
    icon: <Users />,
  },
  ILLUSTRATIONS: {
    name: 'illustrations',
    label: 'illustrations',
    path: '/illustrations',
    icon: <ImageIcon />,
  },
  DEBUG: {
    name: 'debug',
    label: 'debug',
    path: '/debug',
    icon: <Code />,
  },
  XXX: {
    name: 'xxx',
    label: 'xxx',
    path: '/xxx',
    icon: <CircleOff />,
  },
};

export { IS_PATH, ROUTES };
export type { TRouteDTO };
