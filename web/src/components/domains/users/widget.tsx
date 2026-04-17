'use client';

import { Users } from 'lucide-react';
import { UsersList } from '@/components/domains/users/list';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';

export const WidgetUsers = (props: WidgetProps) => {
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="background" separator>
        <WidgetIcon>
          <Users />
        </WidgetIcon>
        <WidgetTitle>users</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding">
        <UsersList />
      </WidgetContent>
    </Widget>
  );
};
