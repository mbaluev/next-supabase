'use client';

import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputPassword } from '@/components/ui/input-password';
import { AlertError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ButtonBack } from '@/components/domains/auth/button-back';
import { createClient } from '@/supabase/client';

type FormValues = {
  password: string;
  confirmPassword: string;
};

export const FormUpdatePassword = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const form = useForm<FormValues>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const handleUpdate = async (values: FormValues) => {
    setError(undefined);
    if (values.password !== values.confirmPassword) {
      setError('passwords do not match');
      return;
    }
    startTransition(async () => {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (updateError) {
        setError(updateError.message);
        toast.error(updateError.message);
        return;
      }
      form.reset();
      toast.success('password updated');
      router.push('/');
      router.refresh();
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={pending}
                    placeholder="new password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={pending}
                    placeholder="confirm new password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <AlertError message={error} />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Spinner />}
          update password
        </Button>
        <ButtonBack href="/auth/login" label="back to login" />
      </form>
    </Form>
  );
};
