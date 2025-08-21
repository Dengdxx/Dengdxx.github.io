// Chrome Dinosaur Game Easter Egg
class DinosaurGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameContainer = null;
        this.isPlaying = false;
        this.gameSpeed = 6;
        this.gravity = 0.5;
        this.score = 0;
        this.gameRunning = false;
        
        // Game objects
        this.dino = {
            x: 50,
            y: 150,
            width: 40,
            height: 40,
            dy: 0,
            jumpForce: 12,
            grounded: true,
            color: '#ffffff'
        };
        
        this.obstacles = [];
        this.particles = [];
        this.gameLoop = null;
        
        this.init();
    }
    
    init() {
        // Create game container
        this.gameContainer = document.createElement('div');
        this.gameContainer.id = 'dinosaur-game';
        this.gameContainer.className = 'dinosaur-game-container';
        this.gameContainer.style.display = 'none';
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 200;
        this.ctx = this.canvas.getContext('2d');
        
        // Create UI elements
        const gameInfo = document.createElement('div');
        gameInfo.className = 'game-info';
        gameInfo.innerHTML = `
            <div class="game-score">Score: <span id="score">0</span></div>
            <div class="game-instructions">按空格键跳跃 | 点击关闭游戏</div>
        `;
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'game-close-btn';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => this.hideGame();
        
        // Assemble game container
        this.gameContainer.appendChild(closeButton);
        this.gameContainer.appendChild(gameInfo);
        this.gameContainer.appendChild(this.canvas);
        
        // Add to page
        document.body.appendChild(this.gameContainer);
        
        // Event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;
            
            if (e.code === 'Space') {
                e.preventDefault();
                this.jump();
            }
        });
        
        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.isPlaying) {
                this.jump();
            }
        });
        
        // Click to restart when game over
        this.canvas.addEventListener('click', () => {
            if (!this.gameRunning && this.isPlaying) {
                this.restartGame();
            }
        });
    }
    
    showGame() {
        this.gameContainer.style.display = 'flex';
        this.isPlaying = true;
        this.startGame();
        
        // Hide the original 404 content
        const errorContainer = document.querySelector('.error-container');
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }
    
    hideGame() {
        this.gameContainer.style.display = 'none';
        this.isPlaying = false;
        this.stopGame();
        
        // Show the original 404 content
        const errorContainer = document.querySelector('.error-container');
        if (errorContainer) {
            errorContainer.style.display = 'flex';
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.gameSpeed = 6;
        this.obstacles = [];
        this.particles = [];
        
        // Reset dino
        this.dino.y = 150;
        this.dino.dy = 0;
        this.dino.grounded = true;
        
        // Start game loop
        this.gameLoop = setInterval(() => this.update(), 1000/60);
    }
    
    stopGame() {
        this.gameRunning = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    restartGame() {
        this.stopGame();
        this.startGame();
    }
    
    jump() {
        if (this.dino.grounded && this.gameRunning) {
            this.dino.dy = -this.dino.jumpForce;
            this.dino.grounded = false;
        }
    }
    
    update() {
        if (!this.gameRunning) return;
        
        this.updateDino();
        this.updateObstacles();
        this.updateParticles();
        this.checkCollisions();
        this.updateScore();
        this.draw();
    }
    
    updateDino() {
        // Apply gravity
        this.dino.dy += this.gravity;
        this.dino.y += this.dino.dy;
        
        // Ground collision
        if (this.dino.y >= 150) {
            this.dino.y = 150;
            this.dino.dy = 0;
            this.dino.grounded = true;
        }
    }
    
    updateObstacles() {
        // Spawn obstacles
        if (Math.random() < 0.005 + this.score * 0.000005) {
            this.obstacles.push({
                x: this.canvas.width,
                y: 150,
                width: 20,
                height: 40,
                color: '#00DBDE'
            });
        }
        
        // Update obstacle positions
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.gameSpeed;
            
            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
            }
        });
    }
    
    updateParticles() {
        // Add ground particles
        if (Math.random() < 0.3) {
            this.particles.push({
                x: this.canvas.width,
                y: 190 + Math.random() * 10,
                size: Math.random() * 3 + 1,
                speed: this.gameSpeed * 0.5,
                opacity: 1
            });
        }
        
        // Update particles
        this.particles.forEach((particle, index) => {
            particle.x -= particle.speed;
            particle.opacity -= 0.01;
            
            if (particle.x < 0 || particle.opacity <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }
    
    checkCollisions() {
        this.obstacles.forEach(obstacle => {
            if (this.dino.x < obstacle.x + obstacle.width &&
                this.dino.x + this.dino.width > obstacle.x &&
                this.dino.y < obstacle.y + obstacle.height &&
                this.dino.y + this.dino.height > obstacle.y) {
                this.gameOver();
            }
        });
    }
    
    updateScore() {
        this.score++;
        document.getElementById('score').textContent = Math.floor(this.score / 10);
        
        // Increase speed gradually
        this.gameSpeed = 6 + (this.score * 0.001);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.stopGame();
        
        // Draw game over screen
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Game Over', this.canvas.width / 2, this.canvas.height / 2 - 20);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('点击重新开始', this.canvas.width / 2, this.canvas.height / 2 + 20);
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 190);
        this.ctx.lineTo(this.canvas.width, 190);
        this.ctx.stroke();
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        });
        
        // Draw dinosaur
        this.ctx.fillStyle = this.dino.color;
        this.ctx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);
        
        // Draw dino details (simple eyes)
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(this.dino.x + 25, this.dino.y + 8, 4, 4);
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            // Create gradient for obstacles
            const gradient = this.ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x + obstacle.width, obstacle.y + obstacle.height);
            gradient.addColorStop(0, '#00DBDE');
            gradient.addColorStop(1, '#FC00FF');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on 404 page
    if (document.querySelector('.error-container')) {
        const dinosaurGame = new DinosaurGame();
        
        // Add click handler to robot animation to start game
        const robotAnimation = document.querySelector('.robot-animation');
        if (robotAnimation) {
            robotAnimation.addEventListener('click', () => {
                dinosaurGame.showGame();
            });
            
            // Add cursor pointer to indicate it's clickable
            robotAnimation.style.cursor = 'pointer';
            robotAnimation.title = '点击开始小恐龙游戏！';
        }
    }
});