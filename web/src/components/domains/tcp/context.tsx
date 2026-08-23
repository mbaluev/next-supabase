'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ITcpMessage, reliableApi, tcpApi } from '@/components/domains/tcp/api';

const TcpApiContext = createContext<{
  data: string[];
  setData: (data: string[]) => void;
} | null>(null);

const TcpApiProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    tcpApi.onReceive((msg: ITcpMessage) => setData((prev) => [msg, ...prev]));
    reliableApi.init(20);
    reliableApi.onReceive((msg: string) => setData((prev) => [msg, ...prev]));
    return () => {
      tcpApi.disconnect();
      reliableApi.disconnect();
    };
  }, []);

  return <TcpApiContext.Provider value={{ data, setData }}>{children}</TcpApiContext.Provider>;
};

function useTcpApi() {
  const context = useContext(TcpApiContext);
  if (!context) throw new Error('useAPI must be used within a APIProvider.');
  return context;
}

export { TcpApiProvider, useTcpApi };
