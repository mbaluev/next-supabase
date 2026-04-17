'use client';

import { Widget, WidgetContent, WidgetHeader } from '@/components/layout/widget';
import { WidgetHeaderContent } from '@/components/domains/auth/widget-header-content';
import { AlertError } from '@/components/ui/alert';
import { ButtonBack } from '@/components/domains/auth/button-back';

export const WidgetError = () => {
  return (
    <Widget className="space-y-6">
      <WidgetHeader>
        <WidgetHeaderContent label="error" />
      </WidgetHeader>
      <WidgetContent className="space-y-6">
        <AlertError message="oops! something went wrong" />
        <ButtonBack href="/auth/login" label="back to login" />
      </WidgetContent>
    </Widget>
  );
};
