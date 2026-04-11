'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { SvgLogo } from '@/components/icons/components/logo';
import { ReactNode } from 'react';
import { IS_PATH, TRouteDTO, ROUTES } from '@/settings/routes';

interface IBreadCrumbWrapperProps {
  children: ReactNode;
  divider?: boolean;
}
const BreadCrumbWrapper = (props: IBreadCrumbWrapperProps) => {
  const { children, divider } = props;
  return (
    <div className="flex gap-2 items-center">
      {children}
      {divider && <ChevronRight className="text-muted-foreground" />}
    </div>
  );
};

interface IBreadCrumbHomeProps {
  divider?: boolean;
}
const BreadCrumbHome = (props: IBreadCrumbHomeProps) => {
  const { divider } = props;
  return (
    <BreadCrumbWrapper divider={divider}>
      <Button variant="ghost" size="icon" asChild>
        <Link href={ROUTES.HOME.path}>
          <SvgLogo />
        </Link>
      </Button>
    </BreadCrumbWrapper>
  );
};

interface IBreadCrumbProps {
  data: TRouteDTO;
  divider: boolean;
}
const BreadCrumbLabel = (props: IBreadCrumbProps) => {
  const { data, divider } = props;
  const { icon, label } = data;
  if (!label) return null;
  return (
    <BreadCrumbWrapper divider={divider}>
      <Button variant="ghost" disabled>
        {icon}
        <p className="flex-1 text-left">{label}</p>
      </Button>
    </BreadCrumbWrapper>
  );
};
const BreadCrumbIcon = (props: IBreadCrumbProps) => {
  const { data, divider } = props;
  const { icon } = data;
  if (!icon) return null;
  return (
    <BreadCrumbWrapper divider={divider}>
      <Button variant="ghost" size="icon" disabled>
        {icon}
      </Button>
    </BreadCrumbWrapper>
  );
};
const BreadCrumbLabelLink = (props: IBreadCrumbProps) => {
  const { data, divider } = props;
  const { path, icon, label } = data;
  if (!path || !label) return null;
  return (
    <BreadCrumbWrapper divider={divider}>
      <Button variant="ghost" asChild>
        <Link href={path}>
          {icon}
          <p className="flex-1 text-left">{label}</p>
        </Link>
      </Button>
    </BreadCrumbWrapper>
  );
};
const BreadCrumbIconLink = (props: IBreadCrumbProps) => {
  const { data, divider } = props;
  const { path, icon } = data;
  if (!path || !icon) return null;
  return (
    <BreadCrumbWrapper divider={divider}>
      <Button variant="ghost" size="icon" asChild>
        <Link href={path}>{icon}</Link>
      </Button>
    </BreadCrumbWrapper>
  );
};

interface IBreadCrumbsComponentProps {
  home?: boolean;
  breadCrumbs: TRouteDTO[];
}
const BreadCrumbs = (props: IBreadCrumbsComponentProps) => {
  const { home, breadCrumbs } = props;
  return (
    <div className="flex-grow flex flex-wrap gap-2">
      {home && <BreadCrumbHome divider={breadCrumbs && breadCrumbs.length > 0} />}
      {breadCrumbs?.map((d, i, arr) => {
        const divider = i < arr.length - 1;
        if (!IS_PATH(d.path) && d.label) {
          return <BreadCrumbLabel key={d.name} data={d} divider={divider} />;
        }
        if (!IS_PATH(d.path) && d.icon) {
          return <BreadCrumbIcon key={d.name} data={d} divider={divider} />;
        }
        if (IS_PATH(d.path) && d.label) {
          return <BreadCrumbLabelLink key={d.name} data={d} divider={divider} />;
        }
        if (IS_PATH(d.path) && d.icon) {
          return <BreadCrumbIconLink key={d.name} data={d} divider={divider} />;
        }
        return null;
      })}
    </div>
  );
};

export { BreadCrumbs };
