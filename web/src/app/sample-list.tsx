'use client';

import { useSampleList } from '@/app/use-sample-list';

type Sample = {
  id: number;
  name: string;
  created_at: string;
};

export function SampleList({ initialData }: { initialData: Sample[] }) {
  const { samples } = useSampleList(initialData);
  return (
    <ul>
      {samples.map((d) => (
        <li key={d.id}>{JSON.stringify(d)}</li>
      ))}
    </ul>
  );
}
