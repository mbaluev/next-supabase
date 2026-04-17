'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChartArea,
  ChartColumn,
  ChartColumnStacked,
  ChartSpline,
  LayoutDashboard,
  RefreshCw,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { v4 } from 'uuid';
import { ROUTES } from '@/settings/routes';
import { useQueryString } from '@/hooks/use-query-string';
import {
  Widget,
  WidgetButtons,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';
import {
  DEFAULT_CHART_TRANSITIONS_TYPE,
  EChartTransitionsType,
  MOCK_CHART_TRANSITIONS_DATA,
  MOCK_CHART_TRANSITIONS_LEGEND,
} from '@/components/domains/chart-transitions/mock';
import { ChartTransitionsCreate } from '@/components/domains/chart-transitions/create';
import { TooltipText } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ChartTransitionsColors } from '@/components/domains/chart-transitions/colors';

interface IChartTransitionsProps extends WidgetProps {
  name?: string;
}

export const ChartTransitions = (props: IChartTransitionsProps) => {
  const { name } = props;

  // load data
  const transitions: any = MOCK_CHART_TRANSITIONS_DATA;
  const data = useMemo(() => transitions ?? [], [transitions]);
  const legend = MOCK_CHART_TRANSITIONS_LEGEND;
  const loading = !transitions;

  // props
  const ref = useRef<any>(null);
  const [chart, setChart] = useState<any>(null);
  const router = useRouter();
  const params = useSearchParams();
  const typeName = name ?? 'type';
  const type = params.get(typeName) ?? DEFAULT_CHART_TRANSITIONS_TYPE;
  const id = useMemo(() => `widget-chart-${v4()}`, []);

  // helpers
  const formatValue = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'EUR',
      currencyDisplay: 'code',
    }).format(value);
  };

  // change type, reset
  const searchParams = useSearchParams();
  const { addParam, removeParam } = useQueryString(searchParams);
  const handleChange = (type: EChartTransitionsType) => {
    const queryString = addParam(typeName, type);
    const path = ROUTES.DASHBOARD.path;
    router.push(`${path}?${queryString}`);
  };
  const handleReset = () => {
    const queryString = removeParam(typeName);
    const path = ROUTES.DASHBOARD.path;
    router.push(`${path}?${queryString}`);
  };

  // create
  const { width, height, start } = useResizeObserver(ref, 100);
  const create = useCallback(() => {
    if (ref.current) {
      const obj = ChartTransitionsCreate(ref, id, data ?? [], legend ?? [], type, formatValue);
      setChart(obj);
    }
  }, [ref, id, type, data, legend]);
  // resize
  useEffect(() => {
    if (ref.current && width > 0 && height > 0 && start) {
      chart?.remove();
      setChart(null);
      // ref.current.replaceChildren();
    }
    if (ref.current && data && width > 0 && height > 0 && !start) {
      create();
    }
  }, [ref, start, width, height, data]);
  // update
  useEffect(() => {
    if (ref.current && chart) {
      chart.update(data, type);
    }
  }, [ref, type, data]);

  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="padding">
        <WidgetIcon>
          <LayoutDashboard />
        </WidgetIcon>
        <WidgetTitle>transitions</WidgetTitle>
        <WidgetButtons>
          <TooltipText title="stacked bar chart" side="top">
            <Button
              variant={
                !type || type === EChartTransitionsType.stackedBarChart ? 'default' : 'ghost'
              }
              size="icon"
              onClick={() => handleChange(EChartTransitionsType.stackedBarChart)}
            >
              <ChartColumnStacked />
            </Button>
          </TooltipText>
          <TooltipText title="grouped bar chart" side="top">
            <Button
              variant={type === EChartTransitionsType.groupedBarChart ? 'default' : 'ghost'}
              size="icon"
              onClick={() => handleChange(EChartTransitionsType.groupedBarChart)}
            >
              <ChartColumn />
            </Button>
          </TooltipText>
          <TooltipText title="area chart" side="top">
            <Button
              variant={type === EChartTransitionsType.areaChart ? 'default' : 'ghost'}
              size="icon"
              onClick={() => handleChange(EChartTransitionsType.areaChart)}
            >
              <ChartSpline />
            </Button>
          </TooltipText>
          <TooltipText title="stacked area chart" side="top">
            <Button
              variant={type === EChartTransitionsType.stackedAreaChart ? 'default' : 'ghost'}
              size="icon"
              onClick={() => handleChange(EChartTransitionsType.stackedAreaChart)}
            >
              <ChartArea />
            </Button>
          </TooltipText>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RefreshCw />
          </Button>
        </WidgetButtons>
      </WidgetHeader>
      <WidgetContent variant="padding">
        <div ref={ref} className="w-full h-full relative">
          {loading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Spinner className="text-[2rem] text-muted-foreground" />
            </div>
          )}
        </div>
      </WidgetContent>
      <ChartTransitionsColors />
    </Widget>
  );
};
