'use client';

import { mockArray } from '@/utils/mock';
import { mockPartner } from '@/components/domains/partners/mock';
import { VirtualizeWindow } from '@/components/layout/virtualize';

export const PartnersList = () => {
  return (
    <VirtualizeWindow
      data={mockArray(mockPartner, 1000)}
      renderRow={(item: any) => <div className="py-1">{JSON.stringify(item)}</div>}
      overscan={10}
    />
  );
};
