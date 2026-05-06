import { SupabaseClient } from "@supabase/supabase-js";

// Uses public anon key for reading
export const getManufacturersClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

import { createClient } from "@supabase/supabase-js";

export async function fetchManufacturersByCategory(category: string) {
  const supabase = getManufacturersClient();
  const { data, error } = await supabase
    .from("manufacturers")
    .select("*")
    .eq("category", category)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching manufacturers:", error);
    return [];
  }
  return data;
}

export async function createManufacturer(supabase: SupabaseClient, name: string, category: string) {
  const { data, error } = await supabase
    .from("manufacturers")
    .insert([{ name, category }])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
}
