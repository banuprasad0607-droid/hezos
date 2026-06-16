-- =========================================================
-- WHATSAPP BUSINESS MODULE MIGRATION
-- =========================================================

-- 1. Create whatsapp_settings table
CREATE TABLE IF NOT EXISTS public.whatsapp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID UNIQUE NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'meta' CHECK (provider IN ('meta', 'twilio', 'interakt', 'wati')),
  api_key TEXT,
  phone_number_id TEXT,
  whatsapp_business_account_id TEXT,
  sender_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create whatsapp_templates table
CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('UTILITY', 'MARKETING', 'AUTHENTICATION')),
  language TEXT NOT NULL DEFAULT 'en',
  body_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  variables TEXT[] NOT NULL DEFAULT '{}',
  provider_template_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (school_id, name)
);

-- 3. Create whatsapp_campaigns table
CREATE TABLE IF NOT EXISTS public.whatsapp_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('all_parents', 'class', 'student', 'manual')),
  target_class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'completed', 'failed')),
  total_messages INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  delivered_count INTEGER NOT NULL DEFAULT 0,
  read_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create whatsapp_conversations table
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  parent_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  parent_phone TEXT NOT NULL,
  parent_name TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_body TEXT,
  unread_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (school_id, parent_phone)
);

-- 5. Create whatsapp_messages table
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  sender_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  message_body TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document')),
  media_url TEXT,
  provider_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  ai_replied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =========================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_whatsapp_settings_school ON public.whatsapp_settings(school_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_school ON public.whatsapp_templates(school_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_campaigns_school ON public.whatsapp_campaigns(school_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_school ON public.whatsapp_conversations(school_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_assigned ON public.whatsapp_conversations(assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_conversation ON public.whatsapp_messages(conversation_id);

-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================
CREATE TRIGGER trg_whatsapp_settings_updated_at BEFORE UPDATE ON public.whatsapp_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_whatsapp_templates_updated_at BEFORE UPDATE ON public.whatsapp_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_whatsapp_campaigns_updated_at BEFORE UPDATE ON public.whatsapp_campaigns
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_whatsapp_conversations_updated_at BEFORE UPDATE ON public.whatsapp_conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- GRANTS
-- =========================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_settings TO authenticated;
GRANT ALL ON public.whatsapp_settings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_templates TO authenticated;
GRANT ALL ON public.whatsapp_templates TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_campaigns TO authenticated;
GRANT ALL ON public.whatsapp_campaigns TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_conversations TO authenticated;
GRANT ALL ON public.whatsapp_conversations TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_messages TO authenticated;
GRANT ALL ON public.whatsapp_messages TO service_role;

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.whatsapp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- whatsapp_settings: Admin-only view and edit
CREATE POLICY "Users can view settings of their school" ON public.whatsapp_settings
    FOR SELECT TO authenticated USING (school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admin can manage settings" ON public.whatsapp_settings
    FOR ALL TO authenticated USING (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND school_id = whatsapp_settings.school_id AND role IN ('admin', 'super_admin')
        )
    );

-- whatsapp_templates: Visible to school, managed by admins
CREATE POLICY "Users can view templates of their school" ON public.whatsapp_templates
    FOR SELECT TO authenticated USING (school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admin can manage templates" ON public.whatsapp_templates
    FOR ALL TO authenticated USING (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND school_id = whatsapp_templates.school_id AND role IN ('admin', 'super_admin')
        )
    );

-- whatsapp_campaigns: Visible to school, managed by admins
CREATE POLICY "Users can view campaigns of their school" ON public.whatsapp_campaigns
    FOR SELECT TO authenticated USING (school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admin can manage campaigns" ON public.whatsapp_campaigns
    FOR ALL TO authenticated USING (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND school_id = whatsapp_campaigns.school_id AND role IN ('admin', 'super_admin')
        )
    );

-- whatsapp_conversations: Visible to school admins, class teachers, and the parent themselves
CREATE POLICY "Users can view school conversations" ON public.whatsapp_conversations
    FOR SELECT TO authenticated USING (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND (
            -- Admins can see everything in school
            EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND school_id = whatsapp_conversations.school_id AND role IN ('admin', 'super_admin'))
            -- Teachers can see if they teach a child of this parent
            OR EXISTS (
                SELECT 1 FROM public.user_roles ur
                JOIN public.teacher_allocations ta ON ta.teacher_id = ur.user_id
                JOIN public.students s ON s.class_id = ta.class_id
                WHERE ur.user_id = auth.uid() AND s.parent_user_id = whatsapp_conversations.parent_user_id
            )
            -- Parents can see their own thread
            OR parent_user_id = auth.uid()
        )
    );

CREATE POLICY "Staff can manage conversations" ON public.whatsapp_conversations
    FOR ALL TO authenticated USING (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND school_id = whatsapp_conversations.school_id AND role IN ('admin', 'teacher', 'super_admin')
        )
    );

-- whatsapp_messages: Same logic as conversations
CREATE POLICY "Users can view thread messages" ON public.whatsapp_messages
    FOR SELECT TO authenticated USING (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.whatsapp_conversations c
            WHERE c.id = whatsapp_messages.conversation_id
        )
    );

CREATE POLICY "Staff can insert messages" ON public.whatsapp_messages
    FOR INSERT TO authenticated WITH CHECK (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND school_id = whatsapp_messages.school_id AND role IN ('admin', 'teacher', 'super_admin')
        )
    );
