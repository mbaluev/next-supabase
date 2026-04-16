'use client';

import { FolderClosed } from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';

export const WidgetFiles = (props: WidgetProps) => {
  const tasks = [] as any[];
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="padding" separator>
        <WidgetIcon>
          <FolderClosed />
        </WidgetIcon>
        <WidgetTitle>files</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding">
        {tasks?.map(({ _id, text }) => (
          <div key={_id} className="flex flex-row gap-4 py-1">
            <div>{_id}</div>
            <div>{text}</div>
          </div>
        ))}
      </WidgetContent>
    </Widget>
  );
};
