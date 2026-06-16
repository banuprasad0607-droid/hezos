import { useEffect } from "react";
import { useTenant } from "@/lib/tenant-context";

/**
 * Returns the display name for the current school context.
 *
 * Rules (matching the spec):
 *   - super_admin with NO active school  → "HEZO SCHOOL"
 *   - super_admin IN a school context    → activeSchool.name  (they entered a school)
 *   - school_admin / teacher / parent    → their own schoolName from auth
 */
export function useSchoolName(): string {
  const { roles, currentSchool } = useTenant();

  const isSuper = roles.includes("super_admin");

  if (isSuper) {
    // Super admin entered a school context
    if (currentSchool) return currentSchool.name;
    // Super admin at platform level
    return "HEZO SCHOOL";
  }

  // For all non-super roles, use their own school name
  return currentSchool?.name ?? "School";
}

/**
 * Returns a dynamic page <title> string and also updates document.title.
 * Format: "Page Name — School Name"
 */
export function usePageTitle(pageName: string): string {
  const schoolDisplayName = useSchoolName();
  const title = `${pageName} — ${schoolDisplayName}`;

  useEffect(() => {
    document.title = title;
  }, [title]);

  return title;
}
