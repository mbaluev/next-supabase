'use client';

import { useMemo } from 'react';
import { VirtualizeWindow } from '@/components/layout/virtualize';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import { MOCK_LIMIT } from '@/utils/mock';
import { fetch_server_page } from '@/components/debug/list-load/fetch';

const page_size = MOCK_LIMIT;
const queryClient = new QueryClient();

export const ListLoadContent = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['list-load'],
    queryFn: (ctx) => fetch_server_page(page_size, ctx.pageParam),
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
      renderRow={(item: any) => <div className="py-1">{JSON.stringify(item)}</div>}
    />
  );
};
export const ListLoad = () => (
  <QueryClientProvider client={queryClient}>
    <ListLoadContent />
  </QueryClientProvider>
);
