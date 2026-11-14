import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';

// Supabase updated nomenclature:
// 'secret' key is the modern name for 'service_role' key (server-side admin access)
// 'publishable' key is the modern name for 'anon' key (public client access)
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseKey.includes('your-supabase') &&
    !supabaseKey.includes('your-secret') &&
    !supabaseKey.includes('your-service-role')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

if (isSupabaseConfigured()) {
  console.log('✅ Supabase client initialized successfully.');
} else {
  console.log('⚠️  Supabase environment variables not configured. Backend running in Standby Mode.');
}
