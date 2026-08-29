import { supabase } from "./supabase.js";

export async function signUp(email, password, displayName) {
  return await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email: email,
    password: password
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const result = await supabase.auth.getUser();
  return result.data.user;
}