const gameContainer = document.getElementById('game-container');
const bird = document.getElementById('bird');

let birdY;
let velocity = 0;
let gravity;
let pipeSpeed;
const pipeGapRatio = 0.22; // Ratio of gap to container height
let score = 0;
let isGameOver = false;

// Create score element
const scoreDisplay = document.createElement('div');
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '2%';
scoreDisplay.style.left = '2%';
scoreDisplay.style.fontSize = 'clamp(1em, 5vw, 2em)';
scoreDisplay.style.fontWeight = 'bold';
scoreDisplay.style.color = 'white';
scoreDisplay.style.zIndex = '10';
gameContainer.appendChild(scoreDisplay);
updateScoreDisplay();

function updateDimensions() {
    const containerHeight = gameContainer.offsetHeight;
    const containerWidth = gameContainer.offsetWidth;

    // Set initial bird position based on container height
    if (birdY === undefined) {
        birdY = containerHeight / 2;
    }

    // Adjust physics and speed based on container dimensions
    gravity = containerHeight * 0.001;
    pipeSpeed = containerWidth * 0.005;

    // Update bird's position based on new container size
    bird.style.top = `${birdY}px`;

    // Adjust pipe speed for pipes already on screen
    document.querySelectorAll('.pipe-group').forEach(pipeGroup => {
        const currentPipeSpeed = parseInt(pipeGroup.dataset.speed);
        pipeGroup.dataset.speed = pipeSpeed;
    });
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function gameLoop() {
    if (isGameOver) return;

    // Bird physics
    velocity += gravity;
    birdY += velocity;
    bird.style.top = `${birdY}px`;

    // Collision with top and bottom of the game container
    if (birdY <= 0 || birdY + bird.offsetHeight >= gameContainer.offsetHeight) {
        endGame();
    }

    // Move pipes and check for collisions
    const pipes = document.querySelectorAll('.pipe-group');
    pipes.forEach(pipeGroup => {
        let pipeX = parseInt(pipeGroup.style.left);
        pipeX -= pipeSpeed;
        pipeGroup.style.left = `${pipeX}px`;

        // Check for passing the pipe to update the score
        if (pipeX + pipeGroup.offsetWidth < bird.offsetLeft && !pipeGroup.passed) {
            score++;
            updateScoreDisplay();
            pipeGroup.passed = true;
        }

        // Remove pipes that are off-screen
        if (pipeX < -pipeGroup.offsetWidth) {
            pipeGroup.remove();
        }

        // AABB collision detection
        const topPipe = pipeGroup.querySelector('.pipe.top');
        const bottomPipe = pipeGroup.querySelector('.pipe.bottom');

        const birdRect = bird.getBoundingClientRect();
        const topPipeRect = topPipe.getBoundingClientRect();
        const bottomPipeRect = bottomPipe.getBoundingClientRect();

        // Check for collision with top pipe
        if (
            birdRect.right > topPipeRect.left &&
            birdRect.left < topPipeRect.right &&
            birdRect.bottom > topPipeRect.top &&
            birdRect.top < topPipeRect.bottom
        ) {
            endGame();
        }

        // Check for collision with bottom pipe
        if (
            birdRect.right > bottomPipeRect.left &&
            birdRect.left < bottomPipeRect.right &&
            birdRect.bottom > bottomPipeRect.top &&
            birdRect.top < bottomPipeRect.bottom
        ) {
            endGame();
        }
    });

    requestAnimationFrame(gameLoop);
}

function flap(event) {
    if (isGameOver) return;
    if (event.code === 'Space' || event.type === 'click') {
        const flapVelocity = gameContainer.offsetHeight * -0.015;
        velocity = flapVelocity;
    }
}

function generatePipes() {
    if (isGameOver) return;

    const containerHeight = gameContainer.offsetHeight;
    const containerWidth = gameContainer.offsetWidth;
    const pipeHeight = Math.random() * (containerHeight * 0.5 - containerHeight * 0.1) + containerHeight * 0.1;
    const pipeGap = containerHeight * pipeGapRatio;

    const pipeGroup = document.createElement('div');
    pipeGroup.classList.add('pipe-group');
    pipeGroup.style.left = `${containerWidth}px`;
    pipeGroup.dataset.speed = pipeSpeed;

    const topPipe = document.createElement('div');
    topPipe.classList.add('pipe', 'top');
    topPipe.style.height = `${pipeHeight}px`;

    const bottomPipe = document.createElement('div');
    bottomPipe.classList.add('pipe', 'bottom');
    bottomPipe.style.height = `${containerHeight - pipeHeight - pipeGap}px`;

    pipeGroup.appendChild(topPipe);
    pipeGroup.appendChild(bottomPipe);
    gameContainer.appendChild(pipeGroup);

    pipeGroup.passed = false;
}

function endGame() {
    isGameOver = true;
    alert(`Game Over! Your score: ${score}`);
    location.reload();
}

// Event listeners
document.addEventListener('keydown', flap);
gameContainer.addEventListener('click', flap);
window.addEventListener('resize', updateDimensions);

// Initial setup
updateDimensions();
setInterval(generatePipes, 2000);
requestAnimationFrame(gameLoop);
