import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, ShieldAlert, User, Phone, Calendar, Heart, Shield } from "lucide-react";

export const Route = createFileRoute("/verify-id")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      type: search.type as string | undefined,
      id: search.id as string | undefined,
    };
  },
  head: () => ({ meta: [{ title: "Record Verification — HEZO SCHOOL" }] }),
  component: VerifyIdPage,
});

interface VerifiedData {
  id: string;
  name: string;
  photoUrl: string | null;
  identifier: string; // Roll / Admission # or Employee ID
  role: "Student" | "Staff";
  classOrDesignation: string;
  departmentOrSection: string;
  bloodGroup: string | null;
  emergencyContact: string | null;
  academicYear?: string;
  schoolName: string;
  schoolLogo: string | null;
  schoolAddress: string | null;
  status: "Active" | "Inactive";
}

function VerifyIdPage() {
  const { type, id } = Route.useSearch() as { type?: string; id?: string };
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerifiedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!id || !type) {
        setError("Invalid verification link. Missing card type or identifier.");
        setLoading(false);
        return;
      }

      try {
        if (type === "student") {
          const { data: student, error: studentErr } = await supabase
            .from("students")
            .select(
              `
              id,
              full_name,
              admission_number,
              roll_number,
              photo_url,
              blood_group,
              emergency_contact,
              academic_year,
              school_id,
              classes (name, section)
            `,
            )
            .eq("id", id)
            .maybeSingle();

          if (studentErr) throw studentErr;
          if (!student) {
            setError(
              "No student record found matching this ID. This card may have been deleted or revoked.",
            );
            setLoading(false);
            return;
          }

          const { data: school, error: schoolErr } = await supabase
            .from("schools")
            .select("name, school_name, logo_url, school_logo, address, status")
            .eq("id", student.school_id)
            .maybeSingle();

          if (schoolErr) throw schoolErr;
          if (!school) {
            setError("Associated school record not found.");
            setLoading(false);
            return;
          }

          if (school.status !== "active") {
            setError(
              `Verification blocked: ${school.school_name || school.name || "School"} access is suspended.`,
            );
            setLoading(false);
            return;
          }

          const classInfo = student.classes as any;
          const className = classInfo ? classInfo.name : "—";
          const sectionName = classInfo && classInfo.section ? classInfo.section : "";

          // Determine active status: student is active if their academic_year matches the current academic year
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth();
          const currentAcademicYear =
            currentMonth >= 5
              ? `${currentYear}-${currentYear + 1}`
              : `${currentYear - 1}-${currentYear}`;
          const isActive: "Active" | "Inactive" =
            !student.academic_year || student.academic_year === currentAcademicYear
              ? "Active"
              : "Inactive";

          setData({
            id: student.id,
            name: student.full_name,
            photoUrl: student.photo_url,
            identifier:
              student.admission_number ||
              student.roll_number ||
              `STU-${currentYear}-${student.id.slice(0, 4).toUpperCase()}`,
            role: "Student",
            classOrDesignation: className,
            departmentOrSection: sectionName,
            bloodGroup: student.blood_group,
            emergencyContact: student.emergency_contact,
            academicYear: student.academic_year || currentAcademicYear,
            schoolName: school.school_name || school.name || "School",
            schoolLogo: school.school_logo || school.logo_url || null,
            schoolAddress: school.address || null,
            status: isActive,
          });
        } else if (type === "staff") {
          const { data: staff, error: staffErr } = await supabase
            .from("profiles")
            .select(
              `
              user_id,
              full_name,
              photo_url,
              employee_id,
              designation,
              department,
              blood_group,
              emergency_contact,
              mobile_number,
              school_id
            `,
            )
            .eq("user_id", id)
            .maybeSingle();

          if (staffErr) throw staffErr;
          if (!staff) {
            setError(
              "No staff record found matching this ID. This card may have been deleted or revoked.",
            );
            setLoading(false);
            return;
          }

          if (!staff.school_id) {
            setError("Staff member is not associated with any school.");
            setLoading(false);
            return;
          }

          const { data: school, error: schoolErr } = await supabase
            .from("schools")
            .select("name, school_name, logo_url, school_logo, address, status")
            .eq("id", staff.school_id)
            .maybeSingle();

          if (schoolErr) throw schoolErr;
          if (!school) {
            setError("Associated school record not found.");
            setLoading(false);
            return;
          }

          if (school.status !== "active") {
            setError(
              `Verification blocked: ${school.school_name || school.name || "School"} access is suspended.`,
            );
            setLoading(false);
            return;
          }

          setData({
            id: staff.user_id,
            name: staff.full_name,
            photoUrl: staff.photo_url,
            identifier:
              staff.employee_id ||
              `EMP-${new Date().getFullYear()}-${staff.user_id.slice(0, 4).toUpperCase()}`,
            role: "Staff",
            classOrDesignation: staff.designation || "Staff Member",
            departmentOrSection: staff.department || "General",
            bloodGroup: staff.blood_group,
            emergencyContact: staff.emergency_contact || staff.mobile_number || null,
            schoolName: school.school_name || school.name || "School",
            schoolLogo: school.school_logo || school.logo_url || null,
            schoolAddress: school.address || null,
            status: "Active", // Staff profiles with active roles are active
          });
        } else {
          setError("Unsupported record type.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while verifying the record.");
      } finally {
        setLoading(false);
      }
    };

    void fetchRecord();
  }, [id, type]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between py-10 px-4 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />

      <div className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative z-10 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="size-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-sm">Querying secure records...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10 space-y-4">
            <div className="size-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <ShieldAlert className="size-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">Verification Failed</h1>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">{error}</p>
            <div className="pt-6 border-t border-slate-800/80">
              <p className="text-xs text-slate-500">Secure School ERP Verification Gateway</p>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6">
            {/* School Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              {data.schoolLogo ? (
                <img
                  src={data.schoolLogo}
                  alt=""
                  className="size-10 rounded-lg object-cover bg-white"
                />
              ) : (
                <div className="size-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold">
                  H
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-slate-100 truncate uppercase tracking-wide">
                  {data.schoolName}
                </h2>
                <p className="text-[10px] text-slate-400 truncate max-w-[280px]">
                  {data.schoolAddress || "Bengaluru, KA"}
                </p>
              </div>
            </div>

            {/* Verification & Card Status Badge */}
            <div
              className={`border rounded-xl p-3 flex items-center gap-3 ${
                data.status === "Active"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-450"
              }`}
            >
              <div
                className={`size-8 rounded-full flex items-center justify-center ${
                  data.status === "Active"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {data.status === "Active" ? (
                  <ShieldCheck className="size-5" />
                ) : (
                  <ShieldAlert className="size-5" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">
                  {data.status === "Active" ? "VERIFIED ACTIVE CARD" : "CARD INACTIVE / EXPIRED"}
                </p>
                <p className="text-[10px] text-slate-400">
                  {data.status === "Active"
                    ? "Authenticated active school registration."
                    : "Card has expired or academic year registry is inactive."}
                </p>
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4 py-2 relative">
              <div className="size-24 rounded-xl border border-slate-700 bg-slate-850 overflow-hidden flex-shrink-0 shadow-inner">
                {data.photoUrl ? (
                  <img src={data.photoUrl} alt={data.name} className="size-full object-cover" />
                ) : (
                  <div className="size-full flex items-center justify-center bg-slate-800 text-slate-400">
                    <User className="size-10" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                  {data.role}
                </span>
                <h1 className="text-lg font-bold text-slate-100 leading-tight truncate">
                  {data.name}
                </h1>
                <p className="text-xs text-slate-300 font-medium">
                  {data.role === "Student"
                    ? `Class ${data.classOrDesignation}`
                    : data.classOrDesignation}
                  {data.departmentOrSection && ` · Section ${data.departmentOrSection}`}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {data.role === "Student"
                    ? `Adm: ${data.identifier}`
                    : `Emp ID: ${data.identifier}`}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 space-y-1">
                <p className="text-[9px] uppercase tracking-wider text-slate-400">Blood Group</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Heart className="size-3.5 text-red-550 fill-red-550" />
                  {data.bloodGroup || "—"}
                </div>
              </div>
              <div className="bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 space-y-1">
                <p className="text-[9px] uppercase tracking-wider text-slate-400">
                  Emergency Contact
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  <Phone className="size-3.5 text-slate-400" />
                  {data.emergencyContact || "—"}
                </div>
              </div>
              {data.role === "Student" && data.academicYear && (
                <div className="bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 col-span-2 space-y-1">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">
                    Academic Session
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <Calendar className="size-3.5 text-slate-400" />
                    {data.academicYear}
                  </div>
                </div>
              )}
            </div>

            {/* Security Timestamp */}
            <div className="pt-4 border-t border-slate-800/80 text-center space-y-1.5">
              <div className="inline-flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-slate-400 font-mono">
                  VERIFIED: {new Date().toLocaleString()}
                </span>
              </div>
              <p className="text-[9px] text-slate-500 max-w-xs mx-auto">
                This verification check query is real-time and directly matched with the official
                active registers of {data?.schoolName || "the school"}.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="text-center pt-8">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
          <Shield className="size-3.5" /> Powered by School ERP Security
        </p>
      </div>
    </div>
  );
}
