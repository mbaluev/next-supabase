'use client';

import { WidgetProfile } from '@/components/domains/profile/widget';
import { ChartMatrix } from '@/components/charts/matrix';

const ProfilePage = () => {
  return (
    <div className="w-full @container/profile">
      <div className="w-full flex flex-col gap-4">
        <WidgetProfile />
        <ChartMatrix className="h-100" />
      </div>
    </div>
  );
};

export default ProfilePage;
