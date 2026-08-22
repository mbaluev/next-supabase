import { MessageSquare } from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';

export const WidgetTcpInput = (props: WidgetProps) => {
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="padding" separator>
        <WidgetIcon>
          <MessageSquare />
        </WidgetIcon>
        <WidgetTitle>input</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding" className="space-y-4">
        ...
      </WidgetContent>
    </Widget>
  );
};
