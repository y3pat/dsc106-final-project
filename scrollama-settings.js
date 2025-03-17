const scroller = scrollama();

function handleStepEnter(response) {
  // Remove active class from all steps
  d3.selectAll(".step").classed("is-active", false);
  // Add active class to the current step
  d3.select(response.element).classed("is-active", true);

  // Get the test name from data-test
  const testName = response.element.getAttribute("data-test");
  // Update the line charts
  updateGraphsForTest(testName);
}

function init() {
  scroller.setup({
    step: ".step",  // all elements with class "step"
    offset: 0.3,    // trigger 70% down the viewport
    debug: false
  })
  .onStepEnter(handleStepEnter);
}

// Kick things off
init();
