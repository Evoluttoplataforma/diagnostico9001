CREATE TABLE public.daily_visitors (
  date DATE NOT NULL PRIMARY KEY,
  sessions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Disable RLS since this is admin-only (accessed via edge function with password)
ALTER TABLE public.daily_visitors ENABLE ROW LEVEL SECURITY;

-- Insert existing hardcoded data
INSERT INTO public.daily_visitors (date, sessions) VALUES
  ('2026-01-25', 28), ('2026-01-26', 31), ('2026-01-27', 50), ('2026-01-28', 39),
  ('2026-01-29', 43), ('2026-01-30', 43), ('2026-01-31', 17), ('2026-02-01', 24),
  ('2026-02-02', 319), ('2026-02-03', 327), ('2026-02-04', 101), ('2026-02-05', 20),
  ('2026-02-06', 23), ('2026-02-07', 13), ('2026-02-08', 61), ('2026-02-09', 116),
  ('2026-02-10', 60), ('2026-02-11', 67), ('2026-02-12', 76), ('2026-02-13', 23),
  ('2026-02-14', 11), ('2026-02-15', 7), ('2026-02-16', 5), ('2026-02-17', 7),
  ('2026-02-18', 8), ('2026-02-19', 85), ('2026-02-20', 70), ('2026-02-21', 41),
  ('2026-02-22', 43), ('2026-02-23', 40), ('2026-02-24', 35),
  ('2026-02-25', 38), ('2026-02-26', 32),
  ('2026-02-27', 151), ('2026-02-28', 114), ('2026-03-01', 59);