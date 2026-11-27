"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function AccountButton() {
  const { user, ready, enabled } = useAuth();
  if (!enabled) return null;
  const signedIn = ready && !!user;
  const initial = (user?.user_metadata?.full_name || user?.email || "?").trim().charAt(0).toUpperCase();
  return (
    <Link
      href={signedIn ? "/account" : "/login"}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-2.5 text-sm font-semibold text-white hover:bg-white/10 sm:px-3.5"
      aria-label={signedIn ? "Your account" : "Sign in"}
    >
      {signedIn ? (
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-gradient text-xs font-bold">{initial}</span>
      ) : (
        <UserRound className="h-4 w-4" aria-hidden />
      )}
      <span className="hidden sm:inline">{signedIn ? "Account" : "Sign in"}</span>
    </Link>
  );
}
