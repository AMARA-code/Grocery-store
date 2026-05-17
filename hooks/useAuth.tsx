"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env";
import type { ProfileRow } from "@/types";

export type UseAuthResult = {
  user: User | null;
  profile: ProfileRow | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!isSupabaseBrowserConfigured()) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    setUser(authUser);

    if (!authUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("id, email, role, full_name, created_at")
      .eq("id", authUser.id)
      .maybeSingle();

    setProfile(data as ProfileRow | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    if (!isSupabaseBrowserConfigured()) return;

    const supabase = createSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void load();
    });
    return () => subscription.unsubscribe();
  }, [load]);

  const signOut = useCallback(async () => {
    if (!isSupabaseBrowserConfigured()) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  return { user, profile, loading, signOut, refresh: load };
}
