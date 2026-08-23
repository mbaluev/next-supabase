import { ComponentProps } from 'react';
import { cn } from '@/utils/cn';

function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-36 w-full rounded-md border-2 border-input bg-background px-3 py-2',
        'placeholder:text-muted-foreground',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'focus-visible:ring-offset-background focus-visible:ring-offset-2',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
