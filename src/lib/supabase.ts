import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cssprrabmnmbsxsyxznw.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_v4QrpeddcCj0Tg7pwunVZw_6QtViOOO';

export const isLiveSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseKey.includes('mock-anon-key') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
