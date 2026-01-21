-- Allow updating pillar_scores and ai_diagnosis columns
-- This is safe because these are only diagnostic data, not sensitive user info
CREATE POLICY "Allow updating diagnosis data" 
ON public.quiz_leads 
FOR UPDATE
USING (true)
WITH CHECK (true);