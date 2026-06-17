import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { W as WhatsAppBroadcast } from "./WhatsAppBroadcast-C6eIuXsa.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import { a3 as Plus, W as Megaphone } from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/scheduler.mjs";
import "../_libs/isbot.mjs";
import "../_libs/recharts.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
import "../_libs/zod.mjs";
import "fs";
import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
import "./notify-BwRXED2l.mjs";
function AnnouncementsPage() {
  const { currentSchoolId: effectiveSchoolId, user, loading: tenantLoading } = useTenant();
  usePageTitle("Announcements");
  const [classes, setClasses] = reactExports.useState([]);
  const [items, setItems] = reactExports.useState([]);
  const [parents, setParents] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const [classId, setClassId] = reactExports.useState("");
  const load = async () => {
    if (!effectiveSchoolId) return;
    const { data } = await supabase
      .from("announcements")
      .select("id, title, body, created_at, class_id, classes(name)")
      .eq("school_id", effectiveSchoolId)
      .order("created_at", {
        ascending: false,
      });
    setItems(
      (data ?? []).map((a) => ({
        ...a,
        classes: Array.isArray(a.classes) ? (a.classes[0] ?? null) : a.classes,
      })),
    );
  };
  reactExports.useEffect(() => {
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
      .then(({ data }) => setParents(data ?? []));
    void load();
  }, [effectiveSchoolId]);
  const recipientsFor = (cid) => {
    const rows = cid ? parents.filter((p) => p.class_id === cid) : parents;
    return rows.map((p) => ({
      id: p.id,
      name: p.parent_name || `${p.full_name}'s parent`,
      phone: p.parent_phone,
      subtitle: p.full_name,
    }));
  };
  const submit = async (e) => {
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
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Loading...",
            }),
          ],
        }),
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading...",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Announcements",
        breadcrumb: "Communication",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
          onClick: () => setOpen(true),
          className:
            "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
            " New Announcement",
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex-1 overflow-y-auto p-8",
        children:
          items.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, {
                    className: "size-10 mx-auto text-muted-foreground",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                    className: "font-semibold mt-3",
                    children: "No announcements yet",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-sm text-muted-foreground mt-1",
                    children: "Post school-wide notices or target a single class.",
                  }),
                ],
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "space-y-4",
                children: items.map((a) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "article",
                    {
                      className: "bg-card border border-border rounded-xl p-5",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-start justify-between gap-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "min-w-0",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    children: a.classes?.name ?? "School-wide",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    children: new Date(a.created_at).toLocaleString(),
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                className: "font-semibold mt-1",
                                children: a.title,
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-sm text-muted-foreground mt-1 whitespace-pre-wrap",
                                children: a.body,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppBroadcast, {
                            label: "Broadcast",
                            recipients: recipientsFor(a.class_id),
                            defaultMessage: `📢 ${a.title}

${a.body}

— ${a.classes?.name ?? "School"} announcement`,
                          }),
                        ],
                      }),
                    },
                    a.id,
                  ),
                ),
              }),
      }),
      open &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: submit,
            className: "bg-card rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-lg",
                children: "New Announcement",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium",
                    children: "Send to",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                    value: classId,
                    onChange: (e) => setClassId(e.target.value),
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                        value: "",
                        children: "Entire school",
                      }),
                      classes.map((c) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "option",
                          { value: c.id, children: [c.name, " only"] },
                          c.id,
                        ),
                      ),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium",
                    children: "Title *",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    required: true,
                    value: title,
                    onChange: (e) => setTitle(e.target.value),
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium",
                    children: "Body *",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                    required: true,
                    value: body,
                    onChange: (e) => setBody(e.target.value),
                    rows: 4,
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 justify-end",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => setOpen(false),
                    className: "px-4 py-2 text-sm font-medium border border-border rounded-md",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    disabled: busy,
                    className:
                      "px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50",
                    children: busy ? "Sending…" : "Send",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { AnnouncementsPage as component };
