import { ComponentProps, forwardRef, ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/utils/cn';

type ErrorBlockBaseProps = {
  icon?: ReactElement;
  code?: string;
  name?: string;
  button?: ReactElement;
};
type ErrorBlockProps = ComponentProps<'div'> & ErrorBlockBaseProps;
const ErrorBlock = forwardRef<HTMLDivElement, ErrorBlockProps>((props, ref) => {
  const { icon, code, name, button, className, ...rest } = props;
  return (
    <div ref={ref} className={cn('flex flex-col gap-6 items-center w-full', className)} {...rest}>
      {icon && <p className="text-5xl">{icon}</p>}
      <div className="flex flex-col gap-4 items-center">
        {code && <p className="text-3xl font-medium text-center">{code}</p>}
        {name && <p className="text-center text-muted-foreground">{name}</p>}
        {button ?? (
          <Button variant="link" size="link" asChild>
            <Link href="/">back home</Link>
          </Button>
        )}
      </div>
    </div>
  );
});
ErrorBlock.displayName = 'ErrorBlock';

export { ErrorBlock };
