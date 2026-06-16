-- =========================================================
-- ACHIEVEMENTS AND RANKINGS ENHANCEMENTS MIGRATION
-- =========================================================

-- 1) Add is_published column to rankings and awards
ALTER TABLE public.rankings
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

ALTER TABLE public.awards
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- 2) Add enabled_categories to ranking_rules
ALTER TABLE public.ranking_rules
  ADD COLUMN IF NOT EXISTS enabled_categories TEXT[] DEFAULT ARRAY[
    'rank_1', 'rank_2', 'rank_3', 'top_10', 'subject_topper', 
    'class_topper', 'section_topper', 'school_topper', 
    'attendance_topper', 'most_improved', 'discipline_award', 
    'olympiad', 'sports', 'cultural', 'scholarship'
  ]::TEXT[];

-- 3) Update existing students seed data to have proper admission_number values
UPDATE public.students SET admission_number = 'ADM-2026-001' WHERE roll_number = '101';
UPDATE public.students SET admission_number = 'ADM-2026-002' WHERE roll_number = '102';
UPDATE public.students SET admission_number = 'ADM-2026-003' WHERE roll_number = '103';
UPDATE public.students SET admission_number = 'ADM-2026-004' WHERE roll_number = '104';
UPDATE public.students SET admission_number = 'ADM-2026-005' WHERE roll_number = '105';
UPDATE public.students SET admission_number = 'ADM-2026-006' WHERE roll_number = '106';
UPDATE public.students SET admission_number = 'ADM-2026-007' WHERE roll_number = '107';
UPDATE public.students SET admission_number = 'ADM-2026-008' WHERE roll_number = '108';

-- 4) Set all previously seeded rankings and awards as published
UPDATE public.rankings SET is_published = true;
UPDATE public.awards SET is_published = true;
