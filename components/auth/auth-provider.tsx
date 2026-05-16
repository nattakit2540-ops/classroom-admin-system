"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { refreshIdToken, signInWithEmailPassword } from "@/lib/firebase-rest";
import { readLocal, writeLocal } from "@/lib/local-store";

type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "teacher" | "executive";
  idToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = "classroom-health-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => readLocal<AppUser | null>(storageKey, null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.refreshToken) return;

    let active = true;
    const shouldRefreshNow = !user.expiresAt || user.expiresAt - Date.now() < 5 * 60 * 1000;

    async function refreshSession() {
      if (!user?.refreshToken) return;
      try {
        const credential = await refreshIdToken(user.refreshToken);
        if (!active) return;

        const nextUser: AppUser = {
          ...user,
          uid: credential.user_id,
          idToken: credential.id_token,
          refreshToken: credential.refresh_token,
          expiresAt: Date.now() + Number(credential.expires_in) * 1000
        };
        writeLocal(storageKey, nextUser);
        setUser(nextUser);
      } catch {
        writeLocal(storageKey, null);
        setUser(null);
      }
    }

    if (shouldRefreshNow) {
      refreshSession();
    }

    const interval = window.setInterval(refreshSession, 50 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        setLoading(true);
        try {
          const credential = await signInWithEmailPassword(email, password);
          const nextUser: AppUser = {
            uid: credential.localId,
            email: credential.email,
            displayName: "ครูประจำชั้น",
            role: "teacher",
            idToken: credential.idToken,
            refreshToken: credential.refreshToken,
            expiresAt: Date.now() + Number(credential.expiresIn) * 1000
          };
          writeLocal(storageKey, nextUser);
          setUser(nextUser);
        } finally {
          setLoading(false);
        }
      },
      logout() {
        writeLocal(storageKey, null);
        setUser(null);
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
