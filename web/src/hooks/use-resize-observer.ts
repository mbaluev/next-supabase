import { RefObject, useEffect, useRef, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
  start: boolean;
}

export function useResizeObserver(ref: RefObject<HTMLElement | null>, ms?: number): Dimensions {
  const [_width, _setWidth] = useState<number>(0);
  const [_height, _setHeight] = useState<number>(0);
  const [_start, _setStart] = useState<boolean>(false);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      _setStart(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => _setStart(false), ms);
      // Measured with client* rather than scroll* so the reported size matches
      // the box consumers draw into. Using scroll* lets the drawn content grow
      // the measured size, which feeds straight back into the observer.
      _setWidth(element.clientWidth);
      _setHeight(element.clientHeight);
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [ref, ms]);

  return {
    width: _width,
    height: _height,
    start: _start,
  };
}
