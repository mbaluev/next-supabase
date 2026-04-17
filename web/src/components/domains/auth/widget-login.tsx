import { Widget, WidgetContent, WidgetHeader } from '@/components/layout/widget';
import { WidgetHeaderContent } from '@/components/domains/auth/widget-header-content';
import { FormLogin } from '@/components/domains/auth/form-login';

export const WidgetLogin = () => {
  return (
    <Widget className="space-y-6">
      <WidgetHeader>
        <WidgetHeaderContent label="welcome back" />
      </WidgetHeader>
      <WidgetContent>
        <FormLogin />
      </WidgetContent>
    </Widget>
  );
};
