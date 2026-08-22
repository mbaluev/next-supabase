'use client';

import { WidgetTcpInput } from '@/components/domains/tcp/input';
import { WidgetTcpOutput } from '@/components/domains/tcp/output';

const TCPPage = () => {
  return (
    <div className="w-full grid grid-cols-2 gap-4">
      <WidgetTcpInput />
      <WidgetTcpOutput />
    </div>
  );
};

export default TCPPage;
