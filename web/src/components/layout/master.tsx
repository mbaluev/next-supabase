import { ComponentProps } from 'react';
import { cn } from '@/utils/cn';
import { Separator } from '@/components/ui/separator';

type MasterProps = ComponentProps<'div'>;
const MasterDefault = (props: MasterProps) => {
  const { children, className, ..._props } = props;
  const _className = 'flex flex-grow px-4 items-start';
  return (
    <section className={cn(_className, className)} {..._props}>
      {children}
    </section>
  );
};
const MasterCenter = (props: MasterProps) => {
  const { children, className, ..._props } = props;
  const _className = 'flex flex-grow px-4 items-center justify-center';
  return (
    <section className={cn(_className, className)} {..._props}>
      <div className="w-[min(320px,100%)] h-fit">{children}</div>
    </section>
  );
};
const MasterSeparator = (props: MasterProps) => {
  const { children, className, ..._props } = props;
  const _className = 'flex flex-col flex-1 items-start';
  return (
    <section className={cn(_className, className)} {..._props}>
      <Separator />
      {children}
    </section>
  );
};

export { MasterDefault, MasterCenter, MasterSeparator };
