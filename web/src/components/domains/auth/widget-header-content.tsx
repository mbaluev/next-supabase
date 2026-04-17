import Link from 'next/link';
import { SvgLogo } from '@/components/icons/components/logo';
import { ROUTES } from '@/settings/routes';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface HeaderProps {
  label?: string;
  loading?: boolean;
}

export const WidgetHeaderContent = ({ label, loading }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col space-y-2 items-center justify-center">
      <Button variant="ghost" size="xl" asChild>
        <Link href={ROUTES.HOME.path}>
          {loading ? <Spinner className="animate-spin" /> : <SvgLogo />}
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
      </Button>
      {label && <p className="text-muted-foreground">{label}</p>}
    </div>
  );
};
