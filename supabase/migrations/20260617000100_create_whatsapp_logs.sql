-- SQL Migration: 20260617000100_create_whatsapp_logs.sql
-- Creates the missing whatsapp_logs table and configures proper RLS isolation

CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.whatsapp_campaigns(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.whatsapp_templates(id) ON DELETE SET NULL,
  recipient_phone TEXT NOT NULL,
  recipient_name TEXT,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  parent_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  message_body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  provider_message_id TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_school ON public.whatsapp_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_campaign ON public.whatsapp_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_student ON public.whatsapp_logs(student_id);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.whatsapp_logs TO authenticated;
GRANT ALL ON public.whatsapp_logs TO service_role;

-- Row Level Security (RLS)
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view logs belonging to their school
CREATE POLICY "Users can view logs of their school" ON public.whatsapp_logs
    FOR SELECT TO authenticated 
    USING (school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()));

-- Policy: Staff can insert logs for their school
CREATE POLICY "Staff can insert logs" ON public.whatsapp_logs
    FOR INSERT TO authenticated 
    WITH CHECK (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND school_id = whatsapp_logs.school_id AND role IN ('admin', 'teacher', 'super_admin')
        )
    );

-- Policy: Staff can update logs for their school (e.g. updating delivery status from provider callbacks)
CREATE POLICY "Staff can update logs" ON public.whatsapp_logs
    FOR UPDATE TO authenticated 
    USING (
        school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
        AND EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND school_id = whatsapp_logs.school_id AND role IN ('admin', 'teacher', 'super_admin')
        )
    );
