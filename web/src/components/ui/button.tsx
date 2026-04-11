import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-4',
    'whitespace-nowrap rounded-md font-medium cursor-pointer',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    'focus-visible:ring-offset-background focus-visible:ring-offset-2'
  ),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border-2 border-input hover:bg-secondary hover:text-secondary-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        info: 'bg-info text-info-foreground hover:bg-info/90',
        ghost: 'hover:bg-secondary hover:text-secondary-foreground focus-visible:ring-offset-0',
        'ghost-primary': 'hover:bg-secondary text-primary focus-visible:ring-offset-0',
        'ghost-destructive': 'hover:bg-secondary text-destructive focus-visible:ring-offset-0',
        'ghost-warning': 'hover:bg-secondary text-warning focus-visible:ring-offset-0',
        'ghost-success': 'hover:bg-secondary text-success focus-visible:ring-offset-0',
        link: 'text-primary rounded-sm underline-offset-4 hover:underline focus-visible:underline focus-visible:ring-0 focus-visible:ring-offset-0',
        static: 'text-foreground cursor-default focus-visible:ring-0 focus-visible:ring-offset-0',
      },
      size: {
        default: 'h-11 px-3',
        sm: 'h-8 px-2',
        md: 'h-11 px-3',
        lg: 'h-14 px-6',
        xl: 'h-14 px-6 text-2xl',
        icon: 'h-11 w-11 rounded-full',
        'icon-sm': 'h-8 w-8 rounded-full',
        'icon-lg': 'h-14 w-14 rounded-full',
        'icon-xl': 'h-14 w-14 rounded-full text-2xl',
        adornment: 'h-8 w-8 p-1.5 absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : variant === 'static' ? 'span' : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
