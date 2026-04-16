import { Widget, WidgetContent, WidgetHeader } from '@/components/layout/widget';
import { WidgetHeaderContent } from '@/components/domains/auth/widget-header-content';
import { FormReset } from '@/components/domains/auth/form-reset';

export const WidgetReset = () => {
  return (
    <Widget className="space-y-6">
      <WidgetHeader>
        <WidgetHeaderContent label="forgot your password?" />
      </WidgetHeader>
      <WidgetContent>
        <FormReset />
      </WidgetContent>
    </Widget>
  );
};
