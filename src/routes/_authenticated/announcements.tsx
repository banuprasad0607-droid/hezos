import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Plus, Megaphone } from "lucide-react";
import { WhatsAppBroadcast, type BroadcastRecipient } from "@/components/WhatsAppBroadcast";

export const Route = createFileRoute("/_authenticated/announcements")({
  component: AnnouncementsPage,
});

interface Klass {
  id: string;
  name: string;
}
interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
  class_id: string | null;
  classes: { name: string } | null;
}

interface ParentRow {
  id: string;
  full_name: string;
  class_id: string | null;
  parent_name: string | null;
  parent_phone: string | null;
}

function AnnouncementsPage() {
  const { currentSchoolId: effectiveSchoolId, user, loading: tenantLoading } = useTenant();
  usePageTitle("Announcements");
  const [classes, setClasses] = useState<Klass[]>([]);
  const [items, setItems] = useState<Announcement[]>([]);
  const [parents, setParents] = useState<ParentRow[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [classId, setClassId] = useState<string>("");

  const load = async () => {
    if (!effectiveSchoolId) return;
    const { data } = await supabase
      .from("announcements")
      .select("id, title, body, created_at, class_id, classes(name)")
      .eq("school_id", effectiveSchoolId)
      .order("created_at", { ascending: false });
    setItems(
      (
        (data ?? []) as unknown as Array<
          Announcement & { classes: { name: string } | { name: string }[] | null }
        >
      ).map((a) => ({
        ...a,
        classes: Array.isArray(a.classes) ? (a.classes[0] ?? null) : a.classes,
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
      .then(({ data }) => setClasses(data ?? []));
    supabase
      .from("students")
      .select("id, full_name, class_id, parent_name, parent_phone")
      .eq("school_id", effectiveSchoolId)
      .then(({ data }) => setParents((data ?? []) as ParentRow[]));
    void load();
  }, [effectiveSchoolId]);

  const recipientsFor = (cid: string | null): BroadcastRecipient[] => {
    const rows = cid ? parents.filter((p) => p.class_id === cid) : parents;
    return rows.map((p) => ({
      id: p.id,
      name: p.parent_name || `${p.full_name}'s parent`,
      phone: p.parent_phone,
      subtitle: p.full_name,
    }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!effectiveSchoolId || !user) return;
    setBusy(true);
    const { error } = await supabase.from("announcements").insert({
      school_id: effectiveSchoolId,
      class_id: classId || null,
      title,
      body,
      created_by: user.id,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Announcement sent");
    setOpen(false);
    setTitle("");
    setBody("");
    setClassId("");
    void load();
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
        title="Announcements"
        breadcrumb="Communication"
        actions={
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1"
          >
            <Plus className="size-4" /> New Announcement
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto p-8">
        {items.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <Megaphone className="size-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold mt-3">No announcements yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Post school-wide notices or target a single class.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((a) => (
              <article key={a.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      <span>{a.classes?.name ?? "School-wide"}</span>
                      <span>·</span>
                      <span>{new Date(a.created_at).toLocaleString()}</span>
                    </div>
                    <h3 className="font-semibold mt-1">{a.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                      {a.body}
                    </p>
                  </div>
                  <WhatsAppBroadcast
                    label="Broadcast"
                    recipients={recipientsFor(a.class_id)}
                    defaultMessage={`📢 ${a.title}\n\n${a.body}\n\n— ${a.classes?.name ?? "School"} announcement`}
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
            className="bg-card rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg"
          >
            <h2 className="font-semibold text-lg">New Announcement</h2>
            <div>
              <label className="text-sm font-medium">Send to</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              >
                <option value="">Entire school</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} only
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Title *</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Body *</label>
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
            </div>
            <div className="flex gap-2 justify-end">
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
                {busy ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
