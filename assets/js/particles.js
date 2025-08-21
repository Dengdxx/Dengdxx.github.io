// 粒子背景效果
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.init();
        this.createParticles();
        this.animate();
        this.handleResize();
    }
    
    init() {
        this.canvas.id = 'particleCanvas';
        document.body.appendChild(this.canvas);
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 5000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.getParticleColor()
            });
        }
    }
    
    getParticleColor() {
        const theme = document.body.getAttribute('data-theme');
        if (theme === 'light') {
            // 浅色主题使用较深的颜色
            const colors = ['rgba(100, 100, 255, 0.6)', 'rgba(255, 100, 150, 0.6)', 'rgba(100, 200, 100, 0.6)'];
            return colors[Math.floor(Math.random() * colors.length)];
        } else {
            // 深色主题使用较亮的颜色
            const colors = ['rgba(100, 200, 255, 0.6)', 'rgba(255, 150, 200, 0.6)', 'rgba(150, 255, 200, 0.6)'];
            return colors[Math.floor(Math.random() * colors.length)];
        }
    }
    
    updateParticles() {
        const theme = document.body.getAttribute('data-theme');
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            
            // 边界检查
            if (p.x > window.innerWidth || p.x < 0) p.speedX = -p.speedX;
            if (p.y > window.innerHeight || p.y < 0) p.speedY = -p.speedY;
            
            // 根据主题更新颜色
            p.color = this.getParticleColor();
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制连接线
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = 1 - distance / 100;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(200, 200, 255, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        // 绘制粒子
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        }
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.createParticles();
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// 初始化粒子背景
document.addEventListener('DOMContentLoaded', () => {
    window.particleBackground = new ParticleBackground();
    
    // 监听主题变化以更新粒子颜色
    const themeObserver = new MutationObserver(() => {
        if (window.particleBackground) {
            window.particleBackground.createParticles();
        }
    });
    
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
});