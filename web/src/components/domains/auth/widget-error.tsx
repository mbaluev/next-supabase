'use client';

import { Widget, WidgetContent, WidgetHeader } from '@/components/layout/widget';
import { WidgetHeaderContent } from '@/components/domains/auth/widget-header-content';
import { AlertError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const WidgetError = () => {
  return (
    <Widget className="space-y-6">
      <WidgetHeader>
        <WidgetHeaderContent label="error" />
      </WidgetHeader>
      <WidgetContent className="space-y-6">
        <AlertError message="oops! something went wrong" />
        <Button variant="link" size="link" asChild>
          <Link href="/auth/login">back to login</Link>
        </Button>
      </WidgetContent>
    </Widget>
  );
};
