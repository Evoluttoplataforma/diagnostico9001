-- Create appointments table
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.quiz_leads(id) ON DELETE CASCADE,
  lead_name TEXT NOT NULL,
  lead_email TEXT NOT NULL,
  lead_phone TEXT NOT NULL,
  company TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  meeting_link TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  pipedrive_activity_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert appointments (public booking)
CREATE POLICY "Anyone can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (true);

-- No public read access (admin only via service role)
CREATE POLICY "No public read access" 
ON public.appointments 
FOR SELECT 
USING (false);

-- Create available_slots table for managing availability
CREATE TABLE public.available_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date, time)
);

-- Enable RLS
ALTER TABLE public.available_slots ENABLE ROW LEVEL SECURITY;

-- Allow public read access to check availability
CREATE POLICY "Anyone can view available slots" 
ON public.available_slots 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_appointments_updated_at();

-- Insert default available slots for next 30 days (weekdays, 9h-17h)
INSERT INTO public.available_slots (date, time)
SELECT 
  d::date,
  t::time
FROM generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day') AS d
CROSS JOIN (
  SELECT '09:00'::time AS t UNION ALL
  SELECT '10:00'::time UNION ALL
  SELECT '11:00'::time UNION ALL
  SELECT '14:00'::time UNION ALL
  SELECT '15:00'::time UNION ALL
  SELECT '16:00'::time UNION ALL
  SELECT '17:00'::time
) AS times
WHERE EXTRACT(DOW FROM d::date) BETWEEN 1 AND 5  -- Only weekdays
ON CONFLICT (date, time) DO NOTHING;