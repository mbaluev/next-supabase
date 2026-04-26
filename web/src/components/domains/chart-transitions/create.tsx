import * as d3 from 'd3';
import moment from 'moment/moment';
import { RefObject } from 'react';
import { JetBrains_Mono } from 'next/font/google';
import {
  EChartTransitionsType,
  IChartTransitionsItem,
  IChartTransitionsLegend,
} from '@/components/domains/chart-transitions/mock';
import {
  get_chart_transitions_fill_color,
  get_chart_transitions_stroke_color,
} from '@/components/domains/chart-transitions/colors';

const font = JetBrains_Mono({ subsets: ['latin'] });

export const ChartTransitionsCreate = (
  ref: RefObject<any>,
  id: string,
  data: IChartTransitionsItem[],
  legend: IChartTransitionsLegend[],
  type: string,
  formatValue: (value: any) => string
) => {
  const idTooltip = `${id}-tooltip`;

  // props
  const lang = 'en';
  const duration = 300;
  const opacityHover = 0.5;
  const opacityRect = 1;
  const opacityArea = 1;
  const opacityLine = 1;
  const opacityDots = 1;
  const strokeWidth = 2;
  const strokeColor = 'stroke-gray-500';
  const tooltipThreshold = 20;
  const tooltipPadding = 5;
  const paddingRect = 0.5;
  const xTickPadding = -15;

  // init
  let dims: any = undefined;
  let margin: any = undefined;
  let svg: any = undefined;
  function remove() {
    d3.selectAll(`#${id}`).remove();
  }
  function init() {
    remove();

    // declare the chart dimensions and _margins.
    dims = { width: ref.current.clientWidth, height: ref.current.clientHeight };
    margin = { top: 0, right: 0, bottom: 10, left: 0 };

    // create the SVG container.
    svg = d3
      .select(ref.current)
      .append('svg')
      .attr('id', id)
      .attr('viewBox', [0, 0, dims.width, dims.height] as any);
  }

  // data
  let _keys: string[] = [];
  let _names: string[] = [];
  let _grouped: Record<string, any>[] = [];
  let _stacked: Record<string, any>[][] = [];
  let _area_1: Record<string, any>[][] = [];
  let _area_2: Record<string, any>[][] = [];
  let _line: Record<string, any>[][] = [];
  let _dots: Record<string, any>[][] = [];
  let y_max_grouped = 0;
  let y_min_grouped = 0;
  let y_max_stacked = 0;
  let y_min_stacked = 0;
  function calcData(_data: IChartTransitionsItem[]) {
    const _data1 = [..._data].map((d) => {
      const _d = { ...d };
      _d.a = _d.a > 0 ? _d.a : 0;
      _d.b = _d.b > 0 ? _d.b : 0;
      _d.c = _d.c > 0 ? _d.c : 0;
      return _d;
    });
    const _data2 = [..._data].map((d) => {
      const _d = { ...d };
      _d.a = _d.a < 0 ? _d.a : 0;
      _d.b = _d.b < 0 ? _d.b : 0;
      _d.c = _d.c < 0 ? _d.c : 0;
      return _d;
    });

    _keys = legend.map((d) => d.key);
    _names = d3.map(_data, (d) => d.date);

    // data
    const mapData = (d1: any) => {
      const index = d1.index;
      const key = d1.key;
      d1.forEach((d2: any) => {
        d2.data = { ...d2.data, ...{ index, key } };
      });
      return d1;
    };
    _grouped = _data.map((d) => {
      const _d: any = { data: d.date };
      _keys.forEach((_key: any) => (_d[_key] = d[_key]));
      return _d;
    });
    _stacked = d3
      .stack()
      .keys(_keys)
      .offset(d3.stackOffsetDiverging)(_data ?? [])
      .map(mapData);
    _area_1 = d3
      .stack()
      .keys(_keys)(_data1 ?? [])
      .map(mapData);
    _area_2 = d3
      .stack()
      .keys(_keys)(_data2 ?? [])
      .map(mapData);
    _line = _stacked.map((d: any) => {
      const new_d = d.map((d1: any) => {
        const new_d1: any = [d1.data[d.key]];
        new_d1.data = d1.data;
        return new_d1;
      });
      new_d.index = d.index;
      new_d.key = d.key;
      return new_d;
    });
    // _voronoi = [..._stacked].reduce((prev: any[], curr: any[]) => prev.concat(curr), []);

    // min, max grouped
    const _max_gr = d3.max(_grouped, (d) => d3.max(Object.values(d).filter((d1) => !isNaN(d1))));
    const _min_gr = d3.min(_grouped, (d) => d3.min(Object.values(d).filter((d1) => !isNaN(d1))));
    y_max_grouped = Math.max(_max_gr, 0);
    y_min_grouped = Math.min(_min_gr, 0);

    // min, max stacked
    const _max_st = d3.max(_stacked, (d) =>
      d3.max(d, (d2) => d3.max(Object.values(d2).filter((d4) => !isNaN(d4))))
    );
    const _min_st = d3.min(_stacked, (d) =>
      d3.min(d, (d2) => d3.min(Object.values(d2).filter((d4) => !isNaN(d4))))
    );
    y_max_stacked = Math.max(_max_st, 0);
    y_min_stacked = Math.min(_min_st, 0);
  }

  // scales
  let x: any = undefined;
  let y: any = undefined;
  let z: any = undefined;
  function scales() {
    // declare the x (horizontal position) scale.
    x = d3
      .scaleBand()
      .domain(_names)
      .range([margin.left, dims.width - margin.right])
      .padding(paddingRect);

    // declare the y (vertical position) scale.
    let y_min = y_min_grouped;
    let y_max = y_max_grouped;
    if (
      type === EChartTransitionsType.stackedBarChart ||
      type === EChartTransitionsType.stackedAreaChart
    ) {
      y_min = y_min_stacked;
      y_max = y_max_stacked;
    }
    y = d3
      .scaleLinear()
      .domain([y_min, y_max])
      .range([dims.height - margin.bottom, margin.top]);

    z = d3.scaleOrdinal().range(legend.map((d) => d.color));
  }

  // x-axis
  let xscale: any = undefined;
  let xaxis: any = undefined;
  let xticks: any = undefined;
  function drawXAxis() {
    xscale = d3
      .axisBottom(x)
      .tickSizeOuter(0)
      .tickFormat((d: any) => {
        const format = new Intl.DateTimeFormat(lang, { month: 'short' });
        const month = moment(d).month();
        const date = new Date(Date.UTC(2000, month, 1, 0, 0, 0));
        return format.format(date);
      });

    xaxis = svg.append('g').attr('transform', `translate(0, ${y(0)})`);

    let y_min = y_min_grouped;
    if (
      type === EChartTransitionsType.stackedBarChart ||
      type === EChartTransitionsType.stackedAreaChart
    )
      y_min = y_min_stacked;

    xticks = xaxis.call(xscale);
    xticks
      .selectAll('text')
      .attr('transform', `translate(0,${Math.abs(y(0) - y(y_min) + xTickPadding)})`)
      .attr('font-family', font.style.fontFamily);
    xticks.selectAll('line').attr('class', strokeColor);
    xaxis.selectAll('path').attr('class', strokeColor);
  }
  function updateXAxis(layout: string) {
    xaxis
      .transition()
      .duration(duration)
      .attr('transform', `translate(0, ${y(0)})`);
    if (
      layout === EChartTransitionsType.stackedBarChart ||
      layout === EChartTransitionsType.stackedAreaChart
    ) {
      xticks
        .selectAll('text')
        .transition()
        .duration(duration)
        .attr('transform', `translate(0,${Math.abs(y(0) - y(y_min_stacked) + xTickPadding)})`);
    }
    if (
      layout === EChartTransitionsType.groupedBarChart ||
      layout === EChartTransitionsType.areaChart ||
      layout === EChartTransitionsType.lineChart
    ) {
      xticks
        .selectAll('text')
        .transition()
        .duration(duration)
        .attr('transform', `translate(0,${Math.abs(y(0) - y(y_min_grouped) + xTickPadding)})`);
    }
    xaxis.selectAll('path').attr('class', strokeColor);
  }

  // y-axis
  function updateYAxis(layout: string) {
    if (
      layout === EChartTransitionsType.stackedBarChart ||
      layout === EChartTransitionsType.stackedAreaChart
    ) {
      y.domain([y_min_stacked, y_max_stacked]);
    }
    if (
      layout === EChartTransitionsType.groupedBarChart ||
      layout === EChartTransitionsType.areaChart ||
      layout === EChartTransitionsType.lineChart
    ) {
      y.domain([y_min_grouped, y_max_grouped]);
    }
  }

  // groups
  let groups: any = undefined;
  let group: any = undefined;
  function drawGroups() {
    groups = svg.append('g').attr('class', 'groups');
    group = groups
      .selectAll('g')
      .data(_stacked)
      .join('g')
      .attr('class', (d: any) => `group ${get_chart_transitions_fill_color(z(d.key))}`);
  }
  function updateGroups() {
    group.data(_stacked);
  }

  // x-functions
  const xGrouped = (d: any) => {
    const value = x(d.data.date) as number;
    return value + (x.bandwidth() / _keys.length) * d.data.index;
  };
  const xStacked = (d: any) => x(d.data.date);

  // y-functions rect
  const yGrouped = (d: any) => (d[0] < 0 ? y(0) : y(d[1] - d[0]));
  const yStacked = (d: any) => y(d[1]);

  // x,y-functions line
  const xCurve = (d: any) => (x(d.data.date) as number) + x.bandwidth() / 2;
  const yCurve = (d: any) => y(d[0]);

  // y-functions area
  const y0Stacked = (d: any) => y(d[0]);
  const y1Stacked = (d: any) => y(d[1]);
  const y0Grouped = () => y(0);
  const y1Grouped = (d: any) => y(d[1] - d[0]);

  // width-functions
  const widthGrouped = () => x.bandwidth() / _keys.length;
  const widthStacked = () => x.bandwidth();

  // height-functions
  const heightBar = (d: any) => Math.abs(y(d[0]) - y(d[1]));

  // rect
  let rect: any = undefined;
  function drawRect(layout: string) {
    rect = group
      .selectAll('rect')
      .data((d: any) => d)
      .join('rect')
      .attr('opacity', 1e-6);
    // .attr('y', y(0))
    if (layout === EChartTransitionsType.groupedBarChart) {
      rect.attr('y', yGrouped).attr('height', heightBar);
      rect.attr('x', xGrouped).attr('width', widthGrouped());
      rect.transition().duration(duration).attr('opacity', opacityRect);
    }
    if (layout === EChartTransitionsType.stackedBarChart) {
      rect.attr('y', yStacked).attr('height', heightBar);
      rect.attr('x', xStacked).attr('width', widthStacked());
      rect.transition().duration(duration).attr('opacity', opacityRect);
    }
  }
  function removeRect() {
    rect?.transition().duration(duration).attr('opacity', 1e-6).remove();
  }
  function updateRect() {
    rect = group.selectAll('rect').data((d: any) => d);
  }
  function updateRectStacked() {
    rect
      .transition()
      .duration(duration)
      .attr('y', yStacked)
      .attr('height', heightBar)
      .transition()
      .duration(duration)
      .attr('x', xStacked)
      .attr('width', widthStacked())
      .attr('opacity', opacityRect);
  }
  function updateRectStackedY() {
    rect
      .transition()
      .duration(duration)
      .attr('y', yStacked)
      .attr('height', heightBar)
      .attr('opacity', opacityRect);
  }
  function updateRectGrouped() {
    rect
      .transition()
      .duration(duration)
      .attr('x', xGrouped)
      .attr('width', widthGrouped())
      .transition()
      .duration(duration)
      .attr('y', yGrouped)
      .attr('height', heightBar)
      .attr('opacity', opacityRect);
  }
  function updateRectGroupedY() {
    rect
      .transition()
      .duration(duration)
      .attr('y', yGrouped)
      .attr('height', heightBar)
      .attr('opacity', opacityRect);
  }

  // area
  let areas1: any = undefined;
  let areas2: any = undefined;
  let areaFunc: any = undefined;
  let areaPaths1: any = undefined;
  let areaPaths2: any = undefined;
  function drawAreas() {
    areas1 = svg.append('g').attr('class', 'areas');
    areas2 = svg.append('g').attr('class', 'areas');
    areaFunc = d3.area().curve(d3.curveBumpX).x(xCurve);
  }
  function drawArea(layout: string) {
    const isAreaGrouped = layout === EChartTransitionsType.areaChart;
    const isAreaStacked = layout === EChartTransitionsType.stackedAreaChart;
    const isArea = isAreaGrouped || isAreaStacked;
    if (isArea) {
      areaFunc.y0(y(0)).y1(y(0));
      if (isAreaGrouped) areaFunc.y0(y0Grouped).y1(y1Grouped);
      if (isAreaStacked) areaFunc.y0(y0Stacked).y1(y1Stacked);
      areaPaths1 = areas1
        .selectAll('path')
        .data(_area_1)
        .join('path')
        .attr('class', (d: any) => get_chart_transitions_fill_color(z(d.key)))
        .attr('opacity', 1e-6)
        .attr('d', areaFunc);
      areaPaths2 = areas2
        .selectAll('path')
        .data(_area_2)
        .join('path')
        .attr('class', (d: any) => get_chart_transitions_fill_color(z(d.key)))
        .attr('opacity', 1e-6)
        .attr('d', areaFunc);
      areaPaths1.transition().duration(duration).attr('opacity', opacityArea);
      areaPaths2.transition().duration(duration).attr('opacity', opacityArea);
    }
  }
  function removeArea() {
    areaPaths1?.transition().duration(duration).attr('opacity', 1e-6).remove();
    areaPaths2?.transition().duration(duration).attr('opacity', 1e-6).remove();
  }
  function updateAreaStacked() {
    areaFunc.y0(y0Stacked).y1(y1Stacked);
    areaPaths1.data(_area_1);
    areaPaths1.transition().duration(duration).attr('d', areaFunc).attr('opacity', opacityArea);
    areaPaths2.data(_area_2);
    areaPaths2.transition().duration(duration).attr('d', areaFunc).attr('opacity', opacityArea);
  }
  function updateAreaGrouped() {
    areaFunc.y0(y0Grouped).y1(y1Grouped);
    areaPaths1.data(_area_1);
    areaPaths1.transition().duration(duration).attr('d', areaFunc).attr('opacity', opacityArea);
    areaPaths2.data(_area_2);
    areaPaths2.transition().duration(duration).attr('d', areaFunc).attr('opacity', opacityArea);
  }

  // line
  let lines: any = undefined;
  let line: any = undefined;
  let linePaths: any = undefined;
  function drawLines() {
    lines = svg.append('g').attr('class', 'lines');
    line = d3.line().curve(d3.curveBumpX).x(xCurve).y(yCurve);
  }
  function drawLine(layout: string) {
    const isLineGrouped = layout == EChartTransitionsType.lineChart;
    line.y(y(0));
    line.y(yCurve);
    linePaths = lines
      .selectAll('path')
      .data(_line)
      .join('path')
      .attr('class', (d: any) => get_chart_transitions_stroke_color(z(d.key)))
      .attr('stroke-width', strokeWidth)
      .attr('fill', 'none')
      .attr('opacity', 1e-6)
      .attr('d', line);
    if (isLineGrouped) {
      linePaths.transition().duration(duration).attr('opacity', opacityLine);
    }
  }
  function removeLine() {
    linePaths?.transition().duration(duration).attr('opacity', 1e-6).remove();
  }
  function updateLine() {
    linePaths.data(_line).attr('stroke-width', strokeWidth);
  }
  function updateLineGrouped() {
    line.y(yCurve);
    linePaths.transition().duration(duration).attr('d', line).attr('opacity', opacityLine);
  }

  // dots
  let dots: any = undefined;
  let dot: any = undefined;
  let dotLine: any = undefined;
  function drawDots() {
    dots = svg.append('g').attr('class', 'dots');
    dotLine = dots.append('line').attr('class', strokeColor).attr('opacity', 0);
  }
  function calcDot(item?: any) {
    _dots = [];
    _keys.forEach((_key: any, _i: number, _arr: any[]) => {
      let _value = item[_key];
      if (type === EChartTransitionsType.stackedAreaChart) {
        const _k = item[_key] < 0 ? -1 : 1;
        _value = _arr.reduce(
          (prev: number, curr: any, i: number) =>
            prev + (i <= _i && item[curr] / _k > 0 ? item[curr] : 0),
          0
        );
      }
      const _dot: any = [_value];
      _dot.key = _key;
      _dot.data = item;
      _dots.push(_dot);
    });
  }
  function drawDot() {
    dot = dots
      .selectAll('circle')
      .data(_dots)
      .join('circle')
      .attr('class', (d: any) => `fill-${z(d.key)}`)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('r', 3)
      .attr('cx', xCurve)
      .attr('cy', yCurve)
      .attr('opacity', opacityDots);
  }
  function removeDot() {
    dot?.remove();
  }

  function drawDotLine(item: any) {
    dotLine.attr('opacity', 1);
    if (type === EChartTransitionsType.areaChart || type === EChartTransitionsType.lineChart) {
      dotLine.attr('y1', y(y_min_grouped));
      dotLine.attr('y2', y(y_max_grouped));
    }
    if (type === EChartTransitionsType.stackedAreaChart) {
      dotLine.attr('y1', y(y_min_stacked));
      dotLine.attr('y2', y(y_max_stacked));
    }
    dotLine
      .attr('opacity', 1)
      .attr('x1', x(item.date) + x.bandwidth() / 2)
      .attr('x2', x(item.date) + x.bandwidth() / 2);
  }
  function removeDotLine() {
    dotLine?.attr('opacity', 1e-6);
  }

  // change
  let prevType = type;
  function changeBarStacked(layout: string, prevLayout: string) {
    switch (prevLayout) {
      case EChartTransitionsType.stackedBarChart:
        updateRectStackedY();
        break;
      case EChartTransitionsType.groupedBarChart:
        updateRectStacked();
        break;
      case EChartTransitionsType.stackedAreaChart:
        removeArea();
        drawRect(layout);
        break;
      case EChartTransitionsType.areaChart:
        removeArea();
        drawRect(layout);
        break;
      case EChartTransitionsType.lineChart:
        removeLine();
        drawRect(layout);
    }
  }
  function changeBarGrouped(layout: string, prevLayout: string) {
    switch (prevLayout) {
      case EChartTransitionsType.stackedBarChart:
        updateRectGrouped();
        break;
      case EChartTransitionsType.groupedBarChart:
        updateRectGroupedY();
        break;
      case EChartTransitionsType.stackedAreaChart:
        removeArea();
        drawRect(layout);
        break;
      case EChartTransitionsType.areaChart:
        removeArea();
        drawRect(layout);
        break;
      case EChartTransitionsType.lineChart:
        removeLine();
        drawRect(layout);
        break;
    }
  }
  function changeAreaStacked(layout: string, prevLayout: string) {
    switch (prevLayout) {
      case EChartTransitionsType.stackedBarChart:
        removeRect();
        drawArea(layout);
        break;
      case EChartTransitionsType.groupedBarChart:
        removeRect();
        drawArea(layout);
        break;
      case EChartTransitionsType.stackedAreaChart:
        updateAreaStacked();
        break;
      case EChartTransitionsType.areaChart:
        updateAreaStacked();
        break;
      case EChartTransitionsType.lineChart:
        removeLine();
        drawArea(EChartTransitionsType.stackedAreaChart);
        break;
    }
  }
  function changeAreaGrouped(layout: string, prevLayout: string) {
    switch (prevLayout) {
      case EChartTransitionsType.stackedBarChart:
        removeRect();
        drawArea(layout);
        break;
      case EChartTransitionsType.groupedBarChart:
        removeRect();
        drawArea(layout);
        break;
      case EChartTransitionsType.stackedAreaChart:
        updateAreaGrouped();
        break;
      case EChartTransitionsType.areaChart:
        updateAreaGrouped();
        break;
      case EChartTransitionsType.lineChart:
        removeLine();
        drawArea(layout);
        break;
    }
  }
  function changeLine(layout: string, prevLayout: string) {
    switch (prevLayout) {
      case EChartTransitionsType.stackedBarChart:
        removeRect();
        drawLine(layout);
        break;
      case EChartTransitionsType.groupedBarChart:
        removeRect();
        drawLine(layout);
        break;
      case EChartTransitionsType.stackedAreaChart:
        removeArea();
        drawLine(layout);
        break;
      case EChartTransitionsType.areaChart:
        removeArea();
        drawLine(layout);
        break;
      case EChartTransitionsType.lineChart:
        updateLineGrouped();
        break;
    }
  }
  function change(layout: string, prevLayout: string) {
    type = layout;
    switch (layout) {
      case EChartTransitionsType.stackedBarChart:
        changeBarStacked(layout, prevLayout);
        break;
      case EChartTransitionsType.groupedBarChart:
        changeBarGrouped(layout, prevLayout);
        break;
      case EChartTransitionsType.stackedAreaChart:
        changeAreaStacked(layout, prevLayout);
        break;
      case EChartTransitionsType.areaChart:
        changeAreaGrouped(layout, prevLayout);
        break;
      case EChartTransitionsType.lineChart:
        changeLine(layout, prevLayout);
        break;
    }
    prevType = layout;
  }

  // tooltip
  let tooltipElem: any = undefined;
  function tooltip() {
    d3.selectAll(`#${idTooltip}`).remove();
    tooltipElem = d3
      .select('body')
      .append('div')
      .attr('id', idTooltip)
      .attr(
        'class',
        'absolute flex flex-col w-[200px] px-4 py-2 gap-4 rounded-md border bg-foreground text-background hidden'
      );
  }
  function renderTooltip(item: any) {
    const format = new Intl.DateTimeFormat(lang, { month: 'long' });
    const month = moment(item.date).month();
    const year = moment(item.date).year();
    const date = new Date(Date.UTC(2000, month, 1, 0, 0, 0));
    const label = format.format(date);
    const html = `<div class="">${label} ${year}</div>
      <div class="flex flex-col">
      ${_keys
        .map((_key) => {
          const color = legend.find((d) => d.key === _key)?.color;
          return `<div class="flex justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-3 h-3 rounded-full bg-${color}"></div>
                      <div class="">${_key}</div>
                    </div>
                    <div class="">${formatValue(item[_key])}</div>
                  </div>`;
        })
        .join('')}
      </div>`;
    tooltipElem.style('display', 'flex').html(html);
  }
  function showTooltip(item: any) {
    const elemTooltip = document.getElementById(idTooltip);
    const elemSvg = document.getElementById(id);
    const bodyRect = document.body.getBoundingClientRect();
    if (item && elemSvg && elemTooltip) {
      const elemRect = elemSvg.getBoundingClientRect();
      const elemTRect = elemTooltip.getBoundingClientRect();
      const offsetY = elemRect.top - bodyRect.top;
      const offsetX = elemRect.left - bodyRect.left;

      const tooltipY = offsetY - tooltipPadding;
      let tooltipX = offsetX + x(item.date) + x.bandwidth() + tooltipPadding;
      if (tooltipX + elemTRect.width > bodyRect.right - tooltipThreshold)
        tooltipX = offsetX + x(item.date) - elemTRect.width - tooltipPadding;
      if (tooltipX < tooltipThreshold) tooltipX = tooltipThreshold;

      renderTooltip(item);
      tooltipElem.style('left', `${tooltipX}px`).style('top', `${tooltipY}px`);
    }
  }
  function highlight(item?: any) {
    const isArea = type === EChartTransitionsType.areaChart;
    const isAreaStacked = type === EChartTransitionsType.stackedAreaChart;
    const isLine = type === EChartTransitionsType.lineChart;
    if (item) {
      rect.attr('opacity', (d: any) => (d.data.date === item.date ? opacityHover : opacityRect));
      if (isArea || isLine || isAreaStacked) drawDotLine(item);
      if (isArea || isLine || isAreaStacked) calcDot(item);
      if (isArea || isLine || isAreaStacked) drawDot();
    } else {
      rect.attr('opacity', opacityRect);
      removeDot();
      removeDotLine();
    }
  }

  // events
  function events() {
    function pointerMoved(event: any) {
      const [xm] = d3.pointer(event);
      const least = d3.least(data, (d: any) => {
        return Math.hypot((x(d.date) as number) + x.bandwidth() / 2 - xm, 0);
      });
      showTooltip(least);
      highlight(least);
    }
    function pointerEntered() {
      tooltipElem.style('display', 'flex');
    }
    function pointerLeft() {
      tooltipElem.style('display', 'none');
      highlight();
    }
    svg
      .attr('class', 'cursor-pointer')
      .on('pointerenter', pointerEntered)
      .on('pointermove', pointerMoved)
      .on('pointerleave', pointerLeft)
      .on('touchstart', (event: any) => event.preventDefault());
  }

  // create
  function create(data: any[], layout: string) {
    init();
    calcData(data);
    scales();
    drawGroups();
    drawRect(layout);
    drawAreas();
    drawArea(layout);
    drawLines();
    drawLine(layout);
    drawDots();
    tooltip();
    events();
  }
  function update(data: any[], layout: string) {
    calcData(data);
    updateYAxis(layout);
    updateGroups();
    updateRect();
    updateLine();
    change(layout, prevType);
  }
  create(data, type);

  return Object.assign(svg.node() || {}, { update, remove });
};
