// Simple Coliseum Night Game - pure JavaScript, no external dependencies
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.getElementById('game-container').appendChild(canvas);
const ctx = canvas.getContext('2d');

let playerX = 400;
let score = 0;
let coins = [];
let keys = {};
let lastTime = 0;
let gameOver = false;

// Input handling
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Spawn coins
type intervalId = setInterval(() => {
    coins.push({
        x: Math.random() * 760 + 20,
        y: -20,
        speed: 2 + Math.random()
    });
}, 1000);

function update(delta) {
    if (gameOver) return;
    
    // Player movement
    if (keys['ArrowLeft']) playerX -= 300 * delta / 1000;
    if (keys['ArrowRight']) playerX += 300 * delta / 1000;
    playerX = Math.max(16, Math.min(784, playerX));
    
    // Update coins
    for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].y += coins[i].speed * delta;
        
        // Collision with player
        if (Math.abs(coins[i].x - playerX) < 24 && Math.abs(coins[i].y - 500) < 24) {
            score += 10;
            coins.splice(i, 1);
            continue;
        }
        
        // Remove if off screen
        if (coins[i].y > 620) {
            coins.splice(i, 1);
        }
    }
}

function render() {
    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw player
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(playerX - 16, 500, 32, 32);
    
    // Draw coins
    ctx.fillStyle = '#ffd700';
    for (const coin of coins) {
        ctx.fillRect(coin.x - 8, coin.y - 8, 16, 16);
    }
    
    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px monospace';
    ctx.fillText('Score: ' + score, 16, 40);
}

function gameLoop(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    
    update(delta);
    render();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame((timestamp) => {
    lastTime = timestamp;
    gameLoop(timestamp);
});