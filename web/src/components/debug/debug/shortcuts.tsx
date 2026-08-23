import {
  ArrowLeftFromLine,
  ArrowLeftToLine,
  ArrowRightFromLine,
  ArrowRightToLine,
  Keyboard,
} from 'lucide-react';
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';
import { SIDEBAR_LEFT_KEYBOARD_SHORTCUT, useSidebarLeft } from '@/components/layout/sidebar-left';
import {
  SIDEBAR_RIGHT_KEYBOARD_SHORTCUT,
  useSidebarRight,
} from '@/components/layout/sidebar-right';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeaderThemeBtn, THEME_KEYBOARD_SHORTCUT } from '@/components/layout/header';

export const WidgetShortcuts = (props: WidgetProps) => {
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
          <Keyboard />
        </WidgetIcon>
        <WidgetTitle>shortcuts</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding" className="space-y-4">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">{`cmd + ${SIDEBAR_LEFT_KEYBOARD_SHORTCUT}`}</Badge>
          <Button variant="outline" onClick={toggleLeft}>
            {!(isMobileLeft ? openMobileLeft : openLeft) && <ArrowRightFromLine />}
            {(isMobileLeft ? openMobileLeft : openLeft) && <ArrowLeftToLine />}
            sidebar left
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">{`cmd + ${SIDEBAR_RIGHT_KEYBOARD_SHORTCUT}`}</Badge>
          <Button variant="outline" onClick={toggleRight}>
            {!(isMobileRight ? openMobileRight : openRight) && <ArrowLeftFromLine />}
            {(isMobileRight ? openMobileRight : openRight) && <ArrowRightToLine />}
            sidebar right
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">{`cmd + ${THEME_KEYBOARD_SHORTCUT}`}</Badge>
          <HeaderThemeBtn />
        </div>
      </WidgetContent>
    </Widget>
  );
};
