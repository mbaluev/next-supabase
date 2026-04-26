'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import { ComponentRef } from 'react';

const separatorVariants = cva('shrink-0', {
  variants: {
    orientation: {
      horizontal: cn(
        'bg-[repeating-linear-gradient(to_right,hsl(_var(--border))_0,hsl(_var(--border))_2px,transparent_2px,transparent_6px)]',
        'h-[2px] w-full'
      ),
      vertical: cn(
        'bg-[repeating-linear-gradient(to_bottom,hsl(_var(--border))_0,hsl(_var(--border))_2px,transparent_2px,transparent_6px)]',
        'w-[2px] h-full'
      ),
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

type SeparatorProps = React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> &
  VariantProps<typeof separatorVariants>;

const Separator = React.forwardRef<ComponentRef<typeof SeparatorPrimitive.Root>, SeparatorProps>(
  ({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(separatorVariants({ orientation, className }))}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
