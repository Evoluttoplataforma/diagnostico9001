-- Add segment and company_size columns to quiz_leads table
ALTER TABLE public.quiz_leads 
ADD COLUMN IF NOT EXISTS segment TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT;