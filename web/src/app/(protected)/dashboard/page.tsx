'use client';

import { ChartTransitions } from '@/components/domains/chart-transitions';

const DashboardPage = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <ChartTransitions name="d1" className="h-100" />
    </div>
  );
};

export default DashboardPage;
