'use client';

export const ChartTransitionsColors = () => {
  return (
    <div className="hidden">
      <div className="bg-chart-1" />
      <div className="bg-chart-2" />
      <div className="bg-chart-3" />
      <div className="fill-[hsl(var(--chart-1))]" />
      <div className="fill-[hsl(var(--chart-2))]" />
      <div className="fill-[hsl(var(--chart-3))]" />
      <div className="stroke-[hsl(var(--chart-1))]" />
      <div className="stroke-[hsl(var(--chart-2))]" />
      <div className="stroke-[hsl(var(--chart-3))]" />
    </div>
  );
};

export const get_chart_transitions_fill_color = (color: string) => {
  if (color === 'chart-1') return 'fill-[hsl(var(--chart-1))]';
  if (color === 'chart-2') return 'fill-[hsl(var(--chart-2))]';
  if (color === 'chart-3') return 'fill-[hsl(var(--chart-3))]';
};

export const get_chart_transitions_stroke_color = (color: string) => {
  if (color === 'chart-1') return 'stroke-[hsl(var(--chart-1))]';
  if (color === 'chart-2') return 'stroke-[hsl(var(--chart-2))]';
  if (color === 'chart-3') return 'stroke-[hsl(var(--chart-3))]';
};
