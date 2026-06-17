import {
  T as TSS_SERVER_FUNCTION,
  a as createServerFn,
  g as getRequest,
} from "./server-DOPhEqh1.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-CDUZ4KwQ.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import {
  o as objectType,
  s as stringType,
  n as numberType,
  e as enumType,
  l as literalType,
} from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/scheduler.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true,
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ["SUPABASE_URL"] : []),
      ...(!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy(
  {},
  {
    get(_, prop, receiver) {
      if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
      return Reflect.get(_supabaseAdmin, prop, receiver);
    },
  },
);
const activeBuckets = /* @__PURE__ */ new Map();
function getClientIp() {
  const request = getRequest();
  if (!request || !request.headers) return "127.0.0.1";
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "127.0.0.1";
}
function checkRateLimit(key, limit, intervalMs) {
  const now = Date.now();
  let bucket = activeBuckets.get(key);
  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    activeBuckets.set(key, bucket);
  }
  const elapsed = now - bucket.lastRefill;
  const refillRate = limit / intervalMs;
  const tokensToAdd = elapsed * refillRate;
  bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  return false;
}
function enforceRateLimit(key, limit, intervalMs) {
  const allowed = checkRateLimit(key, limit, intervalMs);
  if (!allowed) {
    throw new Response(
      JSON.stringify({
        error: "Too many requests. Please slow down and try again later.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil(intervalMs / 1e3)),
        },
      },
    );
  }
}
const CreateSchoolInput = objectType({
  school: objectType({
    name: stringType().min(2).max(120),
    code: stringType().min(2).max(40),
    address: stringType().max(300).optional().default(""),
    email: stringType().email().max(120).or(literalType("")).optional().nullable(),
    phone: stringType().max(40).optional().nullable(),
    logo_url: stringType().url().max(500).or(literalType("")).optional().nullable(),
    plan: enumType(["starter", "professional", "enterprise"]).default("starter"),
    billing_cycle: enumType(["monthly", "quarterly", "yearly"]).default("monthly"),
    student_limit: numberType().int().min(10).max(1e5).default(500),
    teacher_limit: numberType().int().min(1).max(1e4).default(50),
    monthly_amount: numberType().min(0).max(1e6).default(0),
  }),
  admin: objectType({
    full_name: stringType().min(2).max(120),
    email: stringType().email().max(120),
    password: stringType().min(8).max(72),
  }),
});
const provisionSchool_createServerFn_handler = createServerRpc(
  {
    id: "f5a10fa45077857e4d1ccffd01555f31e38f2fc7acf0424e1a6e7a1422ff961a",
    name: "provisionSchool",
    filename: "src/lib/platform.functions.ts",
  },
  (opts) => provisionSchool.__executeServer(opts),
);
const provisionSchool = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => CreateSchoolInput.parse(data))
  .handler(provisionSchool_createServerFn_handler, async ({ data, context }) => {
    const ip = getClientIp();
    enforceRateLimit(`school:ip:${ip}`, 2, 60 * 60 * 1e3);
    enforceRateLimit(`school:user:${context.userId}`, 2, 60 * 60 * 1e3);
    const { data: superCheck, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "super_admin")
      .limit(1)
      .maybeSingle();
    if (roleErr) throw new Error(roleErr.message);
    if (!superCheck) throw new Error("Only platform super admins can create schools");
    let adminUserId = null;
    const { data: createdUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.admin.email,
      password: data.admin.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.admin.full_name,
      },
    });
    if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
      throw new Error(createErr.message);
    }
    adminUserId = createdUser?.user?.id ?? null;
    if (!adminUserId) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      adminUserId =
        list?.users.find((u) => u.email?.toLowerCase() === data.admin.email.toLowerCase())?.id ??
        null;
    }
    if (!adminUserId) throw new Error("Could not create or locate admin user");
    await supabaseAdmin.auth.admin.updateUserById(adminUserId, {
      password: data.admin.password,
    });
    const schoolId = crypto.randomUUID();
    const { error: schoolErr } = await supabaseAdmin.from("schools").insert({
      id: schoolId,
      name: data.school.name,
      code: data.school.code,
      address: data.school.address || null,
      email: data.school.email || null,
      phone: data.school.phone || null,
      logo_url: data.school.logo_url || null,
      plan: data.school.plan,
      student_limit: data.school.student_limit,
      teacher_limit: data.school.teacher_limit,
      status: "active",
      owner_id: adminUserId,
    });
    if (schoolErr) throw new Error(schoolErr.message);
    await supabaseAdmin.from("school_credentials").upsert(
      {
        school_id: schoolId,
        temp_password: data.admin.password,
      },
      {
        onConflict: "school_id",
      },
    );
    await supabaseAdmin.from("profiles").upsert(
      {
        user_id: adminUserId,
        full_name: data.admin.full_name,
        email: data.admin.email,
        school_id: schoolId,
      },
      {
        onConflict: "user_id",
      },
    );
    await supabaseAdmin.from("user_roles").upsert(
      {
        user_id: adminUserId,
        school_id: schoolId,
        role: "admin",
      },
      {
        onConflict: "user_id,school_id,role",
      },
    );
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1e3);
    const billingDays =
      data.school.billing_cycle === "yearly"
        ? 365
        : data.school.billing_cycle === "quarterly"
          ? 90
          : 30;
    const currentPeriodEnd = new Date(trialEnd.getTime() + billingDays * 24 * 60 * 60 * 1e3);
    await supabaseAdmin.from("subscriptions").insert({
      school_id: schoolId,
      plan: data.school.plan,
      status: "trialing",
      billing_cycle: data.school.billing_cycle,
      monthly_amount: data.school.monthly_amount,
      trial_end: trialEnd.toISOString(),
      current_period_end: currentPeriodEnd.toISOString().slice(0, 10),
    });
    return {
      school_id: schoolId,
      admin_user_id: adminUserId,
    };
  });
function generateTempPassword(length = 12) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[arr[i] % chars.length];
  }
  return password;
}
const ProvisionTeacherInput = objectType({
  email: stringType().email().max(120),
  full_name: stringType().min(2).max(120),
  password: stringType().min(8).max(72),
});
const provisionTeacher_createServerFn_handler = createServerRpc(
  {
    id: "6193ca6393ff03622607c8e55de2002fd953e53dcbd843c85041be86c59fb8d2",
    name: "provisionTeacher",
    filename: "src/lib/platform.functions.ts",
  },
  (opts) => provisionTeacher.__executeServer(opts),
);
const provisionTeacher = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ProvisionTeacherInput.parse(data))
  .handler(provisionTeacher_createServerFn_handler, async ({ data, context }) => {
    const ip = getClientIp();
    enforceRateLimit(`teacher:ip:${ip}`, 10, 60 * 1e3);
    enforceRateLimit(`teacher:user:${context.userId}`, 10, 60 * 1e3);
    const { data: prof } = await context.supabase
      .from("profiles")
      .select("school_id")
      .eq("user_id", context.userId)
      .maybeSingle();
    const schoolId = prof?.school_id;
    if (!schoolId) throw new Error("Admin is not assigned to a school");
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("school_id", schoolId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) throw new Error("Only school admins can create teachers");
    let teacherId = null;
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name,
      },
    });
    if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
      throw new Error(createErr.message);
    }
    teacherId = created?.user?.id ?? null;
    if (!teacherId) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      teacherId =
        list?.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase())?.id ?? null;
    }
    if (!teacherId) throw new Error("Could not create or locate teacher user");
    await supabaseAdmin.auth.admin.updateUserById(teacherId, {
      password: data.password,
    });
    await supabaseAdmin.from("profiles").upsert(
      {
        user_id: teacherId,
        full_name: data.full_name,
        email: data.email,
        school_id: schoolId,
      },
      {
        onConflict: "user_id",
      },
    );
    await supabaseAdmin.from("user_roles").upsert(
      {
        user_id: teacherId,
        school_id: schoolId,
        role: "teacher",
      },
      {
        onConflict: "user_id,school_id,role",
      },
    );
    await supabaseAdmin.from("teacher_invitations").insert({
      school_id: schoolId,
      email: data.email,
      full_name: data.full_name,
      invited_by: context.userId,
      accepted_at: /* @__PURE__ */ new Date().toISOString(),
      accepted_by: teacherId,
      temp_password: data.password,
    });
    return {
      teacher_id: teacherId,
    };
  });
const SchoolIdInput = objectType({
  schoolId: stringType().uuid(),
});
const getSchoolCredentials_createServerFn_handler = createServerRpc(
  {
    id: "133844214a4719bda90889cd9afc62d29e0c7841cbe15401eb91c1345a8a4771",
    name: "getSchoolCredentials",
    filename: "src/lib/platform.functions.ts",
  },
  (opts) => getSchoolCredentials.__executeServer(opts),
);
const getSchoolCredentials = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => SchoolIdInput.parse(data))
  .handler(getSchoolCredentials_createServerFn_handler, async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("school_id", data.schoolId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) throw new Error("Unauthorized");
    const { data: school, error: schoolErr } = await supabaseAdmin
      .from("schools")
      .select("owner_id")
      .eq("id", data.schoolId)
      .single();
    if (schoolErr || !school) throw new Error(schoolErr?.message || "School not found");
    const { data: creds } = await supabaseAdmin
      .from("school_credentials")
      .select("temp_password")
      .eq("school_id", data.schoolId)
      .maybeSingle();
    const { data: profile, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("user_id", school.owner_id)
      .maybeSingle();
    if (profErr) throw new Error(profErr.message);
    return {
      email: profile?.email ?? null,
      tempPassword: creds?.temp_password ?? null,
    };
  });
const resetAdminPassword_createServerFn_handler = createServerRpc(
  {
    id: "c7daddccdc4a017418bf0449431ca08cd5c578b6a1bf52bd6661311bcd53d9e8",
    name: "resetAdminPassword",
    filename: "src/lib/platform.functions.ts",
  },
  (opts) => resetAdminPassword.__executeServer(opts),
);
const resetAdminPassword = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => SchoolIdInput.parse(data))
  .handler(resetAdminPassword_createServerFn_handler, async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("school_id", data.schoolId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    if (!isAdmin) throw new Error("Unauthorized");
    const { data: school, error: schoolErr } = await supabaseAdmin
      .from("schools")
      .select("owner_id")
      .eq("id", data.schoolId)
      .single();
    if (schoolErr || !school) throw new Error(schoolErr?.message || "School not found");
    const newPassword = generateTempPassword();
    const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(school.owner_id, {
      password: newPassword,
    });
    if (authErr) throw new Error(authErr.message);
    const { error: updateErr } = await supabaseAdmin.from("school_credentials").upsert(
      {
        school_id: data.schoolId,
        temp_password: newPassword,
      },
      {
        onConflict: "school_id",
      },
    );
    if (updateErr) throw new Error(updateErr.message);
    return {
      password: newPassword,
    };
  });
const ProvisionStudentInput = objectType({
  student: objectType({
    full_name: stringType().min(1).max(120),
    admission_number: stringType().max(40).nullable().optional(),
    roll_number: stringType().max(40).nullable().optional(),
    class_id: stringType().uuid(),
    date_of_birth: stringType().max(20).nullable().optional(),
    gender: stringType().max(20).nullable().optional(),
    address: stringType().max(400).nullable().optional(),
    photo_url: stringType().max(1e3).nullable().optional(),
  }),
  parent: objectType({
    full_name: stringType().max(120).nullable().optional(),
    email: stringType().email().max(120).nullable().optional(),
    phone: stringType().max(40).nullable().optional(),
    password: stringType().min(8).max(72).nullable().optional(),
  }),
});
const provisionStudent_createServerFn_handler = createServerRpc(
  {
    id: "74b7c266f17fc6d5b1c13c80e08d7e19423388a35e64756457927e70d6973987",
    name: "provisionStudent",
    filename: "src/lib/platform.functions.ts",
  },
  (opts) => provisionStudent.__executeServer(opts),
);
const provisionStudent = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ProvisionStudentInput.parse(data))
  .handler(provisionStudent_createServerFn_handler, async ({ data, context }) => {
    const ip = getClientIp();
    enforceRateLimit(`student:ip:${ip}`, 20, 60 * 1e3);
    enforceRateLimit(`student:user:${context.userId}`, 20, 60 * 1e3);
    const { data: prof } = await context.supabase
      .from("profiles")
      .select("school_id")
      .eq("user_id", context.userId)
      .maybeSingle();
    const schoolId = prof?.school_id;
    if (!schoolId) throw new Error("You are not assigned to a school");
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("school_id", schoolId);
    const isStaff = (roles ?? []).some((r) => r.role === "admin" || r.role === "teacher");
    if (!isStaff) throw new Error("Only school staff can add students");
    let parentUserId = null;
    const p = data.parent;
    if (p.email && p.password) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: p.email,
        password: p.password,
        email_confirm: true,
        user_metadata: {
          full_name: p.full_name ?? "",
        },
      });
      if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
        throw new Error(createErr.message);
      }
      parentUserId = created?.user?.id ?? null;
      if (!parentUserId) {
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        parentUserId =
          list?.users.find((u) => u.email?.toLowerCase() === p.email.toLowerCase())?.id ?? null;
      }
      if (parentUserId) {
        await supabaseAdmin.auth.admin.updateUserById(parentUserId, {
          password: p.password,
        });
        await supabaseAdmin.from("profiles").upsert(
          {
            user_id: parentUserId,
            full_name: p.full_name ?? "",
            email: p.email,
            school_id: schoolId,
          },
          {
            onConflict: "user_id",
          },
        );
        await supabaseAdmin.from("user_roles").upsert(
          {
            user_id: parentUserId,
            school_id: schoolId,
            role: "parent",
          },
          {
            onConflict: "user_id,school_id,role",
          },
        );
      }
    } else if (p.email) {
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("user_id")
        .eq("email", p.email)
        .maybeSingle();
      parentUserId = existingProfile?.user_id ?? null;
    }
    const { data: studentRow, error: insertErr } = await supabaseAdmin
      .from("students")
      .insert({
        school_id: schoolId,
        class_id: data.student.class_id,
        full_name: data.student.full_name,
        admission_number: data.student.admission_number ?? null,
        roll_number: data.student.roll_number ?? null,
        date_of_birth: data.student.date_of_birth ?? null,
        gender: data.student.gender ?? null,
        address: data.student.address ?? null,
        photo_url: data.student.photo_url ?? null,
        parent_name: p.full_name ?? null,
        parent_email: p.email ?? null,
        parent_phone: p.phone ?? null,
        parent_user_id: parentUserId,
      })
      .select("id")
      .single();
    if (insertErr) throw new Error(insertErr.message);
    return {
      student_id: studentRow.id,
      parent_user_id: parentUserId,
      parent_account_created: !!(p.email && p.password),
    };
  });
const BootstrapSchoolInput = objectType({
  name: stringType().min(2).max(120),
});
const bootstrapOwnSchool_createServerFn_handler = createServerRpc(
  {
    id: "0b555f14295dc8bb51ce806a00ff7f2f77bcfbe15bed2747495355e8757e2db7",
    name: "bootstrapOwnSchool",
    filename: "src/lib/platform.functions.ts",
  },
  (opts) => bootstrapOwnSchool.__executeServer(opts),
);
const bootstrapOwnSchool = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => BootstrapSchoolInput.parse(data))
  .handler(bootstrapOwnSchool_createServerFn_handler, async ({ data, context }) => {
    const userId = context.userId;
    const ip = getClientIp();
    enforceRateLimit(`bootstrap:ip:${ip}`, 2, 60 * 60 * 1e3);
    enforceRateLimit(`bootstrap:user:${userId}`, 2, 60 * 60 * 1e3);
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("school_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (existingProfile?.school_id) {
      throw new Error("You already belong to a school");
    }
    const schoolId = crypto.randomUUID();
    const { error: sErr } = await supabaseAdmin.from("schools").insert({
      id: schoolId,
      name: data.name,
      owner_id: userId,
    });
    if (sErr) throw new Error(sErr.message);
    const { error: pErr } = await supabaseAdmin
      .from("profiles")
      .update({
        school_id: schoolId,
      })
      .eq("user_id", userId);
    if (pErr) throw new Error(pErr.message);
    const { error: rErr } = await supabaseAdmin.from("user_roles").insert({
      user_id: userId,
      school_id: schoolId,
      role: "admin",
    });
    if (rErr) throw new Error(rErr.message);
    return {
      school_id: schoolId,
    };
  });
const LoginInput = objectType({
  email: stringType().email().max(120),
  password: stringType().min(6).max(72),
});
const loginAttemptServer_createServerFn_handler = createServerRpc(
  {
    id: "167edb1c60030c9184e6d11128b4ea90f01d5a02d17005feca7fc87c6859134d",
    name: "loginAttemptServer",
    filename: "src/lib/platform.functions.ts",
  },
  (opts) => loginAttemptServer.__executeServer(opts),
);
const loginAttemptServer = createServerFn({
  method: "POST",
})
  .inputValidator((data) => LoginInput.parse(data))
  .handler(loginAttemptServer_createServerFn_handler, async ({ data }) => {
    const ip = getClientIp();
    enforceRateLimit(`login:ip:${ip}`, 5, 60 * 1e3);
    enforceRateLimit(`login:email:${data.email.toLowerCase()}`, 5, 60 * 1e3);
    const { data: res, error } = await supabaseAdmin.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return res;
  });
const ResetEmailInput = objectType({
  email: stringType().email().max(120),
  redirectTo: stringType().url().max(500),
});
const resetPasswordEmailServer_createServerFn_handler = createServerRpc(
  {
    id: "58ddf5d25e1dfb1dd783a74fb6c21b95be7cb5f10822e4b6efda608e38293daa",
    name: "resetPasswordEmailServer",
    filename: "src/lib/platform.functions.ts",
  },
  (opts) => resetPasswordEmailServer.__executeServer(opts),
);
const resetPasswordEmailServer = createServerFn({
  method: "POST",
})
  .inputValidator((data) => ResetEmailInput.parse(data))
  .handler(resetPasswordEmailServer_createServerFn_handler, async ({ data }) => {
    const ip = getClientIp();
    enforceRateLimit(`reset:ip:${ip}`, 3, 5 * 60 * 1e3);
    enforceRateLimit(`reset:email:${data.email.toLowerCase()}`, 3, 5 * 60 * 1e3);
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(data.email, {
      redirectTo: data.redirectTo,
    });
    if (error) {
      throw new Error(error.message);
    }
    return {
      success: true,
    };
  });
export {
  bootstrapOwnSchool_createServerFn_handler,
  getSchoolCredentials_createServerFn_handler,
  loginAttemptServer_createServerFn_handler,
  provisionSchool_createServerFn_handler,
  provisionStudent_createServerFn_handler,
  provisionTeacher_createServerFn_handler,
  resetAdminPassword_createServerFn_handler,
  resetPasswordEmailServer_createServerFn_handler,
};
