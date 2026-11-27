"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { RecentTools, FAVS_EVENT } from "@/lib/userTools";

interface AuthState {
  user: User | null;
  session: Session | null;
  ready: boolean;
  enabled: boolean;
}

const Ctx = createContext<AuthState>({ user: null, session: null, ready: false, enabled: false });

export function useAuth() {
  return useContext(Ctx);
}

/** Merge device favourites with the ones saved on the account, then keep them in sync. */
async function syncFavorites(user: User) {
  const sb = supabase();
  if (!sb) return;
  const cloud: string[] = Array.isArray(user.user_metadata?.favorites) ? user.user_metadata.favorites : [];
  const local = RecentTools.favorites();
  const merged = Array.from(new Set([...local, ...cloud])).slice(0, 50);
  RecentTools.setFavorites(merged, true);
  if (merged.length !== cloud.length || merged.some((s, i) => s !== cloud[i])) {
    await sb.auth.updateUser({ data: { favorites: merged } });
  }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, session: null, ready: false, enabled: false });

  useEffect(() => {
    const sb = supabase();
    if (!sb) {
      setState({ user: null, session: null, ready: true, enabled: false });
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setState({ user: data.session?.user ?? null, session: data.session, ready: true, enabled: true });
      if (data.session?.user) syncFavorites(data.session.user).catch(() => {});
    });
    const { data: sub } = sb.auth.onAuthStateChange((event, session) => {
      setState({ user: session?.user ?? null, session, ready: true, enabled: true });
      if (event === "SIGNED_IN" && session?.user) syncFavorites(session.user).catch(() => {});
    });
    const onFavs = () => {
      sb.auth.getSession().then(({ data }) => {
        if (data.session) sb.auth.updateUser({ data: { favorites: RecentTools.favorites() } }).catch(() => {});
      });
    };
    window.addEventListener(FAVS_EVENT, onFavs);
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener(FAVS_EVENT, onFavs);
    };
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}
