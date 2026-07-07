'use client';

import { cn } from '@/utils/cn';
import { WidgetAlerts } from '@/components/debug/debug/alerts';
import { WidgetSidebars } from '@/components/debug/debug/sidebars';
import { WidgetEmpty } from '@/components/debug/debug/empty';

const DebugPage = () => {
  return (
    <div className="w-full @container/debug">
      <div
        className={cn(
          'w-full grid gap-4 items-start',
          'grid-cols-1',
          '@lg/debug:grid-cols-2 @4xl/debug:grid-cols-3 @8xl/debug:grid-cols-4'
        )}
      >
        <WidgetAlerts />
        <WidgetSidebars />
        <WidgetEmpty />
      </div>
    </div>
  );
};

export default DebugPage;
