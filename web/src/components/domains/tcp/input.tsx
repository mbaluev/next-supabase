import { MessageSquare } from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';
import { WidgetTcpInputForm } from '@/components/domains/tcp/input-form';

export const WidgetTcpInput = (props: WidgetProps) => {
  return (
    <Widget variant="background" className="h-fit" {...props}>
      <WidgetHeader variant="background" separator>
        <WidgetIcon>
          <MessageSquare />
        </WidgetIcon>
        <WidgetTitle>input</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding" className="space-x-4">
        <WidgetTcpInputForm />
      </WidgetContent>
    </Widget>
  );
};
