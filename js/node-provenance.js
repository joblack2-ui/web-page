/* =========================================================
   ATHAR — NODE PROVENANCE LAYER
   Creative freedom without presenting invention as fact.
========================================================= */

const NODE_PROVENANCE = {
  internal: {
    label: "INTERNAL",
    detail: "ATHAR SYSTEM DATA"
  },
  speculative: {
    label: "SPECULATIVE",
    detail: "GENERATED / PROJECTED"
  },
  unverified: {
    label: "UNVERIFIED",
    detail: "SOURCE NOT ATTACHED"
  }
};

function classifyNodeType(type) {
  const normalized = String(type || "").toLowerCase();

  if (normalized === "unknown") {
    return NODE_PROVENANCE.internal;
  }

  if (
    normalized === "possible" ||
    normalized === "projected" ||
    normalized === "future"
  ) {
    return NODE_PROVENANCE.speculative;
  }

  return NODE_PROVENANCE.unverified;
}

function decorateNode(nodeFrame) {
  if (!nodeFrame || nodeFrame.querySelector(".node-provenance")) {
    return;
  }

  const meta = nodeFrame.querySelector(".node-meta");
  if (!meta) return;

  const type = meta.querySelector("span")?.textContent?.trim() || "unknown";
  const provenance = classifyNodeType(type);

  const badge = document.createElement("div");
  badge.className = "node-provenance";
  badge.dataset.provenance = provenance.label.toLowerCase();

  const label = document.createElement("span");
  label.textContent = provenance.label;

  const detail = document.createElement("small");
  detail.textContent = provenance.detail;

  badge.append(label, detail);

  const title = nodeFrame.querySelector(".node-title");
  if (title) {
    title.insertAdjacentElement("beforebegin", badge);
  } else {
    nodeFrame.prepend(badge);
  }
}

function scanNodeViewer() {
  document
    .querySelectorAll(".node-frame")
    .forEach(decorateNode);
}

const provenanceObserver = new MutationObserver(scanNodeViewer);

function initNodeProvenance() {
  const viewer = document.getElementById("node-viewer");
  if (!viewer) return;

  provenanceObserver.observe(viewer, {
    childList: true,
    subtree: true
  });

  scanNodeViewer();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initNodeProvenance);
} else {
  initNodeProvenance();
}
