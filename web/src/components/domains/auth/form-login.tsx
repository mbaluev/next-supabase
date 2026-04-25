'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { MouseEvent, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Button } from '@/components/ui/button';
import { AlertError } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { createClient } from '@/supabase/client';

export const FormLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handlePassword = async (values: { email: string; password: string }) => {
    setError(undefined);
    startTransition(async () => {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });
      if (signInError) {
        setError(signInError.message);
        toast.error(signInError.message);
        return;
      }
      form.reset();
      const destination = searchParams.get('next') ?? '/';
      router.push(destination);
      router.refresh();
    });
  };
  const handleOAuth = async (e: MouseEvent<HTMLButtonElement>, provider: 'google' | 'github') => {
    e.preventDefault();
    setError(undefined);
    startTransition(async () => {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const next = searchParams.get('next') ?? '/';
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (oauthError) {
        setError(oauthError.message);
        toast.error(oauthError.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handlePassword)} className="space-y-6">
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
        <Button variant="link" size="link" asChild>
          <Link href="/auth/reset">forgot password?</Link>
        </Button>
        <AlertError message={error} />
        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Spinner />}
          login
        </Button>
        <div className="flex items-center w-full gap-x-6">
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={(e) => handleOAuth(e, 'google')}
            disabled={pending}
          >
            <FcGoogle className="h-8 w-8" />
          </Button>
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={(e) => handleOAuth(e, 'github')}
            disabled={pending}
          >
            <FaGithub className="h-8 w-8" />
          </Button>
        </div>
        <Button variant="link" size="link" className="w-full" asChild>
          <Link href="/auth/register">don't have an account?</Link>
        </Button>
      </form>
    </Form>
  );
};
