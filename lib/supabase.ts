
import { createClient } from '@supabase/supabase-js';

// Access environment variables safely for Vite environment
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || "https://eksjajpcbiuvxcqnxxlx.supabase.co";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrc2phanBjYml1dnhjcW54eGx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDU1MDAsImV4cCI6MjA3OTUyMTUwMH0.tL08QW3dWc03CRISX52F9c_wpRJinbLkDA-YgyMJSrU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
