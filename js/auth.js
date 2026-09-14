import { supabase } from "./supabase.js";

export async function signUp(email, password, displayName) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName
      }
    }
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed:", error);
    return { error };
  }

  return { error: null };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Get current user failed:", error);
    return null;
  }

  return data.user;
}
