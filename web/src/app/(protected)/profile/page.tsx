'use client';

import { WidgetProfile } from '@/components/domains/profile/widget';
import { ChartTransitions } from '@/components/charts/transitions';

const ProfilePage = () => {
  return (
    <div className="w-full @container/profile">
      <div className="w-full grid grid-cols-1 gap-4">
        <WidgetProfile />
        <ChartTransitions name="d1" className="h-100" />
      </div>
    </div>
  );
};

export default ProfilePage;
