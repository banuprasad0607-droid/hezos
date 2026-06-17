import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { W as WhatsAppBroadcast } from "./WhatsAppBroadcast-C6eIuXsa.mjs";
import { w as whatsappService } from "./whatsapp-service-rc8qIpIC.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  a3 as Plus,
  I as FileText,
  N as Image,
  C as Calendar,
  y as Download,
} from "../_libs/lucide-react.mjs";
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
function HomeworkPage() {
  const { currentSchoolId: effectiveSchoolId, user, loading: tenantLoading } = useTenant();
  const schoolId = effectiveSchoolId;
  usePageTitle("Homework");
  const [classes, setClasses] = reactExports.useState([]);
  const [items, setItems] = reactExports.useState([]);
  const [parents, setParents] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [classId, setClassId] = reactExports.useState("");
  const [title, setTitle] = reactExports.useState("");
  const [subject, setSubject] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const load = async () => {
    if (!effectiveSchoolId) return;
    const { data } = await supabase
      .from("homework")
      .select(
        "id, class_id, title, subject, description, due_date, file_url, file_type, created_at, classes(name)",
      )
      .eq("school_id", effectiveSchoolId)
      .order("created_at", {
        ascending: false,
      });
    setItems(
      (data ?? []).map((d) => ({
        ...d,
        classes: Array.isArray(d.classes) ? (d.classes[0] ?? null) : d.classes,
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
      .then(({ data }) => {
        setClasses(data ?? []);
        if (data?.[0] && !classId) setClassId(data[0].id);
      });
    supabase
      .from("students")
      .select("id, full_name, class_id, parent_name, parent_phone")
      .eq("school_id", effectiveSchoolId)
      .then(({ data }) => setParents(data ?? []));
    void load();
  }, [effectiveSchoolId]);
  const recipientsFor = (cid) =>
    parents
      .filter((p) => p.class_id === cid)
      .map((p) => ({
        id: p.id,
        name: p.parent_name || `${p.full_name}'s parent`,
        phone: p.parent_phone,
        subtitle: p.full_name,
      }));
  const submit = async (e) => {
    e.preventDefault();
    if (!schoolId || !user || !classId) return;
    setBusy(true);
    try {
      let fileUrl = null;
      let fileType = "none";
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
                await whatsappService.sendTemplateMessage(
                  schoolId,
                  phone,
                  template.id,
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
        title: "Homework",
        breadcrumb: "Operations",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
          onClick: () => setOpen(true),
          disabled: classes.length === 0,
          className:
            "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
            " Create Homework",
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
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, {
                    className: "size-10 mx-auto text-muted-foreground",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                    className: "font-semibold mt-3",
                    children: "No homework yet",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-sm text-muted-foreground mt-1",
                    children:
                      classes.length === 0
                        ? "Create a class first."
                        : "Post your first assignment.",
                  }),
                ],
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: items.map((h) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "article",
                    {
                      className: "bg-card border border-border rounded-xl p-5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
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
                                      children: h.subject ?? "General",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      children: "·",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      children: h.classes?.name,
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                  className: "font-semibold text-base mt-1 truncate",
                                  children: h.title,
                                }),
                              ],
                            }),
                            h.file_type !== "none" &&
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                className:
                                  "shrink-0 inline-flex items-center gap-1 text-xs bg-brand-soft text-brand px-2 py-1 rounded",
                                children: [
                                  h.file_type === "pdf"
                                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, {
                                        className: "size-3",
                                      })
                                    : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, {
                                        className: "size-3",
                                      }),
                                  h.file_type.toUpperCase(),
                                ],
                              }),
                          ],
                        }),
                        h.description &&
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-sm text-muted-foreground mt-2 line-clamp-3",
                            children: h.description,
                          }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex items-center justify-between mt-4",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "text-xs text-muted-foreground inline-flex items-center gap-1",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, {
                                  className: "size-3",
                                }),
                                h.due_date ? `Due ${h.due_date}` : "No due date",
                              ],
                            }),
                            h.file_url &&
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
                                href: h.file_url,
                                target: "_blank",
                                rel: "noreferrer",
                                className:
                                  "text-xs text-brand font-medium inline-flex items-center gap-1 hover:underline",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                                    className: "size-3",
                                  }),
                                  " Download",
                                ],
                              }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "mt-3 pt-3 border-t border-border flex justify-end",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppBroadcast, {
                            label: "Notify parents",
                            recipients: recipientsFor(h.class_id),
                            defaultMessage: `📚 New homework: ${h.title}${h.subject ? ` (${h.subject})` : ""}
${h.description ?? ""}${
                              h.due_date
                                ? `
Due: ${h.due_date}`
                                : ""
                            }${
                              h.file_url
                                ? `
Attachment: ${h.file_url}`
                                : ""
                            }`,
                          }),
                        }),
                      ],
                    },
                    h.id,
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
            className:
              "bg-card rounded-xl p-6 w-full max-w-lg space-y-4 shadow-lg max-h-[90vh] overflow-y-auto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-lg",
                children: "Create Homework",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium",
                        children: "Class *",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                        required: true,
                        value: classId,
                        onChange: (e) => setClassId(e.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                        children: classes.map((c) =>
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "option",
                            { value: c.id, children: c.name },
                            c.id,
                          ),
                        ),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium",
                        children: "Subject",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: subject,
                        onChange: (e) => setSubject(e.target.value),
                        placeholder: "Mathematics",
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                      }),
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
                    placeholder: "Algebraic Expressions Ex 4.2",
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium",
                    children: "Description",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                    value: description,
                    onChange: (e) => setDescription(e.target.value),
                    rows: 3,
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium",
                        children: "Due date",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        type: "date",
                        value: dueDate,
                        onChange: (e) => setDueDate(e.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium",
                        children: "Attach (PDF or image)",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        type: "file",
                        accept: ".pdf,image/*",
                        onChange: (e) => setFile(e.target.files?.[0] ?? null),
                        className: "mt-1 w-full text-sm",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 justify-end pt-2",
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
                    children: busy ? "Posting…" : "Post Homework",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { HomeworkPage as component };
