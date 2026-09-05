import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { feature } from "https://cdn.jsdelivr.net/npm/topojson-client@3/+esm";

const mapContainer = document.getElementById("world-map");
const mapScreen = document.getElementById("world-map-screen");

if (!mapContainer || !mapScreen) {
  console.warn("WORLD MAP: container not found");
} else {
  const svg = d3
    .select(mapContainer)
    .append("svg")
    .attr("aria-label", "World map")
    .attr("role", "img");

  const mapLayer = svg.append("g");

  const graticuleLayer = mapLayer.append("g");
  const landLayer = mapLayer.append("g");

  function drawMap() {
    const width = mapContainer.clientWidth;
    const height = mapContainer.clientHeight;

    if (!width || !height) return;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    /*
      Equal Earth projection.

      Unlike Mercator, this preserves relative
      area much more faithfully.
    */
    const projection = d3
      .geoEqualEarth()
      .fitSize(
        [width - 30, height - 30],
        {
          type: "Sphere"
        }
      );

    /*
      Move the map slightly toward the centre.
    */
    projection.translate([
      width / 2,
      height / 2
    ]);

    const path = d3.geoPath(projection);

    /*
      Latitude / longitude grid.
    */
    const graticule = d3.geoGraticule10();

    graticuleLayer
      .selectAll("*")
      .remove();

    graticuleLayer
      .append("path")
      .datum(graticule)
      .attr("class", "map-graticule")
      .attr("d", path);

    /*
      Load real Natural Earth geometry.
    */
    fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json"
    )
      .then(response => {
        if (!response.ok) {
          throw new Error(
            `WORLD MAP DATA ERROR: ${response.status}`
          );
        }

        return response.json();
      })
      .then(world => {
        const land = feature(
          world,
          world.objects.land
        );

        landLayer
          .selectAll("*")
          .remove();

        landLayer
          .append("path")
          .datum(land)
          .attr("class", "map-land")
          .attr("d", path);
      })
      .catch(error => {
        console.error(
          "WORLD MAP FAILED:",
          error
        );
      });
  }

  drawMap();

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      drawMap();
    }, 120);
  });
}
