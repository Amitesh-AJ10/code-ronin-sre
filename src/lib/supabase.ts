import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Test if Supabase is configured and reachable. Call on Login (or app load) to verify connection. */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
    if (!supabaseUrl || !supabaseAnonKey) {
        return { ok: false, message: 'Supabase not configured (missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local)' };
    }
    try {
        const { error } = await supabase.auth.getSession();
        if (error) return { ok: false, message: `Supabase error: ${error.message}` };
        return { ok: true, message: 'Supabase connected' };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { ok: false, message: `Supabase unreachable: ${msg}` };
    }
}
