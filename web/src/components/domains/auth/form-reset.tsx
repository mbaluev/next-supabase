'use client';

import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { createClient } from '@/supabase/client';
import Link from 'next/link';

export const FormReset = () => {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const form = useForm({
    defaultValues: {
      email: '',
    },
  });

  const handleReset = async (values: { email: string }) => {
    setError(undefined);
    startTransition(async () => {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.email.trim());
      if (resetError) {
        setError(resetError.message);
        toast.error(resetError.message);
        return;
      }
      form.reset();
      toast.success('check your email for a password reset link');
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleReset)} className="space-y-6">
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
                    autoComplete="email"
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
          reset password
        </Button>
        <Button variant="link" size="link" asChild>
          <Link href="/auth/login">back to login</Link>
        </Button>
      </form>
    </Form>
  );
};
