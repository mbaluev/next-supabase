import { ReactNode } from 'react';
import { MasterDefault } from '@/components/layout/master';

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  return <MasterDefault>{children}</MasterDefault>;
};

export default ProtectedLayout;
