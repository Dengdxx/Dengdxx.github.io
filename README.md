# DX 的个人主页 

![License](https://img.shields.io/github/license/Dengdxx/Dengdxx.github.io)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)


---
---


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


### 🌓 主题特性

| 主题 | 适用场景 | 视觉特点 |
|------|----------|----------|
| 🌙 **深色主题** | 夜间阅读、护眼 | 深色背景、柔和光线 |
| ☀️ **浅色主题** | 白天使用、打印友好 | 明亮背景、清晰对比 |


### 💡 主题切换

通过以下方式切换主题：
- 点击导航栏的主题切换按钮（🌚/🌞）
- 系统会自动记住用户的主题偏好
- 支持系统主题自动跟随（开发中）


### 🔧 技术特性
- 🚀 **纯前端** - 无需后端服务，基于静态文件部署
- 💾 **本地存储** - 利用 localStorage 保存用户创建的内容
- 📱 **PWA 就绪** - 支持离线访问和移动端安装
- ⚡ **性能优化** - 懒加载、代码分割、资源压缩
- 🌐 **SEO 友好** - 完整的 meta 标签和语义化 HTML

## ✨ 效果预览

### 🌙 深色主题
<div>
  <img src="docs/images/homepage-dark.png" alt="深色主题主页" width="800">

### ☀️ 浅色主题
<div>
  <img src="docs/images/homepage-light.png" alt="浅色主题主页" width="800">
</div>


## 🛠️ 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| **前端框架** | 原生 JavaScript | 无框架依赖，轻量高效 |
| **样式** | CSS3 | 包含动画、渐变、网格布局 |
| **标记语言** | HTML5 | 语义化标签，无障碍访问 |
| **Markdown 解析** | [marked.js](https://github.com/markedjs/marked) | Markdown 到 HTML 转换 |
| **数学公式** | MathJax | LaTeX 数学公式渲染 |
| **部署** | GitHub Pages | 自动化部署 |

## 📁 项目结构

```
 Dengdxx.github.io/
├──  index.html              # 🏠 主页 - 个人简介和项目展示
├──  blog.html               # 📝 博客列表页 - 文章索引和搜索
├──  post.html               # 📖 文章详情页 - 单篇文章展示
├──  404.html                # ❌ 404 页面 - 自定义错误页
├──  CNAME                   # 🌐 域名配置文件
├──  LICENSE                 # 📜 MIT 开源协议
├──  package.json            # 📦 项目配置文件
├──  assets/                 # 📂 静态资源目录
│   ├──  css/               # 🎨 样式文件
│   │   ├──  style.css      # 主页样式（响应式 + 主题）
│   │   └──  blog.css        # 博客样式（文章渲染 + 交互）
│   ├──  js/                # ⚙️ JavaScript 脚本
│   │   ├── script.js       # 主页交互脚本
│   │   ├── blog.js         # 博客系统核心逻辑
│   │   └── particles.js      # 背景粒子特效
│   └──  data/              # 🗃️ 数据文件
│       └── posts.json       # 博客文章数据存储
├──  docs/                  # 📚 文档目录
│   └──  images/           # 🖼️ README 图片资源
└──  README.md              # 📖 项目说明文档
```


## 📝 博客系统

博客系统是本项目的核心功能之一，采用完全前端实现的静态博客架构。

### ✨ 核心特性

#### 📚 文章管理

#### 🔍 搜索与筛选


#### 📝 Markdown 编辑器
- **语法支持**：完整的 Markdown, LaTeX 语法支持
- **单元格结构**：类似 Jupyter Notebook 的单元格编辑方式

#### 🔒 权限控制
```
管理员密码：qweasd123
```
- 新增、编辑、删除文章需要密码验证



### 🎯 使用指南

#### 创建文章
1. 在管理模式下访问博客页面 → 点击"创建文章"按钮
2. 填写文章标题和标签
3. 在类似Jupyter Notebook的单元格中编辑和预览内容（支持 Markdown）
4. 保存发布

#### 管理文章
1. 找到隐藏按钮，输入密码进入管理模式
2. 可以删除不需要的文章
3. 可以编辑现有文章内容



## 💻 本地运行

### 🚀 快速开始

由于是纯静态网站，您可以选择以下任一方式运行：

#### 方法 1：直接打开（最简单）
```bash
# 克隆仓库
git clone https://github.com/Dengdxx/Dengdxx.github.io.git

# 进入项目目录
cd Dengdxx.github.io

# 双击 index.html 文件
```

#### 方法 2：使用 Python 服务器
```bash
# Python 3.x
python -m http.server 8000


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


## 📱 响应式设计

网站采用移动优先的响应式设计策略，确保在各种设备上都有良好的用户体验。


### 🎯 移动端优化

- **触摸友好**：按钮大小符合手指点击习惯
- **滑动导航**：移动端汉堡菜单，支持手势操作
- **快速加载**：图片懒加载、CSS/JS 压缩
- **离线访问**：PWA 特性，支持离线浏览




## 📄 许可证

本项目使用 [MIT 许可证](LICENSE) 开源。



## 📞 联系方式


| 平台 | 链接 |
|------|------|
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
