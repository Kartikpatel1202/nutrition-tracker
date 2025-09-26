export default function DebugPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ MISSING";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 10) + "..."
    : "❌ MISSING";

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Debug Supabase ENV</h1>
      <p>Supabase URL: {url}</p>
      <p>Supabase Key: {key}</p>
    </div>
  );
}
