import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function setupManufacturers() {
  const sql = `
    CREATE TABLE IF NOT EXISTS manufacturers (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      name text NOT NULL,
      category text NOT NULL,
      created_at timestamptz DEFAULT now(),
      UNIQUE(name, category)
    );

    ALTER TABLE manufacturers ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Public read access for manufacturers" ON manufacturers;
    CREATE POLICY "Public read access for manufacturers"
      ON manufacturers FOR SELECT
      USING (true);

    DROP POLICY IF EXISTS "Admins can manage manufacturers" ON manufacturers;
    CREATE POLICY "Admins can manage manufacturers"
      ON manufacturers FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  `;

  const { error } = await supabase.rpc("exec_sql", { sql_text: sql });

  if (error) {
    console.error("Error setting up manufacturers table:", error);
    process.exit(1);
  }

  console.log("Manufacturers table setup complete.");
}

setupManufacturers();
