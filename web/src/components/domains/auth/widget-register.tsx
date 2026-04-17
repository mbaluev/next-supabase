import { Widget, WidgetContent, WidgetHeader } from '@/components/layout/widget';
import { WidgetHeaderContent } from '@/components/domains/auth/widget-header-content';
import { FormRegister } from '@/components/domains/auth/form-register';

export const WidgetRegister = () => {
  return (
    <Widget className="space-y-6">
      <WidgetHeader>
        <WidgetHeaderContent label="create an account" />
      </WidgetHeader>
      <WidgetContent>
        <FormRegister />
      </WidgetContent>
    </Widget>
  );
};
