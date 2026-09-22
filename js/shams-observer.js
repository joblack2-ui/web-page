/*
 * SHAMS — OBSERVER
 * Ambient interface layer only.
 * Does not access Shams chat, auth, Supabase, or protected security flows.
 */

const mark = document.querySelector(".shams-observer-mark");
const nodeViewer = document.getElementById("node-viewer");

if (mark && nodeViewer) {
  const label = mark.querySelector("span");
  const detail = mark.querySelector("small");

  const readNode = () => {
    const title = nodeViewer.querySelector(".node-title")?.textContent?.trim();
    const id = nodeViewer.querySelector(".node-meta span:last-child")?.textContent?.trim();

    if (!title && !id) return;

    if (label) label.textContent = "SHAMS / OBSERVER";
    if (detail) detail.textContent = id ? "TRACE: " + id : "TRACE: " + title;

    const whisper = document.getElementById("shams-whisper");
    const whisperText = whisper?.querySelector("span");

    if (whisper && whisperText) {
      whisperText.textContent = "I SEE THE TRACE.";
      whisper.classList.remove("shams-whisper-show");
      void whisper.offsetWidth;
      whisper.classList.add("shams-whisper-show");

      window.setTimeout(() => {
        whisper.classList.remove("shams-whisper-show");
      }, 2200);
    }

    mark.classList.remove("shams-observer-active");
    void mark.offsetWidth;
    mark.classList.add("shams-observer-active");
  };

  const observer = new MutationObserver(readNode);
  observer.observe(nodeViewer, { childList: true, subtree: true });
  readNode();
}
