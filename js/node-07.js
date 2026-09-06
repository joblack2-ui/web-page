const worldNode07 = document.getElementById("world-node-07");

if (!worldNode07) {
  console.error("NODE 07: button not found");
} else {

  worldNode07.addEventListener("click", () => {

    console.log("NODE 07 CLICKED");

    const node07 = document.getElementById("node-07-screen");

    if (node07) {
      node07.classList.remove("hidden");
    }

  });

}
