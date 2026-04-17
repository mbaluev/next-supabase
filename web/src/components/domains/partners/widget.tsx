'use client';

import { BriefcaseBusiness } from 'lucide-react';
import { PartnersList } from '@/components/domains/partners/list';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';

export const WidgetPartners = (props: WidgetProps) => {
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="background" separator>
        <WidgetIcon>
          <BriefcaseBusiness />
        </WidgetIcon>
        <WidgetTitle>partners</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding">
        <PartnersList />
      </WidgetContent>
    </Widget>
  );
};
