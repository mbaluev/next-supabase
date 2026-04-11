'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '@/settings/routes';
import { useMemo } from 'react';
import { handleDialogClose, isDialogOpen } from '@/components/ui/dialog-handlers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogToolbar,
} from '@/components/ui/dialog';
import { WidgetContent } from '@/components/layout/widget';

export const DialogTermsConditions = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const _open = useMemo(() => {
    return isDialogOpen(searchParams, ROUTES.TERMS_CONDITIONS.name);
  }, [searchParams]);

  function handleClose() {
    const params = new URLSearchParams(searchParams.toString());
    const _params = handleDialogClose(params, ROUTES.TERMS_CONDITIONS.name);
    const _pathname = _params.size > 0 ? `${pathname}?${_params.toString()}` : pathname;
    router.replace(_pathname);
  }

  return (
    <Dialog open={_open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[768px]" close={false}>
        <DialogHeader separator>
          <DialogToolbar
            title={ROUTES.TERMS_CONDITIONS.label}
            icon={ROUTES.TERMS_CONDITIONS.icon}
            close
          />
          <DialogDescription>
            <span className="block">some text</span>
            <span className="block">some text</span>
          </DialogDescription>
        </DialogHeader>
        <WidgetContent variant="dialog" className="overflow-y-auto">
          ...
        </WidgetContent>
      </DialogContent>
    </Dialog>
  );
};
