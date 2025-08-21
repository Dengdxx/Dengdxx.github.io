// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 主题切换逻辑 - 支持多个主题切换按钮
    const body = document.body;
    const themeButtons = [
        document.getElementById('themeToggle'),           // 主页导航栏按钮
        document.getElementById('errorThemeToggle'),     // 404页面按钮
        document.getElementById('gameThemeToggle')       // 游戏内按钮
    ].filter(Boolean); // 移除null/undefined的按钮

    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    body.setAttribute('data-theme', savedTheme);
    
    // 更新所有主题切换按钮的图标
    function updateAllToggleIcons(theme) {
        themeButtons.forEach(button => {
            if (button) {
                button.textContent = theme === 'dark' ? '🌞' : '🌚';
            }
        });
    }
    
    // 初始化所有按钮图标
    updateAllToggleIcons(savedTheme);

    // 为所有主题切换按钮添加事件监听器
    themeButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', () => {
                const currentTheme = body.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                body.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateAllToggleIcons(newTheme);
                
                // 通知粒子背景更新颜色
                if (window.particleBackground) {
                    window.particleBackground.createParticles();
                }
            });
        }
    });

    function updateToggleIcon(theme) {
        // 保留这个函数以保持向后兼容性，但使用新的updateAllToggleIcons函数
        updateAllToggleIcons(theme);
    }

    // 移动端菜单切换
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // 更新 ARIA 属性
            mobileMenuToggle.setAttribute('aria-expanded', isActive.toString());
            mobileMenuToggle.setAttribute('aria-label', isActive ? '关闭导航菜单' : '打开导航菜单');
        });
    }

    // 点击导航链接后关闭移动菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) {
                navLinks.classList.remove('active');
            }
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.setAttribute('aria-label', '打开导航菜单');
            }
        });
    });
    
    // ESC键关闭移动菜单
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.setAttribute('aria-label', '打开导航菜单');
                mobileMenuToggle.focus(); // 返回焦点到按钮
            }
        }
    });
});

// 添加一个简单的动画效果到项目卡片
document.querySelectorAll('.project-card, .skill-item').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    // 使用 Intersection Observer 实现滚动动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // 只触发一次
            }
        });
    }, {
        threshold: 0.1
    });
    
    observer.observe(card);
});

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 20, // 顶部偏移量
                behavior: 'smooth'
            });
        }
    });
});