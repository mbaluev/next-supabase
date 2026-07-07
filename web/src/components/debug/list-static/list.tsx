'use client';

import { mock_array } from '@/utils/mock';
import { mock_list_static } from '@/components/debug/list-static/mock';
import { VirtualizeWindow } from '@/components/layout/virtualize';

export const ListStatic = () => {
  return (
    <VirtualizeWindow
      data={mock_array(mock_list_static, 1000)}
      renderRow={(item: any) => <div className="py-1">{JSON.stringify(item)}</div>}
      overscan={10}
    />
  );
};
