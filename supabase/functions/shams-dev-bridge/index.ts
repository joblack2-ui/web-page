import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const REPO = "joblack2-ui/web-page";
const BRANCH = "shams-dev";
const API = "https://api.github.com";

const PROTECTED_PREFIXES = [
  "supabase/functions/shams-chat-v1",
  "js/app.js",
  "js/supabase.js",
  "js/auth.js",
];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function allowedPath(path: string) {
  if (!path || path.startsWith("/") || path.includes("..")) return false;
  return !PROTECTED_PREFIXES.some((prefix) =>
    path === prefix || path.startsWith(prefix + "/")
  );
}

async function github(path: string, init: RequestInit = {}) {
  const token = Deno.env.get("GITHUB_TOKEN");
  if (!token) throw new Error("GITHUB_TOKEN is not configured");

  const headers = new Headers(init.headers);
  headers.set("Authorization", "Bearer " + token);
  headers.set("Accept", "application/vnd.github+json");
  headers.set("X-GitHub-Api-Version", "2022-11-28");
  headers.set("User-Agent", "athar-shams-dev-bridge");

  return fetch(API + path, { ...init, headers });
}

async function commitFile(path: string, content: string, message: string) {
  const existing = await github(
    "/repos/" + REPO + "/contents/" + path + "?ref=" + BRANCH,
  );

  let sha: string | undefined;

  if (existing.ok) {
    const data = await existing.json();
    sha = data.sha;
  } else if (existing.status !== 404) {
    throw new Error("GitHub read failed: " + existing.status);
  }

  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: BRANCH,
  };

  if (sha) body.sha = sha;

  const response = await github("/repos/" + REPO + "/contents/" + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("GitHub write failed: " + JSON.stringify(result));
  }

  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  try {
    const auth = req.headers.get("authorization");
    const expected = Deno.env.get("SHAMS_DEV_BRIDGE_KEY");

    if (!expected || auth !== "Bearer " + expected) {
      return json({ error: "Unauthorized" }, 401);
    }

    const body = await req.json();

    if (body.action !== "write_file" && body.action !== "restore_file") {
      return json({ error: "Unsupported action" }, 400);
    }

    if (body.branch !== BRANCH) {
      return json({ error: "Only shams-dev is writable" }, 400);
    }

    const path = String(body.path || "");
    const content = String(body.content ?? "");
    const message = String(body.message || (body.action === "restore_file" ? "Shams automatic rollback" : "Shams development change"));

    if (!allowedPath(path)) {
      return json({ error: "Protected or invalid path" }, 403);
    }

    if (content.length > 500_000) {
      return json({ error: "File too large" }, 413);
    }

    const result = await commitFile(path, content, message);

    return json({
      ok: true,
      repository: REPO,
      branch: BRANCH,
      path,
      commit: result.commit?.sha ?? null,
      action: body.action,
    });
  } catch (error) {
    console.error("SHAMS DEV BRIDGE:", error);
    return json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, 500);
  }
});
