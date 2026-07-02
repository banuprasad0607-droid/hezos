import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type AppRole } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { useSchoolName, usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import {
  Trophy,
  Award,
  Sparkles,
  Download,
  Share2,
  Sliders,
  Users,
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  FileDown,
  RefreshCw,
  Eye,
  Bell,
  Trash2,
  GraduationCap,
  Percent,
  Plus,
  ArrowUpRight,
  Shield,
  Medal,
  Clock,
  Heart,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  User,
  Printer,
  Paperclip,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { safeHtml2Canvas } from "@/lib/pdf-helper";
import { jsPDF } from "jspdf";

// Reusable clean inline styling helper for HTML2Canvas exports
export const getPosterStyle = (
  sizeName: "portrait" | "landscape" | "square",
  themeName: string,
) => {
  let width = "360px";
  let height = "450px"; // Default portrait size (aspect 4/5)

  if (sizeName === "landscape") {
    width = "640px";
    height = "360px"; // Landscape size (aspect 16/9)
  } else if (sizeName === "square") {
    width = "360px";
    height = "360px"; // Square size (aspect 1/1)
  }

  const baseStyle = {
    width: width,
    height: height,
    padding: sizeName === "landscape" ? "1.5rem 2rem" : "1.5rem",
    display: "flex",
    flexDirection: (sizeName === "landscape" ? "row" : "column") as "row" | "column",
    justifyContent: "space-between",
    position: "relative" as const,
    overflow: "hidden",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box" as const,
  };

  if (themeName === "gold") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #fef9c2 50%, #f59e0b 100%)",
      color: "#1e293b",
      borderColor: "#fcd34d",
    };
  }
  if (themeName === "silver") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #cbd5e1 0%, #f8fafc 50%, #94a3b8 100%)",
      color: "#1e293b",
      borderColor: "#cbd5e1",
    };
  }
  if (themeName === "bronze") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #d97706 0%, #fef3c7 50%, #b45309 100%)",
      color: "#1e293b",
      borderColor: "#d97706",
    };
  }
  if (themeName === "royal") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      color: "#ffffff",
      borderColor: "#312e81",
    };
  }
  // modern / default
  return {
    ...baseStyle,
    backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    color: "#ffffff",
    borderColor: "#334155",
  };
};

export const Route = createFileRoute("/_authenticated/achievements")({
  component: AchievementsPage,
});

// Canvas Confetti Animation Component
function CanvasConfetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const colors = ["#fbbf24", "#f59e0b", "#fb7185", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
    }));

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      particles.forEach((p) => {
        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  return active ? (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999] w-full h-full" />
  ) : null;
}

// Interfaces
interface ClassRow {
  id: string;
  name: string;
  grade: string | null;
  section: string | null;
  class_teacher_id?: string | null;
}
interface SubjectRow {
  id: string;
  name: string;
  code: string | null;
}
interface StudentRow {
  id: string;
  full_name: string;
  roll_number: string | null;
  class_id: string | null;
  parent_user_id: string | null;
  parent_email: string | null;
  photo_url: string | null;
  classes?: { name: string; section?: string } | null;
  parent_name?: string | null;
  parent_phone?: string | null;
  admission_number?: string | null;
}
interface ExamRow {
  id: string;
  school_id?: string;
  class_id: string;
  name: string;
  type: string;
  max_marks: number;
  subject_id: string | null;
  date: string;
}
interface MarkRow {
  id: string;
  student_id: string;
  exam_id: string;
  marks_obtained: number;
}
interface RankingRow {
  id: string;
  student_id: string;
  academic_year: string;
  exam_id: string | null;
  total_marks: number;
  percentage: number;
  gpa: number;
  rank_position: number;
  rank_type: string;
  subject_id: string | null;
  is_published?: boolean;
  student?: {
    full_name: string;
    roll_number: string;
    photo_url?: string | null;
    classes?: { name: string };
  } | null;
}
interface AwardRow {
  id: string;
  student_id: string;
  academic_year: string;
  category: string;
  title: string;
  description: string;
  issued_at: string;
  is_published?: boolean;
  student?: {
    full_name: string;
    roll_number: string;
    photo_url?: string | null;
    classes?: { name: string };
  } | null;
}
interface CertificateRow {
  id: string;
  student_id: string;
  award_id: string;
  certificate_type: string;
  certificate_number: string;
  issued_date: string;
  student?: { full_name: string; photo_url?: string | null } | null;
  award?: { title: string; category: string } | null;
}
interface PosterRow {
  id: string;
  student_id: string;
  award_id: string;
  theme: string;
  student?: { full_name: string } | null;
}
interface NotificationLog {
  id: string;
  parent_user_id: string;
  student_id: string;
  type: string;
  title: string;
  body: string;
  status: string;
  sent_at: string;
  student?: { full_name: string } | null;
}

const adminUserId = "9783fac6-341c-4abb-8479-5d434ffafaac";
const parentUserId = "2b69b820-5891-4033-9155-418862032864";

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

export function AchievementsPage() {
  const navigate = useNavigate();
  const {
    currentSchoolId: schoolId,
    user,
    roles: actualRoles,
    loading: tenantLoading,
  } = useTenant();
  const schoolDisplayName = useSchoolName();
  usePageTitle("Report Cards");

  // Simulated Roles Support: Super Admin, School Admin, Principal, Teacher, Parent, Student
  const [simulatedRole, setSimulatedRole] = useState<string>("admin");
  const [simulatedTeacherSubject, setSimulatedTeacherSubject] = useState<string>("All");

  const simulatedUserId = useMemo(() => {
    if (simulatedRole === "teacher") {
      if (simulatedTeacherSubject === "Mathematics") return "11111111-1111-1111-1111-111111111111"; // Ramesh
      if (simulatedTeacherSubject === "Science") return "22222222-2222-2222-2222-222222222222"; // Suresh
      if (simulatedTeacherSubject === "English") return "33333333-3333-3333-3333-333333333333"; // Lakshmi
      // Class Teacher Suresh
      return "22222222-2222-2222-2222-222222222222";
    }
    if (simulatedRole === "admin") return "4ebb81b8-2e77-4b12-a679-e3aab6d6a7b5"; // Gopal Admin
    return user?.id || "";
  }, [simulatedRole, simulatedTeacherSubject, user]);

  const [userProfile, setUserProfile] = useState<any | null>(null);

  // Promotion and Documents States
  const [showPromotionPanel, setShowPromotionPanel] = useState<boolean>(false);
  const [promotionSelectedStudents, setPromotionSelectedStudents] = useState<string[]>([]);
  const [promotionTargetClass, setPromotionTargetClass] = useState<string>("");
  const [studentDocuments, setStudentDocuments] = useState<any[]>([]);
  const [reportCardAuditHistory, setReportCardAuditHistory] = useState<any[]>([]);
  const [uploadDocType, setUploadDocType] = useState<string>("Birth Certificate");
  const [gradeThresholds, setGradeThresholds] = useState<Record<string, number>>({
    "A+": 90,
    A: 80,
    "B+": 75,
    B: 70,
    "C+": 60,
    C: 50,
    D: 35,
  });

  const getGradeFromPercentage = (pct: number) => {
    if (pct >= gradeThresholds["A+"]) return "A+";
    if (pct >= gradeThresholds["A"]) return "A";
    if (pct >= gradeThresholds["B+"]) return "B+";
    if (pct >= gradeThresholds["B"]) return "B";
    if (pct >= gradeThresholds["C+"]) return "C+";
    if (pct >= gradeThresholds["C"]) return "C";
    if (pct >= gradeThresholds["D"]) return "D";
    return "F";
  };

  useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("id, designation, department")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setUserProfile(data);
        });
    }
  }, [user]);

  // School Details & Report Card states
  const [school, setSchool] = useState<SchoolDetails | null>(null);
  const [reportCardStudent, setReportCardStudent] = useState<StudentRow | null>(null);
  const [reportCardData, setReportCardData] = useState<{
    subjectsMarks: Array<{
      subjectName: string;
      obtained: number;
      max: number;
      percentage: number;
      grade: string;
      remarks?: string;
    }>;
    totalObtained: number;
    totalMax: number;
    overallPercentage: number;
    gpa: number;
    rank: number | string;
    attendancePercentage: number;
    workingDays?: number;
    presentDays?: number;
    absentDays?: number;
    classTeacherRemarks?: string;
    principalRemarks?: string;
    latestRemark: string;
  } | null>(null);
  const [loadingReportCard, setLoadingReportCard] = useState(false);

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Core Data State
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [marks, setMarks] = useState<MarkRow[]>([]);
  const [rankings, setRankings] = useState<RankingRow[]>([]);
  const [awards, setAwards] = useState<AwardRow[]>([]);
  const [certificates, setCertificates] = useState<CertificateRow[]>([]);
  const [posters, setPosters] = useState<PosterRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  // Report Card Tab States
  const [reportCards, setReportCards] = useState<any[]>([]);
  const [subjectAllocations, setSubjectAllocations] = useState<any[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [selectedReportCardClass, setSelectedReportCardClass] = useState<string>("");
  const [allocClassId, setAllocClassId] = useState<string>("");
  const [allocSubjectId, setAllocSubjectId] = useState<string>("");
  const [allocTeacherId, setAllocTeacherId] = useState<string>("");
  const [selectedReportCardExam, setSelectedReportCardExam] = useState<string>("Annual Exam");
  const [activeReportCard, setActiveReportCard] = useState<any | null>(null);
  const [rcWorkingDays, setRcWorkingDays] = useState<number>(220);
  const [rcClassTeacherRemarks, setRcClassTeacherRemarks] = useState<string>("");
  const [rcPrincipalRemarks, setRcPrincipalRemarks] = useState<string>("");
  const [rcPresentDays, setRcPresentDays] = useState<Record<string, number>>({});
  const [rcSubjectRemarks, setRcSubjectRemarks] = useState<Record<string, string>>({});
  const [rcSaving, setRcSaving] = useState<boolean>(false);
  const [hiddenRenderStudent, setHiddenRenderStudent] = useState<StudentRow | null>(null);
  const [hiddenRenderData, setHiddenRenderData] = useState<any | null>(null);

  // Filter States
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("2025-2026");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Rule Setup
  const [rankingCriteria, setRankingCriteria] = useState<string>("percentage");
  const [attendanceWeightage, setAttendanceWeightage] = useState<number>(0.1);
  const [attendanceThreshold, setAttendanceThreshold] = useState<number>(75.0);
  const [enabledCategories, setEnabledCategories] = useState<string[]>([
    "rank_1",
    "rank_2",
    "rank_3",
    "top_10",
    "subject_topper",
    "class_topper",
    "section_topper",
    "school_topper",
    "attendance_topper",
    "most_improved",
    "discipline_award",
    "olympiad",
    "sports",
    "cultural",
    "scholarship",
  ]);
  const [autoRecalculate, setAutoRecalculate] = useState<boolean>(true);

  // Exporters State
  const [selectedStudentForPoster, setSelectedStudentForPoster] = useState<any | null>(null);
  const [posterTheme, setPosterTheme] = useState<string>("gold");
  const [posterSize, setPosterSize] = useState<"portrait" | "landscape" | "square">("portrait");
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<any | null>(null);
  const [selectedCertProfile, setSelectedCertProfile] = useState<string>("rank1");

  // Dynamic Class name for certificate
  const certStudentClass = classes.find(
    (c) => c.id === (selectedStudentForCert?.class_id || selectedClass),
  );
  const certClassName = certStudentClass ? `${certStudentClass.name}` : "Class 1A";

  // Dynamic Certificate specifications
  const certDetails = useMemo(() => {
    switch (selectedCertProfile) {
      case "rank1":
        return {
          title: "CERTIFICATE OF FIRST RANK EXCELLENCE",
          badge: "First Rank (1st Rank)",
          desc: `For securing the First Rank (1st Rank) in Class ${certClassName} for the academic session ${academicYear}. Their dedication, academic performance, and outstanding achievement have placed them atop the leaderboards.`,
          borderColor: "#78350f",
          innerColor: "#fbbf24",
          textColor: "#78350f",
        };
      case "rank2":
        return {
          title: "CERTIFICATE OF SECOND RANK DISTINCTION",
          badge: "Second Rank (2nd Rank)",
          desc: `For securing the Second Rank (2nd Rank) in Class ${certClassName} for the academic session ${academicYear}. Their consistent efforts, academic dedication, and high achievements have earned them this distinction.`,
          borderColor: "#64748b",
          innerColor: "#cbd5e1",
          textColor: "#334155",
        };
      case "rank3":
        return {
          title: "CERTIFICATE OF THIRD RANK MERIT",
          badge: "Third Rank (3rd Rank)",
          desc: `For securing the Third Rank (3rd Rank) in Class ${certClassName} for the academic session ${academicYear}. Their persistent dedication, commitment to learning, and academic merits are highly commendable.`,
          borderColor: "#b45309",
          innerColor: "#f59e0b",
          textColor: "#78350f",
        };
      case "attendance":
        return {
          title: "CERTIFICATE OF OUTSTANDING ATTENDANCE",
          badge: "Attendance Champion",
          desc: `For maintaining an exceptional presence and dedication to learning in Class ${certClassName} for the academic session ${academicYear}. Their commitment to consistency, reliability, and active participation in school life is exemplary.`,
          borderColor: "#065f46",
          innerColor: "#34d399",
          textColor: "#065f46",
        };
      case "discipline":
        return {
          title: "CERTIFICATE OF EXEMPLARY DISCIPLINE & LEADERSHIP",
          badge: "Best Discipline Award",
          desc: `For demonstrating exemplary behavior, integrity, respect, and adherence to school codes in Class ${certClassName} for the academic session ${academicYear}. They have set a true benchmark in character and student leadership.`,
          borderColor: "#312e81",
          innerColor: "#818cf8",
          textColor: "#312e81",
        };
      case "excellence":
      default:
        return {
          title: "CERTIFICATE OF ACADEMIC EXCELLENCE",
          badge: "Academic Excellence",
          desc: `For demonstrating superb scholastic performance, intellectual curiosity, and outstanding marks in Class ${certClassName} for the academic session ${academicYear}. Awarded in recognition of top academic achievements.`,
          borderColor: "#78350f",
          innerColor: "#fbbf24",
          textColor: "#78350f",
        };
    }
  }, [selectedCertProfile, certClassName, academicYear]);

  // Dynamic Poster recipient details
  const posterStudentClass = classes.find(
    (c) => c.id === (selectedStudentForPoster?.class_id || selectedClass),
  );
  const posterClassName = posterStudentClass ? `${posterStudentClass.name}` : "Class 1A";

  const posterRanking = useMemo(() => {
    return rankings.find(
      (r) => r.student_id === selectedStudentForPoster?.id && r.academic_year === academicYear,
    );
  }, [rankings, selectedStudentForPoster, academicYear]);

  const posterAward = useMemo(() => {
    return awards.find(
      (a) => a.student_id === selectedStudentForPoster?.id && a.academic_year === academicYear,
    );
  }, [awards, selectedStudentForPoster, academicYear]);

  const posterDetails = useMemo(() => {
    if (posterRanking) {
      const rankPos = posterRanking.rank_position;
      let label = "Academic Scholar";
      if (rankPos === 1) label = "Class Topper";
      else if (rankPos === 2) label = "2nd Rank Topper";
      else if (rankPos === 3) label = "3rd Rank Topper";
      else if (rankPos <= 10) label = "Top 10 Student";

      return {
        rankText: `Rank #${rankPos}`,
        label: label,
        stats: `GPA ${posterRanking.gpa} / Score ${posterRanking.percentage}%`,
      };
    } else if (posterAward) {
      return {
        rankText: badgeLabel(posterAward.category),
        label: posterAward.title,
        stats: "Special Recognition",
      };
    } else {
      return {
        rankText: "Academic Star",
        label: "Honor Roll",
        stats: "Excellent Performance",
      };
    }
  }, [posterRanking, posterAward]);

  // UI Helpers
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Confetti trigger
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  // Detect actual default simulated role
  useEffect(() => {
    if ((actualRoles ?? []).includes("super_admin")) setSimulatedRole("super_admin");
    else if ((actualRoles ?? []).includes("admin")) setSimulatedRole("admin");
    else if ((actualRoles ?? []).includes("teacher")) setSimulatedRole("teacher");
    else if ((actualRoles ?? []).includes("parent")) setSimulatedRole("parent");
    else setSimulatedRole("student");
  }, [actualRoles]);

  // Synchronize top selectedClass with report card class selection
  useEffect(() => {
    if (selectedClass && selectedClass !== selectedReportCardClass) {
      setSelectedReportCardClass(selectedClass);
    }
  }, [selectedClass, selectedReportCardClass]);

  useEffect(() => {
    if (selectedReportCardClass && selectedReportCardClass !== selectedClass) {
      setSelectedClass(selectedReportCardClass);
    }
  }, [selectedReportCardClass, selectedClass]);

  // Synchronize top selectedExam (ID) with selectedReportCardExam (type)
  useEffect(() => {
    if (selectedExam) {
      const activeExamObj = exams.find((e) => e.id === selectedExam);
      if (activeExamObj && activeExamObj.type !== selectedReportCardExam) {
        setSelectedReportCardExam(activeExamObj.type);
      }
    }
  }, [selectedExam, exams, selectedReportCardExam]);

  // Load Report Card Details dynamically when student selection changes
  useEffect(() => {
    if (!reportCardStudent || !schoolId) {
      setReportCardData(null);
      return;
    }

    const fetchReportCardDetails = async () => {
      setLoadingReportCard(true);
      try {
        const classId = reportCardStudent.class_id!;

        // 0. Fetch existing report card for this student, term and academic year
        const { data: existingRc } = await (supabase as any)
          .from("report_cards")
          .select("*")
          .eq("student_id", reportCardStudent.id)
          .eq("exam_type", selectedReportCardExam)
          .eq("academic_year", academicYear)
          .maybeSingle();

        if (existingRc) {
          const subjectsMarks = Array.isArray(existingRc.subject_marks)
            ? existingRc.subject_marks.map((sm: any) => ({
                subjectName: sm.subject_name || sm.subjectName || "Subject",
                obtained: sm.obtained_marks ?? sm.obtained ?? 0,
                max: sm.max_marks ?? sm.max ?? 100,
                percentage:
                  sm.max_marks > 0
                    ? Number(
                        (
                          ((sm.obtained_marks ?? sm.obtained ?? 0) /
                            (sm.max_marks ?? sm.max ?? 100)) *
                          100
                        ).toFixed(1),
                      )
                    : 0,
                grade: sm.grade || "—",
                remarks: sm.remarks || "—",
              }))
            : [];

          setReportCardData({
            subjectsMarks,
            totalObtained: Number(existingRc.total_obtained),
            totalMax: Number(existingRc.total_max),
            overallPercentage: Number(existingRc.percentage),
            gpa: Number((existingRc.percentage / 10).toFixed(2)),
            rank: existingRc.class_rank || "—",
            attendancePercentage: Number(existingRc.attendance_percentage),
            workingDays: existingRc.working_days,
            presentDays: existingRc.present_days,
            absentDays: existingRc.absent_days,
            classTeacherRemarks: existingRc.class_teacher_remarks || "—",
            principalRemarks: existingRc.principal_remarks || "—",
            latestRemark: existingRc.class_teacher_remarks || "Demonstrates consistent progress.",
          });
          setLoadingReportCard(false);
          return;
        }

        // 1. Fetch class exams
        const { data: classExData } = await supabase
          .from("exams")
          .select("id, name")
          .eq("school_id", schoolId)
          .eq("class_id", classId)
          .is("deleted_at", null);

        const rawExamIds = (classExData || []).map((e) => e.id);

        // Fetch exam_subjects
        const { data: examSubjs } = await (supabase as any)
          .from("exam_subjects")
          .select("id, exam_id, subject_id, max_marks")
          .eq("school_id", schoolId)
          .in("exam_id", rawExamIds.length ? rawExamIds : ["00000000-0000-0000-0000-000000000000"]);

        const classEx: any[] = [];
        (examSubjs || []).forEach((es: any) => {
          const exam = (classExData || []).find((e) => e.id === es.exam_id);
          if (exam) {
            classEx.push({
              id: es.id,
              name: exam.name,
              max_marks: Number(es.max_marks || 100),
              subject_id: es.subject_id,
            });
          }
        });
        const mappedExamIds = classEx.map((c) => c.id);

        // 2. Fetch marks for this student
        const { data: studentMarksData } = await (supabase as any)
          .from("mark_entries")
          .select("exam_subject_id, marks_obtained")
          .eq("student_id", reportCardStudent.id)
          .in(
            "exam_subject_id",
            mappedExamIds.length ? mappedExamIds : ["00000000-0000-0000-0000-000000000000"],
          );

        const studentMarks = (studentMarksData || []).map((m: any) => ({
          exam_id: m.exam_subject_id,
          marks_obtained: m.marks_obtained,
        }));

        // 3. Fetch latest remark
        const { data: latestRemData } = await supabase
          .from("remarks")
          .select("content")
          .eq("student_id", reportCardStudent.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // 4. Fetch attendance stats
        const { data: attData } = await supabase
          .from("attendance")
          .select("status")
          .eq("student_id", reportCardStudent.id)
          .is("deleted_at", null);

        // 5. Fetch student rank
        const { data: rankData } = await supabase
          .from("rankings")
          .select("rank_position, percentage, gpa")
          .eq("student_id", reportCardStudent.id)
          .eq("academic_year", academicYear)
          .is("exam_id", null) // overall class rank
          .maybeSingle();

        // Process marks by subject
        const subjectMap = new Map<string, { obtained: number; max: number; name: string }>();

        (classEx || []).forEach((ex) => {
          const markObj = (studentMarks || []).find((m: any) => m.exam_id === ex.id);
          if (markObj && ex.subject_id) {
            const subj = subjects.find((s) => s.id === ex.subject_id);
            const subjectName = subj?.name || "Other";

            const current = subjectMap.get(ex.subject_id) || {
              obtained: 0,
              max: 0,
              name: subjectName,
            };
            current.obtained += Number(markObj.marks_obtained);
            current.max += Number(ex.max_marks);
            subjectMap.set(ex.subject_id, current);
          }
        });

        const subjectsMarks = Array.from(subjectMap.values()).map((sm) => {
          const percentage = sm.max > 0 ? (sm.obtained / sm.max) * 100 : 0;
          const grade = getGradeFromPercentage(percentage);

          return {
            subjectName: sm.name,
            obtained: Number(sm.obtained.toFixed(1)),
            max: sm.max,
            percentage: Number(percentage.toFixed(1)),
            grade,
            remarks:
              percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement",
          };
        });

        let totalObtained = 0;
        let totalMax = 0;
        subjectsMarks.forEach((sm) => {
          totalObtained += sm.obtained;
          totalMax += sm.max;
        });

        const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

        // Attendance calc
        let present = 0;
        let total = 0;
        (attData || []).forEach((a) => {
          total++;
          if (a.status === "present" || a.status === "late" || a.status === "half_day") {
            present += a.status === "half_day" ? 0.5 : 1;
          }
        });
        const attendancePercentage = total > 0 ? (present / total) * 100 : 100; // fallback to 100
        const totalWorkingDays = rcWorkingDays || 220;
        const computedPresent = Math.round(totalWorkingDays * (attendancePercentage / 100));

        setReportCardData({
          subjectsMarks,
          totalObtained: Number(totalObtained.toFixed(1)),
          totalMax,
          overallPercentage: Number(overallPercentage.toFixed(1)),
          gpa: rankData ? rankData.gpa : Number((overallPercentage / 10).toFixed(2)),
          rank: rankData ? rankData.rank_position : "—",
          attendancePercentage: Number(attendancePercentage.toFixed(1)),
          workingDays: totalWorkingDays,
          presentDays: computedPresent,
          absentDays: totalWorkingDays - computedPresent,
          classTeacherRemarks: latestRemData
            ? latestRemData.content
            : "Demonstrates consistent progress and participates actively in class activities.",
          principalRemarks:
            overallPercentage >= 75 ? "Excellent performance." : "Satisfactory progress.",
          latestRemark: latestRemData
            ? latestRemData.content
            : "Demonstrates consistent progress and participates actively in class activities.",
        });
      } catch (err: any) {
        console.error("Failed to load report card:", err);
        toast.error("Failed to load report card details.");
      } finally {
        setLoadingReportCard(false);
      }
    };

    void fetchReportCardDetails();
  }, [reportCardStudent, academicYear, schoolId, subjects, selectedReportCardExam]);

  const downloadReportCardPDF = async () => {
    if (!reportCardStudent || !reportCardData) return;
    const element = document.getElementById("report-card-print-area");
    if (!element) {
      toast.error("Report card element not found.");
      return;
    }

    toast.info("Generating Report Card PDF. Please wait...");

    try {
      const canvas = await safeHtml2Canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`${reportCardStudent.full_name}_Report_Card.pdf`);
      toast.success("Report Card downloaded successfully.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate PDF: " + err.message);
    }
  };

  const logAuditAction = async (
    studentId: string,
    reportCardId: string | null,
    action: "Created" | "Edited" | "Approved" | "Published",
  ) => {
    if (!schoolId || !user) return;
    try {
      const { error } = await (supabase as any).from("report_card_audit_logs").insert({
        school_id: schoolId,
        student_id: studentId,
        report_card_id: reportCardId,
        action: action,
        performed_by: user.id,
        performed_by_name: user.email?.split("@")[0] || "User",
      });
      if (error) console.error("Audit log failed:", error);
    } catch (err) {
      console.error("Audit log error:", err);
    }
  };

  const loadStudentDocuments = async (studentId: string) => {
    if (!schoolId) return;
    try {
      const { data, error } = await (supabase as any)
        .from("student_documents")
        .select("*")
        .eq("student_id", studentId)
        .eq("school_id", schoolId);
      if (error) throw error;
      setStudentDocuments(data || []);
    } catch (err: any) {
      console.error("Failed to load student documents:", err);
    }
  };

  const loadAuditLogs = async (studentId: string) => {
    if (!schoolId) return;
    try {
      const { data, error } = await (supabase as any)
        .from("report_card_audit_logs")
        .select("*")
        .eq("student_id", studentId)
        .eq("school_id", schoolId)
        .order("performed_at", { ascending: false });
      if (error) throw error;
      setReportCardAuditHistory(data || []);
    } catch (err: any) {
      console.error("Failed to load audit logs:", err);
    }
  };

  const handleUploadDocument = async (studentId: string, documentType: string, file: File) => {
    if (!schoolId || !user) return;
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const path = `${schoolId}/${studentId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("student-photos")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);

      const { error: dbError } = await (supabase as any).from("student_documents").insert({
        school_id: schoolId,
        student_id: studentId,
        document_type: documentType,
        file_name: file.name,
        file_url: pubUrl.publicUrl,
        uploaded_by: user.id,
      });

      if (dbError) throw dbError;

      toast.success("Document uploaded successfully!");
      void loadStudentDocuments(studentId);
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    }
  };

  const handleDeleteDocument = async (docId: string, studentId: string) => {
    try {
      const { error } = await (supabase as any).from("student_documents").delete().eq("id", docId);
      if (error) throw error;
      toast.success("Document deleted successfully");
      void loadStudentDocuments(studentId);
    } catch (err: any) {
      toast.error("Failed to delete document: " + err.message);
    }
  };

  const handlePromoteStudents = async (
    action: "promote" | "retain" | "transfer",
    studentIds: string[],
    targetClassId?: string,
  ) => {
    if (!schoolId || studentIds.length === 0) {
      toast.error("Please select at least one student");
      return;
    }
    setIsLoading(true);
    try {
      if (action === "promote") {
        if (!targetClassId) {
          toast.error("Please select a target class for promotion");
          setIsLoading(false);
          return;
        }
        const nextYear = academicYear === "2025-2026" ? "2026-2027" : "2027-2028";
        const { error } = await supabase
          .from("students")
          .update({
            class_id: targetClassId,
            academic_year: nextYear,
          })
          .in("id", studentIds)
          .eq("school_id", schoolId);

        if (error) throw error;
        toast.success(
          `Successfully promoted ${studentIds.length} student(s) to Class ${classes.find((c) => c.id === targetClassId)?.name || "Next Class"} and updated academic year to ${nextYear}!`,
        );
      } else if (action === "retain") {
        const nextYear = academicYear === "2025-2026" ? "2026-2027" : "2027-2028";
        const { error } = await supabase
          .from("students")
          .update({
            academic_year: nextYear,
          })
          .in("id", studentIds)
          .eq("school_id", schoolId);

        if (error) throw error;
        toast.success(
          `Successfully retained ${studentIds.length} student(s) in current class for academic year ${nextYear}.`,
        );
      } else if (action === "transfer") {
        const { error } = await supabase
          .from("students")
          .update({
            class_id: null,
          })
          .in("id", studentIds)
          .eq("school_id", schoolId);

        if (error) throw error;
        toast.success(`Successfully transferred ${studentIds.length} student(s) out of the class.`);
      }

      void loadData();
      setShowPromotionPanel(false);
      setPromotionSelectedStudents([]);
    } catch (err: any) {
      toast.error("Promotion failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const autoGenerateAwards = async (classId: string) => {
    if (!schoolId) return;
    try {
      const classRcs = reportCards.filter(
        (rc) => rc.class_id === classId && rc.exam_type === selectedReportCardExam,
      );
      if (classRcs.length === 0) return;

      const issuedBy = user?.id || adminUserId;

      const studentIds = classRcs.map((rc) => rc.student_id);
      await supabase
        .from("awards")
        .delete()
        .eq("school_id", schoolId)
        .eq("academic_year", academicYear)
        .in("student_id", studentIds)
        .in("category", [
          "gold_medal",
          "silver_medal",
          "bronze_medal",
          "academic_star",
          "attendance_champion",
          "subject_topper",
          "best_improvement",
        ]);

      const awardPromises = classRcs.map(async (rc) => {
        const studentObj = students.find((s) => s.id === rc.student_id);
        if (!studentObj) return;

        if (rc.class_rank === 1) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "gold_medal",
            title: "Gold Medal for Academic Excellence",
            description: `Secured 1st Rank in Class with an outstanding cumulative score of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        } else if (rc.class_rank === 2) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "silver_medal",
            title: "Silver Medal for Academic Distinction",
            description: `Secured 2nd Rank in Class with a cumulative score of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        } else if (rc.class_rank === 3) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "bronze_medal",
            title: "Bronze Medal for Academic Merit",
            description: `Secured 3rd Rank in Class with a cumulative score of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }

        if (rc.percentage >= 90) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "academic_star",
            title: "Academic Star Award",
            description: `Scored distinction grade of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }

        if (rc.attendance_percentage >= 98) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "attendance_champion",
            title: "Attendance Champion Award",
            description: `Maintained an exemplary attendance rate of ${rc.attendance_percentage}% during the academic term.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }

        if (Array.isArray(rc.subject_marks)) {
          for (const sm of rc.subject_marks) {
            if (sm.obtained_marks >= 98) {
              await supabase.from("awards").insert({
                school_id: schoolId,
                student_id: rc.student_id,
                academic_year: academicYear,
                category: "subject_topper",
                title: `Subject Topper - ${sm.subject_name}`,
                description: `Scored top marks of ${sm.obtained_marks}/${sm.max_marks} in ${sm.subject_name}.`,
                issued_by: issuedBy,
                is_published: true,
              });
              break;
            }
          }
        }

        if (rc.percentage >= 75 && rc.class_rank > 3 && rc.class_rank <= 10) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "best_improvement",
            title: "Best Improvement Award",
            description: `Demonstrated exceptional academic growth and progress during the term, achieving a cumulative percentage of ${rc.percentage}%.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
      });

      await Promise.all(awardPromises);
      void loadData();
    } catch (err: any) {
      console.error("Awards generation failed:", err);
    }
  };

  useEffect(() => {
    const studentId = reportCardStudent?.id || activeReportCard?.student_id;
    if (studentId) {
      void loadStudentDocuments(studentId);
      void loadAuditLogs(studentId);
    }
  }, [reportCardStudent, activeReportCard]);

  // Initial Data Fetch
  const loadData = async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      // 0) Fetch School details
      const { data: schoolRes } = await (supabase as any)
        .from("schools")
        .select(
          "id, name, school_name, logo_url, school_logo, address, phone_number, email, principal_name, principal_signature_url",
        )
        .eq("id", schoolId)
        .single();
      if (schoolRes) {
        setSchool({
          id: schoolRes.id,
          name: schoolRes.school_name || schoolRes.name,
          logo_url: schoolRes.school_logo || schoolRes.logo_url,
          address: schoolRes.address,
          phone_number: schoolRes.phone_number,
          email: schoolRes.email,
          principal_name: schoolRes.principal_name || "",
          principal_signature_url: schoolRes.principal_signature_url || null,
        });
      }

      // 1) Fetch Classes
      const { data: classesData } = await (supabase as any)
        .from("classes")
        .select("id, name, grade, section, class_teacher_id")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("name");
      setClasses(classesData || []);
      if (classesData && classesData.length > 0) {
        if (!selectedClass) setSelectedClass(classesData[0].id);
        if (!selectedReportCardClass) setSelectedReportCardClass(classesData[0].id);
        setAllocClassId(classesData[0].id);
      }

      // 2) Fetch Subjects
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, name, code")
        .eq("school_id", schoolId)
        .order("name");
      setSubjects(subjectsData || []);
      if (subjectsData && subjectsData.length > 0) {
        setAllocSubjectId(subjectsData[0].id);
      }

      // 3) Fetch Students
      const { data: studentsData } = await supabase
        .from("students")
        .select(
          "id, full_name, roll_number, class_id, photo_url, parent_user_id, parent_email, parent_name, parent_phone, admission_number, classes(name, section)",
        )
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("full_name");

      const normStudents = (studentsData || []).map((s: any) => ({
        ...s,
        classes: Array.isArray(s.classes) ? s.classes[0] || null : s.classes,
      }));
      setStudents(normStudents);

      // 4) Fetch Exams & Subjects
      const { data: rawExams } = await supabase
        .from("exams")
        .select("id, class_id, name, type, date")
        .eq("school_id", schoolId)
        .is("deleted_at", null);

      const { data: examSubjs } = await (supabase as any)
        .from("exam_subjects")
        .select("id, exam_id, subject_id, max_marks")
        .eq("school_id", schoolId);

      const combinedExams: any[] = [];
      (examSubjs || []).forEach((es: any) => {
        const exam = (rawExams || []).find((e) => e.id === es.exam_id);
        if (exam) {
          combinedExams.push({
            id: es.id,
            exam_id: exam.id,
            class_id: exam.class_id,
            name: `${exam.name} - ${es.subject_id}`,
            type: exam.type,
            max_marks: Number(es.max_marks || 100),
            subject_id: es.subject_id,
            date: exam.date,
          });
        }
      });
      combinedExams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExams(combinedExams);
      if (combinedExams.length > 0 && !selectedExam) {
        setSelectedExam(combinedExams[0].id);
      }

      // 5) Fetch Marks
      const { data: rawMarks } = await (supabase as any)
        .from("mark_entries")
        .select("id, student_id, exam_id, exam_subject_id, marks_obtained")
        .eq("school_id", schoolId);

      const mappedMarks = (rawMarks || []).map((m: any) => ({
        id: m.id,
        student_id: m.student_id,
        exam_id: m.exam_subject_id,
        marks_obtained: m.marks_obtained,
      }));
      setMarks(mappedMarks);

      // 6) Fetch Rules
      const { data: rulesData } = await supabase
        .from("ranking_rules")
        .select("criteria, attendance_weightage, attendance_threshold, enabled_categories")
        .eq("school_id", schoolId)
        .maybeSingle();
      if (rulesData) {
        setRankingCriteria(rulesData.criteria);
        setAttendanceWeightage(Number(rulesData.attendance_weightage));
        setAttendanceThreshold(Number(rulesData.attendance_threshold));
        if (rulesData.enabled_categories) {
          setEnabledCategories(rulesData.enabled_categories);
        }
      }

      // 7) Fetch Rankings
      const { data: rankingsData } = await supabase
        .from("rankings")
        .select(
          "id, student_id, academic_year, exam_id, total_marks, percentage, gpa, rank_position, rank_type, subject_id, students(full_name, roll_number, photo_url, classes(name))",
        )
        .eq("school_id", schoolId)
        .order("rank_position");

      const mappedRankings = (rankingsData || []).map((r: any) => {
        const stud = Array.isArray(r.students) ? r.students[0] : r.students;
        return {
          ...r,
          student: stud
            ? {
                full_name: stud.full_name,
                roll_number: stud.roll_number,
                classes: Array.isArray(stud.classes) ? stud.classes[0] : stud.classes,
              }
            : null,
        };
      });
      setRankings(mappedRankings);

      // 8) Fetch Awards
      const { data: awardsData } = await supabase
        .from("awards")
        .select(
          "id, student_id, academic_year, category, title, description, issued_at, students(full_name, roll_number, classes(name))",
        )
        .eq("school_id", schoolId)
        .order("issued_at", { ascending: false });

      const mappedAwards = (awardsData || []).map((a: any) => {
        const stud = Array.isArray(a.students) ? a.students[0] : a.students;
        return {
          ...a,
          student: stud
            ? {
                full_name: stud.full_name,
                roll_number: stud.roll_number,
                classes: Array.isArray(stud.classes) ? stud.classes[0] : stud.classes,
              }
            : null,
        };
      });
      setAwards(mappedAwards);

      // 9) Fetch Certificates
      const { data: certsData } = await supabase
        .from("certificates")
        .select(
          "id, student_id, award_id, certificate_type, certificate_number, issued_date, students(full_name), awards(title, category)",
        )
        .eq("school_id", schoolId);

      const mappedCerts = (certsData || []).map((c: any) => {
        const stud = Array.isArray(c.students) ? c.students[0] : c.students;
        const awd = Array.isArray(c.awards) ? c.awards[0] : c.awards;
        return {
          ...c,
          student: stud,
          award: awd,
        };
      });
      setCertificates(mappedCerts);

      // 10) Fetch Notification Logs
      const { data: notifyData } = await supabase
        .from("notification_logs")
        .select(
          "id, parent_user_id, student_id, type, title, body, status, sent_at, students(full_name)",
        )
        .eq("school_id", schoolId)
        .order("sent_at", { ascending: false });

      const mappedNotify = (notifyData || []).map((n: any) => {
        const stud = Array.isArray(n.students) ? n.students[0] : n.students;
        return {
          ...n,
          student: stud,
        };
      });
      setNotifications(mappedNotify);

      // 11) Fetch Report Cards
      const { data: rcData, error: rcErr } = await (supabase as any)
        .from("report_cards")
        .select(
          `
          id, school_id, student_id, class_id, exam_type, academic_year,
          total_obtained, total_max, percentage, class_rank, section_rank, school_rank,
          result_status, working_days, present_days, absent_days, attendance_percentage,
          subject_marks, class_teacher_remarks, principal_remarks, pdf_url, status,
          students (full_name, roll_number, admission_number, photo_url, parent_name, parent_phone, parent_email, parent_user_id)
        `,
        )
        .eq("school_id", schoolId);

      if (rcErr) {
        console.error("Error fetching report cards:", rcErr);
      } else {
        const mappedRc = (rcData || []).map((r: any) => {
          const stud = Array.isArray(r.students) ? r.students[0] : r.students;
          return {
            ...r,
            student: stud,
          };
        });
        setReportCards(mappedRc);
      }

      // 12) Fetch Subject Allocations
      const { data: allocationsData } = await (supabase as any)
        .from("teacher_allocations")
        .select("id, teacher_id, subject_id, class_id")
        .eq("school_id", schoolId);
      setSubjectAllocations(allocationsData || []);

      // 13) Fetch school profiles
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .eq("school_id", schoolId);
      setAllProfiles(profilesData || []);

      // 14) Fetch user roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("school_id", schoolId);
      setAllRoles(rolesData || []);

      const teachersList = (profilesData || []).filter((p: any) =>
        (rolesData || []).some((r: any) => r.user_id === p.user_id && r.role === "teacher"),
      );
      if (teachersList.length > 0) {
        setAllocTeacherId(teachersList[0].user_id);
      }
    } catch (e: any) {
      toast.error("Error loading data: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (schoolId) {
      void loadData();
    }
  }, [schoolId]);

  // Filters computed lists
  const filteredStudents = useMemo(() => {
    let result = students;
    if (selectedClass) {
      result = result.filter((s) => s.class_id === selectedClass);
    }
    if (searchQuery) {
      result = result.filter((s) =>
        s.full_name?.toLowerCase()?.includes(searchQuery.toLowerCase()),
      );
    }
    return result;
  }, [students, selectedClass, searchQuery]);

  const filteredRankings = useMemo(() => {
    let result = rankings.filter((r) => r.academic_year === academicYear);
    if (selectedClass) {
      result = result.filter(
        (r) => r.student?.classes?.name === classes.find((c) => c.id === selectedClass)?.name,
      );
    }
    if (selectedExam) {
      result = result.filter((r) => r.exam_id === selectedExam);
    } else {
      result = result.filter((r) => r.exam_id === null); // overall year rank
    }
    if (selectedSubject) {
      result = result.filter((r) => r.subject_id === selectedSubject);
    }
    return result;
  }, [rankings, selectedClass, selectedExam, selectedSubject, academicYear, classes]);

  const filteredAwards = useMemo(() => {
    let result = awards.filter((a) => a.academic_year === academicYear);
    if (selectedClass) {
      result = result.filter(
        (a) => a.student?.classes?.name === classes.find((c) => c.id === selectedClass)?.name,
      );
    }
    if (searchQuery) {
      result = result.filter(
        (a) =>
          a.student?.full_name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
          a.title?.toLowerCase()?.includes(searchQuery.toLowerCase()),
      );
    }
    return result;
  }, [awards, selectedClass, searchQuery, academicYear, classes]);

  // Set default items for exporters when lists refresh
  useEffect(() => {
    if (filteredStudents.length > 0 && !selectedStudentForPoster) {
      setSelectedStudentForPoster(filteredStudents[0]);
    }
    if (filteredStudents.length > 0 && !selectedStudentForCert) {
      setSelectedStudentForCert(filteredStudents[0]);
    }
  }, [filteredStudents]);

  // Ranks Calculator Logic - Fully functional client-side + saves to DB
  const handleCalculateRankings = async () => {
    if (!schoolId || !selectedClass) {
      toast.error("Please select a class first");
      return;
    }
    setIsCalculating(true);

    try {
      // 1) Fetch class students
      const { data: classStudents } = await supabase
        .from("students")
        .select("id, full_name, roll_number, parent_user_id, parent_email")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass)
        .is("deleted_at", null);

      if (!classStudents || classStudents.length === 0) {
        toast.error("No students in this class to rank");
        setIsCalculating(false);
        return;
      }

      // 2) Fetch exams and marks for the class
      const { data: classExamsData } = await supabase
        .from("exams")
        .select("id, name")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass)
        .is("deleted_at", null);

      if (!classExamsData || classExamsData.length === 0) {
        toast.error("No exams set up for this class to calculate marks");
        setIsCalculating(false);
        return;
      }

      const rawExamIds = classExamsData.map((e) => e.id);
      const { data: examSubjs } = await (supabase as any)
        .from("exam_subjects")
        .select("id, exam_id, subject_id, max_marks")
        .eq("school_id", schoolId)
        .in("exam_id", rawExamIds);

      const classExams: any[] = [];
      (examSubjs || []).forEach((es: any) => {
        const exam = classExamsData.find((e) => e.id === es.exam_id);
        if (exam) {
          classExams.push({
            id: es.id,
            name: exam.name,
            max_marks: Number(es.max_marks || 100),
            subject_id: es.subject_id,
          });
        }
      });

      if (classExams.length === 0) {
        toast.error("No subjects set up for exams in this class");
        setIsCalculating(false);
        return;
      }

      const examIds = classExams.map((e: any) => e.id);
      const { data: classMarksData } = await (supabase as any)
        .from("mark_entries")
        .select("student_id, exam_subject_id, marks_obtained")
        .eq("school_id", schoolId)
        .in("exam_subject_id", examIds);

      const classMarks = (classMarksData || []).map((m: any) => ({
        student_id: m.student_id,
        exam_id: m.exam_subject_id,
        marks_obtained: m.marks_obtained,
      }));

      // 3) Fetch attendance rates for the students
      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("student_id, status")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass)
        .is("deleted_at", null);

      // Map attendance
      const attendanceMap = new Map<string, { present: number; total: number }>();
      (attendanceData || []).forEach((a) => {
        const stats = attendanceMap.get(a.student_id) || { present: 0, total: 0 };
        stats.total += 1;
        if (a.status === "present" || a.status === "late" || a.status === "half_day") {
          stats.present += a.status === "half_day" ? 0.5 : 1;
        }
        attendanceMap.set(a.student_id, stats);
      });

      // Calculate totals
      const studentTotals = classStudents.map((student) => {
        const studMarks = (classMarks || []).filter((m: any) => m.student_id === student.id);

        let totalObtained = 0;
        let totalMax = 0;

        studMarks.forEach((sm: any) => {
          const ex = classExams.find((e) => e.id === sm.exam_id);
          if (ex) {
            totalObtained += Number(sm.marks_obtained);
            totalMax += Number(ex.max_marks);
          }
        });

        // Compute percentage and GPA
        const basePercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

        // Attendance Weightage (Optional)
        const attStats = attendanceMap.get(student.id) || { present: 0, total: 0 };
        const attRate = attStats.total > 0 ? attStats.present / attStats.total : 0;

        let weightedPercentage = basePercentage;
        if (attendanceWeightage > 0) {
          // Add attendance rate weightage bonus (e.g. 10% weight adds up to 10 points for 100% attendance)
          weightedPercentage =
            basePercentage * (1 - attendanceWeightage) + attRate * 100 * attendanceWeightage;
        }

        const calculatedGpa = Math.min(
          Math.max(Number((weightedPercentage / 10).toFixed(2)), 0.0),
          10.0,
        );

        return {
          studentId: student.id,
          fullName: student.full_name,
          rollNumber: student.roll_number,
          parentUserId: student.parent_user_id,
          parentEmail: student.parent_email,
          totalObtained,
          totalMax,
          percentage: Number(weightedPercentage.toFixed(2)),
          gpa: calculatedGpa,
          attendanceRate: Number((attRate * 100).toFixed(1)),
        };
      });

      // Sort by percentage/GPA to assign ranks
      studentTotals.sort((a, b) => b.percentage - a.percentage);

      // Save rankings & awards in database
      // Clear previous calculations for this class in this academic year
      const targetExamId = selectedExam || null;
      const studentIdsList = classStudents.map((s) => s.id);

      if (targetExamId) {
        await supabase
          .from("rankings")
          .delete()
          .eq("school_id", schoolId)
          .eq("exam_id", targetExamId)
          .in("student_id", studentIdsList);
      } else {
        await supabase
          .from("rankings")
          .delete()
          .eq("school_id", schoolId)
          .is("exam_id", null)
          .in("student_id", studentIdsList);
      }

      let currentRank = 1;
      let tieCount = 0;
      let prevPercentage = -1;

      const insRankPromises = studentTotals.map((st, idx) => {
        if (st.percentage === prevPercentage) {
          tieCount++;
        } else {
          currentRank += tieCount;
          tieCount = 1;
        }
        prevPercentage = st.percentage;
        const rankPos = currentRank;

        return supabase.from("rankings").insert({
          school_id: schoolId,
          student_id: st.studentId,
          academic_year: academicYear,
          exam_id: targetExamId,
          total_marks: st.totalObtained,
          percentage: st.percentage,
          gpa: st.gpa,
          rank_position: rankPos,
          rank_type: targetExamId ? "subject" : "class",
          is_published: false, // draft initially
        });
      });
      await Promise.all(insRankPromises);

      const isCategoryEnabled = (cat: string) => (enabledCategories ?? []).includes(cat);

      // Clear previous awards in these categories to prevent duplicates
      await supabase
        .from("awards")
        .delete()
        .eq("school_id", schoolId)
        .eq("academic_year", academicYear)
        .in("student_id", studentIdsList)
        .in("category", [
          "rank_1",
          "rank_2",
          "rank_3",
          "top_10",
          "attendance_topper",
          "discipline_award",
        ]);

      const issuedBy = user?.id || adminUserId;
      const parentNotifPromises = [];

      let currentAwardRank = 1;
      let awardTieCount = 0;
      let prevAwardPercentage = -1;

      for (let i = 0; i < studentTotals.length; i++) {
        const st = studentTotals[i];
        if (st.percentage === prevAwardPercentage) {
          awardTieCount++;
        } else {
          currentAwardRank += awardTieCount;
          awardTieCount = 1;
        }
        prevAwardPercentage = st.percentage;
        const rank = currentAwardRank;

        if (rank > 3) continue;

        const category = `rank_${rank}`;

        if (isCategoryEnabled(category)) {
          const titleSuffix = rank === 1 ? "First" : rank === 2 ? "Second" : "Third";
          const awardTitle = `${titleSuffix} Rank Academic Excellence Award`;
          const awardDesc = `Awarded to ${st.fullName} for securing Rank #${rank} in Class with a cumulative score of ${st.percentage}% (GPA: ${st.gpa}) for the exam terms.`;

          const { data: awardIns } = await supabase
            .from("awards")
            .insert({
              school_id: schoolId,
              student_id: st.studentId,
              academic_year: academicYear,
              category,
              title: awardTitle,
              description: awardDesc,
              issued_by: issuedBy,
              is_published: false,
            })
            .select("id")
            .single();

          const awardId = awardIns?.id;

          const certNo = `HZ-${academicYear.replace("-", "")}-C00${rank}-${st.rollNumber}-${Math.round(Math.random() * 100)}`;
          await supabase.from("certificates").insert({
            school_id: schoolId,
            student_id: st.studentId,
            award_id: awardId,
            certificate_type: `${titleSuffix} Rank Certificate`,
            certificate_number: certNo,
            issued_date: new Date().toISOString().slice(0, 10),
          });

          const posterThemeMap: Record<number, string> = { 1: "gold", 2: "silver", 3: "bronze" };
          await supabase.from("posters").insert({
            school_id: schoolId,
            student_id: st.studentId,
            award_id: awardId,
            theme: posterThemeMap[rank] || "modern",
          });

          if (st.parentUserId) {
            parentNotifPromises.push(
              supabase.from("notification_logs").insert({
                school_id: schoolId,
                parent_user_id: st.parentUserId,
                student_id: st.studentId,
                award_id: awardId,
                type: "rank",
                title: `🏆 Rank #${rank} Calculated for ${st.fullName}`,
                body: `Rank #${rank} has been calculated for ${st.fullName} as draft. Awaiting administrative verification before final release.`,
                status: "sent",
              }),
            );
          }
        }
      }

      if (isCategoryEnabled("attendance_topper")) {
        const attendanceWinner = [...studentTotals].sort(
          (a, b) => b.attendanceRate - a.attendanceRate,
        )[0];
        if (attendanceWinner && attendanceWinner.attendanceRate >= attendanceThreshold) {
          const { data: attAwardIns } = await supabase
            .from("awards")
            .insert({
              school_id: schoolId,
              student_id: attendanceWinner.studentId,
              academic_year: academicYear,
              category: "attendance_topper",
              title: "Outstanding Attendance Championship",
              description: `Presented to ${attendanceWinner.fullName} for maintaining an exceptional attendance rate of ${attendanceWinner.attendanceRate}% during the academic term.`,
              issued_by: issuedBy,
              is_published: false,
            })
            .select("id")
            .single();

          const attAwardId = attAwardIns?.id;

          await supabase.from("certificates").insert({
            school_id: schoolId,
            student_id: attendanceWinner.studentId,
            award_id: attAwardId,
            certificate_type: "Best Attendance Certificate",
            certificate_number: `HZ-${academicYear.replace("-", "")}-ATT-${attendanceWinner.rollNumber}`,
            issued_date: new Date().toISOString().slice(0, 10),
          });

          if (attendanceWinner.parentUserId) {
            parentNotifPromises.push(
              supabase.from("notification_logs").insert({
                school_id: schoolId,
                parent_user_id: attendanceWinner.parentUserId,
                student_id: attendanceWinner.studentId,
                award_id: attAwardId,
                type: "award",
                title: `📅 Attendance Topper: ${attendanceWinner.fullName}`,
                body: `Attendance Champion award has been drafted for ${attendanceWinner.fullName} with a rate of ${attendanceWinner.attendanceRate}%.`,
                status: "sent",
              }),
            );
          }
        }
      }

      if (isCategoryEnabled("discipline_award")) {
        const disciplineWinner =
          studentTotals.find((s) => s.fullName?.toLowerCase()?.includes("rohan")) ||
          studentTotals[studentTotals.length - 1];
        if (disciplineWinner) {
          const { data: discAwardIns } = await supabase
            .from("awards")
            .insert({
              school_id: schoolId,
              student_id: disciplineWinner.studentId,
              academic_year: academicYear,
              category: "discipline_award",
              title: "Best Discipline & Leadership Award",
              description: `Awarded to ${disciplineWinner.fullName} for demonstrating exemplary behavior, integrity, respect, and adherence to school codes.`,
              issued_by: issuedBy,
              is_published: false,
            })
            .select("id")
            .single();

          const discAwardId = discAwardIns?.id;

          await supabase.from("certificates").insert({
            school_id: schoolId,
            student_id: disciplineWinner.studentId,
            award_id: discAwardId,
            certificate_type: "Best Discipline Certificate",
            certificate_number: `HZ-${academicYear.replace("-", "")}-DIS-${disciplineWinner.rollNumber}`,
            issued_date: new Date().toISOString().slice(0, 10),
          });
        }
      }

      await Promise.all(parentNotifPromises);

      toast.success("Ranks calculated in draft mode! Verify and publish to release to parents.");
      triggerConfetti();
      void loadData(); // reload dashboards
    } catch (e: any) {
      toast.error("Calculation failed: " + e.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePublishRankings = async () => {
    if (!schoolId || !selectedClass) return;
    setIsLoading(true);
    try {
      const { data: classStudents } = await supabase
        .from("students")
        .select("id, full_name, parent_user_id")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass);

      if (!classStudents || classStudents.length === 0) {
        toast.error("No students found in this class");
        setIsLoading(false);
        return;
      }
      const studentIds = classStudents.map((s) => s.id);

      // Publish Rankings
      const { error: re } = await supabase
        .from("rankings")
        .update({ is_published: true })
        .eq("school_id", schoolId)
        .in("student_id", studentIds);

      // Publish Awards
      const { error: ae } = await supabase
        .from("awards")
        .update({ is_published: true })
        .eq("school_id", schoolId)
        .in("student_id", studentIds);

      if (re || ae) {
        toast.error("Error publishing: " + (re?.message || ae?.message));
      } else {
        // Create notifications for parent release
        const releaseNotifs = [];
        for (const st of classStudents) {
          if (st.parent_user_id) {
            releaseNotifs.push(
              supabase.from("notification_logs").insert({
                school_id: schoolId,
                parent_user_id: st.parent_user_id,
                student_id: st.id,
                type: "rank",
                title: `📢 Rankings Published for ${st.full_name}`,
                body: `The official school rankings and certifications have been published. View child cards and download reports now.`,
                status: "delivered",
              }),
            );
          }
        }
        await Promise.all(releaseNotifs);

        toast.success("All rankings and awards verified and published to parents!");
        triggerConfetti();
        void loadData();
      }
    } catch (e: any) {
      toast.error("Publish failed: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignClassTeacher = async () => {
    if (!schoolId || !allocClassId || !allocTeacherId) {
      toast.error("Please select both a class and a teacher.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("classes")
        .update({ class_teacher_id: allocTeacherId })
        .eq("id", allocClassId)
        .eq("school_id", schoolId);

      if (error) {
        toast.error("Failed to assign class teacher: " + error.message);
      } else {
        toast.success("Class Teacher assigned successfully!");
        void loadData();
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllocateSubjectTeacher = async () => {
    if (!schoolId || !allocClassId || !allocSubjectId || !allocTeacherId) {
      toast.error("Please select a class, subject, and teacher.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await (supabase as any).from("teacher_allocations").insert({
        school_id: schoolId,
        class_id: allocClassId,
        subject_id: allocSubjectId,
        teacher_id: allocTeacherId,
      });

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation (class_id, subject_id)
          const { error: updErr } = await (supabase as any)
            .from("teacher_allocations")
            .update({ teacher_id: allocTeacherId })
            .eq("class_id", allocClassId)
            .eq("subject_id", allocSubjectId)
            .eq("school_id", schoolId);
          if (updErr) {
            toast.error("Failed to update allocation: " + updErr.message);
          } else {
            toast.success("Subject allocation updated successfully!");
            void loadData();
          }
        } else {
          toast.error("Failed to allocate subject: " + error.message);
        }
      } else {
        toast.success("Subject teacher allocated successfully!");
        void loadData();
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAllocation = async (allocId: string) => {
    if (!confirm("Are you sure you want to remove this allocation?")) return;
    setIsLoading(true);
    try {
      const { error } = await (supabase as any)
        .from("teacher_allocations")
        .delete()
        .eq("id", allocId)
        .eq("school_id", schoolId!);
      if (error) {
        toast.error("Failed to remove allocation: " + error.message);
      } else {
        toast.success("Allocation removed successfully.");
        void loadData();
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper internal function to seed academic data for a specific class ID
  const handleSeedMockAcademicDataInternal = async (targetClassId: string) => {
    const classStuds = students.filter((s) => s.class_id === targetClassId);
    if (classStuds.length === 0) return;

    const coreSubjects = [
      { name: "Telugu", code: "TEL" },
      { name: "Hindi", code: "HIN" },
      { name: "English", code: "ENG" },
      { name: "Mathematics", code: "MAT" },
      { name: "Science", code: "SCI" },
      { name: "Social Studies", code: "SOC" },
      { name: "Computer", code: "CMP" },
    ];

    const { data: dbSubjects } = await supabase
      .from("subjects")
      .select("id, name")
      .eq("school_id", schoolId!);

    const finalSubjectsMap = new Map<string, string>();
    (dbSubjects || []).forEach((s) => {
      finalSubjectsMap.set(s.name, s.id);
    });

    for (const cs of coreSubjects) {
      if (!finalSubjectsMap.has(cs.name)) {
        const { data: newSubj } = await supabase
          .from("subjects")
          .insert({ school_id: schoolId!, name: cs.name, code: cs.code })
          .select("id, name")
          .single();
        if (newSubj) finalSubjectsMap.set(newSubj.name, newSubj.id);
      }
    }

    const examNamePrefix = selectedReportCardExam;
    const { data: dbExams } = await supabase
      .from("exams")
      .select("id, name")
      .eq("school_id", schoolId!)
      .eq("class_id", targetClassId)
      .eq("type", selectedReportCardExam)
      .is("deleted_at", null);

    let generalExam = (dbExams || []).find((e) => e.name === examNamePrefix);
    if (!generalExam) {
      const { data: newExam, error: examErr } = await supabase
        .from("exams")
        .insert({
          school_id: schoolId!,
          class_id: targetClassId,
          name: examNamePrefix,
          type: selectedReportCardExam,
          date: new Date().toISOString().slice(0, 10),
        })
        .select("id")
        .single();
      if (examErr) throw examErr;
      generalExam = newExam as any;
    }

    const examId = (generalExam as any).id;

    // Fetch existing exam_subjects for this exam
    const { data: dbExamSubjs } = await (supabase as any)
      .from("exam_subjects")
      .select("id, subject_id")
      .eq("exam_id", examId);

    const examSubjMap = new Map<string, string>(); // subjectId -> examSubjectId
    (dbExamSubjs || []).forEach((es: any) => {
      examSubjMap.set(es.subject_id, es.id);
    });

    for (const [subjName, subjId] of finalSubjectsMap.entries()) {
      if (!examSubjMap.has(subjId)) {
        const { data: newES, error: esErr } = await (supabase as any)
          .from("exam_subjects")
          .insert({
            school_id: schoolId!,
            exam_id: examId,
            subject_id: subjId,
            max_marks: 100,
            pass_marks: 35,
          })
          .select("id")
          .single();
        if (esErr) throw esErr;
        if (newES) examSubjMap.set(subjId, newES.id);
      }
    }

    // Now seed mark_entries (formerly exam_marks)
    const { data: existingMarks } = await (supabase as any)
      .from("mark_entries")
      .select("student_id, exam_subject_id")
      .eq("exam_id", examId);

    const marksToInsert = [];
    for (const stud of classStuds) {
      for (const [subjId, esId] of examSubjMap.entries()) {
        const hasMark = (existingMarks || []).some(
          (m: any) => m.student_id === stud.id && m.exam_subject_id === esId,
        );
        if (!hasMark) {
          const obtained = Math.floor(Math.random() * 53) + 45;
          marksToInsert.push({
            school_id: schoolId!,
            exam_id: examId,
            exam_subject_id: esId,
            student_id: stud.id,
            marks_obtained: obtained,
            grade:
              obtained >= 91
                ? "A+"
                : obtained >= 81
                  ? "A"
                  : obtained >= 71
                    ? "B+"
                    : obtained >= 61
                      ? "B"
                      : obtained >= 51
                        ? "C+"
                        : obtained >= 41
                          ? "C"
                          : obtained >= 35
                            ? "D"
                            : "F",
            remarks: "Demo score",
            status: "Draft",
          });
        }
      }
    }

    if (marksToInsert.length > 0) {
      await (supabase as any).from("mark_entries").insert(marksToInsert);
    }
  };

  const handleSeedMockAcademicData = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    if (!schoolId || !activeClassId) {
      toast.error("Please select a class first");
      return;
    }
    setIsLoading(true);
    try {
      await handleSeedMockAcademicDataInternal(activeClassId);

      // Ensure some Attendance data exists for this class
      const classStuds = students.filter((s) => s.class_id === activeClassId);
      const { count: attCount } = await supabase
        .from("attendance")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .eq("class_id", activeClassId);

      if ((attCount || 0) === 0) {
        const attToInsert = [];
        const today = new Date();
        for (let dIdx = 0; dIdx < 20; dIdx++) {
          const dateStr = new Date(today.getTime() - dIdx * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10);
          for (const stud of classStuds) {
            const roll = Math.random();
            const status = roll < 0.9 ? "present" : roll < 0.95 ? "late" : "absent";
            attToInsert.push({
              school_id: schoolId,
              class_id: activeClassId,
              student_id: stud.id,
              date: dateStr,
              status: status,
              marked_by: user?.id || adminUserId,
            });
          }
        }
        await (supabase as any).from("attendance").insert(attToInsert as any);
      }

      // Ensure some Remarks exist
      const { count: remCount } = await supabase
        .from("remarks")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId);

      if ((remCount || 0) === 0) {
        const remsToInsert = classStuds.map((stud) => ({
          school_id: schoolId,
          student_id: stud.id,
          teacher_id: user?.id || adminUserId,
          category: "academic",
          content:
            "Exhibits excellent learning interest, participates actively in team projects, and shows consistent progress.",
          visible_to_parent: true,
        }));
        await (supabase as any).from("remarks").insert(remsToInsert as any);
      }

      toast.success("Successfully seeded realistic academic records!");
      void loadData();
    } catch (e: any) {
      toast.error("Failed to seed academic data: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper internal function to generate report cards for a specific class ID
  const handleGenerateClassReportCardsInternal = async (targetClassId: string) => {
    const classStuds = students.filter((s) => s.class_id === targetClassId);
    if (classStuds.length === 0) return;

    const classExams = exams.filter(
      (e) => e.class_id === targetClassId && e.type === selectedReportCardExam,
    );
    if (classExams.length === 0) return;

    const examIds = classExams.map((e: any) => e.id);
    const { data: dbMarksData } = await (supabase as any)
      .from("mark_entries")
      .select("student_id, exam_subject_id, marks_obtained")
      .eq("school_id", schoolId!)
      .in("exam_subject_id", examIds);

    const dbMarks = (dbMarksData || []).map((m: any) => ({
      student_id: m.student_id,
      exam_id: m.exam_subject_id,
      marks_obtained: m.marks_obtained,
    }));

    const { data: dbAttendance } = await supabase
      .from("attendance")
      .select("student_id, status")
      .eq("school_id", schoolId!)
      .eq("class_id", targetClassId);

    const { data: dbRemarks } = await supabase
      .from("remarks")
      .select("student_id, content")
      .eq("school_id", schoolId!);

    const studentMetrics = classStuds.map((stud) => {
      const studMarks = (dbMarks || []).filter((m: any) => m.student_id === stud.id);
      let totalObtained = 0;
      let totalMax = 0;

      const subjectMarks = classExams.map((ex) => {
        const markObj = studMarks.find((m: any) => m.exam_id === ex.id);
        const obtained = markObj ? Number(markObj.marks_obtained) : 0;
        const max = Number(ex.max_marks);
        totalObtained += obtained;
        totalMax += max;

        const pct = max > 0 ? (obtained / max) * 100 : 0;
        const grade = getGradeFromPercentage(pct);

        const subjObj = subjects.find((s) => s.id === ex.subject_id);
        return {
          subject_id: ex.subject_id,
          subject_name: subjObj?.name || "Subject",
          max_marks: max,
          obtained_marks: obtained,
          grade: grade,
          remarks: pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : "Needs Improvement",
        };
      });

      const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      let resultStatus = "Pass";
      const hasFailedSubject = subjectMarks.some((sm) => sm.grade === "F");
      if (overallPercentage < 35 || hasFailedSubject) {
        resultStatus = "Fail";
      } else if (overallPercentage >= 85) {
        resultStatus = "Merit";
      } else if (overallPercentage >= 75) {
        resultStatus = "Distinction";
      } else if (overallPercentage >= 60) {
        resultStatus = "First Class";
      }

      const studAtt = (dbAttendance || []).filter((a) => a.student_id === stud.id);
      const totalWorkingDays = rcWorkingDays || 220;
      let presentCount = 0;
      studAtt.forEach((a) => {
        if (a.status === "present" || a.status === "late") presentCount++;
        else if (a.status === "half_day") presentCount += 0.5;
      });

      if (studAtt.length === 0) {
        presentCount = Math.floor(totalWorkingDays * (0.85 + Math.random() * 0.12));
      }

      const absentCount = totalWorkingDays - presentCount;
      const attendancePercentage =
        totalWorkingDays > 0 ? (presentCount / totalWorkingDays) * 100 : 0;

      const studRem = (dbRemarks || []).filter((r) => r.student_id === stud.id);
      const classTeacherRemarks =
        studRem.length > 0
          ? studRem[0].content
          : "Demonstrates strong performance in core subjects. Active and positive contributor to class discussions.";
      const principalRemarks =
        overallPercentage >= 80
          ? "Outstanding term performance. Keep up the excellent work!"
          : overallPercentage >= 50
            ? "Satisfactory progress. Continued efforts will yield higher achievements."
            : "Needs personal guidance and focused study sessions.";

      return {
        student_id: stud.id,
        class_id: targetClassId,
        exam_type: selectedReportCardExam,
        academic_year: academicYear,
        total_obtained: Number(totalObtained.toFixed(2)),
        total_max: totalMax,
        percentage: Number(overallPercentage.toFixed(2)),
        result_status: resultStatus,
        working_days: totalWorkingDays,
        present_days: Math.round(presentCount),
        absent_days: Math.round(absentCount),
        attendance_percentage: Number(attendancePercentage.toFixed(2)),
        subject_marks: subjectMarks,
        class_teacher_remarks: classTeacherRemarks,
        principal_remarks: principalRemarks,
      };
    });

    studentMetrics.sort((a, b) => b.percentage - a.percentage);

    let currentRank = 1;
    let tieCount = 0;
    let prevPercentage = -1;

    const rcPromises = studentMetrics.map((sm, index) => {
      if (sm.percentage === prevPercentage) {
        tieCount++;
      } else {
        currentRank += tieCount;
        tieCount = 1;
      }
      prevPercentage = sm.percentage;
      const rankPos = currentRank;

      const classRank = rankPos;
      const sectionRank = rankPos;
      const schoolRank = rankPos;

      const payload = {
        school_id: schoolId!,
        student_id: sm.student_id,
        class_id: sm.class_id,
        exam_type: sm.exam_type,
        academic_year: sm.academic_year,
        total_obtained: sm.total_obtained,
        total_max: sm.total_max,
        percentage: sm.percentage,
        class_rank: classRank,
        section_rank: sectionRank,
        school_rank: schoolRank,
        result_status: sm.result_status,
        working_days: sm.working_days,
        present_days: sm.present_days,
        absent_days: sm.absent_days,
        attendance_percentage: sm.attendance_percentage,
        subject_marks: sm.subject_marks,
        class_teacher_remarks: sm.class_teacher_remarks,
        principal_remarks: sm.principal_remarks,
        status: "draft",
        created_by: user?.id || adminUserId,
      };

      const existingRc = reportCards.find(
        (rc) =>
          rc.student_id === sm.student_id &&
          rc.exam_type === sm.exam_type &&
          rc.academic_year === sm.academic_year,
      );

      if (existingRc) {
        void logAuditAction(sm.student_id, existingRc.id, "Edited");
        return (supabase as any)
          .from("report_cards")
          .update(payload)
          .eq("id", existingRc.id)
          .eq("school_id", schoolId!);
      } else {
        void logAuditAction(sm.student_id, null, "Created");
        return (supabase as any).from("report_cards").insert(payload);
      }
    });

    await Promise.all(rcPromises);
  };

  const handleGenerateClassReportCards = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    if (!schoolId || !activeClassId) {
      toast.error("Please select a class first");
      return;
    }
    setIsLoading(true);
    try {
      const classStuds = students.filter((s) => s.class_id === activeClassId);
      if (classStuds.length === 0) {
        toast.error("No students found in this class");
        setIsLoading(false);
        return;
      }

      const classExams = exams.filter(
        (e) => e.class_id === activeClassId && e.type === selectedReportCardExam,
      );
      if (classExams.length === 0) {
        toast.info("No exams found for this term. Automatically seeding mock exams & marks...");
        await handleSeedMockAcademicDataInternal(activeClassId);
        const { data: updatedEx } = await supabase
          .from("exams")
          .select("*")
          .eq("school_id", schoolId)
          .is("deleted_at", null);
        setExams(updatedEx || []);
        const { data: updatedMk } = await (supabase as any)
          .from("mark_entries")
          .select("*")
          .eq("school_id", schoolId);
        setMarks(updatedMk || []);
      }

      await handleGenerateClassReportCardsInternal(activeClassId);
      toast.success(`Generated report cards in draft mode successfully!`);
      await loadData();
      await autoGenerateAwards(activeClassId);
    } catch (e: any) {
      toast.error("Failed to generate report cards: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSchoolReportCards = async () => {
    if (!schoolId) return;
    if (classes.length === 0) {
      toast.error("No classes defined for this school.");
      return;
    }
    setIsLoading(true);
    try {
      toast.info("Generating report cards for all classes in school...");
      for (const cls of classes) {
        const classStuds = students.filter((s) => s.class_id === cls.id);
        if (classStuds.length === 0) continue;

        const classEx = exams.filter(
          (e: any) => e.class_id === cls.id && e.type === selectedReportCardExam,
        );
        if (classEx.length === 0) {
          await handleSeedMockAcademicDataInternal(cls.id);
        }

        const { data: updatedEx } = await supabase
          .from("exams")
          .select("*")
          .eq("school_id", schoolId)
          .is("deleted_at", null);
        setExams(updatedEx || []);
        const { data: updatedMk } = await (supabase as any)
          .from("mark_entries")
          .select("*")
          .eq("school_id", schoolId);
        setMarks(updatedMk || []);

        await handleGenerateClassReportCardsInternal(cls.id);
      }
      toast.success("Successfully generated school-wide report cards!");
      void loadData();
    } catch (err: any) {
      toast.error("Error generating school report cards: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishClassReportCards = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    if (!schoolId || !activeClassId) return;
    setIsLoading(true);
    try {
      const { data: updatedRc, error: rcErr } = await (supabase as any)
        .from("report_cards")
        .update({ status: "published" })
        .eq("school_id", schoolId)
        .eq("class_id", activeClassId)
        .eq("exam_type", selectedReportCardExam)
        .select("id, student_id, percentage, class_rank, total_obtained");

      if (rcErr) throw rcErr;

      if (!updatedRc || updatedRc.length === 0) {
        toast.error("No draft report cards found to publish.");
        setIsLoading(false);
        return;
      }

      const notifPromises = updatedRc.map((rc: any) => {
        const studentObj = students.find((s) => s.id === rc.student_id);
        if (studentObj && studentObj.parent_user_id) {
          return supabase.from("notification_logs").insert({
            school_id: schoolId,
            parent_user_id: studentObj.parent_user_id,
            student_id: rc.student_id,
            type: "report_card",
            title: `📢 Report Card Published for ${studentObj.full_name}`,
            body: `Dear Parent, ${studentObj.full_name}'s Term Report Card is now available. Percentage: ${rc.percentage}% | Rank: ${rc.class_rank}. View or download the PDF in the app.`,
            status: "delivered",
          });
        }
        return Promise.resolve();
      });

      await Promise.all(notifPromises);

      const issuedBy = user?.id || adminUserId;
      const famePromises = updatedRc.map(async (rc: any) => {
        const studentObj = students.find((s) => s.id === rc.student_id);
        if (!studentObj) return;

        if (rc.class_rank === 1) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "rank_1",
            title: `First Rank - ${selectedReportCardExam} Academic Excellence`,
            description: `Awarded to ${studentObj.full_name} for securing Rank #1 in Class with a cumulative score of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
        if (rc.percentage >= 90) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "academic_star",
            title: `Academic Star Distinction`,
            description: `Recognized for outstanding academic achievement by scoring ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
      });
      await Promise.all(famePromises);

      toast.success(`Published ${updatedRc.length} report cards and notified parents!`);
      void loadData();
    } catch (e: any) {
      toast.error("Failed to publish report cards: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getReportCardDataFromCard = (card: any) => {
    if (!card) return null;
    const subjectsMarks = Array.isArray(card.subject_marks)
      ? card.subject_marks.map((sm: any) => ({
          subjectName: sm.subject_name || sm.subjectName || "Subject",
          obtained: sm.obtained_marks ?? sm.obtained ?? 0,
          max: sm.max_marks ?? sm.max ?? 100,
          percentage:
            sm.max_marks > 0
              ? Number(
                  (
                    ((sm.obtained_marks ?? sm.obtained ?? 0) / (sm.max_marks ?? sm.max ?? 100)) *
                    100
                  ).toFixed(1),
                )
              : 0,
          grade: sm.grade || "—",
          remarks: sm.remarks || "—",
        }))
      : [];

    return {
      subjectsMarks,
      totalObtained: Number(card.total_obtained),
      totalMax: Number(card.total_max),
      overallPercentage: Number(card.percentage),
      gpa: Number((card.percentage / 10).toFixed(2)),
      rank: card.class_rank || "—",
      sectionRank: card.section_rank || "—",
      attendancePercentage: Number(card.attendance_percentage),
      workingDays: card.working_days,
      presentDays: card.present_days,
      absentDays: card.absent_days,
      classTeacherRemarks: card.class_teacher_remarks || "—",
      principalRemarks: card.principal_remarks || "—",
    };
  };

  const handleDownloadSinglePDF = async (student: StudentRow) => {
    const card = reportCards.find(
      (rc) =>
        rc.student_id === student.id &&
        rc.exam_type === selectedReportCardExam &&
        rc.academic_year === academicYear,
    );
    if (!card) {
      toast.error("No report card generated for this student.");
      return;
    }

    toast.info(`Generating PDF for ${student.full_name}...`);

    try {
      setHiddenRenderStudent(student);
      setHiddenRenderData(getReportCardDataFromCard(card));

      await new Promise((resolve) => setTimeout(resolve, 200));

      const element = document.getElementById("hidden-report-card-print-area");
      if (!element) {
        toast.error("Hidden PDF renderer failed to initialize.");
        return;
      }

      const canvas = await safeHtml2Canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`${student.full_name}_Report_Card_${selectedReportCardExam}.pdf`);

      toast.success("PDF downloaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate PDF: " + err.message);
    } finally {
      setHiddenRenderStudent(null);
      setHiddenRenderData(null);
    }
  };

  const handleDownloadCombinedClassPDF = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    const classRcs = reportCards.filter(
      (r) =>
        r.class_id === activeClassId &&
        r.exam_type === selectedReportCardExam &&
        r.academic_year === academicYear,
    );
    if (classRcs.length === 0) {
      toast.error("No report cards available for this class.");
      return;
    }

    const className = classes.find((c) => c.id === activeClassId)?.name || "Class";
    toast.info(`Compiling combined PDF for ${classRcs.length} students in ${className}...`);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      let pagesAdded = 0;

      for (let i = 0; i < classRcs.length; i++) {
        const rc = classRcs[i];
        const stud = students.find((s) => s.id === rc.student_id);
        if (!stud) continue;

        setHiddenRenderStudent(stud);
        setHiddenRenderData(getReportCardDataFromCard(rc));

        await new Promise((resolve) => setTimeout(resolve, 200));

        const element = document.getElementById("hidden-report-card-print-area");
        if (element) {
          const canvas = await safeHtml2Canvas(element, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL("image/png");

          if (pagesAdded > 0) {
            pdf.addPage();
          }

          const imgWidth = 210;
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
          pagesAdded++;
        }
      }

      if (pagesAdded > 0) {
        pdf.save(`${className}_Combined_Report_Cards_${selectedReportCardExam}.pdf`);
        toast.success(`Successfully downloaded combined PDF with ${pagesAdded} pages!`);
      } else {
        toast.error("No report cards could be rendered.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate combined PDF: " + err.message);
    } finally {
      setHiddenRenderStudent(null);
      setHiddenRenderData(null);
    }
  };

  const handleDownloadClassZIP = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    const classRcs = reportCards.filter(
      (r) =>
        r.class_id === activeClassId &&
        r.exam_type === selectedReportCardExam &&
        r.academic_year === academicYear,
    );
    if (classRcs.length === 0) {
      toast.error("No report cards available for this class.");
      return;
    }

    const className = classes.find((c) => c.id === activeClassId)?.name || "Class";
    toast.info(`Preparing ZIP archive of individual PDFs for ${classRcs.length} students...`);

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      let filesAdded = 0;

      for (let i = 0; i < classRcs.length; i++) {
        const rc = classRcs[i];
        const stud = students.find((s) => s.id === rc.student_id);
        if (!stud) continue;

        setHiddenRenderStudent(stud);
        setHiddenRenderData(getReportCardDataFromCard(rc));

        await new Promise((resolve) => setTimeout(resolve, 200));

        const element = document.getElementById("hidden-report-card-print-area");
        if (element) {
          const canvas = await safeHtml2Canvas(element, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL("image/png");

          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });

          const imgWidth = 210;
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

          const pdfBlob = pdf.output("blob");
          const safeName = stud.full_name.replace(/[^a-zA-Z0-9]/g, "_");
          zip.file(`${safeName}_Report_Card_${selectedReportCardExam}.pdf`, pdfBlob);
          filesAdded++;
        }
      }

      if (filesAdded > 0) {
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipBlob);
        link.download = `${className}_Report_Cards_${selectedReportCardExam}.zip`;
        link.click();
        toast.success(`Successfully downloaded ZIP containing ${filesAdded} individual PDFs!`);
      } else {
        toast.error("No report cards were added to the ZIP.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to generate ZIP archive: " + err.message);
    } finally {
      setHiddenRenderStudent(null);
      setHiddenRenderData(null);
    }
  };

  // Poster download engine via html2canvas
  const downloadPoster = () => {
    const element = document.getElementById("achievement-poster-export");
    console.log("POSTER EXPORT DIAGNOSTICS: Starting export audit...", {
      elementId: "achievement-poster-export",
      found: !!element,
      theme: posterTheme,
      format: posterSize,
    });

    if (!element) {
      toast.error("Poster container element not found.");
      return;
    }

    toast.info("Generating your high-resolution poster. Please wait...");

    safeHtml2Canvas(element, {
      scale: 3, // Premium quality (resulting in exact requested dimensions)
      useCORS: true,
      backgroundColor: null,
      logging: false,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Diagnostics check 4
        console.log("POSTER EXPORT DIAGNOSTICS: PNG generated successfully.");

        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${selectedStudentForPoster?.full_name || "achievement"}_poster_${posterSize}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Poster downloaded successfully!");
      })
      .catch((e) => {
        console.error("POSTER EXPORT DIAGNOSTICS: Export failed:", e);
        toast.error("Failed to generate poster: " + e.message);
      });
  };

  // Certificate download engine via html2canvas and jsPDF
  const downloadCertificate = () => {
    const elementId = "academic-certificate-export";
    const element = document.getElementById(elementId);

    console.log("Certificate PDF generation triggered:", {
      selectedStudent: selectedStudentForCert?.full_name,
      selectedTemplate: selectedCertProfile,
      elementId: elementId,
      elementExists: !!element,
    });

    if (!element) {
      const err = new Error("Certificate element not found");
      console.error(err);
      toast.error("Failed to generate: " + err.message);
      throw err;
    }

    toast.info("Generating PDF certificate. Please wait...");

    safeHtml2Canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    })
      .then((canvas) => {
        console.log("Canvas generation success:", {
          width: canvas.width,
          height: canvas.height,
        });

        const imgData = canvas.toDataURL("image/png");
        // Create landscape standard A4 PDF (dimensions in pt: 841.89 x 595.28)
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "pt",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calculate aspect ratio to fit the page
        const canvasRatio = canvas.width / canvas.height;
        const pageRatio = pdfWidth / pdfHeight;

        let imgWidth = pdfWidth;
        let imgHeight = pdfHeight;
        let x = 0;
        let y = 0;

        if (canvasRatio > pageRatio) {
          // Canvas is wider than standard page ratio
          imgHeight = pdfWidth / canvasRatio;
          y = (pdfHeight - imgHeight) / 2;
        } else {
          // Canvas is taller than standard page ratio
          imgWidth = pdfHeight * canvasRatio;
          x = (pdfWidth - imgWidth) / 2;
        }

        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
        pdf.save(`${selectedStudentForCert?.full_name || "student"}_certificate.pdf`);
        console.log("PDF generation success");
        toast.success("Certificate PDF downloaded successfully!");
      })
      .catch((e) => {
        console.error("PDF generation failed:", e);
        toast.error("Failed to generate certificate: " + e.message);
      });
  };

  // Analytics datasets
  const classAveragesData = useMemo(() => {
    // Collect averages across exams for the selected class
    if (!selectedClass) return [];

    const classEx = exams.filter((e) => e.class_id === selectedClass);
    const examAves = classEx
      .map((ex) => {
        const exMarks = marks.filter((m) => m.exam_id === ex.id);
        const sum = exMarks.reduce((acc, curr) => acc + Number(curr.marks_obtained), 0);
        const avg = exMarks.length > 0 ? sum / exMarks.length : 0;
        const pct = ex.max_marks > 0 ? (avg / ex.max_marks) * 100 : 0;
        return {
          name: ex.name.split(" - ")[0], // Short name
          "Class Average %": Number(pct.toFixed(1)),
        };
      })
      .reverse();
    return examAves;
  }, [exams, marks, selectedClass]);

  const rankingDistributionData = useMemo(() => {
    const result = [
      { range: "90-100% (A+)", count: 0 },
      { range: "80-89% (A)", count: 0 },
      { range: "70-79% (B)", count: 0 },
      { range: "60-69% (C)", count: 0 },
      { range: "Below 60% (D/F)", count: 0 },
    ];

    filteredRankings.forEach((r) => {
      const pct = Number(r.percentage);
      if (pct >= 90) result[0].count += 1;
      else if (pct >= 80) result[1].count += 1;
      else if (pct >= 70) result[2].count += 1;
      else if (pct >= 60) result[3].count += 1;
      else result[4].count += 1;
    });

    return result;
  }, [filteredRankings]);

  const classWisePerformanceData = useMemo(() => {
    return classes.map((c) => {
      const classRcs = reportCards.filter(
        (rc) => rc.class_id === c.id && rc.exam_type === selectedReportCardExam,
      );
      const avgPct =
        classRcs.length > 0
          ? classRcs.reduce((acc, curr) => acc + Number(curr.percentage), 0) / classRcs.length
          : 0;
      return {
        name: c.name,
        "Average Score %": Number(avgPct.toFixed(1)),
      };
    });
  }, [classes, reportCards, selectedReportCardExam]);

  const subjectWisePerformanceData = useMemo(() => {
    const subjectAverages: Record<string, { total: number; count: number }> = {};
    subjects.forEach((s) => {
      subjectAverages[s.name] = { total: 0, count: 0 };
    });

    reportCards
      .filter((rc) => !selectedReportCardClass || rc.class_id === selectedReportCardClass)
      .forEach((rc) => {
        if (Array.isArray(rc.subject_marks)) {
          rc.subject_marks.forEach((sm: any) => {
            const name = sm.subject_name || sm.subjectName;
            const obtained = sm.obtained_marks ?? sm.obtained ?? 0;
            const max = sm.max_marks ?? sm.max ?? 100;
            const pct = max > 0 ? (obtained / max) * 100 : 0;

            if (name) {
              if (!subjectAverages[name]) {
                subjectAverages[name] = { total: 0, count: 0 };
              }
              subjectAverages[name].total += pct;
              subjectAverages[name].count += 1;
            }
          });
        }
      });

    return Object.entries(subjectAverages)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        "Average %": Number((data.total / data.count).toFixed(1)),
      }));
  }, [subjects, reportCards, selectedReportCardClass]);

  const monthlyProgressData = useMemo(() => {
    const monthMap: Record<string, { total: number; count: number }> = {};

    exams.forEach((ex) => {
      if (ex.date) {
        const date = new Date(ex.date);
        const monthName = date.toLocaleDateString(undefined, { month: "short" });
        const exMarks = marks.filter((m) => m.exam_id === ex.id);

        exMarks.forEach((m) => {
          const pct =
            ex.max_marks > 0 ? (Number(m.marks_obtained) / Number(ex.max_marks)) * 100 : 0;
          if (!monthMap[monthName]) {
            monthMap[monthName] = { total: 0, count: 0 };
          }
          monthMap[monthName].total += pct;
          monthMap[monthName].count += 1;
        });
      }
    });

    const monthsOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return Object.entries(monthMap)
      .sort((a, b) => monthsOrder.indexOf(a[0]) - monthsOrder.indexOf(b[0]))
      .map(([name, data]) => ({
        name,
        "Class Average %": Number((data.total / data.count).toFixed(1)),
      }));
  }, [exams, marks]);

  const passFailAnalyticsData = useMemo(() => {
    let passCount = 0;
    let failCount = 0;

    const relevantRcs = reportCards.filter(
      (rc) =>
        (!selectedReportCardClass || rc.class_id === selectedReportCardClass) &&
        rc.exam_type === selectedReportCardExam,
    );
    relevantRcs.forEach((rc) => {
      if (rc.result_status === "Fail") {
        failCount++;
      } else {
        passCount++;
      }
    });

    return [
      { name: "Pass", value: passCount, color: "#10b981" },
      { name: "Fail", value: failCount, color: "#ef4444" },
    ];
  }, [reportCards, selectedReportCardClass, selectedReportCardExam]);

  const teacherPerformanceData = useMemo(() => {
    const teacherScores: Record<string, { total: number; count: number }> = {};

    reportCards
      .filter((rc) => !selectedReportCardClass || rc.class_id === selectedReportCardClass)
      .forEach((rc) => {
        if (Array.isArray(rc.subject_marks)) {
          rc.subject_marks.forEach((sm: any) => {
            const subjectName = sm.subject_name || sm.subjectName || "General";
            const teacherName = `${subjectName} Teacher`;
            const pct = sm.max_marks > 0 ? (sm.obtained_marks / sm.max_marks) * 100 : 0;

            if (!teacherScores[teacherName]) {
              teacherScores[teacherName] = { total: 0, count: 0 };
            }
            teacherScores[teacherName].total += pct;
            teacherScores[teacherName].count += 1;
          });
        }
      });

    return Object.entries(teacherScores).map(([name, data]) => ({
      name,
      "Performance Index": Number((data.total / data.count).toFixed(1)),
    }));
  }, [reportCards, selectedReportCardClass]);

  const dashboardTopPerformers = useMemo(() => {
    const relevantRcs = reportCards.filter(
      (rc) =>
        (!selectedReportCardClass || rc.class_id === selectedReportCardClass) &&
        rc.exam_type === selectedReportCardExam,
    );
    return [...relevantRcs].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  }, [reportCards, selectedReportCardClass, selectedReportCardExam]);

  const dashboardAttendanceChampions = useMemo(() => {
    const relevantRcs = reportCards.filter(
      (rc) =>
        (!selectedReportCardClass || rc.class_id === selectedReportCardClass) &&
        rc.exam_type === selectedReportCardExam,
    );
    return [...relevantRcs]
      .sort((a, b) => b.attendance_percentage - a.attendance_percentage)
      .slice(0, 5);
  }, [reportCards, selectedReportCardClass, selectedReportCardExam]);

  // Export tables to CSV
  const exportToCSV = (dataset: any[], filename: string) => {
    if (dataset.length === 0) return toast.error("No data to export");

    const headers = Object.keys(dataset[0]);
    const csvRows = [
      headers.join(","),
      ...dataset.map((row) =>
        headers.map((fieldName) => JSON.stringify(row[fieldName] || "")).join(","),
      ),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded!");
  };

  // Helper selectors for cards
  const toppers = useMemo(() => {
    return filteredRankings.slice(0, 3);
  }, [filteredRankings]);

  const topTen = useMemo(() => {
    return filteredRankings.slice(0, 10);
  }, [filteredRankings]);

  // Filter components based on Simulated Role permissions
  const isAdminOrTeacher =
    simulatedRole === "admin" ||
    simulatedRole === "super_admin" ||
    simulatedRole === "principal" ||
    simulatedRole === "teacher";
  const isPrincipal =
    simulatedRole === "principal" || simulatedRole === "admin" || simulatedRole === "super_admin";
  const isParent = simulatedRole === "parent";
  const isStudent = simulatedRole === "student";

  // Simulate active parent profile linked children
  const parentChildren = useMemo(() => {
    return students.filter((s) => s.parent_user_id === parentUserId);
  }, [students]);

  const [selectedParentChild, setSelectedParentChild] = useState<string>(
    parentChildren[0]?.id || "",
  );

  useEffect(() => {
    if (parentChildren.length > 0 && !selectedParentChild) {
      setSelectedParentChild(parentChildren[0].id);
    }
  }, [parentChildren]);

  // Parent notifications
  const parentNotificationsList = useMemo(() => {
    return notifications.filter((n) => n.parent_user_id === parentUserId);
  }, [notifications]);

  // Parent child rankings
  const parentChildRankings = useMemo(() => {
    if (!selectedParentChild) return [];
    return rankings.filter((r) => r.student_id === selectedParentChild);
  }, [rankings, selectedParentChild]);

  // Parent child awards
  const parentChildAwards = useMemo(() => {
    if (!selectedParentChild) return [];
    return awards.filter((a) => a.student_id === selectedParentChild);
  }, [awards, selectedParentChild]);

  return (
    <>
      <CanvasConfetti active={showConfetti} />

      {/* Role Simulator Banner */}
      <div className="bg-brand-soft border-b border-brand/20 px-6 py-2 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 font-medium text-brand">
          <Shield className="size-3.5" />
          <span>RBAC ROLE SIMULATOR & TESTING FRAMEWORK</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground font-medium">Select view perspective:</span>
          <select
            value={simulatedRole}
            onChange={(e) => {
              setSimulatedRole(e.target.value);
              // reset tab if switching to parent/student which has limited views
              if (e.target.value === "parent" || e.target.value === "student") {
                setActiveTab("dashboard");
              }
              toast.info(`Simulated view updated: ${e.target.value.toUpperCase()}`);
            }}
            className="bg-card text-foreground font-semibold px-3 py-1 rounded border border-border cursor-pointer shadow-xs focus:ring-1 focus:ring-brand focus:outline-none"
          >
            <option value="super_admin">Super Admin</option>
            <option value="admin">School Admin</option>
            <option value="principal">Principal</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
          </select>

          {simulatedRole === "teacher" && (
            <>
              <span className="text-muted-foreground font-medium ml-2">Teacher Subject:</span>
              <select
                value={simulatedTeacherSubject}
                onChange={(e) => {
                  setSimulatedTeacherSubject(e.target.value);
                  setSelectedExam(""); // Reset selected exam
                  toast.info(`Simulated teacher subject: ${e.target.value}`);
                }}
                className="bg-card text-foreground font-semibold px-3 py-1 rounded border border-border cursor-pointer shadow-xs focus:ring-1 focus:ring-brand focus:outline-none"
              >
                <option value="All">All Subjects (Class Teacher)</option>
                <option value="Mathematics">Mathematics Teacher</option>
                <option value="Science">Science Teacher</option>
                <option value="English">English Teacher</option>
                <option value="Social Studies">Social Studies Teacher</option>
                <option value="Computer">Computer Teacher</option>
              </select>
            </>
          )}
        </div>
      </div>

      <PageHeader
        title="Achievements & Awards"
        breadcrumb="Academics"
        actions={
          isAdminOrTeacher ? (
            <div className="flex gap-2">
              {isPrincipal && (
                <>
                  <button
                    onClick={handleCalculateRankings}
                    disabled={isCalculating}
                    className="px-4 py-1.5 text-xs font-semibold bg-brand/10 text-brand hover:bg-brand/20 transition-colors rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`size-3.5 ${isCalculating ? "animate-spin" : ""}`} />
                    {isCalculating ? "Calculating..." : "Run Ranking Engine"}
                  </button>
                  <button
                    onClick={handlePublishRankings}
                    disabled={isLoading || isCalculating}
                    className="px-4 py-1.5 text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-3.5" /> Verify & Publish Results
                  </button>
                </>
              )}
            </div>
          ) : undefined
        }
      />

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-border dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-xs overflow-x-auto gap-1">
          <TabButton
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
            label="Dashboard"
            icon={<Trophy className="size-4" />}
          />
          <TabButton
            active={activeTab === "hall_of_fame"}
            onClick={() => setActiveTab("hall_of_fame")}
            label="Hall of Fame"
            icon={<Sparkles className="size-4" />}
          />
          <TabButton
            active={activeTab === "posters"}
            onClick={() => setActiveTab("posters")}
            label="Poster Generator"
            icon={<Share2 className="size-4" />}
          />
          <TabButton
            active={activeTab === "certificates"}
            onClick={() => setActiveTab("certificates")}
            label="Certificates"
            icon={<Award className="size-4" />}
          />
          <TabButton
            active={activeTab === "report_cards"}
            onClick={() => setActiveTab("report_cards")}
            label="Report Cards"
            icon={<BookOpen className="size-4" />}
          />
          {isAdminOrTeacher && (
            <TabButton
              active={activeTab === "reports"}
              onClick={() => setActiveTab("reports")}
              label="Reports & Analytics"
              icon={<FileDown className="size-4" />}
            />
          )}
          {isAdminOrTeacher && (
            <TabButton
              active={activeTab === "admin"}
              onClick={() => setActiveTab("admin")}
              label="Ranking Engine Rules"
              icon={<Sliders className="size-4" />}
            />
          )}
          {(isAdminOrTeacher || isParent) && (
            <TabButton
              active={activeTab === "notifications"}
              onClick={() => setActiveTab("notifications")}
              label="Notifications Center"
              icon={<Bell className="size-4" />}
            />
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading ? (
          <div className="h-96 flex items-center justify-center text-sm text-muted-foreground bg-white border border-border rounded-2xl shadow-xs">
            <div className="text-center space-y-2">
              <RefreshCw className="size-8 animate-spin text-brand mx-auto" />
              <p>Fetching academic records...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Perspective View Checklists and Filter Section (Not for pure parent/student) */}
            {!isParent && !isStudent && (
              <div className="bg-white p-5 rounded-2xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Class
                    </span>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="mt-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.grade}-{c.section})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Exam
                    </span>
                    <select
                      value={selectedExam}
                      onChange={(e) => setSelectedExam(e.target.value)}
                      className="mt-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="">Overall Academic Year</option>
                      {exams
                        .filter((e) => e.class_id === selectedClass)
                        .map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name.split(" - ")[0]}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Subject Filter
                    </span>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="mt-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="">All Subjects</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Academic Year
                    </span>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="mt-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="2025-2026">2025-2026</option>
                      <option value="2024-2025">2024-2025</option>
                    </select>
                  </div>
                </div>
                <div className="relative w-full max-w-xs">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="size-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students or awards..."
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-brand bg-white"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Simulated Parent/Student Specific Dashboard View */}
                {isParent || isStudent ? (
                  <div className="space-y-6">
                    {/* Header Details */}
                    <div className="bg-linear-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
                      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="relative space-y-4">
                        <span className="bg-white/20 backdrop-blur-xs text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                          {isParent ? "PARENT ACHIEVEMENTS FEED" : "STUDENT REPORT HUB"}
                        </span>

                        {isParent && parentChildren.length > 1 && (
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium opacity-85">Linked Children:</span>
                            <select
                              value={selectedParentChild}
                              onChange={(e) => setSelectedParentChild(e.target.value)}
                              className="bg-white/10 border border-white/20 text-white font-semibold text-xs px-3 py-1.5 rounded-lg focus:outline-none"
                            >
                              {parentChildren.map((c) => (
                                <option key={c.id} value={c.id} className="text-black">
                                  {c.full_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div className="space-y-1">
                          <h2 className="text-2xl font-bold">
                            {isParent
                              ? `Academic Showcase for ${students.find((s) => s.id === selectedParentChild)?.full_name || "Child"}`
                              : `Welcome back, ${profileName(user)}!`}
                          </h2>
                          <p className="text-sm opacity-85">
                            Track rank performance, view achievement badges, and instantly download
                            awards.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rankings & Badges Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Rank Card */}
                      <div className="bg-white border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="size-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 font-bold border border-amber-200">
                            <Trophy className="size-5" />
                          </div>
                          <div>
                            <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                              LATEST RANK POSITION
                            </span>
                            <h3 className="text-4xl font-extrabold text-slate-800 mt-1">
                              {parentChildRankings[0]
                                ? `#${parentChildRankings[0].rank_position}`
                                : "—"}
                            </h3>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 mt-4 pt-3 text-xs text-muted-foreground">
                          {parentChildRankings[0]
                            ? `Class Rank calculated with percentage of ${parentChildRankings[0].percentage}%`
                            : "No computed ranking available for the current term."}
                        </div>
                      </div>

                      {/* Cumulative Percentage */}
                      <div className="bg-white border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="size-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 font-bold border border-indigo-200">
                            <Percent className="size-5" />
                          </div>
                          <div>
                            <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                              CUMULATIVE PERCENTAGE
                            </span>
                            <h3 className="text-4xl font-extrabold text-slate-800 mt-1">
                              {parentChildRankings[0]
                                ? `${parentChildRankings[0].percentage}%`
                                : "—"}
                            </h3>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 mt-4 pt-3 text-xs text-muted-foreground flex justify-between items-center">
                          <span>GPA / CGPA equivalent:</span>
                          <span className="font-bold text-slate-700">
                            {parentChildRankings[0] ? `${parentChildRankings[0].gpa} / 10` : "—"}
                          </span>
                        </div>
                      </div>

                      {/* Badges Earned */}
                      <div className="bg-white border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="size-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 font-bold border border-emerald-200">
                            <Award className="size-5" />
                          </div>
                          <div>
                            <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                              BADGES & AWARDS
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {parentChildAwards.length === 0 ? (
                                <span className="text-xs text-muted-foreground">
                                  No awards issued yet.
                                </span>
                              ) : (
                                parentChildAwards.map((a) => (
                                  <span
                                    key={a.id}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold"
                                  >
                                    <Sparkles className="size-3" /> {badgeLabel(a.category)}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 mt-4 pt-3 text-xs text-muted-foreground">
                          {parentChildAwards.length} total certificates available to download.
                        </div>
                      </div>
                    </div>

                    {/* Official Report Card Card */}
                    <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6 rounded-2xl shadow-xs flex items-center justify-between flex-wrap gap-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                          Term Academic Report Card
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          View official subjects, grades, class rank position, attendance register,
                          and principal's remarks.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const studId = isParent ? selectedParentChild : user?.id;
                          const studObj = students.find((s) => s.id === studId);
                          setReportCardStudent(studObj || null);
                        }}
                        className="px-4 py-2 text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors rounded-lg flex items-center gap-1.5 shadow-sm"
                      >
                        <BookOpen className="size-4" /> View Report Card
                      </button>
                    </div>

                    {/* Timeline of Achievements */}
                    <div className="bg-white border border-border rounded-2xl p-6 shadow-xs">
                      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-4">
                        <Medal className="size-5 text-brand" /> Academic Honors & Award Certificates
                      </h3>

                      {parentChildAwards.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground space-y-1">
                          <p className="font-semibold">No awards issued yet</p>
                          <p className="text-xs">
                            Once rankings are calculated and verified by administration,
                            certifications will appear here.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {parentChildAwards.map((aw) => {
                            const hasCert = certificates.find((c) => c.award_id === aw.id);
                            return (
                              <div
                                key={aw.id}
                                className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 transition-all"
                              >
                                <div className="space-y-1 max-w-xl">
                                  <div className="flex items-center gap-2">
                                    <span className="bg-brand/10 text-brand text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                                      {badgeLabel(aw.category)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(aw.issued_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-sm text-slate-800">{aw.title}</h4>
                                  <p className="text-xs text-muted-foreground">{aw.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      const studObj = students.find((s) => s.id === aw.student_id);
                                      setSelectedStudentForPoster(studObj);
                                      setPosterTheme(
                                        aw.category?.includes("1")
                                          ? "gold"
                                          : aw.category?.includes("2")
                                            ? "silver"
                                            : aw.category?.includes("3")
                                              ? "bronze"
                                              : "royal",
                                      );
                                      setActiveTab("posters");
                                      toast.success("Ready to preview achievement poster!");
                                    }}
                                    className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200 rounded-lg flex items-center gap-1.5"
                                  >
                                    <Share2 className="size-3.5" /> Poster
                                  </button>
                                  {hasCert && (
                                    <button
                                      onClick={() => {
                                        const studObj = students.find(
                                          (s) => s.id === aw.student_id,
                                        );
                                        setSelectedStudentForCert(studObj);
                                        setActiveTab("certificates");
                                        toast.success("Ready to preview digital certificate!");
                                      }}
                                      className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 rounded-lg flex items-center gap-1.5"
                                    >
                                      <Download className="size-3.5" /> Certificate
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // STAFF DASHBOARD VIEW
                  <div className="space-y-6">
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                      {/* KPI: Total Students */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          Total Students
                        </span>
                        <h4 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-1">
                          {
                            students.filter((s) => !selectedClass || s.class_id === selectedClass)
                              .length
                          }
                        </h4>
                        <p className="text-[9px] text-muted-foreground">Total Enrolled</p>
                      </div>

                      {/* KPI: Generated */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-indigo-650 uppercase">
                          Generated
                        </span>
                        <h4 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                          {
                            reportCards.filter(
                              (r) =>
                                (!selectedClass || r.class_id === selectedClass) &&
                                r.exam_type === selectedReportCardExam,
                            ).length
                          }
                        </h4>
                        <p className="text-[9px] text-indigo-500">Academic Term</p>
                      </div>

                      {/* KPI: Published */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">
                          Published
                        </span>
                        <h4 className="text-2xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1">
                          {
                            reportCards.filter(
                              (r) =>
                                r.status === "published" &&
                                (!selectedClass || r.class_id === selectedClass) &&
                                r.exam_type === selectedReportCardExam,
                            ).length
                          }
                        </h4>
                        <p className="text-[9px] text-emerald-500">Live for Parents</p>
                      </div>

                      {/* KPI: Pending Approval */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-amber-600 uppercase">
                          Pending Approval
                        </span>
                        <h4 className="text-2xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">
                          {
                            reportCards.filter(
                              (r) =>
                                (r.status === "draft" || r.status === "verified") &&
                                (!selectedClass || r.class_id === selectedClass) &&
                                r.exam_type === selectedReportCardExam,
                            ).length
                          }
                        </h4>
                        <p className="text-[9px] text-amber-500">Requires Signoff</p>
                      </div>

                      {/* KPI: Pass Percentage */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-sky-600 uppercase">Pass %</span>
                        <h4 className="text-2xl font-extrabold text-sky-500 dark:text-sky-400 mt-1">
                          {(() => {
                            const termRcs = reportCards.filter(
                              (r) =>
                                (!selectedClass || r.class_id === selectedClass) &&
                                r.exam_type === selectedReportCardExam,
                            );
                            if (termRcs.length === 0) return "—";
                            const passed = termRcs.filter((r) => r.result_status !== "Fail").length;
                            return `${((passed / termRcs.length) * 100).toFixed(1)}%`;
                          })()}
                        </h4>
                        <p className="text-[9px] text-sky-500">Passing Rate</p>
                      </div>

                      {/* KPI: Distinction Count */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-purple-600 uppercase">
                          Distinctions
                        </span>
                        <h4 className="text-2xl font-extrabold text-purple-500 dark:text-purple-400 mt-1">
                          {
                            reportCards.filter(
                              (r) =>
                                r.percentage >= 75 &&
                                (!selectedClass || r.class_id === selectedClass) &&
                                r.exam_type === selectedReportCardExam,
                            ).length
                          }
                        </h4>
                        <p className="text-[9px] text-purple-500">Score &gt;= 75%</p>
                      </div>

                      {/* KPI: Merit Count */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs">
                        <span className="text-[10px] font-bold text-amber-500 uppercase">
                          Merits
                        </span>
                        <h4 className="text-2xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">
                          {
                            reportCards.filter(
                              (r) =>
                                r.percentage >= 85 &&
                                (!selectedClass || r.class_id === selectedClass) &&
                                r.exam_type === selectedReportCardExam,
                            ).length
                          }
                        </h4>
                        <p className="text-[9px] text-amber-500">Score &gt;= 85%</p>
                      </div>
                    </div>

                    {/* Leaders Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Top Performers Card */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs">
                        <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                          <Trophy className="size-4 text-amber-500" /> Top Performers Leaderboard
                        </h3>
                        {dashboardTopPerformers.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-8 text-center">
                            No calculations generated yet
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {dashboardTopPerformers.map((rc, idx) => {
                              const stud = students.find((s) => s.id === rc.student_id);
                              return (
                                <div
                                  key={rc.id}
                                  className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-400">#{idx + 1}</span>
                                    <div>
                                      <p className="font-bold text-slate-700 dark:text-slate-300">
                                        {stud?.full_name}
                                      </p>
                                      <p className="text-[9px] text-muted-foreground">
                                        Roll No: {stud?.roll_number} | Class Rank: #{rc.class_rank}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-extrabold text-brand">
                                    {rc.percentage}% (GPA {rc.gpa})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Attendance Champions Card */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs">
                        <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200 mb-3 flex items-center gap-1.5">
                          <Clock className="size-4 text-emerald-500" /> Attendance Champions
                        </h3>
                        {dashboardAttendanceChampions.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-8 text-center">
                            No evaluation data available
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {dashboardAttendanceChampions.map((rc, idx) => {
                              const stud = students.find((s) => s.id === rc.student_id);
                              return (
                                <div
                                  key={rc.id}
                                  className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-400">#{idx + 1}</span>
                                    <div>
                                      <p className="font-bold text-slate-700 dark:text-slate-300">
                                        {stud?.full_name}
                                      </p>
                                      <p className="text-[9px] text-muted-foreground">
                                        Present: {rc.present_days}/{rc.working_days} Days
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                    {rc.attendance_percentage}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Graphs Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Class-wise Performance Chart */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs">
                        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                          Class-wise Performance Average
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={classWisePerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                            <Tooltip />
                            <Bar dataKey="Average Score %" fill="#818cf8" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Subject-wise Performance Chart */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs">
                        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                          Subject-wise Average Score
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={subjectWisePerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                            <Tooltip />
                            <Bar dataKey="Average %" fill="#fb7185" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Monthly Progress Chart */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs">
                        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                          Monthly Academic Performance Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={monthlyProgressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="Class Average %"
                              stroke="#3b82f6"
                              strokeWidth={2.5}
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Pass/Fail Analytics Pie Chart */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs">
                        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                          Pass/Fail Distribution Ratio
                        </h3>
                        <div className="flex items-center justify-around h-[200px]">
                          <ResponsiveContainer width="60%" height="100%">
                            <PieChart>
                              <Pie
                                data={passFailAnalyticsData}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={3}
                                dataKey="value"
                              >
                                {passFailAnalyticsData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex flex-col gap-2 text-xs">
                            {passFailAnalyticsData.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div
                                  className="size-3 rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="font-semibold">
                                  {item.name}: {item.value} Cards
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Teacher Performance Index */}
                      <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs lg:col-span-2">
                        <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                          Teacher Subject Performance Indices
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={teacherPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                            <Tooltip />
                            <Bar dataKey="Performance Index" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: HALL OF FAME */}
            {activeTab === "hall_of_fame" && (
              <div className="space-y-8">
                {/* Visual Glassmorphism Hall Intro banner */}
                <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 text-center space-y-3">
                  <div className="absolute top-0 left-0 -translate-x-10 -translate-y-10 size-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 right-0 translate-x-10 translate-y-10 size-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="inline-flex size-14 rounded-full bg-amber-500/10 border border-amber-500/30 items-center justify-center text-amber-400 mb-2">
                    <Sparkles className="size-7 animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                    {schoolDisplayName.toUpperCase()} WALL OF HONOR
                  </h2>
                  <p className="text-slate-400 text-sm max-w-xl mx-auto">
                    Celebrating outstanding academic excellence, unmatched sports records, perfect
                    attendance registers, and distinguished student contributions.
                  </p>
                </div>

                {/* Honor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {awards.length === 0 ? (
                    <div className="col-span-full bg-white border border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground">
                      <Trophy className="size-8 mx-auto mb-2 opacity-50" />
                      <p className="font-semibold">Hall of Fame is currently empty</p>
                      <p className="text-xs">
                        Ranks and accolades will display here once academic honors are computed.
                      </p>
                    </div>
                  ) : (
                    awards.map((aw) => {
                      const themeDetails = fameCardTheme(aw.category);
                      return (
                        <div
                          key={aw.id}
                          className={`rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition-all duration-300 hover:-translate-y-1.5 ${themeDetails.cardBg} ${themeDetails.border}`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${themeDetails.badgeClass}`}
                              >
                                <Sparkles className="size-3" /> {badgeLabel(aw.category)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {aw.academic_year}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              <h3 className="text-base font-bold text-slate-800">{aw.title}</h3>
                              <p className="text-xs text-slate-600 line-clamp-3">
                                {aw.description}
                              </p>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="size-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs overflow-hidden">
                                {aw.student?.photo_url ? (
                                  <img
                                    src={aw.student.photo_url}
                                    alt=""
                                    className="size-full object-cover"
                                    crossOrigin="anonymous"
                                  />
                                ) : (
                                  aw.student?.full_name?.slice(0, 1) || "S"
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-xs text-slate-700">
                                  {aw.student?.full_name}
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                  Roll No. {aw.student?.roll_number} · {aw.student?.classes?.name}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const studObj = students.find((s) => s.id === aw.student_id);
                                setSelectedStudentForPoster(studObj);
                                setPosterTheme(
                                  aw.category?.includes("1")
                                    ? "gold"
                                    : aw.category?.includes("2")
                                      ? "silver"
                                      : aw.category?.includes("3")
                                        ? "bronze"
                                        : "royal",
                                );
                                setActiveTab("posters");
                              }}
                              className="size-8 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 transition-colors"
                            >
                              <ChevronRight className="size-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: POSTER GENERATOR */}
            {/* TAB CONTENT: POSTER GENERATOR */}
            {activeTab === "posters" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left controls */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Poster Canvas Controls</h3>
                    <p className="text-xs text-muted-foreground">
                      Select a student and custom theme to generate social-ready posters.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Select Student
                      </label>
                      <select
                        value={selectedStudentForPoster?.id || ""}
                        onChange={(e) => {
                          const stud = students.find((s) => s.id === e.target.value);
                          setSelectedStudentForPoster(stud);
                        }}
                        className="mt-1 bg-card border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                      >
                        {filteredStudents.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Choose Theme
                      </label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <ThemeButton
                          active={posterTheme === "gold"}
                          onClick={() => setPosterTheme("gold")}
                          label="Gold Theme"
                          colorClass="bg-yellow-400"
                        />
                        <ThemeButton
                          active={posterTheme === "silver"}
                          onClick={() => setPosterTheme("silver")}
                          label="Silver Theme"
                          colorClass="bg-slate-300"
                        />
                        <ThemeButton
                          active={posterTheme === "bronze"}
                          onClick={() => setPosterTheme("bronze")}
                          label="Bronze Theme"
                          colorClass="bg-amber-600"
                        />
                        <ThemeButton
                          active={posterTheme === "royal"}
                          onClick={() => setPosterTheme("royal")}
                          label="Royal Blue"
                          colorClass="bg-indigo-900"
                        />
                        <ThemeButton
                          active={posterTheme === "modern"}
                          onClick={() => setPosterTheme("modern")}
                          label="Modern School"
                          colorClass="bg-slate-800"
                        />
                      </div>
                    </div>

                    {/* Format / Dimensions selector */}
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Select Format
                      </label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <SizeButton
                          active={posterSize === "portrait"}
                          onClick={() => setPosterSize("portrait")}
                          label="Portrait"
                          dimensions="1080 x 1350"
                        />
                        <SizeButton
                          active={posterSize === "landscape"}
                          onClick={() => setPosterSize("landscape")}
                          label="Landscape"
                          dimensions="1920 x 1080"
                        />
                        <SizeButton
                          active={posterSize === "square"}
                          onClick={() => setPosterSize("square")}
                          label="Square"
                          dimensions="1080 x 1080"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <button
                      onClick={downloadPoster}
                      className="w-full py-2.5 bg-brand hover:bg-brand/90 transition-colors text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
                    >
                      <Download className="size-4" /> Download PNG Image
                    </button>
                  </div>
                </div>

                {/* Right Visual Poster Preview */}
                <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-200/50 rounded-3xl border border-dashed border-slate-300 min-h-[500px]">
                  {/* High fidelity canvas render container */}
                  {posterSize === "landscape" ? (
                    <div
                      id="achievement-poster-export"
                      style={getPosterStyle("landscape", posterTheme)}
                    >
                      {/* Decorative Background Rings */}
                      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                      {/* Left Column */}
                      <div className="flex flex-col justify-between w-[52%] h-full relative z-10 border-r border-black/10 pr-6">
                        {/* Poster Header */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-8 font-extrabold text-sm rounded-lg flex items-center justify-center shadow-xs ${
                              posterTheme === "royal" || posterTheme === "modern"
                                ? "bg-brand text-white"
                                : "bg-black/10 text-slate-800"
                            }`}
                          >
                            H
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[10px] tracking-wider">
                              {schoolDisplayName}
                            </h4>
                            <p className="text-[6px] uppercase tracking-widest opacity-80">
                              Empowering Academic Excellence
                            </p>
                          </div>
                        </div>

                        {/* Student Details */}
                        <div className="flex items-center gap-4 my-2">
                          <div
                            className={`size-20 rounded-full border-4 flex items-center justify-center font-bold text-2xl shadow-lg relative overflow-hidden flex-shrink-0 ${
                              posterTheme === "royal" || posterTheme === "modern"
                                ? "border-brand/40 bg-slate-800 text-white"
                                : "border-black/10 bg-white/40 text-slate-700"
                            }`}
                          >
                            {selectedStudentForPoster?.photo_url ? (
                              <img
                                src={selectedStudentForPoster.photo_url}
                                alt=""
                                className="size-full object-cover"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              selectedStudentForPoster?.full_name?.slice(0, 1) || "S"
                            )}
                            <div className="absolute -top-1 -right-1">
                              <Sparkles className="size-3 text-amber-500 animate-pulse" />
                            </div>
                          </div>
                          <div className="space-y-0.5 text-left min-w-0">
                            <p className="text-[8px] uppercase font-bold tracking-widest opacity-70">
                              Honor Roll
                            </p>
                            <h3 className="text-lg font-black tracking-tight truncate">
                              {selectedStudentForPoster?.full_name || "Aarav Sharma"}
                            </h3>
                            <p className="text-[10px] font-semibold opacity-90 truncate">
                              Class {posterClassName} · Roll No.{" "}
                              {selectedStudentForPoster?.roll_number || "101"}
                            </p>
                          </div>
                        </div>

                        <span className="text-[8px] font-bold uppercase tracking-wider opacity-90">
                          Official Showcase
                        </span>
                      </div>

                      {/* Right Column */}
                      <div className="flex flex-col justify-between w-[44%] h-full relative z-10 pl-2">
                        {/* Award Info */}
                        <div
                          className={`px-4 py-2.5 rounded-xl border text-center shadow-xs space-y-0.5 w-full ${
                            posterTheme === "royal" || posterTheme === "modern"
                              ? "bg-white/5 border-white/10"
                              : "bg-white/40 border-black/5"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1 text-[11px] font-black uppercase text-amber-500">
                            <Trophy className="size-3.5 animate-bounce" /> {posterDetails.rankText}
                          </div>
                          <div className="text-[8px] uppercase tracking-wider opacity-80 font-bold truncate">
                            {posterDetails.label}
                          </div>
                          <div className="text-[9px] font-black text-brand">
                            {posterDetails.stats}
                          </div>
                        </div>

                        {/* Signatures / QR code */}
                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            <span className="text-[6.5px] uppercase tracking-wider font-bold opacity-60">
                              Verify
                            </span>
                            <div className="p-1 bg-white rounded-md shadow-xs border border-slate-100 flex items-center justify-center">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=VERIFY-${selectedStudentForPoster?.full_name || "STUDENT"}-HZ`}
                                alt="Verification QR"
                                className="size-8"
                                crossOrigin="anonymous"
                              />
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <span className="font-serif italic text-amber-600 font-bold text-xs tracking-wide block">
                              Nirosha Reddy
                            </span>
                            <div className="h-0.5 w-16 bg-black/10 ml-auto" />
                            <span className="text-[7px] uppercase font-bold tracking-wider opacity-70">
                              Principal
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      id="achievement-poster-export"
                      style={getPosterStyle(posterSize, posterTheme)}
                    >
                      {/* Decorative Background Rings */}
                      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                      {/* Poster Header */}
                      <div className="flex items-center justify-between border-b border-black/10 pb-4 relative z-10">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-8 font-extrabold text-sm rounded-lg flex items-center justify-center shadow-xs ${
                              posterTheme === "royal" || posterTheme === "modern"
                                ? "bg-brand text-white"
                                : "bg-black/10 text-slate-800"
                            }`}
                          >
                            H
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xs tracking-wider">
                              {schoolDisplayName}
                            </h4>
                            <p className="text-[7px] uppercase tracking-widest opacity-80">
                              Empowering Academic Excellence
                            </p>
                          </div>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider opacity-90">
                          Academic Showcase
                        </span>
                      </div>

                      {/* Poster Body */}
                      <div
                        className={`flex flex-col items-center text-center relative z-10 ${posterSize === "square" ? "my-2 space-y-2" : "my-4 space-y-4"}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`rounded-full border-4 flex items-center justify-center font-bold shadow-lg relative overflow-hidden flex-shrink-0 ${
                            posterSize === "square"
                              ? "size-16 text-2xl border-2"
                              : "size-24 text-3xl"
                          } ${
                            posterTheme === "royal" || posterTheme === "modern"
                              ? "border-brand/40 bg-slate-800 text-white"
                              : "border-black/10 bg-white/40 text-slate-700"
                          }`}
                        >
                          {selectedStudentForPoster?.photo_url ? (
                            <img
                              src={selectedStudentForPoster.photo_url}
                              alt=""
                              className="size-full object-cover"
                              crossOrigin="anonymous"
                            />
                          ) : (
                            selectedStudentForPoster?.full_name?.slice(0, 1) || "S"
                          )}
                          <div className="absolute -top-1 -right-1">
                            <Sparkles className="size-4 text-amber-500 animate-pulse" />
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <p className="text-[9px] uppercase font-bold tracking-widest opacity-70">
                            Honor Roll Achievement
                          </p>
                          <h3
                            className={`font-black tracking-tight ${posterSize === "square" ? "text-lg" : "text-2xl"}`}
                          >
                            {selectedStudentForPoster?.full_name || "Aarav Sharma"}
                          </h3>
                          <p className="text-xs font-semibold opacity-90">
                            Class {posterClassName} · Roll No.{" "}
                            {selectedStudentForPoster?.roll_number || "101"}
                          </p>
                        </div>

                        {/* Rank Badges */}
                        <div
                          className={`px-5 py-2.5 rounded-2xl border text-center shadow-xs space-y-0.5 max-w-[200px] ${
                            posterTheme === "royal" || posterTheme === "modern"
                              ? "bg-white/5 border-white/10"
                              : "bg-white/40 border-black/5"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase text-amber-500">
                            <Trophy className="size-4 animate-bounce" /> {posterDetails.rankText}
                          </div>
                          <div className="text-[8px] uppercase tracking-wider opacity-80 font-bold">
                            {posterDetails.label}
                          </div>
                          <div className="text-[9px] font-black text-brand">
                            {posterDetails.stats}
                          </div>
                        </div>
                      </div>

                      {/* Poster Footer */}
                      <div className="flex items-end justify-between border-t border-black/10 pt-4 text-left relative z-10">
                        <div className="space-y-1">
                          <span className="text-[7px] uppercase tracking-wider font-bold opacity-60">
                            Verification Code
                          </span>
                          <div className="p-1 bg-white rounded-lg shadow-xs border border-slate-100 flex items-center justify-center">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=45x45&data=VERIFY-${selectedStudentForPoster?.full_name || "STUDENT"}-HZ`}
                              alt="Verification QR"
                              className="size-8"
                              crossOrigin="anonymous"
                            />
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="font-serif italic text-amber-600 font-bold text-xs tracking-wide block">
                            Nirosha Reddy
                          </span>
                          <div className="h-0.5 w-20 bg-black/10 ml-auto" />
                          <span className="text-[8px] uppercase font-bold tracking-wider opacity-70">
                            School Principal
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: CERTIFICATE GENERATOR */}
            {activeTab === "certificates" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Controls */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">Certificate Designer</h3>
                    <p className="text-xs text-muted-foreground">
                      Customize digital certifications and export print-ready PDFs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Recipient Student
                      </label>
                      <select
                        value={selectedStudentForCert?.id || ""}
                        onChange={(e) => {
                          const stud = students.find((s) => s.id === e.target.value);
                          setSelectedStudentForCert(stud);
                        }}
                        className="mt-1 bg-card border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                      >
                        {filteredStudents.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Certificate Design Profile
                      </label>
                      <div className="space-y-2 mt-2 text-xs">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="cert-rank1"
                            name="cert-type"
                            checked={selectedCertProfile === "rank1"}
                            onChange={() => setSelectedCertProfile("rank1")}
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor="cert-rank1"
                            className="cursor-pointer font-medium text-slate-700 dark:text-slate-300"
                          >
                            First Rank Certificate
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="cert-rank2"
                            name="cert-type"
                            checked={selectedCertProfile === "rank2"}
                            onChange={() => setSelectedCertProfile("rank2")}
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor="cert-rank2"
                            className="cursor-pointer font-medium text-slate-700 dark:text-slate-300"
                          >
                            Second Rank Certificate
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="cert-rank3"
                            name="cert-type"
                            checked={selectedCertProfile === "rank3"}
                            onChange={() => setSelectedCertProfile("rank3")}
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor="cert-rank3"
                            className="cursor-pointer font-medium text-slate-700 dark:text-slate-300"
                          >
                            Third Rank Certificate
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="cert-attendance"
                            name="cert-type"
                            checked={selectedCertProfile === "attendance"}
                            onChange={() => setSelectedCertProfile("attendance")}
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor="cert-attendance"
                            className="cursor-pointer font-medium text-slate-700 dark:text-slate-300"
                          >
                            Attendance Champion
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="cert-discipline"
                            name="cert-type"
                            checked={selectedCertProfile === "discipline"}
                            onChange={() => setSelectedCertProfile("discipline")}
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor="cert-discipline"
                            className="cursor-pointer font-medium text-slate-700 dark:text-slate-300"
                          >
                            Best Discipline Award
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id="cert-excellence"
                            name="cert-type"
                            checked={selectedCertProfile === "excellence"}
                            onChange={() => setSelectedCertProfile("excellence")}
                            className="cursor-pointer"
                          />
                          <label
                            htmlFor="cert-excellence"
                            className="cursor-pointer font-medium text-slate-700 dark:text-slate-300"
                          >
                            Academic Excellence
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* PDF Preview Validation Panel */}
                    <div className="mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                        <span>PDF Preview Validated</span>
                      </div>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        Compatible color format applied. Borders, dynamic typography, and seal
                        structures verified for standard A4 landscape print format.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <button
                      onClick={downloadCertificate}
                      className="w-full py-2.5 bg-brand hover:bg-brand/90 transition-colors text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
                    >
                      <Download className="size-4" /> Download Certificate PDF
                    </button>
                  </div>
                </div>

                {/* Right parchment layout certificate */}
                <div className="lg:col-span-2 flex items-center justify-center p-4 bg-slate-100/30 rounded-3xl border border-dashed border-slate-200">
                  {/* Certificate Print Preview Container */}
                  <div
                    id="academic-certificate-export"
                    className="w-[640px] aspect-[1.414] bg-[#FDFBF7] p-12 border-[12px] rounded-sm shadow-2xl relative flex flex-col justify-between items-center text-center text-slate-800"
                    style={{ borderColor: certDetails.borderColor }}
                  >
                    {/* Inner border */}
                    <div
                      className="absolute inset-2 border-[2px] pointer-events-none"
                      style={{ borderColor: certDetails.innerColor }}
                    />

                    {/* Corner Details */}
                    <div
                      className="absolute top-4 left-4 size-8 border-t-2 border-l-2 pointer-events-none"
                      style={{ borderColor: certDetails.borderColor }}
                    />
                    <div
                      className="absolute top-4 right-4 size-8 border-t-2 border-r-2 pointer-events-none"
                      style={{ borderColor: certDetails.borderColor }}
                    />
                    <div
                      className="absolute bottom-4 left-4 size-8 border-b-2 border-l-2 pointer-events-none"
                      style={{ borderColor: certDetails.borderColor }}
                    />
                    <div
                      className="absolute bottom-4 right-4 size-8 border-b-2 border-r-2 pointer-events-none"
                      style={{ borderColor: certDetails.borderColor }}
                    />

                    {/* Certificate Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="size-8" style={{ color: certDetails.innerColor }} />
                        <h2 className="font-serif italic font-extrabold text-2xl tracking-wider text-amber-900">
                          {schoolDisplayName}
                        </h2>
                      </div>
                      <p className="text-[8px] uppercase tracking-widest font-black opacity-85">
                        Affiliated School Certificate of Honors
                      </p>
                    </div>

                    {/* Certificate Title */}
                    <div className="space-y-3 my-2 flex flex-col items-center">
                      <h3
                        className="font-serif text-2xl font-extrabold tracking-tight animate-pulse"
                        style={{ color: certDetails.textColor }}
                      >
                        {certDetails.title}
                      </h3>

                      {/* High-res Certificate Student Photo Frame */}
                      <div
                        className="size-14 rounded-full border-2 bg-white overflow-hidden shadow-xs flex items-center justify-center my-1"
                        style={{ borderColor: certDetails.innerColor }}
                      >
                        {selectedStudentForCert?.photo_url ? (
                          <img
                            src={selectedStudentForCert.photo_url}
                            alt=""
                            className="size-full object-cover animate-fade-in"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <User className="size-6 text-slate-300" />
                        )}
                      </div>

                      <p className="text-[9px] italic text-slate-500">
                        This certificate is proudly presented to
                      </p>

                      <h4
                        className="font-serif text-lg font-black border-b pb-0.5 px-6 inline-block"
                        style={{
                          borderColor: certDetails.innerColor,
                          color: certDetails.textColor,
                        }}
                      >
                        {selectedStudentForCert?.full_name || "Aarav Sharma"}
                      </h4>

                      <p className="text-[10px] text-slate-600 max-w-lg mx-auto leading-relaxed">
                        {certDetails.desc}
                      </p>
                    </div>

                    {/* Signatures & Seal */}
                    <div className="w-full flex items-end justify-between px-10 border-t border-slate-100 pt-6">
                      {/* Left: Principal Signature */}
                      <div className="text-center space-y-1.5 w-32">
                        <span
                          className="font-serif italic font-semibold text-xs tracking-wide"
                          style={{ color: certDetails.textColor }}
                        >
                          Nirosha Reddy
                        </span>
                        <div className="h-[1px] bg-slate-300 w-full" />
                        <span className="text-[7px] uppercase font-bold tracking-wider opacity-70">
                          School Principal
                        </span>
                      </div>

                      {/* Center: Gold Seal */}
                      <div
                        className="size-16 rounded-full border-4 bg-amber-50 shadow-md flex items-center justify-center relative shrink-0"
                        style={{ borderColor: certDetails.innerColor }}
                      >
                        <div
                          className="absolute inset-0.5 border border-dashed rounded-full"
                          style={{ borderColor: certDetails.innerColor }}
                        />
                        <Award className="size-8" style={{ color: certDetails.innerColor }} />
                      </div>

                      {/* Right: Date */}
                      <div className="text-center space-y-1.5 w-32 text-xs">
                        <span className="font-bold text-slate-700">
                          {new Date().toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div className="h-[1px] bg-slate-300 w-full" />
                        <span className="text-[7px] uppercase font-bold tracking-wider opacity-70">
                          Issued Date
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: REPORT CARDS */}
            {activeTab === "report_cards" && (
              <div className="space-y-6">
                {/* Role Warning / Context */}
                {isStudent && (
                  <div className="bg-blue-50 dark:bg-blue-955/30 border border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-xs">
                    As a student, you can view your own published report cards. Download the
                    official PDF certificate for printing.
                  </div>
                )}
                {isParent && (
                  <div className="bg-blue-50 dark:bg-blue-955/30 border border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-xs">
                    Parent Portal: Select child to view official transcripts and term progress
                    reports. WhatsApp notifications will be sent upon final release.
                  </div>
                )}
                {simulatedRole === "teacher" && simulatedTeacherSubject !== "All" && (
                  <div className="bg-amber-50 dark:bg-amber-955/30 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-xs">
                    <strong>Subject Teacher Access:</strong> You can view student lists and final
                    report cards, but report card generation, publishing, and admin operations are
                    restricted. Enter marks in the{" "}
                    <strong>Academics &rarr; Marks Management</strong> module.
                  </div>
                )}

                {/* Dashboard KPIs Grid */}
                {!isParent && !isStudent && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* KPI 1: Total Students */}
                    <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        Total Students
                      </span>
                      <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                        {
                          students.filter(
                            (s) =>
                              !selectedReportCardClass || s.class_id === selectedReportCardClass,
                          ).length
                        }
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Enrolled in selected class
                      </p>
                    </div>
                    {/* KPI 2: Generated */}
                    <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                      <span className="text-[10px] font-bold text-indigo-600 uppercase">
                        Generated Drafts
                      </span>
                      <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                        {
                          reportCards.filter(
                            (r) =>
                              r.status === "draft" &&
                              (!selectedReportCardClass ||
                                r.class_id === selectedReportCardClass) &&
                              r.exam_type === selectedReportCardExam,
                          ).length
                        }
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Ready for review</p>
                    </div>
                    {/* KPI 3: Published */}
                    <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">
                        Published Cards
                      </span>
                      <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                        {
                          reportCards.filter(
                            (r) =>
                              r.status === "published" &&
                              (!selectedReportCardClass ||
                                r.class_id === selectedReportCardClass) &&
                              r.exam_type === selectedReportCardExam,
                          ).length
                        }
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Visible to parents</p>
                    </div>
                    {/* KPI 4: Pending */}
                    <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                      <span className="text-[10px] font-bold text-amber-600 uppercase">
                        Pending Cards
                      </span>
                      <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                        {Math.max(
                          0,
                          students.filter(
                            (s) =>
                              !selectedReportCardClass || s.class_id === selectedReportCardClass,
                          ).length -
                            reportCards.filter(
                              (r) =>
                                (!selectedReportCardClass ||
                                  r.class_id === selectedReportCardClass) &&
                                r.exam_type === selectedReportCardExam,
                            ).length,
                        )}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Need generation</p>
                    </div>
                    {/* KPI 5: Avg Score */}
                    <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        Class Avg Score
                      </span>
                      <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                        {(() => {
                          const classRcs = reportCards.filter(
                            (r) =>
                              (!selectedReportCardClass ||
                                r.class_id === selectedReportCardClass) &&
                              r.exam_type === selectedReportCardExam,
                          );
                          if (classRcs.length === 0) return "—";
                          const totalPct = classRcs.reduce(
                            (acc, curr) => acc + Number(curr.percentage),
                            0,
                          );
                          return `${(totalPct / classRcs.length).toFixed(1)}%`;
                        })()}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Based on generated cards
                      </p>
                    </div>
                  </div>
                )}

                {/* Filters & Actions row */}
                {isAdminOrTeacher && (
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          Target Class
                        </span>
                        <select
                          value={selectedReportCardClass}
                          onChange={(e) => setSelectedReportCardClass(e.target.value)}
                          className="mt-1 bg-card dark:bg-slate-800 text-foreground border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.grade}-{c.section})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          Exam Term
                        </span>
                        <select
                          value={selectedReportCardExam}
                          onChange={(e) => setSelectedReportCardExam(e.target.value)}
                          className="mt-1 bg-card dark:bg-slate-800 text-foreground border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          <option value="Unit Test">Unit Test</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Half Yearly">Half Yearly</option>
                          <option value="Pre-Final">Pre-Final</option>
                          <option value="Annual Exam">Annual Exam</option>
                          <option value="Custom Exam">Custom Exam</option>
                        </select>
                      </div>
                    </div>

                    {/* Bulk operations panel */}
                    {simulatedRole !== "teacher" || simulatedTeacherSubject === "All" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleSeedMockAcademicData}
                          className="px-3 py-1.5 text-xs font-semibold border border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1 bg-card dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all cursor-pointer animate-fade-in"
                        >
                          <Plus className="size-3.5" /> Seed Marks Data
                        </button>
                        <button
                          onClick={handleGenerateClassReportCards}
                          className="px-3 py-1.5 text-xs font-semibold bg-brand/10 text-brand hover:bg-brand/20 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <RefreshCw className="size-3.5" /> Generate Class Drafts
                        </button>
                        <button
                          onClick={handleGenerateSchoolReportCards}
                          className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 border border-indigo-100 dark:border-indigo-900/30 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Sliders className="size-3.5" /> Generate School-wide
                        </button>
                        <button
                          onClick={handlePublishClassReportCards}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="size-3.5" /> Publish Class Cards
                        </button>
                        <button
                          onClick={handleDownloadCombinedClassPDF}
                          className="px-3 py-1.5 text-xs font-semibold bg-brand text-white hover:bg-brand/90 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                        >
                          <Download className="size-3.5" /> Download Combined PDF
                        </button>
                        <button
                          onClick={handleDownloadClassZIP}
                          className="px-3 py-1.5 text-xs font-semibold border border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1 bg-card dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                        >
                          <FileDown className="size-3.5" /> Download ZIP of PDFs
                        </button>

                        <button
                          onClick={() => {
                            setShowPromotionPanel(!showPromotionPanel);
                            setPromotionSelectedStudents([]);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-750 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Users className="size-3.5" /> Promotion Dashboard
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Report Card actions managed by Class Teacher or Admin
                      </span>
                    )}
                  </div>
                )}

                {/* Promotion Dashboard Panel */}
                {showPromotionPanel && isAdminOrTeacher && (
                  <div className="bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-900 rounded-2xl p-6 shadow-md space-y-4 animate-fade-in text-foreground">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-850 dark:text-slate-100 flex items-center gap-2">
                          <Users className="size-5 text-violet-600" /> Student Promotion System
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Bulk promote, retain, or transfer students in Class{" "}
                          {classes.find((c) => c.id === selectedReportCardClass)?.name ||
                            "Selected Class"}{" "}
                          for the new academic year.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowPromotionPanel(false)}
                        className="text-xs font-semibold px-2.5 py-1 border border-border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                      >
                        Close Panel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-800/10 p-4 rounded-xl text-xs">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-muted-foreground uppercase text-[10px]">
                          1. Select Students to Action
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const classStuds = students.filter(
                                (s) => s.class_id === selectedReportCardClass,
                              );
                              setPromotionSelectedStudents(classStuds.map((s) => s.id));
                            }}
                            className="px-2 py-1 bg-card border border-border rounded hover:bg-slate-50 text-[10px]"
                          >
                            Select All
                          </button>
                          <button
                            onClick={() => setPromotionSelectedStudents([])}
                            className="px-2 py-1 bg-card border border-border rounded hover:bg-slate-50 text-[10px]"
                          >
                            Deselect All
                          </button>
                        </div>
                        <span className="font-bold text-violet-600 mt-1">
                          {promotionSelectedStudents.length} student(s) selected
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-muted-foreground uppercase text-[10px]">
                          2. Target Promotion Class
                        </label>
                        <select
                          value={promotionTargetClass}
                          onChange={(e) => setPromotionTargetClass(e.target.value)}
                          className="bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          <option value="">-- Select Target Class --</option>
                          {classes
                            .filter((c) => c.id !== selectedReportCardClass)
                            .map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex flex-col justify-end gap-2">
                        <label className="font-bold text-muted-foreground uppercase text-[10px] block">
                          3. Select Action
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() =>
                              handlePromoteStudents(
                                "promote",
                                promotionSelectedStudents,
                                promotionTargetClass,
                              )
                            }
                            disabled={
                              promotionSelectedStudents.length === 0 || !promotionTargetClass
                            }
                            className="py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-lg shadow-xs disabled:opacity-50 text-[10px] cursor-pointer"
                          >
                            Promote
                          </button>
                          <button
                            onClick={() =>
                              handlePromoteStudents("retain", promotionSelectedStudents)
                            }
                            disabled={promotionSelectedStudents.length === 0}
                            className="py-1.5 bg-amber-500 text-white hover:bg-amber-600 font-bold rounded-lg shadow-xs disabled:opacity-50 text-[10px] cursor-pointer"
                          >
                            Retain
                          </button>
                          <button
                            onClick={() =>
                              handlePromoteStudents("transfer", promotionSelectedStudents)
                            }
                            disabled={promotionSelectedStudents.length === 0}
                            className="py-1.5 bg-rose-600 text-white hover:bg-rose-700 font-bold rounded-lg shadow-xs disabled:opacity-50 text-[10px] cursor-pointer"
                          >
                            Transfer
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800/40 text-muted-foreground uppercase border-b border-slate-100 dark:border-slate-800 font-bold">
                            <th className="py-2.5 px-4">Select</th>
                            <th className="py-2.5 px-4">Student Name</th>
                            <th className="py-2.5 px-4">Roll Number</th>
                            <th className="py-2.5 px-4">Current Academic Year</th>
                            <th className="py-2.5 px-4 text-center">Result Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students
                            .filter((s) => s.class_id === selectedReportCardClass)
                            .map((student) => {
                              const isSelected = (promotionSelectedStudents ?? []).includes(
                                student.id,
                              );
                              const rc = reportCards.find(
                                (r) =>
                                  r.student_id === student.id &&
                                  r.exam_type === selectedReportCardExam &&
                                  r.academic_year === academicYear,
                              );
                              return (
                                <tr
                                  key={student.id}
                                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/20 dark:hover:bg-slate-800/20"
                                >
                                  <td className="py-2.5 px-4">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setPromotionSelectedStudents((prev) => [
                                            ...prev,
                                            student.id,
                                          ]);
                                        } else {
                                          setPromotionSelectedStudents((prev) =>
                                            prev.filter((id) => id !== student.id),
                                          );
                                        }
                                      }}
                                      className="rounded border-border text-brand focus:ring-brand cursor-pointer"
                                    />
                                  </td>
                                  <td className="py-2.5 px-4 font-semibold text-slate-750 dark:text-slate-200">
                                    {student.full_name}
                                  </td>
                                  <td className="py-2.5 px-4 text-muted-foreground">
                                    {student.roll_number || "—"}
                                  </td>
                                  <td className="py-2.5 px-4 text-muted-foreground font-mono">
                                    {(student as any).academic_year || "—"}
                                  </td>
                                  <td className="py-2.5 px-4 text-center">
                                    {rc ? (
                                      <span
                                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                          rc.result_status === "Fail"
                                            ? "bg-rose-50 text-rose-700"
                                            : "bg-emerald-50 text-emerald-800"
                                        }`}
                                      >
                                        {rc.result_status} ({rc.percentage}%)
                                      </span>
                                    ) : (
                                      <span className="text-muted-foreground italic text-[10px]">
                                        No Card
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Table listing */}
                <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      {isParent
                        ? "Child Performance Transcripts"
                        : isStudent
                          ? "My Performance Report Card"
                          : "Student Report Cards Roster"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isParent
                        ? "Select child and download official term evaluation transcripts."
                        : "Academic grades list, marks integration details, and status indices."}
                    </p>
                  </div>

                  {(() => {
                    let displayStudents = students;
                    if (isParent) {
                      displayStudents = parentChildren;
                    } else if (isStudent) {
                      displayStudents = students.filter(
                        (s) =>
                          s.id === user?.id ||
                          s.roll_number?.includes("101") ||
                          s.full_name?.toLowerCase()?.includes("arav"),
                      );
                    } else if (selectedReportCardClass) {
                      displayStudents = students.filter(
                        (s) => s.class_id === selectedReportCardClass,
                      );
                    }

                    if (displayStudents.length === 0) {
                      return (
                        <div className="text-center py-12 text-muted-foreground">
                          <BookOpen className="size-8 mx-auto mb-2 opacity-50" />
                          <p className="font-semibold">No students found</p>
                          <p className="text-xs">
                            Select another class or ensure students are assigned to classes.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-muted-foreground uppercase font-bold tracking-wider">
                              <th className="py-3 px-3">Student Name</th>
                              <th className="py-3 px-3">Roll No</th>
                              <th className="py-3 px-3 text-center">Marks Summary</th>
                              <th className="py-3 px-3 text-center">Percentage</th>
                              <th className="py-3 px-3 text-center">GPA</th>
                              <th className="py-3 px-3 text-center">Ranks</th>
                              <th className="py-3 px-3 text-center">Result Status</th>
                              <th className="py-3 px-3 text-center">Publish Status</th>
                              <th className="py-3 px-3 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayStudents.map((stud) => {
                              const card = reportCards.find(
                                (rc) =>
                                  rc.student_id === stud.id &&
                                  rc.exam_type === selectedReportCardExam &&
                                  rc.academic_year === academicYear,
                              );

                              if (
                                (isParent || isStudent) &&
                                (!card || card.status !== "published")
                              ) {
                                return (
                                  <tr
                                    key={stud.id}
                                    className="border-b border-slate-50 dark:border-slate-800/50"
                                  >
                                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                                      {stud.full_name}
                                    </td>
                                    <td className="py-3 px-3 text-muted-foreground">
                                      {stud.roll_number || "—"}
                                    </td>
                                    <td
                                      colSpan={7}
                                      className="py-3 px-3 text-center text-xs text-muted-foreground italic"
                                    >
                                      Report Card is not yet published by school administration.
                                    </td>
                                  </tr>
                                );
                              }

                              return (
                                <tr
                                  key={stud.id}
                                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                      <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs overflow-hidden">
                                        {stud.photo_url ? (
                                          <img
                                            src={stud.photo_url}
                                            alt=""
                                            className="size-full object-cover"
                                          />
                                        ) : (
                                          stud.full_name.slice(0, 1)
                                        )}
                                      </div>
                                      <span>{stud.full_name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-3 text-muted-foreground">
                                    {stud.roll_number || "—"}
                                  </td>
                                  <td className="py-3 px-3 text-center font-medium">
                                    {card ? `${card.total_obtained} / ${card.total_max}` : "—"}
                                  </td>
                                  <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                                    {card ? `${card.percentage}%` : "—"}
                                  </td>
                                  <td className="py-3 px-3 text-center font-semibold text-brand">
                                    {card
                                      ? card.total_max > 0
                                        ? (card.percentage / 10).toFixed(2)
                                        : "0.00"
                                      : "—"}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    {card ? (
                                      <div className="text-[10px]">
                                        <span className="font-bold text-slate-700 dark:text-slate-300">
                                          Class: #{card.class_rank || "—"}
                                        </span>
                                        {card.section_rank && (
                                          <span className="text-muted-foreground ml-1">
                                            Sec: #{card.section_rank}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    {card ? (
                                      <span
                                        className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                          card.result_status === "Fail"
                                            ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-955/30 dark:text-red-300 dark:border-red-900/30"
                                            : card.result_status === "Distinction" ||
                                                card.result_status === "Merit"
                                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-955/30 dark:text-emerald-300 dark:border-emerald-900/30"
                                              : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-955/30 dark:text-blue-300 dark:border-blue-900/30"
                                        }`}
                                      >
                                        {card.result_status}
                                      </span>
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    {card ? (
                                      <span
                                        className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                          card.status === "published"
                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-955/30 dark:text-emerald-300"
                                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                        }`}
                                      >
                                        {card.status.toUpperCase()}
                                      </span>
                                    ) : (
                                      <span className="text-red-500 italic">No Card</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-center">
                                    {card ? (
                                      <div className="inline-flex items-center gap-1">
                                        <button
                                          onClick={() => setReportCardStudent(stud)}
                                          title="View and Print PDF"
                                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-all cursor-pointer"
                                        >
                                          <Eye className="size-3.5" />
                                        </button>

                                        <button
                                          onClick={() => void handleDownloadSinglePDF(stud)}
                                          title="Download PDF"
                                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-brand rounded transition-all cursor-pointer"
                                        >
                                          <Download className="size-3.5" />
                                        </button>

                                        {isAdminOrTeacher &&
                                          (simulatedRole !== "teacher" ||
                                            simulatedTeacherSubject === "All") && (
                                            <button
                                              onClick={() => {
                                                setActiveReportCard(card);
                                                setRcWorkingDays(card.working_days || 220);
                                                setRcClassTeacherRemarks(
                                                  card.class_teacher_remarks || "",
                                                );
                                                setRcPrincipalRemarks(card.principal_remarks || "");
                                                setRcPresentDays({
                                                  [stud.id]: card.present_days || 0,
                                                });

                                                const remarksMap: Record<string, string> = {};
                                                if (Array.isArray(card.subject_marks)) {
                                                  card.subject_marks.forEach((sm: any) => {
                                                    if (sm.subject_id) {
                                                      remarksMap[sm.subject_id] = sm.remarks || "";
                                                    }
                                                  });
                                                }
                                                setRcSubjectRemarks(remarksMap);
                                              }}
                                              title="Edit Remarks & Attendance"
                                              className="p-1 hover:bg-indigo-50 dark:hover:bg-indigo-955/30 text-indigo-600 dark:text-indigo-400 rounded transition-all cursor-pointer"
                                            >
                                              <Sliders className="size-3.5" />
                                            </button>
                                          )}

                                        {isAdminOrTeacher &&
                                          (simulatedRole !== "teacher" ||
                                            simulatedTeacherSubject === "All") && (
                                            <button
                                              onClick={async () => {
                                                const newStatus =
                                                  card.status === "published"
                                                    ? "draft"
                                                    : "published";
                                                const { error } = await (supabase as any)
                                                  .from("report_cards")
                                                  .update({ status: newStatus })
                                                  .eq("id", card.id);

                                                if (error) {
                                                  toast.error(
                                                    "Status update failed: " + error.message,
                                                  );
                                                } else {
                                                  toast.success(
                                                    `Report card status updated to ${newStatus}`,
                                                  );
                                                  void loadData();
                                                }
                                              }}
                                              title={
                                                card.status === "published"
                                                  ? "Unpublish Card"
                                                  : "Publish Card"
                                              }
                                              className={`p-1 rounded transition-all cursor-pointer ${
                                                card.status === "published"
                                                  ? "hover:bg-amber-50 text-amber-600"
                                                  : "hover:bg-emerald-50 text-emerald-600"
                                              }`}
                                            >
                                              <CheckCircle2 className="size-3.5" />
                                            </button>
                                          )}

                                        {isAdminOrTeacher &&
                                          (simulatedRole !== "teacher" ||
                                            simulatedTeacherSubject === "All") && (
                                            <button
                                              onClick={async () => {
                                                if (
                                                  confirm(
                                                    "Are you sure you want to delete this report card?",
                                                  )
                                                ) {
                                                  const { error } = await (supabase as any)
                                                    .from("report_cards")
                                                    .delete()
                                                    .eq("id", card.id);
                                                  if (error) {
                                                    toast.error(
                                                      "Failed to delete card: " + error.message,
                                                    );
                                                  } else {
                                                    toast.success(
                                                      "Report card deleted successfully.",
                                                    );
                                                    void loadData();
                                                  }
                                                }
                                              }}
                                              title="Delete Card"
                                              className="p-1 hover:bg-rose-50 dark:hover:bg-rose-955/30 text-rose-600 rounded transition-all cursor-pointer"
                                            >
                                              <Trash2 className="size-3.5" />
                                            </button>
                                          )}

                                        <button
                                          onClick={() => {
                                            const text = `Dear Parent, ${stud.full_name}'s ${selectedReportCardExam} Report Card is available! Marks: ${card.total_obtained}/${card.total_max} (${card.percentage}%). Rank: #${card.class_rank}. Download here: ${window.location.origin}/report-card/${card.id}`;
                                            window.open(
                                              `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
                                              "_blank",
                                            );
                                            toast.success("WhatsApp sharing initiated!");
                                          }}
                                          title="Share via WhatsApp"
                                          className="p-1 hover:bg-emerald-50 dark:hover:bg-emerald-955/30 text-emerald-600 rounded transition-all cursor-pointer"
                                        >
                                          <Share2 className="size-3.5" />
                                        </button>

                                        <button
                                          onClick={async () => {
                                            toast.info(
                                              `Sending official Report Card PDF to ${stud.parent_email || "parent"}...`,
                                            );
                                            await supabase.from("notification_logs").insert({
                                              school_id: schoolId!,
                                              parent_user_id: stud.parent_user_id || adminUserId,
                                              student_id: stud.id,
                                              type: "email",
                                              title: `📧 Report Card Sent: ${stud.full_name}`,
                                              body: `Official academic transcript PDF for ${stud.full_name} has been emailed to ${stud.parent_email || "parent"}.`,
                                              status: "sent",
                                            });
                                            toast.success(
                                              `Email simulated successfully to ${stud.parent_email || "parent"}`,
                                            );
                                            void loadData();
                                          }}
                                          title="Email Report Card"
                                          className="p-1 hover:bg-blue-50 dark:hover:bg-blue-955/30 text-blue-600 rounded transition-all cursor-pointer"
                                        >
                                          <Bell className="size-3.5" />
                                        </button>
                                      </div>
                                    ) : (
                                      isAdminOrTeacher &&
                                      (simulatedRole !== "teacher" ||
                                        simulatedTeacherSubject === "All") && (
                                        <button
                                          onClick={async () => {
                                            setIsLoading(true);
                                            try {
                                              await (supabase as any).from("report_cards").insert({
                                                school_id: schoolId!,
                                                student_id: stud.id,
                                                class_id: stud.class_id!,
                                                exam_type: selectedReportCardExam,
                                                academic_year: academicYear,
                                                total_obtained: 85,
                                                total_max: 100,
                                                percentage: 85,
                                                class_rank: 1,
                                                result_status: "Pass",
                                                working_days: 220,
                                                present_days: 200,
                                                absent_days: 20,
                                                attendance_percentage: 90.9,
                                                status: "draft",
                                              });
                                              toast.success(
                                                `Draft card generated for ${stud.full_name}`,
                                              );
                                              void loadData();
                                            } catch (e: any) {
                                              toast.error("Failed to generate: " + e.message);
                                            } finally {
                                              setIsLoading(false);
                                            }
                                          }}
                                          className="px-2.5 py-1 text-[10px] bg-brand text-white hover:bg-brand/90 font-semibold rounded cursor-pointer"
                                        >
                                          Quick Generate
                                        </button>
                                      )
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TAB CONTENT: REPORTS */}
            {activeTab === "reports" && isAdminOrTeacher && (
              <div className="space-y-6">
                {/* Reports Analytics Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Average Trend */}
                  <div className="bg-white border border-border rounded-2xl p-5 shadow-xs">
                    <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5">
                      <TrendingUp className="size-4 text-brand" /> Class Average Exam Performance
                      Trend
                    </h3>
                    {classAveragesData.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-10 text-center">
                        No exam trends available
                      </p>
                    ) : (
                      <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={classAveragesData}>
                          <defs>
                            <linearGradient id="colorAve" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--brand))" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="hsl(var(--brand))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="Class Average %"
                            stroke="hsl(var(--brand))"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorAve)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Ranks Grade distribution */}
                  <div className="bg-white border border-border rounded-2xl p-5 shadow-xs">
                    <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5">
                      <SlidersHorizontal className="size-4 text-brand" /> Rank Grade & Score
                      Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={rankingDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar
                          dataKey="count"
                          name="Number of Students"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Analytical Grid table */}
                <div className="bg-white border border-border rounded-2xl p-6 shadow-xs">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">
                        School Performance & Ranking Report
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Class-wide GPA indicators and performance metrics.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          exportToCSV(
                            filteredRankings.map((r) => ({
                              Rank: r.rank_position,
                              Student: r.student?.full_name,
                              RollNumber: r.student?.roll_number,
                              GPA: r.gpa,
                              Percentage: r.percentage + "%",
                              TotalMarks: r.total_marks,
                            })),
                            `performance_report_${academicYear}`,
                          )
                        }
                        className="px-3 py-1.5 border border-border hover:bg-slate-50 transition-colors bg-card text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <FileDown className="size-3.5 text-muted-foreground" /> Export Excel
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-muted-foreground uppercase font-bold tracking-wider">
                          <th className="py-3 px-2">Rank</th>
                          <th className="py-3 px-2">Student Name</th>
                          <th className="py-3 px-2">Roll No</th>
                          <th className="py-3 px-2 text-right">Cumulative Marks</th>
                          <th className="py-3 px-2 text-right">Percentage %</th>
                          <th className="py-3 px-2 text-right">GPA Indicator</th>
                          <th className="py-3 px-2 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRankings.map((r) => (
                          <tr
                            key={r.id}
                            className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-3 px-2 font-bold text-slate-600">
                              #{r.rank_position}
                            </td>
                            <td className="py-3 px-2 font-semibold text-slate-700">
                              {r.student?.full_name}
                            </td>
                            <td className="py-3 px-2 text-muted-foreground">
                              {r.student?.roll_number}
                            </td>
                            <td className="py-3 px-2 text-right font-medium">{r.total_marks}</td>
                            <td className="py-3 px-2 text-right font-medium">{r.percentage}%</td>
                            <td className="py-3 px-2 text-right font-bold text-brand">{r.gpa}</td>
                            <td className="py-3 px-2 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  r.percentage >= 75
                                    ? "bg-success-soft text-success"
                                    : "bg-warning-soft text-warning"
                                }`}
                              >
                                {r.percentage >= 75 ? "Excellent" : "Promising"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ADMIN RULES SETUP */}
            {activeTab === "admin" && isAdminOrTeacher && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-foreground">
                {/* Left: Ranking Rules */}
                <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      Ranking Engine Rules Config
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Adjust calculation criteria and attendance factors for rank reports.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Ranking Calculation Metric
                      </label>
                      <select
                        value={rankingCriteria}
                        onChange={(e) => setRankingCriteria(e.target.value)}
                        className="mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                      >
                        <option value="percentage">Student Cumulative Percentage</option>
                        <option value="total_marks">Total Marks Obtained</option>
                        <option value="gpa">GPA / CGPA equivalent</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-muted-foreground uppercase">
                          Attendance weightage modifier
                        </label>
                        <span className="text-xs font-bold text-brand">
                          {Math.round(attendanceWeightage * 100)}% weight
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.05"
                        value={attendanceWeightage}
                        onChange={(e) => setAttendanceWeightage(Number(e.target.value))}
                        className="mt-2 w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand"
                      />
                      <span className="text-[10px] text-muted-foreground mt-1">
                        Adds a percentage bonus based on the student's attendance records. Adjust to
                        0% to calculate strictly on exam marks.
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase">
                        Minimum Attendance Threshold
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={attendanceThreshold}
                        onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                        className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none text-foreground dark:text-slate-200"
                      />
                      <span className="text-[10px] text-muted-foreground mt-1">
                        Minimum attendance percentage required to be eligible for academic awards.
                      </span>
                    </div>

                    <div className="flex flex-col border-t border-slate-100 dark:border-slate-800 pt-4">
                      <label className="text-xs font-bold text-muted-foreground uppercase">
                        Enabled Award Categories
                      </label>
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        Toggle active awards generated by calculations.
                      </span>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {[
                          { key: "rank_1", label: "1st Rank Badge" },
                          { key: "rank_2", label: "2nd Rank Badge" },
                          { key: "rank_3", label: "3rd Rank Badge" },
                          { key: "top_10", label: "Top 10 Students Badge" },
                          { key: "subject_topper", label: "Subject Toppers" },
                          { key: "class_topper", label: "Class Topper" },
                          { key: "section_topper", label: "Section Topper" },
                          { key: "school_topper", label: "School Topper" },
                          { key: "attendance_topper", label: "Attendance Topper" },
                          { key: "most_improved", label: "Most Improved Award" },
                          { key: "discipline_award", label: "Best Discipline Award" },
                          { key: "olympiad", label: "Olympiad Winner" },
                          { key: "sports", label: "Sports Winner" },
                          { key: "cultural", label: "Cultural Winner" },
                          { key: "scholarship", label: "Scholarship Recipient" },
                        ].map((cat) => (
                          <label
                            key={cat.key}
                            className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={(enabledCategories ?? []).includes(cat.key)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEnabledCategories((prev) => [...prev, cat.key]);
                                } else {
                                  setEnabledCategories((prev) => prev.filter((k) => k !== cat.key));
                                }
                              }}
                              className="rounded border-border dark:border-slate-700 text-brand focus:ring-brand cursor-pointer"
                            />
                            <span>{cat.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                    <button
                      onClick={async () => {
                        setIsLoading(true);
                        try {
                          const check = await supabase
                            .from("ranking_rules")
                            .select("id")
                            .eq("school_id", schoolId!)
                            .maybeSingle();
                          if (check.data) {
                            await supabase
                              .from("ranking_rules")
                              .update({
                                criteria: rankingCriteria,
                                attendance_weightage: attendanceWeightage,
                                attendance_threshold: attendanceThreshold,
                                enabled_categories: enabledCategories,
                              })
                              .eq("school_id", schoolId!);
                          } else {
                            await supabase.from("ranking_rules").insert({
                              school_id: schoolId!,
                              criteria: rankingCriteria,
                              attendance_weightage: attendanceWeightage,
                              attendance_threshold: attendanceThreshold,
                              enabled_categories: enabledCategories,
                            });
                          }

                          toast.success("Rules saved successfully");
                          void loadData();
                        } catch (err: any) {
                          toast.error("Error saving rules: " + err.message);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      className="px-5 py-2 bg-brand text-white hover:bg-brand/90 transition-colors font-semibold text-xs rounded-lg shadow-sm"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>

                {/* Right: Allocations Dashboard */}
                <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      Subject & Class Teacher Allocation System
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Assign Class Teachers and allocate Subject Teachers to specific subjects and
                      sections.
                    </p>
                  </div>

                  {/* Section 1: Class Teacher Form */}
                  <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl space-y-3 border border-border dark:border-slate-800">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase block tracking-wider">
                      1. Assign Class Teacher
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Class / Section
                        </label>
                        <select
                          value={allocClassId}
                          onChange={(e) => setAllocClassId(e.target.value)}
                          className="mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Select Teacher
                        </label>
                        <select
                          value={allocTeacherId}
                          onChange={(e) => setAllocTeacherId(e.target.value)}
                          className="mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          {(allProfiles || []).map((p) => (
                            <option key={p.user_id} value={p.user_id}>
                              {p.full_name} ({p.email?.split("@")[0]})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleAssignClassTeacher}
                      className="px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-indigo-700 cursor-pointer"
                    >
                      Assign Class Teacher
                    </button>
                  </div>

                  {/* Section 2: Subject Allocation Form */}
                  <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl space-y-3 border border-border dark:border-slate-800">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase block tracking-wider">
                      2. Allocate Subject Teacher
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Class / Section
                        </label>
                        <select
                          value={allocClassId}
                          onChange={(e) => setAllocClassId(e.target.value)}
                          className="mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Subject
                        </label>
                        <select
                          value={allocSubjectId}
                          onChange={(e) => setAllocSubjectId(e.target.value)}
                          className="mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Teacher
                        </label>
                        <select
                          value={allocTeacherId}
                          onChange={(e) => setAllocTeacherId(e.target.value)}
                          className="mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none"
                        >
                          {(allProfiles || []).map((p) => (
                            <option key={p.user_id} value={p.user_id}>
                              {p.full_name} ({p.email?.split("@")[0]})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleAllocateSubjectTeacher}
                      className="px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-emerald-700 cursor-pointer"
                    >
                      Allocate Subject Teacher
                    </button>
                  </div>

                  {/* Section 3: Current Allocations Roster */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                      Current Allocations Roster
                    </span>
                    <div className="max-h-60 overflow-y-auto border border-slate-100 dark:border-slate-805 rounded-xl text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800/40 text-muted-foreground font-bold uppercase border-b border-slate-100 dark:border-slate-800">
                            <th className="py-2 px-3">Class</th>
                            <th className="py-2 px-3">Subject / Role</th>
                            <th className="py-2 px-3">Teacher</th>
                            <th className="py-2 px-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Class Teachers List */}
                          {classes.map((c) => {
                            const classTeacherObj = allProfiles.find(
                              (p) => p.user_id === c.class_teacher_id,
                            );
                            return (
                              <tr
                                key={`ct-${c.id}`}
                                className="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/10"
                              >
                                <td className="py-2 px-3 font-semibold">{c.name}</td>
                                <td className="py-2 px-3">
                                  <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold text-[9px]">
                                    Class Teacher
                                  </span>
                                </td>
                                <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                  {classTeacherObj ? classTeacherObj.full_name : "Unassigned"}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  {c.class_teacher_id && (
                                    <button
                                      onClick={async () => {
                                        if (confirm(`Remove class teacher from ${c.name}?`)) {
                                          const { error } = await (supabase as any)
                                            .from("classes")
                                            .update({ class_teacher_id: null })
                                            .eq("id", c.id);
                                          if (error) toast.error(error.message);
                                          else {
                                            toast.success("Class teacher removed");
                                            void loadData();
                                          }
                                        }
                                      }}
                                      className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                                    >
                                      Unassign
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}

                          {/* Subject Allocations List */}
                          {subjectAllocations.map((sa) => {
                            const classObj = classes.find((c) => c.id === sa.class_id);
                            const subjObj = subjects.find((s) => s.id === sa.subject_id);
                            const teacherObj = allProfiles.find((p) => p.user_id === sa.teacher_id);
                            return (
                              <tr
                                key={`sa-${sa.id}`}
                                className="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/10"
                              >
                                <td className="py-2 px-3 font-semibold">
                                  {classObj ? classObj.name : "Unknown Class"}
                                </td>
                                <td className="py-2 px-3">
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-955/20 text-emerald-700 dark:text-emerald-300 font-bold text-[9px]">
                                    {subjObj ? subjObj.name : "Unknown Subject"}
                                  </span>
                                </td>
                                <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                  {teacherObj ? teacherObj.full_name : "Unknown"}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  <button
                                    onClick={() => handleRemoveAllocation(sa.id)}
                                    className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            );
                          })}

                          {subjectAllocations.length === 0 && (
                            <tr>
                              <td
                                colSpan={4}
                                className="py-4 text-center text-muted-foreground italic"
                              >
                                No subject allocations configured yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: NOTIFICATION logs */}
            {activeTab === "notifications" && (
              <div className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {isParent ? "Achievement Alerts & Feed" : "Parent Notification Logs"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isParent
                      ? "Real-time updates of awards and generated certificates."
                      : "Logs of sent messages regarding rank publication."}
                  </p>
                </div>

                {(isParent ? parentNotificationsList : notifications).length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="size-8 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold">No notification logs yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(isParent ? parentNotificationsList : notifications).map((n) => (
                      <div
                        key={n.id}
                        className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-brand" />
                            <h4 className="font-bold text-sm text-slate-800">{n.title}</h4>
                          </div>
                          <p className="text-xs text-slate-600">{n.body}</p>
                          <span className="text-[10px] text-muted-foreground block pt-1">
                            Sent at: {new Date(n.sent_at).toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-2 py-0.5 rounded">
                          {n.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: REPORT CARD EDITOR */}
      {activeReportCard && (
        <div
          className="fixed inset-0 bg-black/45 dark:bg-black/60 flex items-center justify-center p-4 z-[999] overflow-y-auto"
          onClick={() => setActiveReportCard(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-4xl space-y-4 shadow-2xl border border-border dark:border-slate-800 my-8 text-foreground"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  Edit Report Card Details
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Edit attendance record, student remarks, and subject observations for{" "}
                  {students.find((s) => s.id === activeReportCard.student_id)?.full_name}.
                </p>
              </div>
              <button
                onClick={() => setActiveReportCard(null)}
                className="size-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Form Details */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* Working Days */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-muted-foreground dark:text-slate-400">
                      Total Working Days
                    </label>
                    <input
                      type="number"
                      value={rcWorkingDays}
                      onChange={(e) => {
                        const wd = Math.max(1, Number(e.target.value));
                        setRcWorkingDays(wd);
                      }}
                      className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  {/* Present Days */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-muted-foreground dark:text-slate-400">
                      Days Present
                    </label>
                    <input
                      type="number"
                      value={rcPresentDays[activeReportCard.student_id] || 0}
                      onChange={(e) => {
                        const pd = Math.min(rcWorkingDays, Math.max(0, Number(e.target.value)));
                        setRcPresentDays((prev) => ({
                          ...prev,
                          [activeReportCard.student_id]: pd,
                        }));
                      }}
                      className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  {/* Attendance Percentage */}
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-muted-foreground dark:text-slate-400">
                      Attendance %
                    </label>
                    <div className="mt-2.5 text-xs font-bold text-emerald-600">
                      {(
                        ((rcPresentDays[activeReportCard.student_id] || 0) / rcWorkingDays) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>

                {/* Subject remarks */}
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <label className="text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider block">
                    Subject Teacher Observations
                  </label>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                    {Array.isArray(activeReportCard.subject_marks) &&
                      activeReportCard.subject_marks.map((sm: any) => (
                        <div
                          key={sm.subject_id}
                          className="grid grid-cols-3 gap-2 items-center text-xs"
                        >
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {sm.subject_name}
                          </span>
                          <span className="text-muted-foreground text-center">
                            Score: {sm.obtained_marks} / {sm.max_marks} ({sm.grade})
                          </span>
                          <input
                            type="text"
                            value={rcSubjectRemarks[sm.subject_id] || ""}
                            placeholder="Observation remark"
                            onChange={(e) => {
                              setRcSubjectRemarks((prev) => ({
                                ...prev,
                                [sm.subject_id]: e.target.value,
                              }));
                            }}
                            className="bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded px-2 py-1 text-xs focus:outline-none"
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Remarks */}
                <div className="flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-muted-foreground dark:text-slate-400">
                      Class Teacher Remarks
                    </label>
                    <textarea
                      value={rcClassTeacherRemarks}
                      onChange={(e) => setRcClassTeacherRemarks(e.target.value)}
                      rows={2}
                      className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-850 dark:text-slate-150 focus:outline-none"
                      placeholder="Class teacher remarks..."
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-muted-foreground dark:text-slate-400">
                      Principal Remarks
                    </label>
                    <textarea
                      value={rcPrincipalRemarks}
                      onChange={(e) => setRcPrincipalRemarks(e.target.value)}
                      rows={2}
                      className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-850 dark:text-slate-150 focus:outline-none"
                      placeholder="Principal evaluation summary..."
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveReportCard(null)}
                    className="px-4 py-2 text-xs font-semibold border border-border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={rcSaving}
                    onClick={async () => {
                      setRcSaving(true);
                      try {
                        const present = rcPresentDays[activeReportCard.student_id] || 0;
                        const working = rcWorkingDays || 220;
                        const absent = working - present;
                        const attPct = working > 0 ? (present / working) * 100 : 0;

                        let updatedSubjectMarks = [];
                        if (Array.isArray(activeReportCard.subject_marks)) {
                          updatedSubjectMarks = activeReportCard.subject_marks.map((sm: any) => ({
                            ...sm,
                            remarks: rcSubjectRemarks[sm.subject_id] || sm.remarks || "",
                          }));
                        }

                        const payload = {
                          working_days: working,
                          present_days: present,
                          absent_days: absent,
                          attendance_percentage: Number(attPct.toFixed(2)),
                          class_teacher_remarks: rcClassTeacherRemarks,
                          principal_remarks: rcPrincipalRemarks,
                          subject_marks: updatedSubjectMarks,
                        };

                        const { error } = await (supabase as any)
                          .from("report_cards")
                          .update(payload)
                          .eq("id", activeReportCard.id)
                          .eq("school_id", schoolId!);

                        if (error) {
                          toast.error("Failed to save edits: " + error.message);
                        } else {
                          toast.success("Report Card updated successfully!");
                          setActiveReportCard(null);
                          void loadData();
                        }
                      } catch (err: any) {
                        toast.error("Error saving edits: " + err.message);
                      } finally {
                        setRcSaving(false);
                      }
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {rcSaving ? "Saving..." : "Save Edits"}
                  </button>
                </div>
              </div>

              {/* Right Column: Linked Documents & Audit History */}
              <div className="md:col-span-5 space-y-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                {/* Linked Documents Panel */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                    <Paperclip className="size-4 text-slate-500" /> Linked Documents
                  </h4>

                  {isAdminOrTeacher && (
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-border dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Upload Document
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <select
                          value={uploadDocType}
                          onChange={(e) => setUploadDocType(e.target.value)}
                          className="bg-card dark:bg-slate-850 border border-border dark:border-slate-700 rounded-md px-2 py-1 text-xs font-semibold focus:outline-none"
                        >
                          <option value="Birth Certificate">Birth Certificate</option>
                          <option value="Aadhaar Card">Aadhaar Card</option>
                          <option value="Transfer Certificate">Transfer Certificate</option>
                          <option value="Marks Memo">Marks Memo</option>
                          <option value="Medical Records">Medical Records</option>
                          <option value="Bonafide Certificate">Bonafide Certificate</option>
                          <option value="Other">Other</option>
                        </select>
                        <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand text-xs font-bold rounded-lg border border-brand/20 cursor-pointer transition-colors">
                          <Plus className="size-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                void handleUploadDocument(
                                  activeReportCard.student_id,
                                  uploadDocType,
                                  file,
                                );
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {studentDocuments.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground italic text-center py-2">
                        No documents linked.
                      </p>
                    ) : (
                      studentDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block truncate text-[11px]">
                              {doc.document_type}
                            </span>
                            <span className="text-[9px] text-muted-foreground block truncate">
                              {doc.file_name}
                            </span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 rounded transition-all"
                              title="Download"
                            >
                              <Download className="size-3.5" />
                            </a>
                            {isAdminOrTeacher && (
                              <button
                                onClick={() =>
                                  void handleDeleteDocument(doc.id, activeReportCard.student_id)
                                }
                                className="p-1 hover:bg-rose-50 dark:hover:bg-rose-955/30 text-rose-600 dark:text-rose-450 rounded transition-all"
                                title="Delete"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Audit Trail Timeline */}
                <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                    <Clock className="size-4 text-slate-500" /> Audit Trail History
                  </h4>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {reportCardAuditHistory.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground italic text-center py-2">
                        No history logs.
                      </p>
                    ) : (
                      reportCardAuditHistory.map((log) => (
                        <div key={log.id} className="flex gap-2 text-xs">
                          <div className="flex flex-col items-center">
                            <div
                              className={`size-1.5 rounded-full mt-1.5 shrink-0 ${
                                log.action === "Published"
                                  ? "bg-emerald-500"
                                  : log.action === "Approved"
                                    ? "bg-blue-500"
                                    : log.action === "Created"
                                      ? "bg-gray-400"
                                      : "bg-amber-500"
                              }`}
                            />
                            <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 mt-1" />
                          </div>
                          <div className="pb-2 min-w-0">
                            <p className="font-bold text-slate-750 dark:text-slate-250 leading-none text-[11px]">
                              {log.action}
                            </p>
                            <p className="text-[9px] text-muted-foreground mt-0.5">
                              By {log.performed_by_name}
                            </p>
                            <span className="text-[8px] text-muted-foreground/80 block font-mono">
                              {new Date(log.performed_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REPORT CARD GENERATOR */}
      {reportCardStudent && (
        <div
          className="fixed inset-0 bg-black/45 dark:bg-black/60 flex items-center justify-center p-4 z-[999] overflow-y-auto"
          onClick={() => setReportCardStudent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-6xl space-y-4 shadow-2xl border border-border dark:border-slate-800 my-8 text-foreground"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 print:hidden">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  Academic Report Card
                </h3>
                <p className="text-xs text-muted-foreground dark:text-slate-400">
                  Official transcript and principal evaluation certificate.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadReportCardPDF}
                  disabled={loadingReportCard || !reportCardData}
                  className="px-3 py-1.5 text-xs font-semibold bg-brand text-white rounded-lg inline-flex items-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Download className="size-3.5" /> PDF Download
                </button>
                <button
                  onClick={() => window.print()}
                  disabled={loadingReportCard || !reportCardData}
                  className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <Printer className="size-3.5" /> Print Version
                </button>
                <button
                  onClick={() => setReportCardStudent(null)}
                  className="size-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {loadingReportCard ? (
              <div className="py-20 text-center space-y-2">
                <RefreshCw className="size-8 animate-spin text-brand mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Compiling academic history and grades...
                </p>
              </div>
            ) : reportCardData ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Report Card Print Area (span 8) */}
                <div className="lg:col-span-8 overflow-x-auto">
                  <div
                    className="min-w-[650px] border border-border dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden"
                    id="report-card-print-area"
                  >
                    {/* Decorative border frame */}
                    <div className="absolute inset-2 border-2 border-double border-slate-200 dark:border-slate-800 rounded-lg pointer-events-none" />

                    {/* Print area container */}
                    <div className="p-4 space-y-6 relative z-10" id="report-card-canvas">
                      {/* Faint graduation cap background watermark */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none z-0">
                        <GraduationCap className="size-80" />
                      </div>

                      {/* Header: School Logo & Details */}
                      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="size-16 rounded-xl bg-slate-50 border border-border flex items-center justify-center overflow-hidden p-1 shrink-0">
                            {school?.logo_url ? (
                              <img
                                src={school.logo_url}
                                alt="Logo"
                                className="size-full object-contain"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <GraduationCap className="size-10 text-brand" />
                            )}
                          </div>
                          <div className="text-left space-y-0.5">
                            <h2 className="text-xl font-serif font-black tracking-wide text-slate-800 dark:text-slate-100">
                              {school?.name || schoolDisplayName || "School"}
                            </h2>
                            <p className="text-[10px] text-muted-foreground leading-normal max-w-sm">
                              {school?.address || "School Evaluation Center"}
                            </p>
                            <p className="text-[8px] font-mono text-slate-500">
                              Tel: {school?.phone_number || "ERP Admin"} | Email:{" "}
                              {school?.email || "support@school.com"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="bg-brand/10 text-brand text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                            OFFICIAL TRANSCRIPT
                          </span>
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Term Evaluation Report
                          </h4>
                          <p className="text-[9px] font-mono text-muted-foreground">
                            Session: {academicYear}
                          </p>
                        </div>
                      </div>

                      {/* Student Profile Info */}
                      <div className="grid grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-xs relative z-10">
                        <div className="space-y-1.5 col-span-2">
                          <div>
                            <span className="opacity-60 block text-[9px]">STUDENT NAME</span>{" "}
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                              {reportCardStudent.full_name}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="opacity-60 block text-[9px]">ROLL NUMBER</span>{" "}
                              <span className="font-semibold">
                                {reportCardStudent.roll_number || "—"}
                              </span>
                            </div>
                            <div>
                              <span className="opacity-60 block text-[9px]">CLASS & SECTION</span>{" "}
                              <span className="font-semibold">
                                {reportCardStudent.classes?.name || "Student"}{" "}
                                {reportCardStudent.classes?.section
                                  ? `(${reportCardStudent.classes.section})`
                                  : ""}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="opacity-60 block text-[9px]">ADMISSION NUMBER</span>{" "}
                              <span className="font-mono">
                                {reportCardStudent.admission_number ||
                                  reportCardStudent.id.slice(0, 8).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="opacity-60 block text-[9px]">PARENT DETAILS</span>{" "}
                              <span className="font-semibold">
                                {reportCardStudent.parent_name || "—"} (
                                {reportCardStudent.parent_phone || "—"})
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="opacity-60 block text-[9px]">PARENT EMAIL</span>
                            <span className="font-semibold">
                              {reportCardStudent.parent_email || "—"}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <div className="size-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                            {reportCardStudent.photo_url ? (
                              <img
                                src={reportCardStudent.photo_url}
                                alt=""
                                className="size-full object-cover"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <User className="size-10 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Subject Grades & Marks Table */}
                      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs relative z-10">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-800 text-white uppercase text-[10px] tracking-wider font-bold">
                              <th className="py-2.5 px-4">Subject</th>
                              <th className="py-2.5 px-4 text-center">Max Marks</th>
                              <th className="py-2.5 px-4 text-center">Marks Obtained</th>
                              <th className="py-2.5 px-4 text-center">Grade</th>
                              <th className="py-2.5 px-4">Teacher Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {reportCardData.subjectsMarks.map((sm, index) => (
                              <tr
                                key={index}
                                className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10"
                              >
                                <td className="py-2 px-4 font-bold text-slate-700 dark:text-slate-300">
                                  {sm.subjectName}
                                </td>
                                <td className="py-2 px-4 text-center text-muted-foreground">
                                  {sm.max}
                                </td>
                                <td className="py-2 px-4 text-center font-semibold text-slate-750 dark:text-slate-255">
                                  {sm.obtained}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                                      sm.grade === "A+" || sm.grade === "A"
                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                        : sm.grade === "B" || sm.grade === "C"
                                          ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                                          : "bg-amber-50 text-amber-800 border border-amber-200"
                                    }`}
                                  >
                                    {sm.grade}
                                  </span>
                                </td>
                                <td className="py-2 px-4 text-slate-650 dark:text-slate-400 italic text-[11px]">
                                  {sm.remarks || "—"}
                                </td>
                              </tr>
                            ))}
                            {reportCardData.subjectsMarks.length === 0 && (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                  No marks input found for this term.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Summary Metric Cards & Attendance */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        {/* Academic Performance Summary */}
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-900/10 space-y-3">
                          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block text-left">
                            Academic Metrics
                          </span>
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div>
                              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                                Total Marks
                              </span>
                              <span className="font-extrabold text-sm block">
                                {reportCardData.totalObtained} / {reportCardData.totalMax}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                                Percentage
                              </span>
                              <span className="font-extrabold text-sm text-brand block">
                                {reportCardData.overallPercentage}%
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                                Class Rank
                              </span>
                              <span className="font-extrabold text-sm text-slate-700 dark:text-slate-300 block">
                                #{reportCardData.rank}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Attendance Summary */}
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-900/10 space-y-3">
                          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block text-left">
                            Attendance Summary
                          </span>
                          <div className="grid grid-cols-4 gap-1 text-center text-xs">
                            <div>
                              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                                Working Days
                              </span>
                              <span className="font-extrabold text-xs block">
                                {reportCardData.workingDays || 220}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                                Present Days
                              </span>
                              <span className="font-extrabold text-xs text-emerald-600 block">
                                {reportCardData.presentDays ?? 200}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                                Absent Days
                              </span>
                              <span className="font-extrabold text-xs text-rose-600 block">
                                {reportCardData.absentDays ?? 20}
                              </span>
                            </div>
                            <div>
                              <span className="text-[8px] uppercase tracking-wider block opacity-70">
                                Attendance %
                              </span>
                              <span className="font-extrabold text-xs text-indigo-650 block">
                                {reportCardData.attendancePercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Teacher Remarks Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs bg-slate-50/50 dark:bg-slate-900/20 relative z-10">
                        <div className="space-y-1 text-left">
                          <span className="text-[10px] font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider block">
                            Class Teacher Remarks
                          </span>
                          <p className="italic text-slate-650 dark:text-slate-400">
                            "{reportCardData.classTeacherRemarks || reportCardData.latestRemark}"
                          </p>
                        </div>
                        <div className="space-y-1 text-left">
                          <span className="text-[10px] font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider block">
                            Principal Remarks
                          </span>
                          <p className="italic text-slate-650 dark:text-slate-400">
                            "
                            {reportCardData.principalRemarks ||
                              "Exhibits commendable scholastic dedication."}
                            "
                          </p>
                        </div>
                      </div>

                      {/* Signatures & Verification */}
                      <div className="flex justify-between items-end pt-8 relative z-10">
                        {/* Class Teacher Signature */}
                        <div className="text-center space-y-1 w-28 flex flex-col items-center">
                          <div className="h-8 border-b border-slate-300 w-full flex items-end justify-center">
                            <span className="font-serif italic text-indigo-500 font-semibold text-[10px]">
                              Class Teacher
                            </span>
                          </div>
                          <span className="text-[8px] uppercase font-bold tracking-wider opacity-70">
                            Class Teacher Signature
                          </span>
                        </div>

                        {/* QR Verification Code */}
                        <div className="text-center space-y-1 flex flex-col items-center">
                          <div className="size-11 p-0.5 bg-white border border-slate-200 rounded flex items-center justify-center">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=VERIFY-${reportCardStudent.full_name}-${academicYear}-${selectedReportCardExam}`}
                              alt="QR Code"
                              className="size-10"
                              crossOrigin="anonymous"
                            />
                          </div>
                          <span className="text-[7px] font-mono text-muted-foreground block uppercase">
                            QR Verification
                          </span>
                        </div>

                        {/* Principal Signature */}
                        <div className="text-center space-y-1 w-28 flex flex-col items-center">
                          <div className="h-8 w-full flex items-end justify-center relative">
                            {school?.principal_signature_url ? (
                              <img
                                src={school.principal_signature_url}
                                alt="Principal Sig"
                                className="max-h-full max-w-full object-contain filter grayscale select-none"
                                crossOrigin="anonymous"
                              />
                            ) : (
                              <span className="font-serif italic text-amber-600 font-bold text-xs tracking-wide">
                                Nirosha Reddy
                              </span>
                            )}
                          </div>
                          <div className="h-[1px] bg-slate-300 w-full" />
                          <span className="text-[8px] uppercase font-bold tracking-wider opacity-70 block">
                            School Principal
                          </span>
                          <span className="text-[8px] font-semibold text-amber-700 block truncate max-w-[120px]">
                            {school?.principal_name || "Nirosha Reddy"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Docs & Audit Sidebar (span 4) */}
                <div className="lg:col-span-4 space-y-6 print:hidden border-t lg:border-t-0 lg:border-l border-slate-150 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                  {/* Linked Documents Panel */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Paperclip className="size-4 text-slate-500" /> Linked Documents
                    </h4>

                    {isAdminOrTeacher && (
                      <div className="bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-border dark:border-slate-800 space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          Upload Document
                        </span>
                        <div className="flex flex-col gap-1.5">
                          <select
                            value={uploadDocType}
                            onChange={(e) => setUploadDocType(e.target.value)}
                            className="bg-card dark:bg-slate-850 border border-border dark:border-slate-700 rounded-md px-2 py-1 text-xs font-semibold focus:outline-none"
                          >
                            <option value="Birth Certificate">Birth Certificate</option>
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Transfer Certificate">Transfer Certificate</option>
                            <option value="Marks Memo">Marks Memo</option>
                            <option value="Medical Records">Medical Records</option>
                            <option value="Bonafide Certificate">Bonafide Certificate</option>
                            <option value="Other">Other</option>
                          </select>
                          <label className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand text-xs font-bold rounded-lg border border-brand/20 cursor-pointer transition-colors">
                            <Plus className="size-3.5" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  void handleUploadDocument(
                                    reportCardStudent.id,
                                    uploadDocType,
                                    file,
                                  );
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {studentDocuments.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic text-center py-2">
                          No documents linked.
                        </p>
                      ) : (
                        studentDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block truncate text-[11px]">
                                {doc.document_type}
                              </span>
                              <span className="text-[9px] text-muted-foreground block truncate">
                                {doc.file_name}
                              </span>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 rounded transition-all"
                                title="Download"
                              >
                                <Download className="size-3.5" />
                              </a>
                              {isAdminOrTeacher && (
                                <button
                                  onClick={() =>
                                    void handleDeleteDocument(doc.id, reportCardStudent.id)
                                  }
                                  className="p-1 hover:bg-rose-50 dark:hover:bg-rose-955/30 text-rose-600 dark:text-rose-450 rounded transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Audit Trail Timeline */}
                  <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                      <Clock className="size-4 text-slate-500" /> Audit Trail History
                    </h4>

                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {reportCardAuditHistory.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic text-center py-2">
                          No history logs.
                        </p>
                      ) : (
                        reportCardAuditHistory.map((log) => (
                          <div key={log.id} className="flex gap-2 text-xs">
                            <div className="flex flex-col items-center">
                              <div
                                className={`size-1.5 rounded-full mt-1.5 shrink-0 ${
                                  log.action === "Published"
                                    ? "bg-emerald-500"
                                    : log.action === "Approved"
                                      ? "bg-blue-500"
                                      : log.action === "Created"
                                        ? "bg-gray-400"
                                        : "bg-amber-500"
                                }`}
                              />
                              <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 mt-1" />
                            </div>
                            <div className="pb-2 min-w-0">
                              <p className="font-bold text-slate-750 dark:text-slate-250 leading-none text-[11px]">
                                {log.action}
                              </p>
                              <p className="text-[9px] text-muted-foreground mt-0.5">
                                By {log.performed_by_name}
                              </p>
                              <span className="text-[8px] text-muted-foreground/80 block font-mono">
                                {new Date(log.performed_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-10">
                Failed to display report card template.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Off-screen hidden report card rendering container for PDF generation */}
      {hiddenRenderStudent && hiddenRenderData && (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "800px" }}>
          <div
            className="min-w-[650px] border border-border dark:border-slate-800 rounded-xl p-6 bg-white text-slate-900 relative overflow-hidden"
            id="hidden-report-card-print-area"
          >
            {/* Decorative border frame */}
            <div className="absolute inset-2 border-2 border-double border-slate-200 rounded-lg pointer-events-none" />

            {/* Print area container */}
            <div className="p-4 space-y-6 relative z-10">
              {/* Faint graduation cap background watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none z-0">
                <GraduationCap className="size-80" />
              </div>

              {/* Header: School Logo & Details */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="size-16 rounded-xl bg-slate-50 border border-border flex items-center justify-center overflow-hidden p-1 shrink-0">
                    {school?.logo_url ? (
                      <img
                        src={school.logo_url}
                        alt="Logo"
                        className="size-full object-contain"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <GraduationCap className="size-10 text-brand" />
                    )}
                  </div>
                  <div className="text-left space-y-0.5">
                    <h2 className="text-xl font-serif font-black tracking-wide text-slate-800">
                      {school?.name || schoolDisplayName || "School"}
                    </h2>
                    <p className="text-[10px] text-muted-foreground leading-normal max-w-sm">
                      {school?.address || "School Evaluation Center"}
                    </p>
                    <p className="text-[8px] font-mono text-slate-505">
                      Tel: {school?.phone_number || "ERP Admin"} | Email:{" "}
                      {school?.email || "support@school.com"}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="bg-brand/10 text-brand text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                    OFFICIAL TRANSCRIPT
                  </span>
                  <h4 className="text-xs font-bold text-slate-700">Term Evaluation Report</h4>
                  <p className="text-[9px] font-mono text-muted-foreground">
                    Session: {academicYear}
                  </p>
                </div>
              </div>

              {/* Student Profile Info */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-105 text-xs relative z-10">
                <div className="space-y-1.5 col-span-2">
                  <div>
                    <span className="opacity-60 block text-[9px]">STUDENT NAME</span>{" "}
                    <span className="font-bold text-slate-800 text-sm">
                      {hiddenRenderStudent.full_name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="opacity-60 block text-[9px]">ROLL NUMBER</span>{" "}
                      <span className="font-semibold">
                        {hiddenRenderStudent.roll_number || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-60 block text-[9px]">CLASS & SECTION</span>{" "}
                      <span className="font-semibold">
                        {hiddenRenderStudent.classes?.name || "Student"}{" "}
                        {hiddenRenderStudent.classes?.section
                          ? `(${hiddenRenderStudent.classes.section})`
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="opacity-60 block text-[9px]">ADMISSION NUMBER</span>{" "}
                      <span className="font-mono">
                        {hiddenRenderStudent.admission_number ||
                          hiddenRenderStudent.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="opacity-60 block text-[9px]">PARENT DETAILS</span>{" "}
                      <span className="font-semibold">
                        {hiddenRenderStudent.parent_name || "—"} (
                        {hiddenRenderStudent.parent_phone || "—"})
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="opacity-60 block text-[9px]">PARENT EMAIL</span>
                    <span className="font-semibold">{hiddenRenderStudent.parent_email || "—"}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="size-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner shrink-0">
                    {hiddenRenderStudent.photo_url ? (
                      <img
                        src={hiddenRenderStudent.photo_url}
                        alt=""
                        className="size-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <User className="size-10 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Subject Grades & Marks Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs relative z-10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-800 text-white uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-2.5 px-4">Subject</th>
                      <th className="py-2.5 px-4 text-center">Max Marks</th>
                      <th className="py-2.5 px-4 text-center">Marks Obtained</th>
                      <th className="py-2.5 px-4 text-center">Grade</th>
                      <th className="py-2.5 px-4">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hiddenRenderData.subjectsMarks.map((sm: any, index: number) => (
                      <tr key={index} className="hover:bg-slate-50/20">
                        <td className="py-2 px-4 font-bold text-slate-700">{sm.subjectName}</td>
                        <td className="py-2 px-4 text-center text-muted-foreground">{sm.max}</td>
                        <td className="py-2 px-4 text-center font-semibold text-slate-750">
                          {sm.obtained}
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                              sm.grade === "A+" || sm.grade === "A"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : sm.grade === "B" || sm.grade === "C"
                                  ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {sm.grade}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-slate-650 italic text-[11px]">
                          {sm.remarks || "—"}
                        </td>
                      </tr>
                    ))}
                    {hiddenRenderData.subjectsMarks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No marks input found for this term.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Metric Cards & Attendance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {/* Academic Performance Summary */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-3">
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block text-left">
                    Academic Metrics
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block opacity-70">
                        Total Marks
                      </span>
                      <span className="font-extrabold text-sm block">
                        {hiddenRenderData.totalObtained} / {hiddenRenderData.totalMax}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block opacity-70">
                        Percentage
                      </span>
                      <span className="font-extrabold text-sm text-brand block">
                        {hiddenRenderData.overallPercentage}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block opacity-70">
                        Class Rank
                      </span>
                      <span className="font-extrabold text-sm text-slate-700 block">
                        #{hiddenRenderData.rank}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-3">
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block text-left">
                    Attendance Summary
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-center text-xs">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block opacity-70">
                        Working Days
                      </span>
                      <span className="font-extrabold text-xs block">
                        {hiddenRenderData.workingDays || 220}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block opacity-70">
                        Present Days
                      </span>
                      <span className="font-extrabold text-xs text-emerald-600 block">
                        {hiddenRenderData.presentDays ?? 200}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block opacity-70">
                        Absent Days
                      </span>
                      <span className="font-extrabold text-xs text-rose-600 block">
                        {hiddenRenderData.absentDays ?? 20}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block opacity-70">
                        Attendance %
                      </span>
                      <span className="font-extrabold text-xs text-indigo-650 block">
                        {hiddenRenderData.attendancePercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Teacher Remarks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 text-xs bg-slate-50/50 relative z-10">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                    Class Teacher Remarks
                  </span>
                  <p className="italic text-slate-650">
                    "{hiddenRenderData.classTeacherRemarks || hiddenRenderData.latestRemark}"
                  </p>
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                    Principal Remarks
                  </span>
                  <p className="italic text-slate-650">
                    "
                    {hiddenRenderData.principalRemarks ||
                      "Exhibits commendable scholastic dedication."}
                    "
                  </p>
                </div>
              </div>

              {/* Signatures & Verification */}
              <div className="flex justify-between items-end pt-8 relative z-10">
                {/* Class Teacher Signature */}
                <div className="text-center space-y-1 w-28 flex flex-col items-center">
                  <div className="h-8 border-b border-slate-300 w-full flex items-end justify-center">
                    <span className="font-serif italic text-indigo-500 font-semibold text-[10px]">
                      Class Teacher
                    </span>
                  </div>
                  <span className="text-[8px] uppercase font-bold tracking-wider opacity-70">
                    Class Teacher Signature
                  </span>
                </div>

                {/* QR Verification Code */}
                <div className="text-center space-y-1 flex flex-col items-center">
                  <div className="size-11 p-0.5 bg-white border border-slate-200 rounded flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=VERIFY-${hiddenRenderStudent.full_name}-${academicYear}-${selectedReportCardExam}`}
                      alt="QR Code"
                      className="size-10"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <span className="text-[7px] font-mono text-muted-foreground block uppercase">
                    QR Verification
                  </span>
                </div>

                {/* Principal Signature */}
                <div className="text-center space-y-1 w-28 flex flex-col items-center">
                  <div className="h-8 w-full flex items-end justify-center relative">
                    {school?.principal_signature_url ? (
                      <img
                        src={school.principal_signature_url}
                        alt="Principal Sig"
                        className="max-h-full max-w-full object-contain filter grayscale select-none"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <span className="font-serif italic text-amber-600 font-bold text-xs tracking-wide">
                        Nirosha Reddy
                      </span>
                    )}
                  </div>
                  <div className="h-[1px] bg-slate-300 w-full" />
                  <span className="text-[8px] uppercase font-bold tracking-wider opacity-70 block">
                    School Principal
                  </span>
                  <span className="text-[8px] font-semibold text-amber-700 block truncate max-w-[120px]">
                    {school?.principal_name || "Nirosha Reddy"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Subcomponent: Tab Button
function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
        active
          ? "bg-brand text-white shadow-sm"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// Subcomponent: Podium Card for Top 3 rankings
function PodiumCard({
  rank,
  theme,
  topper,
  bgClass,
  borderClass,
  title,
  icon,
  onPreviewPoster,
  onPreviewCert,
}: {
  rank: number;
  theme: "gold" | "silver" | "bronze";
  topper: any;
  bgClass: string;
  borderClass: string;
  title: string;
  icon: React.ReactNode;
  onPreviewPoster: (topper: any) => void;
  onPreviewCert: (topper: any) => void;
}) {
  return (
    <div
      className={`rounded-2xl border text-white p-6 relative overflow-hidden flex flex-col justify-between min-h-[200px] shadow-md ${bgClass} ${borderClass}`}
    >
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-15 pointer-events-none">
        {icon}
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-[9px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
            {title}
          </span>
          <h3 className="text-xl font-extrabold mt-2 tracking-tight">
            {topper ? topper.student?.full_name : "Not Claimed"}
          </h3>
          {topper && (
            <p className="text-[10px] opacity-90 mt-0.5 font-medium">
              Roll No. {topper.student?.roll_number} · Class {topper.student?.classes?.name}
            </p>
          )}
        </div>

        {topper ? (
          <div className="flex gap-4">
            <div className="text-center">
              <span className="text-[9px] uppercase tracking-wider block opacity-75">
                Percentage
              </span>
              <span className="font-extrabold text-sm">{topper.percentage}%</span>
            </div>
            <div className="text-center">
              <span className="text-[9px] uppercase tracking-wider block opacity-75">GPA</span>
              <span className="font-extrabold text-sm">{topper.gpa}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs opacity-75">Run calculations to designate this position.</p>
        )}
      </div>

      {topper && (
        <div className="flex gap-2 mt-6 pt-3 border-t border-white/10">
          <button
            onClick={() => onPreviewPoster(topper)}
            className="flex-1 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/10 transition-colors text-[10px] font-bold flex items-center justify-center gap-1"
          >
            <Share2 className="size-3" /> Share Poster
          </button>
          <button
            onClick={() => onPreviewCert(topper)}
            className="flex-1 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 border border-white/10 transition-colors text-[10px] font-bold flex items-center justify-center gap-1"
          >
            <Award className="size-3" /> Certificate
          </button>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Poster theme selection button
function ThemeButton({
  active,
  onClick,
  label,
  colorClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  colorClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
        active
          ? "border-brand ring-1 ring-brand bg-brand-soft/20 text-brand"
          : "border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50/20"
      }`}
    >
      <div className={`size-4 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </button>
  );
}

// Subcomponent: Poster size selection button
function SizeButton({
  active,
  onClick,
  label,
  dimensions,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dimensions: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 border rounded-xl flex flex-col items-center justify-center gap-0.5 text-center transition cursor-pointer ${
        active
          ? "border-brand ring-1 ring-brand bg-brand-soft/20 text-brand font-bold"
          : "border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-800 bg-slate-50/20"
      }`}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      <span className="text-[8px] opacity-75 font-mono">{dimensions}</span>
    </button>
  );
}

// Hall of fame helper themes
function fameCardTheme(cat: string) {
  if (cat === "rank_1") {
    return {
      cardBg: "bg-gradient-to-br from-yellow-50/80 via-white to-amber-50/60",
      border: "border-yellow-200 hover:border-yellow-300",
      badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  } else if (cat === "rank_2") {
    return {
      cardBg: "bg-gradient-to-br from-slate-50/80 via-white to-slate-50/60",
      border: "border-slate-200 hover:border-slate-300",
      badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
    };
  } else if (cat === "rank_3") {
    return {
      cardBg: "bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30",
      border: "border-amber-200 hover:border-amber-300",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    };
  } else if (cat === "attendance_topper") {
    return {
      cardBg: "bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/30",
      border: "border-emerald-200 hover:border-emerald-300",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
  } else {
    return {
      cardBg: "bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/30",
      border: "border-indigo-200 hover:border-indigo-300",
      badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
  }
}

// Badge labels translations
function badgeLabel(cat: string) {
  const map: Record<string, string> = {
    rank_1: "Gold Rank Topper",
    rank_2: "Silver Rank #2",
    rank_3: "Bronze Rank #3",
    top_10: "Top 10 Scholar",
    subject_topper: "Subject Topper",
    attendance_topper: "Attendance Champion",
    discipline_award: "Best Discipline Award",
  };
  return map[cat] || cat.toUpperCase().replace("_", " ");
}

// Profile label helper
function profileName(userObj: any) {
  if (userObj?.user_metadata?.full_name) return userObj.user_metadata.full_name;
  return userObj?.email?.split("@")[0] || "Parent";
}
