import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase URL and Key are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the platform secrets (Secrets panel).'
    );
  }

  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}

// Export a proxy to the client to avoid breaking existing imports while enabling lazy initialization
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const c = getClient();
    return (c as any)[prop];
  },
});
