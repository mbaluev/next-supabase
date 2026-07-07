import { guid } from '@/utils/guid';
import { TListStaticItem } from '@/components/debug/list-static/types';

export const mock_list_static = (index?: number): TListStaticItem => {
  const _index = index ?? 0;
  return {
    id: guid(),
    name: `name ${_index + 1}`,
    index: _index,
  };
};
