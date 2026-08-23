'use client';

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useTcpApi } from '@/components/domains/tcp/context';
import { reliableApi } from '@/components/domains/tcp/api';
import { Button } from '@/components/ui/button';
import { Eraser, SendHorizontal } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export const WidgetTcpInputForm = () => {
  const { setData } = useTcpApi();
  const form = useForm({
    defaultValues: {
      message: '',
    },
  });

  const handleSubmit = async (values: { message: string }) => {
    reliableApi.sendMessage(values.message);
    form.reset();
  };
  const handleClear = () => {
    setData([]);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormControl>
                <Textarea {...field} placeholder="enter message" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          rules={{ required: true }}
        />
        <div className="flex space-x-4">
          <Button type="submit" variant="outline">
            <SendHorizontal />
            send message
          </Button>
          <Button type="button" variant="outline" onClick={handleClear}>
            <Eraser />
            clear
          </Button>
        </div>
      </form>
    </Form>
  );
};
