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

  // 保存文章到localStorage（由于静态网站限制，实际项目中需要后端支持）
  async function savePosts(posts) {
    try {
      // 在真实环境中，这里应该发送请求到后端API
      localStorage.setItem('blogPosts', JSON.stringify(posts));
      return true;
    } catch (e) {
      console.error('保存文章失败:', e);
      return false;
    }
  }

  // 获取文章数据（优先从localStorage获取）
  async function getPosts() {
    // 检查localStorage中是否有文章数据
    const localPosts = localStorage.getItem('blogPosts');
    if (localPosts) {
      try {
        const posts = JSON.parse(localPosts);
        posts.sort((a,b) => new Date(b.date) - new Date(a.date));
        return posts;
      } catch (e) {
        console.error('解析本地文章数据失败:', e);
      }
    }
    
    // 如果localStorage中没有，则从默认文件获取
    return await loadPosts();
  }

  // Global functions for admin operations
  let showEditForm, handleEditSubmit;
  
  // Admin mode state
  let isAdminMode = false;
  const ADMIN_PASSWORD = 'qweasd123';

  // Admin mode toggle functionality
  function toggleAdminMode() {
    if (!isAdminMode) {
      // 尝试进入管理员模式
      const password = prompt('请输入管理员密码以进入管理模式:');
      if (!password) return;
      
      if (password !== ADMIN_PASSWORD) {
        alert('密码错误，无法进入管理模式。');
        return;
      }
      
      // 进入管理员模式
      isAdminMode = true;
      document.body.classList.add('admin-mode');
      const adminToggle = document.getElementById('adminToggle');
      if (adminToggle) {
        adminToggle.textContent = '退出管理';
        adminToggle.style.backgroundColor = '#e74c3c';
      }
      
      alert('已进入管理员模式');
    } else {
      // 退出管理员模式
      isAdminMode = false;
      document.body.classList.remove('admin-mode');
      const adminToggle = document.getElementById('adminToggle');
      if (adminToggle) {
        adminToggle.textContent = '管理模式';
        adminToggle.style.backgroundColor = '#2c3e50';
      }
      
      // 隐藏创建文章表单
      const createPostForm = qs('#createPostForm');
      const createPostBtn = qs('#createPostBtn');
      if (createPostForm && createPostBtn) {
        createPostForm.style.display = 'none';
        createPostBtn.style.display = 'block';
      }
    }
  }

  // 验证管理员权限
  function verifyAdminAccess(operation) {
    if (!isAdminMode) {
      alert('请先进入管理员模式才能执行此操作。');
      return false;
    }
    return true;
  }

  // 生成文章slug
  function generateSlug(title) {
    // 如果包含中文字符，直接使用encodeURIComponent
    if (/[\u4e00-\u9fff]/.test(title)) {
      return encodeURIComponent(title.replace(/\s+/g, '-'));
    }
    // 对于英文标题，使用原来的处理方式
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Markdown转HTML
  function markdownToHtml(markdown) {
    if (typeof marked === 'undefined') {
      // 如果marked库未加载，使用增强的基础解析器
      return basicMarkdownToHtml(markdown);
    }
    return marked.parse(markdown);
  }

  // 增强的基础Markdown解析器
  function basicMarkdownToHtml(markdown) {
    let html = markdown;
    
    // 处理代码块 (```code```)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 处理行内代码 (`code`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 处理图片 (![alt](src))
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');
    
    // 处理链接 ([text](url))
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // 处理标题 (# Header)
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // 处理粗体和斜体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // 处理引用
    html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
    
    // 处理无序列表 - 修复列表渲染问题
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    // 将连续的li元素组合成ul
    html = html.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gm, function(match) {
      return '<ul>' + match + '</ul>';
    });
    
    // 处理段落 - 修复段落识别问题
    const lines = html.split('\n');
    const processedLines = [];
    let inList = false;
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 检查是否在代码块中
      if (line.includes('<pre><code>')) inCodeBlock = true;
      if (line.includes('</code></pre>')) inCodeBlock = false;
      
      // 检查是否在列表中
      if (line.includes('<ul>') || line.includes('<li>')) inList = true;
      if (line.includes('</ul>')) inList = false;
      
      // 如果是空行或者在代码块/列表中，直接添加
      if (line.trim() === '' || inCodeBlock || inList || 
          line.includes('<h') || line.includes('<blockquote') || 
          line.includes('<img') || line.includes('<pre>')) {
        processedLines.push(line);
      } else if (line.trim().length > 0) {
        // 非空行且不在特殊块中，包装成段落
        if (!line.includes('<p>')) {
          processedLines.push('<p>' + line.trim() + '</p>');
        } else {
          processedLines.push(line);
        }
      } else {
        processedLines.push(line);
      }
    }
    
    return processedLines.join('\n');
  }
  
  // 单元格相关函数
  function createTextCell(content = '') {
    const cellId = 'cell-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.type = 'text';
    cell.dataset.id = cellId;
    cell.innerHTML = `
      <div class="cell-header">
        <div class="cell-type">文本单元格</div>
        <div class="cell-actions">
          <button type="button" class="preview-cell" title="预览渲染">👁️</button>
          <button type="button" class="move-up" title="上移">↑</button>
          <button type="button" class="move-down" title="下移">↓</button>
          <button type="button" class="delete-cell" title="删除">✕</button>
        </div>
      </div>
      <div class="cell-content">
        <textarea placeholder="在此输入Markdown文本...">${content}</textarea>
        <div class="cell-preview" style="display: none;"></div>
      </div>
    `;
    return cell;
  }

  function createCodeCell(content = '') {
    const cellId = 'cell-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.type = 'code';
    cell.dataset.id = cellId;
    cell.innerHTML = `
      <div class="cell-header">
        <div class="cell-type">代码单元格</div>
        <div class="cell-actions">
          <button type="button" class="preview-cell" title="预览渲染">👁️</button>
          <button type="button" class="move-up" title="上移">↑</button>
          <button type="button" class="move-down" title="下移">↓</button>
          <button type="button" class="delete-cell" title="删除">✕</button>
        </div>
      </div>
      <div class="cell-content">
        <textarea placeholder="在此输入代码...">${content}</textarea>
        <div class="cell-preview" style="display: none;"></div>
      </div>
    `;
    return cell;
  }

  function renderCellContent(content, type) {
    if (type === 'text') {
      return markdownToHtml(content);
    } else if (type === 'code') {
      return `<pre><code>${escapeHtml(content)}</code></pre>`;
    }
    return escapeHtml(content);
  }

  // ----------------- 列表页逻辑 -----------------
  async function renderListPage() {
    const posts = await getPosts();
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
            <div class="card-actions">
              <a class="read-more" href="post.html?post=${encodeURIComponent(p.slug)}">阅读全文 →</a>
              <button class="admin-button cta-button blog-button edit-post-btn" data-slug="${p.slug}" style="margin-left: 0.5rem; padding: 0.3rem 0.6rem; font-size: 0.85rem;">编辑</button>
            </div>
          </div>
        `;
        postsListEl.appendChild(card);
      });
      
      // 为编辑按钮添加事件监听器
      qsa('.edit-post-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (!verifyAdminAccess('编辑')) return;
          
          const slug = btn.dataset.slug;
          const post = items.find(p => p.slug === slug);
          if (post) {
            showEditForm(post);
          }
        });
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

    // 添加创建文章功能
    const createPostBtn = qs('#createPostBtn');
    const createPostForm = qs('#createPostForm');
    const postForm = qs('#postForm');
    const cancelPostBtn = qs('#cancelPostBtn');
    const cellsContainer = qs('#cellsContainer');
    const addTextCellBtn = qs('#addTextCell');
    const addCodeCellBtn = qs('#addCodeCell');
    const adminToggle = qs('#adminToggle');

    // 管理员模式切换
    if (adminToggle) {
      adminToggle.addEventListener('click', toggleAdminMode);
    }

    // 编辑文章功能
    showEditForm = function(post) {
      // 创建编辑表单（如果不存在）
      let editForm = qs('#editPostForm');
      if (!editForm) {
        editForm = document.createElement('section');
        editForm.id = 'editPostForm';
        editForm.className = 'glass-card admin-button';
        editForm.style.display = 'none';
        editForm.style.marginBottom = '2rem';
        
        editForm.innerHTML = `
          <h2>编辑文章</h2>
          <form id="editForm">
            <input type="hidden" id="editPostSlug" />
            <div class="form-group">
              <label for="editPostTitle">标题</label>
              <input type="text" id="editPostTitle" class="form-control" required>
            </div>
            
            <div class="form-group">
              <label for="editPostTags">标签（用逗号分隔）</label>
              <input type="text" id="editPostTags" class="form-control" placeholder="例如: 机器人, AI, 教程">
            </div>
            
            <div class="form-group">
              <label for="editPostExcerpt">摘要</label>
              <textarea id="editPostExcerpt" class="form-control" rows="3"></textarea>
            </div>
            
            <div class="form-group">
              <label>内容 (单元格结构)</label>
              <div id="editCellsContainer">
                <!-- 单元格将在这里动态添加 -->
              </div>
              <div class="cell-actions">
                <button type="button" id="editAddTextCell" class="cta-button blog-button">添加文本单元格</button>
                <button type="button" id="editAddCodeCell" class="cta-button blog-button">添加代码单元格</button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="editPostReadTime">阅读时间</label>
              <input type="text" id="editPostReadTime" class="form-control" placeholder="例如: 约 3 分钟">
            </div>
            
            <div class="form-buttons">
              <button type="submit" class="cta-button">更新文章</button>
              <button type="button" id="cancelEditBtn" class="cta-button blog-button">取消</button>
            </div>
          </form>
        `;
        
        createPostForm.parentNode.insertBefore(editForm, createPostForm.nextSibling);
        
        // 为编辑表单添加事件监听器
        const editFormEl = qs('#editForm', editForm);
        const cancelEditBtn = qs('#cancelEditBtn', editForm);
        const editCellsContainer = qs('#editCellsContainer', editForm);
        const editAddTextCellBtn = qs('#editAddTextCell', editForm);
        const editAddCodeCellBtn = qs('#editAddCodeCell', editForm);

        if (cancelEditBtn) {
          cancelEditBtn.addEventListener('click', () => {
            editForm.style.display = 'none';
            editFormEl.reset();
            editCellsContainer.innerHTML = '';
          });
        }

        if (editAddTextCellBtn) {
          editAddTextCellBtn.addEventListener('click', () => {
            const textCell = createTextCell();
            editCellsContainer.appendChild(textCell);
            attachCellEventListeners(textCell);
          });
        }

        if (editAddCodeCellBtn) {
          editAddCodeCellBtn.addEventListener('click', () => {
            const codeCell = createCodeCell();
            editCellsContainer.appendChild(codeCell);
            attachCellEventListeners(codeCell);
          });
        }

        if (editFormEl) {
          editFormEl.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleEditSubmit(e);
          });
        }
      }
      
      // 填充表单数据
      qs('#editPostSlug').value = post.slug;
      qs('#editPostTitle').value = post.title;
      qs('#editPostTags').value = (post.tags || []).join(', ');
      qs('#editPostExcerpt').value = post.excerpt || '';
      qs('#editPostReadTime').value = post.readTime || '';
      
      // 解析现有内容到单元格
      const editCellsContainer = qs('#editCellsContainer');
      editCellsContainer.innerHTML = '';
      
      // 简单的内容解析 - 假设内容是HTML格式
      if (post.content) {
        // 创建一个文本单元格包含所有内容
        const textCell = createTextCell(post.content);
        editCellsContainer.appendChild(textCell);
        attachCellEventListeners(textCell);
      }
      
      editForm.style.display = 'block';
      createPostForm.style.display = 'none';
      editForm.scrollIntoView({ behavior: 'smooth' });
    };

    handleEditSubmit = async function(e) {
      const editFormEl = e.target;
      const originalSlug = qs('#editPostSlug').value;
      const title = qs('#editPostTitle').value.trim();
      const tags = qs('#editPostTags').value.split(',').map(t => t.trim()).filter(t => t);
      const excerpt = qs('#editPostExcerpt').value.trim();
      const readTime = qs('#editPostReadTime').value.trim();

      if (!title) {
        alert('标题不能为空');
        return;
      }

      // 获取所有单元格内容
      const cells = qsa('.cell', qs('#editCellsContainer'));
      if (cells.length === 0) {
        alert('请至少添加一个内容单元格');
        return;
      }

      // 构建文章内容
      let content = '';
      cells.forEach(cell => {
        const type = cell.dataset.type;
        const textarea = qs('textarea', cell);
        const cellContent = textarea ? textarea.value.trim() : '';
        
        if (cellContent) {
          if (type === 'text') {
            content += renderCellContent(cellContent, 'text') + '\n';
          } else if (type === 'code') {
            content += renderCellContent(cellContent, 'code') + '\n';
          }
        }
      });

      if (!content) {
        alert('文章内容不能为空');
        return;
      }

      try {
        // 获取当前文章列表
        const currentPosts = await getPosts();
        
        // 找到并更新文章
        const postIndex = currentPosts.findIndex(p => p.slug === originalSlug);
        if (postIndex === -1) {
          alert('未找到要编辑的文章');
          return;
        }

        // 更新文章对象
        const updatedPost = {
          ...currentPosts[postIndex],
          title,
          slug: generateSlug(title), // 重新生成slug以防标题改变
          tags,
          excerpt,
          readTime: readTime || '约 1 分钟',
          content: content,
          date: currentPosts[postIndex].date // 保持原创建日期
        };

        // 如果slug改变了，需要处理
        if (updatedPost.slug !== originalSlug) {
          // 可能需要更新URL引用，但这里简化处理
          console.warn('文章slug已改变，从', originalSlug, '到', updatedPost.slug);
        }

        // 替换文章
        currentPosts[postIndex] = updatedPost;

        // 保存文章
        const saved = await savePosts(currentPosts);
        if (saved) {
          // 重置表单
          editFormEl.reset();
          qs('#editPostForm').style.display = 'none';
          qs('#editCellsContainer').innerHTML = '';
          
          // 更新页面
          state.page = 1;
          update();
          
          alert('文章更新成功！');
        } else {
          alert('文章保存失败，请重试');
        }
      } catch (error) {
        console.error('更新文章时出错:', error);
        alert('更新文章时发生错误，请重试');
      }
    };

    if (createPostBtn && createPostForm && postForm) {
      createPostBtn.addEventListener('click', () => {
        if (!verifyAdminAccess('创建文章')) return;
        
        createPostForm.style.display = 'block';
        createPostBtn.style.display = 'none';
        // 隐藏编辑表单（如果存在）
        const editForm = qs('#editPostForm');
        if (editForm) {
          editForm.style.display = 'none';
        }
      });

      cancelPostBtn.addEventListener('click', () => {
        createPostForm.style.display = 'none';
        createPostBtn.style.display = 'block';
        postForm.reset();
        // 清空单元格容器
        cellsContainer.innerHTML = '';
      });

      // 添加单元格功能
      if (addTextCellBtn && addCodeCellBtn && cellsContainer) {
        addTextCellBtn.addEventListener('click', () => {
          const textCell = createTextCell();
          cellsContainer.appendChild(textCell);
          attachCellEventListeners(textCell);
        });

        addCodeCellBtn.addEventListener('click', () => {
          const codeCell = createCodeCell();
          cellsContainer.appendChild(codeCell);
          attachCellEventListeners(codeCell);
        });
      }

      // 为单元格添加事件监听器
      function attachCellEventListeners(cell) {
        const deleteBtn = qs('.delete-cell', cell);
        const moveUpBtn = qs('.move-up', cell);
        const moveDownBtn = qs('.move-down', cell);
        const previewBtn = qs('.preview-cell', cell);
        const textarea = qs('textarea', cell);
        const preview = qs('.cell-preview', cell);

        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => {
            cell.remove();
          });
        }

        if (moveUpBtn) {
          moveUpBtn.addEventListener('click', () => {
            const prev = cell.previousElementSibling;
            if (prev) {
              cell.parentNode.insertBefore(cell, prev);
            }
          });
        }

        if (moveDownBtn) {
          moveDownBtn.addEventListener('click', () => {
            const next = cell.nextElementSibling;
            if (next) {
              cell.parentNode.insertBefore(next, cell);
            }
          });
        }

        // 添加预览功能
        if (previewBtn && textarea && preview) {
          let isPreviewMode = false;
          
          previewBtn.addEventListener('click', () => {
            if (!isPreviewMode) {
              // 切换到预览模式
              const content = textarea.value;
              const cellType = cell.dataset.type;
              const renderedContent = renderCellContent(content, cellType);
              
              preview.innerHTML = renderedContent;
              preview.style.display = 'block';
              textarea.style.display = 'none';
              
              previewBtn.textContent = '📝';
              previewBtn.title = '编辑模式';
              isPreviewMode = true;
              
              // 为代码块添加复制按钮（如果是文本单元格且包含代码块）
              if (cellType === 'text') {
                addCopyButtonsToCodeBlocks();
              }
              
              // 触发 MathJax 渲染（如果可用）
              if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
                MathJax.typesetPromise([preview]);
              }
            } else {
              // 切换回编辑模式
              preview.style.display = 'none';
              textarea.style.display = 'block';
              
              previewBtn.textContent = '👁️';
              previewBtn.title = '预览渲染';
              isPreviewMode = false;
            }
          });
        }

        // 自动调整textarea高度
        if (textarea) {
          textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
          });
          
          // 初始化时调整高度
          setTimeout(() => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
          }, 0);
        }
      }

      postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!verifyAdminAccess('创建文章')) return;

        // 获取表单数据
        const title = qs('#postTitle').value.trim();
        const tags = qs('#postTags').value.split(',').map(t => t.trim()).filter(t => t);
        const excerpt = qs('#postExcerpt').value.trim();
        const readTime = qs('#postReadTime').value.trim();

        if (!title) {
          alert('标题不能为空');
          return;
        }

        // 获取所有单元格内容
        const cells = qsa('.cell', cellsContainer);
        if (cells.length === 0) {
          alert('请至少添加一个内容单元格');
          return;
        }

        // 构建文章内容
        let content = '';
        cells.forEach(cell => {
          const type = cell.dataset.type;
          const textarea = qs('textarea', cell);
          const cellContent = textarea ? textarea.value.trim() : '';
          
          if (cellContent) {
            if (type === 'text') {
              content += renderCellContent(cellContent, 'text') + '\n';
            } else if (type === 'code') {
              content += renderCellContent(cellContent, 'code') + '\n';
            }
          }
        });

        if (!content) {
          alert('文章内容不能为空');
          return;
        }

        // 创建新文章对象
        const newPost = {
          title,
          slug: generateSlug(title),
          date: new Date().toISOString().split('T')[0],
          tags,
          excerpt,
          readTime: readTime || '约 1 分钟',
          content: content
        };

        // 添加到文章列表
        const updatedPosts = [newPost, ...posts];

        // 保存文章
        const saved = await savePosts(updatedPosts);
        if (saved) {
          // 重置表单
          postForm.reset();
          createPostForm.style.display = 'none';
          createPostBtn.style.display = 'block';
          cellsContainer.innerHTML = ''; // 清空单元格
          
          // 更新页面
          state.page = 1;
          update();
          
          alert('文章创建成功！');
        } else {
          alert('文章保存失败，请重试');
        }
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

  // 为代码块添加复制按钮
  function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock, index) => {
      const pre = codeBlock.parentElement;
      
      // 避免重复添加按钮
      if (pre.querySelector('.copy-button')) return;
      
      // 创建复制按钮
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = '复制';
      copyButton.title = '复制代码到剪贴板';
      
      // 为按钮添加样式
      Object.assign(copyButton.style, {
        position: 'absolute',
        top: '8px',
        right: '8px',
        padding: '4px 8px',
        fontSize: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'inherit',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        zIndex: '10'
      });
      
      // 设置pre元素为相对定位以便按钮绝对定位
      pre.style.position = 'relative';
      
      // 添加点击事件
      copyButton.addEventListener('click', async () => {
        try {
          const text = codeBlock.textContent;
          await navigator.clipboard.writeText(text);
          
          // 临时改变按钮文本以显示成功状态
          const originalText = copyButton.textContent;
          copyButton.textContent = '已复制!';
          copyButton.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
          
          setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }, 2000);
        } catch (err) {
          console.error('复制失败:', err);
          // 备用方案：创建临时textarea并复制
          const textarea = document.createElement('textarea');
          textarea.value = codeBlock.textContent;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          
          copyButton.textContent = '已复制!';
          setTimeout(() => {
            copyButton.textContent = '复制';
          }, 2000);
        }
      });
      
      // 鼠标悬停效果
      copyButton.addEventListener('mouseenter', () => {
        copyButton.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      });
      
      copyButton.addEventListener('mouseleave', () => {
        copyButton.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      });
      
      pre.appendChild(copyButton);
    });
  }

  // ----------------- 单篇页逻辑 -----------------
  async function renderPostPage() {
    const params = new URLSearchParams(location.search);
    const slug = params.get('post');
    const container = document.querySelector('.post-container');
    if (!container) return;
    if (!slug) {
      container.innerHTML = `
        <div class="admin-controls" style="text-align: center; margin-bottom: 1rem;">
          <button id="adminToggle" class="cta-button blog-button" style="background-color: #2c3e50; margin-bottom: 1rem;">管理模式</button>
        </div>
        <p>缺少文章标识（post 参数）。返回 <a href="blog.html">文章列表</a>。</p>
      `;
      return;
    }
    
    const posts = await getPosts();
    const post = posts.find(p => p.slug === slug);
    if (!post) {
      container.innerHTML = `
        <div class="admin-controls" style="text-align: center; margin-bottom: 1rem;">
          <button id="adminToggle" class="cta-button blog-button" style="background-color: #2c3e50; margin-bottom: 1rem;">管理模式</button>
        </div>
        <p>未找到文章 '${escapeHtml(slug)}'。返回 <a href="blog.html">文章列表</a>。</p>
      `;
      return;
    }
    
    document.title = `${post.title} - Deng DX`;
    const tagsHtml = (post.tags || []).map(t => `<a class="tag" href="blog.html?tag=${encodeURIComponent(t)}">${t}</a>`).join(' ');
    container.innerHTML = `
      <div class="admin-controls" style="text-align: center; margin-bottom: 1rem;">
        <button id="adminToggle" class="cta-button blog-button" style="background-color: #2c3e50; margin-bottom: 1rem;">管理模式</button>
      </div>
      <article class="glass-card">
        <header class="post-header">
          <h1>${escapeHtml(post.title)}</h1>
          <div class="post-meta">${formatDate(post.date)} • ${post.readTime || ''}</div>
          <div class="post-tags">${tagsHtml}</div>
        </header>
        <section class="post-content">${post.content || ''}</section>
        <footer style="margin-top:1rem">
          <a href="blog.html" class="read-more">← 返回文章列表</a>
          <button id="editPostBtn" class="cta-button admin-button" style="margin-left: 1rem; background-color: #3498db; border: none;">编辑文章</button>
          <button id="deletePostBtn" class="cta-button admin-button" style="margin-left: 1rem; background-color: #e74c3c; border: none;">删除文章</button>
        </footer>
      </article>
    `;
    
    // 设置管理员模式切换
    const adminToggle = document.getElementById('adminToggle');
    if (adminToggle) {
      adminToggle.addEventListener('click', toggleAdminMode);
    }
    
    // 触发 MathJax 渲染
    if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
      MathJax.typesetPromise();
    } else if (typeof MathJax !== 'undefined' && MathJax.Hub) {
      // 对于 MathJax v2
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
    }
    
    // 为代码块添加复制按钮
    addCopyButtonsToCodeBlocks();
    
    // 添加编辑文章功能
    const editBtn = document.getElementById('editPostBtn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        if (!verifyAdminAccess('编辑文章')) return;
        // 跳转到博客页面并触发编辑
        window.location.href = `blog.html?edit=${encodeURIComponent(slug)}`;
      });
    }
    
    // 添加删除文章功能
    const deleteBtn = document.getElementById('deletePostBtn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (!verifyAdminAccess('删除文章')) return;
        
        if (confirm(`确定要删除文章"${post.title}"吗？此操作不可撤销。`)) {
          try {
            // 从文章列表中过滤掉当前文章
            const updatedPosts = posts.filter(p => p.slug !== slug);
            
            // 保存更新后的文章列表
            const saved = await savePosts(updatedPosts);
            if (saved) {
              alert('文章删除成功！');
              // 跳转到博客列表页面
              window.location.href = 'blog.html';
            } else {
              alert('删除失败，请重试。');
            }
          } catch (error) {
            console.error('删除文章时出错:', error);
            alert('删除文章时发生错误，请重试。');
          }
        }
      });
    }
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
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Detect page
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('#postsList')) {
      renderListPage();
      // 支持通过 URL ?tag=xxx 预设筛选
      const urlTag = new URLSearchParams(location.search).get('tag');
      if (urlTag) {
        const tagBtn = document.querySelector(`.tag[data-tag="${urlTag}"]`);
        if (tagBtn) tagBtn.click();
      }
      
      // 支持通过 URL ?edit=slug 直接编辑文章
      const editSlug = new URLSearchParams(location.search).get('edit');
      if (editSlug) {
        // 需要先进入管理员模式，然后找到文章并开始编辑
        setTimeout(async () => {
          const password = prompt('请输入管理员密码以编辑文章:');
          if (!password) return;
          
          if (password !== ADMIN_PASSWORD) {
            alert('密码错误，无法编辑文章。');
            return;
          }
          
          // 进入管理员模式
          isAdminMode = true;
          document.body.classList.add('admin-mode');
          const adminToggle = document.getElementById('adminToggle');
          if (adminToggle) {
            adminToggle.textContent = '退出管理';
            adminToggle.style.backgroundColor = '#e74c3c';
          }
          
          // 查找文章并显示编辑表单
          const posts = await getPosts();
          const post = posts.find(p => p.slug === editSlug);
          if (post) {
            showEditForm(post);
          } else {
            alert('未找到要编辑的文章');
          }
        }, 100);
      }
    } else if (document.querySelector('.post-container')) {
      renderPostPage();
    }
  });
})();
