import { supabase } from "@/integrations/supabase/client";

export type NotifyType = "attendance" | "homework" | "remark" | "fee" | "announcement" | "info";

interface NotifyArgs {
  schoolId: string;
  type: NotifyType;
  title: string;
  body?: string;
  link?: string;
}

export async function notifyUsers(userIds: string[], args: NotifyArgs) {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  if (unique.length === 0) return;
  const rows = unique.map((user_id) => ({
    user_id,
    school_id: args.schoolId,
    type: args.type,
    title: args.title,
    body: args.body ?? null,
    link: args.link ?? null,
  }));
  await supabase.from("notifications").insert(rows);
}

export async function notifyParentsOfClass(classId: string, args: NotifyArgs) {
  const { data } = await supabase
    .from("students")
    .select("parent_user_id")
    .eq("class_id", classId)
    .not("parent_user_id", "is", null);
  await notifyUsers((data ?? []).map((s) => s.parent_user_id as string), args);
}

export async function notifyParentsOfSchool(schoolId: string, args: NotifyArgs) {
  const { data } = await supabase
    .from("students")
    .select("parent_user_id")
    .eq("school_id", schoolId)
    .not("parent_user_id", "is", null);
  await notifyUsers((data ?? []).map((s) => s.parent_user_id as string), args);
}

export async function notifyParentOfStudent(studentId: string, args: NotifyArgs) {
  const { data } = await supabase
    .from("students")
    .select("parent_user_id")
    .eq("id", studentId)
    .maybeSingle();
  if (data?.parent_user_id) await notifyUsers([data.parent_user_id], args);
}

/** Build a wa.me click-to-chat link. Phone in E.164 (with or without +). */
export function whatsappLink(phone: string | null | undefined, text: string) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.length < 7) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
