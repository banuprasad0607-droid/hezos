import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Trash2, RotateCcw, Users, GraduationCap, FileText, MessageSquare, BookOpen, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/recycle-bin")({
  component: RecycleBinPage,
});

type TrashItem = {
  id: string;
  type: "student" | "class" | "invoice" | "remark" | "exam" | "attendance";
  name: string;
  subtext: string;
  deleted_at: string;
};

function RecycleBinPage() {
  const { currentSchoolId: effectiveSchoolId, roles, loading: tenantLoading } = useTenant();
  const isSuper = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuper;

  usePageTitle("Recycle Bin");
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TrashItem["type"] | "all">("all");

  const loadDeletedItems = async () => {
    if (!effectiveSchoolId || !isAdmin) return;
    setLoading(true);
    try {
      const trashList: TrashItem[] = [];

      // 1. Fetch Deleted Students
      const { data: students } = await (supabase as any).from("students")
        .select("id, full_name, admission_number, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);

      (students ?? []).forEach((s: any) => {
        trashList.push({
          id: s.id,
          type: "student",
          name: s.full_name,
          subtext: `Admission No: ${s.admission_number || "—"}`,
          deleted_at: s.deleted_at!,
        });
      });

      // 2. Fetch Deleted Classes
      const { data: classes } = await (supabase as any).from("classes")
        .select("id, name, grade, section, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);

      (classes ?? []).forEach((c: any) => {
        trashList.push({
          id: c.id,
          type: "class",
          name: c.name,
          subtext: `Grade: ${c.grade || "—"} · Section: ${c.section || "—"}`,
          deleted_at: c.deleted_at!,
        });
      });

      // 3. Fetch Deleted Invoices
      const { data: invoices } = await (supabase as any).from("fee_invoices")
        .select("id, title, amount_due, due_date, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);

      (invoices ?? []).forEach((i: any) => {
        trashList.push({
          id: i.id,
          type: "invoice",
          name: i.title,
          subtext: `Amount Due: ₹${i.amount_due} · Due: ${i.due_date}`,
          deleted_at: i.deleted_at!,
        });
      });

      // 4. Fetch Deleted Remarks
      const { data: remarks } = await (supabase as any).from("remarks")
        .select("id, category, content, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);

      (remarks ?? []).forEach((r: any) => {
        trashList.push({
          id: r.id,
          type: "remark",
          name: `Remark Category: ${r.category}`,
          subtext: r.content.length > 50 ? `${r.content.slice(0, 50)}...` : r.content,
          deleted_at: r.deleted_at!,
        });
      });

      // 5. Fetch Deleted Exams
      const { data: exams } = await (supabase as any).from("exams")
        .select("id, name, date, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);

      (exams ?? []).forEach((e: any) => {
        trashList.push({
          id: e.id,
          type: "exam",
          name: e.name,
          subtext: `Exam Date: ${e.date || "—"}`,
          deleted_at: e.deleted_at!,
        });
      });

      // 6. Fetch Deleted Attendance
      const { data: att } = await (supabase as any).from("attendance")
        .select("id, date, status, deleted_at, students(full_name)")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);

      (att ?? []).forEach((a: any) => {
        trashList.push({
          id: a.id,
          type: "attendance",
          name: `Attendance record for ${a.students?.full_name || "Unknown Student"}`,
          subtext: `Date: ${a.date} · Status: ${a.status}`,
          deleted_at: a.deleted_at!,
        });
      });

      // Sort by deletion timestamp desc
      trashList.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());
      setItems(trashList);
    } catch (err: any) {
      toast.error(err.message || "Failed to load recycle bin records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDeletedItems();
  }, [effectiveSchoolId]);

  const handleRestore = async (item: TrashItem) => {
    if (!effectiveSchoolId) return;
    toast.loading("Restoring record...");
    try {
      let table = "";
      if (item.type === "student") table = "students";
      else if (item.type === "class") table = "classes";
      else if (item.type === "invoice") table = "fee_invoices";
      else if (item.type === "remark") table = "remarks";
      else if (item.type === "exam") table = "exams";
      else if (item.type === "attendance") table = "attendance";

      const { error } = await (supabase as any).from(table as any)
        .update({ deleted_at: null })
        .eq("id", item.id)
        .eq("school_id", effectiveSchoolId);

      if (error) throw error;

      // Cascade restore for invoices and exams
      if (item.type === "invoice") {
        await (supabase as any).from("fee_payments")
          .update({ deleted_at: null })
          .eq("invoice_id", item.id)
          .eq("school_id", effectiveSchoolId);
      } else if (item.type === "exam") {
        await (supabase as any).from("mark_entries")
          .update({ deleted_at: null })
          .eq("exam_id", item.id)
          .eq("school_id", effectiveSchoolId);
      }

      toast.dismiss();
      toast.success(`${item.type.toUpperCase()} record restored successfully.`);
      void loadDeletedItems();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to restore record.");
    }
  };

  const handleHardDelete = async (item: TrashItem) => {
    if (!effectiveSchoolId) return;
    if (!confirm("Are you sure you want to permanently delete this record? This action CANNOT be undone.")) return;
    
    toast.loading("Permanently deleting...");
    try {
      // Cascade hard delete for invoices and exams first to satisfy foreign key constraints
      if (item.type === "invoice") {
        await (supabase as any).from("fee_payments")
          .delete()
          .eq("invoice_id", item.id)
          .eq("school_id", effectiveSchoolId);
      } else if (item.type === "exam") {
        await (supabase as any).from("mark_entries")
          .delete()
          .eq("exam_id", item.id)
          .eq("school_id", effectiveSchoolId);
      }

      let table = "";
      if (item.type === "student") table = "students";
      else if (item.type === "class") table = "classes";
      else if (item.type === "invoice") table = "fee_invoices";
      else if (item.type === "remark") table = "remarks";
      else if (item.type === "exam") table = "exams";
      else if (item.type === "attendance") table = "attendance";

      const { error } = await (supabase as any).from(table as any)
        .delete()
        .eq("id", item.id)
        .eq("school_id", effectiveSchoolId);

      toast.dismiss();
      if (error) throw error;

      toast.success(`Record permanently purged.`);
      void loadDeletedItems();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to purge record.");
    }
  };

  if (tenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading recycle bin...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold">
        Unauthorized access. Only school administrators can access the Recycle Bin.
      </div>
    );
  }

  const filteredItems = items.filter((item) => activeTab === "all" || item.type === activeTab);

  const getIcon = (type: TrashItem["type"]) => {
    switch (type) {
      case "student": return <Users className="size-4 text-blue-500" />;
      case "class": return <GraduationCap className="size-4 text-emerald-500" />;
      case "invoice": return <FileText className="size-4 text-amber-500" />;
      case "remark": return <MessageSquare className="size-4 text-indigo-500" />;
      case "exam": return <BookOpen className="size-4 text-pink-500" />;
      case "attendance": return <Calendar className="size-4 text-sky-500" />;
    }
  };

  return (
    <>
      <PageHeader
        title="Recycle Bin"
        breadcrumb="Archived & soft-deleted records"
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground">
        {/* Tabs switcher */}
        <div className="flex gap-2 border-b border-border pb-px overflow-x-auto">
          {["all", "student", "class", "invoice", "remark", "exam", "attendance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab 
                  ? "border-brand text-brand" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground">Scanning archives...</div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground">
            <Trash2 className="size-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold mt-3">Recycle Bin Empty</h3>
            <p className="text-sm text-muted-foreground mt-1">No soft-deleted records matching this tab were found.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
            <div className="divide-y divide-border">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.subtext}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Deleted at: {new Date(item.deleted_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(item)}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-md inline-flex items-center gap-1 hover:bg-emerald-600 cursor-pointer"
                      title="Restore Record"
                    >
                      <RotateCcw className="size-3.5" /> Restore
                    </button>
                    <button
                      onClick={() => handleHardDelete(item)}
                      className="px-3 py-1.5 text-xs font-semibold bg-rose-500 text-white rounded-md inline-flex items-center gap-1 hover:bg-rose-600 cursor-pointer"
                      title="Permanently Purge"
                    >
                      <Trash2 className="size-3.5" /> Purge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
