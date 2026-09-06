import { supabase } from "./supabase.js";

const app = document.getElementById("app");
const trigger = document.getElementById("world-node-007");

const EDITOR_IDS = new Set([
  "3e0bb005-e13a-4065-bb40-84c33276651d",
  "677e88a4-17a4-48c6-ae8e-ad457da4a043"
]);


if (!app) {
  console.error("007: #app not found.");
} else if (!trigger) {
  console.error("007: #world-node-007 not found.");
} else {

  const screen = document.createElement("section");

  screen.id = "node-007-screen";
  screen.className = "node-007-screen hidden";

  screen.innerHTML = `
    <div class="node-007-header">
      <span class="node-007-code">007</span>

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

      <div
        id="node-007-content"
        class="node-007-content"
      >
        <div class="node-007-loading">
          LOADING...
        </div>
      </div>

    </div>
  `;

  app.appendChild(screen);

  const contentBox =
    screen.querySelector("#node-007-content");

  const closeButton =
    screen.querySelector("#close-node-007");


  /* =========================
     فتح 007
  ========================= */

  trigger.addEventListener("click", async (event) => {

    event.preventDefault();
    event.stopPropagation();

    screen.classList.remove("hidden");

    await load007();

  });


  /* =========================
     إغلاق 007
  ========================= */

  closeButton.addEventListener("click", (event) => {

    event.preventDefault();
    event.stopPropagation();

    screen.classList.add("hidden");

  });


  /* =========================
     تحميل محتوى 007
  ========================= */

  async function load007() {

    contentBox.innerHTML = `
      <div class="node-007-loading">
        LOADING...
      </div>
    `;

    try {

      const {
        data: sessionData,
        error: sessionError
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      const user =
        sessionData?.session?.user || null;

      const isEditor =
        !!user &&
        EDITOR_IDS.has(user.id);


      const {
        data,
        error
      } = await supabase
        .from("node_007_content")
        .select("content, updated_at")
        .eq("id", 1)
        .maybeSingle();


      if (error) {
        throw error;
      }


      const content =
        data?.content || "";


      renderContent(
        content,
        isEditor
      );


    } catch (error) {

      console.error(
        "007 load error:",
        error
      );

      contentBox.innerHTML = `
        <div class="node-007-error">
          UNABLE TO LOAD 007
        </div>
      `;

    }

  }


  /* =========================
     عرض المحتوى
  ========================= */

  function renderContent(content, isEditor) {

    if (isEditor) {

      contentBox.innerHTML = `
        <div class="node-007-editor">

          <textarea
            id="node-007-textarea"
            class="node-007-textarea"
            placeholder="WRITE 007..."
            spellcheck="false"
          ></textarea>

          <div class="node-007-editor-footer">

            <span
              id="node-007-status"
              class="node-007-status"
            ></span>

            <button
              id="node-007-save"
              class="node-007-save"
              type="button"
            >
              SAVE
            </button>

          </div>

        </div>
      `;

      const textarea =
        contentBox.querySelector(
          "#node-007-textarea"
        );

      textarea.value = content;


      const saveButton =
        contentBox.querySelector(
          "#node-007-save"
        );

      const status =
        contentBox.querySelector(
          "#node-007-status"
        );


      saveButton.addEventListener(
        "click",
        async () => {

          saveButton.disabled = true;

          status.textContent =
            "SAVING...";

          try {

            const {
              error
            } = await supabase
              .from("node_007_content")
              .update({
                content: textarea.value
              })
              .eq("id", 1);


            if (error) {
              throw error;
            }


            status.textContent =
              "SAVED";

            setTimeout(() => {

              status.textContent = "";

            }, 2000);


          } catch (error) {

            console.error(
              "007 save error:",
              error
            );

            status.textContent =
              "SAVE FAILED";

          } finally {

            saveButton.disabled = false;

          }

        }
      );


    } else {

      contentBox.innerHTML = `
        <div class="node-007-readonly">
          ${
            content
              ? escapeHtml(content)
              : "—"
          }
        </div>
      `;

    }

  }


  /* =========================
     حماية عرض النص
  ========================= */

  function escapeHtml(text) {

    const div =
      document.createElement("div");

    div.textContent = text;

    return div.innerHTML
      .replace(/\n/g, "<br>");

  }


  /* =========================
     المراجع 01 — 06
  ========================= */

  const references =
    screen.querySelectorAll(
      "[data-reference]"
    );

  references.forEach(reference => {

    reference.addEventListener(
      "click",
      () => {

        const id =
          reference.dataset.reference;

        if (id === "07") {
          return;
        }

        // 01 — 06 لاحقاً
        // ستكون مسارات مستقلة.

      }
    );

  });

}
