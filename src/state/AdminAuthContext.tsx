import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export type AdminRole = 'gerente' | 'empleado' | null;

interface AdminAuthValue {
  user: User | null;
  role: AdminRole;
  loading: boolean;
  isManager: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AdminRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadRole = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      if (active) setRole((data?.role as AdminRole) ?? null);
    };

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setSession(data.session);
      if (data.session?.user) {
        await loadRole(data.session.user.id);
      }
      if (active) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!active) return;
      setSession(newSession);
      if (newSession?.user) {
        await loadRole(newSession.user.id);
      } else {
        setRole(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user: session?.user ?? null,
        role,
        loading,
        isManager: role === 'gerente',
        signIn,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de <AdminAuthProvider>');
  return ctx;
}
