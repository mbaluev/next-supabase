'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { DialogContentProps } from '@radix-ui/react-dialog';
import { Separator } from '@/components/ui/separator';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/25 dark:bg-black/75',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentCustomProps extends DialogContentProps {
  close?: boolean;
  onClose?: (e: React.MouseEvent<HTMLDivElement>) => void;
}
const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentCustomProps
>(({ className, children, close, onClose, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      onClick={onClose}
      className={cn(
        'fixed top-0 z-50 left-[50%] translate-x-[-50%] duration-200',
        'p-4 md:py-16 w-full h-full max-w-lg max-h-full overflow-hidden rounded-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        // 'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]',
        // 'data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2',
        className
      )}
      {...props}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative bg-background rounded-lg space-y-4',
          'flex flex-col overflow-hidden max-h-full'
        )}
      >
        {close && (
          <DialogPrimitive.Close className="absolute right-3 top-3 z-50" asChild>
            <Button variant="ghost" size="icon">
              <X />
            </Button>
          </DialogPrimitive.Close>
        )}
        {children}
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  separator?: boolean;
}
const DialogHeader = (props: DialogHeaderProps) => {
  const { children, className, separator, ...rest } = props;
  return (
    <div className={cn('flex flex-col text-left pt-4', className)} {...rest}>
      {children}
      {separator && <Separator className="mt-3" />}
    </div>
  );
};
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight px-3', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground leading-normal px-6 my-2', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

interface DialogToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  close?: boolean;
  buttons?: React.ReactNode;
  icon?: React.ReactNode;
}
const DialogToolbar = ({
  className,
  title,
  close,
  buttons,
  icon,
  ...props
}: DialogToolbarProps) => (
  <DialogTitle>
    <div className="flex gap-x-1" {...props}>
      <Button variant="static" className="flex-1 justify-start">
        {icon}
        <p>{title}</p>
      </Button>
      {buttons}
      {close && (
        <DialogPrimitive.Close asChild>
          <Button variant="ghost" size="icon">
            <X />
          </Button>
        </DialogPrimitive.Close>
      )}
    </div>
  </DialogTitle>
);
DialogFooter.displayName = 'DialogToolbar';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogToolbar,
};
