import { ReactNode } from 'react';
import { MasterCenter } from '@/components/layout/master';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <MasterCenter className="items-start pt-12">{children}</MasterCenter>;
};

export default AuthLayout;
