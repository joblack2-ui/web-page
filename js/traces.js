import { supabase } from "./supabase.js";

export async function createTrace(userId, message) {
  return await supabase
    .from("traces")
    .insert({
      user_id: userId,
      message: message
    });
}

export async function getMyTraces(userId) {
  return await supabase
    .from("traces")
    .select("id, message, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function deleteTrace(userId, traceId) {
  return await supabase
    .from("traces")
    .delete()
    .eq("id", traceId)
    .eq("user_id", userId);
}