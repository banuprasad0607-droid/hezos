import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface ActiveSchool {
  id: string;
  name: string;
  code: string | null;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  status: string;
}

interface SchoolContextValue {
  activeSchool: ActiveSchool | null;
  enterSchool: (school: ActiveSchool) => void;
  exitSchool: () => void;
}

const STORAGE_KEY = "hezo_active_school";

const SchoolContext = createContext<SchoolContextValue | undefined>(undefined);

function readFromStorage(): ActiveSchool | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveSchool;
  } catch {
    return null;
  }
}

export function SchoolContextProvider({ children }: { children: ReactNode }) {
  const [activeSchool, setActiveSchoolState] = useState<ActiveSchool | null>(
    () => readFromStorage()
  );

  const enterSchool = useCallback((school: ActiveSchool) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(school));
    setActiveSchoolState(school);
  }, []);

  const exitSchool = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setActiveSchoolState(null);
  }, []);

  return (
    <SchoolContext.Provider value={{ activeSchool, enterSchool, exitSchool }}>
      {children}
    </SchoolContext.Provider>
  );
}

export function useSchoolContext() {
  const ctx = useContext(SchoolContext);
  if (!ctx) throw new Error("useSchoolContext must be used within SchoolContextProvider");
  return ctx;
}

/** Returns the active school id from session context OR falls back to the caller's schoolId */
export function useActiveSchoolId(fallbackSchoolId: string | null): string | null {
  const { activeSchool } = useSchoolContext();
  return activeSchool?.id ?? fallbackSchoolId;
}
