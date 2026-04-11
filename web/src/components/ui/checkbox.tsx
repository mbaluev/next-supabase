'use client';

import { CheckIcon } from 'lucide-react';
import { ComponentProps } from 'react';
import { cn } from '@/utils/cn';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

function Checkbox({ className, checked, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      className={cn(
        'border-input',
        'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary',
        'data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'size-6 shrink-0 rounded-sm border-2 outline-none',
        'cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'focus-visible:ring-offset-background focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex w-full h-full items-center justify-center"
      >
        {/*{checked === 'indeterminate' && <Minus />}*/}
        {/*{checked === true && <CheckIcon />}*/}
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
