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

import {
  createTrace,
  getMyTraces,
  deleteTrace
} from "./traces.js";

let currentUser = null;
let isRegisterMode = true;

/* DOM Elements */
const authScreen = document.getElementById("auth-screen");
const mainScreen = document.getElementById("main-screen");
const authTitle = document.getElementById("auth-title");
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

/* Initialize App */
async function init() {
  const user = await getCurrentUser();

  if (user) {
    if (!user.email_confirmed_at) {
      await signOut();
      showAuth();

      authMessage.textContent =
        "يجب تأكيد بريدك الإلكتروني أولاً.";
      authMessage.style.color = "#ffcc66";

      return;
    }

    await showApp(user);
  } else {
    showAuth();
  }
}

init();

/* Authentication Events */
authButton.addEventListener("click", async () => {
  authMessage.textContent = "جارٍ المعالجة...";
  authMessage.style.color = "#aaa";

  try {
    if (isRegisterMode) {
      const name = displayNameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!name) throw new Error("اكتب اسمك أولًا");
      if (!email || !password) throw new Error("أدخل البريد وكلمة المرور");

      const { data, error } = await signUp(email, password, name);
      if (error) {
  throw error;
}

if (!data.user?.email_confirmed_at) {
  await signOut();

  authMessage.textContent =
    "يجب تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد.";
  authMessage.style.color = "#ffcc66";

  return;
}

await showApp(data.user);

      if (data.session) {
        await showApp(data.user);
      } else {
        authMessage.textContent = "تم إنشاء الحساب. تحقق من بريدك الإلكتروني.";
        authMessage.style.color = "#10b981";
      }
    } else {
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) throw new Error("أدخل البريد وكلمة المرور");

      const { data, error } = await signIn(email, password);
      if (error) throw error;

      await showApp(data.user);
    }
  } catch (error) {
    console.error(error);
    authMessage.textContent = getErrorMessage(error);
    authMessage.style.color = "#ef4444";
  }
});

switchAuth.addEventListener("click", () => {
  isRegisterMode = !isRegisterMode;

  
if (isRegisterMode) {
  authTitle.textContent = "إنشاء حساب";

  authButton.textContent = "إنشاء الحساب";

  switchAuth.textContent = "لدي حساب بالفعل";

  displayNameInput.style.display = "block";
} else {
  authTitle.textContent = "تسجيل الدخول";

  authButton.textContent = "دخول";

  switchAuth.textContent = "إنشاء حساب جديد";

  displayNameInput.style.display = "none";
}
  authMessage.textContent = "";
});

logoutButton.addEventListener("click", async () => {
  await signOut();
  currentUser = null;
  showAuth();
});

/* Show App After Login */
async function showApp(user) {
  currentUser = user;
  authScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");

  const name = user.user_metadata?.display_name || user.email?.split("@")[0] || "صديق";

  userName.textContent = `👋 ${name}`;
  profileName.textContent = name;
  profileEmail.textContent = user.email || "";
  profileAvatar.textContent = name.charAt(0).toUpperCase();

  try {
    const { data, error } = await getProfile(user.id);
    if (!error && data) {
      if (data.display_name) {
        userName.textContent = `👋 ${data.display_name}`;
        profileName.textContent = data.display_name;
        profileAvatar.textContent = data.display_name.charAt(0).toUpperCase();
      }
      if (data.avatar_url) setAvatar(data.avatar_url);
    }
  } catch (error) {
    console.error("خطأ في الملف الشخصي:", error);
  }

  await loadTraces();
}

function showAuth() {
  mainScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
  passwordInput.value = "";
}

/* Navigation */
document.querySelectorAll(".nav-button").forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;
    document.querySelectorAll(".nav-button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".page").forEach(section => section.classList.add("hidden"));
    document.getElementById(`page-${page}`).classList.remove("hidden");
    if (page === "traces") loadTraces();
  });
});

/* Trace Form */
function openTraceForm() {
  traceForm.classList.remove("hidden");
  traceMessage.focus();
}

newTraceButton.addEventListener("click", openTraceForm);
newTraceButton2.addEventListener("click", openTraceForm);

cancelTraceButton.addEventListener("click", () => {
  traceForm.classList.add("hidden");
  traceMessage.value = "";
  updateCharacterCount();
  traceStatus.textContent = "";
});

/* Character Counter */
traceMessage.addEventListener("input", updateCharacterCount);

function updateCharacterCount() {
  characterCount.textContent = `${traceMessage.value.length} / 5000`;
}

/* Save Trace */
saveTraceButton.addEventListener("click", async () => {
  const message = traceMessage.value.trim();

  if (!message) {
    traceStatus.textContent = "اكتب أثرك أولًا.";
    traceStatus.style.color = "#ef4444";
    return;
  }

  if (!currentUser) {
    traceStatus.textContent = "يجب تسجيل الدخول أولًا.";
    return;
  }

  saveTraceButton.disabled = true;
  traceStatus.textContent = "جارٍ حفظ الأثر...";
  traceStatus.style.color = "#aaa";

  try {
    const { error } = await createTrace(currentUser.id, message);
    if (error) throw error;

    traceStatus.textContent = "✅ تم حفظ أثرك بنجاح!";
    traceStatus.style.color = "#10b981";
    traceMessage.value = "";
    updateCharacterCount();
    await loadTraces();

    setTimeout(() => {
      traceForm.classList.add("hidden");
      traceStatus.textContent = "";
    }, 1200);
  } catch (error) {
    console.error("خطأ في حفظ الأثر:", error);
    traceStatus.textContent = getErrorMessage(error);
    traceStatus.style.color = "#ef4444";
  }

  saveTraceButton.disabled = false;
});

/* Load Traces */
async function loadTraces() {
  if (!currentUser) return;

  traceList.innerHTML = `<div class="empty-state"><p>جارٍ تحميل آثارك...</p></div>`;

  try {
    const { data, error } = await getMyTraces(currentUser.id);
    if (error) throw error;

    const traces = data || [];
    traceCount.textContent = `${traces.length} أثر`;

    if (traces.length === 0) {
      traceList.innerHTML = `<div class="empty-state"><p>✨ لم تترك أثراً بعد</p></div>`;
      return;
    }

    traceList.innerHTML = "";
    traces.forEach(trace => {
      const article = document.createElement("article");
      article.className = "trace";
      article.innerHTML = `
        <div class="trace-text">${escapeHtml(trace.message)}</div>
        <div class="trace-date">📅 ${formatDate(trace.created_at)}</div>
        <button class="secondary-button" onclick="removeTrace('${trace.id}')">🗑️ حذف الأثر</button>
      `;
      traceList.appendChild(article);
    });
  } catch (error) {
    console.error(error);
    traceList.innerHTML = `<div class="empty-state"><p>تعذر تحميل الآثار</p></div>`;
  }
}

/* Delete Trace */
async function removeTrace(traceId) {
  if (!confirm("هل تريد حذف هذا الأثر؟")) return;

  try {
    const { error } = await deleteTrace(currentUser.id, traceId);
    if (error) throw error;
    await loadTraces();
  } catch (error) {
    console.error(error);
    alert(getErrorMessage(error));
  }
}

window.removeTrace = removeTrace;

/* Avatar Upload */
avatarInput.addEventListener("change", async event => {
  const file = event.target.files?.[0];

  if (!file || !currentUser) return;
  if (!file.type.startsWith("image/")) {
    profileStatus.textContent = "اختر صورة فقط.";
    return;
  }

  profileStatus.textContent = "جارٍ رفع الصورة...";

  try {
    const { error } = await uploadAvatar(currentUser.id, file);
    if (error) throw error;

    const extension = file.name.split(".").pop().toLowerCase();
    const { data } = supabase.storage.from("avatars").getPublicUrl(`${currentUser.id}/avatar.${extension}`);
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

    await saveProfile(currentUser.id, profileName.textContent, avatarUrl);
    setAvatar(avatarUrl);

    profileStatus.textContent = "✅ تم تحديث الصورة";
    profileStatus.style.color = "#10b981";
  } catch (error) {
    console.error(error);
    profileStatus.textContent = getErrorMessage(error);
    profileStatus.style.color = "#ef4444";
  }
}
);

/* Set Avatar */
function setAvatar(url) {
  profileAvatar.innerHTML = "";
  const image = document.createElement("img");
  image.src = url;
  image.alt = "الصورة الشخصية";
  profileAvatar.appendChild(image);
}

/* Utility Functions */
function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getErrorMessage(error) {
  if (!error) return "حدث خطأ غير معروف.";
  const message = error.message || "";
  if (message.includes("Invalid login credentials")) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (message.includes("User already registered")) return "هذا البريد مسجل مسبقًا.";
  if (message.includes("Password should be at least")) return "كلمة المرور قصيرة جدًا.";
  if (message.includes("Email not confirmed")) return "يجب تأكيد البريد الإلكتروني أولًا.";
  return message || "حدث خطأ. حاول ��رة أخرى.";
}

/* Monitor Auth State */
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session?.user) {
    await showApp(session.user);
  }
  if (event === "SIGNED_OUT") {
    currentUser = null;
    showAuth();
  }
});
