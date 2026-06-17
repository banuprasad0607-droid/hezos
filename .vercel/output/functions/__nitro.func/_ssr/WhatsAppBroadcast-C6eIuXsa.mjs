import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { w as whatsappLink } from "./notify-BwRXED2l.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { X as MessageCircle, au as X, a1 as Phone, aa as Send } from "../_libs/lucide-react.mjs";
function WhatsAppBroadcast({
  label = "WhatsApp",
  recipients,
  defaultMessage,
  disabled,
  buildMessage,
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState(defaultMessage);
  const [selected, setSelected] = reactExports.useState({});
  reactExports.useEffect(() => {
    if (open) setMessage(defaultMessage);
  }, [open, defaultMessage]);
  const valid = reactExports.useMemo(
    () => recipients.filter((r) => whatsappLink(r.phone, "x")),
    [recipients],
  );
  reactExports.useEffect(() => {
    if (!open) return;
    const next = {};
    valid.forEach((r) => {
      next[r.id] = true;
    });
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
  if (recipients.length === 1) {
    const r = recipients[0];
    const text = buildMessage ? buildMessage(r) : defaultMessage;
    const link = whatsappLink(r.phone, text);
    const disabledBtn = disabled || !link;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
      href: link ?? "#",
      target: "_blank",
      rel: "noreferrer",
      onClick: (e) => {
        if (disabledBtn) {
          e.preventDefault();
          toast.error(r.phone ? "Invalid phone number" : "No parent phone on file");
        }
      },
      "aria-disabled": disabledBtn,
      className: `px-3 py-1.5 text-sm font-medium rounded-md inline-flex items-center gap-1.5 bg-success-soft text-success ring-1 ring-success/30 hover:bg-success/15 ${disabledBtn ? "opacity-50 cursor-not-allowed" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4" }),
        " ",
        label,
      ],
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
        type: "button",
        onClick: () => setOpen(true),
        disabled: disabled || recipients.length === 0,
        className:
          "px-3 py-1.5 text-sm font-medium rounded-md inline-flex items-center gap-1.5 bg-success-soft text-success ring-1 ring-success/30 hover:bg-success/15 disabled:opacity-50",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-4" }),
          " ",
          label,
        ],
      }),
      open &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            onClick: (e) => e.stopPropagation(),
            className: "bg-card rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] flex flex-col",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "p-5 border-b border-border flex items-center justify-between",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", {
                        className: "font-semibold text-base flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, {
                            className: "size-4 text-success",
                          }),
                          " WhatsApp Broadcast",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                        className: "text-xs text-muted-foreground mt-0.5",
                        children: [
                          valid.length,
                          " of ",
                          recipients.length,
                          " parents have valid numbers",
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => setOpen(false),
                    className:
                      "size-8 rounded-md hover:bg-secondary inline-flex items-center justify-center",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "p-5 space-y-3 border-b border-border",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className:
                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                    children: "Message",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                    value: message,
                    onChange: (e) => setMessage(e.target.value),
                    rows: 3,
                    className:
                      "w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                  }),
                  buildMessage &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-[10px] text-muted-foreground",
                      children:
                        "Per-recipient details (like the student's name) are appended automatically.",
                    }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "flex-1 overflow-y-auto p-2",
                children:
                  valid.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "p-8 text-center text-sm text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, {
                            className: "size-8 mx-auto mb-2 opacity-50",
                          }),
                          "No parent phone numbers on file. Add them on the Students page.",
                        ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", {
                        className: "divide-y divide-border",
                        children: valid.map((r) => {
                          const text = buildMessage ? buildMessage(r) : message;
                          const link = whatsappLink(r.phone, text);
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "li",
                            {
                              className: "flex items-center gap-3 px-3 py-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                  type: "checkbox",
                                  checked: !!selected[r.id],
                                  onChange: (e) =>
                                    setSelected((s) => ({ ...s, [r.id]: e.target.checked })),
                                  className: "size-4",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex-1 min-w-0",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "text-sm font-medium truncate",
                                      children: r.name,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                      className: "text-[11px] text-muted-foreground truncate",
                                      children: [r.subtitle ? `${r.subtitle} · ` : "", r.phone],
                                    }),
                                  ],
                                }),
                                link &&
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
                                    href: link,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "text-xs text-success font-semibold hover:underline",
                                    children: "Open",
                                  }),
                              ],
                            },
                            r.id,
                          );
                        }),
                      }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "p-4 border-t border-border flex items-center justify-between gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                    className: "text-xs text-muted-foreground",
                    children: [selectedList.length, " selected"],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        onClick: () => setOpen(false),
                        className: "px-3 py-2 text-sm border border-border rounded-md",
                        children: "Close",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                        onClick: openAll,
                        disabled: selectedList.length === 0,
                        className:
                          "px-4 py-2 text-sm font-semibold bg-success text-white rounded-md inline-flex items-center gap-1 disabled:opacity-50",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }),
                          " Open ",
                          selectedList.length,
                          " chat",
                          selectedList.length === 1 ? "" : "s",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { WhatsAppBroadcast as W };
