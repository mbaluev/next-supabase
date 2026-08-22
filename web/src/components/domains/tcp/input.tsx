import { MessageSquare, SendHorizontal, Eraser } from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';
import { Button } from '@/components/ui/button';
import { useTcpApi } from '@/components/domains/tcp/context';
import { randomString, reliableApi, tcpApi } from '@/components/domains/tcp/api';

export const WidgetTcpInput = (props: WidgetProps) => {
  const { clear } = useTcpApi();

  reliableApi.init(5);
  const handleSend = () => reliableApi.sendMessage(randomString(50));
  const handleClear = () => clear();

  return (
    <Widget variant="background" className="h-fit" {...props}>
      <WidgetHeader variant="background" separator>
        <WidgetIcon>
          <MessageSquare />
        </WidgetIcon>
        <WidgetTitle>input</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding" className="space-x-4">
        <Button variant="outline" onClick={handleSend}>
          <SendHorizontal />
          send message
        </Button>
        <Button variant="outline" onClick={handleClear}>
          <Eraser />
          clear
        </Button>
      </WidgetContent>
    </Widget>
  );
};
