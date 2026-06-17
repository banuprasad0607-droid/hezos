import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error getting initial session:", err);
        if (mounted) setLoading(false);
      });

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setSession(null);
      setUser(null);
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.refreshSession();
      setSession(session);
      setUser(session?.user ?? null);
    } catch (err) {
      console.error("Error refreshing session:", err);
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export type AppRole = "super_admin" | "admin" | "teacher" | "student" | "parent";
