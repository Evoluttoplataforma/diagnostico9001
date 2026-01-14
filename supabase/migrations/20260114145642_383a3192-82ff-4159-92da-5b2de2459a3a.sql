-- Tabela para armazenar leads do quiz Raio-X
CREATE TABLE public.quiz_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  score INTEGER NOT NULL,
  answers JSONB NOT NULL,
  diagnosis_level TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (leads não precisam estar logados)
CREATE POLICY "Anyone can insert quiz leads"
ON public.quiz_leads
FOR INSERT
WITH CHECK (true);

-- Política para leitura apenas por admins (ninguém pode ler sem autenticação)
CREATE POLICY "No public read access"
ON public.quiz_leads
FOR SELECT
USING (false);