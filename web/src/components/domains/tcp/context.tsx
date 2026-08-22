'use client';

import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { ITcpMessage, reliableApi, tcpApi } from '@/components/domains/tcp/api';

const TcpApiContext = createContext<{
  data: string[];
  clear: () => void;
} | null>(null);

const TcpApiProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any[]>([]);

  reliableApi.onReceive((msg: string) => setData((prev) => [msg, ...prev]));

  return (
    <TcpApiContext.Provider value={{ data, clear: () => setData([]) }}>
      {children}
    </TcpApiContext.Provider>
  );
};

function useTcpApi() {
  const context = useContext(TcpApiContext);
  if (!context) throw new Error('useAPI must be used within a APIProvider.');
  return context;
}

export { TcpApiProvider, useTcpApi };
