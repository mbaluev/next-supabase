// The classes returned below are built at runtime and never appear literally in
// any source file, so they are kept alive by `@source inline(...)` in
// globals.css rather than by a hidden marker element in the tree.

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
