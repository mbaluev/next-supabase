import { ReactNode } from 'react';
import { TcpApiProvider } from '@/components/domains/tcp/context';

const TcpApi = ({ children }: { children: ReactNode }) => {
  return <TcpApiProvider>{children}</TcpApiProvider>;
};

export { TcpApi };
