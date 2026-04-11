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

export const DialogProfile = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const _open = useMemo(() => isDialogOpen(searchParams, ROUTES.PROFILE.name), [searchParams]);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    const _params = handleDialogClose(params, ROUTES.PROFILE.name);
    const _pathname = _params.size > 0 ? `${pathname}?${_params.toString()}` : pathname;
    router.replace(_pathname);
  };

  return (
    <Dialog open={_open} onOpenChange={handleClose}>
      <DialogContent onClose={handleClose} className="max-w-[768px]" close={false}>
        <DialogHeader separator>
          <DialogToolbar title={ROUTES.PROFILE.label} icon={ROUTES.PROFILE.icon} close />
          <DialogDescription>
            <span className="block">
              view and manage your personal information, account settings, and preferences.
            </span>
            <span className="block">keep your details up to date.</span>
          </DialogDescription>
        </DialogHeader>
        <WidgetContent variant="dialog" className="overflow-y-auto">
          ...
        </WidgetContent>
      </DialogContent>
    </Dialog>
  );
};
