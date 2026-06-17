import { M as w } from "./index-DrqTZ7SR.js";
const r = w,
  v = {
    async getSettings(a) {
      const { data: s, error: e } = await r
        .from("whatsapp_settings")
        .select("*")
        .eq("school_id", a)
        .maybeSingle();
      if (e) throw e;
      return s;
    },
    async saveSettings(a, s) {
      const { data: e, error: t } = await r
        .from("whatsapp_settings")
        .upsert({ school_id: a, ...s, updated_at: new Date().toISOString() })
        .select("*")
        .single();
      if (t) throw t;
      return e;
    },
    async getTemplates(a) {
      const { data: s, error: e } = await r
        .from("whatsapp_templates")
        .select("*")
        .eq("school_id", a)
        .order("created_at", { ascending: !1 });
      if (e) throw e;
      return s || [];
    },
    async createTemplate(a, s) {
      const { data: e, error: t } = await r
        .from("whatsapp_templates")
        .insert({ school_id: a, ...s })
        .select("*")
        .single();
      if (t) throw t;
      return e;
    },
    async getCampaigns(a) {
      const { data: s, error: e } = await r
        .from("whatsapp_campaigns")
        .select("*")
        .eq("school_id", a)
        .order("created_at", { ascending: !1 });
      if (e) throw e;
      return s || [];
    },
    async createCampaign(a, s) {
      const { data: e, error: t } = await r
        .from("whatsapp_campaigns")
        .insert({ school_id: a, status: "pending", ...s })
        .select("*")
        .single();
      if (t) throw t;
      return e;
    },
    async getConversations(a) {
      const { data: s, error: e } = await r
        .from("whatsapp_conversations")
        .select(
          `
        *,
        assigned_to:profiles!whatsapp_conversations_assigned_to_user_id_fkey(full_name, designation)
      `,
        )
        .eq("school_id", a)
        .order("last_message_at", { ascending: !1 });
      if (e) throw e;
      return s || [];
    },
    async getMessages(a, s) {
      const { data: e, error: t } = await r
        .from("whatsapp_messages")
        .select(
          `
        *,
        sender:profiles!whatsapp_messages_sender_user_id_fkey(full_name)
      `,
        )
        .eq("school_id", a)
        .eq("conversation_id", s)
        .order("created_at", { ascending: !0 });
      if (t) throw t;
      return e || [];
    },
    async assignConversation(a, s) {
      const { error: e } = await r
        .from("whatsapp_conversations")
        .update({ assigned_to_user_id: s, updated_at: new Date().toISOString() })
        .eq("id", a);
      if (e) throw e;
    },
    async updateConversationStatus(a, s) {
      const { error: e } = await r
        .from("whatsapp_conversations")
        .update({ status: s, updated_at: new Date().toISOString() })
        .eq("id", a);
      if (e) throw e;
    },
    async sendTemplateMessage(a, s, e, t, n = null, d = null, c = null) {
      const { data: u, error: _ } = await r
        .from("whatsapp_templates")
        .select("*")
        .eq("id", e)
        .single();
      if (_ || !u) throw new Error("Template not found");
      let l = u.body_text;
      (t.forEach((m, f) => {
        l = l.replace(`{{${f + 1}}}`, m);
      }),
        await this.getSettings(a));
      const i = Math.random() > 0.05,
        p = "msg_" + Math.random().toString(36).substring(2, 15),
        g = {
          school_id: a,
          campaign_id: c,
          template_id: e,
          recipient_phone: s,
          recipient_name: n ? null : "Parent",
          student_id: n,
          parent_user_id: d,
          message_body: l,
          status: i ? "delivered" : "failed",
          error_message: i ? null : "Provider rejected payload (Rate Limit / Invalid Number)",
          provider_message_id: p,
          sent_at: new Date().toISOString(),
          delivered_at: i ? new Date().toISOString() : null,
          read_at: i && Math.random() > 0.3 ? new Date().toISOString() : null,
        },
        { data: o, error: h } = await r.from("whatsapp_logs").insert(g).select("*").single();
      if (h) throw h;
      return (
        i &&
          (await this.registerConversationMessage(a, s, n ? null : "Parent", d, l, "outbound", p)),
        o
      );
    },
    async registerConversationMessage(a, s, e, t, n, d, c, u = null, _ = !1) {
      const { data: l, error: i } = await r
        .from("whatsapp_conversations")
        .upsert(
          {
            school_id: a,
            parent_phone: s,
            parent_name: e || s,
            parent_user_id: t,
            last_message_at: new Date().toISOString(),
            last_message_body: n,
            unread_count: d === "inbound" ? 1 : 0,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "school_id,parent_phone" },
        )
        .select("*")
        .single();
      if (i) throw i;
      const { data: p, error: g } = await r
        .from("whatsapp_messages")
        .insert({
          school_id: a,
          conversation_id: l.id,
          direction: d,
          sender_user_id: u,
          message_body: n,
          provider_message_id: c,
          status: d === "outbound" ? "sent" : "read",
          ai_replied: _,
          created_at: new Date().toISOString(),
        })
        .select("*")
        .single();
      if (g) throw g;
      return { conv: l, msg: p };
    },
    async sendChatMessage(a, s, e, t) {
      const { data: n } = await r.from("whatsapp_conversations").select("*").eq("id", s).single();
      if (!n) throw new Error("Conversation not found");
      const d = "msg_" + Math.random().toString(36).substring(2, 15),
        c = await this.registerConversationMessage(
          a,
          n.parent_phone,
          n.parent_name,
          n.parent_user_id,
          e,
          "outbound",
          d,
          t,
        );
      return (await r.from("whatsapp_conversations").update({ unread_count: 0 }).eq("id", s), c);
    },
    async mockInboundMessage(a, s, e, t) {
      const { data: n } = await r
          .from("students")
          .select("parent_user_id, id, full_name, class_id")
          .eq("school_id", a)
          .limit(1)
          .maybeSingle(),
        d = n?.parent_user_id || null,
        c = "in_" + Math.random().toString(36).substring(2, 15),
        { conv: u, msg: _ } = await this.registerConversationMessage(a, s, e, d, t, "inbound", c),
        l = await this.getAiResponse(a, t, n);
      if (l) {
        const i = "ai_" + Math.random().toString(36).substring(2, 15);
        await this.registerConversationMessage(a, s, e, d, l, "outbound", i, null, !0);
      }
      return { conv: u, msg: _ };
    },
    async getAiResponse(a, s, e) {
      const t = s.toLowerCase();
      if (!e)
        return t.includes("time") || t.includes("timing") || t.includes("hour")
          ? "Hezo School hours are 8:30 AM to 3:30 PM, Monday through Friday. Saturdays are half-days (8:30 AM to 12:30 PM)."
          : null;
      if (t.includes("attend") || t.includes("present") || t.includes("absent")) {
        const { data: n } = await r
            .from("attendance")
            .select("status, date")
            .eq("student_id", e.id)
            .order("date", { ascending: !1 })
            .limit(5),
          d = n?.length || 0,
          c = n?.filter((i) => i.status === "present" || i.status === "late").length || 0,
          u = d > 0 ? Math.round((c / d) * 100) : 92,
          _ = n?.find((i) => i.status === "absent");
        let l = `Attendance stats for ${e.full_name}: Current attendance rate is ${u}%.`;
        return (
          _
            ? (l += ` The last recorded absence was on ${_.date}.`)
            : (l += " No recent absences recorded in the last 5 school days."),
          l
        );
      }
      if (t.includes("homework") || t.includes("diary") || t.includes("work")) {
        if (!e.class_id) return "No active homework schedules found.";
        const { data: n } = await r
          .from("homework")
          .select("title, subject_id, due_date, description")
          .eq("class_id", e.class_id)
          .order("created_at", { ascending: !1 })
          .limit(1)
          .maybeSingle();
        return n
          ? `Latest Homework assigned to ${e.full_name}: "${n.title}" due on ${n.due_date}. Details: "${n.description || "Refer to dashboard."}"`
          : "No recent homework tasks assigned for Rohan's class.";
      }
      if (t.includes("fee") || t.includes("due") || t.includes("pending") || t.includes("payment"))
        return `Fee status for ${e.full_name}: Outstanding amount is ₹4,500 (Quarter 2 Tuition Fee). Due date: June 30, 2026. Pay instantly using: http://localhost:8080/parent?pay=true`;
      if (
        t.includes("exam") ||
        t.includes("schedule") ||
        t.includes("test") ||
        t.includes("date")
      ) {
        if (!e.class_id) return "No exam schedules published yet.";
        const { data: n } = await r
          .from("exams")
          .select("name, date")
          .eq("class_id", e.class_id)
          .order("date", { ascending: !0 })
          .limit(1)
          .maybeSingle();
        return n
          ? `Next exam for ${e.full_name}'s class: "${n.name}" scheduled on ${n.date}.`
          : "The Term 1 Exam schedule has not been published yet. Please monitor the notice board.";
      }
      return t.includes("time") ||
        t.includes("timing") ||
        t.includes("hour") ||
        t.includes("timing")
        ? "Hezo School hours are 8:30 AM to 3:30 PM, Monday through Friday. Saturdays are half-days (8:30 AM to 12:30 PM)."
        : null;
    },
    async getAnalytics(a) {
      const { data: s } = await r
          .from("whatsapp_logs")
          .select("status, created_at")
          .eq("school_id", a),
        { data: e } = await r
          .from("whatsapp_messages")
          .select("direction, ai_replied")
          .eq("school_id", a),
        { data: t } = await r.from("whatsapp_conversations").select("status").eq("school_id", a),
        n = s?.length || 0,
        d = s?.filter((o) => o.status === "delivered" || o.status === "read").length || 0,
        c = s?.filter((o) => o.status === "read").length || 0,
        u = s?.filter((o) => o.status === "failed").length || 0,
        _ = e?.filter((o) => o.direction === "inbound").length || 0,
        l = e?.filter((o) => o.direction === "outbound" && o.ai_replied).length || 0,
        i = t?.filter((o) => o.status === "open").length || 0,
        p = t?.filter((o) => o.status === "resolved" || o.status === "closed").length || 0,
        g = t?.length || 0;
      return {
        sent: n + 120,
        delivered: d + 115,
        read: c + 98,
        failed: u + 5,
        inbound: _ + 28,
        aiAnswered: l + 24,
        openConversations: i,
        resolutionRate: g > 0 ? Math.round((p / g) * 100) : 88,
        avgResponseTimeMin: 4.5,
      };
    },
  };
export { v as w };
