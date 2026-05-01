'use client';

import { useMemo } from 'react';
import { VirtualizeWindow } from '@/components/layout/virtualize';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import { MOCK_LIMIT, MOCK_LOAD_DELAY } from '@/utils/mock';

const page_size = MOCK_LIMIT;
const load_delay = MOCK_LOAD_DELAY;
const total_rows = 200;

const queryClient = new QueryClient();

interface fetchResult {
  rows: Array<string>;
  nextOffset?: number;
}
async function fetchServerPage(limit: number, offset: number = 0): Promise<fetchResult> {
  if (offset * limit >= total_rows) return { rows: [], nextOffset: undefined };
  const rows = new Array(limit).fill(0).map((_, i) => `async loaded row #${i + offset * limit}`);
  await new Promise((r) => setTimeout(r, load_delay));
  return { rows, nextOffset: offset + 1 };
}

export const ListLoadContent = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['list-load'],
    queryFn: (ctx) => fetchServerPage(page_size, ctx.pageParam),
    getNextPageParam: (lastGroup) => lastGroup.nextOffset,
    initialPageParam: 0,
  });
  const _data = useMemo(() => data?.pages.flatMap((d) => d.rows), [data]);
  return (
    <VirtualizeWindow
      data={_data}
      loading={isLoading || isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      overscan={page_size}
      // renderRow={(item: any) => <div>{JSON.stringify(item)}</div>}
    />
  );
};

export const ListLoad = () => (
  <QueryClientProvider client={queryClient}>
    <ListLoadContent />
  </QueryClientProvider>
);
