import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, X, Phone } from "lucide-react";
import { whatsappLink } from "@/lib/notify";
import { toast } from "sonner";

export interface BroadcastRecipient {
  id: string;
  name: string;
  phone: string | null | undefined;
  subtitle?: string;
}

interface Props {
  label?: string;
  recipients: BroadcastRecipient[];
  defaultMessage: string;
  disabled?: boolean;
  /** Optional per-recipient message builder. Falls back to defaultMessage. */
  buildMessage?: (r: BroadcastRecipient) => string;
}

export function WhatsAppBroadcast({ label = "WhatsApp", recipients, defaultMessage, disabled, buildMessage }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => { if (open) setMessage(defaultMessage); }, [open, defaultMessage]);

  const valid = useMemo(
    () => recipients.filter((r) => whatsappLink(r.phone, "x")),
    [recipients]
  );

  useEffect(() => {
    if (!open) return;
    const next: Record<string, boolean> = {};
    valid.forEach((r) => { next[r.id] = true; });
    setSelected(next);
  }, [open, valid]);

  const selectedList = valid.filter((r) => selected[r.id]);

  const openAll = async () => {
    if (selectedList.length === 0) return toast.error("No recipients selected");
    let opened = 0;
    for (const r of selectedList) {
      const text = buildMessage ? buildMessage(r) : message;
      const link = whatsappLink(r.phone, text);
      if (!link) continue;
      const w = window.open(link, "_blank", "noopener,noreferrer");
      if (w) opened += 1;
      await new Promise((res) => setTimeout(res, 250));
    }
    if (opened === 0) toast.error("Browser blocked pop-ups. Allow pop-ups for this site.");
    else toast.success(`Opened ${opened} WhatsApp chat${opened > 1 ? "s" : ""}`);
  };

  // Direct redirect when there's a single recipient — skip the modal entirely.
  if (recipients.length === 1) {
    const r = recipients[0];
    const text = buildMessage ? buildMessage(r) : defaultMessage;
    const link = whatsappLink(r.phone, text);
    const disabledBtn = disabled || !link;
    return (
      <a
        href={link ?? "#"}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          if (disabledBtn) {
            e.preventDefault();
            toast.error(r.phone ? "Invalid phone number" : "No parent phone on file");
          }
        }}
        aria-disabled={disabledBtn}
        className={`px-3 py-1.5 text-sm font-medium rounded-md inline-flex items-center gap-1.5 bg-success-soft text-success ring-1 ring-success/30 hover:bg-success/15 ${disabledBtn ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <MessageCircle className="size-4" /> {label}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled || recipients.length === 0}
        className="px-3 py-1.5 text-sm font-medium rounded-md inline-flex items-center gap-1.5 bg-success-soft text-success ring-1 ring-success/30 hover:bg-success/15 disabled:opacity-50"
      >
        <MessageCircle className="size-4" /> {label}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-card rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-base flex items-center gap-2"><MessageCircle className="size-4 text-success" /> WhatsApp Broadcast</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{valid.length} of {recipients.length} parents have valid numbers</p>
              </div>
              <button onClick={() => setOpen(false)} className="size-8 rounded-md hover:bg-secondary inline-flex items-center justify-center"><X className="size-4" /></button>
            </div>

            <div className="p-5 space-y-3 border-b border-border">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              />
              {buildMessage && <p className="text-[10px] text-muted-foreground">Per-recipient details (like the student's name) are appended automatically.</p>}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {valid.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Phone className="size-8 mx-auto mb-2 opacity-50" />
                  No parent phone numbers on file. Add them on the Students page.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {valid.map((r) => {
                    const text = buildMessage ? buildMessage(r) : message;
                    const link = whatsappLink(r.phone, text);
                    return (
                      <li key={r.id} className="flex items-center gap-3 px-3 py-2">
                        <input
                          type="checkbox"
                          checked={!!selected[r.id]}
                          onChange={(e) => setSelected((s) => ({ ...s, [r.id]: e.target.checked }))}
                          className="size-4"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{r.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{r.subtitle ? `${r.subtitle} · ` : ""}{r.phone}</p>
                        </div>
                        {link && (
                          <a href={link} target="_blank" rel="noreferrer" className="text-xs text-success font-semibold hover:underline">Open</a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{selectedList.length} selected</span>
              <div className="flex gap-2">
                <button onClick={() => setOpen(false)} className="px-3 py-2 text-sm border border-border rounded-md">Close</button>
                <button onClick={openAll} disabled={selectedList.length === 0} className="px-4 py-2 text-sm font-semibold bg-success text-white rounded-md inline-flex items-center gap-1 disabled:opacity-50">
                  <Send className="size-4" /> Open {selectedList.length} chat{selectedList.length === 1 ? "" : "s"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
