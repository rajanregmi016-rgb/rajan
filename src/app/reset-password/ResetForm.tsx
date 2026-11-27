"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";

export default function ResetForm() {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  if (ready && !user) {
    return (
      <div className="card mx-auto max-w-md p-6 text-center">
        <p className="font-semibold">This reset link has expired or was already used.</p>
        <Link href="/login" className="btn-primary mt-4 inline-flex">Request a new link</Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) return setMsg("Use at least 8 characters.");
    if (pw !== pw2) return setMsg("The two passwords don't match.");
    setBusy(true);
    const { error } = await supabase()!.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setMsg(error.message);
    router.replace("/account");
  }

  return (
    <form onSubmit={submit} className="card mx-auto max-w-md space-y-3 p-6">
      <label className="label" htmlFor="pw1">New password</label>
      <input id="pw1" type="password" autoComplete="new-password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} />
      <label className="label" htmlFor="pw2">Type it again</label>
      <input id="pw2" type="password" autoComplete="new-password" className="input" value={pw2} onChange={(e) => setPw2(e.target.value)} />
      <button className="btn-primary w-full justify-center" disabled={busy || !ready}>{busy ? "Saving…" : "Save new password"}</button>
      {msg && <p className="text-sm text-brand-700" role="alert">{msg}</p>}
    </form>
  );
}
