const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let values;

const svg = d3.select("#root");
const tooltip = d3.select("#tooltip");

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function drawMap() {
  const hierarchy = d3
    .hierarchy(values, (node) => node.children)
    .sum((node) => node.value)
    .sort((a, b) => b.value - a.value);

  const createTreeMap = d3.treemap().size([1000, 600]).padding(1);
  createTreeMap(hierarchy);

  const movies = hierarchy.leaves();
  console.log(movies);
  const tile = svg
    .selectAll("g")
    .data(movies)
    .enter()
    .append("g")
    .attr("class", "g-tile")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`)
    .on("mouseover", (d) => {
      const value = d.data.value;
      tooltip
        .attr("data-value", (d) => value)
        .style("left", d3.event.pageX + 25 + "px")
        .style("top", d3.event.pageY - 25 + "px")
        .style("visibility", "visible")
        .text(
          `${d.data.name} | ${d.data.category} | Revenue: ${formatter.format(
            d.data.value
          )}`
        );
    })
    .on("mouseout", (d) => tooltip.style("visibility", "hidden"));

  tile
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => {
      const category = d.data.category;
      if (category === "Action") return "#6388b6";
      if (category === "Adventure") return "#ffae11";
      if (category === "Animation") return "#f06e67";
      if (category === "Biography") return "#8bc2cb";
      if (category === "Comedy") return "#53ad87";
      if (category === "Drama") return "#c3bc29";
      if (category === "Family") return "#bc7594";
    })
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0);

  tile
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 3)
    .attr("y", function (d, i) {
      return 13 + i * 13;
    })
    .style("font-size", "13px")
    .text((d) => d);
}

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    values = data;
    console.log(values);
    drawMap();
  })
  .catch((error) => console.log(error));