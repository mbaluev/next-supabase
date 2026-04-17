'use client';

import { useSampleList, type Sample } from '@/app/(_sample)/use-sample-list';

export function SampleList({ initialData }: { initialData: Sample[] }) {
  const { samples } = useSampleList(initialData);
  return (
    <ul className="flex flex-col gap-2 text-left text-sm text-zinc-300">
      {samples.map((d) => (
        <li key={d.id} className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
          <span className="font-medium text-zinc-100">{d.name}</span>
          <span className="mx-2 text-zinc-600">·</span>
          <span className="text-zinc-400">{d.email}</span>
          <span
            className={`ml-2 inline-block rounded px-1.5 py-0.5 text-xs ${
              d.status === 'active'
                ? 'bg-emerald-950 text-emerald-400'
                : 'bg-zinc-800 text-zinc-500'
            }`}
          >
            {d.status}
          </span>
          <span className="ml-2 text-xs text-zinc-600">{d.created_at}</span>
        </li>
      ))}
    </ul>
  );
}
