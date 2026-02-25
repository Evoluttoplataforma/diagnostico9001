
CREATE TABLE public.dashboard_settings (
  id text PRIMARY KEY DEFAULT 'default',
  section_order jsonb,
  copy_order jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.dashboard_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings
CREATE POLICY "Anyone can read dashboard settings"
  ON public.dashboard_settings FOR SELECT
  USING (true);

-- Insert default row
INSERT INTO public.dashboard_settings (id, section_order, copy_order)
VALUES ('default', '["stats","daily","pie-charts","seg-size","ab-test","copys-ref","recent-leads"]', null);
