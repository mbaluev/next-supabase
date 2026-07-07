'use client';

import { ListStatic } from '@/components/debug/list-static/list';
import { ROUTES } from '@/settings/routes';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';

export const WidgetListStatic = (props: WidgetProps) => {
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="background" separator>
        <WidgetIcon>{ROUTES.DEBUG_LIST_STATIC.icon}</WidgetIcon>
        <WidgetTitle>{ROUTES.DEBUG_LIST_STATIC.label}</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding">
        <ListStatic />
      </WidgetContent>
    </Widget>
  );
};
