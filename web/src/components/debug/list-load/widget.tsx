'use client';

import { ListLoad } from '@/components/debug/list-load/list';
import { ROUTES } from '@/settings/routes';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';

export const WidgetListLoad = (props: WidgetProps) => {
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="background" separator>
        <WidgetIcon>{ROUTES.DEBUG_LIST_LOAD.icon}</WidgetIcon>
        <WidgetTitle>{ROUTES.DEBUG_LIST_LOAD.label}</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding">
        <ListLoad />
      </WidgetContent>
    </Widget>
  );
};
