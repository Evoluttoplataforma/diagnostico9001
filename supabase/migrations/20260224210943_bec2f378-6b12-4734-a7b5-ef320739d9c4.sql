-- Add copy_variant column to quiz_leads to track which hero copy the lead saw
ALTER TABLE public.quiz_leads ADD COLUMN copy_variant text DEFAULT NULL;

-- Add copy_variant to quiz_events for funnel tracking
-- (already tracked via event_data, but having it explicit helps analytics)