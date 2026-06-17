import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getClientIp, enforceRateLimit } from "@/lib/rate-limiter";

const CreateSchoolInput = z.object({
  school: z.object({
    name: z.string().min(2).max(120),
    code: z.string().min(2).max(40),
    address: z.string().max(300).optional().default(""),
    email: z.string().email().max(120).or(z.literal("")).optional().nullable(),
    phone: z.string().max(40).optional().nullable(),
    logo_url: z.string().url().max(500).or(z.literal("")).optional().nullable(),
    plan: z.enum(["starter", "professional", "enterprise"]).default("starter"),
    billing_cycle: z.enum(["monthly", "quarterly", "yearly"]).default("monthly"),
    student_limit: z.number().int().min(10).max(100000).default(500),
    teacher_limit: z.number().int().min(1).max(10000).default(50),
    monthly_amount: z.number().min(0).max(1000000).default(0),
  }),
  admin: z.object({
    full_name: z.string().min(2).max(120),
    email: z.string().email().max(120),
    password: z.string().min(8).max(72),
  }),
});

export const provisionSchool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => CreateSchoolInput.parse(data))
  .handler(async ({ data, context }) => {
    const ip = getClientIp();
    enforceRateLimit(`school:ip:${ip}`, 2, 60 * 60 * 1000);
    enforceRateLimit(`school:user:${context.userId}`, 2, 60 * 60 * 1000);

    // Authorize: only super admins may call this
    const { data: superCheck, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "super_admin" as never)
      .limit(1)
      .maybeSingle();
    if (roleErr) throw new Error(roleErr.message);
    if (!superCheck) throw new Error("Only platform super admins can create schools");

    // 1. Create or look up auth user (admin)
    let adminUserId: string | null = null;
    const { data: createdUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.admin.email,
      password: data.admin.password,
      email_confirm: true,
      user_metadata: { full_name: data.admin.full_name },
    });
    if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
      throw new Error(createErr.message);
    }
    adminUserId = createdUser?.user?.id ?? null;

    if (!adminUserId) {
      // Find existing by email via listUsers (paginated)
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      adminUserId =
        list?.users.find((u) => u.email?.toLowerCase() === data.admin.email.toLowerCase())?.id ??
        null;
    }
    if (!adminUserId) throw new Error("Could not create or locate admin user");

    // Update password in case user already existed
    await supabaseAdmin.auth.admin.updateUserById(adminUserId, { password: data.admin.password });

    // 2. Create the school (super_admin RLS allows via supabaseAdmin too)
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

    // Store the temp admin password in the restricted credentials table
    await supabaseAdmin
      .from("school_credentials")
      .upsert(
        { school_id: schoolId, temp_password: data.admin.password },
        { onConflict: "school_id" },
      );

    // 3. Ensure profile + assign school + admin role
    await supabaseAdmin.from("profiles").upsert(
      {
        user_id: adminUserId,
        full_name: data.admin.full_name,
        email: data.admin.email,
        school_id: schoolId,
      },
      { onConflict: "user_id" },
    );
    await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: adminUserId, school_id: schoolId, role: "admin" as never },
        { onConflict: "user_id,school_id,role" },
      );

    // 4. Subscription record
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days trial
    const billingDays =
      data.school.billing_cycle === "yearly"
        ? 365
        : data.school.billing_cycle === "quarterly"
          ? 90
          : 30;
    const currentPeriodEnd = new Date(trialEnd.getTime() + billingDays * 24 * 60 * 60 * 1000);

    await supabaseAdmin.from("subscriptions").insert({
      school_id: schoolId,
      plan: data.school.plan,
      status: "trialing",
      billing_cycle: data.school.billing_cycle,
      monthly_amount: data.school.monthly_amount,
      trial_end: trialEnd.toISOString(),
      current_period_end: currentPeriodEnd.toISOString().slice(0, 10),
    });

    return { school_id: schoolId, admin_user_id: adminUserId };
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

const ProvisionTeacherInput = z.object({
  email: z.string().email().max(120),
  full_name: z.string().min(2).max(120),
  password: z.string().min(8).max(72),
});

export const provisionTeacher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ProvisionTeacherInput.parse(data))
  .handler(async ({ data, context }) => {
    const ip = getClientIp();
    enforceRateLimit(`teacher:ip:${ip}`, 10, 60 * 1000);
    enforceRateLimit(`teacher:user:${context.userId}`, 10, 60 * 1000);

    // Admin only, scoped to their school
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
    const isAdmin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
    if (!isAdmin) throw new Error("Only school admins can create teachers");

    // Create or look up auth user
    let teacherId: string | null = null;
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name },
    });
    if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
      throw new Error(createErr.message);
    }
    teacherId = created?.user?.id ?? null;
    if (!teacherId) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      teacherId =
        list?.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase())?.id ?? null;
    }
    if (!teacherId) throw new Error("Could not create or locate teacher user");

    // Update password in case user already existed
    await supabaseAdmin.auth.admin.updateUserById(teacherId, { password: data.password });

    await supabaseAdmin.from("profiles").upsert(
      {
        user_id: teacherId,
        full_name: data.full_name,
        email: data.email,
        school_id: schoolId,
      },
      { onConflict: "user_id" },
    );
    await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: teacherId, school_id: schoolId, role: "teacher" as never },
        { onConflict: "user_id,school_id,role" },
      );

    // Log a record in teacher_invitations as accepted, store temp password for admin to share
    await supabaseAdmin.from("teacher_invitations").insert({
      school_id: schoolId,
      email: data.email,
      full_name: data.full_name,
      invited_by: context.userId,
      accepted_at: new Date().toISOString(),
      accepted_by: teacherId,
      temp_password: data.password,
    });

    return { teacher_id: teacherId };
  });

const SchoolIdInput = z.object({
  schoolId: z.string().uuid(),
});

export const getSchoolCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => SchoolIdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("school_id", data.schoolId);
    const isAdmin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
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

export const resetAdminPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => SchoolIdInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("school_id", data.schoolId);
    const isAdmin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
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

    const { error: updateErr } = await supabaseAdmin
      .from("school_credentials")
      .upsert(
        { school_id: data.schoolId, temp_password: newPassword },
        { onConflict: "school_id" },
      );
    if (updateErr) throw new Error(updateErr.message);

    return { password: newPassword };
  });

const ProvisionStudentInput = z.object({
  student: z.object({
    full_name: z.string().min(1).max(120),
    admission_number: z.string().max(40).nullable().optional(),
    roll_number: z.string().max(40).nullable().optional(),
    class_id: z.string().uuid(),
    date_of_birth: z.string().max(20).nullable().optional(),
    gender: z.string().max(20).nullable().optional(),
    address: z.string().max(400).nullable().optional(),
    photo_url: z.string().max(1000).nullable().optional(),
  }),
  parent: z.object({
    full_name: z.string().max(120).nullable().optional(),
    email: z.string().email().max(120).nullable().optional(),
    phone: z.string().max(40).nullable().optional(),
    password: z.string().min(8).max(72).nullable().optional(),
  }),
});

export const provisionStudent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ProvisionStudentInput.parse(data))
  .handler(async ({ data, context }) => {
    const ip = getClientIp();
    enforceRateLimit(`student:ip:${ip}`, 20, 60 * 1000);
    enforceRateLimit(`student:user:${context.userId}`, 20, 60 * 1000);

    // Caller must be staff (admin or teacher) in a school
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
    const isStaff = (roles ?? []).some(
      (r: { role: string }) => r.role === "admin" || r.role === "teacher",
    );
    if (!isStaff) throw new Error("Only school staff can add students");

    // Provision parent auth user if email + password supplied
    let parentUserId: string | null = null;
    const p = data.parent;
    if (p.email && p.password) {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: p.email,
        password: p.password,
        email_confirm: true,
        user_metadata: { full_name: p.full_name ?? "" },
      });
      if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
        throw new Error(createErr.message);
      }
      parentUserId = created?.user?.id ?? null;
      if (!parentUserId) {
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        parentUserId =
          list?.users.find((u) => u.email?.toLowerCase() === p.email!.toLowerCase())?.id ?? null;
      }
      if (parentUserId) {
        // Reset the password to what the staff chose (covers existing users)
        await supabaseAdmin.auth.admin.updateUserById(parentUserId, { password: p.password });

        await supabaseAdmin.from("profiles").upsert(
          {
            user_id: parentUserId,
            full_name: p.full_name ?? "",
            email: p.email,
            school_id: schoolId,
          },
          { onConflict: "user_id" },
        );
        await supabaseAdmin
          .from("user_roles")
          .upsert(
            { user_id: parentUserId, school_id: schoolId, role: "parent" as never },
            { onConflict: "user_id,school_id,role" },
          );
      }
    } else if (p.email) {
      // No password — try to link to an existing account by email
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

// Self-service onboarding: create a school and assign the caller as its admin.
// Uses supabaseAdmin because the user_roles INSERT policy now restricts
// self-assignment to the 'parent' role only.
const BootstrapSchoolInput = z.object({
  name: z.string().min(2).max(120),
});

export const bootstrapOwnSchool = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => BootstrapSchoolInput.parse(data))
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const ip = getClientIp();
    enforceRateLimit(`bootstrap:ip:${ip}`, 2, 60 * 60 * 1000);
    enforceRateLimit(`bootstrap:user:${userId}`, 2, 60 * 60 * 1000);

    // Caller must not already belong to a school
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
      .update({ school_id: schoolId })
      .eq("user_id", userId);
    if (pErr) throw new Error(pErr.message);

    const { error: rErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, school_id: schoolId, role: "admin" as never });
    if (rErr) throw new Error(rErr.message);

    return { school_id: schoolId };
  });

const LoginInput = z.object({
  email: z.string().email().max(120),
  password: z.string().min(6).max(72),
});

export const loginAttemptServer = createServerFn({ method: "POST" })
  .inputValidator((data) => LoginInput.parse(data))
  .handler(async ({ data }) => {
    const ip = getClientIp();
    // Limit to 5 attempts per minute per IP or email
    enforceRateLimit(`login:ip:${ip}`, 5, 60 * 1000);
    enforceRateLimit(`login:email:${data.email.toLowerCase()}`, 5, 60 * 1000);

    const { data: res, error } = await supabaseAdmin.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return res;
  });

const ResetEmailInput = z.object({
  email: z.string().email().max(120),
  redirectTo: z.string().url().max(500),
});

export const resetPasswordEmailServer = createServerFn({ method: "POST" })
  .inputValidator((data) => ResetEmailInput.parse(data))
  .handler(async ({ data }) => {
    const ip = getClientIp();
    // Limit to 3 requests per 5 minutes per IP or email
    enforceRateLimit(`reset:ip:${ip}`, 3, 5 * 60 * 1000);
    enforceRateLimit(`reset:email:${data.email.toLowerCase()}`, 3, 5 * 60 * 1000);

    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(data.email, {
      redirectTo: data.redirectTo,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  });
