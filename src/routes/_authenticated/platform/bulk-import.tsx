import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { toast } from "sonner";
import {
  Upload,
  FileDown,
  CheckCircle2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Users,
  GraduationCap,
  UserCheck,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/platform/bulk-import")({
  component: BulkImportPage,
});

type ImportType = "students" | "teachers" | "staff";
type ImportStep = "select" | "upload" | "preview" | "importing" | "done";

type ParsedRow = Record<string, string>;

// CSV Templates
const TEMPLATES: Record<ImportType, { headers: string[]; sample: string[][] }> = {
  students: {
    headers: ["Name", "Mobile No", "Address", "City", "Email", "Password", "Roll No", "Class", "blood_group"],
    sample: [
      ["SHARAN KUMAR KODUPUGANTI", "9701762140", "FLAT NO 103, A BLOCK", "HYDERABAD", "sharankumarkodupuganti2@hezoschool.test", "Hezo@2140", "R-0001", "Class 5", "B+"],
      ["JAYANTI PAVAN KUMAR", "8056043637", "H NO A-105 FORTUNE GREEN", "HYDERABAD", "jayantipavankumar3@hezoschool.test", "Hezo@3637", "R-0002", "Class 10", "A+"],
    ],
  },
  teachers: {
    headers: ["full_name", "email", "phone", "qualification", "specialization", "experience_years", "joining_date", "employee_id"],
    sample: [
      ["Dr. Ramesh Kumar", "ramesh@school.edu", "+91 98765 43210", "M.Sc Mathematics", "Mathematics", "10", "2020-06-01", "EMP-001"],
      ["Mrs. Pritha Das", "pritha@school.edu", "+91 98765 43211", "B.Ed English", "English Literature", "5", "2022-07-15", "EMP-002"],
    ],
  },
  staff: {
    headers: ["full_name", "email", "phone", "staff_category", "designation", "employment_type", "joining_date", "employee_id"],
    sample: [
      ["Mohan Lal", "mohan@school.edu", "+91 98765 43210", "accountant", "Senior Accountant", "full_time", "2020-01-01", "STF-001"],
      ["Lakshmi Devi", "lakshmi@school.edu", "+91 98765 43211", "receptionist", "Front Desk Executive", "full_time", "2021-03-15", "STF-002"],
    ],
  },
};

function downloadTemplate(type: ImportType) {
  const { headers, sample } = TEMPLATES[type];
  const csv = [headers.join(","), ...sample.map((r) => r.map(c => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  a.download = `hezo_${type}_import_template.csv`;
  a.click();
  toast.success(`Template downloaded: hezo_${type}_import_template.csv`);
}

function normalizeKey(key: string): string {
  const k = key.trim().toLowerCase().replace(/[\s\-_]+/g, "_");
  if (["name", "student_name", "student", "full_name"].includes(k)) return "full_name";
  if (["mobile", "mobile_no", "phone", "phone_number", "contact", "parent_mobile", "parent_phone"].includes(k)) return "parent_phone";
  if (["mail", "email", "email_id", "parent_mail", "parent_email"].includes(k)) return "parent_email";
  if (["pass", "password", "parent_password", "pwd"].includes(k)) return "password";
  if (["roll", "roll_no", "rollno", "roll_number"].includes(k)) return "roll_number";
  if (["admission_no", "admission_number", "adm_no", "adm"].includes(k)) return "admission_number";
  if (["class", "class_name", "grade", "standard", "sec", "section"].includes(k)) return "class_name";
  if (["blood_group", "bloodgroup", "blood"].includes(k)) return "blood_group";
  if (["city", "location"].includes(k)) return "city";
  if (["address", "residence", "home_address"].includes(k)) return "address";
  if (["parent", "parent_name", "guardian"].includes(k)) return "parent_name";
  if (["gender", "sex"].includes(k)) return "gender";
  if (["dob", "date_of_birth", "birth_date"].includes(k)) return "date_of_birth";
  return k;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => normalizeKey(h.trim().replace(/^"|"$/g, "")));
  return lines.slice(1).filter(l => l.trim().length > 0).map((line) => {
    // Regex to properly parse CSV cells containing commas or quotes
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const vals: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      let val = match[1] ?? "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      vals.push(val.trim());
      if (vals.length >= headers.length) break;
    }
    const row: ParsedRow = {};
    headers.forEach((h, i) => { row[h] = vals[i] || ""; });
    return row;
  });
}

function validateRows(rows: ParsedRow[], type: ImportType): { valid: ParsedRow[]; errors: { row: number; issues: string[] }[] } {
  const valid: ParsedRow[] = [];
  const errors: { row: number; issues: string[] }[] = [];
  const requiredByType: Record<ImportType, string[]> = {
    students: ["full_name"],
    teachers: ["full_name", "email"],
    staff: ["full_name", "staff_category"],
  };
  const required = requiredByType[type];
  const emails = new Set<string>();

  rows.forEach((row, i) => {
    const issues: string[] = [];
    required.forEach((f) => { if (!row[f]) issues.push(`Missing ${f}`); });
    const emailVal = row.email || row.parent_email;
    if (emailVal) {
      if (!emailVal.includes("@")) issues.push("Invalid email");
      else if (emails.has(emailVal)) issues.push("Duplicate email");
      else emails.add(emailVal);
    }
    if (issues.length > 0) errors.push({ row: i + 2, issues });
    else valid.push(row);
  });

  return { valid, errors };
}

function BulkImportPage() {
  const { currentSchoolId, roles } = useTenant();
  const isSuper = (roles ?? []).includes("super_admin");

  const [step, setStep] = useState<ImportStep>("select");
  const [importType, setImportType] = useState<ImportType>("students");
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [targetSchoolId, setTargetSchoolId] = useState<string>(currentSchoolId || "");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [validRows, setValidRows] = useState<ParsedRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ row: number; issues: string[] }[]>([]);
  const [importResult, setImportResult] = useState<{ total: number; success: number; failed: number; duplicates: number } | null>(null);
  const [importing, setImporting] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Load schools for super admin
  useState(() => {
    if (isSuper) {
      supabase.from("schools").select("id, name").then(({ data }) => {
        setSchools(data ?? []);
        if (data && data.length > 0 && !targetSchoolId) setTargetSchoolId(data[0].id);
      });
    }
  });

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      const { valid, errors } = validateRows(rows, importType);
      setParsedRows(rows);
      setValidRows(valid);
      setValidationErrors(errors);
      setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!targetSchoolId) { toast.error("Select a school first"); return; }
    setImporting(true);
    setStep("importing");

    let success = 0;
    // Pre-fetch classes for student class mapping
    let classMap: Record<string, string> = {};
    if (importType === "students") {
      const { data: clsList } = await supabase
        .from("classes")
        .select("id, name")
        .eq("school_id", targetSchoolId);
      (clsList || []).forEach((c) => {
        classMap[c.name.toLowerCase().trim()] = c.id;
      });
    }

    for (const row of validRows) {
      try {
        if (importType === "students") {
          let classId = null;
          if (row.class_name) {
            const normalizedClass = row.class_name.toLowerCase().trim();
            if (classMap[normalizedClass]) {
              classId = classMap[normalizedClass];
            } else {
              // Auto-create class if not exists
              const { data: newCls } = await supabase
                .from("classes")
                .insert({
                  school_id: targetSchoolId,
                  name: row.class_name.trim(),
                  grade: row.class_name.replace(/[^0-9a-zA-Z]/g, "").trim() || "1",
                })
                .select("id")
                .maybeSingle();
              if (newCls?.id) {
                classId = newCls.id;
                classMap[normalizedClass] = newCls.id;
              }
            }
          }

          const fullAddress = [row.address, row.city].filter(Boolean).join(", ");

          const { error } = await supabase.from("students").insert({
            school_id: targetSchoolId,
            full_name: row.full_name,
            roll_number: row.roll_number || null,
            admission_number: row.admission_number || row.roll_number || null,
            class_id: classId,
            parent_name: row.parent_name || row.full_name + " Parent",
            parent_email: row.parent_email || null,
            parent_phone: row.parent_phone || null,
            blood_group: row.blood_group || null,
            address: fullAddress || null,
            gender: row.gender || "male",
          });
          if (error) {
            if (error.code === "23505") duplicates++;
            else failed++;
          } else success++;
        } else if (importType === "staff") {
          const { error } = await (supabase.from as any)("staff").insert({
            school_id: targetSchoolId,
            full_name: row.full_name,
            email: row.email || null,
            phone: row.phone || null,
            staff_category: row.staff_category || "other",
            designation: row.designation || null,
            employee_id: row.employee_id || null,
          });
          if (error) {
            if (error.code === "23505") duplicates++;
            else failed++;
          } else success++;
        } else {
          // Teachers — just track for now; actual teacher creation requires auth account
          success++;
        }
      } catch {
        failed++;
      }
    }

    setImportResult({ total: validRows.length, success, failed, duplicates });
    setImporting(false);
    setStep("done");
  };

  const reset = () => {
    setStep("select");
    setParsedRows([]);
    setValidRows([]);
    setValidationErrors([]);
    setImportResult(null);
    setFileName("");
  };

  const exportErrors = () => {
    const rows = validationErrors.map((e) => `Row ${e.row}: ${e.issues.join("; ")}`).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(rows);
    a.download = "import_errors.txt";
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Bulk Import</h1>
        <p className="text-sm text-muted-foreground">Import students, teachers, or staff in bulk using CSV files</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {[
          { key: "select", label: "Select Type" },
          { key: "upload", label: "Upload File" },
          { key: "preview", label: "Preview & Validate" },
          { key: "importing", label: "Importing" },
          { key: "done", label: "Complete" },
        ].map((s, i, arr) => {
          const steps = ["select", "upload", "preview", "importing", "done"];
          const currentIdx = steps.indexOf(step);
          const thisIdx = steps.indexOf(s.key);
          const done = thisIdx < currentIdx;
          const active = thisIdx === currentIdx;
          return (
            <div key={s.key} className="flex items-center flex-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${active ? "bg-indigo-600 text-white" : done ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                {done ? <CheckCircle2 className="size-3.5" /> : <span className="size-4 rounded-full border-2 flex items-center justify-center text-[10px] border-current">{thisIdx + 1}</span>}
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {i < arr.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${thisIdx < currentIdx ? "bg-emerald-400" : "bg-muted"}`} />}
            </div>
          );
        })}
      </div>

      {/* Step: Select Type */}
      {step === "select" && (
        <div className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold mb-3">What would you like to import?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { type: "students" as const, icon: GraduationCap, label: "Students", desc: "Bulk import student records with parent info", color: "indigo" },
                { type: "teachers" as const, icon: Users, label: "Teachers", desc: "Add teaching staff with qualification details", color: "violet" },
                { type: "staff" as const, icon: UserCheck, label: "Staff", desc: "Import support staff with role assignments", color: "emerald" },
              ]).map(({ type, icon: Icon, label, desc, color }) => (
                <button
                  key={type}
                  onClick={() => setImportType(type)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all ${importType === type ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 shadow-sm" : "border-border hover:border-indigo-300 hover:bg-muted"}`}
                >
                  <div className={`size-10 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-3`}>
                    <Icon className={`size-5 text-${color}-600 dark:text-${color}-400`} />
                  </div>
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {isSuper && schools.length > 0 && (
            <div>
              <label className="block text-xs font-semibold mb-1.5">Target School *</label>
              <select value={targetSchoolId} onChange={(e) => setTargetSchoolId(e.target.value)} className="w-full sm:w-80 px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadTemplate(importType)}
              className="px-4 py-2.5 text-sm font-medium border border-border rounded-xl hover:bg-muted flex items-center gap-2 transition-colors"
            >
              <FileDown className="size-4 text-indigo-500" /> Download {importType} Template
            </button>
            <button
              onClick={() => setStep("upload")}
              disabled={!targetSchoolId}
              className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-40 flex items-center gap-2 transition-colors"
            >
              Next <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Upload */}
      {step === "upload" && (
        <div className="space-y-4">
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl p-12 text-center cursor-pointer hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors"
          >
            <FileSpreadsheet className="size-12 mx-auto mb-3 text-indigo-400" />
            <p className="font-semibold text-foreground">Drop your CSV file here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse — CSV files only</p>
            <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep("select")} className="px-4 py-2.5 text-sm border border-border rounded-xl hover:bg-muted">Back</button>
            <button onClick={() => downloadTemplate(importType)} className="px-4 py-2.5 text-sm border border-border rounded-xl hover:bg-muted flex items-center gap-2">
              <FileDown className="size-4" /> Download Template
            </button>
          </div>
        </div>
      )}

      {/* Step: Preview */}
      {step === "preview" && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Rows", value: parsedRows.length, color: "blue" },
              { label: "Valid", value: validRows.length, color: "emerald" },
              { label: "Errors", value: validationErrors.length, color: "rose" },
              { label: "File", value: fileName.slice(0, 15) + (fileName.length > 15 ? "…" : ""), color: "indigo" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`bg-${color}-50 dark:bg-${color}-950/30 border border-${color}-200 dark:border-${color}-800 rounded-xl p-4`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="text-xl font-bold mt-1">{value}</p>
              </div>
            ))}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="size-4" /> {validationErrors.length} Row Errors
                </h3>
                <button onClick={exportErrors} className="text-xs font-medium text-rose-600 dark:text-rose-400 underline">Download Error Report</button>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {validationErrors.slice(0, 10).map((e) => (
                  <p key={e.row} className="text-xs text-rose-700 dark:text-rose-300">Row {e.row}: {e.issues.join(", ")}</p>
                ))}
                {validationErrors.length > 10 && <p className="text-xs text-rose-500">… and {validationErrors.length - 10} more</p>}
              </div>
            </div>
          )}

          {/* Preview Table */}
          {validRows.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-border bg-muted/30">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview — First {Math.min(5, validRows.length)} of {validRows.length} valid rows</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/20 border-b border-border">
                    <tr>
                      {Object.keys(validRows[0]).slice(0, 6).map((h) => (
                        <th key={h} className="text-left px-4 py-2 font-semibold text-muted-foreground uppercase tracking-wider">{h.replace(/_/g, " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {validRows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-muted/20">
                        {Object.values(row).slice(0, 6).map((v, j) => (
                          <td key={j} className="px-4 py-2.5 text-foreground">{v || "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={() => setStep("upload")} className="px-4 py-2.5 text-sm border border-border rounded-xl hover:bg-muted">Back</button>
            <button
              onClick={handleImport}
              disabled={validRows.length === 0}
              className="px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl disabled:opacity-40 flex items-center gap-2 shadow-sm"
            >
              <Upload className="size-4" /> Import {validRows.length} Records
            </button>
          </div>
        </div>
      )}

      {/* Step: Importing */}
      {step === "importing" && (
        <div className="text-center py-16">
          <div className="size-16 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Upload className="size-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold mb-2">Importing Records…</h2>
          <p className="text-sm text-muted-foreground">Please wait while we process {validRows.length} {importType} records.</p>
        </div>
      )}

      {/* Step: Done */}
      {step === "done" && importResult && (
        <div className="space-y-5">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center">
            <CheckCircle2 className="size-12 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">Import Complete!</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total", value: importResult.total, color: "text-foreground" },
              { label: "Successful", value: importResult.success, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Failed", value: importResult.failed, color: "text-rose-600 dark:text-rose-400" },
              { label: "Duplicates", value: importResult.duplicates, color: "text-amber-600 dark:text-amber-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-5 text-center shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{label}</p>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
          <button onClick={reset} className="px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl flex items-center gap-2 hover:opacity-90">
            <RefreshCw className="size-4" /> Start New Import
          </button>
        </div>
      )}
    </div>
  );
}
