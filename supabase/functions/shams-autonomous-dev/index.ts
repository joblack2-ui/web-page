import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const REPO = "joblack2-ui/web-page";
const BRANCH = "shams-dev";
const SUPABASE_URL = "https://segvezobgcguucugmgwi.supabase.co";
const BRIDGE_URL = SUPABASE_URL + "/functions/v1/shams-dev-bridge";
const GITHUB_API = "https://api.github.com";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const protectedPaths = ["supabase/functions/shams-chat-v1", "js/app.js", "js/supabase.js", "js/auth.js"];
function json(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } }); }
function allowedPath(path: string) { return !!path && !path.startsWith("/") && !path.includes("..") && !protectedPaths.some((p) => path === p || path.startsWith(p + "/")); }
async function gh(path: string) {
  const token = Deno.env.get("GITHUB_TOKEN");
  if (!token) throw new Error("GITHUB_TOKEN is not configured");
  return fetch(GITHUB_API + path, { headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "athar-shams-autonomous-dev" } });
}
async function readFile(path: string) {
  const r = await gh("/repos/" + REPO + "/contents/" + path + "?ref=" + BRANCH);
  if (!r.ok) throw new Error("GitHub read failed for " + path + ": " + r.status);
  const d = await r.json();
  const bytes = Uint8Array.from(atob(String(d.content).replace(/\n/g, "")), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
async function callModel(task: string, context: string) {
  const key = Deno.env.get("GROQ_API_KEY");
  if (!key) throw new Error("GROQ_API_KEY is not configured");
  const prompt = "You are Shams, autonomous developer of Athar. Work only on branch shams-dev. Never touch protected paths: " + protectedPaths.join(", ") + ". Never edit main, never delete files, never expose secrets. Preserve the deliberate unknown-command redirect to https://yasarblack.github.io/athar-social-app/. Invent features freely, but label unsupported real-world information as UNVERIFIED/SPECULATIVE/FICTIONAL. Return JSON only with path, content, message. Choose one file only. Task: " + task + "\n\nRepository context:\n" + context;
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "qwen/qwen3.8-27b",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "Return ONLY valid JSON. Required object fields: path, content, message. All three values must be strings. No markdown or commentary." },
        { role: "user", content: prompt }
      ]
    })
  });
  if (!r.ok) {
    const detail = await r.text();
    throw new Error("Groq model request failed: " + r.status + " " + detail.slice(0, 500));
  }
  const d = await r.json();
  const raw = d.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Groq model returned no content");
  const cleaned = String(raw).trim();
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first < 0 || last <= first) throw new Error("Groq model returned invalid JSON");
  try { return JSON.parse(cleaned.slice(first, last + 1)); }
  catch { throw new Error("Groq model returned invalid JSON"); }
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    const body = await req.json();
    const task = String(body.task || "").trim();
    if (!task) return json({ error: "task is required" }, 400);
    const requested = Array.isArray(body.context_paths) ? body.context_paths.map(String).filter(allowedPath).slice(0, 8) : ["SHAMS_DEV.md", "SHAMS_AUTONOMY.md"];
    const parts: string[] = [];
    for (const path of requested) {
      try { parts.push("\n--- " + path + " ---\n" + (await readFile(path)).slice(0, 120000)); } catch {}
    }
    const proposal = await callModel(task, parts.join("\n"));
    const path = String(proposal.path || "");
    const content = String(proposal.content ?? "");
    const message = String(proposal.message || "Shams autonomous development change");
    if (!allowedPath(path)) return json({ error: "Model proposed a protected or invalid path" }, 403);
    if (content.length > 500000) return json({ error: "Proposed file is too large" }, 413);
    const bridgeKey = Deno.env.get("SHAMS_DEV_BRIDGE_KEY");
    if (!bridgeKey) throw new Error("SHAMS_DEV_BRIDGE_KEY is not configured");
    const write = await fetch(BRIDGE_URL, { method: "POST", headers: { Authorization: "Bearer " + bridgeKey, "Content-Type": "application/json" }, body: JSON.stringify({ action: "write_file", branch: BRANCH, path, content, message }) });
    const result = await write.json();
    if (!write.ok) return json({ error: "Bridge rejected change", bridge: result }, write.status);
    return json({ ok: true, mode: "autonomous-dev", repository: REPO, branch: BRANCH, proposal: { path, message }, bridge: result });
  } catch (error) {
    console.error("SHAMS AUTONOMOUS DEV:", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});