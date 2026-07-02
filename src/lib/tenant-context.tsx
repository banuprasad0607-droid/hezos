import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";

export interface TenantContextValue {
  currentSchoolId: string | null;
  currentSchool: any | null;
  profile: any | null;
  roles: string[];
  user: any | null;
  loading: boolean;
  error: Error | null;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { activeSchool } = useSchoolContext();

  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [currentSchool, setCurrentSchool] = useState<any>(null);
  const [currentSchoolId, setCurrentSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTenantData = async () => {
    if (!user) {
      setProfile(null);
      setRoles([]);
      setCurrentSchool(null);
      setCurrentSchoolId(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch user profile
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileErr) throw profileErr;
      setProfile(profileData);

      // 2. Fetch user roles
      const { data: rolesData, error: rolesErr } = await supabase
        .from("user_roles")
        .select("role, school_id")
        .eq("user_id", user.id);

      if (rolesErr) throw rolesErr;

      const roleList = (rolesData || []).map((r: any) => r.role);
      setRoles(roleList);

      // 3. Determine the current school ID
      // If super admin has selected an active school in context, use that.
      // Otherwise, use the school_id from the user's profile.
      const isSuperAdmin = (roleList ?? []).includes("super_admin");
      const resolvedSchoolId =
        isSuperAdmin && activeSchool?.id ? activeSchool.id : profileData?.school_id || null;

      setCurrentSchoolId(resolvedSchoolId);

      // 4. Fetch school details if a school is associated
      if (resolvedSchoolId) {
        const { data: schoolData, error: schoolErr } = await supabase
          .from("schools")
          .select("*")
          .eq("id", resolvedSchoolId)
          .maybeSingle();

        if (schoolErr) throw schoolErr;
        setCurrentSchool(schoolData);
      } else {
        setCurrentSchool(null);
      }
    } catch (err: any) {
      console.error("Error in TenantProvider:", err);
      setError(
        err instanceof Error ? err : new Error(err.message || "Failed to load tenant context"),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    void fetchTenantData();
  }, [user, authLoading, activeSchool?.id]);

  const value: TenantContextValue = {
    currentSchoolId,
    currentSchool,
    profile,
    roles,
    user,
    loading: authLoading || loading,
    error,
    refreshTenant: fetchTenantData,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

/** Enforces that a school UUID must be active, throwing an error otherwise */
export function useRequiredSchoolId(): string {
  const { currentSchoolId, loading } = useTenant();

  if (loading) {
    throw new Error("Loading tenant context...");
  }

  if (!currentSchoolId) {
    throw new Error(
      "Missing school context: No school is selected or associated with your profile.",
    );
  }

  return currentSchoolId;
}
