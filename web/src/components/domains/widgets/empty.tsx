'use client';

import { CircleOff, Ellipsis } from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';
import { TooltipText } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export const WidgetEmpty = (props: WidgetProps) => {
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="padding">
        <WidgetIcon>
          <CircleOff />
        </WidgetIcon>
        <WidgetTitle>empty</WidgetTitle>
        <TooltipText title="more actions" side="left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" className="min-w-50">
              ...
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipText>
      </WidgetHeader>
      <WidgetContent className="justify-items-center">
        <CircleOff className="text-4xl" />
      </WidgetContent>
      <WidgetHeader variant="padding" className="justify-between">
        <TooltipText title="more actions" side="left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" className="min-w-50">
              ...
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipText>
        <TooltipText title="more actions" side="left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" className="min-w-50">
              ...
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipText>
      </WidgetHeader>
    </Widget>
  );
};
