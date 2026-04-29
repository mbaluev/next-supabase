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
import { Award, ScanFace, Mail } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export const WidgetProfile = (props: WidgetProps) => {
  const { user } = useSupabaseUser();
  return (
    <Widget variant="background" {...props}>
      <WidgetHeader variant="padding" separator>
        <WidgetIcon>
          {user?.app_metadata.provider === 'github' && <FaGithub className="h-6 w-6" />}
          {user?.app_metadata.provider === 'google' && <FcGoogle className="h-6 w-6" />}
          {user?.app_metadata.provider === 'email' && <Mail />}
          {!user?.app_metadata.provider && <Award />}
        </WidgetIcon>
        <WidgetTitle>account details</WidgetTitle>
      </WidgetHeader>
      <WidgetContent variant="padding">
        <div className="flex gap-6 p-2">
          <Avatar className="w-25 h-25">
            <AvatarImage src={user?.user_metadata.avatar_url} />
            <AvatarFallback>
              <ScanFace className="text-3xl" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 flex-1 overflow-hidden">
            <p className="truncate">{user?.email}</p>
            <p className="truncate">{user?.user_metadata.full_name}</p>
          </div>
        </div>
      </WidgetContent>
    </Widget>
  );
};
