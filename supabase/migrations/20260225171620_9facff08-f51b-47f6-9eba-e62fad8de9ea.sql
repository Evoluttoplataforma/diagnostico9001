ALTER TABLE public.quiz_leads 
ADD COLUMN IF NOT EXISTS utm_source text DEFAULT '',
ADD COLUMN IF NOT EXISTS utm_medium text DEFAULT '',
ADD COLUMN IF NOT EXISTS utm_campaign text DEFAULT '',
ADD COLUMN IF NOT EXISTS utm_content text DEFAULT '',
ADD COLUMN IF NOT EXISTS utm_term text DEFAULT '';