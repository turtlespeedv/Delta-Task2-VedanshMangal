const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PLAYER_WIDTH = 100;
const PLAYER_HEIGHT = 80;
const ZOMBIE_WIDTH = 100;
const ZOMBIE_HEIGHT = 80;
const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 5;
const PLAYER_SPEED = 5;
const ZOMBIE_SPEED = 2;
const BULLET_SPEED = 10;
const MAX_ZOMBIES = 10;
const MAX_HEALTH = 100;

const backgroundImg = new Image();
backgroundImg.src = 'background.png';

const playerImg = new Image();
playerImg.src = 'soldier.png';

const zombieImg = new Image();
zombieImg.src = 'zombie.png';

const bulletImg = new Image();
bulletImg.src = 'bullet.png';

// player object
let player = {
    x: WIDTH / 2 - PLAYER_WIDTH / 2,
    y: HEIGHT / 2 - PLAYER_HEIGHT / 2,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    health: MAX_HEALTH
};

// zombie objects
let zombies = [];

// bullets array
let bullets = [];

// game state
let paused = false;
let score = 0;

// event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousedown', mouseDownHandler);

// key handlers
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
let pPressed = false;

//key functions
function keyDownHandler(e) {
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        upPressed = true;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
        downPressed = true;
    } else if (e.key === 'p' || e.key === 'P') {
        paused = !paused;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
        upPressed = false;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
        downPressed = false;
    }
}

function mouseDownHandler(e) {
    // bullet when mouse is clicked
    const bulletX = player.x + player.width;
    const bulletY = player.y + player.height / 2 - BULLET_HEIGHT / 2;
    bullets.push({ x: bulletX, y: bulletY });
}

// Main game
function draw() {
    if (!paused) {
        // canvas
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // background
        ctx.drawImage(backgroundImg, 0, 0, WIDTH, HEIGHT);
        
        // player
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
        
        // move player
        if (leftPressed && player.x > 0) {
            player.x -= PLAYER_SPEED;
        }
        if (rightPressed && player.x < WIDTH - PLAYER_WIDTH) {
            player.x += PLAYER_SPEED;
        }
        if (upPressed && player.y > 0) {
            player.y -= PLAYER_SPEED;
        }
        if (downPressed && player.y < HEIGHT - PLAYER_HEIGHT) {
            player.y += PLAYER_SPEED;
        }
        
        // zombies
        for (let i = 0; i < zombies.length; i++) {
            ctx.drawImage(zombieImg, zombies[i].x, zombies[i].y, zombies[i].width, zombies[i].height);
            zombies[i].x -= ZOMBIE_SPEED; // zombie towards plaeyer
            
            // Check collision with player
            if (isColliding(player, zombies[i])) {
                player.health -= 10;
                zombies.splice(i, 1);
                i--;
            }

            // Check if zombie reaches other side
            if (zombies[i].x < 0) {
                player.health -= 10;
                zombies.splice(i, 1); 
                i--; 
            }
        }
        
        // bullets and check collision with zombies
        for (let i = 0; i < bullets.length; i++) {
            ctx.drawImage(bulletImg, bullets[i].x, bullets[i].y, BULLET_WIDTH, BULLET_HEIGHT);
            bullets[i].x += BULLET_SPEED; // Move bullets
            
            // check collision with zombies
            for (let j = 0; j < zombies.length; j++) {
                if (isColliding(bullets[i], zombies[j])) {
                    zombies.splice(j, 1); // remove the collided zombie
                    bullets.splice(i, 1); // remove the bullet
                    score=score+10; // increase score
                    i--; 
                    break; // 
                    }
            }
        }
        
        // spawn zombies randomly
        if (zombies.length < MAX_ZOMBIES && Math.random() < 0.01) {
            zombies.push({
                x: WIDTH,
                y: Math.random() * HEIGHT,
                width: ZOMBIE_WIDTH,
                height: ZOMBIE_HEIGHT
            });
        }
        
        // player health
        ctx.fillStyle = 'white';
        ctx.fillText(`Health: ${player.health}`, 10, 20);

        // score
        ctx.fillStyle = 'white';
        ctx.fillText(`Score: ${score}`, 10, 40);
        
        // end game if player health reaches zero
        if (player.health <= 0) {
            gameOver();
        }
    }
    
    requestAnimationFrame(draw);
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + BULLET_WIDTH > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + BULLET_HEIGHT > rect2.y;
}

function gameOver() {
    // game over logic
    alert('Game Over!');
}

// start the game loop
draw();
