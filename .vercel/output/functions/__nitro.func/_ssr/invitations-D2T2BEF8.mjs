import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useServerFn, b as provisionTeacher } from "./platform.functions-CG6gbu1e.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import {
  f as useTenant,
  e as useSchoolName,
  c as usePageTitle,
  P as PageHeader,
} from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  Q as KeyRound,
  w as Copy,
  U as Mail,
  au as X,
  r as CircleCheck,
  u as Clock,
} from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "./server-DOPhEqh1.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CDUZ4KwQ.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/zod.mjs";
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
function InvitationsPage() {
  const {
    currentSchoolId: effectiveSchoolId,
    profile,
    roles,
    user,
    loading: tenantLoading,
  } = useTenant();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const createTeacher = useServerFn(provisionTeacher);
  const schoolDisplayName = useSchoolName();
  usePageTitle("Invite Teachers");
  const [mode, setMode] = reactExports.useState("direct");
  const [password, setPassword] = reactExports.useState("");
  const [invites, setInvites] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [email, setEmail] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teacher_invitations")
      .select("*")
      .order("created_at", {
        ascending: false,
      });
    if (error) toast.error(error.message);
    setInvites(data ?? []);
    setLoading(false);
  };
  reactExports.useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);
  const genPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const arr = new Uint8Array(12);
    crypto.getRandomValues(arr);
    let p = "";
    for (let i = 0; i < arr.length; i++) p += chars[arr[i] % chars.length];
    setPassword(p);
  };
  const invite = async (e) => {
    e.preventDefault();
    if (!effectiveSchoolId || !user) return;
    setSubmitting(true);
    try {
      if (mode === "direct") {
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters");
          setSubmitting(false);
          return;
        }
        await createTeacher({
          data: {
            email: email.trim().toLowerCase(),
            full_name: fullName.trim() || email.split("@")[0],
            password,
          },
        });
        toast.success(`Teacher ${email} created. Share the password with them.`);
      } else {
        const { error } = await supabase.from("teacher_invitations").insert({
          school_id: effectiveSchoolId,
          email: email.trim().toLowerCase(),
          full_name: fullName.trim() || null,
          invited_by: user.id,
        });
        if (error) throw new Error(error.message);
        toast.success(`Invitation created for ${email}`);
      }
      setEmail("");
      setFullName("");
      setPassword("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };
  const revoke = async (id) => {
    const { error } = await supabase
      .from("teacher_invitations")
      .update({
        revoked_at: /* @__PURE__ */ new Date().toISOString(),
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Invitation revoked");
    load();
  };
  const inviteLink = (token) => `${window.location.origin}/signup?invite=${token}`;
  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const mailto = (inv) => {
    const subject = encodeURIComponent(`You're invited to join ${schoolDisplayName} as a Teacher`);
    const body = encodeURIComponent(`Hi${inv.full_name ? " " + inv.full_name : ""},

You've been invited to join as a teacher at ${schoolDisplayName}.

Accept your invitation and create your account here:
${inviteLink(inv.token)}

This link expires on ${new Date(inv.expires_at).toLocaleDateString()}.

— ${profile?.full_name ?? "Your school admin"}`);
    window.location.href = `mailto:${inv.email}?subject=${subject}&body=${body}`;
  };
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
          title: "Invite Teachers",
          breadcrumb: "Admin only",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "text-sm text-muted-foreground",
          children: "You need admin access to invite teachers.",
        }),
      ],
    });
  }
  const statusOf = (inv) => {
    if (inv.accepted_at)
      return {
        label: "Accepted",
        tone: "bg-success/10 text-success",
        Icon: CircleCheck,
      };
    if (inv.revoked_at)
      return {
        label: "Revoked",
        tone: "bg-muted text-muted-foreground",
        Icon: X,
      };
    if (new Date(inv.expires_at) < /* @__PURE__ */ new Date())
      return {
        label: "Expired",
        tone: "bg-muted text-muted-foreground",
        Icon: Clock,
      };
    return {
      label: "Pending",
      tone: "bg-warning/10 text-warning",
      Icon: Clock,
    };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Teachers", breadcrumb: "Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "grid lg:grid-cols-[380px_1fr] gap-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onSubmit: invite,
            className: "bg-card border border-border rounded-lg p-5 h-fit space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                    className: "text-sm font-semibold",
                    children: "Add teacher",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-xs text-muted-foreground mt-0.5",
                    children: "Create credentials directly, or send a signup invitation.",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-1 p-1 bg-muted rounded-md",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => setMode("direct"),
                    className: `text-xs py-1.5 rounded ${mode === "direct" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground"}`,
                    children: "Create with password",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => setMode("invite"),
                    className: `text-xs py-1.5 rounded ${mode === "invite" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground"}`,
                    children: "Send invitation",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-xs font-medium",
                    children: "Teacher email",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    type: "email",
                    required: true,
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    placeholder: "teacher@school.edu",
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                    className: "text-xs font-medium",
                    children: ["Full name ", mode === "invite" && "(optional)"],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    required: mode === "direct",
                    value: fullName,
                    onChange: (e) => setFullName(e.target.value),
                    placeholder: "Asha Verma",
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                  }),
                ],
              }),
              mode === "direct" &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                      className: "text-xs font-medium",
                      children: "Temporary password",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "mt-1 flex gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          type: "text",
                          required: true,
                          minLength: 8,
                          value: password,
                          onChange: (e) => setPassword(e.target.value),
                          placeholder: "Min 8 characters",
                          className:
                            "flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          type: "button",
                          onClick: genPassword,
                          className:
                            "px-3 py-2 text-xs border border-border rounded-md hover:bg-muted",
                          children: "Generate",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-xs text-muted-foreground mt-1",
                      children: "Share this with the teacher. They can change it after signing in.",
                    }),
                  ],
                }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                type: "submit",
                disabled: submitting,
                className:
                  "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50",
                children: submitting
                  ? "Creating…"
                  : mode === "direct"
                    ? "Create teacher"
                    : "Create invitation",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-card border border-border rounded-lg overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "px-5 py-3 border-b border-border flex items-center justify-between",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                    className: "text-sm font-semibold",
                    children: "Teachers & invitations",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                    className: "text-xs text-muted-foreground",
                    children: [invites.length, " total"],
                  }),
                ],
              }),
              loading
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "p-8 text-sm text-muted-foreground",
                    children: "Loading…",
                  })
                : invites.length === 0
                  ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "p-8 text-sm text-muted-foreground text-center",
                      children: "No invitations yet. Send your first one to onboard a teacher.",
                    })
                  : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", {
                      className: "divide-y divide-border",
                      children: invites.map((inv) => {
                        const s = statusOf(inv);
                        const isActive =
                          !inv.accepted_at &&
                          !inv.revoked_at &&
                          new Date(inv.expires_at) >= /* @__PURE__ */ new Date();
                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "li",
                          {
                            className: "px-5 py-4",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex items-start justify-between gap-4 flex-wrap",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "min-w-0 flex-1",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex items-center gap-2 flex-wrap",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-sm font-medium truncate",
                                          children: inv.email,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                          className: `inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s.tone}`,
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(s.Icon, {
                                              className: "size-3",
                                            }),
                                            s.label,
                                          ],
                                        }),
                                      ],
                                    }),
                                    inv.full_name &&
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                        className: "text-xs text-muted-foreground mt-0.5",
                                        children: inv.full_name,
                                      }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                      className: "text-xs text-muted-foreground mt-1",
                                      children: [
                                        inv.accepted_at ? "Joined" : "Expires",
                                        " ",
                                        new Date(
                                          inv.accepted_at ?? inv.expires_at,
                                        ).toLocaleDateString(),
                                      ],
                                    }),
                                    inv.temp_password &&
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className:
                                          "mt-2 flex items-center gap-2 text-xs bg-muted px-2 py-1.5 rounded-md",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, {
                                            className: "size-3 text-muted-foreground",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className: "font-mono",
                                            children: inv.temp_password,
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                            type: "button",
                                            onClick: () => copy(inv.temp_password),
                                            className:
                                              "ml-auto text-muted-foreground hover:text-foreground",
                                            "aria-label": "Copy password",
                                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, {
                                              className: "size-3",
                                            }),
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                                isActive &&
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: () => copy(inviteLink(inv.token)),
                                        className:
                                          "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, {
                                            className: "size-3",
                                          }),
                                          " Copy link",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: () => mailto(inv),
                                        className:
                                          "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, {
                                            className: "size-3",
                                          }),
                                          " Email",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: () => revoke(inv.id),
                                        className:
                                          "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted text-muted-foreground",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(X, {
                                            className: "size-3",
                                          }),
                                          " Revoke",
                                        ],
                                      }),
                                    ],
                                  }),
                              ],
                            }),
                          },
                          inv.id,
                        );
                      }),
                    }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { InvitationsPage as component };
