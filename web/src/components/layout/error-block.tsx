import { ComponentProps, forwardRef, ReactElement } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ErrorBlockBaseProps = {
  icon?: ReactElement;
  code?: string;
  name?: string;
};
type ErrorBlockProps = ComponentProps<'div'> & ErrorBlockBaseProps;
const ErrorBlock = forwardRef<HTMLDivElement, ErrorBlockProps>((props, ref) => {
  const { icon, code, name, ...rest } = props;
  return (
    <div ref={ref} className="flex flex-col gap-6 items-center w-full" {...rest}>
      {icon && <p className="text-[11rem]">{icon}</p>}
      <div className="flex flex-col gap-4 items-center">
        {code && <p className="text-3xl font-medium text-center">{code}</p>}
        {name && <p className="text-center">{name}</p>}
        <Button variant="link" className="px-0 py-0 h-auto w-full" asChild>
          <Link href="/">back home</Link>
        </Button>
      </div>
    </div>
  );
});
ErrorBlock.displayName = 'ErrorBlock';

export { ErrorBlock };
