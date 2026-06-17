import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import {
  b as getStudentIdFallback,
  g as getStaffIdFallback,
  f as useTenant,
  c as usePageTitle,
  P as PageHeader,
  s as safeHtml2Canvas,
} from "./router-CplsJ0Ue.mjs";
import { I as ImageCropper } from "./ImageCropper-tEh58K4K.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as jspdf_node_minExports } from "../_libs/jspdf.mjs";
import { Q as QRCode } from "../_libs/qrcode.mjs";
import { J as JsBarcode } from "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import {
  ao as Trophy,
  ap as User,
  as as Users,
  aq as UserCheck,
  ae as ShieldAlert,
  t as ClipboardList,
  aj as Sparkles,
  L as History,
  H as FileDown,
  a4 as Printer,
  j as Camera,
  F as Eye,
  ab as Settings,
  N as Image,
  y as Download,
} from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
import "../_libs/zod.mjs";
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
function KpiWidget({ title, count, subtext, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5 flex items-center justify-between",
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
function Barcode({ value }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (canvasRef.current && value) {
      try {
        JsBarcode(canvasRef.current, value, {
          format: "CODE128",
          width: 1.2,
          height: 32,
          displayValue: false,
          margin: 0,
          background: "transparent",
          lineColor: "#000000",
        });
      } catch (err) {}
    }
  }, [value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", {
    ref: canvasRef,
    className: "max-h-8 max-w-full block",
  });
}
function QRCodeImage({ value, className }) {
  const [url, setUrl] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (value) {
      QRCode.toDataURL(value, {
        margin: 1,
        width: 100,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
        .then((u) => setUrl(u))
        .catch((err) => console.error("QR Code generation failed", err));
    }
  }, [value]);
  if (!url)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "size-10 bg-slate-100 animate-pulse rounded",
    });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: url, alt: "QR Code", className });
}
const currentAcademicYear = (() => {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return m >= 5 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
})();
function IdCardManagementPage() {
  const { currentSchoolId: schoolId, user, roles, loading: tenantLoading } = useTenant();
  roles.includes("admin") || roles.includes("super_admin");
  usePageTitle("ID Cards");
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [theme, setTheme] = reactExports.useState("modern-blue");
  const [orientation, setOrientation] = reactExports.useState("portrait");
  const [pdfExportMode, setPdfExportMode] = reactExports.useState("front-back");
  const [school, setSchool] = reactExports.useState(null);
  const [classes, setClasses] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [staff, setStaff] = reactExports.useState([]);
  const [visitors, setVisitors] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = reactExports.useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = reactExports.useState([]);
  const [studentSearch, setStudentSearch] = reactExports.useState("");
  const [studentClassFilter, setStudentClassFilter] = reactExports.useState("all");
  const [studentPhotoFilter, setStudentPhotoFilter] = reactExports.useState("all");
  const [staffSearch, setStaffSearch] = reactExports.useState("");
  const [staffDeptFilter, setStaffDeptFilter] = reactExports.useState("all");
  const [loading, setLoading] = reactExports.useState(true);
  const [exporting, setExporting] = reactExports.useState(false);
  const [bulkProgress, setBulkProgress] = reactExports.useState(null);
  const cancelRef = reactExports.useRef(false);
  const [cropTarget, setCropTarget] = reactExports.useState(null);
  const [newVisitor, setNewVisitor] = reactExports.useState({
    name: "",
    phone: "",
    purpose: "",
    host: "",
  });
  const [visitorPassPhoto, setVisitorPassPhoto] = reactExports.useState(null);
  const [editStudent, setEditStudent] = reactExports.useState(null);
  const [editStaff, setEditStaff] = reactExports.useState(null);
  const [previewCard, setPreviewCard] = reactExports.useState(null);
  const [flipped, setFlipped] = reactExports.useState(false);
  const [printLayout, setPrintLayout] = reactExports.useState("none");
  const [printTarget, setPrintTarget] = reactExports.useState(null);
  const loadData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const [
        schoolRes,
        classesRes,
        studentsRes,
        staffRes,
        visitorsRes,
        historyRes,
        rankingsRes,
        awardsRes,
      ] = await Promise.all([
        supabase
          .from("schools")
          .select(
            "id, name, school_name, logo_url, school_logo, address, phone_number, email, principal_name, principal_signature_url",
          )
          .eq("id", schoolId)
          .single(),
        supabase
          .from("classes")
          .select("id, name, section")
          .eq("school_id", schoolId)
          .order("name"),
        supabase
          .from("students")
          .select("*, classes(name, section)")
          .eq("school_id", schoolId)
          .order("full_name"),
        supabase.from("profiles").select("*").eq("school_id", schoolId),
        supabase.from("visitor_passes").select("*").eq("school_id", schoolId).order("created_at", {
          ascending: false,
        }),
        supabase
          .from("id_card_history")
          .select("*, profiles(full_name)")
          .eq("school_id", schoolId)
          .order("printed_at", {
            ascending: false,
          }),
        supabase
          .from("rankings")
          .select("student_id, rank_position, percentage, rank_type")
          .eq("school_id", schoolId),
        supabase.from("awards").select("student_id, category, title").eq("school_id", schoolId),
      ]);
      if (schoolRes.data) {
        setSchool({
          id: schoolRes.data.id,
          name: schoolRes.data.school_name || schoolRes.data.name,
          logo_url: schoolRes.data.school_logo || schoolRes.data.logo_url,
          address: schoolRes.data.address,
          phone_number: schoolRes.data.phone_number,
          email: schoolRes.data.email,
          principal_name: schoolRes.data.principal_name || "",
          principal_signature_url: schoolRes.data.principal_signature_url || null,
        });
      } else {
        setSchool(null);
      }
      setClasses(classesRes.data || []);
      const normStudents = (studentsRes.data || []).map((s) => {
        const studentRankings = (rankingsRes.data || []).filter((r) => r.student_id === s.id);
        const studentAwards = (awardsRes.data || []).filter((a) => a.student_id === s.id);
        return {
          ...s,
          classes: Array.isArray(s.classes) ? s.classes[0] || null : s.classes,
          rankings: studentRankings,
          awards: studentAwards,
        };
      });
      setStudents(normStudents);
      const rolesRes = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("school_id", schoolId);
      const staffIds = (rolesRes.data || [])
        .filter((r) => r.role === "admin" || r.role === "teacher")
        .map((r) => r.user_id);
      const normStaff = (staffRes.data || [])
        .filter((p) => staffIds.includes(p.user_id))
        .map((p) => ({
          user_id: p.user_id,
          full_name: p.full_name || "—",
          email: p.email,
          photo_url: p.photo_url,
          employee_id: p.employee_id,
          designation: p.designation,
          department: p.department,
          joining_date: p.joining_date,
          mobile_number: p.mobile_number,
          blood_group: p.blood_group,
          address: p.address,
          emergency_contact: p.emergency_contact,
          notes: p.notes,
        }));
      setStaff(normStaff);
      setVisitors(visitorsRes.data || []);
      setHistory(historyRes.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load ERP records.");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadData();
  }, [schoolId]);
  const handlePhotoUpload = (e, type, id) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropTarget({
        type,
        id,
        original: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };
  const saveCroppedPhoto = async (base64) => {
    if (!cropTarget) return;
    const { type, id } = cropTarget;
    setCropTarget(null);
    setLoading(true);
    try {
      let finalUrl = base64;
      if (type === "student" || type === "staff" || type === "school" || type === "signature") {
        try {
          const byteString = atob(base64.split(",")[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const isPng = type === "signature";
          const blob = new Blob([ab], {
            type: isPng ? "image/png" : "image/jpeg",
          });
          const ext = isPng ? "png" : "jpg";
          const path = `${id}.${ext}`;
          let bucket = "student-photos";
          if (type === "school") bucket = "school-logos";
          else if (type === "signature") bucket = "signatures";
          else if (type === "student" || type === "staff") bucket = "student-photos";
          const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, blob, {
            contentType: isPng ? "image/png" : "image/jpeg",
            cacheControl: "3600",
            upsert: true,
          });
          if (uploadErr) throw uploadErr;
          const { data: pubUrl } = supabase.storage.from(bucket).getPublicUrl(path);
          finalUrl = pubUrl.publicUrl;
        } catch (uploadErr) {
          console.error("Storage upload failed, falling back to base64:", uploadErr);
        }
      }
      if (type === "student") {
        const { error } = await supabase
          .from("students")
          .update({
            photo_url: finalUrl,
          })
          .eq("id", id)
          .eq("school_id", schoolId);
        if (error) throw error;
        toast.success("Student photo updated successfully.");
        if (editStudent && editStudent.id === id) {
          setEditStudent({
            ...editStudent,
            photo_url: finalUrl,
          });
        }
      } else if (type === "staff") {
        const { error } = await supabase
          .from("profiles")
          .update({
            photo_url: finalUrl,
          })
          .eq("user_id", id)
          .eq("school_id", schoolId);
        if (error) throw error;
        toast.success("Staff photo updated successfully.");
        if (editStaff && editStaff.user_id === id) {
          setEditStaff({
            ...editStaff,
            photo_url: finalUrl,
          });
        }
      } else if (type === "school") {
        const { error } = await supabase
          .from("schools")
          .update({
            logo_url: finalUrl,
          })
          .eq("id", id);
        if (error) throw error;
        toast.success("School logo updated.");
        if (school)
          setSchool({
            ...school,
            logo_url: finalUrl,
          });
      } else if (type === "signature") {
        const { error } = await supabase
          .from("schools")
          .update({
            principal_signature_url: finalUrl,
          })
          .eq("id", schoolId);
        if (error) throw error;
        toast.success("Principal signature updated successfully.");
        if (school)
          setSchool({
            ...school,
            principal_signature_url: finalUrl,
          });
      }
      void loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save cropped image.");
    } finally {
      setLoading(false);
    }
  };
  const handleCheckInVisitor = async (e) => {
    e.preventDefault();
    if (!schoolId) return;
    try {
      const year = /* @__PURE__ */ new Date().getFullYear();
      const passNo = `VP-${year}-${Math.floor(1e3 + Math.random() * 9e3)}`;
      let finalPhotoUrl = null;
      if (visitorPassPhoto && visitorPassPhoto.startsWith("data:")) {
        const base64 = visitorPassPhoto;
        const byteString = atob(base64.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], {
          type: "image/jpeg",
        });
        const photoPath = `${schoolId}/visitor/${passNo}-${Date.now()}.jpg`;
        const { error: uploadErr } = await supabase.storage
          .from("visitor-photos")
          .upload(photoPath, blob, {
            contentType: "image/jpeg",
            cacheControl: "3600",
            upsert: true,
          });
        if (uploadErr) throw uploadErr;
        const { data: pubUrl } = supabase.storage.from("visitor-photos").getPublicUrl(photoPath);
        finalPhotoUrl = pubUrl.publicUrl;
      }
      const { error } = await supabase.from("visitor_passes").insert({
        school_id: schoolId,
        visitor_name: newVisitor.name,
        contact_number: newVisitor.phone,
        purpose_of_visit: newVisitor.purpose,
        host_name: newVisitor.host,
        pass_number: passNo,
        photo_url: finalPhotoUrl,
      });
      if (error) throw error;
      toast.success("Visitor checked in successfully.");
      setNewVisitor({
        name: "",
        phone: "",
        purpose: "",
        host: "",
      });
      setVisitorPassPhoto(null);
      void loadData();
    } catch (err) {
      toast.error(err.message || "Failed to check in visitor.");
    }
  };
  const handleCheckOutVisitor = async (id) => {
    try {
      const { error } = await supabase
        .from("visitor_passes")
        .update({
          check_out_time: /* @__PURE__ */ new Date().toISOString(),
        })
        .eq("id", id)
        .eq("school_id", schoolId);
      if (error) throw error;
      toast.success("Visitor checked out.");
      void loadData();
    } catch (err) {
      toast.error(err.message || "Failed to check out visitor.");
    }
  };
  const handleSaveStudent = async (e) => {
    e.preventDefault();
    if (!editStudent) return;
    try {
      const { error } = await supabase
        .from("students")
        .update({
          full_name: editStudent.full_name,
          roll_number: editStudent.roll_number,
          admission_number: editStudent.admission_number,
          blood_group: editStudent.blood_group,
          emergency_contact: editStudent.emergency_contact,
          transport_route: editStudent.transport_route,
          bus_number: editStudent.bus_number,
          academic_year: editStudent.academic_year,
          date_of_birth: editStudent.date_of_birth,
          parent_name: editStudent.parent_name,
          parent_phone: editStudent.parent_phone,
        })
        .eq("id", editStudent.id)
        .eq("school_id", schoolId);
      if (error) throw error;
      toast.success("Student details saved.");
      setEditStudent(null);
      void loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save details.");
    }
  };
  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!editStaff) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          employee_id: editStaff.employee_id,
          designation: editStaff.designation,
          department: editStaff.department,
          blood_group: editStaff.blood_group,
          mobile_number: editStaff.mobile_number,
          emergency_contact: editStaff.emergency_contact,
          address: editStaff.address,
          notes: editStaff.notes,
        })
        .eq("user_id", editStaff.user_id)
        .eq("school_id", schoolId);
      if (error) throw error;
      toast.success("Staff details saved.");
      setEditStaff(null);
      void loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save details.");
    }
  };
  const logReprint = async (type, id, reason) => {
    if (!schoolId || !user) return;
    try {
      await supabase.from("id_card_history").insert({
        school_id: schoolId,
        card_type: type,
        holder_id: id,
        academic_year: currentAcademicYear,
        printed_by: user.id,
        reason,
      });
      void loadData();
    } catch (err) {}
  };
  const downloadSinglePDF = async (type, record, mode) => {
    setExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    const frontEl = document.getElementById(`id-card-preview-front-${record.id || record.user_id}`);
    const backEl = document.getElementById(`id-card-preview-back-${record.id || record.user_id}`);
    if (!frontEl || (!backEl && mode !== "front-only")) {
      toast.error("Preview card element not found.");
      setExporting(false);
      return;
    }
    try {
      const frontCanvas = await safeHtml2Canvas(frontEl, {
        scale: 4,
      });
      const frontImg = frontCanvas.toDataURL("image/jpeg", 0.95);
      let backImg = null;
      if (mode !== "front-only" && backEl) {
        const backCanvas = await safeHtml2Canvas(backEl, {
          scale: 4,
        });
        backImg = backCanvas.toDataURL("image/jpeg", 0.95);
      }
      const w = orientation === "portrait" ? 54 : 85.6;
      const h = orientation === "portrait" ? 85.6 : 54;
      if (mode === "side-by-side") {
        const pdf = new jspdf_node_minExports.jsPDF({
          orientation: orientation === "portrait" ? "landscape" : "portrait",
          unit: "mm",
          format: [w * 2, h],
        });
        pdf.addImage(frontImg, "JPEG", 0, 0, w, h);
        if (backImg) pdf.addImage(backImg, "JPEG", w, 0, w, h);
        pdf.save(`${record.full_name || record.visitor_name || "id"}_card.pdf`);
      } else {
        const pdf = new jspdf_node_minExports.jsPDF({
          orientation,
          unit: "mm",
          format: [w, h],
        });
        pdf.addImage(frontImg, "JPEG", 0, 0, w, h);
        if (mode === "front-back" && backImg) {
          pdf.addPage([w, h], orientation);
          pdf.addImage(backImg, "JPEG", 0, 0, w, h);
        }
        pdf.save(`${record.full_name || record.visitor_name || "id"}_card.pdf`);
      }
      toast.success("PDF exported successfully.");
      void logReprint(type, record.id || record.user_id, "Individual Download");
    } catch (err) {
      toast.error("Failed to generate PDF: " + err.message);
    } finally {
      setExporting(false);
    }
  };
  const downloadBulkPDF = async (type, mode) => {
    const list =
      type === "student"
        ? students.filter((s) => selectedStudentIds.includes(s.id))
        : staff.filter((t) => selectedStaffIds.includes(t.user_id));
    if (list.length === 0) {
      toast.error("Please select at least one record to generate.");
      return;
    }
    setExporting(true);
    cancelRef.current = false;
    setBulkProgress({
      current: 0,
      total: list.length,
      activeName: "",
    });
    toast.info(`Initializing bulk PDF generation...`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    try {
      const w = orientation === "portrait" ? 54 : 85.6;
      const h = orientation === "portrait" ? 85.6 : 54;
      let pdf;
      if (mode === "side-by-side") {
        pdf = new jspdf_node_minExports.jsPDF({
          orientation: orientation === "portrait" ? "landscape" : "portrait",
          unit: "mm",
          format: [w * 2, h],
        });
      } else {
        pdf = new jspdf_node_minExports.jsPDF({
          orientation,
          unit: "mm",
          format: [w, h],
        });
      }
      const batchSize = 10;
      let isFirstPage = true;
      for (let i = 0; i < list.length; i++) {
        if (cancelRef.current) {
          toast.warning("PDF generation cancelled.");
          break;
        }
        const rec = list[i];
        const activeName = rec.full_name || rec.visitor_name || "Card";
        setBulkProgress({
          current: i + 1,
          total: list.length,
          activeName,
        });
        const frontEl = document.getElementById(`bulk-card-front-${rec.id || rec.user_id}`);
        const backEl = document.getElementById(`bulk-card-back-${rec.id || rec.user_id}`);
        if (!frontEl) continue;
        const frontCanvas = await safeHtml2Canvas(frontEl, {
          scale: 4,
        });
        const frontImg = frontCanvas.toDataURL("image/jpeg", 0.85);
        let backImg = null;
        if (mode !== "front-only" && backEl) {
          const backCanvas = await safeHtml2Canvas(backEl, {
            scale: 4,
          });
          backImg = backCanvas.toDataURL("image/jpeg", 0.85);
        }
        if (mode === "side-by-side") {
          if (!isFirstPage)
            pdf.addPage([w * 2, h], orientation === "portrait" ? "landscape" : "portrait");
          pdf.addImage(frontImg, "JPEG", 0, 0, w, h);
          if (backImg) pdf.addImage(backImg, "JPEG", w, 0, w, h);
        } else {
          if (!isFirstPage) pdf.addPage([w, h], orientation);
          pdf.addImage(frontImg, "JPEG", 0, 0, w, h);
          if (mode === "front-back" && backImg) {
            pdf.addPage([w, h], orientation);
            pdf.addImage(backImg, "JPEG", 0, 0, w, h);
          }
        }
        isFirstPage = false;
        void logReprint(type, rec.id || rec.user_id, "Bulk Download");
        if (i % batchSize === 0 && i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 80));
        }
      }
      if (!cancelRef.current) {
        pdf.save(`bulk_${type}_cards.pdf`);
        toast.success(`Exported ${list.length} cards successfully.`);
      }
    } catch (err) {
      toast.error("Failed to export bulk PDF: " + err.message);
    } finally {
      setExporting(false);
      setBulkProgress(null);
    }
  };
  const handlePrint = (type, list, layout) => {
    setPrintTarget({
      type,
      list,
    });
    setPrintLayout(layout);
    setTimeout(() => {
      window.print();
      setPrintLayout("none");
      setPrintTarget(null);
      list.forEach((item) => {
        void logReprint(type, item.id || item.user_id, `Print (${layout.toUpperCase()})`);
      });
    }, 500);
  };
  const handleSelectEntireClass = () => {
    setSelectedStudentIds(filteredStudents.map((s) => s.id));
    toast.success(`Selected all ${filteredStudents.length} class students.`);
  };
  const handleSelectSchoolWide = () => {
    setSelectedStudentIds(students.map((s) => s.id));
    toast.success(`Selected all ${students.length} students school-wide.`);
  };
  const filteredStudents = students.filter((s) => {
    const term = studentSearch.toLowerCase();
    const matchesSearch =
      s.full_name.toLowerCase().includes(term) ||
      (s.admission_number || "").toLowerCase().includes(term) ||
      (s.roll_number || "").toLowerCase().includes(term);
    const matchesClass = studentClassFilter === "all" || s.class_id === studentClassFilter;
    let matchesPhoto = true;
    if (studentPhotoFilter === "missing") matchesPhoto = !s.photo_url;
    else if (studentPhotoFilter === "present") matchesPhoto = !!s.photo_url;
    return matchesSearch && matchesClass && matchesPhoto;
  });
  const filteredStaff = staff.filter((t) => {
    const term = staffSearch.toLowerCase();
    const matchesSearch =
      t.full_name.toLowerCase().includes(term) ||
      (t.employee_id || "").toLowerCase().includes(term);
    const matchesDept = staffDeptFilter === "all" || t.department === staffDeptFilter;
    return matchesSearch && matchesDept;
  });
  const departmentsList = Array.from(new Set(staff.map((t) => t.department).filter(Boolean)));
  const principalSignature = school?.principal_signature_url || null;
  const expiredCount = students.filter(
    (s) => s.academic_year && s.academic_year !== "2025-2026",
  ).length;
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
        title: "ID Cards",
        breadcrumb: "Card & Visitor Passes",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "flex bg-secondary rounded-md p-0.5",
          children: ["overview", "students", "staff", "visitors", "settings", "reports"].map((t) =>
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setActiveTab(t),
                className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition ${activeTab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                children: t,
              },
              t,
            ),
          ),
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 print:hidden",
        children: [
          activeTab === "overview" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "space-y-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KpiWidget, {
                      title: "Total Cards",
                      count: students.length + staff.length,
                      subtext: "Enrolled profiles",
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {
                        className: "size-5 text-brand",
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KpiWidget, {
                      title: "Visitor Passes",
                      count: visitors.length,
                      subtext: `${visitors.filter((v) => !v.check_out_time).length} active guests`,
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, {
                        className: "size-5 text-warning",
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KpiWidget, {
                      title: "Missing Photos",
                      count:
                        students.filter((s) => !s.photo_url).length +
                        staff.filter((t) => !t.photo_url).length,
                      subtext: "Requires upload",
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, {
                        className: "size-5 text-danger",
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KpiWidget, {
                      title: "Expired Cards",
                      count: expiredCount,
                      subtext: "Requires renewal",
                      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, {
                        className: "size-5 text-danger",
                      }),
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
                      className: "bg-card border border-border rounded-xl p-5 space-y-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex items-center gap-2 border-b border-border pb-3",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, {
                              className: "size-4 text-brand",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                              className: "font-semibold text-sm",
                              children: "Theme Settings",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                  className:
                                    "text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5",
                                  children: "Template Theme",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                  value: theme,
                                  onChange: (e) => setTheme(e.target.value),
                                  className:
                                    "w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "modern-blue",
                                      children: "Modern School Design (Vertical/Horizontal)",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "premium-corporate",
                                      children: "Premium Corporate Design",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "gold-premium",
                                      children: "Gold Premium Design",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "school-classic",
                                      children: "School Classic Design",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "minimal",
                                      children: "Minimalist Card Design",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                  className:
                                    "text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5",
                                  children: "Card Orientation Layout",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "grid grid-cols-2 gap-2",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                      onClick: () => setOrientation("portrait"),
                                      className: `py-2 text-xs font-medium rounded-md border text-center transition ${orientation === "portrait" ? "bg-brand text-white border-brand shadow-sm" : "bg-card border-border hover:bg-secondary"}`,
                                      children: "Vertical PVC Size",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                      onClick: () => setOrientation("landscape"),
                                      className: `py-2 text-xs font-medium rounded-md border text-center transition ${orientation === "landscape" ? "bg-brand text-white border-brand shadow-sm" : "bg-card border-border hover:bg-secondary"}`,
                                      children: "Horizontal PVC Size",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
                      className:
                        "lg:col-span-2 bg-card border border-border rounded-xl p-5 flex flex-col justify-between",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                              className: "font-semibold text-sm flex items-center gap-1.5",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                                  className: "size-4 text-amber-500",
                                }),
                                "Achievements Integration Active",
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-xs text-muted-foreground leading-relaxed",
                              children:
                                "This ID Card Module is fully integrated with the Achievements & Rankings system. If a student has a class rank of #1, #2, or #3 (e.g., Aarav Sharma is Rank #1), the front of their card will dynamically display a gold/silver/bronze academic topper medal. Scanning the card's QR code will load the public verification page, displaying real-time database credentials, card status (Active/Inactive), and official honors.",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex gap-2 pt-4 border-t border-border mt-4",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                              onClick: () => setActiveTab("students"),
                              className:
                                "px-3 py-2 text-xs bg-brand text-white rounded-md font-semibold",
                              children: "Manage Students",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                              onClick: () => setActiveTab("staff"),
                              className:
                                "px-3 py-2 text-xs bg-secondary hover:bg-secondary/70 border border-border rounded-md font-semibold text-foreground",
                              children: "Manage Staff",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                              onClick: () => setActiveTab("visitors"),
                              className:
                                "px-3 py-2 text-xs bg-secondary hover:bg-secondary/70 border border-border rounded-md font-semibold text-foreground",
                              children: "Guest passes",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
                  className: "bg-card border border-border rounded-xl overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "px-5 py-4 border-b border-border flex items-center justify-between",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                          className: "font-semibold text-sm flex items-center gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(History, {
                              className: "size-4 text-muted-foreground",
                            }),
                            "Recent Issuance & Reprint Logs",
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                          className: "text-xs text-muted-foreground",
                          children: [history.length, " records logged"],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "overflow-x-auto",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                        className: "w-full text-left text-xs",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                            className: "bg-secondary text-muted-foreground",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Date & Time",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Card Type",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Holder Reference ID",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Operator",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Issuance Reason",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Session",
                                }),
                              ],
                            }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                            className: "divide-y divide-border text-muted-foreground",
                            children: [
                              history.slice(0, 5).map((h) =>
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-secondary/20",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3 font-mono",
                                        children: new Date(h.printed_at).toLocaleString(),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3 font-semibold uppercase",
                                        children: h.card_type,
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3 font-mono",
                                        children: h.holder_id,
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3",
                                        children: h.profiles?.full_name || "Operator",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3",
                                        children: h.reason || "First Issue",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3",
                                        children: h.academic_year,
                                      }),
                                    ],
                                  },
                                  h.id,
                                ),
                              ),
                              history.length === 0 &&
                                /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    colSpan: 6,
                                    className: "text-center py-6 text-slate-400",
                                    children: "No print logs found.",
                                  }),
                                }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
          activeTab === "students" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "space-y-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex flex-wrap items-center gap-3",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          value: studentSearch,
                          onChange: (e) => setStudentSearch(e.target.value),
                          placeholder: "Search student name, adm #...",
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background w-48 focus:outline-none",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                          value: studentClassFilter,
                          onChange: (e) => setStudentClassFilter(e.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                              value: "all",
                              children: "All Classes",
                            }),
                            classes.map((c) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "option",
                                {
                                  value: c.id,
                                  children: [c.name, " ", c.section ? ` · ${c.section}` : ""],
                                },
                                c.id,
                              ),
                            ),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                          value: studentPhotoFilter,
                          onChange: (e) => setStudentPhotoFilter(e.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                              value: "all",
                              children: "All Photos",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                              value: "present",
                              children: "With Photo",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                              value: "missing",
                              children: "Missing Photo",
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: handleSelectEntireClass,
                          className:
                            "px-2.5 py-1.5 text-xs border border-border bg-secondary hover:bg-secondary/70 rounded-md font-semibold text-foreground inline-flex items-center gap-1",
                          children: "Select Class",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: handleSelectSchoolWide,
                          className:
                            "px-2.5 py-1.5 text-xs border border-border bg-secondary hover:bg-secondary/70 rounded-md font-semibold text-foreground inline-flex items-center gap-1",
                          children: "Select School-wide",
                        }),
                        selectedStudentIds.length > 0 &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex items-center gap-2 ml-2",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                className: "text-xs text-muted-foreground font-semibold",
                                children: [selectedStudentIds.length, " selected"],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                    value: pdfExportMode,
                                    onChange: (e) => setPdfExportMode(e.target.value),
                                    className:
                                      "bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2",
                                    style: {
                                      WebkitAppearance: "none",
                                      MozAppearance: "none",
                                    },
                                    title: "PDF Layout Options",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                        value: "front-back",
                                        children: "Front+Back",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                        value: "front-only",
                                        children: "Front Only",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                        value: "side-by-side",
                                        children: "Side-by-Side",
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                    onClick: () => downloadBulkPDF("student", pdfExportMode),
                                    disabled: exporting,
                                    className:
                                      "px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, {
                                        className: "size-3",
                                      }),
                                      " Export",
                                    ],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                onClick: () => {
                                  const list = students.filter((s) =>
                                    selectedStudentIds.includes(s.id),
                                  );
                                  handlePrint("student", list, "a4");
                                },
                                className:
                                  "px-3 py-1.5 text-xs bg-secondary border border-border rounded-md inline-flex items-center gap-1 text-foreground font-semibold",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, {
                                    className: "size-3",
                                  }),
                                  " A4 Grid Print",
                                ],
                              }),
                            ],
                          }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex border border-border rounded-md overflow-hidden bg-secondary ml-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                              onClick: () => setOrientation("portrait"),
                              className: `px-2.5 py-1.5 text-xs font-semibold ${orientation === "portrait" ? "bg-white shadow-sm" : ""}`,
                              children: "Vert",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                              onClick: () => setOrientation("landscape"),
                              className: `px-2.5 py-1.5 text-xs font-semibold ${orientation === "landscape" ? "bg-white shadow-sm" : ""}`,
                              children: "Horiz",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "bg-card border border-border rounded-xl overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                    className: "w-full text-left text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                        className: "bg-secondary text-muted-foreground",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 w-10",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                type: "checkbox",
                                checked:
                                  selectedStudentIds.length === filteredStudents.length &&
                                  filteredStudents.length > 0,
                                onChange: (e) => {
                                  if (e.target.checked) {
                                    setSelectedStudentIds(filteredStudents.map((s) => s.id));
                                  } else {
                                    setSelectedStudentIds([]);
                                  }
                                },
                                className: "rounded",
                              }),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Photo",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Student ID #",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Student Name",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Class / Section",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Blood Group",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Transport / Bus",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium text-right",
                              children: "Actions",
                            }),
                          ],
                        }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                        className: "divide-y divide-border",
                        children: [
                          filteredStudents.map((s) => {
                            const isTopper = s.rankings?.find((r) => r.rank_position <= 3);
                            const studentIdDisplay = getStudentIdFallback(s);
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "tr",
                              {
                                className: "hover:bg-secondary/20",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                      type: "checkbox",
                                      checked: selectedStudentIds.includes(s.id),
                                      onChange: (e) => {
                                        if (e.target.checked) {
                                          setSelectedStudentIds([...selectedStudentIds, s.id]);
                                        } else {
                                          setSelectedStudentIds(
                                            selectedStudentIds.filter((id) => id !== s.id),
                                          );
                                        }
                                      },
                                      className: "rounded",
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "relative group size-8 rounded bg-slate-100 border border-border overflow-hidden flex items-center justify-center flex-shrink-0",
                                      children: [
                                        s.photo_url
                                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                              src: s.photo_url,
                                              alt: "",
                                              className: "size-full object-cover",
                                            })
                                          : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                                              className: "size-4 text-slate-400",
                                            }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                                          className:
                                            "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, {
                                              className: "size-3 text-white",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                              type: "file",
                                              accept: "image/*",
                                              onChange: (e) =>
                                                handlePhotoUpload(e, "student", s.id),
                                              className: "hidden",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 font-mono font-semibold",
                                    children: studentIdDisplay,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex items-center gap-1.5",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className: "font-semibold text-foreground",
                                          children: s.full_name,
                                        }),
                                        isTopper &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                            className:
                                              "inline-flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold px-1 py-0.5 rounded",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                                                className: "size-2.5",
                                              }),
                                              " Rank ",
                                              isTopper.rank_position,
                                            ],
                                          }),
                                      ],
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                    className: "px-6 py-3",
                                    children: [
                                      s.classes?.name || "—",
                                      " ",
                                      s.classes?.section ? `(${s.classes.section})` : "",
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      className: "font-semibold text-red-500",
                                      children: s.blood_group || "—",
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                    className: "px-6 py-3 truncate max-w-[150px]",
                                    children: [
                                      s.transport_route || "—",
                                      " ",
                                      s.bus_number ? `(${s.bus_number})` : "",
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 text-right",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex justify-end gap-2",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                          onClick: () => {
                                            setPreviewCard({
                                              type: "student",
                                              data: s,
                                            });
                                            setFlipped(false);
                                          },
                                          className:
                                            "text-brand hover:underline inline-flex items-center gap-0.5 font-semibold",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, {
                                              className: "size-3",
                                            }),
                                            " Preview",
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                          onClick: () => setEditStudent(s),
                                          className: "text-brand hover:underline font-semibold",
                                          children: "Edit",
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              },
                              s.id,
                            );
                          }),
                          filteredStudents.length === 0 &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                colSpan: 8,
                                className: "text-center py-12 text-slate-400",
                                children: loading
                                  ? "Loading ERP roster..."
                                  : "No student records matching your filters found.",
                              }),
                            }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          activeTab === "staff" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "space-y-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex flex-wrap items-center gap-3",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          value: staffSearch,
                          onChange: (e) => setStaffSearch(e.target.value),
                          placeholder: "Search staff name, emp id...",
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background w-48 focus:outline-none",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                          value: staffDeptFilter,
                          onChange: (e) => setStaffDeptFilter(e.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                              value: "all",
                              children: "All Departments",
                            }),
                            departmentsList.map((d) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "option",
                                { value: d, children: d },
                                d,
                              ),
                            ),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "flex items-center gap-2",
                      children:
                        selectedStaffIds.length > 0 &&
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex items-center gap-2 mr-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                              className: "text-xs text-muted-foreground font-semibold",
                              children: [selectedStaffIds.length, " selected"],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                  value: pdfExportMode,
                                  onChange: (e) => setPdfExportMode(e.target.value),
                                  className:
                                    "bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2",
                                  style: {
                                    WebkitAppearance: "none",
                                    MozAppearance: "none",
                                  },
                                  title: "PDF Layout Options",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "front-back",
                                      children: "Front+Back",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "front-only",
                                      children: "Front Only",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "side-by-side",
                                      children: "Side-by-Side",
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                  onClick: () => downloadBulkPDF("staff", pdfExportMode),
                                  disabled: exporting,
                                  className:
                                    "px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, {
                                      className: "size-3",
                                    }),
                                    " Export",
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                              onClick: () => {
                                const list = staff.filter((t) =>
                                  selectedStaffIds.includes(t.user_id),
                                );
                                handlePrint("staff", list, "a4");
                              },
                              className:
                                "px-3 py-1.5 text-xs bg-secondary border border-border rounded-md inline-flex items-center gap-1 text-foreground font-semibold",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, {
                                  className: "size-3",
                                }),
                                " A4 Grid Print",
                              ],
                            }),
                          ],
                        }),
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "bg-card border border-border rounded-xl overflow-hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                    className: "w-full text-left text-xs",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                        className: "bg-secondary text-muted-foreground",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 w-10",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                type: "checkbox",
                                checked:
                                  selectedStaffIds.length === filteredStaff.length &&
                                  filteredStaff.length > 0,
                                onChange: (e) => {
                                  if (e.target.checked) {
                                    setSelectedStaffIds(filteredStaff.map((t) => t.user_id));
                                  } else {
                                    setSelectedStaffIds([]);
                                  }
                                },
                                className: "rounded",
                              }),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Photo",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Employee ID #",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Name",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Designation",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Department",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium",
                              children: "Contact Number",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "px-6 py-3 font-medium text-right",
                              children: "Actions",
                            }),
                          ],
                        }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                        className: "divide-y divide-border",
                        children: [
                          filteredStaff.map((t) => {
                            const staffIdDisplay = getStaffIdFallback(t);
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "tr",
                              {
                                className: "hover:bg-secondary/20",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                      type: "checkbox",
                                      checked: selectedStaffIds.includes(t.user_id),
                                      onChange: (e) => {
                                        if (e.target.checked) {
                                          setSelectedStaffIds([...selectedStaffIds, t.user_id]);
                                        } else {
                                          setSelectedStaffIds(
                                            selectedStaffIds.filter((id) => id !== t.user_id),
                                          );
                                        }
                                      },
                                      className: "rounded",
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "relative group size-8 rounded bg-slate-100 border border-border overflow-hidden flex items-center justify-center flex-shrink-0",
                                      children: [
                                        t.photo_url
                                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                              src: t.photo_url,
                                              alt: "",
                                              className: "size-full object-cover",
                                            })
                                          : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                                              className: "size-4 text-slate-400",
                                            }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                                          className:
                                            "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, {
                                              className: "size-3 text-white",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                              type: "file",
                                              accept: "image/*",
                                              onChange: (e) =>
                                                handlePhotoUpload(e, "staff", t.user_id),
                                              className: "hidden",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 font-mono font-semibold",
                                    children: staffIdDisplay,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 font-semibold text-foreground",
                                    children: t.full_name,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 font-medium",
                                    children: t.designation || "—",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: t.department || "—",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: t.mobile_number || "—",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 text-right",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex justify-end gap-2",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                          onClick: () => {
                                            setPreviewCard({
                                              type: "staff",
                                              data: t,
                                            });
                                            setFlipped(false);
                                          },
                                          className:
                                            "text-brand hover:underline inline-flex items-center gap-0.5 font-semibold",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, {
                                              className: "size-3",
                                            }),
                                            " Preview",
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                          onClick: () => setEditStaff(t),
                                          className: "text-brand hover:underline font-semibold",
                                          children: "Edit",
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              },
                              t.user_id,
                            );
                          }),
                          filteredStaff.length === 0 &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                colSpan: 8,
                                className: "text-center py-12 text-slate-400",
                                children: loading
                                  ? "Querying ERP records..."
                                  : "No matching staff records found.",
                              }),
                            }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          activeTab === "visitors" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
                  onSubmit: handleCheckInVisitor,
                  className: "bg-card border border-border rounded-xl p-5 space-y-4 h-fit",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-semibold text-sm border-b border-border pb-3",
                      children: "New Visitor Check-In",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-1.5 text-center",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                          className: "text-xs font-semibold text-muted-foreground block text-left",
                          children: "Visitor Snap (Optional)",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "size-20 rounded-lg bg-secondary border border-border overflow-hidden mx-auto flex items-center justify-center relative group",
                          children: [
                            visitorPassPhoto
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                  src: visitorPassPhoto,
                                  alt: "Visitor",
                                  className: "size-full object-cover",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, {
                                  className: "size-6 text-slate-400",
                                }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                              className:
                                "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className: "text-[10px] text-white font-medium",
                                  children: "Capture",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                  type: "file",
                                  accept: "image/*",
                                  onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = () => setVisitorPassPhoto(reader.result);
                                      reader.readAsDataURL(file);
                                    }
                                  },
                                  className: "hidden",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                          className: "text-xs font-semibold block mb-1",
                          children: "Visitor Full Name *",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          required: true,
                          value: newVisitor.name,
                          onChange: (e) =>
                            setNewVisitor({
                              ...newVisitor,
                              name: e.target.value,
                            }),
                          placeholder: "e.g. Ramesh Chandra",
                          className:
                            "w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                          className: "text-xs font-semibold block mb-1",
                          children: "Contact Number *",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          required: true,
                          value: newVisitor.phone,
                          onChange: (e) =>
                            setNewVisitor({
                              ...newVisitor,
                              phone: e.target.value,
                            }),
                          placeholder: "e.g. +91 99000 88000",
                          className:
                            "w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                          className: "text-xs font-semibold block mb-1",
                          children: "Purpose of Visit",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          value: newVisitor.purpose,
                          onChange: (e) =>
                            setNewVisitor({
                              ...newVisitor,
                              purpose: e.target.value,
                            }),
                          placeholder: "e.g. Admissions query",
                          className:
                            "w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                          className: "text-xs font-semibold block mb-1",
                          children: "Host Member",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          value: newVisitor.host,
                          onChange: (e) =>
                            setNewVisitor({
                              ...newVisitor,
                              host: e.target.value,
                            }),
                          placeholder: "e.g. Admin or Principal",
                          className:
                            "w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                      type: "submit",
                      className:
                        "w-full py-2 bg-brand text-white rounded-md text-xs font-semibold hover:opacity-90 transition",
                      children: "Issue Pass & Check In",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden h-fit",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "px-5 py-4 border-b border-border",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                        className: "font-semibold text-sm",
                        children: "Guest Logs",
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "overflow-x-auto",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                        className: "w-full text-left text-xs",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                            className: "bg-secondary text-muted-foreground",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Pass Number",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Visitor",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Purpose / Host",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Checked In",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium",
                                  children: "Checked Out",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-2.5 font-medium text-right",
                                  children: "Actions",
                                }),
                              ],
                            }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                            className: "divide-y divide-border",
                            children: [
                              visitors.map((v) =>
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-secondary/15",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className:
                                          "px-6 py-3 font-mono font-semibold text-slate-700",
                                        children: v.pass_number,
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                        className: "px-6 py-3",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                              v.photo_url
                                                ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                    src: v.photo_url,
                                                    alt: "",
                                                    className: "size-6 rounded object-cover",
                                                  })
                                                : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                                                    className: "size-4 text-slate-400",
                                                  }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className: "font-semibold text-foreground",
                                                children: v.visitor_name,
                                              }),
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[10px] text-muted-foreground block font-mono",
                                            children: v.contact_number,
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                        className: "px-6 py-3",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className: "font-medium text-foreground",
                                            children: v.purpose_of_visit || "—",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                            className: "text-[10px] text-muted-foreground",
                                            children: ["Host: ", v.host_name || "—"],
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3 text-muted-foreground font-mono",
                                        children: new Date(v.check_in_time).toLocaleTimeString(),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3 font-mono",
                                        children: v.check_out_time
                                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className: "text-slate-400",
                                              children: new Date(
                                                v.check_out_time,
                                              ).toLocaleTimeString(),
                                            })
                                          : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className:
                                                "text-emerald-500 font-semibold uppercase tracking-wider text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded",
                                              children: "Active",
                                            }),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "px-6 py-3 text-right",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex justify-end gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                              onClick: () => {
                                                setPreviewCard({
                                                  type: "visitor",
                                                  data: v,
                                                });
                                                setFlipped(false);
                                              },
                                              className:
                                                "text-brand hover:underline inline-flex items-center font-semibold",
                                              children: "Badge",
                                            }),
                                            !v.check_out_time &&
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                                onClick: () => handleCheckOutVisitor(v.id),
                                                className:
                                                  "text-danger hover:underline font-semibold",
                                                children: "Check Out",
                                              }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  },
                                  v.id,
                                ),
                              ),
                              visitors.length === 0 &&
                                /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    colSpan: 6,
                                    className: "text-center py-8 text-slate-400",
                                    children: "No visitors logged today.",
                                  }),
                                }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
          activeTab === "settings" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className:
                "max-w-2xl bg-card border border-border rounded-xl overflow-hidden p-6 space-y-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                  className:
                    "font-semibold text-sm border-b border-border pb-3 flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {
                      className: "size-4 text-brand",
                    }),
                    "School Details Settings",
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2 text-center border-r border-border pr-6",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                          className: "text-xs font-semibold block text-left mb-2",
                          children: "School Official Logo",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "size-24 rounded-xl bg-slate-50 border border-dashed border-border mx-auto flex items-center justify-center overflow-hidden relative group",
                          children: [
                            school?.logo_url
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                  src: school.logo_url,
                                  alt: "Logo",
                                  className: "size-full object-contain p-2",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, {
                                  className: "size-8 text-slate-400",
                                }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                              className:
                                "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className: "text-[10px] text-white font-medium",
                                  children: "Upload logo",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                  type: "file",
                                  accept: "image/*",
                                  onChange: (e) => handlePhotoUpload(e, "school", schoolId),
                                  className: "hidden",
                                }),
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                          className: "text-[10px] text-muted-foreground",
                          children: "Format: PNG/JPG square",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-2 text-center col-span-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                          className: "text-xs font-semibold block text-left mb-2",
                          children: "Principal Official Signature",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "h-24 w-full rounded-xl bg-slate-50 border border-dashed border-border flex items-center justify-center overflow-hidden relative group p-2",
                          children: [
                            principalSignature
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                  src: principalSignature,
                                  alt: "Signature",
                                  className: "h-full max-w-full object-contain",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "text-center",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, {
                                      className: "size-6 text-slate-400 mx-auto mb-1",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      className: "text-[11px] text-muted-foreground",
                                      children: "No signature uploaded",
                                    }),
                                  ],
                                }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                              className:
                                "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className: "text-xs text-white font-medium",
                                  children: "Upload Signature Image",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                  type: "file",
                                  accept: "image/*",
                                  onChange: (e) => handlePhotoUpload(e, "signature", schoolId),
                                  className: "hidden",
                                }),
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                          className: "text-[10px] text-muted-foreground text-left",
                          children: "Upload transparent PNG signature of the school principal.",
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
                  onSubmit: async (e) => {
                    e.preventDefault();
                    if (!school || !schoolId) return;
                    try {
                      const { error } = await supabase
                        .from("schools")
                        .update({
                          name: school.name,
                          address: school.address,
                          phone_number: school.phone_number,
                          email: school.email,
                          principal_name: school.principal_name || null,
                        })
                        .eq("id", schoolId);
                      if (error) throw error;
                      toast.success("School profile settings updated successfully.");
                      void loadData();
                    } catch (err) {
                      toast.error(err.message || "Failed to update settings.");
                    }
                  },
                  className: "space-y-4 pt-4 border-t border-border",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "grid grid-cols-2 gap-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "col-span-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold block mb-1",
                              children: "School Official Name",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              required: true,
                              value: school?.name || "",
                              onChange: (e) =>
                                setSchool((s) =>
                                  s
                                    ? {
                                        ...s,
                                        name: e.target.value,
                                      }
                                    : null,
                                ),
                              className:
                                "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "col-span-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold block mb-1",
                              children: "School Physical Address",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              required: true,
                              value: school?.address || "",
                              onChange: (e) =>
                                setSchool((s) =>
                                  s
                                    ? {
                                        ...s,
                                        address: e.target.value,
                                      }
                                    : null,
                                ),
                              className:
                                "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold block mb-1",
                              children: "School Contact Phone",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              value: school?.phone_number || "",
                              onChange: (e) =>
                                setSchool((s) =>
                                  s
                                    ? {
                                        ...s,
                                        phone_number: e.target.value,
                                      }
                                    : null,
                                ),
                              className:
                                "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold block mb-1",
                              children: "School Official Email",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              type: "email",
                              value: school?.email || "",
                              onChange: (e) =>
                                setSchool((s) =>
                                  s
                                    ? {
                                        ...s,
                                        email: e.target.value,
                                      }
                                    : null,
                                ),
                              className:
                                "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "col-span-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold block mb-1",
                              children: "School Principal Name",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              value: school?.principal_name || "",
                              onChange: (e) =>
                                setSchool((s) =>
                                  s
                                    ? {
                                        ...s,
                                        principal_name: e.target.value,
                                      }
                                    : null,
                                ),
                              className:
                                "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                              placeholder: "Enter Principal Name",
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "flex justify-end pt-2",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        type: "submit",
                        className:
                          "px-4 py-2 text-xs bg-brand text-white font-semibold rounded-md hover:opacity-90",
                        children: "Save School Settings",
                      }),
                    }),
                  ],
                }),
              ],
            }),
          activeTab === "reports" &&
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "space-y-6",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
                    className: "bg-card border border-border rounded-xl p-5 space-y-4 h-fit",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                        className:
                          "font-semibold text-sm border-b border-border pb-3 flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, {
                            className: "size-4 text-danger",
                          }),
                          "Profiles Missing Photos",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "max-h-80 overflow-y-auto space-y-2",
                        children: [
                          students
                            .filter((s) => !s.photo_url)
                            .map((s) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  className:
                                    "flex items-center justify-between text-xs border-b border-border/50 pb-2",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "font-semibold text-foreground",
                                          children: s.full_name,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                          className: "text-[10px] text-muted-foreground",
                                          children: ["Student · ", s.classes?.name || "Unassigned"],
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      className:
                                        "px-2 py-0.5 rounded bg-danger-soft text-danger text-[9px] font-bold uppercase tracking-wider",
                                      children: "No Photo",
                                    }),
                                  ],
                                },
                                s.id,
                              ),
                            ),
                          staff
                            .filter((t) => !t.photo_url)
                            .map((t) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  className:
                                    "flex items-center justify-between text-xs border-b border-border/50 pb-2",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "font-semibold text-foreground",
                                          children: t.full_name,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                          className: "text-[10px] text-muted-foreground",
                                          children: ["Staff · ", t.department || "General"],
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      className:
                                        "px-2 py-0.5 rounded bg-danger-soft text-danger text-[9px] font-bold uppercase tracking-wider",
                                      children: "No Photo",
                                    }),
                                  ],
                                },
                                t.user_id,
                              ),
                            ),
                          students.filter((s) => !s.photo_url).length === 0 &&
                            staff.filter((t) => !t.photo_url).length === 0 &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-center text-slate-400 py-10",
                              children: "All profiles have registered photos.",
                            }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
                    className: "bg-card border border-border rounded-xl p-5 space-y-4 h-fit",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                        className:
                          "font-semibold text-sm border-b border-border pb-3 flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, {
                            className: "size-4 text-brand",
                          }),
                          "Reprint Logs & Operator Audit",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "max-h-80 overflow-y-auto space-y-2",
                        children: [
                          history.map((h) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                className:
                                  "flex items-center justify-between text-xs border-b border-border/50 pb-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                        className: "font-semibold text-foreground",
                                        children: [h.card_type.toUpperCase(), " Card Issued"],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                        className: "text-[10px] text-muted-foreground",
                                        children: [
                                          "Operator: ",
                                          h.profiles?.full_name || "Admin",
                                          " · ",
                                          h.reason || "First Issue",
                                        ],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "font-mono text-slate-400 text-[10px]",
                                    children: new Date(h.printed_at).toLocaleDateString(),
                                  }),
                                ],
                              },
                              h.id,
                            ),
                          ),
                          history.length === 0 &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-center text-slate-400 py-10",
                              children: "No reprint history logged.",
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      }),
      bulkProgress &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                className: "font-bold text-base",
                children: "Generating PDF Cards",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                className: "text-xs text-muted-foreground",
                children: [
                  "Drawing card for ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className: "font-semibold text-foreground",
                    children: bulkProgress.activeName,
                  }),
                  "...",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "bg-brand h-full transition-all duration-300",
                  style: {
                    width: `${Math.round((bulkProgress.current / bulkProgress.total) * 100)}%`,
                  },
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                className: "text-xs font-semibold",
                children: [
                  bulkProgress.current,
                  " / ",
                  bulkProgress.total,
                  " (",
                  Math.round((bulkProgress.current / bulkProgress.total) * 100),
                  "%)",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                onClick: () => {
                  cancelRef.current = true;
                },
                className:
                  "px-4 py-2 text-xs border border-border rounded-md hover:bg-danger-soft hover:text-danger hover:border-danger transition-colors cursor-pointer w-full font-medium",
                children: "Cancel Process",
              }),
            ],
          }),
        }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "absolute left-[-9999px] top-[-9999px]",
        style: {
          zIndex: -100,
        },
        children:
          exporting &&
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "space-y-4",
            children: [
              previewCard &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      id: `id-card-preview-front-${previewCard.data.id || previewCard.data.user_id}`,
                      style: {
                        width: orientation === "portrait" ? "250px" : "396px",
                        height: orientation === "portrait" ? "396px" : "250px",
                        transform: "none",
                        rotate: "0deg",
                        scale: "1",
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                        rec: previewCard.data,
                        type: previewCard.type,
                        theme,
                        orientation,
                        school,
                        side: "front",
                        signature: principalSignature,
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      id: `id-card-preview-back-${previewCard.data.id || previewCard.data.user_id}`,
                      style: {
                        width: orientation === "portrait" ? "250px" : "396px",
                        height: orientation === "portrait" ? "396px" : "250px",
                        transform: "none",
                        rotate: "0deg",
                        scale: "1",
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                        rec: previewCard.data,
                        type: previewCard.type,
                        theme,
                        orientation,
                        school,
                        side: "back",
                        signature: principalSignature,
                      }),
                    }),
                  ],
                }),
              students
                .filter((s) => selectedStudentIds.includes(s.id))
                .map((s) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex gap-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          id: `bulk-card-front-${s.id}`,
                          style: {
                            width: orientation === "portrait" ? "250px" : "396px",
                            height: orientation === "portrait" ? "396px" : "250px",
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                            rec: s,
                            type: "student",
                            theme,
                            orientation,
                            school,
                            side: "front",
                            signature: principalSignature,
                          }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          id: `bulk-card-back-${s.id}`,
                          style: {
                            width: orientation === "portrait" ? "250px" : "396px",
                            height: orientation === "portrait" ? "396px" : "250px",
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                            rec: s,
                            type: "student",
                            theme,
                            orientation,
                            school,
                            side: "back",
                            signature: principalSignature,
                          }),
                        }),
                      ],
                    },
                    `bulk-student-${s.id}`,
                  ),
                ),
              staff
                .filter((t) => selectedStaffIds.includes(t.user_id))
                .map((t) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex gap-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          id: `bulk-card-front-${t.user_id}`,
                          style: {
                            width: orientation === "portrait" ? "250px" : "396px",
                            height: orientation === "portrait" ? "396px" : "250px",
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                            rec: t,
                            type: "staff",
                            theme,
                            orientation,
                            school,
                            side: "front",
                            signature: principalSignature,
                          }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          id: `bulk-card-back-${t.user_id}`,
                          style: {
                            width: orientation === "portrait" ? "250px" : "396px",
                            height: orientation === "portrait" ? "396px" : "250px",
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                            rec: t,
                            type: "staff",
                            theme,
                            orientation,
                            school,
                            side: "back",
                            signature: principalSignature,
                          }),
                        }),
                      ],
                    },
                    `bulk-staff-${t.user_id}`,
                  ),
                ),
            ],
          }),
      }),
      previewCard &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className:
            "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto",
          onClick: () => setPreviewCard(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            onClick: (e) => e.stopPropagation(),
            className:
              "bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex items-center justify-between border-b border-border pb-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", {
                    className: "font-semibold text-sm capitalize",
                    children: [previewCard.type, " ID Card Preview"],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        onClick: () => setFlipped(!flipped),
                        className:
                          "px-2 py-1 text-xs border border-border rounded-md bg-secondary hover:bg-secondary/70 font-semibold",
                        children: "Flip Card",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                            value: pdfExportMode,
                            onChange: (e) => setPdfExportMode(e.target.value),
                            className:
                              "bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2",
                            style: {
                              WebkitAppearance: "none",
                              MozAppearance: "none",
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                value: "front-back",
                                children: "Front+Back",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                value: "front-only",
                                children: "Front Only",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                value: "side-by-side",
                                children: "Side-by-Side",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                            onClick: () =>
                              downloadSinglePDF(previewCard.type, previewCard.data, pdfExportMode),
                            disabled: exporting,
                            className:
                              "px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                                className: "size-3",
                              }),
                              " PDF",
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "flex justify-center py-6",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "perspective-[1000px]",
                  style: {
                    width: orientation === "portrait" ? "250px" : "396px",
                    height: orientation === "portrait" ? "396px" : "250px",
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className:
                      "w-full h-full relative transition-transform duration-500 transform-style-3d shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-xl",
                    style: {
                      transform: flipped ? "rotateY(180deg)" : "none",
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-slate-50",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                            rec: previewCard.data,
                            type: previewCard.type,
                            theme,
                            orientation,
                            school,
                            side: "front",
                            signature: principalSignature,
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className:
                              "absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-slate-50",
                        style: {
                          transform: "rotateY(180deg)",
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                            rec: previewCard.data,
                            type: previewCard.type,
                            theme,
                            orientation,
                            school,
                            side: "back",
                            signature: principalSignature,
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className:
                              "absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center text-xs text-muted-foreground",
                children:
                  "Tip: Interactive 3D preview. Click 'Flip Card' to see front and back overlays.",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "flex justify-end pt-2 border-t border-border",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  onClick: () => setPreviewCard(null),
                  className: "px-4 py-1.5 text-xs border border-border rounded-md font-semibold",
                  children: "Close",
                }),
              }),
            ],
          }),
        }),
      editStudent &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className:
            "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto",
          onClick: () => setEditStudent(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: handleSaveStudent,
            className:
              "bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-sm border-b border-border pb-3",
                children: "Edit Student Details",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Full Name",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        required: true,
                        value: editStudent.full_name,
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            full_name: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Admission Number",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        required: true,
                        value: editStudent.admission_number || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            admission_number: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Roll Number",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStudent.roll_number || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            roll_number: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Blood Group",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStudent.blood_group || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            blood_group: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "DOB (YYYY-MM-DD)",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        type: "date",
                        value: editStudent.date_of_birth || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            date_of_birth: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Emergency Contact",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStudent.emergency_contact || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            emergency_contact: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Parent/Guardian Name",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStudent.parent_name || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            parent_name: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Parent Phone Number",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStudent.parent_phone || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            parent_phone: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Transport Route",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStudent.transport_route || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            transport_route: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Bus Number",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStudent.bus_number || "",
                        onChange: (e) =>
                          setEditStudent({
                            ...editStudent,
                            bus_number: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 justify-end pt-2 border-t border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => setEditStudent(null),
                    className: "px-3 py-2 text-xs border border-border rounded-md",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    className: "px-3 py-2 text-xs bg-brand text-white font-semibold rounded-md",
                    children: "Save Details",
                  }),
                ],
              }),
            ],
          }),
        }),
      editStaff &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className:
            "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto",
          onClick: () => setEditStaff(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: handleSaveStaff,
            className:
              "bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-sm border-b border-border pb-3",
                children: "Edit Staff Details",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Employee ID",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        required: true,
                        value: editStaff.employee_id || "",
                        onChange: (e) =>
                          setEditStaff({
                            ...editStaff,
                            employee_id: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Designation",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStaff.designation || "",
                        onChange: (e) =>
                          setEditStaff({
                            ...editStaff,
                            designation: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Department",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStaff.department || "",
                        onChange: (e) =>
                          setEditStaff({
                            ...editStaff,
                            department: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Blood Group",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStaff.blood_group || "",
                        onChange: (e) =>
                          setEditStaff({
                            ...editStaff,
                            blood_group: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Mobile Number",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStaff.mobile_number || "",
                        onChange: (e) =>
                          setEditStaff({
                            ...editStaff,
                            mobile_number: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Emergency Contact",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStaff.emergency_contact || "",
                        onChange: (e) =>
                          setEditStaff({
                            ...editStaff,
                            emergency_contact: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "col-span-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Physical Address",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: editStaff.address || "",
                        onChange: (e) =>
                          setEditStaff({
                            ...editStaff,
                            address: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "col-span-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-xs font-semibold block mb-1",
                        children: "Card Back Notes",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                        rows: 2,
                        value: editStaff.notes || "",
                        onChange: (e) =>
                          setEditStaff({
                            ...editStaff,
                            notes: e.target.value,
                          }),
                        className:
                          "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 justify-end pt-2 border-t border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => setEditStaff(null),
                    className: "px-3 py-2 text-xs border border-border rounded-md",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    className: "px-3 py-2 text-xs bg-brand text-white font-semibold rounded-md",
                    children: "Save Details",
                  }),
                ],
              }),
            ],
          }),
        }),
      cropTarget &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-sm border-b border-border pb-3",
                children: "Crop Profile Photo",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCropper, {
                imageSrc: cropTarget.original,
                onCrop: saveCroppedPhoto,
                onCancel: () => setCropTarget(null),
                circular: cropTarget.type !== "school" && cropTarget.type !== "signature",
              }),
            ],
          }),
        }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", {
        children: `
        /* 3D Flipping styles */
        .perspective-[1000px] {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }

        /* Print Specific Styling */
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .print\\:hidden, aside, main > header, nav, button, input, select, .PageHeader {
            display: none !important;
          }
          main {
            overflow: visible !important;
          }
          #id-card-print-container {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
          }
          .a4-page {
            width: 210mm !important;
            height: 297mm !important;
            page-break-after: always !important;
            box-sizing: border-box !important;
            padding: 10mm 15mm !important;
            margin: 0 !important;
            background-color: #ffffff !important;
          }
          /* Print grid layouts */
          .a4-grid-portrait {
            display: grid !important;
            grid-template-columns: repeat(3, 54mm) !important;
            grid-gap: 5mm !important;
            justify-content: center !important;
            align-content: start !important;
          }
          .a4-grid-landscape {
            display: grid !important;
            grid-template-columns: repeat(2, 85.6mm) !important;
            grid-gap: 4mm !important;
            justify-content: center !important;
            align-content: start !important;
          }
          .print-card-portrait {
            width: 54mm !important;
            height: 85.6mm !important;
            page-break-inside: avoid !important;
          }
          .print-card-landscape {
            width: 85.6mm !important;
            height: 54mm !important;
            page-break-inside: avoid !important;
          }
        }
      `,
      }),
      printLayout !== "none" &&
        printTarget &&
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          id: "id-card-print-container",
          className: "hidden print:block",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "a4-page",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: orientation === "portrait" ? "a4-grid-portrait" : "a4-grid-landscape",
                children: printTarget.list.map((item, idx) => {
                  const cardId = item.id || item.user_id;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className:
                        orientation === "portrait" ? "print-card-portrait" : "print-card-landscape",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                        rec: item,
                        type: printTarget.type,
                        theme,
                        orientation,
                        school,
                        side: "front",
                        signature: principalSignature,
                      }),
                    },
                    `print-${cardId}-${idx}`,
                  );
                }),
              }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "a4-page",
              style: {
                pageBreakBefore: "always",
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: orientation === "portrait" ? "a4-grid-portrait" : "a4-grid-landscape",
                children: printTarget.list.map((item, idx) => {
                  const cardId = item.id || item.user_id;
                  return /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className:
                        orientation === "portrait" ? "print-card-portrait" : "print-card-landscape",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(IDCardComponent, {
                        rec: item,
                        type: printTarget.type,
                        theme,
                        orientation,
                        school,
                        side: "back",
                        signature: principalSignature,
                      }),
                    },
                    `print-back-${cardId}-${idx}`,
                  );
                }),
              }),
            }),
          ],
        }),
    ],
  });
}
function SchoolCrestPlaceholder({ className = "size-8" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
        d: "M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z",
        fill: "currentColor",
        fillOpacity: "0.1",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinejoin: "round",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
        d: "M12 6v10M9 8h6M9 11h6",
        stroke: "currentColor",
        strokeWidth: "1.2",
        strokeLinecap: "round",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", {
        d: "M12 6l-3 3M12 6l3 3M12 11l-3 3M12 11l3 3",
        stroke: "currentColor",
        strokeWidth: "1.2",
        strokeLinecap: "round",
      }),
    ],
  });
}
function IDCardComponent({ rec, type, theme, orientation, school, side = "front", signature }) {
  const isStudent = type === "student";
  const isVisitor = type === "visitor";
  const identifier = isStudent
    ? getStudentIdFallback(rec)
    : isVisitor
      ? rec.pass_number
      : getStaffIdFallback(rec);
  const appOrigin =
    typeof window !== "undefined" ? window.location.origin : "https://school.hezo.in";
  const verificationLink = `${appOrigin}/verify-id?type=${type}&id=${rec.id || rec.user_id}`;
  const displayName = isStudent
    ? rec.full_name || "Student"
    : isVisitor
      ? rec.visitor_name || "Visitor"
      : rec.full_name || "Staff";
  let displayClassOrDesignation = "";
  if (isStudent) {
    displayClassOrDesignation = rec.classes?.name
      ? `${rec.classes.name}${rec.classes.section ? ` (${rec.classes.section})` : ""}`
      : "Student";
  } else if (isVisitor) {
    displayClassOrDesignation = "Visitor";
  } else {
    displayClassOrDesignation = rec.designation || "Staff";
  }
  let nameFontSize = "text-[12px]";
  if (displayName.length > 35) {
    nameFontSize = "text-[7.5px]";
  } else if (displayName.length > 25) {
    nameFontSize = "text-[9px]";
  } else if (displayName.length > 15) {
    nameFontSize = "text-[10.5px]";
  }
  if (displayClassOrDesignation.length > 20);
  let themeCls = "";
  let headerCls = "";
  let accentBorder = "border-slate-200";
  if (theme === "modern-blue") {
    themeCls =
      "bg-gradient-to-br from-slate-50 via-sky-50/50 to-blue-50 text-slate-800 border-sky-200";
    headerCls = "bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white";
    accentBorder = "border-sky-300";
  } else if (theme === "premium-corporate") {
    themeCls =
      "bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 border-slate-700 shadow-inner";
    headerCls = "bg-slate-950 text-teal-400 border-b border-teal-500/30";
    accentBorder = "border-teal-500/40";
  } else if (theme === "gold-premium") {
    themeCls =
      "bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-amber-50 border-amber-400";
    headerCls = "bg-slate-950 text-amber-400 border-b-2 border-amber-400";
    accentBorder = "border-amber-400/50";
  } else if (theme === "school-classic") {
    themeCls = "bg-rose-50/10 text-rose-950 border-rose-800";
    headerCls = "bg-gradient-to-r from-red-800 to-rose-950 text-white border-b-2 border-red-900";
    accentBorder = "border-rose-800/30";
  } else {
    themeCls = "bg-white text-slate-800 border-slate-200";
    headerCls = "bg-slate-50 text-slate-800 border-b border-slate-200";
    accentBorder = "border-slate-200";
  }
  const topperRank = rec.rankings?.find((r) => r.rank_position <= 3);
  const schoolLogoNode = school?.logo_url
    ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
        src: school.logo_url,
        alt: "",
        className: "size-12 object-contain bg-white rounded p-0.5",
      })
    : /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolCrestPlaceholder, {
        className: `size-12 ${theme === "premium-corporate" || theme === "gold-premium" ? "text-teal-400" : "text-amber-400"}`,
      });
  let subBannerCls = "bg-amber-400 text-slate-950";
  if (theme === "premium-corporate") {
    subBannerCls = "bg-teal-500 text-slate-950";
  } else if (theme === "gold-premium") {
    subBannerCls = "bg-amber-500 text-slate-950";
  } else if (theme === "school-classic") {
    subBannerCls = "bg-rose-800 text-white";
  } else if (theme === "minimal") {
    subBannerCls = "bg-slate-100 text-slate-900 border-y border-slate-200";
  }
  if (orientation === "portrait") {
    if (side === "front") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: `w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md relative ${themeCls}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: `px-2 py-1.5 flex items-center gap-2 border-b relative min-h-[56px] ${headerCls}`,
            children: [
              schoolLogoNode,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "text-left min-w-0 flex-1 leading-tight",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                    className:
                      "text-[13.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal",
                    children: school?.name || "School Name",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className:
                      "text-[7.5px] opacity-85 break-words whitespace-normal leading-tight mt-0.5",
                    children: school?.address || "Address Detail",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "text-right leading-none flex-shrink-0 font-mono text-[7px] opacity-85 font-semibold ml-1",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  children: rec.academic_year || currentAcademicYear,
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: `font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5 ${subBannerCls}`,
            children: isStudent
              ? "STUDENT IDENTITY CARD"
              : isVisitor
                ? "VISITOR PASS"
                : "IDENTITY CARD",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "flex-1 p-2 flex flex-col items-center justify-start space-y-1 min-h-0 relative",
            children: [
              topperRank &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "absolute top-1 right-1 bg-amber-400 text-slate-950 text-[6px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-amber-300 shadow-md",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                      className: "size-1.5 text-slate-950",
                    }),
                    "Rank ",
                    topperRank.rank_position,
                  ],
                }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: `w-[110px] h-[142px] rounded border bg-white overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 relative ${accentBorder}`,
                children: rec.photo_url
                  ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                      src: rec.photo_url,
                      alt: "",
                      className: "size-full object-cover",
                    })
                  : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                      className: "size-16 text-slate-300",
                    }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center w-full min-w-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                  className: `${nameFontSize} font-bold leading-tight break-words whitespace-normal px-1 text-center w-full`,
                  title: displayName,
                  children: displayName,
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "w-full text-[7.2px] space-y-0.5 px-2",
                children: isStudent
                  ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60",
                              children: "Student ID:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold font-mono",
                              children: identifier,
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60",
                              children: "Class:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold",
                              children: displayClassOrDesignation,
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60",
                              children: "Roll Number:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold",
                              children: rec.roll_number || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60",
                              children: "Date of Birth:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold",
                              children: rec.date_of_birth || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60",
                              children: "Blood Group:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold text-red-500",
                              children: rec.blood_group || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex justify-between",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60",
                              children: "Parent Contact:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold font-mono",
                              children: rec.parent_phone || "—",
                            }),
                          ],
                        }),
                      ],
                    })
                  : isVisitor
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60",
                                children: "Pass Number:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: identifier,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60",
                                children: "Visitor Phone:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: rec.contact_number,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex justify-between",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60",
                                children: "Host:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold truncate max-w-[100px]",
                                children: rec.host_name || "—",
                              }),
                            ],
                          }),
                        ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60",
                                children: "Employee ID:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: identifier,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60",
                                children: "Department:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold",
                                children: rec.department || "—",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60",
                                children: "Blood Group:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold text-red-505",
                                children: rec.blood_group || "—",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex justify-between",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60",
                                children: "Mobile Number:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: rec.mobile_number || "—",
                              }),
                            ],
                          }),
                        ],
                      }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: `p-1.5 border-t flex items-center justify-between gap-1 bg-white ${theme === "premium-corporate" || theme === "gold-premium" ? "border-slate-800" : "border-border"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex-1 flex flex-col justify-end min-w-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { value: identifier }),
                  signature &&
                    !isVisitor &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "h-3.5 mt-0.5 flex items-end opacity-75 grayscale",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                        src: signature,
                        alt: "Sig",
                        className: "h-full object-contain",
                      }),
                    }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex flex-col items-center flex-shrink-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeImage, {
                    value: verificationLink,
                    className: "size-9 bg-white p-0.5 rounded border border-border",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className:
                      "text-[5px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter",
                    children: "Scan to Verify",
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: `w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md ${themeCls}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: `px-2 py-1.5 flex items-center gap-2 border-b relative min-h-[56px] ${headerCls}`,
            children: [
              schoolLogoNode,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "text-left min-w-0 flex-1 leading-tight",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                    className:
                      "text-[13.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal",
                    children: school?.name || "School Name",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className:
                      "text-[7.5px] opacity-85 break-words whitespace-normal leading-tight mt-0.5",
                    children: school?.address || "Address Detail",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className:
              "bg-slate-900 text-white font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5",
            children: "TERMS & GUIDELINES",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex-1 p-3 flex flex-col justify-between space-y-2 text-[7.5px]",
            children: [
              isStudent
                ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "space-y-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex flex-col",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "opacity-60 text-[6.5px] uppercase font-semibold",
                            children: "Emergency Contact:",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "font-bold font-mono text-[8.5px]",
                            children: rec.emergency_contact || rec.parent_phone || "—",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex flex-col",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "opacity-60 text-[6.5px] uppercase font-semibold",
                            children: "Parent/Guardian Contact:",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "font-bold text-[8.5px]",
                            children: rec.parent_name || "—",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "font-bold font-mono text-[8px]",
                            children: rec.parent_phone || "—",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex flex-col",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "opacity-60 text-[6.5px] uppercase font-semibold",
                            children: "School Contact Details:",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                            className: "font-semibold font-mono",
                            children: ["Ph: ", school?.phone_number || "—"],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                            className: "font-semibold truncate",
                            children: ["Web: ", school?.email || "www.hezo.in"],
                          }),
                        ],
                      }),
                    ],
                  })
                : isVisitor
                  ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "space-y-2 text-center p-2 bg-white/20 rounded border border-border/10",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className: "text-[9.5px] font-bold text-red-550 block",
                          children: "TEMPORARY GUEST PASS",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                          className: "text-[7.5px] leading-normal opacity-90",
                          children:
                            "This visitor badge is temporary and issued strictly for verification. Return it to reception upon checkout.",
                        }),
                      ],
                    })
                  : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex flex-col",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 text-[6.5px] uppercase font-semibold",
                              children: "Emergency Contact:",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold font-mono text-[8.5px]",
                              children: rec.emergency_contact || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex flex-col",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 text-[6.5px] uppercase font-semibold",
                              children: "Residential Address:",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "font-semibold leading-normal line-clamp-3",
                              children: rec.address || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex flex-col",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 text-[6.5px] uppercase font-semibold",
                              children: "Notes:",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "italic text-[7px] leading-tight line-clamp-2 opacity-85",
                              children:
                                rec.notes ||
                                "This card belongs to the school administration. If found, please return immediately.",
                            }),
                          ],
                        }),
                      ],
                    }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "text-center font-bold text-[7px] text-red-650 bg-red-50 py-0.5 rounded border border-red-200 uppercase tracking-tighter",
                children: '"If found please return to school."',
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "p-1.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                className: "text-[5.5px] font-mono opacity-60",
                children: [
                  "Secure Badge HZ-",
                  rec.id?.slice(0, 8) || rec.user_id?.slice(0, 8) || "000000",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeImage, {
                    value: verificationLink,
                    className: "size-7 bg-white p-0.5 rounded border border-border",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "leading-none text-left",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                      className:
                        "text-[5px] block font-bold text-slate-500 uppercase tracking-tighter",
                      children: "Scan to Verify",
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }
  } else {
    if (side === "front") {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: `w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md relative ${themeCls}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: `px-3 py-1.5 flex items-center gap-2.5 border-b relative min-h-[56px] ${headerCls}`,
            children: [
              schoolLogoNode,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "text-left min-w-0 flex-1 leading-tight",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                    className:
                      "text-[15.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal",
                    children: school?.name || "School Name",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className:
                      "text-[8px] opacity-85 break-words whitespace-normal leading-tight mt-0.5",
                    children: school?.address || "Address Detail",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "text-right leading-none flex-shrink-0 font-mono text-[8px] opacity-85 font-semibold ml-1",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  children: rec.academic_year || currentAcademicYear,
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: `font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5 ${subBannerCls}`,
            children: isStudent
              ? "STUDENT IDENTITY CARD"
              : isVisitor
                ? "VISITOR PASS"
                : "IDENTITY CARD",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "flex-1 p-2 flex items-center justify-center gap-4 min-h-0 relative bg-white/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "w-[125px] flex-shrink-0 text-[7px] space-y-0.5",
                children: isStudent
                  ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "Student ID:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold font-mono",
                              children: identifier,
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "Class-Sec:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold",
                              children: displayClassOrDesignation,
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "Roll No:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold",
                              children: rec.roll_number || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "DOB:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold",
                              children: rec.date_of_birth || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "Blood Grp:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold text-red-500",
                              children: rec.blood_group || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex justify-between",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "Parent Mob:",
                            }),
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold font-mono",
                              children: rec.parent_phone || "—",
                            }),
                          ],
                        }),
                      ],
                    })
                  : isVisitor
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Pass No:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: identifier,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Visitor Phone:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: rec.contact_number,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex justify-between",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Host:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold truncate max-w-[80px]",
                                children: rec.host_name || "—",
                              }),
                            ],
                          }),
                        ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Emp ID:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: identifier,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Dept:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold",
                                children: rec.department || "—",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Blood Grp:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold text-red-550",
                                children: rec.blood_group || "—",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex justify-between",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Mobile:",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: rec.mobile_number || "—",
                              }),
                            ],
                          }),
                        ],
                      }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex-1 flex flex-col items-center justify-center min-w-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: `w-[72px] h-[92px] rounded border bg-white overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 relative ${accentBorder}`,
                    children: rec.photo_url
                      ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                          src: rec.photo_url,
                          alt: "",
                          className: "size-full object-cover",
                        })
                      : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                          className: "size-12 text-slate-300",
                        }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                    className: `${nameFontSize} font-bold text-center leading-tight whitespace-normal break-words w-full px-1 mt-1.5`,
                    title: displayName,
                    children: displayName,
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "w-[100px] flex-shrink-0 flex flex-col items-center justify-between h-full py-0.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Barcode, { value: identifier }),
                  signature &&
                    !isVisitor &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "h-3.5 flex items-end opacity-75 grayscale mt-1",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                        src: signature,
                        alt: "Sig",
                        className: "h-full object-contain",
                      }),
                    }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex flex-col items-center mt-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeImage, {
                        value: verificationLink,
                        className: "size-9 bg-white p-0.5 rounded border border-border",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className:
                          "text-[5px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter",
                        children: "Scan to Verify",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: `h-4 px-3 bg-slate-50 border-t flex items-center justify-between text-[5.5px] font-mono opacity-60 ${theme === "premium-corporate" || theme === "gold-premium" ? "border-slate-800" : "border-border"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                children: ["Secure Badge System · ", school?.name || "School ERP"],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                children: ["HZ-", rec.id?.slice(0, 8) || rec.user_id?.slice(0, 8) || "000000"],
              }),
            ],
          }),
        ],
      });
    } else {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: `w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden p-2.5 shadow-md ${themeCls}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: `text-center pb-1.5 border-b flex justify-between items-center ${theme === "premium-corporate" || theme === "gold-premium" ? "border-slate-800" : "border-border"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "text-[9px] font-bold uppercase font-sans",
                children: "TERMS & INSTRUCTIONS",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "text-[6.5px] opacity-75 truncate max-w-[180px]",
                children: school?.name || "School Name",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex-1 flex items-center justify-between gap-3 py-1.5 min-h-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "flex-1 text-[7.5px] space-y-1",
                children: isStudent
                  ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "Emergency Contact:",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold font-mono",
                              children: rec.emergency_contact || rec.parent_phone || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "Parent/Guardian:",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold",
                              children: rec.parent_name || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "Parent Mob. Contact:",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-bold font-mono",
                              children: rec.parent_phone || "—",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex justify-between",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "opacity-60 font-semibold",
                              children: "School Address:",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "font-semibold truncate max-w-[120px]",
                              children: school?.address || "—",
                            }),
                          ],
                        }),
                      ],
                    })
                  : isVisitor
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-1 p-1 bg-white/10 rounded",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-[8px] font-bold text-red-550 uppercase",
                            children: "visitor badge terms",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-[6.5px] leading-normal opacity-90",
                            children:
                              "This temporary pass allows access strictly for official visitations. Report to reception if any assistance is required. Please return pass before checking out.",
                          }),
                        ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Emergency Contact:",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold font-mono",
                                children: rec.emergency_contact || "—",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Residential Address:",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-semibold truncate max-w-[120px]",
                                children: rec.address || "—",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 font-semibold",
                                children: "Notes:",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className:
                                  "italic text-[6.5px] leading-tight line-clamp-2 opacity-85",
                                children:
                                  rec.notes || "This card belongs to the school administration.",
                              }),
                            ],
                          }),
                        ],
                      }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: `flex flex-col items-center justify-center border-l pl-3 h-full ${theme === "premium-corporate" || theme === "gold-premium" ? "border-slate-800" : "border-border"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeImage, {
                    value: verificationLink,
                    className: "size-9 bg-white p-0.5 rounded border border-border",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className:
                      "text-[5px] block font-bold text-slate-500 uppercase tracking-tighter mt-1",
                    children: "Scan to Verify",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: `border-t pt-1 flex justify-between items-center text-[6.5px] ${theme === "premium-corporate" || theme === "gold-premium" ? "border-slate-800" : "border-border"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className:
                  "font-bold text-red-600 animate-pulse uppercase tracking-tighter font-sans",
                children: '"If found please return to school."',
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                className: "font-mono opacity-60",
                children: ["HZ-", rec.id?.slice(0, 8) || rec.user_id?.slice(0, 8) || "00000"],
              }),
            ],
          }),
        ],
      });
    }
  }
}
export {
  Barcode,
  IDCardComponent,
  KpiWidget,
  QRCodeImage,
  SchoolCrestPlaceholder,
  IdCardManagementPage as component,
};
