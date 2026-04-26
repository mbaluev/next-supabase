import { ReactNode } from 'react';
import { MasterCenter } from '@/components/layout/master';

const CenterLayout = ({ children }: { children: ReactNode }) => {
  return <MasterCenter>{children}</MasterCenter>;
};

export default CenterLayout;
