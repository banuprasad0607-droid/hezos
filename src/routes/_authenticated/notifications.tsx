import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import {
  Bell,
  CheckCheck,
  BookOpen,
  CalendarCheck,
  MessageSquare,
  Megaphone,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

interface Notif {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

const ICON: Record<string, React.ReactNode> = {
  homework: <BookOpen className="size-4 text-brand" />,
  attendance: <CalendarCheck className="size-4 text-success" />,
  remark: <MessageSquare className="size-4 text-warning" />,
  announcement: <Megaphone className="size-4 text-brand" />,
  fee: <Wallet className="size-4 text-danger" />,
};

function NotificationsPage() {
  const { user } = useAuth();
  usePageTitle("Notifications");
  const [items, setItems] = useState<Notif[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => setItems((data ?? []) as Notif[]));

    const ch = supabase
      .channel(`notif-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => setItems((p) => [payload.new as Notif, ...p]),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("read_at", null);
    setItems((p) => p.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
  };

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    setItems((p) => p.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
  };

  const unread = items.filter((n) => !n.read_at).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        breadcrumb={`${unread} unread`}
        actions={
          unread > 0 ? (
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 text-sm border border-border rounded-md inline-flex items-center gap-1"
            >
              <CheckCheck className="size-4" /> Mark all read
            </button>
          ) : null
        }
      />
      <div className="flex-1 overflow-y-auto p-8">
        {items.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <Bell className="size-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold mt-3">You're all caught up</h3>
            <p className="text-sm text-muted-foreground mt-1">
              New homework, remarks, fees and announcements appear here in real time.
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`p-4 flex gap-4 cursor-pointer hover:bg-secondary/40 ${!n.read_at ? "bg-brand/5" : ""}`}
              >
                <div className="size-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  {ICON[n.type] ?? <Bell className="size-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold truncate">{n.title}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                  {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                </div>
                {!n.read_at && <span className="size-2 rounded-full bg-brand mt-2" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
