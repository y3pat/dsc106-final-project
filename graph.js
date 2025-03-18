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

  // Store data globally
  window.allEdaData = edaData;
  window.allHrData = hrData;
  window.currentComparison = "";

  document.getElementById("compare-select").addEventListener("change", function () {
    window.currentComparison = this.value;
    updateGraphsForTest(window.currentTest, window.currentComparison);
  });

  updateGraphsForTest("baseline");
});

// Function to update graphs dynamically based on scrolling + dropdown
window.updateGraphsForTest = function(testName, comparisonTest = "") {
  window.currentTest = testName;

  // ✅ Reset dropdown when scrolling to a new step
  if (window.currentComparison !== comparisonTest) {
      document.getElementById("compare-select").value = ""; // Set dropdown to "None"
      window.currentComparison = "";
  }

  updateDropdownOptions(testName); // Update dropdown options
  updateLegend(testName, comparisonTest); // Update legend placement

  const primaryEdaData = window.allEdaData.filter(d => d.test === testName);
  const primaryHrData = window.allHrData.filter(d => d.test === testName);

  const comparisonEdaData = comparisonTest ? window.allEdaData.filter(d => d.test === comparisonTest) : null;
  const comparisonHrData = comparisonTest ? window.allHrData.filter(d => d.test === comparisonTest) : null;

  drawComparisonChart("#eda-chart", primaryEdaData, comparisonEdaData, "Electrodermal Activity (EDA)", "eda", "red", comparisonTest);
  drawComparisonChart("#hr-chart", primaryHrData, comparisonHrData, "Heart Rate (HR)", "hr", "steelblue", comparisonTest);
};

// Function to update the dropdown menu to exclude the selected step
function updateDropdownOptions(selectedTest) {
  const dropdown = document.getElementById("compare-select");
  const testNames = [
      "baseline", "stroop", "first_rest", "tmct", "second_rest",
      "real_opinion", "opposite_opinion", "subtract_test", "post_experiment"
  ];

  dropdown.innerHTML = '<option value="">None</option>'; // Reset dropdown

  testNames.forEach(test => {
      if (test !== selectedTest) {
          const option = document.createElement("option");
          option.value = test;
          option.textContent = formatTestName(test);
          dropdown.appendChild(option);
      }
  });

  // ✅ Ensure the dropdown retains the selected value
  dropdown.value = window.currentComparison || "";
}

// Function to update the legend and place it on the right side
function updateLegend(selectedTest, comparisonTest) {
  const legendContainer = document.getElementById("graph-legend");
  legendContainer.innerHTML = ""; // Clear previous legend

  legendContainer.style.fontSize = "14px";
  legendContainer.style.display = "flex";
  legendContainer.style.flexDirection = "column";
  legendContainer.style.alignItems = "flex-start";
  legendContainer.style.position = "absolute";  
  legendContainer.style.right = "40px"// Moves it further right
  legendContainer.style.top = "15";  // ✅ Moves it further up
  legendContainer.style.background = "rgba(255, 255, 255, 0.85)"; // ✅ Ensure readability
  legendContainer.style.padding = "10px 15px";  
  legendContainer.style.borderRadius = "5px";  
  legendContainer.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.2)";  

  // Selected test legend (EDA & HR)
  const selectedEdaLegend = document.createElement("div");
  selectedEdaLegend.innerHTML = `<span style="display: inline-block; width: 12px; height: 12px; 
                                 background-color: red; margin-right: 5px;"></span> 
                                 EDA - ${formatTestName(selectedTest)}`;
  legendContainer.appendChild(selectedEdaLegend);

  const selectedHrLegend = document.createElement("div");
  selectedHrLegend.innerHTML = `<span style="display: inline-block; width: 12px; height: 12px; 
                                background-color: steelblue; margin-right: 5px;"></span> 
                                HR - ${formatTestName(selectedTest)}`;
  legendContainer.appendChild(selectedHrLegend);

  // Comparison test legend (only one entry for both EDA & HR)
  if (comparisonTest) {
      const comparisonLegend = document.createElement("div");
      comparisonLegend.innerHTML = `<span style="display: inline-block; width: 12px; height: 12px; 
                                    background-color: orange; margin-right: 5px;"></span> 
                                    ${formatTestName(comparisonTest)}`;
      legendContainer.appendChild(comparisonLegend);
  }
}




// Function to format test names for dropdown
function formatTestName(testName) {
  return testName.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
// Function to normalize time (only when comparing)
function normalizeTime(data) {
  if (!data || data.length === 0) return [];

  const minTime = d3.min(data, d => d.time);
  const maxTime = d3.max(data, d => d.time);

  return data.map(d => ({
      time: (d.time - minTime) / (maxTime - minTime) * 100, // Scale time between 0-100
      eda: d.eda,
      hr: d.hr
  }));
}
// Function to draw graphs with a properly placed legend
function drawComparisonChart(svgSelector, primaryData, comparisonData, title, key, color, comparisonTest) {
  const svg = d3.select(svgSelector);
  svg.selectAll("*").remove(); // Clear previous graph

  // **🔹 Increase Graph Size**
  const width = 800, height = 400;  
  svg.attr("width", width).attr("height", height);

  const margin = { top: 100, right: 60, bottom: 100, left: 100 }; 
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  if (!primaryData.length) {
      g.append("text")
          .attr("x", innerWidth / 2)
          .attr("y", innerHeight / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .text("No data for this test.");
      return;
  }

  let xScale, yScale;
  let xAxisLabel = "Time (Seconds)";

  if (comparisonTest) {
      primaryData = normalizeTime(primaryData);
      comparisonData = normalizeTime(comparisonData);
      xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);
      xAxisLabel = "Normalized Time";
  } else {
      xScale = d3.scaleLinear().domain(d3.extent(primaryData, d => d.time)).range([0, innerWidth]);
  }

  // **🔹 Expand Y-axis Range to Fix Label Crunching**
  const combinedData = [...primaryData, ...(comparisonData || [])];
  const yMin = d3.min(combinedData, d => d[key]) * 0.80; // Expand 20% downward
  const yMax = d3.max(combinedData, d => d[key]) * 1.20; // Expand 20% upward

  yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .nice()
      .range([innerHeight, 0]);

  // **📉 Add X and Y Axes**
  g.append("g").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(xScale));
  
  g.append("g").call(d3.axisLeft(yScale).ticks(8));

  // **📌 Ensure Graph Title is Always Visible**
  svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30) // ⬅ Moves title above graph
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text(title);

  // **📝 Re-add Axis Labels**
  g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(xAxisLabel);

  g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -70)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .text(key === "eda" ? "Microsiemens (μS)" : "Beats per Minute (BPM)");

  // **📈 Draw Data Lines with Animation**
  const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d[key]))
      .curve(d3.curveMonotoneX);

  const path = g.append("path")
      .datum(primaryData)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

  // **🎬 Animate Line Drawing**
  const totalLength = path.node().getTotalLength();
  path.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

  // **🔸 Draw Comparison Line If Selected**
  if (comparisonData && comparisonData.length > 0) {
      const comparisonPath = g.append("path")
          .datum(comparisonData)
          .attr("fill", "none")
          .attr("stroke", "orange")
          .attr("stroke-width", 2).attr("stroke-dasharray", "4 4")
          .attr("d", line);

      const compTotalLength = comparisonPath.node().getTotalLength();
      comparisonPath.attr("stroke-dasharray", compTotalLength + " " + compTotalLength)
          .attr("stroke-dashoffset", compTotalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
  }
}


// **🔍 Find the closest data point to hovered time**
function findClosestDataPoint(data, targetTime) {
  return data.reduce((a, b) => Math.abs(a.time - targetTime) < Math.abs(b.time - targetTime) ? a : b);
}

