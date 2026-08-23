'use client';

import { WidgetTcpInput } from '@/components/domains/tcp/input';
import { WidgetTcpOutput } from '@/components/domains/tcp/output';

const TCPPage = () => {
  return (
    <div className="w-full flex flex-col space-y-4">
      <WidgetTcpInput />
      <WidgetTcpOutput />
    </div>
  );
};

export default TCPPage;
