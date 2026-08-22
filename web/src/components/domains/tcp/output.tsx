import { Terminal } from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';

export const WidgetTcpOutput = (props: WidgetProps) => {
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="padding" separator>
        <WidgetIcon>
          <Terminal />
        </WidgetIcon>
        <WidgetTitle>output</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding" className="space-y-4">
        ...
      </WidgetContent>
    </Widget>
  );
};
