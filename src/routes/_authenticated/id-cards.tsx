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
  Contact, Users, ShieldAlert, Settings, ClipboardList, Plus, 
  Trash2, UserCheck, ShieldCheck, Printer, FileDown, 
  RefreshCw, Upload, Sparkles, Image as ImageIcon, Eye, 
  CheckCircle, History, Camera, User, Download, Trophy, Star, CheckSquare
} from "lucide-react";

// KPI Widget Component
export function KpiWidget({ title, count, subtext, icon }: { title: string; count: number; subtext: string; icon: ReactNode }) {
  return (

    <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold text-foreground">{count}</h3>
        <p className="text-[10px] text-muted-foreground">{subtext}</p>
      </div>
      <div className="size-10 bg-secondary rounded-lg flex items-center justify-center">
        {icon}
      </div>
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
          width: 1.2,
          height: 32,
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

  return <canvas ref={canvasRef} className="max-h-8 max-w-full block" />;
}

// QR Code Component
export function QRCodeImage({ value, className }: { value: string; className?: string }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (value) {
      QRCode.toDataURL(value, { margin: 1, width: 100, color: { dark: "#000000", light: "#ffffff" } })
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
type CardTheme = "modern-blue" | "premium-corporate" | "gold-premium" | "school-classic" | "minimal";
type CardOrientation = "portrait" | "landscape";
type PdfExportMode = "front-back" | "front-only" | "side-by-side";

const currentAcademicYear = (() => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-indexed
  // Academic year starts in June (month 5)
  return m >= 5 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
})();

function IdCardManagementPage() {
  const { currentSchoolId: schoolId, user, roles, loading: tenantLoading } = useTenant();



  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  usePageTitle("ID Cards");

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [theme, setTheme] = useState<CardTheme>("modern-blue");
  const [orientation, setOrientation] = useState<CardOrientation>("portrait");
  const [pdfExportMode, setPdfExportMode] = useState<PdfExportMode>("front-back");

  // Data
  const [school, setSchool] = useState<SchoolDetails | null>(null);
  const [classes, setClasses] = useState<Array<{ id: string; name: string; section: string | null }>>([]);
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
  const [bulkProgress, setBulkProgress] = useState<{ current: number; total: number; activeName: string } | null>(null);
  const cancelRef = useRef(false);
  const [cropTarget, setCropTarget] = useState<{ type: "student" | "staff" | "school" | "signature"; id: string; original: string } | null>(null);

  // New visitor pass form
  const [newVisitor, setNewVisitor] = useState({ name: "", phone: "", purpose: "", host: "" });
  const [visitorPassPhoto, setVisitorPassPhoto] = useState<string | null>(null);

  // Edit fields modal
  const [editStudent, setEditStudent] = useState<StudentRow | null>(null);
  const [editStaff, setEditStaff] = useState<StaffRow | null>(null);
  const [previewCard, setPreviewCard] = useState<{ type: "student" | "staff" | "visitor"; data: any } | null>(null);
  const [flipped, setFlipped] = useState(false);

  // Print mode states
  const [printLayout, setPrintLayout] = useState<"none" | "pvc" | "a4">("none");
  const [printTarget, setPrintTarget] = useState<{ type: "student" | "staff" | "visitor"; list: any[] } | null>(null);

  const loadData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const [schoolRes, classesRes, studentsRes, staffRes, visitorsRes, historyRes, rankingsRes, awardsRes] = await Promise.all([
        (supabase as any).from("schools").select("id, name, school_name, logo_url, school_logo, address, phone_number, email, principal_name, principal_signature_url").eq("id", schoolId).single(),
        supabase.from("classes").select("id, name, section").eq("school_id", schoolId!).order("name"),
        supabase.from("students").select("*, classes(name, section)").eq("school_id", schoolId!).order("full_name"),
        (supabase as any).from("profiles").select("*").eq("school_id", schoolId!),
        supabase.from("visitor_passes").select("*").eq("school_id", schoolId!).order("created_at", { ascending: false }),
        supabase.from("id_card_history").select("*, profiles(full_name)").eq("school_id", schoolId!).order("printed_at", { ascending: false }),
        supabase.from("rankings").select("student_id, rank_position, percentage, rank_type").eq("school_id", schoolId!),
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
      
      const normStudents = (studentsRes.data || []).map(s => {
        const studentRankings = (rankingsRes.data || []).filter(r => r.student_id === s.id);
        const studentAwards = (awardsRes.data || []).filter(a => a.student_id === s.id);
        return {
          ...s,
          classes: Array.isArray(s.classes) ? s.classes[0] || null : s.classes,
          rankings: studentRankings,
          awards: studentAwards,
        };
      }) as StudentRow[];
      setStudents(normStudents);

      const rolesRes = await supabase.from("user_roles").select("user_id, role").eq("school_id", schoolId!);
      const staffIds = (rolesRes.data || []).filter(r => r.role === 'admin' || r.role === 'teacher').map(r => r.user_id);
      
      const normStaff = (staffRes.data || [])
        .filter((p: any) => staffIds.includes(p.user_id))
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
          notes: p.notes
        })) as StaffRow[];
      setStaff(normStaff);

      setVisitors(visitorsRes.data || []);
      setHistory(historyRes.data || [] as any);
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
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "student" | "staff" | "school" | "signature", id: string) => {
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

          const { error: uploadErr } = await supabase.storage
            .from(bucket)
            .upload(path, blob, {
              contentType: isPng ? "image/png" : "image/jpeg",
              cacheControl: "3600",
              upsert: true
            });
          if (uploadErr) throw uploadErr;

          const { data: pubUrl } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
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
            upsert: true
          });
        if (uploadErr) throw uploadErr;

        const { data: pubUrl } = supabase.storage
          .from("visitor-photos")
          .getPublicUrl(photoPath);
        finalPhotoUrl = pubUrl.publicUrl;
      }

      const { error } = await supabase
        .from("visitor_passes")
        .insert({
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
  const downloadSinglePDF = async (type: "student" | "staff" | "visitor", record: any, mode: PdfExportMode) => {
    setExporting(true);
    
    // Wait for React to render the hidden elements in the DOM
    await new Promise(resolve => setTimeout(resolve, 100));

    const frontEl = document.getElementById(`id-card-preview-front-${record.id || record.user_id}`);
    const backEl = document.getElementById(`id-card-preview-back-${record.id || record.user_id}`);
    
    if (!frontEl || (!backEl && mode !== "front-only")) {
      toast.error("Preview card element not found.");
      setExporting(false);
      return;
    }

    try {
      const frontCanvas = await safeHtml2Canvas(frontEl, { scale: 4 });
      const frontImg = frontCanvas.toDataURL("image/jpeg", 0.95);

      let backImg = null;
      if (mode !== "front-only" && backEl) {
        const backCanvas = await safeHtml2Canvas(backEl, { scale: 4 });
        backImg = backCanvas.toDataURL("image/jpeg", 0.95);
      }

      const w = orientation === "portrait" ? 54 : 85.6;
      const h = orientation === "portrait" ? 85.6 : 54;

      if (mode === "side-by-side") {
        const pdf = new jsPDF({
          orientation: orientation === "portrait" ? "landscape" : "portrait",
          unit: "mm",
          format: [w * 2, h],
        });
        pdf.addImage(frontImg, "JPEG", 0, 0, w, h);
        if (backImg) pdf.addImage(backImg, "JPEG", w, 0, w, h);
        pdf.save(`${record.full_name || record.visitor_name || "id"}_card.pdf`);
      } else {
        const pdf = new jsPDF({
          orientation: orientation,
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
    } catch (err: any) {
      toast.error("Failed to generate PDF: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  // Bulk PDF generation with chunked rendering to prevent main-thread freeze and JPEG compression to avoid Out-Of-Memory
  const downloadBulkPDF = async (type: "student" | "staff", mode: PdfExportMode) => {
    const list = type === "student"
      ? students.filter(s => selectedStudentIds.includes(s.id))
      : staff.filter(t => selectedStaffIds.includes(t.user_id));

    if (list.length === 0) {
      toast.error("Please select at least one record to generate.");
      return;
    }

    setExporting(true);
    cancelRef.current = false;
    setBulkProgress({ current: 0, total: list.length, activeName: "" });
    toast.info(`Initializing bulk PDF generation...`);

    // Wait for React to render the hidden elements in the DOM
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const w = orientation === "portrait" ? 54 : 85.6;
      const h = orientation === "portrait" ? 85.6 : 54;
      
      let pdf: jsPDF;
      if (mode === "side-by-side") {
        pdf = new jsPDF({
          orientation: orientation === "portrait" ? "landscape" : "portrait",
          unit: "mm",
          format: [w * 2, h],
        });
      } else {
        pdf = new jsPDF({
          orientation: orientation,
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
        const activeName = (rec as any).full_name || (rec as any).visitor_name || "Card";
        setBulkProgress({ current: i + 1, total: list.length, activeName });

        const frontEl = document.getElementById(`bulk-card-front-${(rec as any).id || (rec as any).user_id}`);
        const backEl = document.getElementById(`bulk-card-back-${(rec as any).id || (rec as any).user_id}`);
        
        if (!frontEl) continue;

        const frontCanvas = await safeHtml2Canvas(frontEl, { scale: 4 });
        const frontImg = frontCanvas.toDataURL("image/jpeg", 0.85);

        let backImg = null;
        if (mode !== "front-only" && backEl) {
          const backCanvas = await safeHtml2Canvas(backEl, { scale: 4 });
          backImg = backCanvas.toDataURL("image/jpeg", 0.85);
        }

        if (mode === "side-by-side") {
          if (!isFirstPage) pdf.addPage([w * 2, h], orientation === "portrait" ? "landscape" : "portrait");
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

        void logReprint(type, (rec as any).id || (rec as any).user_id, "Bulk Download");

        // Yield main thread in batches
        if (i % batchSize === 0 && i > 0) {
          await new Promise(resolve => setTimeout(resolve, 80));
        }
      }

      if (!cancelRef.current) {
        pdf.save(`bulk_${type}_cards.pdf`);
        toast.success(`Exported ${list.length} cards successfully.`);
      }
    } catch (err: any) {
      toast.error("Failed to export bulk PDF: " + err.message);
    } finally {
      setExporting(false);
      setBulkProgress(null);
    }
  };

  // Trigger browser print
  const handlePrint = (type: "student" | "staff" | "visitor", list: any[], layout: "pvc" | "a4") => {
    setPrintTarget({ type, list });
    setPrintLayout(layout);
    setTimeout(() => {
      window.print();
      setPrintLayout("none");
      setPrintTarget(null);
      
      list.forEach(item => {
        void logReprint(type, item.id || item.user_id, `Print (${layout.toUpperCase()})`);
      });
    }, 500);
  };

  // Bulk Selection Helpers
  const handleSelectEntireClass = () => {
    setSelectedStudentIds(filteredStudents.map(s => s.id));
    toast.success(`Selected all ${filteredStudents.length} class students.`);
  };

  const handleSelectSchoolWide = () => {
    setSelectedStudentIds(students.map(s => s.id));
    toast.success(`Selected all ${students.length} students school-wide.`);
  };

  // Student Filter logic
  const filteredStudents = students.filter(s => {
    const term = studentSearch.toLowerCase();
    const matchesSearch = s.full_name.toLowerCase().includes(term) || 
      (s.admission_number || "").toLowerCase().includes(term) ||
      (s.roll_number || "").toLowerCase().includes(term);
    
    const matchesClass = studentClassFilter === "all" || s.class_id === studentClassFilter;
    
    let matchesPhoto = true;
    if (studentPhotoFilter === "missing") matchesPhoto = !s.photo_url;
    else if (studentPhotoFilter === "present") matchesPhoto = !!s.photo_url;

    return matchesSearch && matchesClass && matchesPhoto;
  });

  // Staff Filter logic
  const filteredStaff = staff.filter(t => {
    const term = staffSearch.toLowerCase();
    const matchesSearch = t.full_name.toLowerCase().includes(term) || (t.employee_id || "").toLowerCase().includes(term);
    const matchesDept = staffDeptFilter === "all" || t.department === staffDeptFilter;
    return matchesSearch && matchesDept;
  });

  const departmentsList = Array.from(new Set(staff.map(t => t.department).filter(Boolean)));
  const principalSignature = school?.principal_signature_url || null;

  // Counts expired cards (academic year not current)
  const expiredCount = students.filter(s => s.academic_year && s.academic_year !== "2025-2026").length;

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
          <div className="flex bg-secondary rounded-md p-0.5">
            {(["overview", "students", "staff", "visitors", "settings", "reports"] as TabType[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded capitalize transition ${
                  activeTab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 print:hidden">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KpiWidget title="Total Cards" count={students.length + staff.length} subtext="Enrolled profiles" icon={<Users className="size-5 text-brand" />} />
              <KpiWidget title="Visitor Passes" count={visitors.length} subtext={`${visitors.filter(v => !v.check_out_time).length} active guests`} icon={<UserCheck className="size-5 text-warning" />} />
              <KpiWidget title="Missing Photos" count={students.filter(s => !s.photo_url).length + staff.filter(t => !t.photo_url).length} subtext="Requires upload" icon={<ShieldAlert className="size-5 text-danger" />} />
              <KpiWidget title="Expired Cards" count={expiredCount} subtext="Requires renewal" icon={<ClipboardList className="size-5 text-danger" />} />
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
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Template Theme</label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as CardTheme)}
                      className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none"
                    >
                      <option value="modern-blue">Modern School Design (Vertical/Horizontal)</option>
                      <option value="premium-corporate">Premium Corporate Design</option>
                      <option value="gold-premium">Gold Premium Design</option>
                      <option value="school-classic">School Classic Design</option>
                      <option value="minimal">Minimalist Card Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Card Orientation Layout</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOrientation("portrait")}
                        className={`py-2 text-xs font-medium rounded-md border text-center transition ${
                          orientation === "portrait" ? "bg-brand text-white border-brand shadow-sm" : "bg-card border-border hover:bg-secondary"
                        }`}
                      >
                        Vertical PVC Size
                      </button>
                      <button
                        onClick={() => setOrientation("landscape")}
                        className={`py-2 text-xs font-medium rounded-md border text-center transition ${
                          orientation === "landscape" ? "bg-brand text-white border-brand shadow-sm" : "bg-card border-border hover:bg-secondary"
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
                    If a student has a class rank of #1, #2, or #3 (e.g., Aarav Sharma is Rank #1), the front of their card 
                    will dynamically display a gold/silver/bronze academic topper medal. 
                    Scanning the card's QR code will load the public verification page, 
                    displaying real-time database credentials, card status (Active/Inactive), and official honors.
                  </p>
                </div>
                <div className="flex gap-2 pt-4 border-t border-border mt-4">
                  <button onClick={() => setActiveTab("students")} className="px-3 py-2 text-xs bg-brand text-white rounded-md font-semibold">Manage Students</button>
                  <button onClick={() => setActiveTab("staff")} className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/70 border border-border rounded-md font-semibold text-foreground">Manage Staff</button>
                  <button onClick={() => setActiveTab("visitors")} className="px-3 py-2 text-xs bg-secondary hover:bg-secondary/70 border border-border rounded-md font-semibold text-foreground">Guest passes</button>
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
                <span className="text-xs text-muted-foreground">{history.length} records logged</span>
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
                    {history.slice(0, 5).map(h => (
                      <tr key={h.id} className="hover:bg-secondary/20">
                        <td className="px-6 py-3 font-mono">{new Date(h.printed_at).toLocaleString()}</td>
                        <td className="px-6 py-3 font-semibold uppercase">{h.card_type}</td>
                        <td className="px-6 py-3 font-mono">{h.holder_id}</td>
                        <td className="px-6 py-3">{h.profiles?.full_name || "Operator"}</td>
                        <td className="px-6 py-3">{h.reason || "First Issue"}</td>
                        <td className="px-6 py-3">{h.academic_year}</td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-6 text-slate-400">No print logs found.</td>
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
            <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search student name, adm #..."
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background w-48 focus:outline-none"
                />
                <select
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none"
                >
                  <option value="all">All Classes</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.section ? ` · ${c.section}` : ""}</option>
                  ))}
                </select>
                <select
                  value={studentPhotoFilter}
                  onChange={(e) => setStudentPhotoFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none"
                >
                  <option value="all">All Photos</option>
                  <option value="present">With Photo</option>
                  <option value="missing">Missing Photo</option>
                </select>
              </div>

              {/* Bulk operations controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectEntireClass}
                  className="px-2.5 py-1.5 text-xs border border-border bg-secondary hover:bg-secondary/70 rounded-md font-semibold text-foreground inline-flex items-center gap-1"
                >
                  Select Class
                </button>
                <button
                  onClick={handleSelectSchoolWide}
                  className="px-2.5 py-1.5 text-xs border border-border bg-secondary hover:bg-secondary/70 rounded-md font-semibold text-foreground inline-flex items-center gap-1"
                >
                  Select School-wide
                </button>
                {selectedStudentIds.length > 0 && (
                  <div className="flex items-center gap-2 ml-2">
                    <span className="text-xs text-muted-foreground font-semibold">{selectedStudentIds.length} selected</span>
                    <div className="flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5">
                      <select
                        value={pdfExportMode}
                        onChange={(e) => setPdfExportMode(e.target.value as PdfExportMode)}
                        className="bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2"
                        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                        title="PDF Layout Options"
                      >
                        <option value="front-back">Front+Back</option>
                        <option value="front-only">Front Only</option>
                        <option value="side-by-side">Side-by-Side</option>
                      </select>
                      <button
                        onClick={() => downloadBulkPDF("student", pdfExportMode)}
                        disabled={exporting}
                        className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition"
                      >
                        <FileDown className="size-3" /> Export
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        const list = students.filter(s => selectedStudentIds.includes(s.id));
                        handlePrint("student", list, "a4");
                      }}
                      className="px-3 py-1.5 text-xs bg-secondary border border-border rounded-md inline-flex items-center gap-1 text-foreground font-semibold"
                    >
                      <Printer className="size-3" /> A4 Grid Print
                    </button>
                  </div>
                )}
                <div className="flex border border-border rounded-md overflow-hidden bg-secondary ml-2">
                  <button onClick={() => setOrientation("portrait")} className={`px-2.5 py-1.5 text-xs font-semibold ${orientation === 'portrait' ? 'bg-white shadow-sm' : ''}`}>Vert</button>
                  <button onClick={() => setOrientation("landscape")} className={`px-2.5 py-1.5 text-xs font-semibold ${orientation === 'landscape' ? 'bg-white shadow-sm' : ''}`}>Horiz</button>
                </div>
              </div>
            </div>

            {/* List grid */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudentIds(filteredStudents.map(s => s.id));
                          } else {
                            setSelectedStudentIds([]);
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 font-medium">Photo</th>
                    <th className="px-6 py-3 font-medium">Student ID #</th>
                    <th className="px-6 py-3 font-medium">Student Name</th>
                    <th className="px-6 py-3 font-medium">Class / Section</th>
                    <th className="px-6 py-3 font-medium">Blood Group</th>
                    <th className="px-6 py-3 font-medium">Transport / Bus</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map(s => {
                    const isTopper = s.rankings?.find(r => r.rank_position <= 3);
                    const studentIdDisplay = getStudentIdFallback(s);
                    return (
                      <tr key={s.id} className="hover:bg-secondary/20">
                        <td className="px-6 py-3">
                          <input
                            type="checkbox"
                            checked={selectedStudentIds.includes(s.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStudentIds([...selectedStudentIds, s.id]);
                              } else {
                                setSelectedStudentIds(selectedStudentIds.filter(id => id !== s.id));
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <div className="relative group size-8 rounded bg-slate-100 border border-border overflow-hidden flex items-center justify-center flex-shrink-0">
                            {s.photo_url ? (
                              <img src={s.photo_url} alt="" className="size-full object-cover" />
                            ) : (
                              <User className="size-4 text-slate-400" />
                            )}
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                              <Camera className="size-3 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, "student", s.id)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-6 py-3 font-mono font-semibold">{studentIdDisplay}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground">{s.full_name}</span>
                            {isTopper && (
                              <span className="inline-flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold px-1 py-0.5 rounded">
                                <Trophy className="size-2.5" /> Rank {isTopper.rank_position}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3">{s.classes?.name || "—"} {s.classes?.section ? `(${s.classes.section})` : ""}</td>
                        <td className="px-6 py-3">
                          <span className="font-semibold text-red-500">{s.blood_group || "—"}</span>
                        </td>
                        <td className="px-6 py-3 truncate max-w-[150px]">
                          {s.transport_route || "—"} {s.bus_number ? `(${s.bus_number})` : ""}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setPreviewCard({ type: "student", data: s });
                                setFlipped(false);
                              }}
                              className="text-brand hover:underline inline-flex items-center gap-0.5 font-semibold"
                            >
                              <Eye className="size-3" /> Preview
                            </button>
                            <button
                              onClick={() => setEditStudent(s)}
                              className="text-brand hover:underline font-semibold"
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
                      <td colSpan={8} className="text-center py-12 text-slate-400">
                        {loading ? "Loading ERP roster..." : "No student records matching your filters found."}
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
            <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  placeholder="Search staff name, emp id..."
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background w-48 focus:outline-none"
                />
                <select
                  value={staffDeptFilter}
                  onChange={(e) => setStaffDeptFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none"
                >
                  <option value="all">All Departments</option>
                  {departmentsList.map(d => (
                    <option key={d} value={d!}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Bulk actions */}
              <div className="flex items-center gap-2">
                {selectedStaffIds.length > 0 && (
                  <div className="flex items-center gap-2 mr-2">
                    <span className="text-xs text-muted-foreground font-semibold">{selectedStaffIds.length} selected</span>
                    <div className="flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5">
                      <select
                        value={pdfExportMode}
                        onChange={(e) => setPdfExportMode(e.target.value as PdfExportMode)}
                        className="bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2"
                        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                        title="PDF Layout Options"
                      >
                        <option value="front-back">Front+Back</option>
                        <option value="front-only">Front Only</option>
                        <option value="side-by-side">Side-by-Side</option>
                      </select>
                      <button
                        onClick={() => downloadBulkPDF("staff", pdfExportMode)}
                        disabled={exporting}
                        className="px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition"
                      >
                        <FileDown className="size-3" /> Export
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        const list = staff.filter(t => selectedStaffIds.includes(t.user_id));
                        handlePrint("staff", list, "a4");
                      }}
                      className="px-3 py-1.5 text-xs bg-secondary border border-border rounded-md inline-flex items-center gap-1 text-foreground font-semibold"
                    >
                      <Printer className="size-3" /> A4 Grid Print
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* List grid */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedStaffIds.length === filteredStaff.length && filteredStaff.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStaffIds(filteredStaff.map(t => t.user_id));
                          } else {
                            setSelectedStaffIds([]);
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 font-medium">Photo</th>
                    <th className="px-6 py-3 font-medium">Employee ID #</th>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Designation</th>
                    <th className="px-6 py-3 font-medium">Department</th>
                    <th className="px-6 py-3 font-medium">Contact Number</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStaff.map(t => {
                    const staffIdDisplay = getStaffIdFallback(t);
                    return (
                      <tr key={t.user_id} className="hover:bg-secondary/20">
                        <td className="px-6 py-3">
                          <input
                            type="checkbox"
                            checked={selectedStaffIds.includes(t.user_id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedStaffIds([...selectedStaffIds, t.user_id]);
                              } else {
                                setSelectedStaffIds(selectedStaffIds.filter(id => id !== t.user_id));
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <div className="relative group size-8 rounded bg-slate-100 border border-border overflow-hidden flex items-center justify-center flex-shrink-0">
                            {t.photo_url ? (
                              <img src={t.photo_url} alt="" className="size-full object-cover" />
                            ) : (
                              <User className="size-4 text-slate-400" />
                            )}
                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                              <Camera className="size-3 text-white" />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, "staff", t.user_id)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </td>
                        <td className="px-6 py-3 font-mono font-semibold">{staffIdDisplay}</td>
                        <td className="px-6 py-3 font-semibold text-foreground">{t.full_name}</td>
                        <td className="px-6 py-3 font-medium">{t.designation || "—"}</td>
                        <td className="px-6 py-3">{t.department || "—"}</td>
                        <td className="px-6 py-3">{t.mobile_number || "—"}</td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setPreviewCard({ type: "staff", data: t });
                                setFlipped(false);
                              }}
                              className="text-brand hover:underline inline-flex items-center gap-0.5 font-semibold"
                            >
                              <Eye className="size-3" /> Preview
                            </button>
                            <button
                              onClick={() => setEditStaff(t)}
                              className="text-brand hover:underline font-semibold"
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
                      <td colSpan={8} className="text-center py-12 text-slate-400">
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
            <form onSubmit={handleCheckInVisitor} className="bg-card border border-border rounded-xl p-5 space-y-4 h-fit">
              <h3 className="font-semibold text-sm border-b border-border pb-3">New Visitor Check-In</h3>
              
              {/* Photo Input (Optional) */}
              <div className="space-y-1.5 text-center">
                <label className="text-xs font-semibold text-muted-foreground block text-left">Visitor Snap (Optional)</label>
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
                    {visitors.map(v => (
                      <tr key={v.id} className="hover:bg-secondary/15">
                        <td className="px-6 py-3 font-mono font-semibold text-slate-700">{v.pass_number}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {v.photo_url ? (
                              <img src={v.photo_url} alt="" className="size-6 rounded object-cover" />
                            ) : (
                              <User className="size-4 text-slate-400" />
                            )}
                            <span className="font-semibold text-foreground">{v.visitor_name}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground block font-mono">{v.contact_number}</span>
                        </td>
                        <td className="px-6 py-3">
                          <p className="font-medium text-foreground">{v.purpose_of_visit || "—"}</p>
                          <p className="text-[10px] text-muted-foreground">Host: {v.host_name || "—"}</p>
                        </td>
                        <td className="px-6 py-3 text-muted-foreground font-mono">{new Date(v.check_in_time).toLocaleTimeString()}</td>
                        <td className="px-6 py-3 font-mono">
                          {v.check_out_time ? (
                            <span className="text-slate-400">{new Date(v.check_out_time).toLocaleTimeString()}</span>
                          ) : (
                            <span className="text-emerald-500 font-semibold uppercase tracking-wider text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded">Active</span>
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
                        <td colSpan={6} className="text-center py-8 text-slate-400">No visitors logged today.</td>
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
                <label className="text-xs font-semibold block text-left mb-2">School Official Logo</label>
                <div className="size-24 rounded-xl bg-slate-50 border border-dashed border-border mx-auto flex items-center justify-center overflow-hidden relative group">
                  {school?.logo_url ? (
                    <img src={school.logo_url} alt="Logo" className="size-full object-contain p-2" />
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
                <label className="text-xs font-semibold block text-left mb-2">Principal Official Signature</label>
                <div className="h-24 w-full rounded-xl bg-slate-50 border border-dashed border-border flex items-center justify-center overflow-hidden relative group p-2">
                  {principalSignature ? (
                    <img src={principalSignature} alt="Signature" className="h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <Sparkles className="size-6 text-slate-400 mx-auto mb-1" />
                      <span className="text-[11px] text-muted-foreground">No signature uploaded</span>
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
                <p className="text-[10px] text-muted-foreground text-left">Upload transparent PNG signature of the school principal.</p>
              </div>
            </div>

            {/* School Profile Fields */}
            <form onSubmit={async (e) => {
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
            }} className="space-y-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold block mb-1">School Official Name</label>
                  <input
                    required
                    value={school?.name || ""}
                    onChange={(e) => setSchool(s => s ? { ...s, name: e.target.value } : null)}
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold block mb-1">School Physical Address</label>
                  <input
                    required
                    value={school?.address || ""}
                    onChange={(e) => setSchool(s => s ? { ...s, address: e.target.value } : null)}
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">School Contact Phone</label>
                  <input
                    value={school?.phone_number || ""}
                    onChange={(e) => setSchool(s => s ? { ...s, phone_number: e.target.value } : null)}
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">School Official Email</label>
                  <input
                    type="email"
                    value={school?.email || ""}
                    onChange={(e) => setSchool(s => s ? { ...s, email: e.target.value } : null)}
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold block mb-1">School Principal Name</label>
                  <input
                    value={school?.principal_name || ""}
                    onChange={(e) => setSchool(s => s ? { ...s, principal_name: e.target.value } : null)}
                    className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none"
                    placeholder="Enter Principal Name"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" className="px-4 py-2 text-xs bg-brand text-white font-semibold rounded-md hover:opacity-90">
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
                  {students.filter(s => !s.photo_url).map(s => (
                    <div key={s.id} className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                      <div>
                        <p className="font-semibold text-foreground">{s.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">Student · {s.classes?.name || "Unassigned"}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-danger-soft text-danger text-[9px] font-bold uppercase tracking-wider">No Photo</span>
                    </div>
                  ))}
                  {staff.filter(t => !t.photo_url).map(t => (
                    <div key={t.user_id} className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                      <div>
                        <p className="font-semibold text-foreground">{t.full_name}</p>
                        <p className="text-[10px] text-muted-foreground">Staff · {t.department || "General"}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-danger-soft text-danger text-[9px] font-bold uppercase tracking-wider">No Photo</span>
                    </div>
                  ))}
                  {students.filter(s => !s.photo_url).length === 0 && staff.filter(t => !t.photo_url).length === 0 && (
                    <p className="text-center text-slate-400 py-10">All profiles have registered photos.</p>
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
                  {history.map(h => (
                    <div key={h.id} className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                      <div>
                        <p className="font-semibold text-foreground">{h.card_type.toUpperCase()} Card Issued</p>
                        <p className="text-[10px] text-muted-foreground">Operator: {h.profiles?.full_name || "Admin"} · {h.reason || "First Issue"}</p>
                      </div>
                      <span className="font-mono text-slate-400 text-[10px]">{new Date(h.printed_at).toLocaleDateString()}</span>
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
            <p className="text-xs text-muted-foreground">Drawing card for <span className="font-semibold text-foreground">{bulkProgress.activeName}</span>...</p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-brand h-full transition-all duration-300"
                style={{ width: `${Math.round((bulkProgress.current / bulkProgress.total) * 100)}%` }}
              />
            </div>
            <p className="text-xs font-semibold">{bulkProgress.current} / {bulkProgress.total} ({Math.round((bulkProgress.current / bulkProgress.total) * 100)}%)</p>
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

      {/* Absolute container off-screen for html2canvas rendering */}
      <div className="absolute left-[-9999px] top-[-9999px]" style={{ zIndex: -100 }}>
        {exporting && (
          <div className="space-y-4">
            {/* Hidden Single Export Components to avoid 3D Flip mirroring */}
            {previewCard && (
              <div className="flex gap-4">
                <div id={`id-card-preview-front-${previewCard.data.id || previewCard.data.user_id}`} style={{ width: orientation === "portrait" ? "250px" : "396px", height: orientation === "portrait" ? "396px" : "250px", transform: 'none', rotate: '0deg', scale: '1' }}>
                  <IDCardComponent rec={previewCard.data} type={previewCard.type as any} theme={theme} orientation={orientation} school={school} side="front" signature={principalSignature} />
                </div>
                <div id={`id-card-preview-back-${previewCard.data.id || previewCard.data.user_id}`} style={{ width: orientation === "portrait" ? "250px" : "396px", height: orientation === "portrait" ? "396px" : "250px", transform: 'none', rotate: '0deg', scale: '1' }}>
                  <IDCardComponent rec={previewCard.data} type={previewCard.type as any} theme={theme} orientation={orientation} school={school} side="back" signature={principalSignature} />
                </div>
              </div>
            )}
            {students.filter(s => selectedStudentIds.includes(s.id)).map(s => (
              <div key={`bulk-student-${s.id}`} className="flex gap-4">
                <div id={`bulk-card-front-${s.id}`} style={{ width: orientation === "portrait" ? "250px" : "396px", height: orientation === "portrait" ? "396px" : "250px" }}>
                  <IDCardComponent rec={s} type="student" theme={theme} orientation={orientation} school={school} side="front" signature={principalSignature} />
                </div>
                <div id={`bulk-card-back-${s.id}`} style={{ width: orientation === "portrait" ? "250px" : "396px", height: orientation === "portrait" ? "396px" : "250px" }}>
                  <IDCardComponent rec={s} type="student" theme={theme} orientation={orientation} school={school} side="back" signature={principalSignature} />
                </div>
              </div>
            ))}
            {staff.filter(t => selectedStaffIds.includes(t.user_id)).map(t => (
              <div key={`bulk-staff-${t.user_id}`} className="flex gap-4">
                <div id={`bulk-card-front-${t.user_id}`} style={{ width: orientation === "portrait" ? "250px" : "396px", height: orientation === "portrait" ? "396px" : "250px" }}>
                  <IDCardComponent rec={t} type="staff" theme={theme} orientation={orientation} school={school} side="front" signature={principalSignature} />
                </div>
                <div id={`bulk-card-back-${t.user_id}`} style={{ width: orientation === "portrait" ? "250px" : "396px", height: orientation === "portrait" ? "396px" : "250px" }}>
                  <IDCardComponent rec={t} type="staff" theme={theme} orientation={orientation} school={school} side="back" signature={principalSignature} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TAB 7: MODAL SINGLE CARD INTERACTIVE PREVIEW */}
      {previewCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setPreviewCard(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-semibold text-sm capitalize">{previewCard.type} ID Card Preview</h2>
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
                    style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  >
                    <option value="front-back">Front+Back</option>
                    <option value="front-only">Front Only</option>
                    <option value="side-by-side">Side-by-Side</option>
                  </select>
                  <button
                    onClick={() => downloadSinglePDF(previewCard.type as any, previewCard.data, pdfExportMode)}
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
                  height: orientation === "portrait" ? "396px" : "250px" 
                }}
              >
                <div 
                  className="w-full h-full relative transition-transform duration-500 transform-style-3d shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-xl"
                  style={{ transform: flipped ? 'rotateY(180deg)' : 'none' }}
                >
                  {/* Front Side */}
                  <div 
                    className="absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-slate-50"
                  >
                    <IDCardComponent rec={previewCard.data} type={previewCard.type as any} theme={theme} orientation={orientation} school={school} side="front" signature={principalSignature} />
                    {/* Realistic Gloss Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay" />
                  </div>

                  {/* Back Side */}
                  <div 
                    className="absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-slate-50"
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <IDCardComponent rec={previewCard.data} type={previewCard.type as any} theme={theme} orientation={orientation} school={school} side="back" signature={principalSignature} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay" />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Tip: Interactive 3D preview. Click 'Flip Card' to see front and back overlays.
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button onClick={() => setPreviewCard(null)} className="px-4 py-1.5 text-xs border border-border rounded-md font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {editStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setEditStudent(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSaveStudent} className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-sm border-b border-border pb-3">Edit Student Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Full Name</label>
                <input required value={editStudent.full_name} onChange={(e) => setEditStudent({ ...editStudent, full_name: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Admission Number</label>
                <input required value={editStudent.admission_number || ""} onChange={(e) => setEditStudent({ ...editStudent, admission_number: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Roll Number</label>
                <input value={editStudent.roll_number || ""} onChange={(e) => setEditStudent({ ...editStudent, roll_number: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Blood Group</label>
                <input value={editStudent.blood_group || ""} onChange={(e) => setEditStudent({ ...editStudent, blood_group: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">DOB (YYYY-MM-DD)</label>
                <input type="date" value={editStudent.date_of_birth || ""} onChange={(e) => setEditStudent({ ...editStudent, date_of_birth: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Emergency Contact</label>
                <input value={editStudent.emergency_contact || ""} onChange={(e) => setEditStudent({ ...editStudent, emergency_contact: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Parent/Guardian Name</label>
                <input value={editStudent.parent_name || ""} onChange={(e) => setEditStudent({ ...editStudent, parent_name: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Parent Phone Number</label>
                <input value={editStudent.parent_phone || ""} onChange={(e) => setEditStudent({ ...editStudent, parent_phone: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Transport Route</label>
                <input value={editStudent.transport_route || ""} onChange={(e) => setEditStudent({ ...editStudent, transport_route: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Bus Number</label>
                <input value={editStudent.bus_number || ""} onChange={(e) => setEditStudent({ ...editStudent, bus_number: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border">
              <button type="button" onClick={() => setEditStudent(null)} className="px-3 py-2 text-xs border border-border rounded-md">Cancel</button>
              <button type="submit" className="px-3 py-2 text-xs bg-brand text-white font-semibold rounded-md">Save Details</button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {editStaff && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => setEditStaff(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={handleSaveStaff} className="bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-sm border-b border-border pb-3">Edit Staff Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1">Employee ID</label>
                <input required value={editStaff.employee_id || ""} onChange={(e) => setEditStaff({ ...editStaff, employee_id: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Designation</label>
                <input value={editStaff.designation || ""} onChange={(e) => setEditStaff({ ...editStaff, designation: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Department</label>
                <input value={editStaff.department || ""} onChange={(e) => setEditStaff({ ...editStaff, department: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Blood Group</label>
                <input value={editStaff.blood_group || ""} onChange={(e) => setEditStaff({ ...editStaff, blood_group: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Mobile Number</label>
                <input value={editStaff.mobile_number || ""} onChange={(e) => setEditStaff({ ...editStaff, mobile_number: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Emergency Contact</label>
                <input value={editStaff.emergency_contact || ""} onChange={(e) => setEditStaff({ ...editStaff, emergency_contact: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold block mb-1">Physical Address</label>
                <input value={editStaff.address || ""} onChange={(e) => setEditStaff({ ...editStaff, address: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold block mb-1">Card Back Notes</label>
                <textarea rows={2} value={editStaff.notes || ""} onChange={(e) => setEditStaff({ ...editStaff, notes: e.target.value })} className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md" />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-border">
              <button type="button" onClick={() => setEditStaff(null)} className="px-3 py-2 text-xs border border-border rounded-md">Cancel</button>
              <button type="submit" className="px-3 py-2 text-xs bg-brand text-white font-semibold rounded-md">Save Details</button>
            </div>
          </form>
        </div>
      )}

      {/* CROP IMAGE MODAL */}
      {cropTarget && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4">
            <h2 className="font-semibold text-sm border-b border-border pb-3">Crop Profile Photo</h2>
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
                    className={orientation === "portrait" ? "print-card-portrait" : "print-card-landscape"}
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
                    className={orientation === "portrait" ? "print-card-portrait" : "print-card-landscape"}
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
      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 6v10M9 8h6M9 11h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M12 6l-3 3M12 6l3 3M12 11l-3 3M12 11l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

export function IDCardComponent({ rec, type, theme, orientation, school, side = "front", signature }: IDCardCompProps) {
  const isStudent = type === "student";
  const isVisitor = type === "visitor";

  const identifier = isStudent ? getStudentIdFallback(rec) : isVisitor ? rec.pass_number : getStaffIdFallback(rec);
  // Use window.location.origin so the QR verification link works both locally and in production.
  const appOrigin = typeof window !== "undefined" ? window.location.origin : "https://school.hezo.in";
  const verificationLink = `${appOrigin}/verify-id?type=${type}&id=${rec.id || rec.user_id}`;

  const displayName = isStudent ? (rec.full_name || "Student") : isVisitor ? (rec.visitor_name || "Visitor") : (rec.full_name || "Staff");
  
  let displayClassOrDesignation = "";
  if (isStudent) {
    displayClassOrDesignation = rec.classes?.name ? `${rec.classes.name}${rec.classes.section ? ` (${rec.classes.section})` : ""}` : "Student";
  } else if (isVisitor) {
    displayClassOrDesignation = "Visitor";
  } else {
    displayClassOrDesignation = rec.designation || "Staff";
  }

  // Name scaling & wrapping rules: never truncate, clip, or hide. Auto-wrap, dynamic font scaling.
  let nameFontSize = "text-[12px]";
  if (displayName.length > 35) {
    nameFontSize = "text-[7.5px]";
  } else if (displayName.length > 25) {
    nameFontSize = "text-[9px]";
  } else if (displayName.length > 15) {
    nameFontSize = "text-[10.5px]";
  }

  // Class/Designation scaling & wrapping rules
  let classFontSize = "text-[9px]";
  if (displayClassOrDesignation.length > 20) {
    classFontSize = "text-[7.5px]";
  }

  // Theme styling definitions
  let themeCls = "";
  let headerCls = "";
  let accentText = "";
  let accentBorder = "border-slate-200";

  if (theme === "modern-blue") {
    themeCls = "bg-gradient-to-br from-slate-50 via-sky-50/50 to-blue-50 text-slate-800 border-sky-200";
    headerCls = "bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white";
    accentText = "text-blue-700 font-semibold";
    accentBorder = "border-sky-300";
  } else if (theme === "premium-corporate") {
    // Dark professional theme
    themeCls = "bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 border-slate-700 shadow-inner";
    headerCls = "bg-slate-950 text-teal-400 border-b border-teal-500/30";
    accentText = "text-teal-400 font-semibold uppercase tracking-wider";
    accentBorder = "border-teal-500/40";
  } else if (theme === "gold-premium") {
    // Elegant gold/black style
    themeCls = "bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-amber-50 border-amber-400";
    headerCls = "bg-slate-950 text-amber-400 border-b-2 border-amber-400";
    accentText = "text-amber-400 font-bold uppercase";
    accentBorder = "border-amber-400/50";
  } else if (theme === "school-classic") {
    themeCls = "bg-rose-50/10 text-rose-950 border-rose-800";
    headerCls = "bg-gradient-to-r from-red-800 to-rose-950 text-white border-b-2 border-red-900";
    accentText = "text-rose-800 font-bold";
    accentBorder = "border-rose-800/30";
  } else {
    // minimal
    themeCls = "bg-white text-slate-800 border-slate-200";
    headerCls = "bg-slate-50 text-slate-800 border-b border-slate-200";
    accentText = "text-slate-900 font-medium";
    accentBorder = "border-slate-200";
  }

  // Topper Rank logic
  const topperRank = rec.rankings?.find((r: any) => r.rank_position <= 3);

  // Logo rendering (increased by 50%: size-12 instead of size-8)
  const schoolLogoNode = school?.logo_url ? (
    <img src={school.logo_url} alt="" className="size-12 object-contain bg-white rounded p-0.5" />
  ) : (
    <SchoolCrestPlaceholder className={`size-12 ${theme === 'premium-corporate' || theme === 'gold-premium' ? 'text-teal-400' : 'text-amber-400'}`} />
  );

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

  // Portrait Layout
  if (orientation === "portrait") {
    if (side === "front") {
      return (
        <div className={`w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md relative ${themeCls}`}>
          {/* Top banner / Header */}
          <div className={`px-2 py-1.5 flex items-center gap-2 border-b relative min-h-[56px] ${headerCls}`}>
            {schoolLogoNode}
            <div className="text-left min-w-0 flex-1 leading-tight">
              <h2 className="text-[13.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal">{school?.name || "School Name"}</h2>
              <p className="text-[7.5px] opacity-85 break-words whitespace-normal leading-tight mt-0.5">{school?.address || "Address Detail"}</p>
            </div>
            <div className="text-right leading-none flex-shrink-0 font-mono text-[7px] opacity-85 font-semibold ml-1">
              <div>{rec.academic_year || currentAcademicYear}</div>
            </div>
          </div>

          <div className={`font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5 ${subBannerCls}`}>
            {isStudent ? "STUDENT IDENTITY CARD" : isVisitor ? "VISITOR PASS" : "IDENTITY CARD"}
          </div>

          {/* Body Section */}
          <div className="flex-1 p-2 flex flex-col items-center justify-start space-y-1 min-h-0 relative">
            
            {/* Academic Topper Badge Overlay */}
            {topperRank && (
              <div className="absolute top-1 right-1 bg-amber-400 text-slate-950 text-[6px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-amber-300 shadow-md">
                <Trophy className="size-1.5 text-slate-950" />
                Rank {topperRank.rank_position}
              </div>
            )}

            {/* Passport Photo Frame (35-40% of card height: 142px of 396px) */}
            <div className={`w-[110px] h-[142px] rounded border bg-white overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 relative ${accentBorder}`}>
              {rec.photo_url ? (
                <img src={rec.photo_url} alt="" className="size-full object-cover" />
              ) : (
                <User className="size-16 text-slate-300" />
              )}
            </div>

            {/* Details (Full name & role designation) */}
            <div className="text-center w-full min-w-0">
              <h4 className={`${nameFontSize} font-bold leading-tight break-words whitespace-normal px-1 text-center w-full`} title={displayName}>{displayName}</h4>
            </div>

            {/* Structured Info Grid */}
            <div className="w-full text-[7.2px] space-y-0.5 px-2">
              {isStudent ? (
                <>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Student ID:</span> <span className="font-bold font-mono">{identifier}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Class:</span> <span className="font-bold">{displayClassOrDesignation}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Roll Number:</span> <span className="font-bold">{rec.roll_number || "—"}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Date of Birth:</span> <span className="font-bold">{rec.date_of_birth || "—"}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Blood Group:</span> <span className="font-bold text-red-500">{rec.blood_group || "—"}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Parent Contact:</span> <span className="font-bold font-mono">{rec.parent_phone || "—"}</span></div>
                </>
              ) : isVisitor ? (
                <>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Pass Number:</span> <span className="font-bold font-mono">{identifier}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Visitor Phone:</span> <span className="font-bold font-mono">{rec.contact_number}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Host:</span> <span className="font-bold truncate max-w-[100px]">{rec.host_name || "—"}</span></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Employee ID:</span> <span className="font-bold font-mono">{identifier}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Department:</span> <span className="font-bold">{rec.department || "—"}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/55 pb-0.5"><span className="opacity-60">Blood Group:</span> <span className="font-bold text-red-505">{rec.blood_group || "—"}</span></div>
                  <div className="flex justify-between"><span className="opacity-60">Mobile Number:</span> <span className="font-bold font-mono">{rec.mobile_number || "—"}</span></div>
                </>
              )}
            </div>
          </div>

          {/* Footer Section */}
          <div className={`p-1.5 border-t flex items-center justify-between gap-1 bg-white ${theme === 'premium-corporate' || theme === 'gold-premium' ? 'border-slate-800' : 'border-border'}`}>
            <div className="flex-1 flex flex-col justify-end min-w-0">
              <Barcode value={identifier} />
              {signature && !isVisitor && (
                <div className="h-3.5 mt-0.5 flex items-end opacity-75 grayscale">
                  <img src={signature} alt="Sig" className="h-full object-contain" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center flex-shrink-0">
              <QRCodeImage value={verificationLink} className="size-9 bg-white p-0.5 rounded border border-border" />
              <span className="text-[5px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter">Scan to Verify</span>
            </div>
          </div>
        </div>
      );
    } else {
      // Portrait Back side
      return (
        <div className={`w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md ${themeCls}`}>
          {/* Back Header */}
          <div className={`px-2 py-1.5 flex items-center gap-2 border-b relative min-h-[56px] ${headerCls}`}>
            {schoolLogoNode}
            <div className="text-left min-w-0 flex-1 leading-tight">
              <h2 className="text-[13.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal">{school?.name || "School Name"}</h2>
              <p className="text-[7.5px] opacity-85 break-words whitespace-normal leading-tight mt-0.5">{school?.address || "Address Detail"}</p>
            </div>
          </div>

          <div className="bg-slate-900 text-white font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5">
            TERMS & GUIDELINES
          </div>

          {/* Back Body */}
          <div className="flex-1 p-3 flex flex-col justify-between space-y-2 text-[7.5px]">
            {isStudent ? (
              <div className="space-y-1.5">
                <div className="flex flex-col">
                  <span className="opacity-60 text-[6.5px] uppercase font-semibold">Emergency Contact:</span>
                  <span className="font-bold font-mono text-[8.5px]">{rec.emergency_contact || rec.parent_phone || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-60 text-[6.5px] uppercase font-semibold">Parent/Guardian Contact:</span>
                  <span className="font-bold text-[8.5px]">{rec.parent_name || "—"}</span>
                  <span className="font-bold font-mono text-[8px]">{rec.parent_phone || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-60 text-[6.5px] uppercase font-semibold">School Contact Details:</span>
                  <span className="font-semibold font-mono">Ph: {school?.phone_number || "—"}</span>
                  <span className="font-semibold truncate">Web: {school?.email || "www.hezo.in"}</span>
                </div>
              </div>
            ) : isVisitor ? (
              <div className="space-y-2 text-center p-2 bg-white/20 rounded border border-border/10">
                <span className="text-[9.5px] font-bold text-red-550 block">TEMPORARY GUEST PASS</span>
                <p className="text-[7.5px] leading-normal opacity-90">
                  This visitor badge is temporary and issued strictly for verification. Return it to reception upon checkout.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex flex-col">
                  <span className="opacity-60 text-[6.5px] uppercase font-semibold">Emergency Contact:</span>
                  <span className="font-bold font-mono text-[8.5px]">{rec.emergency_contact || "—"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-60 text-[6.5px] uppercase font-semibold">Residential Address:</span>
                  <p className="font-semibold leading-normal line-clamp-3">{rec.address || "—"}</p>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-60 text-[6.5px] uppercase font-semibold">Notes:</span>
                  <p className="italic text-[7px] leading-tight line-clamp-2 opacity-85">{rec.notes || "This card belongs to the school administration. If found, please return immediately."}</p>
                </div>
              </div>
            )}

            {/* Return statement */}
            <div className="text-center font-bold text-[7px] text-red-650 bg-red-50 py-0.5 rounded border border-red-200 uppercase tracking-tighter">
              "If found please return to school."
            </div>
          </div>

          {/* Back Footer */}
          <div className="p-1.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-[5.5px] font-mono opacity-60">Secure Badge HZ-{rec.id?.slice(0, 8) || rec.user_id?.slice(0, 8) || "000000"}</span>
            <div className="flex items-center gap-1">
              <QRCodeImage value={verificationLink} className="size-7 bg-white p-0.5 rounded border border-border" />
              <div className="leading-none text-left">
                <span className="text-[5px] block font-bold text-slate-500 uppercase tracking-tighter">Scan to Verify</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  } else {
    // Landscape Layout
    if (side === "front") {
      return (
        <div className={`w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md relative ${themeCls}`}>
          {/* Header */}
          <div className={`px-3 py-1.5 flex items-center gap-2.5 border-b relative min-h-[56px] ${headerCls}`}>
            {schoolLogoNode}
            <div className="text-left min-w-0 flex-1 leading-tight">
              <h2 className="text-[15.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal">{school?.name || "School Name"}</h2>
              <p className="text-[8px] opacity-85 break-words whitespace-normal leading-tight mt-0.5">{school?.address || "Address Detail"}</p>
            </div>
            <div className="text-right leading-none flex-shrink-0 font-mono text-[8px] opacity-85 font-semibold ml-1">
              <div>{rec.academic_year || currentAcademicYear}</div>
            </div>
          </div>

          <div className={`font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5 ${subBannerCls}`}>
            {isStudent ? "STUDENT IDENTITY CARD" : isVisitor ? "VISITOR PASS" : "IDENTITY CARD"}
          </div>

          {/* Body */}
          <div className="flex-1 p-2 flex items-center justify-center gap-4 min-h-0 relative bg-white/10">
            {/* Left Section: Details */}
            <div className="w-[125px] flex-shrink-0 text-[7px] space-y-0.5">
              {isStudent ? (
                <>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Student ID:</span> <span className="font-bold font-mono">{identifier}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Class-Sec:</span> <span className="font-bold">{displayClassOrDesignation}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Roll No:</span> <span className="font-bold">{rec.roll_number || "—"}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">DOB:</span> <span className="font-bold">{rec.date_of_birth || "—"}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Blood Grp:</span> <span className="font-bold text-red-500">{rec.blood_group || "—"}</span></div>
                  <div className="flex justify-between"><span className="opacity-60 font-semibold">Parent Mob:</span> <span className="font-bold font-mono">{rec.parent_phone || "—"}</span></div>
                </>
              ) : isVisitor ? (
                <>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Pass No:</span> <span className="font-bold font-mono">{identifier}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Visitor Phone:</span> <span className="font-bold font-mono">{rec.contact_number}</span></div>
                  <div className="flex justify-between"><span className="opacity-60 font-semibold">Host:</span> <span className="font-bold truncate max-w-[80px]">{rec.host_name || "—"}</span></div>
                </>
              ) : (
                <>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Emp ID:</span> <span className="font-bold font-mono">{identifier}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Dept:</span> <span className="font-bold">{rec.department || "—"}</span></div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5"><span className="opacity-60 font-semibold">Blood Grp:</span> <span className="font-bold text-red-550">{rec.blood_group || "—"}</span></div>
                  <div className="flex justify-between"><span className="opacity-60 font-semibold">Mobile:</span> <span className="font-bold font-mono">{rec.mobile_number || "—"}</span></div>
                </>
              )}
            </div>

            {/* Center Section: Photo and Name */}
            <div className="flex-1 flex flex-col items-center justify-center min-w-0">
              {/* Photo frame (35-40% height: 92px of 250px) */}
              <div className={`w-[72px] h-[92px] rounded border bg-white overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 relative ${accentBorder}`}>
                {rec.photo_url ? (
                  <img src={rec.photo_url} alt="" className="size-full object-cover" />
                ) : (
                  <User className="size-12 text-slate-300" />
                )}
              </div>
              
              {/* Student Name */}
              <h4 className={`${nameFontSize} font-bold text-center leading-tight whitespace-normal break-words w-full px-1 mt-1.5`} title={displayName}>{displayName}</h4>
            </div>

            {/* Right Section: Barcode, QR Code & Signature */}
            <div className="w-[100px] flex-shrink-0 flex flex-col items-center justify-between h-full py-0.5">
              <Barcode value={identifier} />
              
              {signature && !isVisitor && (
                <div className="h-3.5 flex items-end opacity-75 grayscale mt-1">
                  <img src={signature} alt="Sig" className="h-full object-contain" />
                </div>
              )}

              <div className="flex flex-col items-center mt-1">
                <QRCodeImage value={verificationLink} className="size-9 bg-white p-0.5 rounded border border-border" />
                <span className="text-[5px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter">Scan to Verify</span>
              </div>
            </div>
          </div>

          {/* Footer strip branding */}
          <div className={`h-4 px-3 bg-slate-50 border-t flex items-center justify-between text-[5.5px] font-mono opacity-60 ${theme === 'premium-corporate' || theme === 'gold-premium' ? 'border-slate-800' : 'border-border'}`}>
            <span>Secure Badge System · {school?.name || "School ERP"}</span>
            <span>HZ-{rec.id?.slice(0, 8) || rec.user_id?.slice(0, 8) || "000000"}</span>
          </div>
        </div>
      );
    } else {
      // Landscape Back Side
      return (
        <div className={`w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden p-2.5 shadow-md ${themeCls}`}>
          {/* Header */}
          <div className={`text-center pb-1.5 border-b flex justify-between items-center ${theme === 'premium-corporate' || theme === 'gold-premium' ? 'border-slate-800' : 'border-border'}`}>
            <span className="text-[9px] font-bold uppercase font-sans">TERMS & INSTRUCTIONS</span>
            <span className="text-[6.5px] opacity-75 truncate max-w-[180px]">{school?.name || "School Name"}</span>
          </div>

          {/* Details */}
          <div className="flex-1 flex items-center justify-between gap-3 py-1.5 min-h-0">
            <div className="flex-1 text-[7.5px] space-y-1">
              {isStudent ? (
                <>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5">
                    <span className="opacity-60 font-semibold">Emergency Contact:</span>
                    <span className="font-bold font-mono">{rec.emergency_contact || rec.parent_phone || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5">
                    <span className="opacity-60 font-semibold">Parent/Guardian:</span>
                    <span className="font-bold">{rec.parent_name || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5">
                    <span className="opacity-60 font-semibold">Parent Mob. Contact:</span>
                    <span className="font-bold font-mono">{rec.parent_phone || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60 font-semibold">School Address:</span>
                    <span className="font-semibold truncate max-w-[120px]">{school?.address || "—"}</span>
                  </div>
                </>
              ) : isVisitor ? (
                <div className="space-y-1 p-1 bg-white/10 rounded">
                  <span className="text-[8px] font-bold text-red-550 uppercase">visitor badge terms</span>
                  <p className="text-[6.5px] leading-normal opacity-90">
                    This temporary pass allows access strictly for official visitations. Report to reception if any assistance is required. Please return pass before checking out.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5">
                    <span className="opacity-60 font-semibold">Emergency Contact:</span>
                    <span className="font-bold font-mono">{rec.emergency_contact || "—"}</span>
                  </div>
                  <div className="flex justify-between border-b border-dashed border-slate-200/50 pb-0.5">
                    <span className="opacity-60 font-semibold">Residential Address:</span>
                    <span className="font-semibold truncate max-w-[120px]">{rec.address || "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="opacity-60 font-semibold">Notes:</span>
                    <p className="italic text-[6.5px] leading-tight line-clamp-2 opacity-85">{rec.notes || "This card belongs to the school administration."}</p>
                  </div>
                </>
              )}
            </div>

            {/* Back QR */}
            <div className={`flex flex-col items-center justify-center border-l pl-3 h-full ${theme === 'premium-corporate' || theme === 'gold-premium' ? 'border-slate-800' : 'border-border'}`}>
              <QRCodeImage value={verificationLink} className="size-9 bg-white p-0.5 rounded border border-border" />
              <span className="text-[5px] block font-bold text-slate-500 uppercase tracking-tighter mt-1">Scan to Verify</span>
            </div>
          </div>

          {/* Footer return text & branding */}
          <div className={`border-t pt-1 flex justify-between items-center text-[6.5px] ${theme === 'premium-corporate' || theme === 'gold-premium' ? 'border-slate-800' : 'border-border'}`}>
            <span className="font-bold text-red-600 animate-pulse uppercase tracking-tighter font-sans">"If found please return to school."</span>
            <span className="font-mono opacity-60">HZ-{rec.id?.slice(0,8) || rec.user_id?.slice(0,8) || "00000"}</span>
          </div>
        </div>
      );
    }
  }
}
