import { createClient } from '@/lib/supabase/server';
import { SampleList } from '@/app/sample-list';
import type { Sample } from '@/app/use-sample-list';

export default async function Home() {
  const supabase = await createClient();
  let connected;
  try {
    const { error } = await supabase.auth.getSession();
    connected = !error;
  } catch {
    connected = false;
  }
  const { data } = await supabase.from('sample').select('*').order('id');
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-4">
        <span
          className={`inline-block h-3 w-3 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`}
        />
        <span className="text-sm text-zinc-400">
          Supabase: {connected ? 'connected' : 'unreachable'}
        </span>
      </div>
      <div className="flex flex-col gap-2 max-w-md text-center text-sm text-zinc-500">
        <p>Self-hosted Supabase skeleton.</p>
        <div className="flex gap-2">
          <p>Edit</p>
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">
            web/src/app/page.tsx
          </code>
          <p>to get started.</p>
        </div>
      </div>
      <SampleList initialData={(data ?? []) as Sample[]} />
    </main>
  );
}
