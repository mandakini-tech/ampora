import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

// Supabase updated nomenclature: 'publishable' key is the modern name for 'anon' key
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseKey.includes('your-supabase') &&
    !supabaseKey.includes('your-publishable') &&
    !supabaseKey.includes('your-anon')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export const getSupabaseConfig = () => ({
  isConfigured: isSupabaseConfigured(),
  url: supabaseUrl,
  hasKey: isSupabaseConfigured(),
});
