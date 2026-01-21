-- Add columns for storing complete diagnosis results
ALTER TABLE public.quiz_leads 
ADD COLUMN pillar_scores jsonb,
ADD COLUMN ai_diagnosis jsonb;