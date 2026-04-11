'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import { ComponentProps } from 'react';

const Skeleton = React.forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('animate-pulse bg-muted rounded-md', className)} {...props}>
      {children ?? <div>&nbsp;</div>}
    </div>
  )
);
Skeleton.displayName = 'Skeleton';

export { Skeleton };
