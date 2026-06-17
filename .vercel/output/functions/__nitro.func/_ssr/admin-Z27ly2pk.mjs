import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import {
  f as useTenant,
  u as useAuth,
  c as usePageTitle,
  P as PageHeader,
} from "./router-CplsJ0Ue.mjs";
import {
  u as useServerFn,
  g as getSchoolCredentials,
  r as resetAdminPassword,
} from "./platform.functions-CG6gbu1e.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import "../_libs/seroval.mjs";
import {
  ad as Shield,
  as as Users,
  J as GraduationCap,
  at as Wallet,
  i as CalendarCheck,
  f as BookOpen,
  Y as MessageSquare,
  W as Megaphone,
  ar as UserPlus,
  h as Building2,
  b as ArrowRightLeft,
  a8 as Save,
  ag as ShieldOff,
  af as ShieldCheck,
  am as Trash2,
  P as Key,
  w as Copy,
  G as EyeOff,
  F as Eye,
  a6 as RefreshCw,
} from "../_libs/lucide-react.mjs";
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
import "./server-DOPhEqh1.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CDUZ4KwQ.mjs";
function CredentialsCard({ schoolId }) {
  const fetchCreds = useServerFn(getSchoolCredentials);
  const doReset = useServerFn(resetAdminPassword);
  const [email, setEmail] = reactExports.useState(null);
  const [password, setPassword] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [resetting, setResetting] = reactExports.useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchCreds({ data: { schoolId } });
      setEmail(res.email ?? null);
      setPassword(res.tempPassword ?? null);
    } catch {
      toast.error("Failed to load credentials");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void load();
  }, [schoolId]);
  const copy = async (text) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const reset = async () => {
    if (!confirm("Generate a new temporary password? The admin will need to use this to sign in."))
      return;
    setResetting(true);
    try {
      const res = await doReset({ data: { schoolId } });
      setPassword(res.password);
      setShowPassword(true);
      toast.success("Password reset successfully");
    } catch (err) {
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : String(err);
      toast.error(msg || "Failed to reset password");
    } finally {
      setResetting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5 h-fit space-y-4",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center gap-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "size-4 text-brand" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
            className: "text-sm font-semibold",
            children: "Credentials",
          }),
        ],
      }),
      loading
        ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading…",
          })
        : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-xs font-medium text-muted-foreground",
                    children: "Admin email",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "mt-1 flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        readOnly: true,
                        value: email ?? "—",
                        className:
                          "flex-1 min-w-0 px-3 py-2 text-sm border border-border rounded-md bg-muted/40 focus:outline-none",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        type: "button",
                        onClick: () => copy(email),
                        disabled: !email,
                        className:
                          "shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40",
                        title: "Copy email",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, {
                          className: "size-3.5",
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-xs font-medium text-muted-foreground",
                    children: "Temporary password",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "mt-1 flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "flex-1 relative",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          readOnly: true,
                          type: showPassword ? "text" : "password",
                          value: password ?? "",
                          placeholder: password === null ? "Not set" : "••••••••",
                          className:
                            "w-full px-3 py-2 text-sm border border-border rounded-md bg-muted/40 focus:outline-none",
                        }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        type: "button",
                        onClick: () => setShowPassword((p) => !p),
                        disabled: !password,
                        className:
                          "shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40",
                        title: showPassword ? "Hide password" : "Show password",
                        children: showPassword
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "size-3.5" })
                          : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "size-3.5" }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        type: "button",
                        onClick: () => copy(password),
                        disabled: !password,
                        className:
                          "shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40",
                        title: "Copy password",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, {
                          className: "size-3.5",
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                type: "button",
                onClick: reset,
                disabled: resetting,
                className:
                  "w-full py-2 border border-border rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-muted disabled:opacity-50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, {
                    className: `size-4 ${resetting ? "animate-spin" : ""}`,
                  }),
                  resetting ? "Generating…" : "Reset password",
                ],
              }),
            ],
          }),
    ],
  });
}
function AdminPanel() {
  const {
    currentSchoolId: effectiveSchoolId,
    roles,
    user,
    profile,
    loading: tenantLoading,
  } = useTenant();
  const schoolId = effectiveSchoolId;
  const { refresh } = useAuth();
  usePageTitle("Admin Panel");
  const navigate = useNavigate();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const [schoolName, setSchoolName] = reactExports.useState("");
  const [savingSchool, setSavingSchool] = reactExports.useState(false);
  const [staff, setStaff] = reactExports.useState([]);
  const [counts, setCounts] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [ownedSchools, setOwnedSchools] = reactExports.useState([]);
  const [newSchoolName, setNewSchoolName] = reactExports.useState("");
  const [creatingSchool, setCreatingSchool] = reactExports.useState(false);
  const [switchingTo, setSwitchingTo] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!isAdmin || !effectiveSchoolId) return;
    void loadAll();
  }, [isAdmin, effectiveSchoolId]);
  const loadAll = async () => {
    setLoading(true);
    const [
      school,
      profiles,
      userRoles,
      students,
      classes,
      invites,
      announcements,
      homework,
      owned,
    ] = await Promise.all([
      supabase.from("schools").select("school_name").eq("id", effectiveSchoolId).maybeSingle(),
      supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .eq("school_id", effectiveSchoolId),
      supabase.from("user_roles").select("user_id, role").eq("school_id", effectiveSchoolId),
      supabase
        .from("students")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("school_id", effectiveSchoolId),
      supabase
        .from("classes")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("school_id", effectiveSchoolId),
      supabase
        .from("teacher_invitations")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("school_id", effectiveSchoolId)
        .is("accepted_at", null)
        .is("revoked_at", null),
      supabase
        .from("announcements")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("school_id", effectiveSchoolId),
      supabase
        .from("homework")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("school_id", effectiveSchoolId),
      supabase
        .from("schools")
        .select("id, school_name")
        .eq("owner_id", user.id)
        .order("created_at", {
          ascending: true,
        }),
    ]);
    setOwnedSchools(
      (owned.data ?? []).map((s) => ({
        id: s.id,
        name: s.school_name,
      })),
    );
    setSchoolName(school.data?.school_name ?? "");
    const rolesByUser = /* @__PURE__ */ new Map();
    (userRoles.data ?? []).forEach((r) => {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    });
    const list = (profiles.data ?? [])
      .map((p) => ({
        user_id: p.user_id,
        full_name: p.full_name || "—",
        email: p.email,
        roles: rolesByUser.get(p.user_id) ?? [],
      }))
      .filter((s) => s.roles.includes("admin") || s.roles.includes("teacher"))
      .sort((a, b) => a.full_name.localeCompare(b.full_name));
    setStaff(list);
    const teacherCount = list.filter((s) => s.roles.includes("teacher")).length;
    setCounts({
      students: students.count ?? 0,
      teachers: teacherCount,
      classes: classes.count ?? 0,
      pendingInvites: invites.count ?? 0,
      announcements: announcements.count ?? 0,
      homework: homework.count ?? 0,
    });
    setLoading(false);
  };
  const saveSchool = async (e) => {
    e.preventDefault();
    if (!schoolId) return;
    setSavingSchool(true);
    const { error } = await supabase
      .from("schools")
      .update({
        name: schoolName.trim(),
      })
      .eq("id", schoolId);
    setSavingSchool(false);
    if (error) return toast.error(error.message);
    toast.success("School updated");
    void refresh();
  };
  const switchSchool = async (id) => {
    if (!user || id === schoolId) return;
    setSwitchingTo(id);
    const { error } = await supabase
      .from("profiles")
      .update({
        school_id: id,
      })
      .eq("user_id", user.id);
    setSwitchingTo(null);
    if (error) return toast.error(error.message);
    toast.success("Switched school");
    await refresh();
  };
  const grantAdmin = async (uid) => {
    if (!schoolId) return;
    const { error } = await supabase.from("user_roles").insert({
      user_id: uid,
      school_id: schoolId,
      role: "admin",
    });
    if (error) return toast.error(error.message);
    toast.success("Admin role granted");
    void loadAll();
  };
  const revokeAdmin = async (uid) => {
    if (!schoolId) return;
    if (uid === user?.id) return toast.error("You can't revoke your own admin role");
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", uid)
      .eq("school_id", schoolId)
      .eq("role", "admin");
    if (error) return toast.error(error.message);
    toast.success("Admin role revoked");
    void loadAll();
  };
  const removeStaff = async (s) => {
    if (!schoolId) return;
    if (s.user_id === user?.id) return toast.error("You can't remove yourself");
    if (!confirm(`Remove ${s.full_name} from this school? They will lose all access.`)) return;
    const { error: rolesErr } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", s.user_id)
      .eq("school_id", schoolId);
    if (rolesErr) return toast.error(rolesErr.message);
    await supabase
      .from("profiles")
      .update({
        school_id: null,
      })
      .eq("user_id", s.user_id);
    toast.success(`${s.full_name} removed`);
    void loadAll();
  };
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
          title: "Admin Panel",
          breadcrumb: "Restricted",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "p-8",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "max-w-md mx-auto bg-card border border-border rounded-xl p-8 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, {
                className: "size-10 text-muted-foreground mx-auto",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "mt-3 font-semibold",
                children: "Admin access only",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-sm text-muted-foreground mt-1",
                children: "You need an admin role to access the control panel.",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                onClick: () =>
                  navigate({
                    to: "/dashboard",
                  }),
                className: "mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md",
                children: "Back to dashboard",
              }),
            ],
          }),
        }),
      ],
    });
  }
  const services = [
    {
      to: "/students",
      label: "Students & Parents",
      icon: Users,
      count: counts?.students,
      desc: "Roster, parent linking",
    },
    {
      to: "/classes",
      label: "Classes",
      icon: GraduationCap,
      count: counts?.classes,
      desc: "Grades and sections",
    },
    {
      to: "/fees",
      label: "Fees & Invoices",
      icon: Wallet,
      desc: "Structures, invoices, payments",
    },
    {
      to: "/attendance",
      label: "Attendance",
      icon: CalendarCheck,
      desc: "Daily marking & history",
    },
    {
      to: "/homework",
      label: "Homework",
      icon: BookOpen,
      count: counts?.homework,
      desc: "Assignments & files",
    },
    {
      to: "/remarks",
      label: "Remarks",
      icon: MessageSquare,
      desc: "Teacher feedback",
    },
    {
      to: "/announcements",
      label: "Announcements",
      icon: Megaphone,
      count: counts?.announcements,
      desc: "School-wide notices",
    },
    {
      to: "/invitations",
      label: "Invite Teachers",
      icon: UserPlus,
      count: counts?.pendingInvites,
      desc: "Pending invitations",
    },
    {
      to: "/parent",
      label: "Parent Digest",
      icon: Shield,
      desc: "Preview parent view",
    },
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Admin Panel",
        breadcrumb: profile?.full_name ?? "Admin",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
          to: "/invitations",
          className:
            "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 inline-flex items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4" }),
            " Invite teacher",
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-4 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, {
                label: "Students",
                value: counts?.students ?? "—",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, {
                label: "Teachers",
                value: counts?.teachers ?? "—",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, {
                label: "Classes",
                value: counts?.classes ?? "—",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, {
                label: "Pending invites",
                value: counts?.pendingInvites ?? "—",
                tone: "brand",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className:
                  "text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3",
                children: "Services",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                children: services.map((s) => {
                  const Icon = s.icon;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: s.to,
                      className:
                        "group bg-card border border-border rounded-xl p-5 hover:border-brand/40 hover:shadow-sm transition",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex items-center justify-between",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className:
                                "size-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, {
                                className: "size-4",
                              }),
                            }),
                            typeof s.count === "number" &&
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className:
                                  "text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full",
                                children: s.count,
                              }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                          className: "mt-3 font-medium text-foreground",
                          children: s.label,
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                          className: "text-xs text-muted-foreground mt-0.5",
                          children: s.desc,
                        }),
                      ],
                    },
                    s.to,
                  );
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
            className: "bg-card border border-border rounded-xl overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "px-5 py-3 border-b border-border flex items-center justify-between",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, {
                        className: "size-4 text-brand",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                        className: "text-sm font-semibold",
                        children: "Schools",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                    className: "text-xs text-muted-foreground",
                    children: [ownedSchools.length, " owned"],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", {
                className: "divide-y divide-border",
                children: [
                  ownedSchools.map((s) => {
                    const isCurrent = s.id === schoolId;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "li",
                      {
                        className: "px-5 py-3 flex items-center justify-between gap-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "min-w-0",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-sm font-medium truncate",
                                children: s.name,
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-xs text-muted-foreground",
                                children: isCurrent ? "Active school" : "Owned",
                              }),
                            ],
                          }),
                          isCurrent
                            ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className:
                                  "text-[10px] uppercase font-bold tracking-wider bg-brand-soft text-brand px-2 py-1 rounded",
                                children: "Current",
                              })
                            : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                onClick: () => switchSchool(s.id),
                                disabled: switchingTo === s.id,
                                className:
                                  "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted disabled:opacity-50",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, {
                                    className: "size-3",
                                  }),
                                  switchingTo === s.id ? "Switching…" : "Switch",
                                ],
                              }),
                        ],
                      },
                      s.id,
                    );
                  }),
                  ownedSchools.length === 0 &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx("li", {
                      className: "px-5 py-6 text-sm text-muted-foreground text-center",
                      children: "You don't own any schools yet.",
                    }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "space-y-6",
                children: [
                  schoolId && /* @__PURE__ */ jsxRuntimeExports.jsx(CredentialsCard, { schoolId }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
                    onSubmit: saveSchool,
                    className: "bg-card border border-border rounded-xl p-5 h-fit space-y-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, {
                            className: "size-4 text-brand",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                            className: "text-sm font-semibold",
                            children: "School settings",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className: "text-xs font-medium",
                            children: "School name",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            value: schoolName,
                            onChange: (e) => setSchoolName(e.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                            required: true,
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                        type: "submit",
                        disabled: savingSchool || !schoolName.trim(),
                        className:
                          "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-50",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
                          savingSchool ? "Saving…" : "Save changes",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "bg-card border border-border rounded-xl overflow-hidden",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "px-5 py-3 border-b border-border flex items-center justify-between",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                        className: "text-sm font-semibold",
                        children: "Staff & permissions",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                        className: "text-xs text-muted-foreground",
                        children: [staff.length, " members"],
                      }),
                    ],
                  }),
                  loading
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "p-8 text-sm text-muted-foreground",
                        children: "Loading…",
                      })
                    : staff.length === 0
                      ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "p-8 text-sm text-muted-foreground text-center",
                          children: [
                            "No staff yet.",
                            " ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                              to: "/invitations",
                              className: "text-brand font-medium",
                              children: "Invite your first teacher →",
                            }),
                          ],
                        })
                      : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", {
                          className: "divide-y divide-border",
                          children: staff.map((s) => {
                            const isMe = s.user_id === user?.id;
                            const isAdminRole = s.roles.includes("admin");
                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "li",
                              {
                                className:
                                  "px-5 py-3 flex items-center justify-between gap-3 flex-wrap",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "flex items-center gap-2 flex-wrap",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className: "text-sm font-medium truncate",
                                            children: s.full_name,
                                          }),
                                          isMe &&
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className:
                                                "text-[10px] uppercase font-bold tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded",
                                              children: "You",
                                            }),
                                          s.roles.map((r) =>
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "span",
                                              {
                                                className: `text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${r === "admin" ? "bg-brand-soft text-brand" : "bg-muted text-muted-foreground"}`,
                                                children: r,
                                              },
                                              r,
                                            ),
                                          ),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                        className: "text-xs text-muted-foreground mt-0.5 truncate",
                                        children: s.email ?? "—",
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                      isAdminRole
                                        ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                            onClick: () => revokeAdmin(s.user_id),
                                            disabled: isMe,
                                            className:
                                              "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted disabled:opacity-40",
                                            title: isMe
                                              ? "You can't revoke your own admin"
                                              : "Revoke admin",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, {
                                                className: "size-3",
                                              }),
                                              " Revoke admin",
                                            ],
                                          })
                                        : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                            onClick: () => grantAdmin(s.user_id),
                                            className:
                                              "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, {
                                                className: "size-3",
                                              }),
                                              " Make admin",
                                            ],
                                          }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: () => removeStaff(s),
                                        disabled: isMe,
                                        className:
                                          "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-danger-soft hover:text-danger disabled:opacity-40",
                                        title: isMe
                                          ? "You can't remove yourself"
                                          : "Remove from school",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {
                                            className: "size-3",
                                          }),
                                          " Remove",
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              s.user_id,
                            );
                          }),
                        }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Stat({ label, value, tone }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-sm font-medium text-muted-foreground",
        children: label,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
        className: `text-3xl font-bold mt-2 ${tone === "brand" ? "text-brand" : "text-foreground"}`,
        children: value,
      }),
    ],
  });
}
export { AdminPanel as component };
