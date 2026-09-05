import { supabase } from "./supabase.js";

import {
  signUp,
  signIn,
  signOut,
  getCurrentUser
} from "./auth.js";

import {
  getProfile,
  saveProfile,
  uploadAvatar
} from "./profile.js";

import { nodes } from "./nodes.js";

import {
  createTrace,
  getMyTraces,
  deleteTrace
} from "./traces.js";

let currentUser = null;
let isRegisterMode = true;

/* DOM Elements */
const authScreen = document.getElementById("auth-screen");
const commandInput = document.getElementById("command-input");
const mainScreen = document.getElementById("main-screen");

const displayNameInput = document.getElementById("display-name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const authButton = document.getElementById("auth-button");
const switchAuth = document.getElementById("switch-auth");
const authMessage = document.getElementById("auth-message");

const userName = document.getElementById("user-name");
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profileAvatar = document.getElementById("profile-avatar");
const logoutButton = document.getElementById("logout-button");

const traceForm = document.getElementById("trace-form");
const traceMessage = document.getElementById("trace-message");
const saveTraceButton = document.getElementById("save-trace");
const cancelTraceButton = document.getElementById("cancel-trace");
const newTraceButton = document.getElementById("new-trace-button");
const newTraceButton2 = document.getElementById("new-trace-button-2");
const characterCount = document.getElementById("character-count");
const traceStatus = document.getElementById("trace-message-status");
const traceList = document.getElementById("trace-list");
const traceCount = document.getElementById("trace-count");

const avatarInput = document.getElementById("avatar-input");
const profileStatus = document.getElementById("profile-status");
const worldMapButton =
  document.getElementById("world-map-button");

const worldMapScreen =
  document.getElementById("world-map-screen");

const closeWorldMap =
  document.getElementById("close-world-map");

if (worldMapButton && worldMapScreen) {
  worldMapButton.addEventListener("click", () => {
    worldMapScreen.classList.remove("hidden");
  });
}

if (closeWorldMap && worldMapScreen) {
  closeWorldMap.addEventListener("click", () => {
    worldMapScreen.classList.add("hidden");
  });
}

document.addEventListener("click", event => {
  const point = event.target.closest(".map-point");

  if (!point) return;

  const nodeId = point.dataset.node;

  if (nodeId && nodes[nodeId]) {
    worldMapScreen.classList.add("hidden");
    openNode(nodeId);
}
});

/* =========================
   COMMAND INTERFACE
========================= */

const commandHistory =
  document.getElementById("command-history");

if (commandInput && commandHistory) {

  commandInput.addEventListener(
    "keydown",
    event => {

      if (event.key !== "Enter") {
        return;
      }

      const command =
        commandInput.value.trim();

      if (!command) {
        return;
      }

      executeCommand(command);

      commandInput.value = "";
    }
  );
}


function executeCommand(command) {

  const raw =
    command.trim();

  const normalized =
    raw.toLowerCase();

  addCommandLine(raw);

  /*
   * =========================
   * KNOWN COMMANDS
   * =========================
   */

  if (normalized === "help") {

    addSystemLine(
      "— — —"
    );

    addSystemLine(
      "SOME COMMANDS ARE NOT LISTED."
    );

    return;
  }


  if (normalized === "open") {

    addSystemLine(
      "OPEN WHAT?"
    );

    return;
  }


  if (normalized === "return") {

    addSystemLine(
      "RETURNING..."
    );

    window.history.back();

    return;
  }


  if (normalized === "who") {

    addSystemLine(
      "IDENTITY: UNRESOLVED"
    );

    return;
  }


  if (normalized === "when") {

    addSystemLine(
      `TIME: ${new Date().toISOString()}`
    );

    return;
  }


  if (normalized === "where") {

    addSystemLine(
      "LOCATION: UNKNOWN"
    );

    return;
  }


  /*
   * =========================
   * NODE ACCESS
   * =========================
   */

  if (nodes[normalized]) {

    openNode(normalized);

    addSystemLine(
      `NODE: ${normalized}`
    );

    return;
  }


  /*
   * =========================
   * UNKNOWN COMMAND
   * =========================
   */

  addSystemLine(
  "REFERENCE NOT FOUND."
);

addSystemLine(
  "REDIRECTING..."
);

setTimeout(() => {
  window.location.href =
    "https://yasarblack.github.io/athar-social-app/";
}, 700);
}

/* =========================
   COMMAND OUTPUT
========================= */

function addCommandLine(text) {

  const line =
    document.createElement("div");

  line.className =
    "command-entry";

  line.textContent =
    `› ${text}`;

  commandHistory.appendChild(line);

  scrollCommandHistory();
}


function addSystemLine(text) {

  const line =
    document.createElement("div");

  line.className =
    "command-response";

  line.textContent =
    text;

  commandHistory.appendChild(line);

  scrollCommandHistory();
}


function scrollCommandHistory() {

  commandHistory.scrollTop =
    commandHistory.scrollHeight;
}

/* =========================
   Initialize App
========================= */

async function init() {
  try {
    const user = await getCurrentUser();

    if (user) {
      await showApp(user);
    } else {
      showAuth();
    }
  } catch (error) {
    console.error("Initialization error:", error);
    showAuth();

    if (authMessage) {
      authMessage.textContent = getErrorMessage(error);
      authMessage.style.color = "#ef4444";
    }
  }
}

init();

/* =========================
   Authentication
========================= */

authButton.addEventListener("click", async () => {
  authMessage.textContent = "جارٍ المعالجة...";
  authMessage.style.color = "#aaa";

  authButton.disabled = true;

  try {
    if (isRegisterMode) {
      const name = displayNameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!name) {
        throw new Error("اكتب اسمك أولًا");
      }

      if (!email || !password) {
        throw new Error("أدخل البريد وكلمة المرور");
      }

      const { data, error } = await signUp(
        email,
        password,
        name
      );

      if (error) {
        throw error;
      }

      if (!data?.user) {
        throw new Error("تعذر إنشاء الحساب.");
      }

      /*
       * Confirm Email is OFF in Supabase.
       * لذلك ننتقل مباشرة إلى التطبيق.
       */
      await showApp(data.user);

    } else {
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        throw new Error("أدخل البريد وكلمة المرور");
      }

      const { data, error } = await signIn(
        email,
        password
      );

      if (error) {
        throw error;
      }

      if (!data?.user) {
        throw new Error("تعذر تسجيل الدخول.");
      }

      await showApp(data.user);
    }

  } catch (error) {
    console.error("Authentication error:", error);

    authMessage.textContent = getErrorMessage(error);
    authMessage.style.color = "#ef4444";

  } finally {
    authButton.disabled = false;
  }
});

/*
 * حالياً ما منستخدم هذا الزر لتغيير واجهة تسجيل الدخول
 * لأن authTitle غير موجود في HTML الحالي.
 *
 * نترك الزر موجود بدون ما يسبب خطأ.
 */
if (switchAuth) {
  switchAuth.addEventListener("click", () => {
    isRegisterMode = !isRegisterMode;

    if (isRegisterMode) {
      if (displayNameInput) {
        displayNameInput.style.display = "block";
      }

      authButton.innerHTML = `
        <span>INITIALIZE</span>
        <b>↗</b>
      `;

      switchAuth.textContent = "لدي حساب بالفعل";

    } else {
      if (displayNameInput) {
        displayNameInput.style.display = "none";
      }

      authButton.innerHTML = `
        <span>ENTER</span>
        <b>↗</b>
      `;

      switchAuth.textContent = "إنشاء حساب جديد";
    }

    authMessage.textContent = "";
  });
}


/* =========================
   Logout
========================= */

logoutButton.addEventListener("click", async () => {
  try {
    await signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }

  currentUser = null;
  showAuth();
});

/* =========================
   Show App
========================= */

async function showApp(user) {
  currentUser = user;

  authScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");

  const name =
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "صديق";

  userName.textContent = `👋 ${name}`;
  profileName.textContent = name;
  profileEmail.textContent = user.email || "";

  profileAvatar.textContent =
    name.charAt(0).toUpperCase();

  try {
    const { data, error } =
      await getProfile(user.id);

    if (!error && data) {

      if (data.display_name) {
        userName.textContent =
          `👋 ${data.display_name}`;

        profileName.textContent =
          data.display_name;

        profileAvatar.textContent =
          data.display_name
            .charAt(0)
            .toUpperCase();
      }

      if (data.avatar_url) {
        setAvatar(data.avatar_url);
      }
    }

  } catch (error) {
    console.error(
      "خطأ في الملف الشخصي:",
      error
    );
  }

  await loadTraces();

  initNodeEngine();
}

/* =========================
   Show Auth
========================= */

function showAuth() {
  mainScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");

  passwordInput.value = "";
}

/* =========================
   Navigation
========================= */

document
  .querySelectorAll(".nav-button")
  .forEach(button => {

    button.addEventListener("click", () => {

      const page = button.dataset.page;

      document
        .querySelectorAll(".nav-button")
        .forEach(btn =>
          btn.classList.remove("active")
        );

      button.classList.add("active");

      document
        .querySelectorAll(".page")
        .forEach(section =>
          section.classList.add("hidden")
        );

      const targetPage =
        document.getElementById(
          `page-${page}`
        );

      if (targetPage) {
        targetPage.classList.remove("hidden");
      }

      if (page === "traces") {
        loadTraces();
      }
    });

  });

/* =========================
   Trace Form
========================= */

function openTraceForm() {
  traceForm.classList.remove("hidden");
  traceMessage.focus();
}

newTraceButton.addEventListener(
  "click",
  openTraceForm
);

newTraceButton2.addEventListener(
  "click",
  openTraceForm
);

cancelTraceButton.addEventListener(
  "click",
  () => {

    traceForm.classList.add("hidden");

    traceMessage.value = "";

    updateCharacterCount();

    traceStatus.textContent = "";
  }
);

/* =========================
   Character Counter
========================= */

traceMessage.addEventListener(
  "input",
  updateCharacterCount
);

function updateCharacterCount() {
  characterCount.textContent =
    `${traceMessage.value.length} / 5000`;
}

/* =========================
   Save Trace
========================= */

saveTraceButton.addEventListener(
  "click",
  async () => {

    const message =
      traceMessage.value.trim();

    if (!message) {
      traceStatus.textContent =
        "3 3 1.";

      traceStatus.style.color =
        "#ef4444";

      return;
    }

    if (!currentUser) {
      traceStatus.textContent =
        "يجب تسجيل الدخول أولًا.";

      traceStatus.style.color =
        "#ef4444";

      return;
    }

    saveTraceButton.disabled = true;

    traceStatus.textContent =
      "3 3 3...";

    traceStatus.style.color = "#aaa";

    try {

      const { error } =
        await createTrace(
          currentUser.id,
          message
        );

      if (error) {
        throw error;
      }

      traceStatus.textContent =
        "4 3 3 3!";

      traceStatus.style.color =
        "#10b981";

      traceMessage.value = "";

      updateCharacterCount();

      await loadTraces();

      setTimeout(() => {

        traceForm.classList.add("hidden");
        traceStatus.textContent = "";

      }, 1200);

    } catch (error) {

      console.error(
        "4 3 3 4:",
        error
      );

      traceStatus.textContent =
        getErrorMessage(error);

      traceStatus.style.color =
        "#ef4444";

    } finally {

      saveTraceButton.disabled = false;

    }
  }
);

/* =========================
   Load Traces
========================= */

async function loadTraces() {

  if (!currentUser) return;

  traceList.innerHTML =
    `<div class="empty-state">
      <p>3 3 1...</p>
    </div>`;

  try {

    const { data, error } =
      await getMyTraces(
        currentUser.id
      );

    if (error) {
      throw error;
    }

    const traces = data || [];

    traceCount.textContent =
      `${traces.length} أثر`;

    if (traces.length === 0) {

      traceList.innerHTML =
        `<div class="empty-state">
          <p>3 x 3 1</p>
        </div>`;

      return;
    }

    traceList.innerHTML = "";

    traces.forEach(trace => {

      const article =
        document.createElement("article");

      article.className = "trace";

      article.innerHTML = `
        <div class="trace-text">
          ${escapeHtml(trace.message)}
        </div>

        <div class="trace-date">
          ${formatDate(trace.created_at)}
        </div>

        <button
          class="secondary-button"
          onclick="removeTrace('${trace.id}')"
        >
          حذف الأثر
        </button>
      `;

      traceList.appendChild(article);
    });

  } catch (error) {

    console.error(error);

    traceList.innerHTML =
      `<div class="empty-state">
        <p>3 3 1</p>
      </div>`;
  }
}

/* =========================
   Delete Trace
========================= */

async function removeTrace(traceId) {

  if (!confirm("هل تريد حذف هذا الأثر؟")) {
    return;
  }

  try {

    const { error } =
      await deleteTrace(
        currentUser.id,
        traceId
      );

    if (error) {
      throw error;
    }

    await loadTraces();

  } catch (error) {

    console.error(error);

    alert(
      getErrorMessage(error)
    );
  }
}

window.removeTrace = removeTrace;

/* =========================
   Avatar Upload
========================= */

avatarInput.addEventListener(
  "change",
  async event => {

    const file =
      event.target.files?.[0];

    if (!file || !currentUser) {
      return;
    }

    if (!file.type.startsWith("image/")) {

      profileStatus.textContent =
        "اختر صورة فقط.";

      return;
    }

    profileStatus.textContent =
      "جارٍ رفع الصورة...";

    try {

      const { error } =
        await uploadAvatar(
          currentUser.id,
          file
        );

      if (error) {
        throw error;
      }

      const extension =
        file.name
          .split(".")
          .pop()
          .toLowerCase();

      const { data } =
        supabase.storage
          .from("avatars")
          .getPublicUrl(
            `${currentUser.id}/avatar.${extension}`
          );

      const avatarUrl =
        `${data.publicUrl}?t=${Date.now()}`;

      await saveProfile(
        currentUser.id,
        profileName.textContent,
        avatarUrl
      );

      setAvatar(avatarUrl);

      profileStatus.textContent =
        "تم تحديث الصورة";

      profileStatus.style.color =
        "#10b981";

    } catch (error) {

      console.error(error);

      profileStatus.textContent =
        getErrorMessage(error);

      profileStatus.style.color =
        "#ef4444";
    }
  }
);

/* =========================
   Set Avatar
========================= */

function setAvatar(url) {

  profileAvatar.innerHTML = "";

  const image =
    document.createElement("img");

  image.src = url;
  image.alt = "الصورة الشخصية";

  profileAvatar.appendChild(image);
}

/* =========================
   NODE ENGINE
========================= */

const nodeViewer =
  document.getElementById(
    "node-viewer"
  );

let currentNodeId = "start";

function openNode(nodeId) {

  const node = nodes[nodeId];

  if (!node || !nodeViewer) {
    return;
  }

  currentNodeId = nodeId;

  const linksHtml =
    (node.links || [])
      .map(link => `
        <button
          class="node-link"
          type="button"
          data-node="${escapeHtml(link.target)}"
        >
          ${escapeHtml(link.label)}
        </button>
      `)
      .join("");

  nodeViewer.innerHTML = `
    <div class="node-frame">

      <div class="node-meta">
        <span>
          ${escapeHtml(node.type || "unknown")}
        </span>

        <span>
          ${escapeHtml(node.id)}
        </span>
      </div>

      <h2 class="node-title">
        ${escapeHtml(node.title || "—")}
      </h2>

      <p class="node-text">
  ${renderNodeText(node.text || "")}
</p>

      ${
        node.meta
          ? `
            <div class="node-extra">
              ${escapeHtml(node.meta)}
            </div>
          `
          : ""
      }

      <div class="node-links">
        ${linksHtml}
      </div>

    </div>
  `;

  nodeViewer
    .querySelectorAll(".node-link")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          openNode(
            button.dataset.node
          );

        }
      );

    });
}

function initNodeEngine() {

  if (!nodeViewer) {
    return;
  }

  openNode("start");
}

/* =========================
   Utility Functions
========================= */

function formatDate(value) {

  if (!value) return "";

  return new Date(value)
    .toLocaleString("ar", {
      dateStyle: "medium",
      timeStyle: "short"
    });
}

function escapeHtml(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}

function renderNodeText(text) {
  let result = escapeHtml(text);

  Object.values(nodes).forEach(node => {
    if (!node.title) return;

    const escapedTitle = escapeHtml(node.title);

    const pattern = new RegExp(
      `(?<![\\w-])${escapeRegExp(escapedTitle)}(?![\\w-])`,
      "gi"
    );

    result = result.replace(
      pattern,
      `<button
        class="inline-node-link"
        type="button"
        data-node="${escapeHtml(node.id)}"
      >$&</button>`
    );
  });

  return result;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

document.addEventListener("click", event => {
  const link = event.target.closest(".inline-node-link");

  if (!link) return;

  const nodeId = link.dataset.node;

  if (nodeId) {
    openNode(nodeId);
  }
});

function getErrorMessage(error) {

  if (!error) {
    return "حدث خطأ غير معروف.";
  }

  const message =
    error.message || "";

  if (
    message.includes(
      "Invalid login credentials"
    )
  ) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  }

  if (
    message.includes(
      "User already registered"
    )
  ) {
    return "هذا البريد مسجل مسبقًا.";
  }

  if (
    message.includes(
      "Password should be at least"
    )
  ) {
    return "كلمة المرور قصيرة جدًا.";
  }

  if (
    message.includes(
      "Email not confirmed"
    )
  ) {
    return "يجب تأكيد البريد الإلكتروني أولًا.";
  }

  return (
    message ||
    "حدث خطأ. حاول مرة أخرى."
  );
}

/* =========================
   Monitor Auth State
========================= */

supabase.auth.onAuthStateChange(
  async (event, session) => {

    if (
      event === "SIGNED_IN" &&
      session?.user
    ) {
      await showApp(
        session.user
      );
    }

    if (
      event === "SIGNED_OUT"
    ) {
      currentUser = null;
      showAuth();
    }
  }
);
