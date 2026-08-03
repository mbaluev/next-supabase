'use client';

import { useEffect, useRef } from 'react';
import { Binary, RefreshCw } from 'lucide-react';
import { useResizeObserver } from '@/hooks/use-resize-observer';
import { ChartMatrixCreate } from '@/components/charts/matrix/canvas';
import { Button } from '@/components/ui/button';
import {
  Widget,
  WidgetButtons,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';

interface IChartMatrixProps extends WidgetProps {}

export const ChartMatrix = (props: IChartMatrixProps) => {
  const ref = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ReturnType<typeof ChartMatrixCreate> | null>(null);
  const { width, height, start } = useResizeObserver(ref, 100);

  const handleReset = () => {
    if (engineRef.current && width > 0 && height > 0) {
      engineRef.current.clear();
      engineRef.current.resize(width, height);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = ChartMatrixCreate(canvasRef.current);
    engineRef.current = engine;
    engine.start();
    return () => engine.stop();
  }, []);

  useEffect(() => {
    if (engineRef.current && width > 0 && height > 0 && start) {
      engineRef.current.clear();
    }
    if (engineRef.current && width > 0 && height > 0 && !start) {
      engineRef.current.resize(width, height);
    }
  }, [width, height, start]);

  return (
    <Widget variant="default" {...props}>
      <WidgetHeader variant="padding" separator>
        <WidgetIcon>
          <Binary />
        </WidgetIcon>
        <WidgetTitle>matrix</WidgetTitle>
        <WidgetButtons>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RefreshCw />
          </Button>
        </WidgetButtons>
      </WidgetHeader>
      <WidgetContent variant="padding" className="overflow-hidden">
        <div ref={ref} className="relative h-full w-full mask-b-from-25%">
          <canvas ref={canvasRef} className="absolute h-full w-full" />
        </div>
      </WidgetContent>
    </Widget>
  );
};
