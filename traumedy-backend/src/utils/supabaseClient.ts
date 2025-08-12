// src/utils/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// Your project URL and Anon public key
const supabaseUrl = "https://ibnoriwbwxvqudfvuihh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlibm9yaXdid3h2cXVkZnZ1aWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTQxNzcsImV4cCI6MjA2OTY5MDE3N30.I2Q_TZXsjZeobcrj474IRBjf4nBf6eQXXp7UIETSlp4";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
