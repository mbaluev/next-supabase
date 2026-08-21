'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChartArea,
  ChartColumn,
  ChartColumnStacked,
  ChartSpline,
  Activity,
  RefreshCw,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { v4 } from 'uuid';
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
  EChartTransitionsType,
  IChartTransitionsItem,
  MOCK_CHART_TRANSITIONS_DATA,
  MOCK_CHART_TRANSITIONS_LEGEND,
  parseChartTransitionsType,
} from '@/components/charts/transitions/mock';
import { ChartTransitionsCreate, IChartTransitions } from '@/components/charts/transitions/create';
import { TooltipText } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface IChartTransitionsProps extends WidgetProps {
  name?: string;
  title?: string;
  defaultType?: EChartTransitionsType;
}

// helpers
const currencyFormat = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'EUR',
  currencyDisplay: 'code',
});
const formatValue = (value: number) => currencyFormat.format(value);

export const ChartTransitions = (props: IChartTransitionsProps) => {
  const { name, title, defaultType, ...rest } = props;

  // load data
  const transitions: IChartTransitionsItem[] | undefined = MOCK_CHART_TRANSITIONS_DATA;
  const data = useMemo(() => transitions ?? [], [transitions]);
  const legend = MOCK_CHART_TRANSITIONS_LEGEND;
  const loading = !transitions;

  // props
  const ref = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartTransitions | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeName = name ?? 'type';
  const type = parseChartTransitionsType(searchParams.get(typeName), defaultType);
  const [id] = useState(() => `widget-chart-${v4()}`);

  // change type, reset
  const { addParam, removeParam } = useQueryString(searchParams);
  const handleChange = (next: EChartTransitionsType) => {
    // replace, not push — a chart toggle shouldn't add a history entry
    router.replace(`${pathname}?${addParam(typeName, next)}`, { scroll: false });
  };
  const handleReset = () => {
    router.replace(`${pathname}?${removeParam(typeName)}`, { scroll: false });
  };

  // create
  const { width, height, start } = useResizeObserver(ref, 100);
  const create = useCallback(() => {
    if (!ref.current) return;
    setChart(ChartTransitionsCreate(ref, id, data, legend, type, formatValue));
  }, [id, type, data, legend]);
  // resize
  useEffect(() => {
    if (!ref.current || width <= 0 || height <= 0) return;
    if (start) {
      chart?.remove();
      setChart(null);
      ref.current.replaceChildren();
      return;
    }
    // `!chart` keeps this idempotent: the effect re-runs when setChart lands,
    // and without the guard that second pass would stack another chart
    if (!chart && !loading) create();
  }, [start, width, height, chart, loading, create]);
  // update
  useEffect(() => {
    if (chart) chart.update(data, type);
  }, [chart, type, data]);
  // teardown — the chart owns a tooltip node on <body> that React won't clean up
  const chartRef = useRef<IChartTransitions | null>(null);
  useEffect(() => {
    chartRef.current = chart;
  }, [chart]);
  useEffect(() => {
    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, []);

  return (
    <Widget variant="background" {...rest}>
      <WidgetHeader variant="padding" separator>
        <WidgetIcon>
          <Activity />
        </WidgetIcon>
        <WidgetTitle>{title ?? 'activity'}</WidgetTitle>
        <WidgetButtons>
          <TooltipText title="stacked bar chart" side="top">
            <Button
              variant={type === EChartTransitionsType.stackedBarChart ? 'ghost-primary' : 'ghost'}
              size="icon"
              onClick={() => handleChange(EChartTransitionsType.stackedBarChart)}
            >
              <ChartColumnStacked />
            </Button>
          </TooltipText>
          <TooltipText title="grouped bar chart" side="top">
            <Button
              variant={type === EChartTransitionsType.groupedBarChart ? 'ghost-primary' : 'ghost'}
              size="icon"
              onClick={() => handleChange(EChartTransitionsType.groupedBarChart)}
            >
              <ChartColumn />
            </Button>
          </TooltipText>
          <TooltipText title="area chart" side="top">
            <Button
              variant={type === EChartTransitionsType.areaChart ? 'ghost-primary' : 'ghost'}
              size="icon"
              onClick={() => handleChange(EChartTransitionsType.areaChart)}
            >
              <ChartSpline />
            </Button>
          </TooltipText>
          <TooltipText title="stacked area chart" side="top">
            <Button
              variant={type === EChartTransitionsType.stackedAreaChart ? 'ghost-primary' : 'ghost'}
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
      <WidgetContent variant="padding" className="overflow-hidden">
        <div className="w-full h-full relative">
          {/* d3 owns this node exclusively — keep React children out of it,
              replaceChildren() would otherwise desync the virtual DOM */}
          <div ref={ref} className="w-full h-full" />
          {loading && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Spinner className="text-[2rem] text-muted-foreground" />
            </div>
          )}
        </div>
      </WidgetContent>
    </Widget>
  );
};
