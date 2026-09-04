import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, type FormEvent, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { ImageCropper } from "@/components/ImageCropper";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { safeHtml2Canvas } from "@/lib/pdf-helper";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import {
  Contact,
  Users,
  ShieldAlert,
  Settings,
  ClipboardList,
  Plus,
  Trash2,
  UserCheck,
  ShieldCheck,
  Printer,
  FileDown,
  RefreshCw,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Eye,
  CheckCircle,
  History,
  Camera,
  User,
  Download,
  Trophy,
  Star,
  CheckSquare,
} from "lucide-react";

// KPI Widget Component
export function KpiWidget({
  title,
  count,
  subtext,
  icon,
}: {
  title: string;
  count: number;
  subtext: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-foreground">{count}</h3>
        <p className="text-[10px] text-muted-foreground">{subtext}</p>
      </div>
      <div className="size-10 bg-secondary rounded-lg flex items-center justify-center">{icon}</div>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/id-cards")({
  component: IdCardManagementPage,
});

// Barcode Component
export function Barcode({ value }: { value: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      try {
        JsBarcode(canvasRef.current, value, {
          format: "CODE128",
          width: 1.1,
          height: 20,
          displayValue: false,
          margin: 0,
          background: "transparent",
          lineColor: "#000000",
        });
      } catch (err) {
        // Suppress rendering error if invalid format
      }
    }
  }, [value]);

  return <canvas ref={canvasRef} className="max-h-5 max-w-full block" />;
}

// QR Code Component
export function QRCodeImage({ value, className }: { value: string; className?: string }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (value) {
      QRCode.toDataURL(value, {
        margin: 1,
        width: 100,
        color: { dark: "#000000", light: "#ffffff" },
      })
        .then((u) => setUrl(u))
        .catch((err) => console.error("QR Code generation failed", err));
    }
  }, [value]);

  if (!url) return <div className="size-10 bg-slate-100 animate-pulse rounded" />;
  return <img src={url} alt="QR Code" className={className} />;
}

// ImageCropper imported from components directory

// Helpers for fallbacks
export const getStudentIdFallback = (s: any) => {
  if (s.admission_number) return s.admission_number;
  const hash = s.id ? s.id.slice(0, 4).toUpperCase() : "0000";
  return `STU-2025-${hash}`;
};

export const getStaffIdFallback = (t: any) => {
  if (t.employee_id) return t.employee_id;
  const hash = t.user_id ? t.user_id.slice(0, 4).toUpperCase() : "0000";
  return `EMP-2025-${hash}`;
};

interface SchoolDetails {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  phone_number: string | null;
  email: string | null;
  principal_name?: string;
  principal_signature_url?: string | null;
}

interface StudentRow {
  id: string;
  full_name: string;
  admission_number: string | null;
  roll_number: string | null;
  photo_url: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
  emergency_contact: string | null;
  transport_route: string | null;
  bus_number: string | null;
  academic_year: string;
  class_id: string | null;
  classes: { name: string; section: string | null } | null;
  rankings?: Array<{ rank_position: number; rank_type: string }>;
  awards?: Array<{ title: string; category: string }>;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
}

interface StaffRow {
  user_id: string;
  full_name: string;
  email: string | null;
  photo_url: string | null;
  employee_id: string | null;
  designation: string | null;
  department: string | null;
  joining_date: string | null;
  mobile_number: string | null;
  blood_group: string | null;
  address: string | null;
  emergency_contact: string | null;
  notes: string | null;
}

interface VisitorPassRow {
  id: string;
  visitor_name: string;
  photo_url: string | null;
  purpose_of_visit: string | null;
  contact_number: string;
  host_name: string | null;
  check_in_time: string;
  check_out_time: string | null;
  pass_number: string;
}

interface ReprintHistoryRow {
  id: string;
  card_type: string;
  holder_id: string;
  academic_year: string;
  printed_by: string;
  printed_at: string;
  reason: string | null;
  profiles: { full_name: string } | null;
}

type TabType = "overview" | "students" | "staff" | "visitors" | "settings" | "reports";
type CardTheme =
  | "modern-blue"
  | "premium-corporate"
  | "gold-premium"
  | "school-classic"
  | "minimal";
type CardOrientation = "portrait" | "landscape";
type PdfExportMode = "front-back" | "front-only" | "side-by-side" | "a4-sheet";

const currentAcademicYear = (() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-indexed
  // Academic year starts in June (month 5)
  return m >= 5 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
})();

function IdCardManagementPage() {
  const { currentSchoolId: schoolId, user, roles, loading: tenantLoading } = useTenant();

  const isAdmin = (roles ?? []).includes("admin") || (roles ?? []).includes("super_admin");
  usePageTitle("ID Cards");

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [theme, setTheme] = useState<CardTheme>("modern-blue");
  const [orientation, setOrientation] = useState<CardOrientation>("landscape");
  const [pdfExportMode, setPdfExportMode] = useState<PdfExportMode>("front-back");

  // Data
  const [school, setSchool] = useState<SchoolDetails | null>(null);
  const [classes, setClasses] = useState<
    Array<{ id: string; name: string; section: string | null }>
  >([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [visitors, setVisitors] = useState<VisitorPassRow[]>([]);
  const [history, setHistory] = useState<ReprintHistoryRow[]>([]);

  // Selected lists for bulk generation
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

  // Search & Filters
  const [studentSearch, setStudentSearch] = useState("");
  const [studentClassFilter, setStudentClassFilter] = useState("all");
  const [studentPhotoFilter, setStudentPhotoFilter] = useState("all");
  const [staffSearch, setStaffSearch] = useState("");
  const [staffDeptFilter, setStaffDeptFilter] = useState("all");

  // Loading States
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    current: number;
    total: number;
    activeName: string;
  } | null>(null);
  const cancelRef = useRef(false);
  const [cropTarget, setCropTarget] = useState<{
    type: "student" | "staff" | "school" | "signature";
    id: string;
    original: string;
  } | null>(null);

  // New visitor pass form
  const [newVisitor, setNewVisitor] = useState({ name: "", phone: "", purpose: "", host: "" });
  const [visitorPassPhoto, setVisitorPassPhoto] = useState<string | null>(null);

  // Edit fields modal
  const [editStudent, setEditStudent] = useState<StudentRow | null>(null);
  const [editStaff, setEditStaff] = useState<StaffRow | null>(null);
  const [previewCard, setPreviewCard] = useState<{
    type: "student" | "staff" | "visitor";
    data: any;
  } | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Print mode states
  const [printLayout, setPrintLayout] = useState<"none" | "pvc" | "a4">("none");
  const [printTarget, setPrintTarget] = useState<{
    type: "student" | "staff" | "visitor";
    list: any[];
  } | null>(null);

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
        (supabase as any)
          .from("schools")
          .select(
            "id, name, school_name, logo_url, school_logo, address, phone_number, email, principal_name, principal_signature_url",
          )
          .eq("id", schoolId)
          .single(),
        supabase
          .from("classes")
          .select("id, name, section")
          .eq("school_id", schoolId!)
          .order("name"),
        supabase
          .from("students")
          .select("*, classes(name, section)")
          .eq("school_id", schoolId!)
          .order("full_name"),
        (supabase as any).from("profiles").select("*").eq("school_id", schoolId!),
        supabase
          .from("visitor_passes")
          .select("*")
          .eq("school_id", schoolId!)
          .order("created_at", { ascending: false }),
        supabase
          .from("id_card_history")
          .select("*, profiles(full_name)")
          .eq("school_id", schoolId!)
          .order("printed_at", { ascending: false }),
        supabase
          .from("rankings")
          .select("student_id, rank_position, percentage, rank_type")
          .eq("school_id", schoolId!),
        supabase.from("awards").select("student_id, category, title").eq("school_id", schoolId!),
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
      }) as StudentRow[];
      setStudents(normStudents);

      const rolesRes = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("school_id", schoolId!);
      const staffIds = (rolesRes.data || [])
        .filter((r) => r.role === "admin" || r.role === "teacher")
        .map((r) => r.user_id);

      const normStaff = (staffRes.data || [])
        .filter((p: any) => (staffIds ?? []).includes(p.user_id))
        .map((p: any) => ({
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
        })) as StaffRow[];
      setStaff(normStaff);

      setVisitors(visitorsRes.data || []);
      setHistory(historyRes.data || ([] as any));
    } catch (err: any) {
      toast.error(err.message || "Failed to load ERP records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [schoolId]);

  // Handle file uploads -> Read as base64 and open cropper
  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "student" | "staff" | "school" | "signature",
    id: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropTarget({
        type,
        id,
        original: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Save cropped photo to db
  const saveCroppedPhoto = async (base64: string) => {
    if (!cropTarget) return;
    const { type, id } = cropTarget;
    setCropTarget(null);

    setLoading(true);
    try {
      let finalUrl = base64;

      // Upload to Supabase Storage if student, staff, school, or signature
      if (type === "student" || type === "staff" || type === "school" || type === "signature") {
        try {
          const byteString = atob(base64.split(",")[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const isPng = type === "signature";
          const blob = new Blob([ab], { type: isPng ? "image/png" : "image/jpeg" });
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
          .update({ photo_url: finalUrl })
          .eq("id", id)
          .eq("school_id", schoolId!);
        if (error) throw error;
        toast.success("Student photo updated successfully.");
        if (editStudent && editStudent.id === id) {
          setEditStudent({ ...editStudent, photo_url: finalUrl });
        }
      } else if (type === "staff") {
        const { error } = await supabase
          .from("profiles")
          .update({ photo_url: finalUrl })
          .eq("user_id", id)
          .eq("school_id", schoolId!);
        if (error) throw error;
        toast.success("Staff photo updated successfully.");
        if (editStaff && editStaff.user_id === id) {
          setEditStaff({ ...editStaff, photo_url: finalUrl });
        }
      } else if (type === "school") {
        const { error } = await (supabase as any)
          .from("schools")
          .update({ logo_url: finalUrl })
          .eq("id", id);
        if (error) throw error;
        toast.success("School logo updated.");
        if (school) setSchool({ ...school, logo_url: finalUrl });
      } else if (type === "signature") {
        const { error } = await (supabase as any)
          .from("schools")
          .update({ principal_signature_url: finalUrl })
          .eq("id", schoolId);
        if (error) throw error;
        toast.success("Principal signature updated successfully.");
        if (school) setSchool({ ...school, principal_signature_url: finalUrl });
      }
      void loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save cropped image.");
    } finally {
      setLoading(false);
    }
  };

  // Add visitor pass
  const handleCheckInVisitor = async (e: FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;

    try {
      const year = new Date().getFullYear();
      const passNo = `VP-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

      let finalPhotoUrl = null;
      if (visitorPassPhoto && visitorPassPhoto.startsWith("data:")) {
        const base64 = visitorPassPhoto;
        const byteString = atob(base64.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: "image/jpeg" });
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
      setNewVisitor({ name: "", phone: "", purpose: "", host: "" });
      setVisitorPassPhoto(null);
      void loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to check in visitor.");
    }
  };

  // Check out visitor
  const handleCheckOutVisitor = async (id: string) => {
    try {
      const { error } = await supabase
        .from("visitor_passes")
        .update({ check_out_time: new Date().toISOString() })
        .eq("id", id)
        .eq("school_id", schoolId!);
      if (error) throw error;
      toast.success("Visitor checked out.");
      void loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to check out visitor.");
    }
  };

  // Update student fields
  const handleSaveStudent = async (e: FormEvent) => {
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
        .eq("school_id", schoolId!);

      if (error) throw error;
      toast.success("Student details saved.");
      setEditStudent(null);
      void loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save details.");
    }
  };

  // Update staff fields
  const handleSaveStaff = async (e: FormEvent) => {
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
        .eq("school_id", schoolId!);

      if (error) throw error;
      toast.success("Staff details saved.");
      setEditStaff(null);
      void loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save details.");
    }
  };

  // Log reprint

  const logReprint = async (type: string, id: string, reason: string) => {
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
    } catch (err) {
      // Background logging — non-critical
    }
  };

  // Generate individual card PDF
  const downloadSinglePDF = async (
    type: "student" | "staff" | "visitor",
    record: any,
    mode: PdfExportMode,
  ) => {
    setExporting(true);

    // Wait for React to render the hidden elements in the DOM
    await new Promise((resolve) => setTimeout(resolve, 100));

    const frontEl = document.getElementById(`id-card-preview-front-${record.id || record.user_id}`);
    const backEl = document.getElementById(`id-card-preview-back-${record.id || record.user_id}`);

    if (!frontEl || (!backEl && mode !== "front-only")) {
      toast.error("Preview card element not found.");
      setExporting(false);
      return;
    }

    try {
      const cardPxW = orientation === "portrait" ? 250 : 396;
      const cardPxH = orientation === "portrait" ? 396 : 250;

      const frontCanvas = await safeHtml2Canvas(frontEl, {
        scale: 4,
        width: cardPxW,
        height: cardPxH,
        windowWidth: cardPxW,
        windowHeight: cardPxH,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      });
      const frontImg = frontCanvas.toDataURL("image/png");

      let backImg = null;
      if (mode !== "front-only" && backEl) {
        const backCanvas = await safeHtml2Canvas(backEl, {
          scale: 4,
          width: cardPxW,
          height: cardPxH,
          windowWidth: cardPxW,
          windowHeight: cardPxH,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        });
        backImg = backCanvas.toDataURL("image/png");
      }

      const cardW = orientation === "portrait" ? 53.98 : 85.60;
      const cardH = orientation === "portrait" ? 85.60 : 53.98;

      if (mode === "side-by-side") {
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [cardW * 2, cardH],
          compress: true,
        });
        pdf.addImage(frontImg, "PNG", 0, 0, cardW, cardH);
        if (backImg) pdf.addImage(backImg, "PNG", cardW, 0, cardW, cardH);
        pdf.save(`${record.full_name || record.visitor_name || "id"}_card.pdf`);
      } else if (mode === "a4-sheet") {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });
        // Center on standard A4 (210 x 297 mm) with cut guide borders
        const startX = (210 - cardW) / 2;
        const startY = backImg ? 70 : (297 - cardH) / 2;
        pdf.addImage(frontImg, "PNG", startX, startY, cardW, cardH);
        if (backImg) {
          pdf.addImage(backImg, "PNG", startX, startY + cardH + 12, cardW, cardH);
        }
        pdf.save(`${record.full_name || record.visitor_name || "id"}_card_a4.pdf`);
      } else {
        const pdf = new jsPDF({
          orientation: orientation,
          unit: "mm",
          format: [cardW, cardH],
          compress: true,
        });
        pdf.addImage(frontImg, "PNG", 0, 0, cardW, cardH);
        if (mode === "front-back" && backImg) {
          pdf.addPage([cardW, cardH], orientation);
          pdf.addImage(backImg, "PNG", 0, 0, cardW, cardH);
        }
        pdf.save(`${record.full_name || record.visitor_name || "id"}_card.pdf`);
      }
      toast.success("PDF exported successfully.");

      void logReprint(type, record.id || record.user_id, "Individual Download");
    } catch (err: any) {
      toast.error("Failed to generate PDF: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  // Bulk PDF generation supporting both Individual CR80 PVC Cards and A4 Printable Sheet Grid
  const downloadBulkPDF = async (type: "student" | "staff", mode: PdfExportMode) => {
    const list =
      type === "student"
        ? students.filter((s) => (selectedStudentIds ?? []).includes(s.id))
        : staff.filter((t) => (selectedStaffIds ?? []).includes(t.user_id));

    if (list.length === 0) {
      toast.error("Please select at least one record to generate.");
      return;
    }

    setExporting(true);
    cancelRef.current = false;
    setBulkProgress({ current: 0, total: list.length, activeName: "" });
    toast.info(`Initializing bulk PDF generation...`);

    // Wait for React to render the hidden elements in the DOM
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const cardW = orientation === "portrait" ? 53.98 : 85.60;
      const cardH = orientation === "portrait" ? 85.60 : 53.98;

      if (mode === "a4-sheet") {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // 2 columns x 4 rows = 8 cards per A4 page (210 x 297 mm)
        const cols = 2;
        const rows = 4;
        const perPage = cols * rows;
        const startX = 14.4;
        const gapX = 10.0;
        const startY = 22.5;
        const gapY = 8.0;

        for (let chunkIdx = 0; chunkIdx < list.length; chunkIdx += perPage) {
          if (cancelRef.current) break;
          const chunk = list.slice(chunkIdx, chunkIdx + perPage);
          if (chunkIdx > 0) pdf.addPage("a4", "portrait");

          const frontImages: (string | null)[] = [];
          const backImages: (string | null)[] = [];

          // Capture front and back cards
          for (let i = 0; i < chunk.length; i++) {
            const rec = chunk[i];
            const activeName = (rec as any).full_name || (rec as any).visitor_name || "Card";
            setBulkProgress({ current: chunkIdx + i + 1, total: list.length, activeName });

            const frontEl = document.getElementById(
              `bulk-card-front-${(rec as any).id || (rec as any).user_id}`,
            );
            const backEl = document.getElementById(
              `bulk-card-back-${(rec as any).id || (rec as any).user_id}`,
            );

            const cardPxW = orientation === "portrait" ? 250 : 396;
            const cardPxH = orientation === "portrait" ? 396 : 250;

            const frontCanvas = frontEl
              ? await safeHtml2Canvas(frontEl, {
                  scale: 4,
                  width: cardPxW,
                  height: cardPxH,
                  windowWidth: cardPxW,
                  windowHeight: cardPxH,
                  x: 0,
                  y: 0,
                  scrollX: 0,
                  scrollY: 0,
                })
              : null;
            const backCanvas = backEl
              ? await safeHtml2Canvas(backEl, {
                  scale: 4,
                  width: cardPxW,
                  height: cardPxH,
                  windowWidth: cardPxW,
                  windowHeight: cardPxH,
                  x: 0,
                  y: 0,
                  scrollX: 0,
                  scrollY: 0,
                })
              : null;

            frontImages.push(frontCanvas ? frontCanvas.toDataURL("image/png") : null);
            backImages.push(backCanvas ? backCanvas.toDataURL("image/png") : null);

            // Draw front card on A4 sheet
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + col * (cardW + gapX);
            const y = startY + row * (cardH + gapY);

            if (frontImages[i]) {
              pdf.addImage(frontImages[i]!, "PNG", x, y, cardW, cardH);
            }
          }

          // Draw duplex back page if back images exist
          const hasBack = backImages.some(Boolean);
          if (hasBack) {
            pdf.addPage("a4", "portrait");
            for (let i = 0; i < chunk.length; i++) {
              if (backImages[i]) {
                const col = i % cols;
                const mirroredCol = (cols - 1) - col; // Mirror columns for duplex alignment
                const row = Math.floor(i / cols);
                const x = startX + mirroredCol * (cardW + gapX);
                const y = startY + row * (cardH + gapY);
                pdf.addImage(backImages[i]!, "PNG", x, y, cardW, cardH);
              }
            }
          }
        }

        if (!cancelRef.current) {
          pdf.save(`bulk_${type}_cards_a4_grid.pdf`);
          toast.success(`Exported ${list.length} cards to printable A4 sheet.`);
        }
      } else {
        // Individual CR80 PVC card mode
        let pdf: jsPDF;
        if (mode === "side-by-side") {
          pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [cardW * 2, cardH],
            compress: true,
          });
        } else {
          pdf = new jsPDF({
            orientation: orientation,
            unit: "mm",
            format: [cardW, cardH],
            compress: true,
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
          const activeName = (rec as any).full_name || (rec as any).visitor_name || "Card";
          setBulkProgress({ current: i + 1, total: list.length, activeName });

          const frontEl = document.getElementById(
            `bulk-card-front-${(rec as any).id || (rec as any).user_id}`,
          );
          const backEl = document.getElementById(
            `bulk-card-back-${(rec as any).id || (rec as any).user_id}`,
          );

          if (!frontEl) continue;

          const cardPxW = orientation === "portrait" ? 250 : 396;
          const cardPxH = orientation === "portrait" ? 396 : 250;

          const frontCanvas = await safeHtml2Canvas(frontEl, {
            scale: 4,
            width: cardPxW,
            height: cardPxH,
            windowWidth: cardPxW,
            windowHeight: cardPxH,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: 0,
          });
          const frontImg = frontCanvas.toDataURL("image/png");

          let backImg = null;
          if (mode !== "front-only" && backEl) {
            const backCanvas = await safeHtml2Canvas(backEl, {
              scale: 4,
              width: cardPxW,
              height: cardPxH,
              windowWidth: cardPxW,
              windowHeight: cardPxH,
              x: 0,
              y: 0,
              scrollX: 0,
              scrollY: 0,
            });
            backImg = backCanvas.toDataURL("image/png");
          }

          if (mode === "side-by-side") {
            if (!isFirstPage)
              pdf.addPage([cardW * 2, cardH], "landscape");
            pdf.addImage(frontImg, "PNG", 0, 0, cardW, cardH);
            if (backImg) pdf.addImage(backImg, "PNG", cardW, 0, cardW, cardH);
          } else {
            if (!isFirstPage) pdf.addPage([cardW, cardH], orientation);
            pdf.addImage(frontImg, "PNG", 0, 0, cardW, cardH);
            if (mode === "front-back" && backImg) {
              pdf.addPage([cardW, cardH], orientation);
              pdf.addImage(backImg, "PNG", 0, 0, cardW, cardH);
            }
          }
          isFirstPage = false;

          void logReprint(type, (rec as any).id || (rec as any).user_id, "Bulk Download");

          // Yield main thread in batches
          if (i % batchSize === 0 && i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 80));
          }
        }

        if (!cancelRef.current) {
          pdf.save(`bulk_${type}_cards_cr80.pdf`);
          toast.success(`Exported ${list.length} cards successfully.`);
        }
      }
    } catch (err: any) {
      toast.error("Failed to export bulk PDF: " + err.message);
    } finally {
      setExporting(false);
      setBulkProgress(null);
    }
  };

  // Trigger browser print
  const handlePrint = (
    type: "student" | "staff" | "visitor",
    list: any[],
    layout: "pvc" | "a4",
  ) => {
    setPrintTarget({ type, list });
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

  // Bulk Selection Helpers
  const handleSelectEntireClass = () => {
    setSelectedStudentIds(filteredStudents.map((s) => s.id));
    toast.success(`Selected all ${filteredStudents.length} class students.`);
  };

  const handleSelectSchoolWide = () => {
    setSelectedStudentIds(students.map((s) => s.id));
    toast.success(`Selected all ${students.length} students school-wide.`);
  };

  // Student Filter logic
  const filteredStudents = students.filter((s) => {
    const term = studentSearch.toLowerCase();
    const matchesSearch =
      s.full_name?.toLowerCase()?.includes(term) ||
      (s.admission_number || "").toLowerCase().includes(term) ||
      (s.roll_number || "").toLowerCase().includes(term);

    const matchesClass = studentClassFilter === "all" || s.class_id === studentClassFilter;

    let matchesPhoto = true;
    if (studentPhotoFilter === "missing") matchesPhoto = !s.photo_url;
    else if (studentPhotoFilter === "present") matchesPhoto = !!s.photo_url;

    return matchesSearch && matchesClass && matchesPhoto;
  });

  // Staff Filter logic
  const filteredStaff = staff.filter((t) => {
    const term = staffSearch.toLowerCase();
    const matchesSearch =
      t.full_name?.toLowerCase()?.includes(term) ||
      (t.employee_id || "").toLowerCase().includes(term);
    const matchesDept = staffDeptFilter === "all" || t.department === staffDeptFilter;
    return matchesSearch && matchesDept;
  });

  const departmentsList = Array.from(new Set(staff.map((t) => t.department).filter(Boolean)));
  const principalSignature = school?.principal_signature_url || null;

  // Counts expired cards (academic year not current)
  const expiredCount = students.filter(
    (s) => s.academic_year && s.academic_year !== "2025-2026",
  ).length;

  if (tenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>

          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="ID Cards"
        breadcrumb="Card & Visitor Passes"
        actions={
          <div className="flex bg-secondary/80 rounded-xl p-1.5 overflow-x-auto max-w-full gap-1 min-h-[44px]">
            {(
              ["overview", "students", "staff", "visitors", "settings", "reports"] as TabType[]
            ).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 min-h-[40px] text-xs sm:text-sm font-bold rounded-lg capitalize transition-all shrink-0 cursor-pointer ${
                  activeTab === t
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 print:hidden">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiWidget
                title="Total Cards"
                count={students.length + staff.length}
                subtext="Enrolled profiles"
                icon={<Users className="size-5 text-brand" />}
              />
              <KpiWidget
                title="Visitor Passes"
                count={visitors.length}
                subtext={`${visitors.filter((v) => !v.check_out_time).length} active guests`}
                icon={<UserCheck className="size-5 text-warning" />}
              />
              <KpiWidget
                title="Missing Photos"
                count={
                  students.filter((s) => !s.photo_url).length +
                  staff.filter((t) => !t.photo_url).length
                }
                subtext="Requires upload"
                icon={<ShieldAlert className="size-5 text-danger" />}
              />
              <KpiWidget
                title="Expired Cards"
                count={expiredCount}
                subtext="Requires renewal"
                icon={<ClipboardList className="size-5 text-danger" />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Card Config */}
              <section className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Sparkles className="size-4 text-brand" />
                  <h3 className="font-semibold text-sm">Theme Settings</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Template Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as CardTheme)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none"
                    >
                      <option value="modern-blue">
                        Modern School Design (Vertical/Horizontal)
                      </option>
                      <option value="premium-corporate">Premium Corporate Design</option>
                      <option value="gold-premium">Gold Premium Design</option>
                      <option value="school-classic">School Classic Design</option>
                      <option value="minimal">Minimalist Card Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                      Card Orientation Layout
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOrientation("portrait")}
                        className={`py-2 text-xs font-medium rounded-md border text-center transition ${
                          orientation === "portrait"
                            ? "bg-brand text-white border-brand shadow-sm"
                            : "bg-card border-border hover:bg-secondary"
                        }`}
                      >
                        Vertical PVC Size
                      </button>
                      <button
                        onClick={() => setOrientation("landscape")}
                        className={`py-2 text-xs font-medium rounded-md border text-center transition ${
                          orientation === "landscape"
                            ? "bg-brand text-white border-brand shadow-sm"
                            : "bg-card border-border hover:bg-secondary"
                        }`}
                      >
                        Horizontal PVC Size
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Achievements Seeding and Verification Info */}
              <section className="lg:col-span-2 bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm flex items-center gap-1.5">
                    <Trophy className="size-4 text-amber-500" />
                    Achievements Integration Active
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This ID Card Module is fully integrated with the Achievements & Rankings system.
                    If a student has a class rank of #1, #2, or #3 (e.g., Aarav Sharma is Rank #1),
                    the front of their card will dynamically display a gold/silver/bronze academic
                    topper medal. Scanning the card's QR code will load the public verification
                    page, displaying real-time database credentials, card status (Active/Inactive),
                    and official honors.
                  </p>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border mt-4">
                  <button
                    onClick={() => setActiveTab("students")}
                    className="px-3 py-2 text-xs bg-brand text-white rounded-md font-semibold"
                  >
                    Manage Students
                  </button>
                  <button
                    onClick={() => setActiveTab("staff")}
                    className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/70 border border-border rounded-md font-semibold text-foreground"
                  >
                    Manage Staff
                  </button>
                  <button
                    onClick={() => setActiveTab("visitors")}
                    className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/70 border border-border rounded-md font-semibold text-foreground"
                  >
                    Guest passes
                  </button>
                </div>
              </section>
            </div>

            {/* Reprint logs history */}
            <section className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <History className="size-4 text-muted-foreground" />
                  Recent Issuance & Reprint Logs
                </h3>
                <span className="text-xs text-muted-foreground">
                  {history.length} records logged
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary text-muted-foreground">
                    <tr>
                      <th className="px-6 py-2.5 font-medium">Date & Time</th>
                      <th className="px-6 py-2.5 font-medium">Card Type</th>
                      <th className="px-6 py-2.5 font-medium">Holder Reference ID</th>
                      <th className="px-6 py-2.5 font-medium">Operator</th>
                      <th className="px-6 py-2.5 font-medium">Issuance Reason</th>
                      <th className="px-6 py-2.5 font-medium">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-muted-foreground">
                    {history.slice(0, 5).map((h) => (
                      <tr key={h.id} className="hover:bg-secondary/20">
                        <td className="px-6 py-3 font-mono">
                          {new Date(h.printed_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-3 font-semibold uppercase">{h.card_type}</td>
                        <td className="px-6 py-3 font-mono">{h.holder_id}</td>
                        <td className="px-6 py-3">{h.profiles?.full_name || "Operator"}</td>
                        <td className="px-6 py-3">{h.reason || "First Issue"}</td>
                        <td className="px-6 py-3">{h.academic_year}</td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-slate-400">
                          No print logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: STUDENT ID CARDS */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search student name, admission #..."
                    className="w-full h-11 min-h-[46px] px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  />
                </div>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5">
                  <select
                    value={studentClassFilter}
                    onChange={(e) => setStudentClassFilter(e.target.value)}
                    className="h-11 min-h-[46px] px-3.5 py-2 text-xs sm:text-sm font-medium border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    <option value="all">All Classes</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.section ? ` · ${c.section}` : ""}
                      </option>
                    ))}
                  </select>
                  <select
                    value={studentPhotoFilter}
                    onChange={(e) => setStudentPhotoFilter(e.target.value)}
                    className="h-11 min-h-[46px] px-3.5 py-2 text-xs sm:text-sm font-medium border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                  >
                    <option value="all">All Photos</option>
                    <option value="present">With Photo</option>
                    <option value="missing">Missing Photo</option>
                  </select>
                </div>
              </div>

              {/* Bulk operations toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSelectEntireClass}
                    className="h-10 min-h-[42px] px-3.5 py-2 text-xs font-semibold border border-border bg-secondary hover:bg-secondary/80 rounded-xl text-foreground inline-flex items-center gap-1.5 cursor-pointer transition active:scale-[0.98]"
                  >
                    <CheckSquare className="size-3.5 text-primary" />
                    Select Class
                  </button>
                  <button
                    onClick={handleSelectSchoolWide}
                    className="h-10 min-h-[42px] px-3.5 py-2 text-xs font-semibold border border-border bg-secondary hover:bg-secondary/80 rounded-xl text-foreground inline-flex items-center gap-1.5 cursor-pointer transition active:scale-[0.98]"
                  >
                    <Users className="size-3.5 text-primary" />
                    Select School-wide
                  </button>
                  {selectedStudentIds.length > 0 && (
                    <button
                      onClick={() => setSelectedStudentIds([])}
                      className="h-10 min-h-[42px] px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer"
                    >
                      Clear ({selectedStudentIds.length})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {selectedStudentIds.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-block text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {selectedStudentIds.length} selected
                      </span>
                      <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-1 shadow-sm">
                        <select
                          value={pdfExportMode}
                          onChange={(e) => setPdfExportMode(e.target.value as PdfExportMode)}
                          className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer appearance-none px-2.5 py-1.5"
                          title="PDF Layout Options"
                        >
                          <option value="front-back" className="text-slate-900 bg-white">Front+Back (CR80)</option>
                          <option value="front-only" className="text-slate-900 bg-white">Front Only (CR80)</option>
                          <option value="side-by-side" className="text-slate-900 bg-white">Side-by-Side (CR80)</option>
                          <option value="a4-sheet" className="text-slate-900 bg-white">A4 Sheet Grid</option>
                        </select>
                        <button
                          onClick={() => downloadBulkPDF("student", pdfExportMode)}
                          disabled={exporting}
                          className="h-8 px-3 text-xs bg-white/20 hover:bg-white/30 rounded-lg inline-flex items-center gap-1.5 font-bold disabled:opacity-50 transition cursor-pointer"
                        >
                          <FileDown className="size-3.5" /> Export PDF
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const list = students.filter((s) =>
                            (selectedStudentIds ?? []).includes(s.id),
                          );
                          handlePrint("student", list, "a4");
                        }}
                        className="h-10 min-h-[42px] px-3.5 py-2 text-xs bg-secondary border border-border hover:bg-secondary/80 rounded-xl inline-flex items-center gap-1.5 text-foreground font-semibold cursor-pointer transition active:scale-[0.98]"
                      >
                        <Printer className="size-3.5 text-muted-foreground" /> Print A4 Grid
                      </button>
                    </div>
                  )}

                  <div className="flex border border-border rounded-xl overflow-hidden bg-secondary p-0.5">
                    <button
                      onClick={() => setOrientation("portrait")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${orientation === "portrait" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Vert
                    </button>
                    <button
                      onClick={() => setOrientation("landscape")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition ${orientation === "landscape" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Horiz
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE CARD VIEW (< md) */}
            <div className="block md:hidden space-y-3.5">
              {filteredStudents.map((s) => {
                const isTopper = s.rankings?.find((r) => r.rank_position <= 3);
                const studentIdDisplay = getStudentIdFallback(s);
                const isSelected = (selectedStudentIds ?? []).includes(s.id);
                return (
                  <div
                    key={s.id}
                    className={`bg-card border rounded-2xl p-4 shadow-xs transition-all space-y-3 ${
                      isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStudentIds([...selectedStudentIds, s.id]);
                            } else {
                              setSelectedStudentIds(
                                selectedStudentIds.filter((id) => id !== s.id),
                              );
                            }
                          }}
                          className="size-5 rounded-md text-primary focus:ring-primary cursor-pointer mt-0.5"
                        />
                        <div className="relative group size-12 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0">
                          {s.photo_url ? (
                            <img src={s.photo_url} alt="" className="size-full object-cover" />
                          ) : (
                            <User className="size-6 text-slate-400" />
                          )}
                          <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                            <Camera className="size-4 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, "student", s.id)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold text-sm text-foreground">{s.full_name}</h4>
                            {isTopper && (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                <Trophy className="size-2.5" /> Rank {isTopper.rank_position}
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-xs font-semibold text-muted-foreground mt-0.5">
                            {studentIdDisplay}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditStudent(s)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg text-xs font-semibold cursor-pointer"
                        title="Edit Student"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300">
                        Class: {s.classes?.name || "—"} {s.classes?.section ? `(${s.classes.section})` : ""}
                      </span>
                      {s.blood_group && (
                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300">
                          Blood: {s.blood_group}
                        </span>
                      )}
                      {s.transport_route && (
                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
                          Bus: {s.transport_route}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/60">
                      <button
                        onClick={() => {
                          setPreviewCard({ type: "student", data: s });
                          setFlipped(false);
                        }}
                        className="w-full h-11 min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
                      >
                        <Eye className="size-4" />
                        View Student ID Card
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredStudents.length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
                  {loading ? "Loading ERP roster..." : "No student records matching your filters found."}
                </div>
              )}
            </div>

            {/* DESKTOP TABLE VIEW (>= md) */}
            <div className="hidden md:block bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={
                          selectedStudentIds.length === filteredStudents.length &&
                          filteredStudents.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudentIds(filteredStudents.map((s) => s.id));
                          } else {
                            setSelectedStudentIds([]);
                          }
                        }}
                        className="rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3.5 font-semibold">Photo</th>
                    <th className="px-6 py-3.5 font-semibold">Student ID #</th>
                    <th className="px-6 py-3.5 font-semibold">Student Name</th>
                    <th className="px-6 py-3.5 font-semibold">Class / Section</th>
                    <th className="px-6 py-3.5 font-semibold">Blood Group</th>
                    <th className="px-6 py-3.5 font-semibold">Transport / Bus</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map((s) => {
                    const isTopper = s.rankings?.find((r) => r.rank_position <= 3);
                    const studentIdDisplay = getStudentIdFallback(s);
                    return (
                      <tr key={s.id} className="hover:bg-secondary/40 transition">
                        <td className="px-6 py-3.5">
                          <input
                            type="checkbox"
                            checked={(selectedStudentIds ?? []).includes(s.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudentIds([...selectedStudentIds, s.id]);
                              } else {
                                setSelectedStudentIds(
                                  selectedStudentIds.filter((id) => id !== s.id),
                                );
                              }
                            }}
                            className="rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="relative group size-9 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0">
                            {s.photo_url ? (
                              <img src={s.photo_url} alt="" className="size-full object-cover" />
                            ) : (
                              <User className="size-4 text-slate-400" />
                            )}
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                              <Camera className="size-3.5 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, "student", s.id)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-mono font-bold text-foreground">{studentIdDisplay}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground">{s.full_name}</span>
                            {isTopper && (
                              <span className="inline-flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                <Trophy className="size-3" /> Rank {isTopper.rank_position}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-medium">
                          {s.classes?.name || "—"}{" "}
                          {s.classes?.section ? `(${s.classes.section})` : ""}
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="font-bold text-rose-600 dark:text-rose-400">{s.blood_group || "—"}</span>
                        </td>
                        <td className="px-6 py-3.5 truncate max-w-[150px] text-muted-foreground font-medium">
                          {s.transport_route || "—"} {s.bus_number ? `(${s.bus_number})` : ""}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setPreviewCard({ type: "student", data: s });
                                setFlipped(false);
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg inline-flex items-center gap-1 cursor-pointer transition"
                            >
                              <Eye className="size-3.5" /> Preview
                            </button>
                            <button
                              onClick={() => setEditStudent(s)}
                              className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg cursor-pointer transition"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-muted-foreground">
                        {loading
                          ? "Loading ERP roster..."
                          : "No student records matching your filters found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: STAFF ID CARDS */}
        {activeTab === "staff" && (
          <div className="space-y-6">
            {/* Filter controls */}
            <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    placeholder="Search staff name, employee ID..."
                    className="w-full h-11 min-h-[46px] px-4 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                  />
                </div>
                <select
                  value={staffDeptFilter}
                  onChange={(e) => setStaffDeptFilter(e.target.value)}
                  className="h-11 min-h-[46px] px-3.5 py-2 text-xs sm:text-sm font-medium border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  {departmentsList.map((d) => (
                    <option key={d} value={d!}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bulk actions */}
              {selectedStaffIds.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      {selectedStaffIds.length} staff selected
                    </span>
                    <button
                      onClick={() => setSelectedStaffIds([])}
                      className="h-9 px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-1 shadow-sm">
                      <select
                        value={pdfExportMode}
                        onChange={(e) => setPdfExportMode(e.target.value as PdfExportMode)}
                        className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer appearance-none px-2.5 py-1.5"
                        title="PDF Layout Options"
                      >
                        <option value="front-back" className="text-slate-900 bg-white">Front+Back (CR80)</option>
                        <option value="front-only" className="text-slate-900 bg-white">Front Only (CR80)</option>
                        <option value="side-by-side" className="text-slate-900 bg-white">Side-by-Side (CR80)</option>
                        <option value="a4-sheet" className="text-slate-900 bg-white">A4 Sheet Grid</option>
                      </select>
                      <button
                        onClick={() => downloadBulkPDF("staff", pdfExportMode)}
                        disabled={exporting}
                        className="h-8 px-3 text-xs bg-white/20 hover:bg-white/30 rounded-lg inline-flex items-center gap-1.5 font-bold disabled:opacity-50 transition cursor-pointer"
                      >
                        <FileDown className="size-3.5" /> Export PDF
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        const list = staff.filter((t) =>
                          (selectedStaffIds ?? []).includes(t.user_id),
                        );
                        handlePrint("staff", list, "a4");
                      }}
                      className="h-10 min-h-[42px] px-3.5 py-2 text-xs bg-secondary border border-border hover:bg-secondary/80 rounded-xl inline-flex items-center gap-1.5 text-foreground font-semibold cursor-pointer transition active:scale-[0.98]"
                    >
                      <Printer className="size-3.5 text-muted-foreground" /> Print A4 Grid
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE STAFF CARDS (< md) */}
            <div className="block md:hidden space-y-3.5">
              {filteredStaff.map((t) => {
                const staffIdDisplay = getStaffIdFallback(t);
                const isSelected = (selectedStaffIds ?? []).includes(t.user_id);
                return (
                  <div
                    key={t.user_id}
                    className={`bg-card border rounded-2xl p-4 shadow-xs transition-all space-y-3 ${
                      isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/30" : "border-border/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStaffIds([...selectedStaffIds, t.user_id]);
                            } else {
                              setSelectedStaffIds(
                                selectedStaffIds.filter((id) => id !== t.user_id),
                              );
                            }
                          }}
                          className="size-5 rounded-md text-primary focus:ring-primary cursor-pointer mt-0.5"
                        />
                        <div className="relative group size-12 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0">
                          {t.photo_url ? (
                            <img src={t.photo_url} alt="" className="size-full object-cover" />
                          ) : (
                            <User className="size-6 text-slate-400" />
                          )}
                          <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                            <Camera className="size-4 text-white" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload(e, "staff", t.user_id)}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{t.full_name}</h4>
                          <p className="font-mono text-xs font-semibold text-muted-foreground mt-0.5">
                            {staffIdDisplay}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditStaff(t)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg text-xs font-semibold cursor-pointer"
                        title="Edit Staff"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {t.designation && (
                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300">
                          {t.designation}
                        </span>
                      )}
                      {t.department && (
                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300">
                          {t.department}
                        </span>
                      )}
                      {t.mobile_number && (
                        <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground">
                          {t.mobile_number}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border/60">
                      <button
                        onClick={() => {
                          setPreviewCard({ type: "staff", data: t });
                          setFlipped(false);
                        }}
                        className="w-full h-11 min-h-[44px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98]"
                      >
                        <Eye className="size-4" />
                        View Staff ID Card
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredStaff.length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
                  {loading ? "Querying ERP records..." : "No matching staff records found."}
                </div>
              )}
            </div>

            {/* DESKTOP TABLE VIEW (>= md) */}
            <div className="hidden md:block bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={
                          selectedStaffIds.length === filteredStaff.length &&
                          filteredStaff.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStaffIds(filteredStaff.map((t) => t.user_id));
                          } else {
                            setSelectedStaffIds([]);
                          }
                        }}
                        className="rounded cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3.5 font-semibold">Photo</th>
                    <th className="px-6 py-3.5 font-semibold">Employee ID #</th>
                    <th className="px-6 py-3.5 font-semibold">Name</th>
                    <th className="px-6 py-3.5 font-semibold">Designation</th>
                    <th className="px-6 py-3.5 font-semibold">Department</th>
                    <th className="px-6 py-3.5 font-semibold">Contact Number</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStaff.map((t) => {
                    const staffIdDisplay = getStaffIdFallback(t);
                    return (
                      <tr key={t.user_id} className="hover:bg-secondary/40 transition">
                        <td className="px-6 py-3.5">
                          <input
                            type="checkbox"
                            checked={(selectedStaffIds ?? []).includes(t.user_id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStaffIds([...selectedStaffIds, t.user_id]);
                              } else {
                                setSelectedStaffIds(
                                  selectedStaffIds.filter((id) => id !== t.user_id),
                                );
                              }
                            }}
                            className="rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="relative group size-9 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0">
                            {t.photo_url ? (
                              <img src={t.photo_url} alt="" className="size-full object-cover" />
                            ) : (
                              <User className="size-4 text-slate-400" />
                            )}
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                              <Camera className="size-3.5 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, "staff", t.user_id)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 font-mono font-bold text-foreground">{staffIdDisplay}</td>
                        <td className="px-6 py-3.5 font-bold text-foreground">{t.full_name}</td>
                        <td className="px-6 py-3.5 font-medium">{t.designation || "—"}</td>
                        <td className="px-6 py-3.5 text-muted-foreground">{t.department || "—"}</td>
                        <td className="px-6 py-3.5 font-mono text-muted-foreground">{t.mobile_number || "—"}</td>
                        <td className="px-6 py-3.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setPreviewCard({ type: "staff", data: t });
                                setFlipped(false);
                              }}
                              className="px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg inline-flex items-center gap-1 cursor-pointer transition"
                            >
                              <Eye className="size-3.5" /> Preview
                            </button>
                            <button
                              onClick={() => setEditStaff(t)}
                              className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg cursor-pointer transition"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredStaff.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-muted-foreground">
                        {loading ? "Querying ERP records..." : "No matching staff records found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: VISITOR PASSES */}
        {activeTab === "visitors" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Check-in Form */}
            <form
              onSubmit={handleCheckInVisitor}
              className="bg-card border border-border rounded-xl p-5 space-y-4 h-fit"
            >
              <h3 className="font-semibold text-sm border-b border-border pb-3">
                New Visitor Check-In
              </h3>

              {/* Photo Input (Optional) */}
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-semibold text-muted-foreground block text-left">
                  Visitor Snap (Optional)
                </label>
                <div className="size-20 rounded-lg bg-secondary border border-border overflow-hidden mx-auto flex items-center justify-center relative group">
                  {visitorPassPhoto ? (
                    <img src={visitorPassPhoto} alt="Visitor" className="size-full object-cover" />
                  ) : (
                    <Camera className="size-6 text-slate-400" />
                  )}
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <span className="text-[10px] text-white font-medium">Capture</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setVisitorPassPhoto(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Visitor Full Name *</label>
                <input
                  required
                  value={newVisitor.name}
                  onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Contact Number *</label>
                <input
                  required
                  value={newVisitor.phone}
                  onChange={(e) => setNewVisitor({ ...newVisitor, phone: e.target.value })}
                  placeholder="e.g. +91 99000 88000"
                  className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Purpose of Visit</label>
                <input
                  value={newVisitor.purpose}
                  onChange={(e) => setNewVisitor({ ...newVisitor, purpose: e.target.value })}
                  placeholder="e.g. Admissions query"
                  className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Host Member</label>
                <input
                  value={newVisitor.host}
                  onChange={(e) => setNewVisitor({ ...newVisitor, host: e.target.value })}
                  placeholder="e.g. Admin or Principal"
                  className="w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-brand text-white rounded-md text-xs font-semibold hover:opacity-90 transition"
              >
                Issue Pass & Check In
              </button>
            </form>

            {/* Visitors Log */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden h-fit">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-sm">Guest Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary text-muted-foreground">
                    <tr>
                      <th className="px-6 py-2.5 font-medium">Pass Number</th>
                      <th className="px-6 py-2.5 font-medium">Visitor</th>
                      <th className="px-6 py-2.5 font-medium">Purpose / Host</th>
                      <th className="px-6 py-2.5 font-medium">Checked In</th>
                      <th className="px-6 py-2.5 font-medium">Checked Out</th>
                      <th className="px-6 py-2.5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visitors.map((v) => (
                      <tr key={v.id} className="hover:bg-secondary/15">
                        <td className="px-6 py-3 font-mono font-semibold text-slate-700">
                          {v.pass_number}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {v.photo_url ? (
                              <img
                                src={v.photo_url}
                                alt=""
                                className="size-6 rounded object-cover"
                              />
                            ) : (
                              <User className="size-4 text-slate-400" />
                            )}
                            <span className="font-semibold text-foreground">{v.visitor_name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground block font-mono">
                            {v.contact_number}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <p className="font-medium text-foreground">{v.purpose_of_visit || "—"}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Host: {v.host_name || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground font-mono">
                          {new Date(v.check_in_time).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-3 font-mono">
                          {v.check_out_time ? (
                            <span className="text-slate-400">
                              {new Date(v.check_out_time).toLocaleTimeString()}
                            </span>
                          ) : (
                            <span className="text-emerald-500 font-semibold uppercase tracking-wider text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setPreviewCard({ type: "visitor", data: v });
                                setFlipped(false);
                              }}
                              className="text-brand hover:underline inline-flex items-center font-semibold"
                            >
                              Badge
                            </button>
                            {!v.check_out_time && (
                              <button
                                onClick={() => handleCheckOutVisitor(v.id)}
                                className="text-danger hover:underline font-semibold"
                              >
                                Check Out
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {visitors.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          No visitors logged today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-card border border-border rounded-xl overflow-hidden p-6 space-y-6">
            <h3 className="font-semibold text-sm border-b border-border pb-3 flex items-center gap-2">
              <Settings className="size-4 text-brand" />
              School Details Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* School Logo upload */}
              <div className="space-y-2 text-center border-r border-border pr-6">
                <label className="text-xs font-semibold block text-left mb-2">
                  School Official Logo
                </label>
                <div className="size-24 rounded-xl bg-slate-50 border border-dashed border-border mx-auto flex items-center justify-center overflow-hidden relative group">
                  {school?.logo_url ? (
                    <img
                      src={school.logo_url}
                      alt="Logo"
                      className="size-full object-contain p-2"
                    />
                  ) : (
                    <ImageIcon className="size-8 text-slate-400" />
                  )}
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <span className="text-[10px] text-white font-medium">Upload logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "school", schoolId!)}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-muted-foreground">Format: PNG/JPG square</p>
              </div>

              {/* Principal Signature */}
              <div className="space-y-2 text-center col-span-2">
                <label className="text-xs font-semibold block text-left mb-2">
                  Principal Official Signature
                </label>
                <div className="h-24 w-full rounded-xl bg-slate-50 border border-dashed border-border flex items-center justify-center overflow-hidden relative group p-2">
                  {principalSignature ? (
                    <img
                      src={principalSignature}
                      alt="Signature"
                      className="h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Sparkles className="size-6 text-slate-400 mx-auto mb-1" />
                      <span className="text-[11px] text-muted-foreground">
                        No signature uploaded
                      </span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                    <span className="text-xs text-white font-medium">Upload Signature Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, "signature", schoolId!)}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-muted-foreground text-left">
                  Upload transparent PNG signature of the school principal.
                </p>
              </div>
            </div>

            {/* School Profile Fields */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!school || !schoolId) return;
                try {
                  const { error } = await (supabase as any)
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
                } catch (err: any) {
                  toast.error(err.message || "Failed to update settings.");
                }
              }}
              className="space-y-4 pt-4 border-t border-border"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold block mb-1">School Official Name</label>
                  <input
                    required
                    value={school?.name || ""}
                    onChange={(e) => setSchool((s) => (s ? { ...s, name: e.target.value } : null))}
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold block mb-1">
                    School Physical Address
                  </label>
                  <input
                    required
                    value={school?.address || ""}
                    onChange={(e) =>
                      setSchool((s) => (s ? { ...s, address: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">School Contact Phone</label>
                  <input
                    value={school?.phone_number || ""}
                    onChange={(e) =>
                      setSchool((s) => (s ? { ...s, phone_number: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">School Official Email</label>
                  <input
                    type="email"
                    value={school?.email || ""}
                    onChange={(e) => setSchool((s) => (s ? { ...s, email: e.target.value } : null))}
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold block mb-1">School Principal Name</label>
                  <input
                    value={school?.principal_name || ""}
                    onChange={(e) =>
                      setSchool((s) => (s ? { ...s, principal_name: e.target.value } : null))
                    }
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                    placeholder="Enter Principal Name"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-brand text-white font-semibold rounded-md hover:opacity-90"
                >
                  Save School Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Missing Photos log */}
              <section className="bg-card border border-border rounded-xl p-5 space-y-4 h-fit">
                <h3 className="font-semibold text-sm border-b border-border pb-3 flex items-center gap-2">
                  <ShieldAlert className="size-4 text-danger" />
                  Profiles Missing Photos
                </h3>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {students
                    .filter((s) => !s.photo_url)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between text-xs border-b border-border/50 pb-2"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{s.full_name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Student · {s.classes?.name || "Unassigned"}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-danger-soft text-danger text-[9px] font-bold uppercase tracking-wider">
                          No Photo
                        </span>
                      </div>
                    ))}
                  {staff
                    .filter((t) => !t.photo_url)
                    .map((t) => (
                      <div
                        key={t.user_id}
                        className="flex items-center justify-between text-xs border-b border-border/50 pb-2"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{t.full_name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Staff · {t.department || "General"}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-danger-soft text-danger text-[9px] font-bold uppercase tracking-wider">
                          No Photo
                        </span>
                      </div>
                    ))}
                  {students.filter((s) => !s.photo_url).length === 0 &&
                    staff.filter((t) => !t.photo_url).length === 0 && (
                      <p className="text-center text-slate-400 py-10">
                        All profiles have registered photos.
                      </p>
                    )}
                </div>
              </section>

              {/* Printing Analytics */}
              <section className="bg-card border border-border rounded-xl p-5 space-y-4 h-fit">
                <h3 className="font-semibold text-sm border-b border-border pb-3 flex items-center gap-2">
                  <ClipboardList className="size-4 text-brand" />
                  Reprint Logs & Operator Audit
                </h3>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between text-xs border-b border-border/50 pb-2"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {h.card_type.toUpperCase()} Card Issued
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Operator: {h.profiles?.full_name || "Admin"} · {h.reason || "First Issue"}
                        </p>
                      </div>
                      <span className="font-mono text-slate-400 text-[10px]">
                        {new Date(h.printed_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <p className="text-center text-slate-400 py-10">No reprint history logged.</p>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      {bulkProgress && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center">
            <h3 className="font-bold text-base">Generating PDF Cards</h3>
            <p className="text-xs text-muted-foreground">
              Drawing card for{" "}
              <span className="font-semibold text-foreground">{bulkProgress.activeName}</span>...
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-brand h-full transition-all duration-300"
                style={{
                  width: `${Math.round((bulkProgress.current / bulkProgress.total) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs font-semibold">
              {bulkProgress.current} / {bulkProgress.total} (
              {Math.round((bulkProgress.current / bulkProgress.total) * 100)}%)
            </p>
            <button
              onClick={() => {
                cancelRef.current = true;
              }}
              className="px-4 py-2 text-xs border border-border rounded-md hover:bg-danger-soft hover:text-danger hover:border-danger transition-colors cursor-pointer w-full font-medium"
            >
              Cancel Process
            </button>
          </div>
        </div>
      )}

      {/* Off-screen container for html2canvas rendering with exact 0-offset coordinates */}
      <div
        style={{
          position: "fixed",
          left: "0px",
          top: "0px",
          zIndex: -9999,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        {exporting && (
          <div className="space-y-4">
            {/* Hidden Single Export Components to avoid 3D Flip mirroring */}
            {previewCard && (
              <div className="flex gap-4">
                <div
                  id={`id-card-preview-front-${previewCard.data.id || previewCard.data.user_id}`}
                  style={{
                    width: orientation === "portrait" ? "250px" : "396px",
                    height: orientation === "portrait" ? "396px" : "250px",
                    transform: "none",
                    rotate: "0deg",
                    scale: "1",
                  }}
                >
                  <IDCardComponent
                    rec={previewCard.data}
                    type={previewCard.type as any}
                    theme={theme}
                    orientation={orientation}
                    school={school}
                    side="front"
                    signature={principalSignature}
                  />
                </div>
                <div
                  id={`id-card-preview-back-${previewCard.data.id || previewCard.data.user_id}`}
                  style={{
                    width: orientation === "portrait" ? "250px" : "396px",
                    height: orientation === "portrait" ? "396px" : "250px",
                    transform: "none",
                    rotate: "0deg",
                    scale: "1",
                  }}
                >
                  <IDCardComponent
                    rec={previewCard.data}
                    type={previewCard.type as any}
                    theme={theme}
                    orientation={orientation}
                    school={school}
                    side="back"
                    signature={principalSignature}
                  />
                </div>
              </div>
            )}
            {students
              .filter((s) => (selectedStudentIds ?? []).includes(s.id))
              .map((s) => (
                <div key={`bulk-student-${s.id}`} className="flex gap-4">
                  <div
                    id={`bulk-card-front-${s.id}`}
                    style={{
                      width: orientation === "portrait" ? "250px" : "396px",
                      height: orientation === "portrait" ? "396px" : "250px",
                    }}
                  >
                    <IDCardComponent
                      rec={s}
                      type="student"
                      theme={theme}
                      orientation={orientation}
                      school={school}
                      side="front"
                      signature={principalSignature}
                    />
                  </div>
                  <div
                    id={`bulk-card-back-${s.id}`}
                    style={{
                      width: orientation === "portrait" ? "250px" : "396px",
                      height: orientation === "portrait" ? "396px" : "250px",
                    }}
                  >
                    <IDCardComponent
                      rec={s}
                      type="student"
                      theme={theme}
                      orientation={orientation}
                      school={school}
                      side="back"
                      signature={principalSignature}
                    />
                  </div>
                </div>
              ))}
            {staff
              .filter((t) => (selectedStaffIds ?? []).includes(t.user_id))
              .map((t) => (
                <div key={`bulk-staff-${t.user_id}`} className="flex gap-4">
                  <div
                    id={`bulk-card-front-${t.user_id}`}
                    style={{
                      width: orientation === "portrait" ? "250px" : "396px",
                      height: orientation === "portrait" ? "396px" : "250px",
                    }}
                  >
                    <IDCardComponent
                      rec={t}
                      type="staff"
                      theme={theme}
                      orientation={orientation}
                      school={school}
                      side="front"
                      signature={principalSignature}
                    />
                  </div>
                  <div
                    id={`bulk-card-back-${t.user_id}`}
                    style={{
                      width: orientation === "portrait" ? "250px" : "396px",
                      height: orientation === "portrait" ? "396px" : "250px",
                    }}
                  >
                    <IDCardComponent
                      rec={t}
                      type="staff"
                      theme={theme}
                      orientation={orientation}
                      school={school}
                      side="back"
                      signature={principalSignature}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* TAB 7: MODAL SINGLE CARD INTERACTIVE PREVIEW */}
      {previewCard && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setPreviewCard(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-6"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-semibold text-sm capitalize">
                {previewCard.type} ID Card Preview
              </h2>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFlipped(!flipped)}
                  className="px-2 py-1 text-xs border border-border rounded-md bg-secondary hover:bg-secondary/70 font-semibold"
                >
                  Flip Card
                </button>
                <div className="flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5">
                  <select
                    value={pdfExportMode}
                    onChange={(e) => setPdfExportMode(e.target.value as PdfExportMode)}
                    className="bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2"
                    style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                  >
                    <option value="front-back">Front+Back (CR80)</option>
                    <option value="front-only">Front Only (CR80)</option>
                    <option value="side-by-side">Side-by-Side (CR80)</option>
                    <option value="a4-sheet">A4 Sheet Grid</option>
                  </select>
                  <button
                    onClick={() =>
                      downloadSinglePDF(previewCard.type as any, previewCard.data, pdfExportMode)
                    }
                    disabled={exporting}
                    className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition"
                  >
                    <Download className="size-3" /> PDF
                  </button>
                </div>
              </div>
            </div>

            {/* 3D Flip Container with Realistic Gloss & Metallic details */}
            <div className="flex justify-center py-6">
              <div
                className="perspective-[1000px]"
                style={{
                  width: orientation === "portrait" ? "250px" : "396px",
                  height: orientation === "portrait" ? "396px" : "250px",
                }}
              >
                <div
                  className="w-full h-full relative transition-transform duration-500 transform-style-3d shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-xl"
                  style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-slate-50">
                    <IDCardComponent
                      rec={previewCard.data}
                      type={previewCard.type as any}
                      theme={theme}
                      orientation={orientation}
                      school={school}
                      side="front"
                      signature={principalSignature}
                    />
                    {/* Realistic Gloss Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay" />
                  </div>

                  {/* Back Side */}
                  <div
                    className="absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-slate-50"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <IDCardComponent
                      rec={previewCard.data}
                      type={previewCard.type as any}
                      theme={theme}
                      orientation={orientation}
                      school={school}
                      side="back"
                      signature={principalSignature}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Tip: Interactive 3D preview. Click 'Flip Card' to see front and back overlays.
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setPreviewCard(null)}
                className="px-4 py-1.5 text-xs border border-border rounded-md font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editStudent && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setEditStudent(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveStudent}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-semibold text-sm border-b border-border pb-3">
              Edit Student Details
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Full Name</label>
                <input
                  required
                  value={editStudent.full_name}
                  onChange={(e) => setEditStudent({ ...editStudent, full_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Admission Number</label>
                <input
                  required
                  value={editStudent.admission_number || ""}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, admission_number: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Roll Number</label>
                <input
                  value={editStudent.roll_number || ""}
                  onChange={(e) => setEditStudent({ ...editStudent, roll_number: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Blood Group</label>
                <input
                  value={editStudent.blood_group || ""}
                  onChange={(e) => setEditStudent({ ...editStudent, blood_group: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">DOB (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={editStudent.date_of_birth || ""}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, date_of_birth: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Emergency Contact</label>
                <input
                  value={editStudent.emergency_contact || ""}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, emergency_contact: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Parent/Guardian Name</label>
                <input
                  value={editStudent.parent_name || ""}
                  onChange={(e) => setEditStudent({ ...editStudent, parent_name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Parent Phone Number</label>
                <input
                  value={editStudent.parent_phone || ""}
                  onChange={(e) => setEditStudent({ ...editStudent, parent_phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Transport Route</label>
                <input
                  value={editStudent.transport_route || ""}
                  onChange={(e) =>
                    setEditStudent({ ...editStudent, transport_route: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Bus Number</label>
                <input
                  value={editStudent.bus_number || ""}
                  onChange={(e) => setEditStudent({ ...editStudent, bus_number: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setEditStudent(null)}
                className="px-3 py-2 text-xs border border-border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-xs bg-brand text-white font-semibold rounded-md"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editStaff && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto"
          onClick={() => setEditStaff(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveStaff}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-semibold text-sm border-b border-border pb-3">
              Edit Staff Details
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Employee ID</label>
                <input
                  required
                  value={editStaff.employee_id || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, employee_id: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Designation</label>
                <input
                  value={editStaff.designation || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, designation: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Department</label>
                <input
                  value={editStaff.department || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Blood Group</label>
                <input
                  value={editStaff.blood_group || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, blood_group: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Mobile Number</label>
                <input
                  value={editStaff.mobile_number || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, mobile_number: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Emergency Contact</label>
                <input
                  value={editStaff.emergency_contact || ""}
                  onChange={(e) =>
                    setEditStaff({ ...editStaff, emergency_contact: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold block mb-1">Physical Address</label>
                <input
                  value={editStaff.address || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold block mb-1">Card Back Notes</label>
                <textarea
                  rows={2}
                  value={editStaff.notes || ""}
                  onChange={(e) => setEditStaff({ ...editStaff, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setEditStaff(null)}
                className="px-3 py-2 text-xs border border-border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-xs bg-brand text-white font-semibold rounded-md"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CROP IMAGE MODAL */}
      {cropTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h2 className="font-semibold text-sm border-b border-border pb-3">
              Crop Profile Photo
            </h2>
            <ImageCropper
              imageSrc={cropTarget.original}
              onCrop={saveCroppedPhoto}
              onCancel={() => setCropTarget(null)}
              circular={cropTarget.type !== "school" && cropTarget.type !== "signature"}
            />
          </div>
        </div>
      )}

      {/* PRINT STYLES DYNAMIC INJECTION */}
      <style>{`
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
      `}</style>

      {/* Browser Print Container */}
      {printLayout !== "none" && printTarget && (
        <div id="id-card-print-container" className="hidden print:block">
          <div className="a4-page">
            <div className={orientation === "portrait" ? "a4-grid-portrait" : "a4-grid-landscape"}>
              {printTarget.list.map((item, idx) => {
                const cardId = item.id || item.user_id;
                return (
                  <div
                    key={`print-${cardId}-${idx}`}
                    className={
                      orientation === "portrait" ? "print-card-portrait" : "print-card-landscape"
                    }
                  >
                    <IDCardComponent
                      rec={item}
                      type={printTarget.type as any}
                      theme={theme}
                      orientation={orientation}
                      school={school}
                      side="front"
                      signature={principalSignature}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="a4-page" style={{ pageBreakBefore: "always" }}>
            <div className={orientation === "portrait" ? "a4-grid-portrait" : "a4-grid-landscape"}>
              {printTarget.list.map((item, idx) => {
                const cardId = item.id || item.user_id;
                return (
                  <div
                    key={`print-back-${cardId}-${idx}`}
                    className={
                      orientation === "portrait" ? "print-card-portrait" : "print-card-landscape"
                    }
                  >
                    <IDCardComponent
                      rec={item}
                      type={printTarget.type as any}
                      theme={theme}
                      orientation={orientation}
                      school={school}
                      side="back"
                      signature={principalSignature}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// CARD COMPONENT WITH ALL 5 THEMES, SIDES, ORIENTATIONS
interface IDCardCompProps {
  rec: any;
  type: "student" | "staff" | "visitor";
  theme: CardTheme;
  orientation: CardOrientation;
  school: SchoolDetails | null;
  side?: "front" | "back" | "both";
  signature?: string | null;
}

export function SchoolCrestPlaceholder({ className = "size-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 6v10M9 8h6M9 11h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M12 6l-3 3M12 6l3 3M12 11l-3 3M12 11l3 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IDCardComponent({
  rec,
  type,
  theme,
  orientation,
  school,
  side = "front",
  signature,
}: IDCardCompProps) {
  const isStudent = type === "student";
  const isVisitor = type === "visitor";

  const identifier = isStudent
    ? getStudentIdFallback(rec)
    : isVisitor
      ? rec.pass_number
      : getStaffIdFallback(rec);
  // Use window.location.origin so the QR verification link works both locally and in production.
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

  // Adaptive Typography Calculators to guarantee zero clipping, merging, or overflow
  const nameLen = (displayName || "").length;
  const nameStyle = {
    fontSize:
      orientation === "portrait"
        ? nameLen > 32
          ? "8px"
          : nameLen > 24
            ? "9.5px"
            : nameLen > 15
              ? "11px"
              : "12.5px"
        : nameLen > 32
          ? "8.5px"
          : nameLen > 24
            ? "10px"
            : nameLen > 15
              ? "11.5px"
              : "13px",
    lineHeight: nameLen > 24 ? "1.15" : "1.25",
  };

  const schoolLen = (school?.name || "").length;
  const schoolStyle = {
    fontSize: schoolLen > 35 ? "8.5px" : schoolLen > 20 ? "10px" : "11.5px",
    lineHeight: schoolLen > 20 ? "1.15" : "1.25",
  };

  // Logo rendering with clean container & soft elevation
  const schoolLogoNode = school?.logo_url ? (
    <img
      src={school.logo_url}
      alt=""
      className="size-8 object-contain bg-white rounded-md p-0.5 shadow-xs border border-white/20 shrink-0"
      crossOrigin="anonymous"
    />
  ) : (
    <div className="size-8 bg-white/10 backdrop-blur-md rounded-md flex items-center justify-center p-0.5 border border-white/20 shrink-0 shadow-inner">
      <SchoolCrestPlaceholder
        className={`size-6 ${theme === "premium-corporate" ? "text-teal-400" : theme === "gold-premium" ? "text-amber-400" : "text-amber-300"}`}
      />
    </div>
  );

  // Portrait Layout (250px x 396px)
  if (orientation === "portrait") {
    if (side === "front") {
      return (
        <div
          className={`w-full h-full border rounded-2xl flex flex-col justify-between overflow-hidden relative select-none box-border ${themeCls}`}
        >
          {/* Top banner / Header */}
          <div className="relative shrink-0">
            <div
              className={`px-3 py-1 flex items-center gap-2 relative h-[44px] ${headerCls}`}
            >
              {schoolLogoNode}
              <div className="text-left min-w-0 flex-1 overflow-hidden flex flex-col justify-center">
                <h2
                  className="font-black uppercase tracking-wide text-white block truncate"
                  style={{
                    fontSize: schoolStyle.fontSize,
                    lineHeight: schoolStyle.lineHeight,
                    margin: 0,
                    padding: "1px 0",
                  }}
                  title={school?.name || "School Campus"}
                >
                  {school?.name || "School Campus"}
                </h2>
                <p className="text-[7px] text-blue-100/90 font-medium leading-tight mt-0.5 truncate block">
                  {school?.address || "School Campus"}
                </p>
              </div>
              <div className="text-right leading-none shrink-0">
                <span className="inline-block bg-amber-400/20 text-amber-300 border border-amber-300/40 px-2 py-0.5 rounded-full text-[6.5px] font-mono font-bold leading-none">
                  {rec.academic_year || currentAcademicYear}
                </span>
              </div>
            </div>

            {/* Sub-banner ribbon */}
            <div
              className={`h-[14px] font-black text-[6.8px] text-center uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none shrink-0 ${subBannerCls}`}
            >
              <span className="size-1 rounded-full bg-white/80"></span>
              {isStudent ? "STUDENT IDENTITY CARD" : isVisitor ? "VISITOR PASS" : "STAFF IDENTITY CARD"}
              <span className="size-1 rounded-full bg-white/80"></span>
            </div>
          </div>

          {/* Body Section */}
          <div className="flex-1 px-3 py-1 flex flex-col items-center justify-between min-h-0 relative bg-white overflow-hidden">
            {/* Academic Topper Badge Overlay */}
            {topperRank && (
              <div className="absolute top-1 right-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[6.5px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 shadow-xs z-10 leading-none">
                <Trophy className="size-2 text-slate-950" />
                RANK {topperRank.rank_position}
              </div>
            )}

            {/* Student Photo */}
            <div
              className={`w-[80px] h-[98px] rounded-lg border-2 border-slate-200 overflow-hidden shadow-xs flex items-center justify-center shrink-0 relative bg-slate-100 ${accentBorder}`}
            >
              {rec.photo_url ? (
                <img
                  src={rec.photo_url}
                  alt=""
                  className="size-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+"
                  alt=""
                  style={{ width: "42px", height: "42px" }}
                  className="w-10 h-10 object-contain opacity-50"
                />
              )}
            </div>

            {/* Dedicated Name Container: Responsive font scaling & 2-line wrapping */}
            <div className="w-full min-h-[36px] max-h-[38px] flex flex-col justify-center items-center overflow-hidden px-1 text-center">
              <h4
                className="font-black uppercase tracking-tight text-slate-900 w-full text-center"
                style={{
                  fontSize: nameStyle.fontSize,
                  lineHeight: nameStyle.lineHeight,
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  margin: 0,
                  padding: "1px 0",
                }}
                title={displayName}
              >
                {displayName}
              </h4>
              <div className="mt-0.5 leading-none">
                <span
                  className="inline-block bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-[1.5px] rounded-full font-bold text-[7px] uppercase tracking-wide leading-none shadow-2xs"
                  style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {displayClassOrDesignation}
                </span>
              </div>
            </div>

            {/* Structured Info Card with defined bounding areas */}
            <div className="w-full bg-slate-50 border border-slate-200/90 rounded-lg p-1.5 text-[7px] space-y-[1.5px] shadow-2xs">
              {isStudent ? (
                <>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Admission No:</span>
                    <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[120px] text-right">{identifier}</span>
                  </div>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Roll Number:</span>
                    <span className="font-bold text-slate-900 text-[7px] truncate max-w-[120px] text-right">{rec.roll_number || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Date of Birth:</span>
                    <span className="font-bold text-slate-900 text-[7px] truncate max-w-[120px] text-right">{rec.date_of_birth || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Blood Group:</span>
                    <span className="font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-[0.5px] rounded text-[6.5px] leading-none shrink-0">
                      {rec.blood_group || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Parent Contact:</span>
                    <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[120px] text-right">{rec.parent_phone || "—"}</span>
                  </div>
                </>
              ) : isVisitor ? (
                <>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Pass Number:</span>
                    <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[120px] text-right">{identifier}</span>
                  </div>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Visitor Phone:</span>
                    <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[120px] text-right">{rec.contact_number || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Host:</span>
                    <span className="font-bold truncate max-w-[120px] text-slate-900 text-[7px] text-right">{rec.host_name || "—"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Employee ID:</span>
                    <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[120px] text-right">{identifier}</span>
                  </div>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Department:</span>
                    <span className="font-bold text-slate-900 text-[7px] truncate max-w-[120px] text-right">{rec.department || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Blood Group:</span>
                    <span className="font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-[0.5px] rounded text-[6.5px] leading-none shrink-0">
                      {rec.blood_group || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center leading-tight">
                    <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Mobile Number:</span>
                    <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[120px] text-right">{rec.mobile_number || "—"}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className="p-1.5 h-[42px] border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-1 shrink-0">
            <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
              <div className="bg-white p-0.5 rounded border border-slate-200 flex items-center justify-center">
                <Barcode value={identifier} />
              </div>
              {signature && !isVisitor && (
                <div className="h-2.5 mt-0.5 flex items-center justify-start gap-1">
                  <span className="text-[5px] uppercase font-bold text-slate-400">Sign:</span>
                  <img
                    src={signature}
                    alt="Sig"
                    className="h-full object-contain grayscale"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center shrink-0">
              <div className="p-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">
                <QRCodeImage
                  value={verificationLink}
                  className="size-7"
                />
              </div>
              <span className="text-[4.5px] font-black text-slate-500 mt-0.5 uppercase tracking-widest leading-none">
                VERIFIED ID
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      // Portrait Back side (250px x 396px)
      return (
        <div
          className={`w-full h-full border rounded-2xl flex flex-col justify-between overflow-hidden relative select-none bg-white ${themeCls}`}
        >
          {/* Back Header */}
          <div className="relative shrink-0">
            <div
              className={`px-3 py-1 flex items-center gap-2 relative h-[44px] ${headerCls}`}
            >
              {schoolLogoNode}
              <div className="text-left min-w-0 flex-1 overflow-hidden flex flex-col justify-center">
                <h2
                  className="font-black uppercase tracking-wide text-white block truncate"
                  style={{
                    fontSize: schoolStyle.fontSize,
                    lineHeight: schoolStyle.lineHeight,
                    margin: 0,
                    padding: "1px 0",
                  }}
                >
                  {school?.name || "School Campus"}
                </h2>
                <p className="text-[7px] text-blue-100 font-medium leading-tight mt-0.5 truncate block">
                  {school?.address || "School Campus"}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 text-amber-300 font-black text-[6.8px] text-center uppercase tracking-widest py-0.5 shadow-xs leading-tight">
              TERMS & INSTRUCTIONS
            </div>
          </div>

          {/* Back Body */}
          <div className="flex-1 p-2 flex flex-col justify-between space-y-1.5 text-[7px] overflow-hidden">
            {/* Rules Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 space-y-0.5">
              <p className="text-[6.5px] text-slate-700 font-medium leading-tight">
                • This identity card is valid only for the academic session indicated.
              </p>
              <p className="text-[6.5px] text-slate-700 font-medium leading-tight">
                • Cardholder must wear / present this ID badge at all times on campus.
              </p>
              <p className="text-[6.5px] text-slate-700 font-medium leading-tight">
                • Non-transferable. Loss must be reported immediately to school office.
              </p>
            </div>

            {/* Emergency / Contact Block */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-1.5 space-y-[2px]">
              <span className="text-[6.5px] font-black text-amber-900 uppercase tracking-wide block mb-0.5 flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-amber-500"></span>
                EMERGENCY & SCHOOL CONTACT
              </span>
              <div className="flex justify-between items-center text-[6.8px] leading-tight">
                <span className="text-slate-600 font-semibold shrink-0">Guardian / Phone:</span>
                <span className="font-black font-mono text-slate-900 truncate max-w-[130px] text-right">
                  {rec.emergency_contact || rec.parent_phone || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[6.8px] leading-tight">
                <span className="text-slate-600 font-semibold shrink-0">School Office:</span>
                <span className="font-bold font-mono text-slate-800 truncate max-w-[130px] text-right">{school?.phone_number || "—"}</span>
              </div>
              <div className="flex justify-between items-center text-[6.8px] leading-tight">
                <span className="text-slate-600 font-semibold shrink-0">Official Email:</span>
                <span className="font-bold truncate max-w-[130px] text-slate-800 text-right">{school?.email || "info@school.com"}</span>
              </div>
            </div>

            {/* Return statement & Signature Box */}
            <div className="space-y-1">
              <div className="border border-slate-200 rounded-lg p-1.5 bg-slate-50 flex justify-between items-end">
                <div>
                  <span className="text-[5.5px] uppercase font-bold text-slate-400 block">CARD VALIDITY</span>
                  <span className="text-[7.5px] font-bold text-slate-800">{rec.academic_year || currentAcademicYear}</span>
                </div>
                <div className="text-right">
                  {signature ? (
                    <img src={signature} alt="Sig" className="h-3.5 object-contain mx-auto grayscale" crossOrigin="anonymous" />
                  ) : (
                    <div className="w-14 border-b border-dashed border-slate-300 pb-0.5 mb-0.5"></div>
                  )}
                  <span className="text-[5.5px] uppercase font-bold text-slate-600 block">PRINCIPAL / ADMIN</span>
                </div>
              </div>

              <div className="text-center font-bold text-[6.5px] text-red-700 bg-red-50 py-0.5 rounded-md border border-red-200 uppercase tracking-tight leading-tight">
                "If found, please return to School Office"
              </div>
            </div>
          </div>

          {/* Back Footer */}
          <div className="p-1.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between h-[36px] shrink-0">
            <span className="text-[6px] font-mono text-slate-600 font-bold">
              ID: HZ-{rec.id?.slice(0, 8) || rec.user_id?.slice(0, 8) || "000000"}
            </span>
            <div className="flex items-center gap-1.5">
              <QRCodeImage
                value={verificationLink}
                className="size-6 bg-white p-0.5 rounded border border-slate-200"
              />
              <span className="text-[5px] font-black text-slate-600 uppercase tracking-widest leading-none">
                VERIFY
              </span>
            </div>
          </div>
        </div>
      );
    }
  } else {
    // Landscape Layout (Standard CR80 396px x 250px)
    if (side === "front") {
      return (
        <div
          className={`w-full h-full border rounded-2xl flex flex-col justify-between overflow-hidden relative select-none box-border ${themeCls}`}
        >
          {/* Header */}
          <div className="relative shrink-0">
            <div
              className={`px-3 py-1 flex items-center gap-2.5 relative h-[44px] ${headerCls}`}
            >
              {schoolLogoNode}
              <div className="text-left min-w-0 flex-1 overflow-hidden flex flex-col justify-center">
                <h2
                  className="font-black uppercase tracking-wide text-white block truncate"
                  style={{
                    fontSize: schoolStyle.fontSize,
                    lineHeight: schoolStyle.lineHeight,
                    margin: 0,
                    padding: "1px 0",
                  }}
                  title={school?.name || "School Campus"}
                >
                  {school?.name || "School Campus"}
                </h2>
                <p className="text-[7.5px] text-blue-100/90 font-medium leading-tight mt-0.5 truncate block">
                  {school?.address || "School Campus"}
                </p>
              </div>
              <div className="text-right leading-none shrink-0">
                <span className="inline-block bg-amber-400/20 text-amber-300 border border-amber-300/40 px-2 py-0.5 rounded-full text-[6.5px] font-mono font-bold leading-none">
                  {rec.academic_year || currentAcademicYear}
                </span>
              </div>
            </div>

            {/* Sub-banner ribbon */}
            <div
              className={`h-[14px] font-black text-[6.8px] text-center uppercase tracking-widest flex items-center justify-center gap-1.5 leading-none shrink-0 ${subBannerCls}`}
            >
              <span className="size-1 rounded-full bg-white/80"></span>
              {isStudent ? "STUDENT IDENTITY CARD" : isVisitor ? "VISITOR PASS" : "STAFF IDENTITY CARD"}
              <span className="size-1 rounded-full bg-white/80"></span>
            </div>
          </div>

          {/* Body - 3 Column Landscape Layout */}
          <div className="flex-1 px-3 py-1 flex items-center justify-between gap-2.5 min-h-0 bg-white overflow-hidden">
            {/* LEFT: Student Photograph */}
            <div
              className={`w-[80px] h-[106px] rounded-lg border-2 border-slate-200 overflow-hidden shadow-xs flex items-center justify-center shrink-0 bg-slate-100 ${accentBorder} relative`}
            >
              {topperRank && (
                <div className="absolute top-0.5 right-0.5 bg-amber-400 text-slate-950 text-[5.5px] font-black px-1 py-0.5 rounded shadow-xs z-10 leading-none">
                  R{topperRank.rank_position}
                </div>
              )}
              {rec.photo_url ? (
                <img
                  src={rec.photo_url}
                  alt=""
                  className="size-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTRhM2I4IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+"
                  alt=""
                  style={{ width: "42px", height: "42px" }}
                  className="w-10 h-10 object-contain opacity-50"
                />
              )}
            </div>

            {/* CENTER: Student Name & Information */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-[106px] py-0">
              {/* Dedicated Name Container: Responsive font scaling & 2-line wrapping */}
              <div className="min-h-[34px] max-h-[36px] flex flex-col justify-center items-start overflow-hidden px-0.5">
                <h3
                  className="font-black uppercase tracking-tight text-slate-900 w-full text-left"
                  style={{
                    fontSize: nameStyle.fontSize,
                    lineHeight: nameStyle.lineHeight,
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    margin: 0,
                    padding: "1px 0",
                  }}
                  title={displayName}
                >
                  {displayName}
                </h3>
                <div className="mt-0.5 leading-none">
                  <span
                    className="inline-block bg-blue-100 text-blue-900 border border-blue-200 px-2 py-[1px] rounded font-bold text-[6.8px] uppercase tracking-wider leading-none"
                    style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {displayClassOrDesignation}
                  </span>
                </div>
              </div>

              {/* Structured Metadata Box with explicit row heights and overflow safety */}
              <div className="w-full bg-slate-50 border border-slate-200/90 rounded-md px-2 py-0.5 text-[7px] space-y-[1.5px] shadow-2xs">
                {isStudent ? (
                  <>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Admission No:</span>
                      <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[115px] text-right">{identifier}</span>
                    </div>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Roll Number:</span>
                      <span className="font-bold text-slate-900 text-[7px] truncate max-w-[115px] text-right">{rec.roll_number || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Date of Birth:</span>
                      <span className="font-bold text-slate-900 text-[7px] truncate max-w-[115px] text-right">{rec.date_of_birth || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Blood Group:</span>
                      <span className="font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-[0.5px] rounded text-[6.5px] leading-none shrink-0">
                        {rec.blood_group || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Parent Contact:</span>
                      <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[115px] text-right">{rec.parent_phone || "—"}</span>
                    </div>
                  </>
                ) : isVisitor ? (
                  <>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Pass Number:</span>
                      <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[115px] text-right">{identifier}</span>
                    </div>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Visitor Phone:</span>
                      <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[115px] text-right">{rec.contact_number || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Host:</span>
                      <span className="font-bold truncate max-w-[115px] text-slate-900 text-[7px] text-right">{rec.host_name || "—"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Employee ID:</span>
                      <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[115px] text-right">{identifier}</span>
                    </div>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Department:</span>
                      <span className="font-bold text-slate-900 text-[7px] truncate max-w-[115px] text-right">{rec.department || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-[1px] border-b border-slate-200/60 leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Blood Group:</span>
                      <span className="font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-[0.5px] rounded text-[6.5px] leading-none shrink-0">
                        {rec.blood_group || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center leading-tight">
                      <span className="text-slate-500 font-semibold text-[6.8px] shrink-0">Mobile:</span>
                      <span className="font-black font-mono text-slate-900 text-[7px] truncate max-w-[115px] text-right">{rec.mobile_number || "—"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT: QR Code & Verification */}
            <div className="w-[72px] h-[106px] shrink-0 flex flex-col items-center justify-between p-1 bg-slate-50 border border-slate-200/90 rounded-lg shadow-2xs">
              <div className="w-full bg-white p-0.5 rounded border border-slate-200 flex items-center justify-center h-[26px]">
                <Barcode value={identifier} />
              </div>
              <div className="flex flex-col items-center">
                <div className="p-0.5 bg-white rounded-md border border-slate-200 shadow-2xs">
                  <QRCodeImage
                    value={verificationLink}
                    className="size-8"
                  />
                </div>
                <span className="text-[4.5px] font-black text-slate-600 mt-0.5 uppercase tracking-widest leading-none">
                  VERIFIED ID
                </span>
              </div>
            </div>
          </div>

          {/* Bottom branding ribbon */}
          <div className="h-4 px-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[6px] font-mono text-slate-600 font-bold shrink-0 leading-none">
            <span>SMART INSTITUTION ID</span>
            <span>HZ-{rec.id?.slice(0, 8) || rec.user_id?.slice(0, 8) || "000000"}</span>
          </div>
        </div>
      );
    } else {
      // Landscape Back Side (Standard CR80 396px x 250px)
      return (
        <div
          className={`w-full h-full border rounded-2xl flex flex-col justify-between overflow-hidden p-3 relative select-none box-border bg-white ${themeCls}`}
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-3 py-1 rounded-lg flex justify-between items-center shrink-0 shadow-xs h-[24px]">
            <span className="text-[7.5px] font-black uppercase tracking-widest text-amber-300">TERMS & INSTRUCTIONS</span>
            <span className="text-[8px] font-extrabold uppercase text-white truncate max-w-[200px]">
              {school?.name || "School Campus"}
            </span>
          </div>

          {/* Details & Signature */}
          <div className="flex-1 flex items-stretch justify-between gap-2.5 py-1.5 min-h-0">
            {/* Left instructions & contacts */}
            <div className="flex-1 flex flex-col justify-between space-y-1">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[6.5px] text-slate-700 font-medium space-y-[2px]">
                <p>• This card is valid only for the academic session indicated.</p>
                <p>• Must be worn/presented on request within school premises.</p>
                <p>• Non-transferable. Loss must be reported immediately.</p>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-1.5 text-[6.8px] space-y-[2px]">
                <div className="flex justify-between items-center leading-tight">
                  <span className="text-slate-600 font-semibold shrink-0">Emergency Phone:</span>
                  <span className="font-black font-mono text-slate-900 truncate max-w-[130px] text-right">
                    {rec.emergency_contact || rec.parent_phone || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center leading-tight">
                  <span className="text-slate-600 font-semibold shrink-0">Guardian:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[130px] text-right">{rec.parent_name || "—"}</span>
                </div>
                <div className="flex justify-between items-center leading-tight">
                  <span className="text-slate-600 font-semibold shrink-0">School Phone:</span>
                  <span className="font-bold font-mono text-slate-900 truncate max-w-[130px] text-right">{school?.phone_number || "—"}</span>
                </div>
                <div className="flex justify-between items-center leading-tight">
                  <span className="text-slate-600 font-semibold shrink-0">School Email:</span>
                  <span className="font-medium truncate max-w-[130px] text-slate-800 text-right">{school?.email || "info@school.com"}</span>
                </div>
              </div>
            </div>

            {/* Right Issuer Box */}
            <div className="w-[100px] border-2 border-dashed border-slate-300 rounded-xl p-1.5 bg-slate-50 flex flex-col items-center justify-between text-center shrink-0">
              <span className="text-[5px] uppercase font-black text-slate-500 block">AUTHORIZED SIGNATORY</span>
              {signature ? (
                <div className="h-6 w-full flex items-center justify-center my-0.5">
                  <img
                    src={signature}
                    alt="Sig"
                    className="max-h-full max-w-full object-contain grayscale"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="w-14 border-b border-dashed border-slate-300 my-1"></div>
              )}
              <span className="text-[6px] font-bold text-slate-700 uppercase">PRINCIPAL</span>
            </div>
          </div>

          {/* Footer with return notice & QR */}
          <div className="border-t border-slate-200 pt-1 flex justify-between items-center shrink-0 h-[24px]">
            <span className="text-[6px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 uppercase leading-none">
              "If found, please return to School Office"
            </span>
            <div className="flex items-center gap-1.5">
              <QRCodeImage
                value={verificationLink}
                className="size-5.5 bg-white p-0.5 rounded border border-slate-200 shadow-2xs"
              />
              <span className="text-[5px] font-black text-slate-600 uppercase tracking-wider leading-none">VERIFIED</span>
            </div>
          </div>
        </div>
      );
    }
  }
}

