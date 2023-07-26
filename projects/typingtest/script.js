const keys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const timestamps = [];
let score = 0;

timestamps.unshift(getTimestamp());

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomKey() {
    return keys[getRandomNumber(0, keys.length - 1)];
}

function targetRandomKey() {
    const key = document.getElementById(getRandomKey());
    key.classList.add("selected");
}

function getTimestamp() {
    return Math.floor(Date.now() / 1000);
}

function updateScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Score: ${score}`;
}

document.addEventListener("keydown", event => {
    const keyPressed = String.fromCharCode(event.keyCode);
    const keyElement = document.getElementById(keyPressed);
    const highlightedKey = document.querySelector(".selected");

    keyElement.classList.add("hit");
    keyElement.addEventListener("animationend", () => {
        keyElement.classList.remove("hit");
    });

    if (keyPressed === highlightedKey.innerHTML) {
        let audio = new Audio("keyboard_sound1.m4a");
        audio.play();
        timestamps.unshift(getTimestamp());
        const elapsedTime = timestamps[0] - timestamps[1];
        const charactersPerMinute = Math.floor(60 / elapsedTime);
        console.log(`Characters per minute: ${charactersPerMinute}`);

        highlightedKey.classList.remove("selected");
        targetRandomKey();

        score++;
        updateScore();
        jump();
    }
});

targetRandomKey();
updateScore();

const gameArea = document.getElementById("gameArea");
const dino = document.getElementById("dino");

let isJumping = false;
let jumpInterval;
let jumpStart;
let jumpHeight = 120; // Adjust the jump height
let jumpDuration = 800; // Adjust the jump duration

function jump() {
    if (!isJumping) {
        isJumping = true;
        let jumpStartTime = null;

        function animateJump(timestamp) {
            if (!jumpStartTime) jumpStartTime = timestamp;
            const progress = timestamp - jumpStartTime;
            const jumpProgress = progress / jumpDuration;

            const distance =
                jumpHeight *
                Math.sin((Math.PI / 2) * Math.min(jumpProgress, 1));
            dino.style.bottom = `${distance}px`;

            if (progress < jumpDuration) {
                jumpInterval = requestAnimationFrame(animateJump);
            } else if (progress < jumpDuration * 2) {
                const fallProgress = (progress - jumpDuration) / jumpDuration;
                const distanceFall = jumpHeight * Math.sin((Math.PI / 2) * fallProgress);
                dino.style.bottom = `${jumpHeight - distanceFall}px`;
                jumpInterval = requestAnimationFrame(animateJump);
            } else {
                dino.style.bottom = "0px";
                isJumping = false;
            }
        }

        jumpInterval = requestAnimationFrame(animateJump);
    }
}

function moveLeft() {
    const currentLeft = parseInt(getComputedStyle(dino).left);
    if (currentLeft > 0) {
        dino.style.left = `${currentLeft - 10}px`;
    }
}

function moveRight() {
    const currentLeft = parseInt(getComputedStyle(dino).left);
    const gameAreaWidth = parseInt(getComputedStyle(gameArea).width);
    const dinoWidth = parseInt(getComputedStyle(dino).width);
    if (currentLeft + dinoWidth < gameAreaWidth) {
        dino.style.left = `${currentLeft + 10}px`;
    }
}

function checkCollision() {
    const obstacle = document.querySelector(".obstacle");
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
        dinoRect.bottom >= obstacleRect.top &&
        dinoRect.left <= obstacleRect.right &&
        dinoRect.right >= obstacleRect.left
    ) {
        clearInterval(gameInterval);
        clearInterval(obstacleInterval);
        cancelAnimationFrame(jumpInterval);
        alert(`Game Over!\nYour Score: ${score}`);
        window.location.reload();
    }
}

let obstacleInterval = setInterval(() => {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    gameArea.appendChild(obstacle);
    setTimeout(() => {
        obstacle.remove();
    }, 4000);
}, 2000);

let gameInterval = setInterval(checkCollision, 10);
