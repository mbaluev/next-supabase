'use client';

import { ChartTransitions } from '@/components/charts/transitions';
import { EChartTransitionsType } from '@/components/charts/transitions/mock';

const DashboardPage = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <ChartTransitions
        name="d1"
        className="h-52"
        title="stacked bar chart"
        defaultType={EChartTransitionsType.stackedBarChart}
      />
      <ChartTransitions
        name="d2"
        className="h-52"
        title="grouped bar chart"
        defaultType={EChartTransitionsType.groupedBarChart}
      />
      <ChartTransitions
        name="d3"
        className="h-52"
        title="area chart"
        defaultType={EChartTransitionsType.areaChart}
      />
      <ChartTransitions
        name="d4"
        className="h-52"
        title="stacked area chart"
        defaultType={EChartTransitionsType.stackedAreaChart}
      />
    </div>
  );
};

export default DashboardPage;
