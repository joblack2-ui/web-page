import { supabase } from "./supabase.js";

export async function getProfile(userId) {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
}

export async function saveProfile(userId, displayName, avatarUrl = null) {
  return await supabase
    .from("profiles")
    .upsert({
      id: userId,
      display_name: displayName,
      avatar_url: avatarUrl
    });
}

export async function uploadAvatar(userId, file) {
  const extension = file.name.split(".").pop().toLowerCase();
  const filePath = `${userId}/avatar.${extension}`;

  return await supabase
    .storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    });
}

export function getAvatarUrl(userId, extension) {
  return supabase
    .storage
    .from("avatars")
    .getPublicUrl(`${userId}/avatar.${extension}`)
    .data
    .publicUrl;
}