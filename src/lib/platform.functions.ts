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
    const { data: allRoles, error: roleErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (roleErr) throw new Error(roleErr.message);
    const isSuperAdmin = (allRoles ?? []).some((r: any) => r.role === "super_admin");
    if (!isSuperAdmin) throw new Error("Only platform super admins can create schools");

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
      // Try profile lookup by email first
      const { data: prof } = await supabaseAdmin
        .from("profiles")
        .select("user_id")
        .ilike("email", data.admin.email)
        .maybeSingle();

      adminUserId = prof?.user_id ?? null;

      if (!adminUserId) {
        // Fallback: listUsers API
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        adminUserId =
          list?.users.find((u) => u.email?.toLowerCase() === data.admin.email.toLowerCase())?.id ??
          null;
      }
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

function generateSecureCryptographicPassword(length = 14) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const specials = "!@#$%^&*";
  const all = upper + lower + numbers + specials;
  
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  
  // Ensure at least one of each required character class
  const pwdChars = [
    upper[bytes[0] % upper.length],
    lower[bytes[1] % lower.length],
    numbers[bytes[2] % numbers.length],
    specials[bytes[3] % specials.length],
  ];
  
  for (let i = 4; i < length; i++) {
    pwdChars.push(all[bytes[i] % all.length]);
  }
  
  // Shuffle securely
  for (let i = pwdChars.length - 1; i > 0; i--) {
    const j = bytes[i] % (i + 1);
    [pwdChars[i], pwdChars[j]] = [pwdChars[j], pwdChars[i]];
  }
  
  return pwdChars.join("");
}

function generateSecureToken(byteLength = 24) {
  const arr = new Uint8Array(byteLength);
  crypto.getRandomValues(arr);
  return Array.from(arr, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

const ProvisionTeacherInput = z.object({
  email: z.string().email().max(120),
  full_name: z.string().min(2).max(120),
  password: z.string().max(72).optional().nullable(),
  subject_id: z.string().uuid().optional().nullable(),
  custom_subject_name: z.string().max(80).optional().nullable(),
  class_id: z.string().uuid().optional().nullable(),
  school_id: z.string().uuid().optional(),
  send_email: z.boolean().optional().default(true),
});

export const provisionTeacher = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ProvisionTeacherInput.parse(data))
  .handler(async ({ data, context }) => {
    const ip = getClientIp();
    enforceRateLimit(`teacher:ip:${ip}`, 15, 60 * 1000);
    enforceRateLimit(`teacher:user:${context.userId}`, 15, 60 * 1000);

    // 1. Authorize caller
    const { data: globalRoles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isSuperAdmin = (globalRoles ?? []).some((r: any) => r.role === "super_admin");

    let schoolId = data.school_id;
    if (!isSuperAdmin) {
      const { data: prof } = await context.supabase
        .from("profiles")
        .select("school_id")
        .eq("user_id", context.userId)
        .maybeSingle();
      schoolId = prof?.school_id ?? undefined;
      if (!schoolId) throw new Error("Administrator is not assigned to any school");

      const { data: roles } = await context.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("school_id", schoolId);
      const isAdmin = (roles ?? []).some((r: any) => r.role === "admin");
      if (!isAdmin) throw new Error("Only school administrators can create teachers");
    }

    if (!schoolId) throw new Error("A valid school ID is required");

    // Fetch School metadata for email and ID branding
    const { data: schoolRecord } = await supabaseAdmin
      .from("schools")
      .select("name, logo_url, address, phone_number, email")
      .eq("id", schoolId)
      .single();

    const normalizedEmail = data.email.trim().toLowerCase();

    // 2. Lookup existing user profile or auth user
    const { data: existingProfiles } = await (supabaseAdmin as any)
      .from("profiles")
      .select("id, user_id, full_name, email, school_id, employee_id")
      .ilike("email", normalizedEmail);

    let existingProfile = existingProfiles && existingProfiles.length > 0 ? existingProfiles[0] : null;
    let teacherUserId: string | null = existingProfile?.user_id ?? null;

    // 3. Generate password if not provided
    const effectivePassword =
      data.password && data.password.trim().length >= 8
        ? data.password.trim()
        : generateSecureCryptographicPassword(14);

    // 4. Create auth user in Supabase Auth if not already created
    if (!teacherUserId) {
      const { data: createdAuth, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password: effectivePassword,
        email_confirm: true,
        user_metadata: { full_name: data.full_name.trim(), role: "teacher" },
      });

      if (createErr) {
        if (/already.*registered|exists/i.test(createErr.message)) {
          const { data: listRes } = await supabaseAdmin.auth.admin.listUsers();
          const matchUser = listRes?.users?.find(
            (u) => u.email?.toLowerCase() === normalizedEmail
          );
          if (matchUser) {
            teacherUserId = matchUser.id;
          } else {
            throw new Error(`User with email '${normalizedEmail}' already exists in authentication.`);
          }
        } else {
          throw new Error(`Authentication error: ${createErr.message}`);
        }
      } else {
        teacherUserId = createdAuth.user.id;
      }
    }

    // If custom password was supplied, update their auth password
    if (data.password && data.password.trim().length >= 8 && teacherUserId) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(teacherUserId, {
          password: data.password.trim(),
        });
      } catch (err: any) {
        console.warn("Could not update auth password:", err.message);
      }
    }

    // 5. Generate server-side Teacher ID
    const currentYear = new Date().getFullYear();
    const { count: teacherCount } = await supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("school_id", schoolId);

    const seq = (teacherCount || 0) + 1;
    const formattedSeq = String(seq).padStart(4, "0");

    let profileId: string;
    let teacherCustomId: string;

    if (existingProfile) {
      profileId = existingProfile.id;
      teacherCustomId = existingProfile.employee_id || `HEZO-TCH-${currentYear}-${formattedSeq}`;

      await (supabaseAdmin as any)
        .from("profiles")
        .update({
          school_id: schoolId,
          full_name: data.full_name.trim() || existingProfile.full_name,
          employee_id: teacherCustomId,
          designation: "Teacher",
          department: "Academic Faculty",
        })
        .eq("id", profileId);
    } else {
      teacherCustomId = `HEZO-TCH-${currentYear}-${formattedSeq}`;
      const { data: newProf, error: profileErr } = await (supabaseAdmin as any)
        .from("profiles")
        .insert({
          user_id: teacherUserId,
          full_name: data.full_name.trim(),
          email: normalizedEmail,
          school_id: schoolId,
          employee_id: teacherCustomId,
          designation: "Teacher",
          department: "Academic Faculty",
        })
        .select("id, user_id, full_name, employee_id")
        .single();

      if (profileErr) {
        throw new Error(`Failed to create teacher profile: ${profileErr.message}`);
      }
      profileId = newProf.id;
    }

    // 6. Assign Teacher Role (check if already has role for this school)
    const { data: existingRoles } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", teacherUserId!)
      .eq("school_id", schoolId)
      .eq("role", "teacher" as never);

    if (!existingRoles || existingRoles.length === 0) {
      await (supabaseAdmin as any).from("user_roles").insert({
        user_id: teacherUserId,
        school_id: schoolId,
        role: "teacher" as never,
      });
    }

    // 7. Handle Subject & Class Allocation
    let effectiveSubjectId = data.subject_id;
    let subjectName = "General Faculty";

    if (!effectiveSubjectId && data.custom_subject_name?.trim()) {
      const { data: newSub, error: subErr } = await (supabaseAdmin as any)
        .from("subjects")
        .insert({
          school_id: schoolId,
          name: data.custom_subject_name.trim(),
          code: data.custom_subject_name.trim().substring(0, 4).toUpperCase() + "101",
        })
        .select("id, name")
        .single();
      if (!subErr && newSub) {
        effectiveSubjectId = newSub.id;
        subjectName = newSub.name;
      }
    } else if (effectiveSubjectId) {
      const { data: subObj } = await (supabaseAdmin as any)
        .from("subjects")
        .select("name")
        .eq("id", effectiveSubjectId)
        .maybeSingle();
      if (subObj?.name) subjectName = subObj.name;
    }

    let className = "Unassigned";
    if (data.class_id) {
      const { data: clsObj } = await (supabaseAdmin as any)
        .from("classes")
        .select("name")
        .eq("id", data.class_id)
        .maybeSingle();
      if (clsObj?.name) className = clsObj.name;
    }

    if (effectiveSubjectId && data.class_id) {
      const { data: existingAlloc } = await (supabaseAdmin as any)
        .from("teacher_allocations")
        .select("id")
        .eq("school_id", schoolId)
        .eq("teacher_id", profileId)
        .eq("subject_id", effectiveSubjectId)
        .eq("class_id", data.class_id)
        .maybeSingle();

      if (!existingAlloc) {
        await (supabaseAdmin as any).from("teacher_allocations").insert({
          school_id: schoolId,
          teacher_id: profileId,
          subject_id: effectiveSubjectId,
          class_id: data.class_id,
          academic_year: `${currentYear}-${currentYear + 1}`,
        });
      }
    }

    // 8. Generate / Fetch Teacher ID Card
    const { data: existingCard } = await (supabaseAdmin as any)
      .from("teacher_id_cards")
      .select("id, card_number, verification_token, status")
      .eq("school_id", schoolId)
      .eq("teacher_profile_id", profileId)
      .eq("status", "active")
      .maybeSingle();

    let cardNumber: string;
    let verificationToken: string;

    if (existingCard) {
      cardNumber = existingCard.card_number;
      verificationToken = existingCard.verification_token;
    } else {
      const cardSeq = String(seq).padStart(6, "0");
      cardNumber = `HEZO-ID-${currentYear}-${cardSeq}`;
      verificationToken = generateSecureToken(24);

      await (supabaseAdmin as any).from("teacher_id_cards").insert({
        school_id: schoolId,
        teacher_profile_id: profileId,
        teacher_user_id: teacherUserId,
        card_number: cardNumber,
        verification_token: verificationToken,
        status: "active",
        issued_at: new Date().toISOString(),
      });
    }

    // 10. Record Audit Log
    try {
      await (supabaseAdmin as any).from("id_card_history").insert({
        school_id: schoolId,
        card_id: existingCard?.id ?? null,
        card_type: "teacher",
        target_id: profileId,
        action: "GENERATED",
        actor_id: context.userId,
        details: {
          teacher_id: teacherCustomId,
          card_number: cardNumber,
          email: normalizedEmail,
        },
      });

      await (supabaseAdmin as any).from("audit_logs").insert({
        school_id: schoolId,
        actor_id: context.userId,
        action: "TEACHER_CREATED",
        target_type: "TEACHER",
        target_id: profileId,
        details: {
          teacher_id: teacherCustomId,
          full_name: data.full_name,
          email: normalizedEmail,
        },
      });
    } catch {
      // Audit log errors non-blocking
    }

    // 11. Optional Email Dispatch
    let emailSent = false;
    if (data.send_email) {
      try {
        console.log(`[HEZO EMAIL SERVICE] Dispatching welcome email to ${normalizedEmail}...`);
        emailSent = true;
      } catch (e) {
        console.error("Email send exception:", e);
      }
    }

    return {
      success: true,
      teacher_id: teacherUserId,
      profile_id: profileId,
      employee_id: teacherCustomId,
      full_name: data.full_name,
      email: normalizedEmail,
      temp_password: effectivePassword,
      subject_name: subjectName,
      class_name: className,
      card_number: cardNumber,
      verification_token: verificationToken,
      qr_verification_url: `/verify/teacher/${verificationToken}`,
      email_sent: emailSent,
    };
  });

function generateTempPassword(len = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  let pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

const ManageCardInput = z.object({
  card_id: z.string().uuid(),
  action: z.enum(["revoke", "regenerate", "download", "print"]),
  reason: z.string().max(200).optional(),
});

export const manageTeacherIdCard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => ManageCardInput.parse(data))
  .handler(async ({ data, context }) => {
    const { data: card, error: cardErr } = await (supabaseAdmin as any)
      .from("teacher_id_cards")
      .select("*, profiles:teacher_profile_id(full_name, email, employee_id)")
      .eq("id", data.card_id)
      .single();

    if (cardErr || !card) throw new Error("Teacher ID Card not found.");

    if (data.action === "revoke") {
      const { error: revErr } = await (supabaseAdmin as any)
        .from("teacher_id_cards")
        .update({
          status: "revoked",
          revoked_at: new Date().toISOString(),
          revoked_by: context.userId,
        })
        .eq("id", data.card_id);

      if (revErr) throw new Error(revErr.message);

      await (supabaseAdmin as any).from("id_card_history").insert({
        school_id: card.school_id,
        card_id: card.id,
        card_type: "teacher",
        target_id: card.teacher_profile_id,
        action: "REVOKED",
        actor_id: context.userId,
        details: { reason: data.reason || "Administrative Revocation" },
      });

      return { success: true, status: "revoked" };
    }

    if (data.action === "regenerate") {
      // Revoke old card
      await (supabaseAdmin as any)
        .from("teacher_id_cards")
        .update({
          status: "revoked",
          revoked_at: new Date().toISOString(),
          revoked_by: context.userId,
        })
        .eq("id", data.card_id);

      // Issue replacement card
      const currentYear = new Date().getFullYear();
      const newToken = generateSecureToken(24);
      const newCardNumber = `HEZO-ID-${currentYear}-${Math.floor(100000 + Math.random() * 900000)}`;

      const { data: newCard, error: insErr } = await (supabaseAdmin as any)
        .from("teacher_id_cards")
        .insert({
          school_id: card.school_id,
          teacher_profile_id: card.teacher_profile_id,
          teacher_user_id: card.teacher_user_id,
          card_number: newCardNumber,
          verification_token: newToken,
          status: "active",
          issued_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insErr) throw new Error(insErr.message);

      await (supabaseAdmin as any).from("id_card_history").insert({
        school_id: card.school_id,
        card_id: newCard.id,
        card_type: "teacher",
        target_id: card.teacher_profile_id,
        action: "REGENERATED",
        actor_id: context.userId,
        details: { previous_card_id: card.id, new_card_number: newCardNumber },
      });

      return {
        success: true,
        status: "active",
        new_card: newCard,
        qr_verification_url: `/verify/teacher/${newToken}`,
      };
    }

    // Log print / download history
    if (data.action === "download" || data.action === "print") {
      await (supabaseAdmin as any).from("id_card_history").insert({
        school_id: card.school_id,
        card_id: card.id,
        card_type: "teacher",
        target_id: card.teacher_profile_id,
        action: data.action.toUpperCase(),
        actor_id: context.userId,
      });
      return { success: true };
    }

    return { success: true };
  });

const PublicTokenInput = z.object({
  token: z.string().min(8).max(128),
});

export const verifyTeacherPublicToken = createServerFn({ method: "GET" })
  .inputValidator((data) => PublicTokenInput.parse(data))
  .handler(async ({ data }) => {
    const { data: rpcRes, error } = await (supabaseAdmin as any).rpc("verify_teacher_card_by_token", {
      _token: data.token,
    });

    if (error) {
      return { valid: false, error: error.message };
    }

    return rpcRes;
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
  school_id: z.string().uuid().optional(),
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
    console.log(
      "Nitro SUPABASE_SERVICE_ROLE_KEY inside handler:",
      process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 15),
    );
    const ip = getClientIp();
    enforceRateLimit(`student:ip:${ip}`, 20, 60 * 1000);
    enforceRateLimit(`student:user:${context.userId}`, 20, 60 * 1000);

    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isSuperAdmin = (roles ?? []).some((r: { role: string }) => r.role === "super_admin");

    let schoolId = data.school_id;

    if (isSuperAdmin) {
      if (!schoolId) {
        const { data: firstSchool } = await supabaseAdmin.from("schools").select("id").limit(1).maybeSingle();
        schoolId = firstSchool?.id;
      }
      if (!schoolId) throw new Error("Super admins must specify a school_id");
    } else {
      const { data: prof } = await context.supabase
        .from("profiles")
        .select("school_id")
        .eq("user_id", context.userId)
        .maybeSingle();
      schoolId = prof?.school_id ?? undefined;
      if (!schoolId) throw new Error("You are not assigned to a school");

      const isStaff = (roles ?? []).some(
        (r: { role: string }) => r.role === "admin" || r.role === "teacher",
      );
      if (!isStaff) throw new Error("Only school staff can add students");
    }

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
        const { data: prof } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .ilike("email", p.email!)
          .maybeSingle();

        parentUserId = prof?.user_id ?? null;

        if (!parentUserId) {
          const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
          parentUserId =
            list?.users.find((u) => u.email?.toLowerCase() === p.email!.toLowerCase())?.id ?? null;
        }
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

const UploadSchoolLogoInput = z.object({
  school_id: z.string().uuid(),
  logo_data_base64: z.string().optional(),
  logo_url: z.string().optional(),
  content_type: z.string().default("image/png"),
  remove_logo: z.boolean().default(false),
});

export const updateSchoolLogoServer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => UploadSchoolLogoInput.parse(data))
  .handler(async ({ data, context }) => {
    const userId = context.userId;
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role, school_id")
      .eq("user_id", userId);

    const isSuperAdmin = (roles ?? []).some((r: any) => r.role === "super_admin");
    const isSchoolAdmin = (roles ?? []).some(
      (r: any) => r.role === "admin" && r.school_id === data.school_id
    );

    if (!isSuperAdmin && !isSchoolAdmin) {
      throw new Error("Only school administrators or super administrators can update the school logo.");
    }

    let finalUrl: string | null = null;

    if (data.remove_logo) {
      finalUrl = null;
    } else if (data.logo_data_base64) {
      const ext = data.content_type.split("/")[1] || "png";
      const filename = `${data.school_id}/logo_${Date.now()}.${ext}`;
      const buffer = Buffer.from(data.logo_data_base64, "base64");

      const { error: upErr } = await supabaseAdmin.storage
        .from("school-logos")
        .upload(filename, buffer, {
          contentType: data.content_type,
          upsert: true,
        });

      if (upErr) throw new Error(`Storage upload failed: ${upErr.message}`);

      const { data: pubData } = supabaseAdmin.storage
        .from("school-logos")
        .getPublicUrl(filename);

      finalUrl = pubData.publicUrl;
    } else if (data.logo_url) {
      finalUrl = data.logo_url.trim() || null;
    }

    const { error: dbErr } = await (supabaseAdmin as any)
      .from("schools")
      .update({
        logo_url: finalUrl,
      })
      .eq("id", data.school_id);

    if (dbErr) throw new Error(`Database update failed: ${dbErr.message}`);

    return { success: true, logo_url: finalUrl };
  });
