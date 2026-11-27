import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

/**
 * Per-user notification inbox, stored as one small JSON file per user in a
 * private Supabase Storage bucket (no extra database table needed).
 */
export type Notice = { id: string; at: string; kind: "login" | "alert" | "welcome" | "news" | "account"; title: string; body: string; href?: string; read?: boolean };

const BUCKET = "user-data";
const MAX = 40;
let bucketReady = false;

async function ensureBucket() {
  const db = supabaseAdmin();
  if (!db || bucketReady) return;
  const got = await db.storage.getBucket(BUCKET);
  if (got.error) await db.storage.createBucket(BUCKET, { public: false });
  bucketReady = true;
}
const path = (uid: string) => `notifications/${uid}.json`;

export async function readNotices(uid: string): Promise<Notice[]> {
  const db = supabaseAdmin();
  if (!db) return [];
  await ensureBucket();
  const { data, error } = await db.storage.from(BUCKET).download(path(uid));
  if (error || !data) return [];
  try {
    const list = JSON.parse(await data.text());
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export async function writeNotices(uid: string, list: Notice[]) {
  const db = supabaseAdmin();
  if (!db) return;
  await ensureBucket();
  const body = new Blob([JSON.stringify(list.slice(0, MAX))], { type: "application/json" });
  await db.storage.from(BUCKET).upload(path(uid), body, { upsert: true, contentType: "application/json", cacheControl: "0" });
}

export async function addNotice(uid: string, n: Omit<Notice, "id" | "at" | "read">) {
  const list = await readNotices(uid);
  list.unshift({ ...n, id: Math.random().toString(36).slice(2, 10), at: new Date().toISOString(), read: false });
  await writeNotices(uid, list);
}

export async function deleteNotices(uid: string) {
  const db = supabaseAdmin();
  if (!db) return;
  await db.storage.from(BUCKET).remove([path(uid)]);
}

/** Email preferences live in user_metadata.prefs; everything defaults to on. */
export type Prefs = { loginEmail: boolean; alertEmail: boolean };
export function prefsOf(meta: Record<string, unknown> | undefined): Prefs {
  const p = (meta?.prefs || {}) as Partial<Prefs>;
  return { loginEmail: p.loginEmail !== false, alertEmail: p.alertEmail !== false };
}
