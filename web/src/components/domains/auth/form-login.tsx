'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { MouseEvent, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Button } from '@/components/ui/button';
import { AlertError } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { ButtonBack } from '@/components/domains/auth/button-back';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

export const FormLogin = () => {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const handleSuccess = async () => {
    form.reset();
  };
  const handleError = async (error: any) => {
    console.log('-->', error);
    toast.error(String(error));
  };
  const handlePassword = async (values: any) => {};
  const handleOAuth = async (e: MouseEvent<HTMLButtonElement>, provider: 'google' | 'github') => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePassword)} className="space-y-6">
        <div className="space-y-6">
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
          <Button variant="link" className="px-0 py-0 h-auto" asChild>
            <Link href="/auth/reset">forgot password?</Link>
          </Button>
        </div>
        <AlertError message={error} />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Spinner />}
          login
        </Button>
        <div className="flex items-center w-full gap-x-6">
          <Button
            className="w-full"
            variant="outline"
            onClick={(e) => handleOAuth(e, 'google')}
            disabled={pending}
          >
            <FcGoogle className="h-8 w-8" />
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={(e) => handleOAuth(e, 'github')}
            disabled={pending}
          >
            <FaGithub className="h-8 w-8" />
          </Button>
        </div>
        <ButtonBack href="/auth/register" label="don't have an account?" />
      </form>
    </Form>
  );
};
