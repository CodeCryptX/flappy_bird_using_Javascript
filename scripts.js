window.addEventListener('DOMContentLoaded', () => {

    // Elements
    const bird = document.getElementById('bird');
    const sky = document.querySelector('.sky');
    const ground = document.getElementById('ground');
    const grass = document.getElementById('grass');
    const scoreDisplay = document.createElement('div');

    // Game state variables
    let isGameOver = false;
    let score = 0;

    // Bird initial position and physics
    let birdLeft = 250;
    let birdBottom = 200;
    let gravity = 2;

    // Gap between pipes
    let gap = 320;

    // Initial positions for sky, grass, and ground
    let skyLeft = 70;
    let skyTop = 30;

    // Timer IDs for game and pipes
    let gameTimerId;
    let pipeTimerId;

    // Function to start the game and update positions
    function startGame() {
        // Update bird position based on gravity
        birdBottom -= gravity;
        bird.style.left = birdLeft + 'px';
        bird.style.bottom = birdBottom + 'px';

        // Update score display
        scoreDisplay.textContent = `Score: ${score}`;
        scoreDisplay.style.left = '300px'; // Adjust position as needed
        scoreDisplay.style.top = '100px'; // Adjust position as needed

        // Update positions for sky, grass, and ground (if moving)
        sky.style.left = skyLeft + 'px';
        sky.style.top = skyTop + 'px';
        grass.style.left = skyLeft + 'px';
        grass.style.top = skyTop + 'px';
        ground.style.left = skyLeft + 'px';
        ground.style.top = skyTop + 'px';

        // Create and style score display
        scoreDisplay.textContent = `Score: ${score}`;
        scoreDisplay.classList.add('score');
        document.body.appendChild(scoreDisplay);
    }

    // Initialize game loop
    gameTimerId = setInterval(startGame, 10);

    // Function to handle bird jumping
    function jump() {
        if (birdBottom <= 480) {
            birdBottom += 50;
        }
        bird.style.bottom = birdBottom + 'px';
    }

    // Event listener for jump control
    function control(e) {
        if (e.keyCode === 32) {
            jump();
        }
    }
    document.addEventListener("keydown", control);

    // Function to generate pipes
    function generatePipes() {
        let pipeLeft = 1400;
        let randomHeight = Math.random() * 40;
        let pipeBottom = randomHeight;

        // Create pipe elements
        const pipe = document.createElement('div');
        const bottomPipe = document.createElement('div');

        // Add classes to pipes
        if (!isGameOver) {
            pipe.classList.add('pipe');
            bottomPipe.classList.add('bottomPipe');
        }

        // Append pipes to sky element
        sky.appendChild(pipe);
        sky.appendChild(bottomPipe);

        // Set initial positions for pipes
        pipe.style.left = pipeLeft + 'px';
        pipe.style.bottom = pipeBottom + 'px';
        bottomPipe.style.bottom = pipeBottom - gap + 'px';
        bottomPipe.style.left = pipeBottom + 'px';

        // Function to move pipes across the screen
        function movePipe() {
            if (isGameOver) {
                clearInterval(pipeTimerId);
                return;
            }

            // Move pipes to the left
            pipeLeft -= 2;
            pipe.style.left = pipeLeft + 'px';
            bottomPipe.style.left = pipeLeft + 'px';

            // Increment score if bird passes pipes
            if (pipeLeft === birdLeft) {
                score++;
            }

            // Remove pipes if off-screen
            if (pipeLeft < -50) {
                clearInterval(pipeTimerId);
                sky.removeChild(pipe);
                sky.removeChild(bottomPipe);
            }

            // Check for collisions with pipes or ground
            const birdRect = bird.getBoundingClientRect();
            const bottomPipeRect = pipe.getBoundingClientRect();
            const topPipeRect = bottomPipe.getBoundingClientRect();

            const horizontalCollision =
                birdRect.right > bottomPipeRect.left &&
                birdRect.left < bottomPipeRect.right;

            const verticalCollision =
                birdRect.bottom > bottomPipeRect.top ||
                birdRect.top < topPipeRect.bottom;

            const groundCollision = birdBottom <= 50;

            if ((horizontalCollision && verticalCollision) || groundCollision) {
                clearInterval(pipeTimerId);
                gameOver();
            }
        }

        // Start moving pipes
        pipeTimerId = setInterval(movePipe, 10);

        // Generate new pipes periodically
        if (!isGameOver) setTimeout(generatePipes, 2000);
    }

    // Start generating pipes
    generatePipes();

    // Function to handle game over state
    function gameOver() {
        clearInterval(gameTimerId);
        console.log('Game Over');
        isGameOver = true;
        document.removeEventListener('keydown', control);
    }
});
