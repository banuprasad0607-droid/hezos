import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useServerFn, a as provisionStudent } from "./platform.functions-CG6gbu1e.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { I as ImageCropper } from "./ImageCropper-tEh58K4K.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { w as whatsappLink } from "./notify-BwRXED2l.mjs";
import {
  e as exportToCSV,
  a as exportToExcel,
  b as exportToPDF,
} from "./export-helper-S9aO-V4l.mjs";
import "../_libs/seroval.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  a3 as Plus,
  y as Download,
  as as Users,
  aq as UserCheck,
  ae as ShieldAlert,
  ap as User,
  U as Mail,
  a1 as Phone,
  z as ExternalLink,
  al as Trash,
  j as Camera,
} from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/scheduler.mjs";
import "../_libs/isbot.mjs";
import "./server-DOPhEqh1.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CDUZ4KwQ.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/recharts.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
import "fs";
import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
async function optimizeImage(file, maxDimension = 800, quality = 0.8, maxSizeBytes = 500 * 1024) {
  return new Promise((resolve, reject) => {
    if (!window.FileReader || !window.HTMLCanvasElement) {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Could not construct 2D canvas context."));
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Canvas export returned empty blob."));
            }
            if (blob.size > maxSizeBytes) {
              canvas.toBlob(
                (lowQualityBlob) => {
                  if (lowQualityBlob && lowQualityBlob.size <= maxSizeBytes) {
                    resolve(lowQualityBlob);
                  } else {
                    reject(
                      new Error(
                        `Image is too large (${Math.round(
                          blob.size / 1024,
                        )}KB). Compressed version exceeds maximum allowed size of 500KB.`,
                      ),
                    );
                  }
                },
                "image/webp",
                0.5,
              );
            } else {
              resolve(blob);
            }
          },
          "image/webp",
          quality,
        );
      };
      img.onerror = () => reject(new Error("Could not parse image source."));
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
  });
}
function KpiWidget({ title, count, subtext, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className:
      "bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-xs",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "space-y-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground",
            children: title,
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
            className: "text-2xl font-bold text-foreground",
            children: count,
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-[10px] text-muted-foreground",
            children: subtext,
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "size-10 bg-secondary rounded-lg flex items-center justify-center",
        children: icon,
      }),
    ],
  });
}
function StudentsPage() {
  const { currentSchoolId: effectiveSchoolId, roles, loading: tenantLoading } = useTenant();
  const schoolId = effectiveSchoolId;
  const isSuper = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuper;
  usePageTitle("Students & Parents");
  const [classes, setClasses] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const [debouncedQ, setDebouncedQ] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const [pageSize] = reactExports.useState(10);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [filterClassId, setFilterClassId] = reactExports.useState("all");
  const [totalEnrolled, setTotalEnrolled] = reactExports.useState(0);
  const [totalPhotos, setTotalPhotos] = reactExports.useState(0);
  const [missingPhotos, setMissingPhotos] = reactExports.useState(0);
  const [bulkImportOpen, setBulkImportOpen] = reactExports.useState(false);
  const [bulkPhotoOpen, setBulkPhotoOpen] = reactExports.useState(false);
  const [csvFile, setCsvFile] = reactExports.useState(null);
  const [csvUploading, setCsvUploading] = reactExports.useState(false);
  const [photoFiles, setPhotoFiles] = reactExports.useState(null);
  const [photoUploading, setPhotoUploading] = reactExports.useState(false);
  const [photoProgress, setPhotoProgress] = reactExports.useState({
    current: 0,
    total: 0,
  });
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);
  const loadKPIs = async () => {
    if (!effectiveSchoolId) return;
    const { count } = await supabase
      .from("students")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null);
    setTotalEnrolled(count ?? 0);
    const { count: photoCount } = await supabase
      .from("students")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null)
      .not("photo_url", "is", null);
    setTotalPhotos(photoCount ?? 0);
    setMissingPhotos((count ?? 0) - (photoCount ?? 0));
  };
  const load = async () => {
    if (!effectiveSchoolId) return;
    setBusy(true);
    try {
      let query = supabase
        .from("students")
        .select(
          "id, full_name, roll_number, admission_number, photo_url, parent_email, parent_phone, parent_name, parent_user_id, class_id, classes(name)",
          {
            count: "exact",
          },
        )
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null);
      if (debouncedQ.trim()) {
        query = query.ilike("full_name", `%${debouncedQ.trim()}%`);
      }
      if (filterClassId === "_none") {
        query = query.is("class_id", null);
      } else if (filterClassId !== "all") {
        query = query.eq("class_id", filterClassId);
      }
      const start = page * pageSize;
      const end = start + pageSize - 1;
      const { data, count, error } = await query.order("full_name").range(start, end);
      if (error) throw error;
      setTotalCount(count ?? 0);
      setStudents(
        (data ?? []).map((s) => ({
          ...s,
          classes: Array.isArray(s.classes) ? (s.classes[0] ?? null) : s.classes,
        })),
      );
    } catch (err) {
      toast.error(err.message || "Failed to load students.");
    } finally {
      setBusy(false);
    }
  };
  reactExports.useEffect(() => {
    void load();
    void loadKPIs();
  }, [effectiveSchoolId, debouncedQ, page, filterClassId]);
  reactExports.useEffect(() => {
    if (!effectiveSchoolId) return;
    supabase
      .from("classes")
      .select("id, name, grade, section")
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null)
      .order("name")
      .then(({ data }) => {
        setClasses(data ?? []);
        if (data?.[0] && !classId) setClassId(data[0].id);
      });
  }, [effectiveSchoolId]);
  const parseCSV = (text) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === "," && !inQuotes) {
        row.push("");
      } else if ((c === "\r" || c === "\n") && !inQuotes) {
        if (c === "\r" && next === "\n") {
          i++;
        }
        lines.push(row.map((cell) => cell.trim().replace(/^["']|["']$/g, "")));
        row = [""];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row.map((cell) => cell.trim().replace(/^["']|["']$/g, "")));
    }
    return lines;
  };
  const handleCSVImport = async (e) => {
    e.preventDefault();
    if (!csvFile || !effectiveSchoolId) return;
    setCsvUploading(true);
    try {
      const text = await csvFile.text();
      const rows = parseCSV(text);
      if (rows.length < 2) {
        throw new Error("CSV file must contain a header row and at least one student data row.");
      }
      const headerRow = rows[0];
      const dataRows = rows.slice(1);
      const colMap = {};
      headerRow.forEach((h, idx) => {
        const name = h.toLowerCase().replace(/[^a-z0-9]/g, "");
        colMap[name] = idx;
      });
      const getVal = (row, keys) => {
        for (const k of keys) {
          const idx = colMap[k];
          if (idx !== void 0 && row[idx]) return row[idx];
        }
        return "";
      };
      const batchStudents = [];
      for (const row of dataRows) {
        if (row.length === 0 || (row.length === 1 && row[0] === "")) continue;
        const fullName2 = getVal(row, ["fullname", "name", "studentname", "student"]);
        if (!fullName2) continue;
        const admissionNo = getVal(row, ["admissionnumber", "admissionno", "admission", "id"]);
        const rollNo = getVal(row, ["rollnumber", "rollno", "roll"]);
        const className = getVal(row, ["class", "classname", "section", "grade"]);
        const parentName2 = getVal(row, ["parentname", "parent", "fathername", "mothername"]);
        const parentEmail2 = getVal(row, ["parentemail", "email", "parentmail"]);
        const parentPhone2 = getVal(row, ["parentphone", "phone", "parentwhatsapp", "whatsapp"]);
        const cls = classes.find((c) => c.name.toLowerCase() === className.toLowerCase());
        const class_id = cls ? cls.id : classes[0]?.id || null;
        batchStudents.push({
          school_id: effectiveSchoolId,
          full_name: fullName2,
          admission_number: admissionNo || `ADM-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
          roll_number: rollNo || null,
          class_id,
          parent_name: parentName2 || null,
          parent_email: parentEmail2 || null,
          parent_phone: parentPhone2 || null,
          photo_url: null,
        });
      }
      if (batchStudents.length === 0) {
        throw new Error(
          "No valid student rows found in the CSV. Make sure you have a 'name' or 'fullname' header column.",
        );
      }
      const { error } = await supabase.from("students").insert(batchStudents);
      if (error) throw error;
      toast.success(`Successfully imported ${batchStudents.length} students!`);
      setBulkImportOpen(false);
      setCsvFile(null);
      void load();
      void loadKPIs();
    } catch (err) {
      toast.error(err.message || "Failed to import CSV.");
    } finally {
      setCsvUploading(false);
    }
  };
  const handleBulkPhotoUpload = async (e) => {
    e.preventDefault();
    if (!photoFiles || photoFiles.length === 0 || !effectiveSchoolId) return;
    setPhotoUploading(true);
    setPhotoProgress({
      current: 0,
      total: photoFiles.length,
    });
    let successCount = 0;
    try {
      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        setPhotoProgress((prev) => ({
          ...prev,
          current: i + 1,
        }));
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        const queryTerm = nameWithoutExt.toLowerCase().trim();
        const match = students.find(
          (s) =>
            (s.admission_number && s.admission_number.toLowerCase().trim() === queryTerm) ||
            (s.roll_number && s.roll_number.toLowerCase().trim() === queryTerm) ||
            (s.full_name && s.full_name.toLowerCase().trim() === queryTerm),
        );
        if (!match) continue;
        const optimizedBlob = await optimizeImage(file, 400, 0.8, 200 * 1024);
        const path = `${effectiveSchoolId}/student/bulk-${match.id}-${Date.now()}.webp`;
        const { error: uploadErr } = await supabase.storage
          .from("student-photos")
          .upload(path, optimizedBlob, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: true,
          });
        if (uploadErr) continue;
        const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);
        const { error: dbErr } = await supabase
          .from("students")
          .update({
            photo_url: pubUrl.publicUrl,
          })
          .eq("id", match.id)
          .eq("school_id", effectiveSchoolId);
        if (dbErr) continue;
        successCount++;
      }
      toast.success(`Successfully uploaded and matched ${successCount} student photos!`);
      setBulkPhotoOpen(false);
      setPhotoFiles(null);
      void load();
      void loadKPIs();
    } catch (err) {
      toast.error(err.message || "Photo sync encountered errors.");
    } finally {
      setPhotoUploading(false);
    }
  };
  const [fullName, setFullName] = reactExports.useState("");
  const [admissionNumber, setAdmissionNumber] = reactExports.useState("");
  const [rollNumber, setRollNumber] = reactExports.useState("");
  const [classId, setClassId] = reactExports.useState("");
  const [parentName, setParentName] = reactExports.useState("");
  const [parentEmail, setParentEmail] = reactExports.useState("");
  const [parentPhone, setParentPhone] = reactExports.useState("");
  const [parentPassword, setParentPassword] = reactExports.useState("");
  const provisionStudentFn = useServerFn(provisionStudent);
  reactExports.useEffect(() => {
    if (!open) return;
    if (admissionNumber) return;
    const year = /* @__PURE__ */ new Date().getFullYear();
    const existing = students
      .map((s) => s.admission_number)
      .filter((a) => !!a && a.startsWith(`${year}-`))
      .map((a) => parseInt(a.split("-")[1] ?? "0", 10))
      .filter((n) => !Number.isNaN(n));
    const next = (existing.length ? Math.max(...existing) : 0) + 1;
    setAdmissionNumber(`${year}-${String(next).padStart(4, "0")}`);
  }, [open]);
  const [cropTarget, setCropTarget] = reactExports.useState(null);
  const [croppedPhoto, setCroppedPhoto] = reactExports.useState(null);
  const submit = async (e) => {
    e.preventDefault();
    if (!schoolId || !classId) return;
    if (parentPassword && !parentEmail) {
      return toast.error("Enter parent email to create a parent login.");
    }
    if (parentPassword && parentPassword.length < 8) {
      return toast.error("Parent password must be at least 8 characters.");
    }
    setBusy(true);
    try {
      let finalPhotoUrl = null;
      if (croppedPhoto) {
        const byteString = atob(croppedPhoto.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], {
          type: "image/jpeg",
        });
        const file = new File([blob], "avatar.jpg", {
          type: "image/jpeg",
        });
        const optimized = await optimizeImage(file, 300, 0.8, 150 * 1024);
        const path = `${schoolId}/student/admission-${Date.now()}.webp`;
        const { error: uploadErr } = await supabase.storage
          .from("student-photos")
          .upload(path, optimized, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: true,
          });
        if (uploadErr) throw uploadErr;
        const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);
        finalPhotoUrl = pubUrl.publicUrl;
      }
      const res = await provisionStudentFn({
        data: {
          student: {
            full_name: fullName,
            admission_number: admissionNumber || null,
            roll_number: rollNumber || null,
            class_id: classId,
            photo_url: finalPhotoUrl,
          },
          parent: {
            full_name: parentName || null,
            email: parentEmail || null,
            phone: parentPhone || null,
            password: parentPassword || null,
          },
        },
      });
      toast.success(
        res.parent_account_created
          ? "Student added & parent login created."
          : res.parent_user_id
            ? "Student added & linked to existing parent account."
            : "Student added.",
      );
      setOpen(false);
      setFullName("");
      setAdmissionNumber("");
      setRollNumber("");
      setParentName("");
      setParentEmail("");
      setParentPhone("");
      setParentPassword("");
      setCroppedPhoto(null);
      setCropTarget(null);
      void load();
      void loadKPIs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add student");
    } finally {
      setBusy(false);
    }
  };
  const handleExport = async (format) => {
    if (!effectiveSchoolId) return;
    toast.info("Preparing data for export...");
    const { data, error } = await supabase
      .from("students")
      .select("admission_number, full_name, roll_number, parent_name, parent_email, parent_phone")
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null)
      .order("full_name");
    if (error || !data) {
      return toast.error("Failed to load export data.");
    }
    const headers = [
      "Admission No",
      "Student Name",
      "Roll No",
      "Parent Name",
      "Parent Email",
      "Parent Phone",
    ];
    const rows = data.map((s) => [
      s.admission_number,
      s.full_name,
      s.roll_number,
      s.parent_name,
      s.parent_email,
      s.parent_phone,
    ]);
    if (format === "csv") exportToCSV("Student_Roster", headers, rows);
    else if (format === "excel") exportToExcel("Student_Roster", headers, rows);
    else if (format === "pdf")
      exportToPDF("Student_Roster", "Enrolled Students Directory", headers, rows);
    toast.success("Download started!");
  };
  const handleSoftDelete = async (id, name) => {
    if (!effectiveSchoolId) return;
    if (
      !confirm(`Are you sure you want to delete ${name}? This will move them to the Recycle Bin.`)
    )
      return;
    try {
      const { error } = await supabase
        .from("students")
        .update({
          deleted_at: /* @__PURE__ */ new Date().toISOString(),
        })
        .eq("id", id)
        .eq("school_id", effectiveSchoolId);
      if (error) throw error;
      toast.success(`${name} has been soft-deleted.`);
      void load();
      void loadKPIs();
    } catch (err) {
      toast.error(err.message || "Failed to delete student.");
    }
  };
  if (tenantLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading...",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Students & Parents",
        breadcrumb: `${totalEnrolled} enrolled`,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
              value: q,
              onChange: (e) => setQ(e.target.value),
              placeholder: "Search name, admission #, parent…",
              className:
                "px-3 py-1.5 text-sm border border-border rounded-md bg-card w-64 text-foreground outline-none",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              onClick: () => setBulkImportOpen(true),
              className:
                "px-3 py-1.5 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer",
              children: "Import CSV",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              onClick: () => setBulkPhotoOpen(true),
              className:
                "px-3 py-1.5 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer",
              children: "Upload Photos",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
              onClick: () => setOpen(true),
              disabled: classes.length === 0,
              className:
                "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
                " Add Student",
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className:
                "flex gap-1 border border-border rounded-md overflow-hidden bg-card text-card-foreground shrink-0 shadow-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  onClick: () => handleExport("csv"),
                  className: "p-1.5 hover:bg-secondary transition-colors",
                  title: "Export CSV",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                    className: "size-4 text-muted-foreground",
                  }),
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  onClick: () => handleExport("excel"),
                  className:
                    "p-1.5 hover:bg-secondary border-l border-border transition-colors text-xs font-bold",
                  title: "Export Excel",
                  children: "XLS",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  onClick: () => handleExport("pdf"),
                  className:
                    "p-1.5 hover:bg-secondary border-l border-border transition-colors text-xs font-bold",
                  title: "Export PDF",
                  children: "PDF",
                }),
              ],
            }),
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KpiWidget, {
                title: "Total Students",
                count: totalEnrolled,
                subtext: "Enrolled active profiles",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {
                  className: "size-5 text-brand",
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(KpiWidget, {
                title: "Students with Photos",
                count: totalPhotos,
                subtext: "Valid photos",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, {
                  className: "size-5 text-success",
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(KpiWidget, {
                title: "Missing Photos",
                count: missingPhotos,
                subtext: "Requires upload",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, {
                  className: "size-5 text-danger",
                }),
              }),
            ],
          }),
          classes.length > 0 &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "mb-5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                  className:
                    "text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2",
                  children: "Filter by class",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex flex-wrap gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                      onClick: () => {
                        setFilterClassId("all");
                        setPage(0);
                      },
                      className: `px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${filterClassId === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground border-border hover:bg-secondary"}`,
                      children: [
                        "All ",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                          className: "opacity-70",
                          children: ["(", totalEnrolled, ")"],
                        }),
                      ],
                    }),
                    classes.map((c) =>
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          onClick: () => {
                            setFilterClassId(c.id);
                            setPage(0);
                          },
                          className: `px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${filterClassId === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground border-border hover:bg-secondary"}`,
                          children: c.name,
                        },
                        c.id,
                      ),
                    ),
                  ],
                }),
              ],
            }),
          busy && students.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center py-12 text-muted-foreground text-sm",
                children: "Loading records from database...",
              })
            : students.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {
                      className: "size-10 mx-auto text-muted-foreground",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-semibold mt-3",
                      children: totalEnrolled === 0 ? "No students yet" : "No matches",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-sm text-muted-foreground mt-1",
                      children:
                        classes.length === 0 ? "Create a class first." : "Add your first student.",
                    }),
                  ],
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                      className: "w-full text-left text-sm",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                          className: "bg-secondary/50 text-xs text-muted-foreground",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "px-6 py-3 font-medium",
                                children: "Admission #",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "px-6 py-3 font-medium",
                                children: "Student",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "px-6 py-3 font-medium",
                                children: "Class",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "px-6 py-3 font-medium",
                                children: "Roll",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "px-6 py-3 font-medium",
                                children: "Parent",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "px-6 py-3 font-medium text-right",
                                children: "Actions",
                              }),
                            ],
                          }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                          className: "divide-y divide-border",
                          children: students.map((s) => {
                            const wa = whatsappLink(
                              s.parent_phone,
                              `Hello ${s.parent_name ?? ""}, this is regarding ${s.full_name}.`,
                            );
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "tr",
                              {
                                className: "hover:bg-secondary/40 transition-colors",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 font-mono text-xs text-foreground",
                                    children: s.admission_number ?? "—",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 font-medium text-foreground",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                                      to: "/students/$studentId",
                                      params: {
                                        studentId: s.id,
                                      },
                                      className: "hover:text-brand flex items-center gap-3",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                          className:
                                            "size-8 rounded-full border border-border bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0",
                                          children: s.photo_url
                                            ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                src: s.photo_url,
                                                alt: "",
                                                className: "size-full object-cover",
                                                loading: "lazy",
                                              })
                                            : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                                                className: "size-4 text-slate-400",
                                              }),
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          children: s.full_name,
                                        }),
                                      ],
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 text-muted-foreground",
                                    children: s.classes?.name ?? "—",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 text-muted-foreground",
                                    children: s.roll_number ?? "—",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "space-y-0.5",
                                      children: [
                                        s.parent_name &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className: "text-xs font-medium text-foreground",
                                            children: s.parent_name,
                                          }),
                                        s.parent_email &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                            className:
                                              "inline-flex items-center gap-1 text-xs text-muted-foreground",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, {
                                                className: "size-3",
                                              }),
                                              " ",
                                              s.parent_email,
                                              s.parent_user_id
                                                ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "ml-1 text-[10px] bg-success-soft text-success px-1.5 py-0.5 rounded font-semibold",
                                                    children: "Linked",
                                                  })
                                                : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "ml-1 text-[10px] bg-warning-soft text-warning px-1.5 py-0.5 rounded font-semibold",
                                                    children: "Pending",
                                                  }),
                                            ],
                                          }),
                                        s.parent_phone &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                            className:
                                              "inline-flex items-center gap-1 text-xs text-muted-foreground",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, {
                                                className: "size-3",
                                              }),
                                              " ",
                                              s.parent_phone,
                                            ],
                                          }),
                                        !s.parent_email &&
                                          !s.parent_phone &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className: "text-xs text-muted-foreground",
                                            children: "—",
                                          }),
                                      ],
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 text-right",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex justify-end gap-3 items-center",
                                      children: [
                                        wa &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
                                            href: wa,
                                            target: "_blank",
                                            rel: "noreferrer",
                                            className:
                                              "text-xs font-medium text-[#25D366] inline-flex items-center gap-1 hover:underline",
                                            title: "WhatsApp parent",
                                            children: "WhatsApp",
                                          }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                                          to: "/students/$studentId",
                                          params: {
                                            studentId: s.id,
                                          },
                                          className:
                                            "text-xs font-medium text-brand inline-flex items-center gap-1 hover:underline",
                                          children: [
                                            "Profile ",
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, {
                                              className: "size-3",
                                            }),
                                          ],
                                        }),
                                        isAdmin &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                            onClick: () => handleSoftDelete(s.id, s.full_name),
                                            className:
                                              "text-xs font-medium text-danger hover:text-red-700 inline-flex items-center gap-1 cursor-pointer",
                                            title: "Delete Student",
                                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, {
                                              className: "size-3.5",
                                            }),
                                          }),
                                      ],
                                    }),
                                  }),
                                ],
                              },
                              s.id,
                            );
                          }),
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "flex items-center justify-between p-4 bg-secondary/10 border-t border-border",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                          className: "text-xs text-muted-foreground",
                          children: [
                            "Showing ",
                            totalCount > 0 ? page * pageSize + 1 : 0,
                            " to ",
                            Math.min((page + 1) * pageSize, totalCount),
                            " of ",
                            totalCount,
                            " records",
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                              disabled: page === 0,
                              onClick: () => setPage((p) => p - 1),
                              className:
                                "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                              children: "Previous",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                              disabled: (page + 1) * pageSize >= totalCount,
                              onClick: () => setPage((p) => p + 1),
                              className:
                                "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                              children: "Next",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-xs text-muted-foreground mt-4",
            children:
              "Parent's email auto-links to their school account on signup. Admission number is unique per school.",
          }),
        ],
      }),
      open &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: submit,
            className:
              "bg-card text-card-foreground rounded-xl p-6 w-full max-w-xl space-y-4 shadow-lg max-h-[90vh] overflow-y-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-lg",
                children: "Add Student",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "flex flex-col gap-2 p-3 border border-border rounded-lg bg-secondary/20",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className: "text-xs font-semibold text-muted-foreground uppercase",
                    children: "Student Photo",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center gap-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className:
                          "size-16 rounded-full border border-border bg-card overflow-hidden flex items-center justify-center relative shadow-sm shrink-0",
                        children: croppedPhoto
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                              src: croppedPhoto,
                              alt: "Preview",
                              className: "size-full object-cover",
                            })
                          : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                              className: "size-8 text-muted-foreground",
                            }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex-grow",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                            className:
                              "px-3 py-1.5 text-xs bg-primary text-primary-foreground font-semibold rounded-md cursor-pointer hover:opacity-90 inline-flex items-center gap-1",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, {
                                className: "size-3.5",
                              }),
                              " Select Photo",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                type: "file",
                                accept: "image/*",
                                onChange: (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => setCropTarget(reader.result);
                                    reader.readAsDataURL(file);
                                  }
                                },
                                className: "hidden",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-[10px] text-muted-foreground mt-1",
                            children: "Supports JPG, PNG, WEBP. Will be cropped automatically.",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "col-span-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium",
                        children: "Full name *",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        required: true,
                        value: fullName,
                        onChange: (e) => setFullName(e.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium",
                        children: "Admission # *",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        required: true,
                        value: admissionNumber,
                        onChange: (e) => setAdmissionNumber(e.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm font-mono border border-border rounded-md bg-background text-foreground",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium",
                        children: "Roll #",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: rollNumber,
                        onChange: (e) => setRollNumber(e.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "col-span-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium",
                        children: "Class *",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                        required: true,
                        value: classId,
                        onChange: (e) => setClassId(e.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                        children: classes.map((c) => {
                          const suffix = [c.grade, c.section].filter(Boolean).join(" · ");
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "option",
                            { value: c.id, children: [c.name, suffix ? ` — ${suffix}` : ""] },
                            c.id,
                          );
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "pt-2 border-t border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className:
                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                    children: "Parent / Guardian",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "col-span-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Parent name",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            value: parentName,
                            onChange: (e) => setParentName(e.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Parent email",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            type: "email",
                            value: parentEmail,
                            onChange: (e) => setParentEmail(e.target.value),
                            placeholder: "parent@example.com",
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Parent WhatsApp #",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            value: parentPhone,
                            onChange: (e) => setParentPhone(e.target.value),
                            placeholder: "+919876543210",
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "col-span-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Parent login password",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            type: "text",
                            value: parentPassword,
                            onChange: (e) => setParentPassword(e.target.value),
                            placeholder: "Min 8 characters — leave blank to skip",
                            className:
                              "mt-1 w-full px-3 py-2 text-sm font-mono border border-border rounded-md bg-background text-foreground",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-xs text-muted-foreground mt-1",
                            children:
                              "Optional. If set together with parent email, a parent login is created so they can sign in and view homework, attendance and remarks.",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 justify-end pt-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => {
                      setOpen(false);
                      setCroppedPhoto(null);
                      setCropTarget(null);
                    },
                    className:
                      "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    disabled: busy,
                    className:
                      "px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50 cursor-pointer",
                    children: busy ? "Adding…" : "Add Student",
                  }),
                ],
              }),
            ],
          }),
        }),
      cropTarget &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]",
          onClick: (e) => e.stopPropagation(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-card p-6 rounded-xl w-full max-w-sm",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                className: "font-bold text-base mb-3 text-card-foreground",
                children: "Crop Student Photo",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCropper, {
                imageSrc: cropTarget,
                onCrop: (cropped) => {
                  setCroppedPhoto(cropped);
                  setCropTarget(null);
                },
                onCancel: () => setCropTarget(null),
                circular: true,
              }),
            ],
          }),
        }),
      bulkImportOpen &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
          onClick: () => setBulkImportOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: handleCSVImport,
            className:
              "bg-card text-card-foreground rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-lg",
                children: "Bulk Student Import (CSV)",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                className: "text-xs text-muted-foreground",
                children: [
                  "Import multiple students instantly. Your CSV should have columns like: ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                    children:
                      "name, admission_no, roll_no, class_name, parent_name, parent_email, parent_phone",
                  }),
                  ".",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Select CSV File *",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    type: "file",
                    accept: ".csv",
                    required: true,
                    onChange: (e) => setCsvFile(e.target.files?.[0] || null),
                    className: "mt-1 w-full text-xs text-foreground",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 justify-end pt-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => {
                      setBulkImportOpen(false);
                      setCsvFile(null);
                    },
                    className:
                      "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    disabled: csvUploading,
                    className:
                      "px-4 py-2 text-sm font-semibold bg-brand text-brand-foreground rounded-md disabled:opacity-50 cursor-pointer",
                    children: csvUploading ? "Importing..." : "Run CSV Import",
                  }),
                ],
              }),
            ],
          }),
        }),
      bulkPhotoOpen &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
          onClick: () => setBulkPhotoOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: handleBulkPhotoUpload,
            className:
              "bg-card text-card-foreground rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-lg",
                children: "Bulk Photo Sync Upload",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                className: "text-xs text-muted-foreground",
                children: [
                  "Select multiple student photo files. The filename (e.g. ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "2026-0001.jpg" }),
                  " or ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "Aarav Sharma.png" }),
                  ") must match the student's **admission number**, **roll number**, or **full name** case-insensitively.",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Select Photo Files *",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    type: "file",
                    multiple: true,
                    accept: "image/*",
                    required: true,
                    onChange: (e) => setPhotoFiles(e.target.files),
                    className: "mt-1 w-full text-xs text-foreground",
                  }),
                ],
              }),
              photoUploading &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "w-full bg-secondary h-2 rounded-full overflow-hidden",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "bg-brand h-full transition-all duration-300",
                        style: {
                          width: `${Math.round((photoProgress.current / photoProgress.total) * 100)}%`,
                        },
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                      className: "text-[10px] text-center text-muted-foreground font-semibold",
                      children: [
                        "Uploading ",
                        photoProgress.current,
                        " of ",
                        photoProgress.total,
                        " photos...",
                      ],
                    }),
                  ],
                }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 justify-end pt-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => {
                      setBulkPhotoOpen(false);
                      setPhotoFiles(null);
                    },
                    className:
                      "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    disabled: photoUploading || !photoFiles,
                    className:
                      "px-4 py-2 text-sm font-semibold bg-brand text-brand-foreground rounded-md disabled:opacity-50 cursor-pointer",
                    children: photoUploading ? "Uploading & Syncing..." : "Sync Photos",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { StudentsPage as component };
