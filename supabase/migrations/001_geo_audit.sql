-- Tabela principal de auditorias
CREATE TABLE IF NOT EXISTS geo_audits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hash text UNIQUE NOT NULL,
  url text NOT NULL,
  email text NOT NULL,
  ip text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'analyzing', 'ready', 'error')),
  seo_score int,
  geo_score int,
  overall_score int,
  result_data jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

-- Tabela de rate limiting por IP
CREATE TABLE IF NOT EXISTS geo_audit_rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_geo_audits_hash ON geo_audits(hash);
CREATE INDEX IF NOT EXISTS idx_geo_audits_url_created ON geo_audits(url, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_created ON geo_audit_rate_limits(ip, created_at);

-- Toda leitura/escrita é server-side via service_role.
-- Anon não tem acesso direto a nenhuma tabela.
ALTER TABLE geo_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_all" ON geo_audits
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

ALTER TABLE geo_audit_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_all" ON geo_audit_rate_limits
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);
