'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useTransition } from 'react';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useSupabaseUser } from '@/supabase/auth';
import { createClient } from '@/supabase/client';

interface IProps {
  onClose?: () => void;
}

export const FormSettings = (props: IProps) => {
  const { onClose } = props;
  const { user, pending: userPending } = useSupabaseUser();
  const [pending, startTransition] = useTransition();

  const values = (u: typeof user) => ({
    _id: u?.id ?? '',
    name: (u?.user_metadata?.full_name as string | undefined) ?? '',
    email: u?.email ?? '',
  });
  const form = useForm({
    defaultValues: values(user),
  });
  useEffect(() => {
    form.reset(values(user));
  }, [user?.id, user?.email, user?.user_metadata]);

  const handleSettings = (formValues: { _id: string; name: string; email: string }) => {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: formValues.name.trim() },
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('profile saved');
      onClose?.();
    });
  };

  const _formItem = 'grid gap-x-6 gap-y-4 grid-cols-1 sm:grid-cols-3 space-y-0';
  const _formLabel = 'flex items-center md:justify-end text-muted-foreground';
  const _formControl = 'sm:col-span-2 overflow-hidden';
  const _formMessage = 'sm:col-span-2 sm:col-start-2';
  const _buttonSubmit = 'sm:col-start-2 sm:col-span-2 md:col-start-3';

  if (userPending || !user) {
    return null;
  }

  return (
    <Form {...form}>
      <form className="space-y-12" onSubmit={form.handleSubmit(handleSettings)}>
        <div className="space-x-6 flex flex-row">
          <Avatar className="w-20 h-20 bg-secondary rounded-md">
            <AvatarImage src={(user.user_metadata?.avatar_url as string | undefined) ?? ''} />
            <AvatarFallback className="bg-secondary">
              <User className="text-xl" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-6 grow">
            <FormItem className={_formItem}>
              <FormLabel className={_formLabel}>id</FormLabel>
              <FormControl className={_formControl}>
                <p className="text-ellipsis">{user.id}</p>
              </FormControl>
              <FormMessage className={_formMessage} />
            </FormItem>
            <FormItem className={_formItem}>
              <FormLabel className={_formLabel}>email</FormLabel>
              <FormControl className={_formControl}>
                <p className="text-ellipsis">{user.email}</p>
              </FormControl>
              <FormMessage className={_formMessage} />
            </FormItem>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className={_formItem}>
                  <FormLabel className={_formLabel}>name</FormLabel>
                  <FormControl className={_formControl}>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="name"
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage className={_formMessage} />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className={_formItem}>
          <Button type="submit" className={_buttonSubmit} disabled={pending}>
            {pending && <Spinner />}
            save
          </Button>
        </div>
      </form>
    </Form>
  );
};
