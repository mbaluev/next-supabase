'use client';

import { MOCK_LOAD_DELAY } from '@/utils/mock';
import { IListLoad } from '@/components/debug/list-load/types';
import { mock_list_load } from '@/components/debug/list-load/mock';

const load_delay = MOCK_LOAD_DELAY;
const total_rows = 200;

export const fetch_server_page = async (limit: number, offset: number = 0): Promise<IListLoad> => {
  if (offset * limit >= total_rows) return { rows: [], nextOffset: undefined };
  const rows = new Array(limit).fill(0).map((_, i) => mock_list_load(i + offset * limit));
  await new Promise((r) => setTimeout(r, load_delay));
  return { rows, nextOffset: offset + 1 };
};
