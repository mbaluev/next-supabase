-- Sample table: id, name, email, status (enum), created_at
-- Supabase Postgres best practices: bigint identity PK, text, timestamptz, enum type, RLS

DO $$ BEGIN
  CREATE TYPE sample_status AS ENUM ('active', 'disabled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS sample (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  status sample_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sample ADD COLUMN IF NOT EXISTS status sample_status NOT NULL DEFAULT 'active';
ALTER TABLE sample ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE sample ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read access" ON sample
    FOR SELECT TO anon, authenticated
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
