import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Plus, FileText, Image as ImageIcon, Calendar, Download } from "lucide-react";
import { WhatsAppBroadcast, type BroadcastRecipient } from "@/components/WhatsAppBroadcast";
import { whatsappService } from "@/lib/whatsapp-service";

export const Route = createFileRoute("/_authenticated/homework")({
  component: HomeworkPage,
});

interface Klass {
  id: string;
  name: string;
}
interface Homework {
  id: string;
  class_id: string;
  title: string;
  subject: string | null;
  description: string | null;
  due_date: string | null;
  file_url: string | null;
  file_type: "pdf" | "image" | "none";
  created_at: string;
  classes?: { name: string } | null;
}

interface ParentRow {
  id: string;
  full_name: string;
  class_id: string | null;
  parent_name: string | null;
  parent_phone: string | null;
}

function HomeworkPage() {
  const { currentSchoolId: effectiveSchoolId, user, loading: tenantLoading } = useTenant();
  const schoolId = effectiveSchoolId;
  usePageTitle("Homework");
  const [classes, setClasses] = useState<Klass[]>([]);
  const [items, setItems] = useState<Homework[]>([]);
  const [parents, setParents] = useState<ParentRow[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // form
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    if (!effectiveSchoolId) return;
    const { data } = await supabase
      .from("homework")
      .select(
        "id, class_id, title, subject, description, due_date, file_url, file_type, created_at, classes(name)",
      )
      .eq("school_id", effectiveSchoolId)
      .order("created_at", { ascending: false });
    setItems(
      (
        (data ?? []) as unknown as Array<
          Homework & { classes: { name: string } | { name: string }[] | null }
        >
      ).map((d) => ({
        ...d,
        classes: Array.isArray(d.classes) ? (d.classes[0] ?? null) : d.classes,
      })),
    );
  };

  useEffect(() => {
    if (!effectiveSchoolId) return;
    supabase
      .from("classes")
      .select("id, name")
      .eq("school_id", effectiveSchoolId)
      .order("name")
      .then(({ data }) => {
        setClasses(data ?? []);
        if (data?.[0] && !classId) setClassId(data[0].id);
      });
    supabase
      .from("students")
      .select("id, full_name, class_id, parent_name, parent_phone")
      .eq("school_id", effectiveSchoolId)
      .then(({ data }) => setParents((data ?? []) as ParentRow[]));
    void load();
  }, [effectiveSchoolId]);

  const recipientsFor = (cid: string): BroadcastRecipient[] =>
    parents
      .filter((p) => p.class_id === cid)
      .map((p) => ({
        id: p.id,
        name: p.parent_name || `${p.full_name}'s parent`,
        phone: p.parent_phone,
        subtitle: p.full_name,
      }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!schoolId || !user || !classId) return;
    setBusy(true);
    try {
      let fileUrl: string | null = null;
      let fileType: "pdf" | "image" | "none" = "none";

      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
        const isImg = ["png", "jpg", "jpeg", "webp", "gif"].includes(ext);
        const isPdf = ext === "pdf";
        if (!isImg && !isPdf) throw new Error("Only PDF or image files are allowed");
        const path = `${schoolId}/${user.id}/${Date.now()}-${file.name}`;
        const { error: uErr } = await supabase.storage.from("homework-files").upload(path, file);
        if (uErr) throw uErr;
        const { data: pub } = supabase.storage.from("homework-files").getPublicUrl(path);
        fileUrl = pub.publicUrl;
        fileType = isPdf ? "pdf" : "image";
      }

      const { error } = await supabase.from("homework").insert({
        school_id: schoolId,
        class_id: classId,
        teacher_id: user.id,
        title,
        subject: subject || null,
        description: description || null,
        due_date: dueDate || null,
        file_url: fileUrl,
        file_type: fileType,
      });
      if (error) throw error;

      // Trigger WhatsApp homework alerts to parents of this class
      void (async () => {
        try {
          const { data: classStuds } = await supabase
            .from("students")
            .select("id, full_name, parent_user_id, emergency_contact")
            .eq("class_id", classId);

          if (classStuds && classStuds.length > 0) {
            const templates = await whatsappService.getTemplates(schoolId);
            const template = templates.find((t) => t.name === "homework_alert");
            if (template) {
              const { data: cls } = await supabase
                .from("classes")
                .select("name")
                .eq("id", classId)
                .single();
              const className = cls?.name || "Class";

              for (const stud of classStuds) {
                const phone = stud.emergency_contact || "+91 90000 00000";
                // Variables: ["class_name", "subject", "homework_title", "due_date"]
                await whatsappService.sendTemplateMessage(
                  schoolId,
                  phone,
                  template.id!,
                  [className, subject || "General", title, dueDate || "Tomorrow"],
                  stud.id,
                  stud.parent_user_id,
                );
              }
            }
          }
        } catch (err) {
          console.error("WhatsApp homework alert failed:", err);
        }
      })();

      toast.success("Homework posted. Parents are notified.");
      setOpen(false);
      setTitle("");
      setSubject("");
      setDescription("");
      setDueDate("");
      setFile(null);
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  if (tenantLoading) {
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
        title="Homework"
        breadcrumb="Operations"
        actions={
          <button
            onClick={() => setOpen(true)}
            disabled={classes.length === 0}
            className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50"
          >
            <Plus className="size-4" /> Create Homework
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-8">
        {items.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <FileText className="size-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold mt-3">No homework yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {classes.length === 0 ? "Create a class first." : "Post your first assignment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((h) => (
              <article key={h.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      <span>{h.subject ?? "General"}</span>
                      <span>·</span>
                      <span>{h.classes?.name}</span>
                    </div>
                    <h3 className="font-semibold text-base mt-1 truncate">{h.title}</h3>
                  </div>
                  {h.file_type !== "none" && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs bg-brand-soft text-brand px-2 py-1 rounded">
                      {h.file_type === "pdf" ? (
                        <FileText className="size-3" />
                      ) : (
                        <ImageIcon className="size-3" />
                      )}
                      {h.file_type.toUpperCase()}
                    </span>
                  )}
                </div>
                {h.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{h.description}</p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <Calendar className="size-3" />
                    {h.due_date ? `Due ${h.due_date}` : "No due date"}
                  </div>
                  {h.file_url && (
                    <a
                      href={h.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-brand font-medium inline-flex items-center gap-1 hover:underline"
                    >
                      <Download className="size-3" /> Download
                    </a>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex justify-end">
                  <WhatsAppBroadcast
                    label="Notify parents"
                    recipients={recipientsFor(h.class_id)}
                    defaultMessage={`📚 New homework: ${h.title}${h.subject ? ` (${h.subject})` : ""}\n${h.description ?? ""}${h.due_date ? `\nDue: ${h.due_date}` : ""}${h.file_url ? `\nAttachment: ${h.file_url}` : ""}`}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="bg-card rounded-xl p-6 w-full max-w-lg space-y-4 shadow-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-semibold text-lg">Create Homework</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Class *</label>
                <select
                  required
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Mathematics"
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Title *</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Algebraic Expressions Ex 4.2"
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Due date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Attach (PDF or image)</label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="mt-1 w-full text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50"
              >
                {busy ? "Posting…" : "Post Homework"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
