import {
  ArrowLeftFromLine,
  ArrowLeftToLine,
  ArrowRightFromLine,
  ArrowRightToLine,
  Menu,
} from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';
import { useSidebarLeft } from '@/components/layout/sidebar-left';
import { useSidebarRight } from '@/components/layout/sidebar-right';
import { Button } from '@/components/ui/button';

export const WidgetSidebars = (props: WidgetProps) => {
  const {
    toggleSidebar: toggleLeft,
    open: openLeft,
    isMobile: isMobileLeft,
    openMobile: openMobileLeft,
  } = useSidebarLeft();
  const {
    toggleSidebar: toggleRight,
    open: openRight,
    isMobile: isMobileRight,
    openMobile: openMobileRight,
  } = useSidebarRight();

  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="padding" separator>
        <WidgetIcon>
          <Menu />
        </WidgetIcon>
        <WidgetTitle>sidebars</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding" className="space-y-4">
        <div>
          <Button variant="outline" onClick={toggleLeft}>
            {!(isMobileLeft ? openMobileLeft : openLeft) && <ArrowRightFromLine />}
            {(isMobileLeft ? openMobileLeft : openLeft) && <ArrowLeftToLine />}
            sidebar left
          </Button>
        </div>
        <div>
          <Button variant="outline" onClick={toggleRight}>
            {!(isMobileRight ? openMobileRight : openRight) && <ArrowLeftFromLine />}
            {(isMobileRight ? openMobileRight : openRight) && <ArrowRightToLine />}
            sidebar right
          </Button>
        </div>
      </WidgetContent>
    </Widget>
  );
};
