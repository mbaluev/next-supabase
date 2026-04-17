'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/supabase/client';

export type Sample = {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'disabled';
  created_at: string;
};

export function useSampleList(initialData: Sample[]) {
  const [samples, setSamples] = useState<Sample[]>(initialData);
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('sample-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sample' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setSamples((prev) => [...prev, payload.new as Sample]);
        } else if (payload.eventType === 'UPDATE') {
          setSamples((prev) => {
            return prev.map((s) =>
              s.id === (payload.new as Sample).id ? (payload.new as Sample) : s
            );
          });
        } else if (payload.eventType === 'DELETE') {
          setSamples((prev) => prev.filter((s) => s.id !== (payload.old as Sample).id));
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return { samples, setSamples };
}
