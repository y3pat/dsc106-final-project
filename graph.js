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

  // We'll store them globally so scrollama-settings.js can call our update function.
  window.allEdaData = edaData;
  window.allHrData = hrData;

  // Create two SVGs for EDA and HR inside the graph-container.
  const container = d3.select("#graph-container");

  const edaSvg = container.append("svg")
    .attr("id", "eda-chart")
    .attr("width", 600)
    .attr("height", 250);

  const hrSvg = container.append("svg")
    .attr("id", "hr-chart")
    .attr("width", 600)
    .attr("height", 250);

  // Initial draw (for "baseline" or whichever test you want).
  updateGraphsForTest("baseline");
});

// Expose a function to update the charts for a given test.
window.updateGraphsForTest = function(testName) {
  const edaData = window.allEdaData.filter(d => d.test.toLowerCase() === testName.toLowerCase());
  const hrData = window.allHrData.filter(d => d.test.toLowerCase() === testName.toLowerCase());

  drawLineChart("#eda-chart", edaData, "eda", "steelblue");
  drawLineChart("#hr-chart", hrData, "hr", "red");
};

// A helper function that draws a line chart in a given SVG for the specified valueKey.
function drawLineChart(svgSelector, data, valueKey, strokeColor) {
  const svg = d3.select(svgSelector);
  svg.selectAll("*").remove(); // Clear previous chart

  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create group inside the SVG for the chart.
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  if (!data.length) {
    // If no data for this test, just display a message.
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight / 2)
      .attr("text-anchor", "middle")
      .text("No data for this test.");
    return;
  }

  // X scale based on time
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.time))
    .range([0, innerWidth]);

  // Y scale based on valueKey (eda or hr)
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

  // Append the line path
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", strokeColor)
    .attr("stroke-width", 2)
    .attr("d", line);
}
