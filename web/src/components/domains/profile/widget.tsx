'use client';

import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetIcon,
  WidgetProps,
  WidgetTitle,
} from '@/components/layout/widget';
import { useSupabaseUser } from '@/supabase/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, Camera } from 'lucide-react';

export const WidgetProfile = (props: WidgetProps) => {
  const { user } = useSupabaseUser();
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="padding" separator>
        <WidgetIcon>
          <Award />
        </WidgetIcon>
        <WidgetTitle>{user?.email}</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding">
        <div className="flex gap-6 p-2">
          <Avatar className="w-50 h-50 bg-sidebar rounded-md border-2">
            <AvatarImage src={user?.user_metadata.avatar_url} />
            <AvatarFallback className="bg-sidebar">
              <Camera className="text-3xl text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <p>{user?.app_metadata.provider}</p>
            <p>{user?.user_metadata.full_name}</p>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
};
