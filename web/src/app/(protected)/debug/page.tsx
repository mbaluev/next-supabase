'use client';

import { cn } from '@/utils/cn';
import { WidgetAlerts } from '@/components/domains/widgets/alerts';
import { WidgetSidebars } from '@/components/domains/widgets/sidebars';
import { WidgetEmpty } from '@/components/domains/widgets/empty';

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
