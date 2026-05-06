import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seedManufacturers() {
  const dataPath = path.join(process.cwd(), "data", "manufacturers-seed.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const manufacturers = JSON.parse(rawData);

  console.log(`Seeding ${manufacturers.length} manufacturers...`);

  const { error } = await supabase
    .from("manufacturers")
    .upsert(manufacturers, { onConflict: "name,category" });

  if (error) {
    console.error("Error seeding manufacturers:", error);
    process.exit(1);
  }

  console.log("Seeding successful.");

  // Verify
  const { count, error: verifyError } = await supabase
    .from("manufacturers")
    .select("*", { count: 'exact', head: true });

  if (verifyError) {
    console.error("Error verifying:", verifyError);
    process.exit(1);
  }

  console.log(`Total manufacturers in DB: ${count}`);
}

seedManufacturers();
