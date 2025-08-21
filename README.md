# DX 的个人主页 🤖

![License](https://img.shields.io/github/license/Dengdxx/Dengdxx.github.io)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)


---


## ✨ 预览

### 🌙 深色主题
<div>
  <img src="docs/images/homepage-dark.png" alt="深色主题主页" width="800">

### ☀️ 浅色主题
<div>
  <img src="docs/images/homepage-light.png" alt="浅色主题主页" width="800">
</div>

### 📝 博客系统
<div>
  <img src="docs/images/blog-page.png" alt="博客页面" width="800">
</div>

### 📱 移动端适配
<div>
  <img src="docs/images/homepage-mobile.png" alt="移动端显示" width="300">
</div>

## 🚀 特性

### 🏠 主页功能
- ✅ **响应式设计** - 完美适配桌面、平板、手机等各种设备
- 🌓 **主题切换** - 支持深色/浅色主题，提供舒适的阅读体验
- 🎯 **项目展示** - 展示个人项目作品，包含详细描述
- 💼 **技能展示** - 专业技能和技术栈的可视化展示
- 📧 **联系方式** - 多种联系方式，方便沟通交流
- ✨ **动画效果** - 流畅的页面动画和交互效果
- 🎨 **玻璃拟态设计** - 现代化的视觉设计风格

### 📖 博客系统
- 📚 **文章管理** - 完整的文章列表、搜索和筛选功能
- 🏷️ **标签系统** - 支持多标签分类，便于内容组织
- 📝 **Markdown 支持** - 完整的 Markdown 语法支持，包括数学公式
- ⚡ **实时预览** - 文章创建时的实时预览功能
- 🔒 **权限控制** - 管理功能的密码保护机制
- 📄 **分页系统** - 优化大量文章的浏览体验
- 🔍 **全文搜索** - 支持按标题、内容、标签搜索

### 🔧 技术特性
- 🚀 **纯前端** - 无需后端服务，基于静态文件部署
- 💾 **本地存储** - 利用 localStorage 保存用户创建的内容
- 📱 **PWA 就绪** - 支持离线访问和移动端安装
- ⚡ **性能优化** - 懒加载、代码分割、资源压缩
- 🌐 **SEO 友好** - 完整的 meta 标签和语义化 HTML

## 🛠️ 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **前端框架** | 原生 JavaScript | ES6+ | 无框架依赖，轻量高效 |
| **样式** | CSS3 | - | 包含动画、渐变、网格布局 |
| **标记语言** | HTML5 | - | 语义化标签，无障碍访问 |
| **Markdown 解析** | [marked.js](https://github.com/markedjs/marked) | 最新版 | Markdown 到 HTML 转换 |
| **数学公式** | MathJax | 3.x | LaTeX 数学公式渲染 |
| **部署** | GitHub Pages | - | 自动化部署和 CI/CD |
| **版本控制** | Git | - | 代码版本管理 |

## 📁 项目结构

```
📁 Dengdxx.github.io/
├── 📄 index.html              # 🏠 主页 - 个人简介和项目展示
├── 📄 blog.html               # 📝 博客列表页 - 文章索引和搜索
├── 📄 post.html               # 📖 文章详情页 - 单篇文章展示
├── 📄 404.html                # ❌ 404 页面 - 自定义错误页
├── 📄 CNAME                   # 🌐 域名配置文件
├── 📄 LICENSE                 # 📜 MIT 开源协议
├── 📄 package.json            # 📦 项目配置文件
├── 📁 assets/                 # 📂 静态资源目录
│   ├── 📁 css/               # 🎨 样式文件
│   │   ├── style.css         # 主页样式（响应式 + 主题）
│   │   └── blog.css          # 博客样式（文章渲染 + 交互）
│   ├── 📁 js/                # ⚙️ JavaScript 脚本
│   │   ├── script.js         # 主页交互脚本
│   │   ├── blog.js           # 博客系统核心逻辑
│   │   └── particles.js      # 背景粒子特效
│   └── 📁 data/              # 🗃️ 数据文件
│       └── posts.json        # 博客文章数据存储
├── 📁 docs/                  # 📚 文档目录
│   └── 📁 images/           # 🖼️ README 图片资源
└── 📄 README.md              # 📖 项目说明文档
```

### 🗂️ 关键文件说明

| 文件/目录 | 功能描述 | 技术要点 |
|----------|----------|----------|
| `index.html` | 个人主页入口 | 响应式布局、SEO优化 |
| `blog.html` | 博客系统主界面 | 动态内容渲染、搜索筛选 |
| `assets/css/` | 样式表集合 | CSS Grid、Flexbox、动画 |
| `assets/js/` | 前端逻辑 | ES6+、模块化、异步处理 |
| `assets/data/` | 数据存储 | JSON格式、本地存储集成 |

## 📝 博客系统

博客系统是本项目的核心功能之一，采用完全前端实现的静态博客架构。

### ✨ 核心特性

#### 📚 文章管理
- **双重存储**：预设文章存储在 `assets/data/posts.json`，用户创建的文章保存在 localStorage
- **完整生命周期**：支持文章的创建、编辑、查看、删除等完整操作
- **批量操作**：支持多选删除、批量标签管理

#### 🔍 搜索与筛选
```javascript
// 支持多种搜索方式
- 标题搜索：直接输入文章标题关键词
- 内容搜索：搜索文章正文内容
- 标签筛选：点击标签快速筛选相关文章
- 组合搜索：标题 + 标签的组合筛选
```

#### 📝 Markdown 编辑器
- **实时预览**：左侧编辑，右侧实时预览效果
- **语法支持**：完整的 Markdown 语法支持
- **数学公式**：集成 MathJax，支持 LaTeX 数学公式
- **代码高亮**：支持多种编程语言的语法高亮
- **单元格结构**：类似 Jupyter Notebook 的单元格编辑方式

#### 🔒 权限控制
```
管理员密码：qweasd123
```
- 文章删除需要密码验证
- 管理功能的访问控制
- 防误删机制

### 🛠️ 技术实现

#### 数据存储策略
```json
{
  "posts": [
    {
      "id": "unique-post-id",
      "title": "文章标题",
      "content": "Markdown 内容",
      "date": "2025-01-15",
      "tags": ["标签1", "标签2"],
      "readTime": "约 5 分钟"
    }
  ]
}
```

#### 核心功能模块
- **`blog.js`**：博客系统核心逻辑
- **`posts.json`**：预设文章数据
- **`marked.js`**：Markdown 解析引擎
- **`MathJax`**：数学公式渲染

#### API 设计
```javascript
// 主要功能函数
loadPosts()          // 加载文章列表
searchPosts(query)   // 搜索文章
filterByTag(tag)     // 按标签筛选
createPost(data)     // 创建新文章
deletePost(id)       // 删除文章
renderMarkdown(md)   // 渲染 Markdown
```

### 🎯 使用指南

#### 创建文章
1. 访问博客页面 → 点击"创建文章"按钮
2. 填写文章标题和标签
3. 在单元格中编辑内容（支持 Markdown）
4. 实时预览效果
5. 保存发布

#### 管理文章
1. 输入管理密码 `qweasd123` 进入管理模式
2. 可以删除不需要的文章
3. 可以编辑现有文章内容

#### 搜索技巧
- 直接输入关键词：搜索标题和内容
- 点击标签：快速筛选该标签的所有文章
- 组合使用：先选择标签，再输入关键词搜索

### 🔄 数据迁移

如需将文章从其他平台迁移到本博客系统：

1. 准备 JSON 格式的文章数据
2. 将数据添加到 `assets/data/posts.json`
3. 确保数据格式符合上述 schema
4. 刷新页面查看迁移结果

## 💻 本地运行

### 🚀 快速开始

由于是纯静态网站，您可以选择以下任一方式运行：

#### 方法 1：直接打开（最简单）
```bash
# 克隆仓库
git clone https://github.com/Dengdxx/Dengdxx.github.io.git

# 进入项目目录
cd Dengdxx.github.io

# 直接在浏览器中打开 index.html
open index.html  # macOS
# 或双击 index.html 文件
```

#### 方法 2：使用 Python 服务器（推荐）
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000

# 访问 http://localhost:8000
```

#### 方法 3：使用 Node.js 服务器
```bash
# 安装 http-server（一次性）
npm install -g http-server

# 启动服务器
npx http-server

# 或者使用 serve
npm install -g serve
serve .
```


## 🎨 主题系统

网站支持深色和浅色两套主题，提供舒适的阅读体验。

### 🌓 主题特性

| 主题 | 适用场景 | 视觉特点 |
|------|----------|----------|
| 🌙 **深色主题** | 夜间阅读、护眼 | 深色背景、柔和光线 |
| ☀️ **浅色主题** | 白天使用、打印友好 | 明亮背景、清晰对比 |

### 🎨 设计语言

- **玻璃拟态 (Glassmorphism)**：半透明背景 + 模糊效果
- **渐变色彩**：多层次渐变，营造深度感
- **流畅动画**：CSS3 动画增强用户体验
- **响应式图标**：emoji + SVG 图标组合

### 💡 主题切换

用户可以通过以下方式切换主题：
- 点击导航栏的主题切换按钮（🌚/🌞）
- 系统会自动记住用户的主题偏好
- 支持系统主题自动跟随（计划功能）

## 📱 响应式设计

网站采用移动优先的响应式设计策略，确保在各种设备上都有良好的用户体验。


### 🎯 移动端优化

- **触摸友好**：按钮大小符合手指点击习惯
- **滑动导航**：移动端汉堡菜单，支持手势操作
- **快速加载**：图片懒加载、CSS/JS 压缩
- **离线访问**：PWA 特性，支持离线浏览


   ```




<!-- 这里可以添加贡献者列表 -->
[![Contributors](https://contrib.rocks/image?repo=Dengdxx/Dengdxx.github.io)](https://github.com/Dengdxx/Dengdxx.github.io/graphs/contributors)

## 📄 许可证

本项目使用 [MIT 许可证](LICENSE) 开源。

```
MIT License

Copyright (c) 2025 Deng DX

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[完整许可证文本请查看 LICENSE 文件]
```


## 📞 联系方式


| 平台 | 链接 | 用途 |
|------|------|------|
| 📧 **邮箱** | [dengdx@tju.edu.cn](mailto:dengdx@tju.edu.cn) 
| 💻 **GitHub** | [https://github.com/Dengdxx](https://github.com/Dengdxx) 
| 🏠 **个人网站** | [https://dengdxx.github.io/](https://dengdxx.github.io/) 
---

<div align="center">
  <h3>🌟 如果这个项目对您有帮助，请给个 Star！ 🌟</h3>
  <p>感谢您的关注和支持！</p>
  
  <img src="https://img.shields.io/github/stars/Dengdxx/Dengdxx.github.io?style=social" alt="GitHub stars">
  <img src="https://img.shields.io/github/forks/Dengdxx/Dengdxx.github.io?style=social" alt="GitHub forks">
  <img src="https://img.shields.io/github/watchers/Dengdxx/Dengdxx.github.io?style=social" alt="GitHub watchers">
</div>
