'use client';

import { DependencyList, useEffect, useRef, useState } from 'react';
import { useWindowResize } from '@/hooks/use-window-resize';

export const useEllipsis = (dependencies?: DependencyList) => {
  const _dependencies = dependencies ?? [];
  const ref = useRef(null);
  const [ellipsis, setEllipsis] = useState<boolean>(false);
  const windowSize = useWindowResize();
  const isEllipsis = (event: any) => (event ? event.offsetWidth < event.scrollWidth : false);
  useEffect(() => {
    if (isEllipsis(ref.current)) setEllipsis(true);
    else setEllipsis(false);
  }, [windowSize.width, isEllipsis, ..._dependencies]);
  return { ref, ellipsis, setEllipsis };
};
