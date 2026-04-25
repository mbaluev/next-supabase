import { Widget, WidgetContent, WidgetHeader } from '@/components/layout/widget';
import { WidgetHeaderContent } from '@/components/domains/auth/widget-header-content';
import { FormUpdatePassword } from '@/components/domains/auth/form-update-password';

export const WidgetUpdatePassword = () => {
  return (
    <Widget className="space-y-6">
      <WidgetHeader>
        <WidgetHeaderContent label="set a new password" />
      </WidgetHeader>
      <WidgetContent>
        <FormUpdatePassword />
      </WidgetContent>
    </Widget>
  );
};
