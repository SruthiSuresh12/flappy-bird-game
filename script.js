const gameContainer = document.getElementById('game-container');
const bird = document.getElementById('bird');
let birdY = 240;
let velocity = 0;
let gravity = 0.5;
let isGameOver = false;

// Game loop
function gameLoop() {
    if (isGameOver) return;

    // Bird physics
    velocity += gravity;
    birdY += velocity;
    bird.style.top = birdY + 'px';

    // Game over if bird hits top or bottom
    if (birdY > 450 || birdY < 0) {
        endGame();
    }
}

// Bird flap
function flap() {
    if (isGameOver) return;
    velocity = -8;
}

// Generate pipes
function generatePipes() {
    if (isGameOver) return;

    const pipeGap = 100;
    const pipeHeight = Math.random() * (200 - 50) + 50;
    const topPipe = document.createElement('div');
    const bottomPipe = document.createElement('div');

    topPipe.classList.add('pipe');
    bottomPipe.classList.add('pipe');

    topPipe.style.height = pipeHeight + 'px';
    topPipe.style.top = '0';
    topPipe.style.left = '320px';

    bottomPipe.style.height = (480 - pipeHeight - pipeGap) + 'px';
    bottomPipe.style.bottom = '0';
    bottomPipe.style.left = '320px';

    gameContainer.appendChild(topPipe);
    gameContainer.appendChild(bottomPipe);

    // Animate pipes
    let pipeX = 320;
    const pipeInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(pipeInterval);
            return;
        }

        pipeX -= 2;
        topPipe.style.left = pipeX + 'px';
        bottomPipe.style.left = pipeX + 'px';

        // Collision detection (simplified)
        if (pipeX < 20 && pipeX > -50) {
            const birdTop = bird.offsetTop;
            const birdBottom = birdTop + bird.offsetHeight;

            if (birdBottom < pipeHeight || birdTop > (pipeHeight + pipeGap)) {
                endGame();
            }
        }
    }, 20);
}

// End game function
function endGame() {
    isGameOver = true;
    alert("Game Over!");
    location.reload(); // Reload the page to restart
}

// Event listener for flapping
document.addEventListener('keydown', flap);
gameContainer.addEventListener('click', flap);

// Start the game
setInterval(gameLoop, 20);
setInterval(generatePipes, 2000);
