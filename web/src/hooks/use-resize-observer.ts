import { RefObject, useMemo, useEffect, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
  start: boolean;
}

export function useResizeObserver(
  ref: RefObject<HTMLElement | undefined>,
  ms?: number
): Dimensions {
  const [_width, _setWidth] = useState<number>(0);
  const [_height, _setHeight] = useState<number>(0);
  const [_start, _setStart] = useState<boolean>(false);

  let timer: NodeJS.Timeout;
  const start = () => {
    _setStart(true);
    if (timer) clearInterval(timer);
    timer = setInterval(finish, ms);
  };
  const finish = () => {
    _setStart(false);
  };

  const observer = useMemo(() => {
    if (typeof window !== 'undefined')
      return new ResizeObserver((entries) => {
        start();
        // Using the scrollWidth and scrollHeight of the target ensures this works with CSS transitions
        // because it accounts for the height of the content before it's visually fully expanded,
        // which elements[0].contentRect does not
        _setWidth(entries[0].target.scrollWidth);
        _setHeight(entries[0].target.scrollHeight);
      });
  }, []);

  useEffect(() => {
    if (ref.current && observer) {
      observer.observe(ref.current);
    }
  }, [observer, ref]);

  return {
    width: _width,
    height: _height,
    start: _start,
  };
}
