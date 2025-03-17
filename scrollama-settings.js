const scroller = scrollama();
const leftColumn = document.querySelector(".left-column"); // Scrollable section

function handleStepEnter(response) {
  console.log("Entering step:", response.element.getAttribute("data-test")); // Debugging log

  // Remove active class from all steps
  d3.selectAll(".step").classed("is-active", false);
  // Add active class to the current step
  d3.select(response.element).classed("is-active", true);

  // Get the test name from data-test
  const testName = response.element.getAttribute("data-test");

  // Ensure data is available before updating graphs
  if (window.allEdaData && window.allHrData) {
    updateGraphsForTest(testName);
  } else {
    console.warn(`Skipping ${testName} - Data not available yet.`);
  }
}

// Function to check if user is at the top or bottom of the scroll area
function checkScrollPosition() {
  const scrollTop = leftColumn.scrollTop;
  const scrollHeight = leftColumn.scrollHeight;
  const clientHeight = leftColumn.clientHeight;

  if (scrollTop === 0) {
    console.log("At top: Activating Baseline");
    if (window.allEdaData && window.allHrData) {
      updateGraphsForTest("baseline");
      document.querySelector(".step:first-child").classList.add("is-active");
    }
  } else if (scrollTop + clientHeight >= scrollHeight - 5) {
    console.log("At bottom: Activating Final Test");
    if (window.allEdaData && window.allHrData) {
      updateGraphsForTest("post_experiment");
      document.querySelector(".step:last-child").classList.add("is-active");
    }
  }
}

// Ensure page starts at "Baseline" ONLY AFTER data is available
function waitForDataAndStart() {
  const checkDataLoaded = setInterval(() => {
    if (window.allEdaData && window.allHrData) {
      updateGraphsForTest("baseline"); // Load baseline graph immediately
      document.querySelector(".step:first-child").classList.add("is-active");
      clearInterval(checkDataLoaded); // Stop checking

      // ✅ Now that data is ready, initialize Scrollama
      initScrollama();
    }
  }, 100);
}

// Initialize Scrollama AFTER everything is loaded
function initScrollama() {
  scroller.setup({
    step: ".step",
    offset: 0.33, // Middle of the screen remains the trigger zone
    debug: false
  })
  .onStepEnter(handleStepEnter);

}

// ✅ Start waiting for data, then initialize everything
waitForDataAndStart();
