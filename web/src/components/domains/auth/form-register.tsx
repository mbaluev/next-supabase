'use client';

import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { AlertError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ButtonBack } from '@/components/domains/auth/button-back';

export const FormRegister = () => {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  const handleSuccess = async () => {
    form.reset();
    toast.success('check you email');
  };
  const handleError = async (error: any) => {
    console.log('-->', error);
    toast.error(String(error));
  };
  const handleRegister = async (values: any) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <Input
                    {...field}
                    disabled={pending}
                    placeholder="enter full name"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <Input
                    {...field}
                    disabled={pending}
                    placeholder="enter email"
                    type="email"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={pending}
                    placeholder="enter password"
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
          create an account
        </Button>
        <ButtonBack href="/auth/login" label="already have an account?" />
      </form>
    </Form>
  );
};
