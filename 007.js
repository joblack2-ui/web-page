/* =====================================================
   007 — ENTRY POINT
   Independent Node
===================================================== */

const app = document.getElementById("app");
const trigger = document.getElementById("world-node-007");

if (!app) {
  console.error("007: #app not found.");
} else if (!trigger) {
  console.error("007: #world-node-007 not found.");
} else {

  /* =========================
     CREATE 007 SCREEN
  ========================= */

  const screen = document.createElement("section");

  screen.id = "node-007-screen";
  screen.className = "node-007-screen hidden";

  screen.innerHTML = `

    <div class="node-007-header">

      <span class="node-007-code">
        007
      </span>

      <button
        id="close-node-007"
        class="node-007-return"
        type="button"
      >
        RETURN
      </button>

    </div>


    <div class="node-007-body">

      <div class="node-007-entry">
        ENTRY POINT
      </div>

      <div class="node-007-found">
        7 REFERENCES FOUND
      </div>


      <div class="node-007-references">

        <button type="button" data-reference="01">
          <span>01</span>
          <i>/</i>
          <strong>—</strong>
        </button>

        <button type="button" data-reference="02">
          <span>02</span>
          <i>/</i>
          <strong>—</strong>
        </button>

        <button type="button" data-reference="03">
          <span>03</span>
          <i>/</i>
          <strong>—</strong>
        </button>

        <button type="button" data-reference="04">
          <span>04</span>
          <i>/</i>
          <strong>—</strong>
        </button>

        <button type="button" data-reference="05">
          <span>05</span>
          <i>/</i>
          <strong>—</strong>
        </button>

        <button type="button" data-reference="06">
          <span>06</span>
          <i>/</i>
          <strong>—</strong>
        </button>

        <button
          type="button"
          class="active"
          data-reference="07"
        >
          <span>07</span>
          <i>/</i>
          <strong>ACTIVE</strong>
        </button>

      </div>

    </div>

  `;


  /* =========================
     INSERT INTO APP
  ========================= */

  app.appendChild(screen);


  /* =========================
     OPEN 007
  ========================= */

  trigger.addEventListener("click", function(event) {

    event.preventDefault();
    event.stopPropagation();

    screen.classList.remove("hidden");

  });


  /* =========================
     CLOSE 007
  ========================= */

  const closeButton =
    screen.querySelector("#close-node-007");

  if (closeButton) {

    closeButton.addEventListener("click", function(event) {

      event.preventDefault();
      event.stopPropagation();

      screen.classList.add("hidden");

    });

  }


  /* =========================
     REFERENCES
  ========================= */

  const references =
    screen.querySelectorAll("[data-reference]");

  references.forEach(reference => {

    reference.addEventListener("click", function() {

      const id =
        reference.dataset.reference;

      /*
       * حالياً لا نكشف شيئاً.
       * 007 هي العقدة الوحيدة الفعالة.
       */

      if (id === "07") {

        return;
      }

    });

  });

}
