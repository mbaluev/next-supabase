'use client';

import { CSSProperties, ReactElement, useEffect, useRef } from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

type IVirtualizeWindowProps<T> = {
  data?: T[];
  overscan?: number;
  loading?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => Promise<any>;
  renderRow?: (item: T, index: number) => ReactElement;
  renderSkeleton?: ReactElement;
  renderNoData?: ReactElement;
};
const VirtualizeWindow = <T,>(props: IVirtualizeWindowProps<T>) => {
  const {
    data = [],
    loading,
    hasNextPage,
    fetchNextPage,
    overscan = 5,
    renderRow,
    renderSkeleton,
    renderNoData,
  } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const t = (value: string) => value;

  const is_extra_item = loading || data.length === 0;
  const virtualize = useWindowVirtualizer({
    count: is_extra_item ? data.length + 1 : data.length,
    overscan,
    estimateSize: () => 0,
    scrollMargin: ref.current?.offsetTop ?? 0,
  });
  const virtual_items = virtualize.getVirtualItems();
  useEffect(() => {
    const [last] = [...virtual_items].reverse();
    if (!last) return;
    if (last.index >= data.length - 1 && hasNextPage && !loading && fetchNextPage) {
      queueMicrotask(async () => {
        await fetchNextPage();
      });
    }
  }, [data.length, fetchNextPage, hasNextPage, loading, virtual_items]);

  const styleParent: CSSProperties = { height: virtualize.getTotalSize() };
  const styleGrid: CSSProperties = {
    transform: `translateY(${virtual_items[0]?.start - virtualize.options.scrollMargin}px)`,
  };

  return (
    <div ref={ref} style={styleParent} className="w-full relative">
      <div style={styleGrid} className="absolute top-0 left-o w-full">
        {virtual_items.map((virtual_item, index) => {
          const is_extra_row = virtual_item.index > data.length - 1;
          const item = data?.[virtual_item.index] as T;
          return (
            <div
              key={virtual_item.key}
              data-index={virtual_item.index}
              ref={virtualize.measureElement}
            >
              {is_extra_row && loading && <>{renderSkeleton || t('loading')}</>}
              {is_extra_row && !loading && <>{renderNoData || t('no-data')}</>}
              {!is_extra_row && (renderRow ? renderRow(item, index) : `row ${virtual_item.index}`)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { VirtualizeWindow };
export type { IVirtualizeWindowProps };
