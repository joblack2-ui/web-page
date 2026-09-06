import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
console.log("WORLD MAP JS LOADED");
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

const mapContainer = document.getElementById("world-map");
const mapScreen = document.getElementById("world-map-screen");
const mapButton = document.getElementById("world-map-button");

if (!mapContainer || !mapScreen) {
  console.warn("WORLD MAP: container not found");
} else {

  const svg = d3
    .select(mapContainer)
    .append("svg")
    .attr("role", "img")
    .attr("aria-label", "World map");

  const mapLayer = svg.append("g");

  const graticuleLayer = mapLayer.append("g");
  const landLayer = mapLayer.append("g");

  let worldData = null;

  async function loadWorld() {

    try {

      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json"
      );

      if (!response.ok) {
        throw new Error(
          `WORLD MAP DATA ERROR: ${response.status}`
        );
      }

      worldData = await response.json();

      /*
        إذا كانت الخريطة ظاهرة نرسمها فوراً.
        إذا كانت مخفية ننتظر فتحها.
      */
      drawMap();

    } catch (error) {

      console.error(
        "WORLD MAP FAILED:",
        error
      );

    }
  }

  function drawMap() {

    if (!worldData) return;

    const width = mapContainer.clientWidth;
    const height = mapContainer.clientHeight;

    /*
      الخريطة مخفية حالياً.
      لا نحاول الرسم قبل أن تصبح لها أبعاد.
    */
    if (!width || !height) {
      return;
    }

    svg
      .attr(
        "viewBox",
        `0 0 ${width} ${height}`
      )
      .attr(
        "preserveAspectRatio",
        "xMidYMid meet"
      );

    const land = feature(
      worldData,
      worldData.objects.land
    );

    /*
      Equal Earth
      للحفاظ على النسب المساحية
      بشكل أفضل من Mercator.
    */
    const projection = d3
      .geoEqualEarth()
      .fitExtent(
        [
          [20, 20],
          [width - 20, height - 20]
        ],
        land
      );

    const path = d3.geoPath(projection);

    /*
      شبكة خطوط العرض والطول
    */
    graticuleLayer
      .selectAll("*")
      .remove();

    graticuleLayer
      .append("path")
      .datum(
        d3.geoGraticule10()
      )
      .attr(
        "class",
        "map-graticule"
      )
      .attr(
        "d",
        path
      );

    /*
      اليابسة الحقيقية
    */
    landLayer
      .selectAll("*")
      .remove();

    landLayer
      .append("path")
      .datum(land)
      .attr(
        "class",
        "map-land"
      )
      .attr(
        "d",
        path
      );
  }

  /*
    عند الضغط على WORLD:
    ننتظر ظهور الشاشة ثم نرسم الخريطة.
  */
  if (mapButton) {

    mapButton.addEventListener(
      "click",
      () => {

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            drawMap();
          });
        });

      }
    );

  }

  /*
    إذا تغيرت حالة الشاشة لأي سبب،
    نعيد الرسم عندما تصبح ظاهرة.
  */
  const observer =
    new MutationObserver(() => {

      if (
        !mapScreen.classList.contains("hidden")
      ) {

        requestAnimationFrame(() => {
          drawMap();
        });

      }

    });

  observer.observe(
    mapScreen,
    {
      attributes: true,
      attributeFilter: ["class"]
    }
  );

  /*
    إعادة الرسم عند تغيير حجم الشاشة.
  */
  window.addEventListener(
    "resize",
    () => {
      if (
        !mapScreen.classList.contains("hidden")
      ) {
        drawMap();
      }
    }
  );

  loadWorld();
}
