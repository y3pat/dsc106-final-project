// stress-animations.js

// Set the dimensions and margins of the graph
const margin = { top: 50, right: 25, bottom: 45, left: 50 },
      width = 700 - margin.left - margin.right,
      height = 420 - margin.top - margin.bottom;

// Append the SVG object to the container with id "stress_viz"
const svg = d3.select("#stress_viz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

// Set colours for plot
const color_mapping = {
    red: '#A6055D',
    grey: '#777',
    green: '#00C184'
};

// Create a tooltip div
var tooltip = d3.select("#stress_viz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip");

// Helper function to return tooltip text based on step
function returnTooltipText(step, d) {
    switch (step) {
        case 'title':
            return d.index + ": " + d.title;
        case 'title score':
            return d.index + ": " + d.title + " - sentiment score: " + d.score;
        case 'title score magnitude':
            return d.index + ": " + d.title + " - sentiment score: " + d.score + " - magnitude: " + d.magnitude;
        default:
            return "";
    }
}

// Tooltip show/hide functions
var showTooltip = function(d) {
    tooltip.transition().duration(200)
        .style("opacity", 1)
        .text(returnTooltipText(toolTipState, d));
};
var hideTooltip = function(d) {
    tooltip.transition().duration(200)
        .style("opacity", 0);
};

// Load your stress data (ensure your JSON file has the appropriate structure)
d3.json("./proposal/data/stress_data.json").then(data => {
    
    // Save the data globally for use in update functions
    window.stressData = data;
    
    // Create X scale based on time
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.time))
        .range([0, width]);
    
    // Create Y scale based on EDA values (for demonstration)
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.eda))
        .range([height, 0]);
    
    // Append X and Y axes (initially hidden, opacity 0)
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "Xaxis axis")
        .style("opacity", 0)
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("class", "Yaxis axis")
        .style("opacity", 0)
        .call(d3.axisLeft(y));
    
    // (Optional) Scale for bubble size
    const z = d3.scaleLinear()
        .domain([0, 1])
        .range([1, 4]);
    
    // Add bubble chart (each data point becomes a circle)
    const bubbleChart = svg.append('g')
        .attr("class", "chart")
        .selectAll("circle")
        .data(data)
        .join("circle")
            .attr("class", "bubbles")
            .attr("cx", d => x(d.time))
            .attr("cy", d => y(d.eda))
            .attr("r", 10)
            .style("fill", "#F2E8DC")
            .attr("stroke", "white")
        .on("mouseover", showTooltip)
        .on("mouseleave", hideTooltip);
    
    // Global axis objects for updating
    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);
    
    // Define update functions for different steps.
    function dotColorGrey() {
        bubbleChart
            .transition()
            .duration(1000)
            .attr("r", 10)
            .style("fill", "#F2E8DC");
    }
    window.dotColorGrey = dotColorGrey;
    
    function dotColorSentiment() {
        bubbleChart
            .transition()
            .duration(1000)
            .attr("r", 10)
            .style("fill", function(d) { 
                if (d.score > 0) { return color_mapping.green; }
                else if (d.score < 0) { return color_mapping.red; }
                else { return color_mapping.grey; }
            });
    }
    window.dotColorSentiment = dotColorSentiment;
    
    function dotResize() {
        x.domain(d3.extent(data, d => d.time));
        svg.selectAll(".Xaxis")
            .transition()
            .duration(1000)
            .call(xAxis);
        y.domain(d3.extent(data, d => d.eda));
        svg.selectAll(".Yaxis")
            .transition()
            .duration(1000)
            .call(yAxis);
        bubbleChart
            .transition()
            .duration(1000)
            .attr("cx", d => x(d.time))
            .attr("cy", d => y(d.eda))
            .attr("r", d => (d.magnitude * 2.7));
    }
    window.dotResize = dotResize;
    
    function dotPositionScore() {
        x.domain([-.8, .8]);
        svg.selectAll(".Xaxis")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .call(xAxis);
        y.domain([0, 2]);
        svg.selectAll(".Yaxis")
            .transition()
            .duration(1000)
            .call(yAxis);
        bubbleChart
            .transition()
            .duration(1000)
            .attr("cx", d => x(d.score))
            .attr("cy", d => y(d.eda));
    }
    window.dotPositionScore = dotPositionScore;
    
    function dotPositionMagnitude() {
        y.domain([1, d3.max(data, d => d.magnitude + 1)]);
        svg.selectAll(".Yaxis")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .call(yAxis);
        bubbleChart
            .transition()
            .duration(1000)
            .style("fill", function(d) { 
                if (d.score > 0) { return color_mapping.green; }
                else if (d.score < 0) { return color_mapping.red; }
                else { return color_mapping.grey; }
            })
            .attr("r", d => (d.magnitude * 2))
            .attr("cy", d => y(d.magnitude));
    }
    window.dotPositionMagnitude = dotPositionMagnitude;
    
    function dotSimplify() {
        bubbleChart
            .transition()
            .duration(1000)
            .style("fill", "black")
            .attr("r", 5);
    }
    window.dotSimplify = dotSimplify;
    
    // (Optional) Functions for drawing paths can be added here.
    
}).catch(err => {
    console.error("Error processing stress data:", err);
});
