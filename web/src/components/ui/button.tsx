'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { useState, MouseEvent } from 'react';
import { Check, Copy } from 'lucide-react';

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
        link: 'p-0 h-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, asChild = false, ...rest } = props;
  const Comp = asChild ? Slot : variant === 'static' ? 'span' : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...rest} />;
});
Button.displayName = 'Button';

interface ButtonCopyProps extends ButtonProps {
  text?: string | null;
}
const ButtonCopy = (props: ButtonCopyProps) => {
  const { text, children, size, onClick, ...rest } = props;
  const isIconBtn = size && size.startsWith('icon');

  const [clicked, setClicked] = useState<boolean>(false);
  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
    await navigator.clipboard.writeText(text || '');
    setClicked(true);
    setTimeout(() => setClicked(false), 1000);
  };

  return (
    <Button size={size} onClick={handleClick} type="button" {...rest}>
      {clicked ? <Check className="text-success" /> : <Copy />}
      {!isIconBtn && (children ?? 'copy')}
    </Button>
  );
};

export { buttonVariants, Button, ButtonCopy };
export type { ButtonProps };
