import { ReactNode } from 'react';
import { MasterCenter } from '@/components/layout/master';

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return <MasterCenter>{children}</MasterCenter>;
};

export default HomeLayout;
