# Deng DX 个人主页

![GitHub](https://img.shields.io/github/license/Dengdxx/Dengdxx.github.io)
![GitHub last commit](https://img.shields.io/github/last-commit/Dengdxx/Dengdxx.github.io)

> 机器人开发者 Deng DX 的个人主页，专注于机器人技术、人工智能和编程经验分享。

## 简介

这是一个现代化的个人主页网站，采用纯前端技术构建，展示了我的项目作品、技术技能，并包含一个功能完整的博客系统。网站设计响应式，支持深色/浅色主题切换，具有良好的用户体验。

## 特性

### 主页功能
- 响应式设计，适配各种设备屏幕
- 深色/浅色主题切换
- 项目展示区
- 技能展示区
- 联系方式

### 博客系统
- 文章列表展示与搜索功能
- 标签分类与筛选
- Markdown 支持（使用 marked.js 解析器）
- 文章创建功能（基于单元格结构，类似 Jupyter Notebook）
- 文章详情查看
- 文章删除功能（受密码保护）

## 技术栈

- HTML5
- CSS3（含动画和渐变效果）
- JavaScript（ES6+）
- 第三方库：
  - [marked.js](https://github.com/markedjs/marked) - Markdown 解析
- 部署：GitHub Pages

## 项目结构

```
.
├── index.html          # 主页
├── blog.html           # 博客列表页
├── post.html           # 文章详情页
├── 404.html            # 404 页面
├── assets/
│   ├── css/
│   │   ├── style.css   # 主页样式
│   │   └── blog.css    # 博客样式
│   ├── js/
│   │   ├── script.js   # 主页脚本
│   │   ├── blog.js     # 博客脚本
│   │   └── particles.js # 粒子效果脚本
│   └── data/
│       └── posts.json  # 博客文章数据
└── README.md
```

## 博客系统说明

博客系统是一个完全前端实现的静态博客，具有以下特点：

1. **文章存储**：文章数据默认存储在 [assets/data/posts.json](file:///e:/repos/Dengdxx.github.io/assets/data/posts.json) 文件中，新创建的文章会保存在浏览器的 localStorage 中
2. **Markdown 支持**：使用 marked.js 库进行 Markdown 解析，同时提供基础解析器作为备选方案
3. **文章创建**：采用类似 Jupyter Notebook 的单元格结构设计，支持文本单元格和代码单元格
4. **搜索与筛选**：支持按标题、内容、标签搜索，以及按标签筛选
5. **权限控制**：文章删除功能受密码保护（密码：qweasd123）

## 本地运行

由于是纯静态网站，可以直接在浏览器中打开 `index.html` 文件查看，或者使用本地服务器：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js (http-server)
npx http-server

# 使用 VS Code Live Server 插件
```

## 部署

项目通过 GitHub Pages 自动部署，将代码推送到 `main` 分支即可自动更新网站。

## 许可证

[MIT](LICENSE)

## 联系方式

- 邮箱：[你的邮箱]
- GitHub：[https://github.com/Dengdxx](https://github.com/Dengdxx)
