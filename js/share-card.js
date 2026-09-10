/* =========================================================
   ATHAR — TRACE SHARE CARD
   يولّد صورة مصممة من "الأثر" لمشاركتها
========================================================= */

export async function createTraceShareCard(trace) {
  const WIDTH = 1080;
  const HEIGHT = 1350;

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const ctx = canvas.getContext("2d");


   
  /* الخلفية */
  ctx.fillStyle = "#030405";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const gradient = ctx.createRadialGradient(
    WIDTH / 2, HEIGHT * 0.42, 50,
    WIDTH / 2, HEIGHT * 0.42, WIDTH * 0.75
  );
  gradient.addColorStop(0, "rgba(190,205,215,0.05)");
  gradient.addColorStop(1, "rgba(3,4,5,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  /* شبكة خفيفة */
  ctx.strokeStyle = "rgba(255,255,255,0.025)";
  ctx.lineWidth = 1;
  for (let x = 0; x < WIDTH; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y < HEIGHT; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }

  /* رأس البطاقة */
  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.fillStyle = "#c8d0d5";
  ctx.font = "300 22px monospace";
  ctx.fillText("ATHAR", 60, 90);

  ctx.fillStyle = "#737c83";
  ctx.font = "12px monospace";
  ctx.fillText("∕ UNRESOLVED", 185, 88);

  ctx.textAlign = "right";
  ctx.fillStyle = "#454d53";
  ctx.font = "11px monospace";
  ctx.fillText("NODE / 19", WIDTH - 60, 70);
  ctx.fillStyle = "#87968e";
  ctx.fillText("● TRACE / ACCEPTED", WIDTH - 60, 92);

  /* نص الأثر */
  const isRTL = /[\u0600-\u06FF]/.test(trace.message);
  ctx.direction = isRTL ? "rtl" : "ltr";
  ctx.textAlign = "center";

  const maxWidth = WIDTH - 160;
  const fontSize = trace.message.length > 200 ? 32 : 42;
  ctx.font = `300 ${fontSize}px "Segoe UI", Arial, sans-serif`;
  ctx.fillStyle = "#e7eaed";

  const lines = wrapText(ctx, trace.message, maxWidth);
  const maxLines = 10;
  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    visibleLines[maxLines - 1] =
      visibleLines[maxLines - 1].slice(0, -1) + "…";
  }

  const lineHeight = fontSize * 1.6;
  const totalHeight = visibleLines.length * lineHeight;
  const startY = HEIGHT / 2 - totalHeight / 2 + fontSize / 2;

  visibleLines.forEach((line, i) => {
    ctx.fillText(line, WIDTH / 2, startY + i * lineHeight);
  });

  /* خط فاصل متدرج */
  const dividerY = startY + visibleLines.length * lineHeight + 50;
  const dividerGrad = ctx.createLinearGradient(
    WIDTH / 2 - 150, 0, WIDTH / 2 + 150, 0
  );
  dividerGrad.addColorStop(0, "rgba(255,255,255,0)");
  dividerGrad.addColorStop(0.5, "rgba(255,255,255,0.35)");
  dividerGrad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = dividerGrad;
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2 - 150, dividerY);
  ctx.lineTo(WIDTH / 2 + 150, dividerY);
  ctx.stroke();

  /* رموز زخرفية */
  ctx.direction = "ltr";
  ctx.font = "26px serif";
  ctx.fillStyle = "rgba(137,148,155,0.5)";
  ctx.fillText("𓂀   א   影   ᚠ   Δ", WIDTH / 2, dividerY + 55);

  /* تذييل البطاقة */
  const date = trace.created_at ? new Date(trace.created_at) : new Date();
  const dateStr = date.toISOString().slice(0, 19).replace("T", " / ");

  ctx.textAlign = "left";
  ctx.font = "11px monospace";
  ctx.fillStyle = "#3c444a";
  ctx.fillText(dateStr, 60, HEIGHT - 70);

  ctx.textAlign = "right";
  ctx.fillStyle = "#59636a";
  ctx.font = "12px monospace";
  ctx.fillText("x.13 ↗", WIDTH - 60, HEIGHT - 70);

  ctx.textAlign = "center";
  ctx.fillStyle = "#454d53";
  ctx.font = "10px monospace";
  ctx.fillText(
    "ATHAR — TEMPORAL ARCHIVE — UNRESOLVED",
    WIDTH / 2,
    HEIGHT - 40
  );

  return canvas;
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach(word => {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  });

  if (current) lines.push(current);

  return lines;
}

export async function shareTraceCard(trace) {
  const canvas = await createTraceShareCard(trace);

   canvas.toBlob(async blob => {
  if (!blob) {
    console.error("فشل توليد الصورة");
    return;
  }

  const fileName = `athar-trace-${Date.now()}.png`;
  const file = new File([blob], fileName, { type: "image/png" });

  const canUseNativeShare =
    navigator.share &&
    (!navigator.canShare || navigator.canShare({ files: [file] }));

  if (canUseNativeShare) {
    try {
      await navigator.share({
        files: [file],
        title: "ATHAR",
        text: "أثر من المستقبل غير محلول."
      });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("navigator.share failed:", err);
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}, "image/png");
  canvas.toBlob(async blob => {
    const fileName = `athar-trace-${Date.now()}.png`;
    const file = new File([blob], fileName, { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "ATHAR",
          text: "أثر من المستقبل غير محلول."
        });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("share failed, falling back to download", err);
      }
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}
