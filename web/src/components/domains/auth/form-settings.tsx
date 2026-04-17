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

interface IProps {
  onClose?: () => void;
}

export const FormSettings = (props: IProps) => {
  const { onClose } = props;
  const user = {} as any;
  const [pending, startTransition] = useTransition();

  const values = (user: any) => ({
    _id: user?._id || undefined,
    name: user?.name || undefined,
    email: user?.email || undefined,
  });
  const form = useForm({
    defaultValues: values(user),
  });
  useEffect(() => {
    form.reset(values(user));
  }, [form, user]);
  const handleError = async (error: any) => {
    console.log('-->', error);
    toast.error(String(error));
  };
  const handleSettings = (values: any) => {};

  const _formItem = 'grid gap-x-6 gap-y-4 grid-cols-1 sm:grid-cols-3 space-y-0';
  const _formLabel = 'flex items-center md:justify-end text-muted-foreground';
  const _formControl = 'sm:col-span-2 overflow-hidden';
  const _formMessage = 'sm:col-span-2 sm:col-start-2';
  const _buttonSubmit = 'sm:col-start-2 sm:col-span-2 md:col-start-3';

  return (
    <Form {...form}>
      <form className="space-y-12" onSubmit={form.handleSubmit(handleSettings)}>
        <div className="space-x-6 flex flex-row">
          <Avatar className="w-20 h-20 bg-secondary rounded-md">
            <AvatarImage src={user?.image || ''} />
            <AvatarFallback className="bg-secondary">
              <User className="text-xl" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-6 grow">
            <FormItem className={_formItem}>
              <FormLabel className={_formLabel}>id</FormLabel>
              <FormControl className={_formControl}>
                <p className="text-ellipsis">{user?._id}</p>
              </FormControl>
              <FormMessage className={_formMessage} />
            </FormItem>
            <FormItem className={_formItem}>
              <FormLabel className={_formLabel}>email</FormLabel>
              <FormControl className={_formControl}>
                <p className="text-ellipsis">{user?.email}</p>
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
