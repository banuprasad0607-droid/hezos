import { useState, useRef } from "react";
import { QRCodeImage, Barcode } from "@/routes/_authenticated/id-cards";
import { safeHtml2Canvas } from "@/lib/pdf-helper";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import {
  Download,
  Printer,
  X,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  QrCode,
  ExternalLink,
  Ban,
  RefreshCw,
} from "lucide-react";

export interface TeacherIdCardData {
  card_id?: string;
  teacher_id: string; // e.g. HEZO-TCH-2026-0001
  full_name: string;
  photo_url?: string | null;
  designation?: string;
  department?: string;
  subject_name?: string;
  class_name?: string;
  school_name: string;
  school_logo?: string | null;
  school_address?: string | null;
  school_phone?: string | null;
  card_number: string;
  verification_token: string;
  status: "active" | "revoked" | "expired";
  academic_year?: string;
  principal_signature?: string | null;
}

interface TeacherIdCardModalProps {
  cardData: TeacherIdCardData;
  onClose: () => void;
  onRevoke?: (cardId: string) => Promise<void>;
  onRegenerate?: (cardId: string) => Promise<void>;
}

export function TeacherIdCardModal({
  cardData,
  onClose,
  onRevoke,
  onRegenerate,
}: TeacherIdCardModalProps) {
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [downloading, setDownloading] = useState(false);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/teacher/${cardData.verification_token}`
      : `/verify/teacher/${cardData.verification_token}`;

  const currentYear = new Date().getFullYear();
  const academicYear = cardData.academic_year || `${currentYear}-${currentYear + 1}`;

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [85.6, 53.98 * 2 + 10], // CR-80 standard ID card dimensions
      });

      if (frontRef.current) {
        const canvas1 = await safeHtml2Canvas(frontRef.current, { scale: 3, useCORS: true });
        const img1 = canvas1.toDataURL("image/png");
        doc.addImage(img1, "PNG", 0, 0, 53.98, 85.6);
      }

      if (backRef.current) {
        doc.addPage([85.6, 53.98 * 2 + 10], "portrait");
        const canvas2 = await safeHtml2Canvas(backRef.current, { scale: 3, useCORS: true });
        const img2 = canvas2.toDataURL("image/png");
        doc.addImage(img2, "PNG", 0, 0, 53.98, 85.6);
      }

      doc.save(`Teacher_ID_${cardData.teacher_id}_${cardData.full_name.replace(/\s+/g, "_")}.pdf`);
      toast.success("Teacher ID Card PDF downloaded!");
    } catch (err: any) {
      toast.error("Failed to generate PDF: " + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <GraduationCap className="size-5 text-primary" />
              Teacher Official ID Card
            </h2>
            <p className="text-xs text-muted-foreground">
              Dual-sided physical & digital pass with cryptographic QR verification.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center justify-between">
          <div className="flex bg-muted p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveSide("front")}
              className={`px-4 py-1.5 rounded-lg transition ${
                activeSide === "front" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Front Side
            </button>
            <button
              onClick={() => setActiveSide("back")}
              className={`px-4 py-1.5 rounded-lg transition ${
                activeSide === "back" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Back Side
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Download className="size-3.5" /> {downloading ? "Exporting..." : "Download PDF"}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 border border-border bg-card hover:bg-muted text-foreground rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="size-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Card Canvas Preview */}
        <div className="flex justify-center p-6 bg-slate-950/40 rounded-2xl border border-border/60">
          {activeSide === "front" ? (
            /* FRONT SIDE OF ID CARD (CR80 Standard Ratio 54mm x 86mm ~ 270px x 430px) */
            <div
              ref={frontRef}
              className="w-[280px] h-[440px] bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-2xl flex flex-col justify-between border-2 border-indigo-500/30 relative overflow-hidden shrink-0"
            >
              {/* Decorative Background Hologram effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* School Banner */}
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                {cardData.school_logo ? (
                  <img
                    src={cardData.school_logo}
                    alt=""
                    className="size-10 rounded-lg object-cover bg-white p-0.5"
                  />
                ) : (
                  <div className="size-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
                    {cardData.school_name?.charAt(0) || "H"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-[12px] font-bold tracking-tight uppercase truncate">
                    {cardData.school_name}
                  </h4>
                  <p className="text-[9px] text-indigo-300 tracking-wider uppercase font-semibold">
                    Faculty Identity Pass
                  </p>
                </div>
              </div>

              {/* Photo & Badge */}
              <div className="flex flex-col items-center text-center my-auto py-2">
                <div className="relative mb-2">
                  {cardData.photo_url ? (
                    <img
                      src={cardData.photo_url}
                      alt=""
                      className="size-24 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
                    />
                  ) : (
                    <div className="size-24 rounded-2xl bg-slate-800 border-2 border-indigo-400/50 flex items-center justify-center text-slate-400 shadow-md">
                      <GraduationCap className="size-12 text-indigo-300" />
                    </div>
                  )}

                  {cardData.status === "revoked" && (
                    <div className="absolute inset-0 bg-red-600/85 backdrop-blur-xs rounded-2xl flex items-center justify-center text-[10px] font-bold text-white uppercase tracking-wider">
                      Revoked
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold tracking-tight text-white line-clamp-1">
                  {cardData.full_name}
                </h3>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded mt-1 border border-indigo-500/30">
                  {cardData.teacher_id}
                </span>
                <p className="text-[10px] font-medium text-emerald-400 mt-1">
                  {cardData.designation || "Senior Teacher"}
                </p>
              </div>

              {/* Subject, Class & QR Row */}
              <div className="bg-slate-950/80 rounded-xl p-2.5 border border-white/10 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1 space-y-1 text-left">
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">
                      Subject
                    </span>
                    <p className="text-[10px] font-semibold text-slate-100 truncate">
                      {cardData.subject_name || "General Faculty"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[8px] uppercase tracking-wider text-slate-400 block font-bold">
                      Class
                    </span>
                    <p className="text-[10px] font-semibold text-slate-100 truncate">
                      {cardData.class_name || "All Grades"}
                    </p>
                  </div>
                </div>

                <div className="p-1 bg-white rounded-lg shrink-0">
                  <QRCodeImage value={verificationUrl} className="size-14" />
                </div>
              </div>

              {/* Footer Barcode */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[8px] text-slate-400">
                <span>AY: {academicYear}</span>
                <span className="font-mono">{cardData.card_number}</span>
              </div>
            </div>
          ) : (
            /* BACK SIDE OF ID CARD */
            <div
              ref={backRef}
              className="w-[280px] h-[440px] bg-slate-900 text-white rounded-2xl p-5 shadow-2xl flex flex-col justify-between border-2 border-slate-700 relative shrink-0"
            >
              <div className="space-y-2 text-center border-b border-white/10 pb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Official Verification Notice
                </h4>
                <p className="text-[9px] text-slate-300 leading-relaxed">
                  This card is the property of {cardData.school_name}. If found, please return to the
                  school campus administration office.
                </p>
              </div>

              {/* School Details */}
              <div className="space-y-2 text-left text-[10px] text-slate-300 py-2">
                {cardData.school_address && (
                  <div className="flex items-start gap-1.5">
                    <Building2 className="size-3 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{cardData.school_address}</span>
                  </div>
                )}
                {cardData.school_phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3 text-indigo-400 shrink-0" />
                    <span>{cardData.school_phone}</span>
                  </div>
                )}
              </div>

              {/* QR Verification Info */}
              <div className="bg-slate-950 p-3 rounded-xl border border-white/10 text-center space-y-2">
                <div className="flex justify-center">
                  <div className="p-1 bg-white rounded-lg">
                    <QRCodeImage value={verificationUrl} className="size-16" />
                  </div>
                </div>
                <p className="text-[8px] text-slate-400">
                  Scan QR with any smartphone to verify credentials on HEZO Secure Gateway.
                </p>
              </div>

              {/* Barcode & Signature */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[8px] text-slate-400">
                <div>
                  <span className="block font-bold">Authorized Signature</span>
                  <span className="text-[7px] text-slate-500">Principal / Registrar</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-emerald-400">HEZO Verified</span>
                  <span className="font-mono text-[7px]">{cardData.card_number}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Verification Link & Administration Controls */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
          >
            <ExternalLink className="size-3.5" /> Live QR Verification Preview
          </a>

          <div className="flex items-center gap-2">
            {cardData.card_id && onRegenerate && (
              <button
                onClick={() => onRegenerate(cardData.card_id!)}
                className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted flex items-center gap-1 transition"
              >
                <RefreshCw className="size-3" /> Regenerate QR
              </button>
            )}

            {cardData.card_id && onRevoke && cardData.status === "active" && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to revoke this Teacher ID card? The QR code will immediately show as Revoked.")) {
                    onRevoke(cardData.card_id!);
                  }
                }}
                className="px-2.5 py-1 text-xs text-red-600 hover:text-red-700 border border-red-500/30 rounded-md hover:bg-red-500/10 flex items-center gap-1 transition"
              >
                <Ban className="size-3" /> Revoke Card
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
