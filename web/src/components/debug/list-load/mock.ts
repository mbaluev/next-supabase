import { guid } from '@/utils/guid';
import { TListLoadItem } from '@/components/debug/list-load/types';

export const mock_list_load = (index?: number): TListLoadItem => {
  const _index = index ?? 0;
  return {
    id: guid(),
    name: `name ${_index + 1}`,
    index: _index,
  };
};
