const app = document.getElementById("app");
const worldNode07 = document.getElementById("world-node-07");

if (!app || !worldNode07) {
  console.warn("NODE 07: required elements not found.");
} else {

  const node07 = document.createElement("section");

  node07.id = "node-07-screen";
  node07.className = "node-07-screen hidden";

  node07.innerHTML = `
    <div class="node-07-header">

      <span>07</span>

      <button
        id="close-node-07"
        type="button"
      >
        RETURN
      </button>

    </div>

    <div class="node-07-content">

      <div class="node-07-title">
        ENTRY POINT
      </div>

      <div class="node-07-references">
        7 REFERENCES FOUND
      </div>

      <div class="node-07-list">

        <div>01 / —</div>
        <div>02 / —</div>
        <div>03 / —</div>
        <div>04 / —</div>
        <div>05 / —</div>
        <div>06 / —</div>
        <div>07 / ACTIVE</div>

      </div>

    </div>
  `;

  app.appendChild(node07);

  const closeNode07 =
    document.getElementById("close-node-07");

  worldNode07.addEventListener("click", () => {
    node07.classList.remove("hidden");
  });

  closeNode07.addEventListener("click", () => {
    node07.classList.add("hidden");
  });

}
