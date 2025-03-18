document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Stroop Game Script Loaded");

    const colors = ["RED", "BLUE", "GREEN", "YELLOW"];
    const colorValues = {
        "RED": "#B22222", // Darker Red
        "BLUE": "#00008B", // Darker Blue
        "GREEN": "#006400", // Darker Green
        "YELLOW": "#9B870C"  // Darker Yellow
    };

    let score = 0;
    let wrongAttempts = 0;
    let timeLeft = 3;
    let timerInterval;
    let buttonsDisabled = false;
    const maxCorrect = 10;
    const maxWrong = 3;

    function showStartButton() {
        const gameContainer = document.getElementById("stroop-game-container");
        gameContainer.innerHTML = '<button id="start-game-btn" style="padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 10px;">Want to Play the Stroop Test?</button>';
        document.getElementById("start-game-btn").addEventListener("click", function () {
            gameContainer.innerHTML = `
                <p id="stroop-timer" style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">Time Left: 3s</p>
                <div id="stroop-word" style="font-size: 48px; font-weight: bold; margin-bottom: 20px;"></div>
                <div id="stroop-options" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;"></div>
                <p id="stroop-feedback" style="font-size: 22px; margin-top: 15px;"></p>
                <p style="font-size: 24px; font-weight: bold;">Score: <span id="stroop-score">0</span></p>
            `;
            startStroopGame();
        });
    }

    function generateStroopTest() {
        if (score >= maxCorrect) {
            endGame("🏆 You Win! 🎉 Great job on getting 10 correct answers!");
            return;
        }
        if (wrongAttempts >= maxWrong) {
            endGame("😓 You Tried! Better luck next time!");
            return;
        }

        console.log("🎮 Generating new Stroop Test...");
        
        const stroopWord = document.getElementById("stroop-word");
        const optionsContainer = document.getElementById("stroop-options");
        const timerDisplay = document.getElementById("stroop-timer");
        const feedback = document.getElementById("stroop-feedback");

        if (!stroopWord || !optionsContainer || !timerDisplay) {
            console.error("❌ Stroop game elements not found!");
            return;
        }

        timeLeft = 3;
        buttonsDisabled = false;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;
        feedback.textContent = "";

        clearInterval(timerInterval);

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                disableButtons();
                checkAnswer(null, null);
            }
        }, 1000);

        const word = colors[Math.floor(Math.random() * colors.length)];
        let textColor;
        
        do {
            textColor = colors[Math.floor(Math.random() * colors.length)];
        } while (textColor === word);

        stroopWord.textContent = word;
        stroopWord.style.color = colorValues[textColor];

        optionsContainer.innerHTML = "";

        colors.forEach(color => {
            const btn = document.createElement("button");
            btn.textContent = color;
            btn.style.backgroundColor = colorValues[color];
            btn.style.color = "white";
            btn.style.padding = "15px 30px";
            btn.style.fontSize = "22px";
            btn.style.fontWeight = "bold";
            btn.style.margin = "5px";
            btn.style.border = "none";
            btn.style.borderRadius = "10px";
            btn.style.cursor = "pointer";
            btn.onclick = function () {
                if (!buttonsDisabled) {
                    clearInterval(timerInterval);
                    disableButtons();
                    checkAnswer(color, textColor);
                }
            };
            optionsContainer.appendChild(btn);
        });
    }

    function checkAnswer(userChoice, correctAnswer) {
        const feedback = document.getElementById("stroop-feedback");
        
        if (userChoice === correctAnswer) {
            feedback.textContent = "✅ Correct!";
            feedback.style.color = "green";
            score++;
        } else if (userChoice === null) {
            feedback.textContent = "⏳ Time's up! Try again.";
            feedback.style.color = "orange";
            wrongAttempts++;
        } else {
            feedback.textContent = "❌ Wrong! Try again.";
            feedback.style.color = "red";
            wrongAttempts++;
        }

        document.getElementById("stroop-score").textContent = score;

        setTimeout(() => {
            feedback.textContent = "";
            generateStroopTest();
        }, 1000);
    }

    function disableButtons() {
        buttonsDisabled = true;
        document.querySelectorAll("#stroop-options button").forEach(btn => {
            btn.style.opacity = "0.5";
            btn.style.pointerEvents = "none";
        });
    }

    function endGame(message) {
        const gameContainer = document.getElementById("stroop-game-container");
        gameContainer.innerHTML = `
            <h2 style="color: #A6055D; font-size: 28px;">${message}</h2>
            <button id="restart-game-btn" style="padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 10px;">Play Again</button>
        `;
        document.getElementById("restart-game-btn").addEventListener("click", function () {
            score = 0;
            wrongAttempts = 0;
            showStartButton();
        });
    }

    window.startStroopGame = function () {
        console.log("🚀 Starting Stroop Game...");
        score = 0;
        wrongAttempts = 0;
        document.getElementById("stroop-score").textContent = score;
        generateStroopTest();
    };

    showStartButton();
});
