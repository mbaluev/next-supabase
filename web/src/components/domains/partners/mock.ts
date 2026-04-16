import { guid } from '@/utils/guid';
import { TPartner } from '@/components/domains/partners/types';

export const mockPartner = (index?: number): TPartner => {
  const _index = index ?? 0;
  return {
    id: guid(),
    name: `name ${_index + 1}`,
    index: _index,
  };
};
