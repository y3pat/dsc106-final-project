document.addEventListener("DOMContentLoaded", function () {
    const stressTasks = {
        "introduction": animateIntro
    };

    const svg = d3.select("#animation-container")
        .append("svg")
        .attr("width", 600)
        .attr("height", 400)
        .style("overflow", "visible");

    function clearAnimation() {
        svg.selectAll("*").remove();
    }

    function drawStickFigure(x, y, label) {
        const figure = {
            head: svg.append("circle").attr("cx", x).attr("cy", y).attr("r", 30).attr("fill", "black"),
            body: svg.append("line").attr("x1", x).attr("y1", y + 30).attr("x2", x).attr("y2", y + 130).attr("stroke", "black").attr("stroke-width", 5),
            leftArm: svg.append("line").attr("x1", x).attr("y1", y + 50).attr("x2", x - 30).attr("y2", y + 80).attr("stroke", "black").attr("stroke-width", 5),
            rightArm: svg.append("line").attr("x1", x).attr("y1", y + 50).attr("x2", x + 30).attr("y2", y + 80).attr("stroke", "black").attr("stroke-width", 5),
            leftLeg: svg.append("line").attr("x1", x).attr("y1", y + 130).attr("x2", x - 20).attr("y2", y + 200).attr("stroke", "black").attr("stroke-width", 5),
            rightLeg: svg.append("line").attr("x1", x).attr("y1", y + 130).attr("x2", x + 20).attr("y2", y + 200).attr("stroke", "black").attr("stroke-width", 5)
        };
        
        // Add label below the stick figure
        svg.append("text")
            .attr("x", x)
            .attr("y", y + 220)
            .attr("font-size", "16px")
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .text(label);
        
        return figure;
    }

    function animateIntro() {
        clearAnimation();
        animateTrierMentalChallenge(-150, 50);
        animateRealOpinion(50, 50);
        animateOppositeOpinion(250, 50);
        animateSubtractTest(-50, 400);
        animateStroopTest(150, 400);
    }

    function animateTrierMentalChallenge(x, y) {
        const stickFigure = drawStickFigure(x, y, "Trier Mental Challenge");
        function loopAnimation() {
            stickFigure.rightArm.transition()
                .duration(500)
                .attr("x2", x + 40)
                .attr("y2", y + 20)
                .transition()
                .duration(500)
                .attr("x2", x + 30)
                .attr("y2", y + 50)
                .on("end", loopAnimation);
        }
        loopAnimation();
    }

    function animateRealOpinion(x, y) {
        const stickFigure = drawStickFigure(x, y, "Real Opinion");
        function loopAnimation() {
            stickFigure.leftArm.transition()
                .duration(500)
                .attr("x2", x - 50)
                .attr("y2", y + 70)
                .transition()
                .duration(500)
                .attr("x2", x - 30)
                .attr("y2", y + 80)
                .on("end", loopAnimation);
        }
        loopAnimation();
    }

    function animateOppositeOpinion(x, y) {
        const stickFigure = drawStickFigure(x, y, "Opposite Opinion");
        function loopAnimation() {
            stickFigure.head.transition()
                .duration(300)
                .attr("cx", x - 5)
                .transition()
                .duration(300)
                .attr("cx", x + 5)
                .transition()
                .duration(300)
                .attr("cx", x)
                .on("end", loopAnimation);
        }
        loopAnimation();
    }

    function animateSubtractTest(x, y) {
        const stickFigure = drawStickFigure(x, y, "Subtract Test");
        function loopAnimation() {
            stickFigure.rightArm.transition()
                .duration(500)
                .attr("x2", x + 50)
                .attr("y2", y + 70)
                .transition()
                .duration(500)
                .attr("x2", x + 30)
                .attr("y2", y + 80);
            svg.append("text")
                .attr("x", x - 20)
                .attr("y", y - 20)
                .attr("font-size", "18px")
                .attr("fill", "black")
                .text("1022 - 13...")
                .transition()
                .duration(1500)
                .attr("opacity", 0)
                .on("end", function() {
                    d3.select(this).remove();
                    loopAnimation();
                });
        }
        loopAnimation();
    }

    function animateStroopTest(x, y) {
        const stickFigure = drawStickFigure(x, y, "Stroop Test");
        function loopAnimation() {
            svg.append("text")
                .attr("x", x - 40)
                .attr("y", y - 30)
                .attr("font-size", "30px")
                .attr("fill", "red")
                .text("GREEN")
                .transition()
                .duration(1000)
                .attr("fill", "blue")
                .text("RED")
                .on("end", loopAnimation);
        }
        loopAnimation();
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