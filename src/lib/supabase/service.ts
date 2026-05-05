import { createClient } from "@supabase/supabase-js";

export const serviceClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // During build time, Vercel might not have these variables yet.
    // We log a warning instead of throwing to prevent build-time prerendering crashes.
    console.warn("⚠️ Missing Supabase Service Role variables. This is expected during build if not configured in Vercel.");
    
    // Return a dummy client or null to prevent crashes, 
    // but the actual page using it should handle the missing data or be forced dynamic.
    return createClient(url || "https://placeholder.supabase.co", key || "placeholder", {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};
