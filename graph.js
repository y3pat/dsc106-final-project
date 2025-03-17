document.addEventListener("DOMContentLoaded", async () => {
  let edaData, hrData;
  try {
    const edaRes = await fetch("./proposal/data/eda_scrolling_data.json");
    edaData = await edaRes.json();
    const hrRes = await fetch("./proposal/data/hr_scrolling_data.json");
    hrData = await hrRes.json();
  } catch (err) {
    console.error("Error loading JSON data:", err);
    return;
  }

  // Store them globally so scrollama-settings.js can call our update function.
  window.allEdaData = edaData;
  window.allHrData = hrData;

 // Create two titles and SVGs for EDA and HR inside the graph-container
const container = d3.select("#graph-container");

// Append titles
container.append("h3")
  .text("Electrodermal Activity (EDA)")
  .style("text-align", "center")
  .style("margin-bottom", "5px")
  .style("font-family", "Roboto, sans-serif");

const edaSvg = container.append("svg")
  .attr("id", "eda-chart")
  .attr("width", 600)
  .attr("height", 250);

container.append("h3")
  .text("Heart Rate (HR)")
  .style("text-align", "center")
  .style("margin-top", "15px")
  .style("margin-bottom", "5px")
  .style("font-family", "Roboto, sans-serif");

const hrSvg = container.append("svg")
  .attr("id", "hr-chart")
  .attr("width", 600)
  .attr("height", 250);

  // Tooltip setup
  const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background", "#fff")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("border", "1px solid #ccc");

  // Initial draw
  updateGraphsForTest("baseline");
});

// Function to update the graphs dynamically
window.updateGraphsForTest = function(testName) {
  const edaData = window.allEdaData.filter(d => d.test.toLowerCase() === testName.toLowerCase());
  const hrData = window.allHrData.filter(d => d.test.toLowerCase() === testName.toLowerCase());

  drawLineChart("#eda-chart", edaData, "eda", "steelblue");
  drawLineChart("#hr-chart", hrData, "hr", "red");
};

// Function to create an interactive line chart
function drawLineChart(svgSelector, data, valueKey, strokeColor) {
  const svg = d3.select(svgSelector);
  svg.selectAll("*").remove(); // Clear previous graph

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create group for the chart
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  if (!data.length) {
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("No data for this test.");
    return;
  }

  // X scale (time)
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.time))
    .range([0, innerWidth]);

  // Y scale (valueKey: eda or hr)
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d[valueKey]))
    .nice()
    .range([innerHeight, 0]);

  // Append axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(xAxis);

  g.append("g")
    .call(yAxis);

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.time))
    .y(d => yScale(d[valueKey]))
    .curve(d3.curveMonotoneX);

  // Append the line path with a smooth transition
  const path = g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", strokeColor)
    .attr("stroke-width", 2)
    .attr("d", line);

  // Animate line drawing
  const totalLength = path.node().getTotalLength();
  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  // Add brushing
  const brush = d3.brushX()
    .extent([[0, 0], [innerWidth, innerHeight]])
    .on("end", ({ selection }) => {
      if (!selection) return;
      const [x0, x1] = selection.map(xScale.invert);
      xScale.domain([x0, x1]);
      g.select(".x-axis").transition().duration(750).call(xAxis);
      g.select(".y-axis").transition().duration(750).call(yAxis);
      path.transition().duration(750).attr("d", line);
    });

  g.append("g").attr("class", "brush").call(brush);

  // Tooltip interactions
  const focusCircle = g.append("circle")
    .attr("r", 5)
    .style("fill", strokeColor)
    .style("opacity", 0);

  svg.on("mousemove", function (event) {
    const [mouseX] = d3.pointer(event);
    const closestPoint = data.reduce((a, b) =>
      Math.abs(a.time - xScale.invert(mouseX)) < Math.abs(b.time - xScale.invert(mouseX)) ? a : b);

    tooltip.style("opacity", 1)
      .html(`Time: ${closestPoint.time}s<br>${valueKey.toUpperCase()}: ${closestPoint[valueKey]}`)
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY - 10}px`);

    focusCircle
      .attr("cx", xScale(closestPoint.time))
      .attr("cy", yScale(closestPoint[valueKey]))
      .style("opacity", 1);
  }).on("mouseleave", () => {
    tooltip.style("opacity", 0);
    focusCircle.style("opacity", 0);
  });
}
