'use client';

import { useMemo } from 'react';
import { VirtualizeWindow } from '@/components/layout/virtualize';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';

const page_size = 20;
const total_rows = 200;
const load_delay = 500;

async function fetchServerPage(
  limit: number,
  offset: number = 0
): Promise<{ rows: Array<string>; nextOffset?: number }> {
  if (offset * limit >= total_rows) return { rows: [], nextOffset: undefined };
  const rows = new Array(limit).fill(0).map((_, i) => `async loaded row #${i + offset * limit}`);
  await new Promise((r) => setTimeout(r, load_delay));
  return { rows, nextOffset: offset + 1 };
}

export const UsersListContent = () => {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['projects'],
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

const queryClient = new QueryClient();
export const UsersList = () => (
  <QueryClientProvider client={queryClient}>
    <UsersListContent />
  </QueryClientProvider>
);
