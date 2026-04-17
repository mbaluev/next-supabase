'use client';

import { ChartTransitions } from '@/components/domains/chart-transitions';

const DashboardPage = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="h-100 w-full grid gap-4 grid-cols-1">
        <ChartTransitions name="d1" />
      </div>
    </div>
  );
};

export default DashboardPage;
