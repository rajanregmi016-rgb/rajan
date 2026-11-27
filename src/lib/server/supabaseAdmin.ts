import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null | undefined;

/** Server-only Supabase client using the service-role key. Null when not configured. */
export function supabaseAdmin(): SupabaseClient | null {
  if (admin !== undefined) return admin;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  admin = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return admin;
}

/** True when the request carries the cron/sync bearer secret. */
export function isAuthorizedCron(req: Request): boolean {
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  const secrets = [process.env.CRON_SECRET, process.env.SYNC_SECRET].filter(Boolean) as string[];
  return token.length > 0 && secrets.includes(token);
}
