"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { supabase, authEnabled } from "@/lib/supabaseClient";
import GoogleButton from "./GoogleButton";
import { useAuth } from "@/components/AuthProvider";

type Mode = "signin" | "signup" | "link" | "forgot";

export default function LoginForm({ initialMode = "signin" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/account");
  }, [ready, user, router]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = supabase();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "signin") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace("/account");
      } else if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: `${origin}/account` },
        });
        if (error) throw error;
        if (data.session) router.replace("/account");
        else setMsg({ ok: true, text: "Almost done! We've sent a confirmation link to your email. Open it to activate your account." });
      } else if (mode === "link") {
        const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/account` } });
        if (error) throw error;
        setMsg({ ok: true, text: "Check your email. We've sent you a sign-in link." });
      } else {
        const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/reset-password` });
        if (error) throw error;
        setMsg({ ok: true, text: "If that email has an account, a password reset link is on its way." });
      }
    } catch (err) {
      setMsg({ ok: false, text: friendly((err as Error).message) });
    } finally {
      setBusy(false);
    }
  }

  const goAccount = useCallback(() => router.replace("/account"), [router]);
  const googleError = useCallback((m: string) => setMsg({ ok: false, text: friendly(m) }), []);

  async function google() {
    const sb = supabase();
    if (!sb) return;
    setBusy(true);
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${origin}/account` } });
    if (error) { setMsg({ ok: false, text: friendly(error.message) }); setBusy(false); }
  }

  if (!authEnabled) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-bold">Accounts are coming soon</h2>
        <p className="mt-2 text-ink-500">Sign-in isn&apos;t switched on for this version of the site. Every tool still works without an account.</p>
        <Link href="/tools" className="btn-primary mt-5">Browse tools</Link>
      </div>
    );
  }

  const titles: Record<Mode, string> = {
    signin: "Welcome back",
    signup: "Create your free account",
    link: "Sign in with an email link",
    forgot: "Reset your password",
  };

  return (
    <div className="card p-6 sm:p-8">
      {(mode === "signin" || mode === "signup") && (
        <div className="mb-6 grid grid-cols-2 rounded-full bg-ink-100 p-1 text-sm font-semibold dark:bg-ink-800" role="tablist">
          {(["signin", "signup"] as const).map((m) => (
            <button key={m} type="button" role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setMsg(null); }}
              className={`rounded-full py-2.5 transition ${mode === m ? "bg-white text-ink-900 shadow-sm dark:bg-ink-950 dark:text-white" : "text-ink-500"}`}>
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
      )}
      <h2 className="text-2xl font-extrabold">{titles[mode]}</h2>

      {(mode === "signin" || mode === "signup") && (
        <>
          <div className="mt-5">
            {process.env.NEXT_PUBLIC_GOOGLE_GIS === "1" ? (
              <>
                <GoogleButton
                  label={mode === "signup" ? "signup_with" : "signin_with"}
                  onDone={goAccount}
                  onError={googleError}
                  onFallback={google}
                />
                <button type="button" onClick={google} disabled={busy} className="mt-2 block w-full text-center text-xs text-ink-400 hover:text-brand-600">
                  Google button not working? Try another way
                </button>
              </>
            ) : (
              <button type="button" onClick={google} disabled={busy} className="btn-ghost w-full !py-3">
                <GoogleIcon /> Continue with Google
              </button>
            )}
          </div>
          <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-ink-400">
            <span className="h-px flex-1 bg-ink-200 dark:bg-ink-700" /> or with email <span className="h-px flex-1 bg-ink-200 dark:bg-ink-700" />
          </div>
        </>
      )}

      <form onSubmit={submit} className={mode === "link" || mode === "forgot" ? "mt-5 space-y-4" : "space-y-4"}>
        {mode === "signup" && (
          <label className="block">
            <span className="label">Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" autoComplete="name" placeholder="e.g. Sita Sharma" />
          </label>
        )}
        <label className="block">
          <span className="label">Email address</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="input" autoComplete="email" placeholder="you@example.com" />
        </label>
        {(mode === "signin" || mode === "signup") && (
          <label className="block">
            <span className="label flex items-center justify-between">
              Password
              {mode === "signin" && <button type="button" onClick={() => { setMode("forgot"); setMsg(null); }} className="text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300">Forgot password?</button>}
            </span>
            <span className="relative block">
              <input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} required minLength={mode === "signup" ? 8 : 1}
                className="input pr-12" autoComplete={mode === "signup" ? "new-password" : "current-password"} placeholder={mode === "signup" ? "At least 8 characters" : ""} />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
        )}

        {msg && (
          <p role="status" className={`rounded-2xl p-3.5 text-sm ${msg.ok ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200" : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200"}`}>{msg.text}</p>
        )}

        <button type="submit" disabled={busy} className="btn-primary w-full !py-3">
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : mode === "link" ? "Send me a link" : "Send reset link"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm text-ink-500">
        {mode !== "link" && (
          <button type="button" onClick={() => { setMode("link"); setMsg(null); }} className="inline-flex items-center gap-1.5 font-semibold text-ink-700 hover:text-brand-700 dark:text-ink-300">
            <Mail className="h-4 w-4" aria-hidden /> Sign in without a password
          </button>
        )}
        {(mode === "link" || mode === "forgot") && (
          <p><button type="button" onClick={() => { setMode("signin"); setMsg(null); }} className="font-semibold text-brand-700 hover:underline dark:text-brand-300">← Back to sign in</button></p>
        )}
      </div>
      <p className="mt-6 text-center text-xs leading-5 text-ink-400">
        By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}

function friendly(m: string) {
  if (/invalid login/i.test(m)) return "That email and password don't match. Try again, or use 'Forgot password?'.";
  if (/already registered|already exists/i.test(m)) return "An account with this email already exists. Please sign in instead.";
  if (/email not confirmed/i.test(m)) return "Please confirm your email first. Check your inbox for our link.";
  if (/rate limit|too many/i.test(m)) return "Too many attempts. Please wait a minute and try again.";
  if (/password/i.test(m) && /least/i.test(m)) return "Please choose a password with at least 8 characters.";
  return m;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.8-.07-1.57-.2-2.31H12v4.37h6.46a5.52 5.52 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.56-5.18 3.56-8.69z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.1z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.28 6.6l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
    </svg>
  );
}
