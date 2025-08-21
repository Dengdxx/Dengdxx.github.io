// blog.js - 负责渲染文章列表、搜索、标签过滤、单篇文章渲染
// 依赖：assets/data/posts.json（同目录或绝对路径）
// 使用说明：文章列表页（blog.html）会渲染卡片并链接到 post.html?post=slug
// 单篇页（post.html）会根据 ?post=slug 加载并显示完整文章内容

(() => {
  const POSTS_URL = '/assets/data/posts.json';
  const PAGE_SIZE = 9;

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  async function loadPosts() {
    try {
      const res = await fetch(POSTS_URL, {cache: "no-cache"});
      if (!res.ok) throw new Error('加载文章失败');
      const data = await res.json();
      // 保证按时间逆序（最新在前）
      data.sort((a,b) => new Date(b.date) - new Date(a.date));
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  // ----------------- 列表页逻辑 -----------------
  async function renderListPage() {
    const posts = await loadPosts();
    const postsListEl = qs('#postsList');
    const searchInput = qs('#searchInput');
    const tagFiltersEl = qs('#tagFilters');
    const paginationEl = qs('#pagination');

    if (!postsListEl || !searchInput || !tagFiltersEl) return;

    // 收集所有标签
    const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])));

    // 渲染标签筛选按钮
    function createTagButton(tag) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tag';
      btn.textContent = tag;
      btn.dataset.tag = tag;
      return btn;
    }

    tagFiltersEl.innerHTML = '';
    allTags.forEach(t => tagFiltersEl.appendChild(createTagButton(t)));

    let state = {
      query: '',
      tag: null,
      page: 1
    };

    function applyFilters() {
      let filtered = posts.filter(p => {
        if (state.tag && !(p.tags || []).includes(state.tag)) return false;
        if (!state.query) return true;
        const q = state.query.toLowerCase();
        return (p.title && p.title.toLowerCase().includes(q)) ||
               (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
               (p.content && p.content.toLowerCase().includes(q)) ||
               (p.tags && p.tags.join(' ').toLowerCase().includes(q));
      });
      return filtered;
    }

    function renderPagination(total) {
      paginationEl.innerHTML = '';
      const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
      for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'page-btn' + (i === state.page ? ' active' : '');
        btn.textContent = i;
        btn.addEventListener('click', () => {
          state.page = i;
          update();
          window.scrollTo({top: 0, behavior: 'smooth'});
        });
        paginationEl.appendChild(btn);
      }
    }

    function renderCards(items) {
      postsListEl.innerHTML = '';
      if (!items.length) {
        postsListEl.innerHTML = '<p>没有找到相关文章。</p>';
        return;
      }
      items.forEach(p => {
        const card = document.createElement('article');
        card.className = 'post-card glass-card';
        const tagsHtml = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join(' ');
        card.innerHTML = `
          <div>
            <h3>${escapeHtml(p.title)}</h3>
            <div class="post-meta">${formatDate(p.date)} • ${p.readTime || ''}</div>
            <p class="post-excerpt">${escapeHtml(p.excerpt || '')}</p>
          </div>
          <div>
            <div class="post-tags">${tagsHtml}</div>
            <a class="read-more" href="post.html?post=${encodeURIComponent(p.slug)}">阅读全文 →</a>
          </div>
        `;
        postsListEl.appendChild(card);
      });
    }

    function update() {
      const filtered = applyFilters();
      renderPagination(filtered.length);
      const start = (state.page - 1) * PAGE_SIZE;
      const pageItems = filtered.slice(start, start + PAGE_SIZE);
      renderCards(pageItems);
      // 更新标签高亮
      qsa('.tag', tagFiltersEl).forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === state.tag);
      });
    }

    // 事件
    searchInput.addEventListener('input', (e) => {
      state.query = e.target.value.trim();
      state.page = 1;
      update();
    });

    tagFiltersEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag');
      if (!btn) return;
      const clicked = btn.dataset.tag;
      state.tag = (state.tag === clicked) ? null : clicked;
      state.page = 1;
      update();
    });

    update();
  }

  // ----------------- 单篇页逻辑 -----------------
  async function renderPostPage() {
    const params = new URLSearchParams(location.search);
    const slug = params.get('post');
    const container = document.querySelector('.post-container');
    if (!container) return;
    if (!slug) {
      container.innerHTML = `<p>缺少文章标识（post 参数）。返回 <a href="blog.html">文章列表</a>。</p>`;
      return;
    }
    const posts = await loadPosts();
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      container.innerHTML = `<p>未找到文章 '${escapeHtml(slug)}'。返回 <a href="blog.html">文章列表</a>。</p>`;
      return;
    }
    document.title = `${post.title} - Deng DX`;
    const tagsHtml = (post.tags || []).map(t => `<a class="tag" href="blog.html?tag=${encodeURIComponent(t)}">${t}</a>`).join(' ');
    container.innerHTML = `
      <article class="glass-card">
        <header class="post-header">
          <h1>${escapeHtml(post.title)}</h1>
          <div class="post-meta">${formatDate(post.date)} • ${post.readTime || ''}</div>
          <div class="post-tags">${tagsHtml}</div>
        </header>
        <section class="post-content">${post.content || ''}</section>
        <footer style="margin-top:1rem">
          <a href="blog.html" class="read-more">← 返回文章列表</a>
        </footer>
      </article>
    `;
    // 如果 post.content 是 markdown 而不是 HTML，可在此加入简单的解析器或引用第三方库。
  }

  // -------------- 公用与启动 --------------
  function formatDate(d) {
    try {
      const date = new Date(d);
      return date.toLocaleDateString('zh-CN', {year:'numeric', month:'short', day:'numeric'});
    } catch {
      return d;
    }
  }
  function escapeHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Detect page
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#postsList')) {
      renderListPage();
      // 支持通过 URL ?tag=xxx 预设筛选
      const urlTag = new URLSearchParams(location.search).get('tag');
      if (urlTag) {
        // small delay to allow renderListPage 初始化后设置筛选
        setTimeout(() => {
          const input = document.querySelector('#searchInput');
          if (input) input.value = ''; // clear search
          const btns = document.querySelectorAll('#tagFilters .tag');
          btns.forEach(b => {
            if (b.dataset.tag === urlTag) b.click();
          });
        }, 200);
      }
    } else if (document.querySelector('.post-container')) {
      renderPostPage();
    }
  });
})();
