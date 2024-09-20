// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TILE_WIDTH = 200;
const TILE_HEIGHT = 40;
const FALLING_SPEED = 1;
const SPAWN_INTERVAL = 2000;
const DIFFICULTY_INCREASE_INTERVAL = 10000;

// Game variables
let canvas, ctx, commandInput, scoreElement, restartButton;
let tiles = [];
let score = 0;
let gameLoop;
let spawnInterval;
let difficultyInterval;
let gameOver = false;

// Shell commands array
const shellCommands = [
    "ls -l", "cd ..", "mkdir test", "rm -rf", "touch file.txt",
    "cat file.txt", "grep pattern", "chmod +x", "ssh user@host",
    "scp file user@host:", "tar -cvzf", "wget url", "curl -O url",
    "find . -name", "ps aux", "kill -9", "df -h", "du -sh",
    "top", "ifconfig", "ping google.com", "traceroute", "nslookup",
    "netstat -tuln", "iptables -L", "sed 's/old/new/'", "awk '{print $1}'",
    "cut -d: -f1", "sort file.txt", "uniq -c", "head -n 5", "tail -f"
];

// Audio
const correctAudio = new Audio('/static/audio/correct.mp3');
const gameOverAudio = new Audio('/static/audio/gameover.mp3');

// Initialize the game
function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    commandInput = document.getElementById('command-input');
    scoreElement = document.getElementById('score-value');
    restartButton = document.getElementById('restart-button');

    commandInput.addEventListener('input', checkCommand);
    restartButton.addEventListener('click', restartGame);

    startGame();
}

// Start the game
function startGame() {
    gameOver = false;
    score = 0;
    tiles = [];
    updateScore();

    commandInput.disabled = false;
    commandInput.value = '';
    commandInput.focus();

    gameLoop = requestAnimationFrame(update);
    spawnInterval = setInterval(spawnTile, SPAWN_INTERVAL);
    difficultyInterval = setInterval(increaseDifficulty, DIFFICULTY_INCREASE_INTERVAL);
}

// Main game loop
function update() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    tiles.forEach((tile, index) => {
        tile.y += FALLING_SPEED;
        drawTile(tile);

        if (tile.y + TILE_HEIGHT >= CANVAS_HEIGHT) {
            gameOver = true;
        }
    });

    if (gameOver) {
        endGame();
    } else {
        gameLoop = requestAnimationFrame(update);
    }
}

// Spawn a new tile
function spawnTile() {
    const command = shellCommands[Math.floor(Math.random() * shellCommands.length)];
    const x = Math.random() * (CANVAS_WIDTH - TILE_WIDTH);
    tiles.push({ x, y: 0, command });
}

// Draw a tile
function drawTile(tile) {
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(tile.x, tile.y, TILE_WIDTH, TILE_HEIGHT);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px monospace';
    ctx.fillText(tile.command, tile.x + 10, tile.y + 25);
}

// Check the typed command
function checkCommand() {
    const typedCommand = commandInput.value.trim();
    const matchedTileIndex = tiles.findIndex(tile => tile.command === typedCommand);

    if (matchedTileIndex !== -1) {
        tiles.splice(matchedTileIndex, 1);
        score++;
        updateScore();
        commandInput.value = '';
        correctAudio.play();
    }
}

// Update the score display
function updateScore() {
    scoreElement.textContent = score;
}

// Increase game difficulty
function increaseDifficulty() {
    FALLING_SPEED += 0.2;
}

// End the game
function endGame() {
    cancelAnimationFrame(gameLoop);
    clearInterval(spawnInterval);
    clearInterval(difficultyInterval);
    gameOverAudio.play();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = '#ffffff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
    ctx.font = '24px Arial';
    ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);

    commandInput.disabled = true;
}

// Restart the game
function restartGame() {
    cancelAnimationFrame(gameLoop);
    clearInterval(spawnInterval);
    clearInterval(difficultyInterval);
    startGame();
}

// Initialize the game when the page loads
window.addEventListener('load', init);
