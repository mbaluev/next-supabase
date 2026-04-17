import { useEffect, useState } from 'react';

interface Dimensions {
  width: number;
  height: number;
  start: boolean;
}

export const useWindowResize = (ms?: number): Dimensions => {
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

  useEffect(() => {
    function handleResize() {
      start();
      _setWidth(window.innerWidth);
      _setHeight(window.innerHeight);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: _width,
    height: _height,
    start: _start,
  };
};
