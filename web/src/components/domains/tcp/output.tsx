import { Terminal } from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';
import { useTcpApi } from '@/components/domains/tcp/context';
import { VirtualizeWindow } from '@/components/layout/virtualize';

export const WidgetTcpOutput = (props: WidgetProps) => {
  const { data } = useTcpApi();
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="background" separator>
        <WidgetIcon>
          <Terminal />
        </WidgetIcon>
        <WidgetTitle>output</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding" className="space-y-4">
        <VirtualizeWindow
          data={data}
          renderRow={(item: any) => <div className="py-1">{JSON.stringify(item)}</div>}
          overscan={10}
        />
      </WidgetContent>
    </Widget>
  );
};
