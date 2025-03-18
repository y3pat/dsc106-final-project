// stress-animations.js (Refactored to integrate with Scrollama & Scrollytelling)
document.addEventListener("DOMContentLoaded", function () {
    const stressTasks = {
        "tmct": animateThinking,
        "real_opinion": animateTalking,
        "opposite_opinion": animateConfused,
        "subtract_test": animateSubtraction,
        "stroop": animateStroopTest

    };

    // Select the existing animation container instead of appending a new one
    const svg = d3.select("#animation-container")
        .append("svg")
        .attr("width", 300) // Adjust width to match container size
        .attr("height", 300) // Adjust height
        .style("overflow", "visible"); // Prevent clipping issues


    function clearAnimation() {
        svg.selectAll("*").remove();
    }

    function drawStickFigure() {
        return {
            head: svg.append("circle").attr("cx", 250).attr("cy", 100).attr("r", 30).attr("fill", "black"),
            body: svg.append("line").attr("x1", 250).attr("y1", 130).attr("x2", 250).attr("y2", 250).attr("stroke", "black").attr("stroke-width", 5),
            leftArm: svg.append("line").attr("x1", 250).attr("y1", 160).attr("x2", 200).attr("y2", 190).attr("stroke", "black").attr("stroke-width", 5),
            rightArm: svg.append("line").attr("x1", 250).attr("y1", 160).attr("x2", 300).attr("y2", 190).attr("stroke", "black").attr("stroke-width", 5),
            leftLeg: svg.append("line").attr("x1", 250).attr("y1", 250).attr("x2", 220).attr("y2", 350).attr("stroke", "black").attr("stroke-width", 5),
            rightLeg: svg.append("line").attr("x1", 250).attr("y1", 250).attr("x2", 280).attr("y2", 350).attr("stroke", "black").attr("stroke-width", 5)
        };
    }

    function animateThinking() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        stickFigure.leftArm.transition().duration(800).attr("x2", 230).attr("y2", 120);
        stickFigure.rightArm.transition().duration(800).attr("x2", 270).attr("y2", 120);

        let startY = 70;
        let centerX = 250;
        let spacing = 80;
        let number = Math.floor(Math.random() * 50) + 50;
        let terms = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < terms; i++) {
            let operation = Math.random() < 0.5 ? '-' : '+';
            let operand = Math.floor(Math.random() * 20) + 1;
            let newNumber = operation === '-' ? number - operand : number + operand;

            svg.append("text")
                .attr("x", centerX - ((terms - 1) * spacing / 2) + (i * spacing))
                .attr("y", startY)
                .attr("font-size", "20px")
                .attr("fill", "black")
                .attr("opacity", 0)
                .text(`${number} ${operation} ${operand}`)
                .transition()
                .delay(i * 1000)
                .duration(2500)
                .attr("y", 40)
                .attr("opacity", 1)
                .transition()
                .duration(1200)
                .attr("opacity", 0)
                .remove();

            number = newNumber;
        }
    }

    function animateTalking() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        stickFigure.leftArm.transition().duration(500).attr("x2", 180).attr("y2", 170);
        stickFigure.rightArm.transition().duration(500).attr("x2", 320).attr("y2", 170);

        svg.append("text")
            .attr("x", 280).attr("y", 80).attr("font-size", "20px").attr("fill", "black").attr("opacity", 0)
            .text("I think...")
            .transition().duration(500)
            .attr("opacity", 1)
            .transition().duration(2000)
            .attr("opacity", 0)
            .remove();
    }

    function animateConfused() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        stickFigure.head.transition().duration(300)
            .attr("cx", 245)
            .transition().duration(300)
            .attr("cx", 255)
            .transition().duration(300)
            .attr("cx", 250);

        stickFigure.leftArm.transition().duration(500).attr("x2", 270).attr("y2", 160);
        stickFigure.rightArm.transition().duration(500).attr("x2", 230).attr("y2", 160);
    }

    function animateSubtraction() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        stickFigure.rightArm.transition().duration(500)
            .attr("x2", 280)
            .attr("y2", 210)
            .transition().duration(500)
            .attr("x2", 300)
            .attr("y2", 220);

        svg.append("text")
            .attr("x", 290).attr("y", 220).attr("font-size", "18px").attr("fill", "black").text("1022 - 13...");
    }

    function animateStroopTest() {
        clearAnimation();
        const stickFigure = drawStickFigure();

        stickFigure.leftArm.transition().duration(500).attr("x2", 180).attr("y2", 170);
        stickFigure.rightArm.transition().duration(500).attr("x2", 320).attr("y2", 170);

        svg.append("text")
            .attr("x", 70).attr("y", 100)
            .attr("font-size", "30px")
            .attr("fill", "red")
            .text("GREEN");

        svg.append("text")
            .attr("x", 280).attr("y", 50)
            .attr("font-size", "20px")
            .attr("fill", "black")
            .attr("opacity", 0)
            .text("RED!")
            .transition()
            .delay(1000)
            .duration(500)
            .attr("opacity", 1)
            .transition()
            .duration(800)
            .attr("opacity", 0)
            .remove();
    }

    // Function to trigger animation on scroll
    window.startAnimation = function(testName) {
        if (stressTasks[testName]) {
            stressTasks[testName]();
        } else {
            clearAnimation();
        }
    };
});
