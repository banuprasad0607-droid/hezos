import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import {
  a as Route$2,
  f as useTenant,
  c as usePageTitle,
  P as PageHeader,
} from "./router-CplsJ0Ue.mjs";
import { I as ImageCropper } from "./ImageCropper-tEh58K4K.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { w as whatsappLink } from "./notify-BwRXED2l.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  A as ArrowLeft,
  j as Camera,
  U as Mail,
  a1 as Phone,
  i as CalendarCheck,
  f as BookOpen,
  Y as MessageSquare,
  at as Wallet,
} from "../_libs/lucide-react.mjs";
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
function StudentProfile() {
  const { studentId } = Route$2.useParams();
  const { currentSchoolId: effectiveSchoolId, loading: tenantLoading } = useTenant();
  usePageTitle("Student Profile");
  const [student, setStudent] = reactExports.useState(null);
  const [attendance, setAttendance] = reactExports.useState([]);
  const [homework, setHomework] = reactExports.useState([]);
  const [remarks, setRemarks] = reactExports.useState([]);
  const [invoices, setInvoices] = reactExports.useState([]);
  const [cropTarget, setCropTarget] = reactExports.useState(null);
  const [updatingPhoto, setUpdatingPhoto] = reactExports.useState(false);
  const saveProfilePhoto = async (base64) => {
    if (!student) return;
    setCropTarget(null);
    setUpdatingPhoto(true);
    try {
      const byteString = atob(base64.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], {
        type: "image/jpeg",
      });
      const path = `${student.school_id}/student/${studentId}-${Date.now()}.jpg`;
      const { error: uploadErr } = await supabase.storage
        .from("student-photos")
        .upload(path, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadErr) throw uploadErr;
      const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);
      const photoUrl = pubUrl.publicUrl;
      const { error: dbErr } = await supabase
        .from("students")
        .update({
          photo_url: photoUrl,
        })
        .eq("id", studentId)
        .eq("school_id", student.school_id);
      if (dbErr) throw dbErr;
      setStudent({
        ...student,
        photo_url: photoUrl,
      });
      toast.success("Student photo updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile photo.");
    } finally {
      setUpdatingPhoto(false);
    }
  };
  reactExports.useEffect(() => {
    if (!effectiveSchoolId) return;
    (async () => {
      const { data } = await supabase
        .from("students")
        .select(
          "id, full_name, admission_number, roll_number, photo_url, date_of_birth, gender, address, parent_name, parent_email, parent_phone, parent_user_id, class_id, school_id, classes(name)",
        )
        .eq("id", studentId)
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null)
        .maybeSingle();
      if (!data) return;
      const norm = {
        ...data,
        classes: Array.isArray(data.classes) ? (data.classes[0] ?? null) : data.classes,
      };
      setStudent(norm);
      const [att, rem, inv, hw] = await Promise.all([
        supabase
          .from("attendance")
          .select("date, status")
          .eq("student_id", studentId)
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("date", {
            ascending: false,
          })
          .limit(60),
        supabase
          .from("remarks")
          .select("id, category, content, created_at")
          .eq("student_id", studentId)
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("created_at", {
            ascending: false,
          })
          .limit(30),
        supabase
          .from("fee_invoices")
          .select("id, title, period, amount_due, amount_paid, status, due_date")
          .eq("student_id", studentId)
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("created_at", {
            ascending: false,
          }),
        norm.class_id
          ? supabase
              .from("homework")
              .select("id, title, subject, due_date, created_at")
              .eq("class_id", norm.class_id)
              .eq("school_id", effectiveSchoolId)
              .order("created_at", {
                ascending: false,
              })
              .limit(20)
          : Promise.resolve({
              data: [],
            }),
      ]);
      setAttendance(att.data ?? []);
      setRemarks(rem.data ?? []);
      setInvoices(inv.data ?? []);
      setHomework(hw.data ?? []);
    })();
  }, [studentId, effectiveSchoolId]);
  if (!student) {
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
      className: "p-8 text-sm text-muted-foreground",
      children: "Loading student profile…",
    });
  }
  const present = attendance.filter((a) => a.status === "present").length;
  const attRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const totalDue = invoices.reduce((s, i) => s + Number(i.amount_due), 0);
  const totalPaid = invoices.reduce((s, i) => s + Number(i.amount_paid), 0);
  const outstanding = totalDue - totalPaid;
  const wa = whatsappLink(
    student.parent_phone,
    `Hello ${student.parent_name ?? ""}, this is regarding ${student.full_name}.`,
  );
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: student.full_name,
        breadcrumb: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
          to: "/students",
          className: "inline-flex items-center gap-1 hover:text-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3" }),
            " Students",
          ],
        }),
        actions: wa
          ? /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
              href: wa,
              target: "_blank",
              rel: "noreferrer",
              className: "px-3 py-1.5 text-sm font-medium bg-[#25D366] text-white rounded-md",
              children: "WhatsApp Parent",
            })
          : null,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
            className: "bg-card border border-border rounded-xl p-6 flex items-center gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "relative group size-20 rounded-full bg-brand/20 text-brand flex items-center justify-center text-2xl font-bold overflow-hidden border border-border shrink-0",
                children: [
                  student.photo_url
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                        src: student.photo_url,
                        alt: "",
                        className: "size-full object-cover",
                      })
                    : student.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase(),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                    className:
                      "absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer text-white",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "size-5 mb-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className: "text-[9px] uppercase font-bold tracking-wider",
                        children: updatingPhoto ? "Saving..." : "Update",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        type: "file",
                        accept: "image/*",
                        disabled: updatingPhoto,
                        onChange: (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setCropTarget(reader.result);
                            reader.readAsDataURL(file);
                          }
                        },
                        className: "hidden",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex-1 grid grid-cols-2 md:grid-cols-4 gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Admission #",
                    value: student.admission_number ?? "—",
                    mono: true,
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Class",
                    value: student.classes?.name ?? "—",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Roll #",
                    value: student.roll_number ?? "—",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "DOB",
                    value: student.date_of_birth ?? "—",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Gender",
                    value: student.gender ?? "—",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Parent",
                    value: student.parent_name ?? "—",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Contact",
                    value: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "text-xs space-y-0.5",
                      children: [
                        student.parent_email &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className: "inline-flex items-center gap-1",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3" }),
                              student.parent_email,
                            ],
                          }),
                        student.parent_phone &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className: "inline-flex items-center gap-1",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3" }),
                              student.parent_phone,
                            ],
                          }),
                        !student.parent_email && !student.parent_phone && "—",
                      ],
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Address",
                    value: student.address ?? "—",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-4 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "size-4" }),
                label: "Attendance (60d)",
                value: `${attRate}%`,
                hint: `${present}/${attendance.length} present`,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4" }),
                label: "Homework posted",
                value: String(homework.length),
                hint: "Last 20 items",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "size-4" }),
                label: "Teacher remarks",
                value: String(remarks.length),
                hint: "Total",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-4" }),
                label: "Outstanding",
                value: `₹${outstanding.toFixed(0)}`,
                hint: `Of ₹${totalDue.toFixed(0)} billed`,
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                title: "Attendance — last 60 days",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex flex-wrap gap-1",
                  children: [
                    attendance
                      .slice()
                      .reverse()
                      .map((a) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            title: `${a.date} · ${a.status}`,
                            className: `size-5 rounded ${a.status === "present" ? "bg-success" : a.status === "absent" ? "bg-danger" : a.status === "late" ? "bg-warning" : "bg-brand"}`,
                          },
                          a.date,
                        ),
                      ),
                    attendance.length === 0 &&
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children: "No records.",
                      }),
                  ],
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                title: "Remarks timeline",
                children:
                  remarks.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children: "No remarks yet.",
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "space-y-3",
                        children: remarks.slice(0, 8).map((r) =>
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className: "border-l-2 border-brand pl-3",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className:
                                    "text-[10px] uppercase tracking-wider font-bold text-brand",
                                  children: r.category,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                  className: "text-sm italic mt-0.5",
                                  children: ['"', r.content, '"'],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-[10px] text-muted-foreground mt-0.5",
                                  children: new Date(r.created_at).toLocaleDateString(),
                                }),
                              ],
                            },
                            r.id,
                          ),
                        ),
                      }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                title: "Fee history",
                children:
                  invoices.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children: "No invoices.",
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "space-y-2",
                        children: invoices.map((i) =>
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              className:
                                "flex items-center justify-between text-sm border-b border-border pb-2 last:border-0",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "font-medium",
                                      children: i.title,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                      className: "text-xs text-muted-foreground",
                                      children: [i.period, " · Due ", i.due_date ?? "—"],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "text-right",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                      className: "font-mono text-xs",
                                      children: [
                                        "₹",
                                        Number(i.amount_paid).toFixed(0),
                                        " / ₹",
                                        Number(i.amount_due).toFixed(0),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      className: `text-[10px] uppercase font-semibold ${i.status === "paid" ? "text-success" : i.status === "partial" ? "text-warning" : "text-muted-foreground"}`,
                                      children: i.status,
                                    }),
                                  ],
                                }),
                              ],
                            },
                            i.id,
                          ),
                        ),
                      }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
            title: "Recent class homework",
            children:
              homework.length === 0
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-sm text-muted-foreground",
                    children: "No homework posted.",
                  })
                : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                    children: homework.map((h) =>
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "border border-border rounded-lg p-3",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className:
                                "text-[10px] uppercase tracking-wider font-bold text-muted-foreground",
                              children: h.subject ?? "General",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "font-medium text-sm",
                              children: h.title,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                              className: "text-xs text-muted-foreground mt-1",
                              children: [
                                "Due ",
                                h.due_date ?? "—",
                                " · Posted ",
                                new Date(h.created_at).toLocaleDateString(),
                              ],
                            }),
                          ],
                        },
                        h.id,
                      ),
                    ),
                  }),
          }),
        ],
      }),
      cropTarget &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]",
          onClick: (e) => e.stopPropagation(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-card p-6 rounded-xl w-full max-w-sm",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                className: "font-bold text-base mb-3",
                children: "Crop Profile Photo",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImageCropper, {
                imageSrc: cropTarget,
                onCrop: saveProfilePhoto,
                onCancel: () => setCropTarget(null),
                circular: true,
              }),
            ],
          }),
        }),
    ],
  });
}
function Field({ label, value, mono }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-[10px] uppercase tracking-wider text-muted-foreground",
        children: label,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: `text-sm font-medium mt-0.5 ${mono ? "font-mono" : ""}`,
        children: value,
      }),
    ],
  });
}
function Kpi({ icon, label, value, hint }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-4",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center gap-2 text-muted-foreground",
        children: [
          icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
            className: "text-xs uppercase tracking-wider",
            children: label,
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-2xl font-bold mt-2",
        children: value,
      }),
      hint &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "text-xs text-muted-foreground mt-0.5",
          children: hint,
        }),
    ],
  });
}
function Card({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
        className: "font-semibold mb-3",
        children: title,
      }),
      children,
    ],
  });
}
export { StudentProfile as component };
