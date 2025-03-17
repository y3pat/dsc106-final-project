// document.addEventListener("DOMContentLoaded", async function() {
//   // Load JSON data from ./proposal/data folder.
//   let edaData, hrData;
//   try {
//     const edaResponse = await fetch("./proposal/data/eda_scrolling_data.json");
//     edaData = await edaResponse.json();
//     const hrResponse = await fetch("./proposal/data/hr_scrolling_data.json");
//     hrData = await hrResponse.json();
//   } catch (error) {
//     console.error("Error loading JSON data:", error);
//     return;
//   }
  
//   // Assume data is sorted by time; set overall duration.
//   window.totalDuration = d3.max(edaData, d => d.time);
  
//   // Define chart dimensions and margins.
//   const svgWidth = 800, svgHeight = 300;
//   const margin = { top: 20, right: 20, bottom: 30, left: 50 };
//   const innerWidth = svgWidth - margin.left - margin.right;
//   const innerHeight = svgHeight - margin.top - margin.bottom;
  
//   // Create SVGs and groups.
//   const edaSvg = d3.select("#eda-graph")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);
//   const hrSvg = d3.select("#hr-graph")
//     .attr("width", svgWidth)
//     .attr("height", svgHeight);
    
//   const edaG = edaSvg.append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);
//   const hrG = hrSvg.append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);
  
//   // Create x scales (covering the full time range).
//   let edaXScale = d3.scaleLinear()
//     .domain([0, window.totalDuration])
//     .range([0, innerWidth]);
//   let hrXScale = d3.scaleLinear()
//     .domain([0, window.totalDuration])
//     .range([0, innerWidth]);
  
//   // Create y scales based on the full data.
//   const edaYScale = d3.scaleLinear()
//     .domain([d3.min(edaData, d => d.eda), d3.max(edaData, d => d.eda)])
//     .nice()
//     .range([innerHeight, 0]);
    
//   const hrYScale = d3.scaleLinear()
//     .domain([d3.min(hrData, d => d.hr), d3.max(hrData, d => d.hr)])
//     .nice()
//     .range([innerHeight, 0]);
  
//   // Append axes.
//   edaG.append("g")
//     .attr("transform", `translate(0, ${innerHeight})`)
//     .call(d3.axisBottom(edaXScale));
//   edaG.append("g")
//     .call(d3.axisLeft(edaYScale));
  
//   hrG.append("g")
//     .attr("transform", `translate(0, ${innerHeight})`)
//     .call(d3.axisBottom(hrXScale));
//   hrG.append("g")
//     .call(d3.axisLeft(hrYScale));
  
//   // Create line generators.
//   let edaLine = d3.line()
//     .x(d => edaXScale(d.time))
//     .y(d => edaYScale(d.eda))
//     .curve(d3.curveMonotoneX);
    
//   let hrLine = d3.line()
//     .x(d => hrXScale(d.time))
//     .y(d => hrYScale(d.hr))
//     .curve(d3.curveMonotoneX);
  
//   // Draw full graphs.
//   edaG.append("path")
//     .datum(edaData)
//     .attr("fill", "none")
//     .attr("stroke", "steelblue")
//     .attr("stroke-width", 2)
//     .attr("d", edaLine);
    
//   hrG.append("path")
//     .datum(hrData)
//     .attr("fill", "none")
//     .attr("stroke", "red")
//     .attr("stroke-width", 2)
//     .attr("d", hrLine);
  
//   // Append vertical marker lines that will move with scroll.
//   const edaMarker = edaG.append("line")
//     .attr("class", "marker")
//     .attr("x1", edaXScale(0))
//     .attr("x2", edaXScale(0))
//     .attr("y1", 0)
//     .attr("y2", innerHeight);
  
//   const hrMarker = hrG.append("line")
//     .attr("class", "marker")
//     .attr("x1", hrXScale(0))
//     .attr("x2", hrXScale(0))
//     .attr("y1", 0)
//     .attr("y2", innerHeight);
  
//   // Update function: given a currentTime (in seconds), update marker positions and timeline text.
//   window.updateGraphs = function(currentTime) {
//     // Move markers along the x-axis.
//     edaMarker
//       .attr("x1", edaXScale(currentTime))
//       .attr("x2", edaXScale(currentTime));
//     hrMarker
//       .attr("x1", hrXScale(currentTime))
//       .attr("x2", hrXScale(currentTime));
    
//     // Update timeline display.
//     d3.select("#currentTimeDisplay").text(`Time: ${Math.round(currentTime)}s`);
    
//     // Update annotation (customize as needed).
//     let annotation = "";
//     if (currentTime < 60) {
//       annotation = "Baseline";
//     } else if (currentTime < 120) {
//       annotation = "Stroop Test";
//     } else if (currentTime < 180) {
//       annotation = "First Rest";
//     } else if (currentTime < 240) {
//       annotation = "TMCT";
//     } else if (currentTime < 300) {
//       annotation = "Second Rest";
//     } else if (currentTime < 360) {
//       annotation = "Real Opinion Test";
//     } else if (currentTime < 420) {
//       annotation = "Rest Between Tests 1";
//     } else if (currentTime < 480) {
//       annotation = "Opposite Opinion Test";
//     } else if (currentTime < 540) {
//       annotation = "Rest Between Tests 2";
//     } else if (currentTime < 600) {
//       annotation = "Subtract Test";
//     } else {
//       annotation = "Post Experiment";
//     }
//     d3.select("#annotations").text(annotation);
//   }
  
//   // Initial draw at time 0.
//   updateGraphs(0);
// });
