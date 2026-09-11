/* =========================================================
   008 — TIME GATE
   بوابة زمنية دوارة بفيزياء لمس حقيقية
========================================================= */

const GATE_YEARS = [
  1923, 1933, 1944, 1955, 1966, 1977,
  1988, 1999, 2010, 2024, 2033, 2041
];

const IMAGES_PER_YEAR = 10;
const STEP = 360 / GATE_YEARS.length;

const FRICTION = 0.95;
const VELOCITY_STOP_THRESHOLD = 0.02;
const SNAP_DURATION = 550;

/* DOM */
const gateButton = document.getElementById("time-gate-button");
const gateScreen = document.getElementById("node-008-screen");
const closeGateButton = document.getElementById("close-node-008");

const wheelWrap = document.getElementById("gate-wheel-wrap");
const wheel = document.getElementById("gate-wheel");
const gateCore = document.getElementById("gate-core");
const selectedYearLabel = document.getElementById("gate-selected-year");
const gateHint = document.getElementById("gate-hint");

const gallery = document.getElementById("node-008-gallery");
const galleryYearLabel = document.getElementById("gallery-year-label");
const galleryGrid = document.getElementById("gallery-grid");
const closeGalleryButton = document.getElementById("close-gallery-008");

if (gateButton && gateScreen && wheel) {

  /* =========================
     بناء السنوات على المحيط
  ========================= */

  GATE_YEARS.forEach((year, index) => {
    const angle = index * STEP;

    const label = document.createElement("div");
    label.className = "gate-year";
    label.textContent = year;
    label.style.transform =
      `rotate(${angle}deg) translateY(-50%)`;

    wheel.appendChild(label);
  });

  /* =========================
     الحالة
  ========================= */

  let rotation = 0;
  let isDragging = false;
  let isSettled = true;
  let selectedIndex = null;

  let startPointerAngle = 0;
  let startRotation = 0;

  let angleHistory = [];
  let inertiaFrame = null;
  let snapFrame = null;

  /* =========================
     أدوات حسابية
  ========================= */

  function getCenter() {
    const rect = wheelWrap.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }

  function getAngle(clientX, clientY, center) {
    const dx = clientX - center.x;
    const dy = clientY - center.y;
    return Math.atan2(dx, -dy) * (180 / Math.PI);
  }

  function normalizeDelta(delta) {
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    return delta;
  }

  function applyRotation(deg) {
    rotation = deg;
    wheel.style.transform = `rotate(${rotation}deg)`;
  }

  function getSelectedIndexFromRotation(rot) {
    const normalized = ((-rot % 360) + 360) % 360;
    return Math.round(normalized / STEP) % GATE_YEARS.length;
  }

  /* =========================
     بداية اللمس
  ========================= */

  function onPointerDown(event) {
    if (!isSettled) return;

    isDragging = true;
    isSettled = false;

    cancelAnimationFrame(inertiaFrame);
    cancelAnimationFrame(snapFrame);

    gateCore.classList.remove("ready");
    gateHint.textContent = "دوّري البوابة";

    const center = getCenter();
    startPointerAngle = getAngle(event.clientX, event.clientY, center);
    startRotation = rotation;

    angleHistory = [{ angle: rotation, time: performance.now() }];

    wheelWrap.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!isDragging) return;

    const center = getCenter();
    const currentAngle = getAngle(event.clientX, event.clientY, center);
    const delta = normalizeDelta(currentAngle - startPointerAngle);

    applyRotation(startRotation + delta);

    angleHistory.push({ angle: rotation, time: performance.now() });
    if (angleHistory.length > 5) angleHistory.shift();
  }

  function onPointerUp() {
    if (!isDragging) return;

    isDragging = false;

    let velocity = 0;

    if (angleHistory.length >= 2) {
      const first = angleHistory[0];
      const last = angleHistory[angleHistory.length - 1];
      const dt = last.time - first.time;

      if (dt > 0) {
        velocity = (last.angle - first.angle) / dt * 16;
      }
    }

    runInertia(velocity);
  }

  /* =========================
     القصور الذاتي
  ========================= */

  function runInertia(velocity) {

    function step() {
      velocity *= FRICTION;
      applyRotation(rotation + velocity);

      if (Math.abs(velocity) > VELOCITY_STOP_THRESHOLD) {
        inertiaFrame = requestAnimationFrame(step);
      } else {
        snapToNearest();
      }
    }

    inertiaFrame = requestAnimationFrame(step);
  }

  /* =========================
     الاستقرار على أقرب سنة
  ========================= */

  function snapToNearest() {

    const index = getSelectedIndexFromRotation(rotation);
    const rawTarget = -index * STEP;

    let target = rawTarget;
    while (target - rotation > 180) target -= 360;
    while (target - rotation < -180) target += 360;

    const startRot = rotation;
    const startTime = performance.now();

    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate() {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / SNAP_DURATION, 1);

      applyRotation(startRot + (target - startRot) * ease(t));

      if (t < 1) {
        snapFrame = requestAnimationFrame(animate);
      } else {
        finishSettle(index);
      }
    }

    snapFrame = requestAnimationFrame(animate);
  }

  function finishSettle(index) {
    isSettled = true;
    selectedIndex = index;

    const year = GATE_YEARS[index];

    selectedYearLabel.textContent = year;

    setTimeout(() => {
      gateCore.classList.add("ready");
      gateHint.textContent = "اضغطي لفتح البوابة";
    }, 400);
  }

  /* =========================
     فتح البوابة
  ========================= */

  gateCore.addEventListener("click", () => {
    if (!isSettled || selectedIndex === null) return;
    if (!gateCore.classList.contains("ready")) return;

    openYearGallery(GATE_YEARS[selectedIndex]);
  });

  /* =========================
     أحداث اللمس/الفأرة
  ========================= */

  wheelWrap.addEventListener("pointerdown", onPointerDown);
  wheelWrap.addEventListener("pointermove", onPointerMove);
  wheelWrap.addEventListener("pointerup", onPointerUp);
  wheelWrap.addEventListener("pointercancel", onPointerUp);

  /* =========================
     فتح/إغلاق شاشة البوابة
  ========================= */

  gateButton.addEventListener("click", () => {
    gateScreen.classList.remove("hidden");
  });

  if (closeGateButton) {
    closeGateButton.addEventListener("click", () => {
      gateScreen.classList.add("hidden");
    });
  }

  /* =========================
     معرض الصور
  ========================= */

  function openYearGallery(year) {

    galleryYearLabel.textContent = year;
    galleryGrid.innerHTML = "";

    for (let i = 1; i <= IMAGES_PER_YEAR; i++) {
      const img = document.createElement("img");
      img.src = `${year}-${i}.jpg`;
      img.alt = `${year} / ${i}`;
      img.loading = "lazy";

      img.onerror = () => {
        img.remove();
      };

      galleryGrid.appendChild(img);
    }

    gateScreen.classList.add("hidden");
    gallery.classList.remove("hidden");
  }

  if (closeGalleryButton) {
    closeGalleryButton.addEventListener("click", () => {
      gallery.classList.add("hidden");
      gateScreen.classList.remove("hidden");

      gateCore.classList.remove("ready");
      isSettled = true;
    });
  }
}
