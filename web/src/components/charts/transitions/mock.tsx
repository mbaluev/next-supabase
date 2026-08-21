import { randomInt } from '@/utils/random';
import moment from 'moment';

export enum EChartTransitionsType {
  stackedBarChart = 'bar-stacked',
  groupedBarChart = 'bar-grouped',
  areaChart = 'area',
  stackedAreaChart = 'area-stacked',
  lineChart = 'line',
}

export interface IChartTransitionsItem extends Record<string, any> {
  a: number;
  b: number;
  c: number;
  date: string;
}

export interface IChartTransitionsLegend {
  key: string;
  color: string;
}

const length = 75;

export const DEFAULT_CHART_TRANSITIONS_TYPE = EChartTransitionsType.stackedBarChart;

// the type is read from a user-editable query param, so it has to be checked
// against the enum before it reaches the chart — an unknown layout matches no
// branch in create.tsx's change() and leaves the chart stuck
export const parseChartTransitionsType = (
  value: string | null | undefined,
  fallback: EChartTransitionsType = DEFAULT_CHART_TRANSITIONS_TYPE
): EChartTransitionsType => {
  const types = Object.values(EChartTransitionsType) as string[];
  return value && types.includes(value) ? (value as EChartTransitionsType) : fallback;
};

export const MOCK_CHART_TRANSITIONS_DATA: IChartTransitionsItem[] = Array.from({ length }).map(
  (_, i) => {
    return {
      a: randomInt(-100000, 100000),
      b: randomInt(-100000, 100000),
      c: randomInt(-100000, 100000),
      date: moment({
        year: moment(new Date())
          .subtract(length - i - 1, 'months')
          .year(),
        month: moment(new Date())
          .subtract(length - i - 1, 'months')
          .month(),
      })
        .startOf('month')
        .format('YYYY-MM-DD'),
    };
  }
);

export const MOCK_CHART_TRANSITIONS_LEGEND: IChartTransitionsLegend[] = [
  {
    key: 'a',
    color: 'chart-1',
  },
  {
    key: 'b',
    color: 'chart-2',
  },
  {
    key: 'c',
    color: 'chart-3',
  },
];
