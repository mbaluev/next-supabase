import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  let connected;
  try {
    const { error } = await supabase.auth.getSession();
    connected = !error;
  } catch {
    connected = false;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Next Supabase</h1>

      <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-4">
        <span
          className={`inline-block h-3 w-3 rounded-full ${
            connected ? "bg-emerald-500" : "bg-red-500"
          }`}
        />
        <span className="text-sm text-zinc-400">
          Supabase: {connected ? "connected" : "unreachable"}
        </span>
      </div>

      <p className="max-w-md text-center text-sm text-zinc-500">
        Self-hosted Supabase skeleton. Edit{" "}
        <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-300">
          web/src/app/page.tsx
        </code>{" "}
        to get started.
      </p>
    </main>
  );
}
