import { ReactNode } from 'react';
import { MasterCenter } from '@/components/layout/master';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <MasterCenter className="items-start">
      <div className="pt-12">{children}</div>
    </MasterCenter>
  );
};

export default AuthLayout;
