'use client';

import { useForm } from 'react-hook-form';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertError } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ButtonBack } from '@/components/domains/auth/button-back';
import { InputPassword } from '@/components/ui/input-password';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export const FormReset = () => {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [step, setStep] = useState<'forgot' | { email: string }>('forgot');

  const formReset = useForm({
    defaultValues: {
      email: '',
    },
  });
  const formNewPassword = useForm({
    defaultValues: {
      newPassword: '',
      code: '',
    },
  });
  const handleError = async (error: any) => {
    console.log('-->', error);
    toast.error(String(error));
  };
  const handleReset = async (values: any) => {};
  const handleNewPassword = async (values: any) => {};

  if (step === 'forgot') {
    return (
      <Form {...formReset}>
        <form onSubmit={formReset.handleSubmit(handleReset)} className="space-y-6">
          <div className="space-y-6">
            <FormField
              control={formReset.control}
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
          </div>
          <AlertError message={error} />
          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Spinner />}
            reset password
          </Button>
          <ButtonBack href="/auth/login" label="back to login" />
        </form>
      </Form>
    );
  }

  return (
    <Form {...formNewPassword}>
      <form onSubmit={formNewPassword.handleSubmit(handleNewPassword)} className="space-y-6">
        <FormItem className="space-y-4">
          <FormControl>
            <Input value={step.email} disabled />
          </FormControl>
        </FormItem>
        <FormField
          control={formNewPassword.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormControl>
                <InputPassword
                  {...field}
                  disabled={pending}
                  placeholder="enter new password"
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formNewPassword.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-y-4 space-y-0">
              <FormControl>
                <InputOTP {...field} disabled={pending} maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
