'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/utils/cn';

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0',
      // 'bg-border',
      orientation === 'horizontal' &&
        'bg-[repeating-linear-gradient(to_right,hsl(_var(--border))_0,hsl(_var(--border))_2px,transparent_2px,transparent_6px)]',
      orientation === 'vertical' &&
        'bg-[repeating-linear-gradient(to_bottom,hsl(_var(--border))_0,hsl(_var(--border))_2px,transparent_2px,transparent_6px)]',
      orientation === 'horizontal' && 'h-[2px]',
      orientation === 'vertical' && 'w-[2px]',
      className
    )}
    {...props}
  />
));
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
