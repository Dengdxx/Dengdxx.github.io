// 主题切换：尊重系统偏好 + 本地记忆
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');

  const getSystemPref = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const getStored = () => localStorage.getItem('theme') || 'auto';
  const applyTheme = (mode) => {
    if (mode === 'auto') {
      root.setAttribute('data-theme', getSystemPref());
    } else {
      root.setAttribute('data-theme', mode);
    }
  };

  let mode = getStored(); // 'auto' | 'light' | 'dark'
  applyTheme(mode);

  if (btn) {
    btn.addEventListener('click', () => {
      const curr = root.getAttribute('data-theme');
      // 循环：auto -> light -> dark -> auto
      if (mode === 'auto') mode = 'light';
      else if (mode === 'light') mode = 'dark';
      else mode = 'auto';
      localStorage.setItem('theme', mode);
      applyTheme(mode);
    });
  }

  // 当系统主题变化且为 auto 时更新
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener?.('change', () => {
    if (getStored() === 'auto') applyTheme('auto');
  });
})();

// 移动端菜单开关
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  // 点击菜单后自动关闭（移动端体验）
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// 滚动出现动效
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

// 年份自动更新
document.getElementById('year').textContent = new Date().getFullYear();