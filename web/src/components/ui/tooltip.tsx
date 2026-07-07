'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/utils/cn';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { ReactElement } from 'react';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md bg-foreground px-4 py-2 text-sm text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>;
type TooltipTextProps = Omit<TooltipContentProps, 'title'> & {
  title?: string | ReactElement;
};
const TooltipText = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  TooltipTextProps
>(({ children, title, ...props }, ref) => {
  if (!title) return children;
  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent ref={ref} {...props}>
            {title}
            <TooltipArrow className="fill-foreground w-2.5 h-1.5" />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
});
TooltipText.displayName = 'TooltipText';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipText };
