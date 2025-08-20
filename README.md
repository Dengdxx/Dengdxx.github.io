# 个人主页（GitHub Pages）

这个模板主打酷炫高级但保持简洁：
- 渐变+噪声背景、玻璃拟态卡片
- 暗黑/明亮主题，支持“自动/明/暗”循环切换
- 滚动出现动效、卡片轻微 3D 倾斜
- 无依赖、移动端优先、可读易改

## 使用方法

1) 将本仓库根目录放置以下文件并提交：
- `index.html`
- `styles.css`
- `script.js`
- `favicon.svg`
- `404.html`（可选）

2) GitHub Pages
- 在仓库 Settings → Pages，选择部署 Source 为 `GitHub Actions` 或 `main` 分支（静态文件）。
- 等待几分钟后，即可通过 `https://<你的用户名>.github.io/` 访问。

3) 自定义内容
- `index.html` 中替换：
  - 标题、描述、社交链接、邮箱（搜索注释“可将邮箱/社媒替换为你的真实信息”）
  - “项目与作品”区块中的卡片内容、链接
- 如果有自定义域名，添加 `CNAME` 文件并在 DNS CNAME 解析指向 `<你的用户名>.github.io`。

4) 设计风格微调
- 颜色变量：`styles.css` 顶部 `:root` 中的 `--primary`/`--accent`/`--bg` 等。
- 卡片玻璃强度：`.glass` 的 `backdrop-filter` 与背景透明度。
- 背景动效：`.bg-gradient` 与 `.bg-noise`，可降低透明度或移除动画以提升性能。

5) 性能与可访问性
- 已内置 `skip-link`、可视焦点与对比度优化。
- 保持图片/视频外链或用轻量资源，尽量避免大体积第三方库。
- Lighthouse 分数可通过减少动画/阴影进一步提升。

## 进阶
- 可添加 `blog/` 子目录用于文章，主导航加入 Blog 链接。
- 可接入轻量统计（如自托管）或留言（Issue/Discussion 链接）。
- 若要展示 GitHub 项目列表，可在 `script.js` 中用 fetch GitHub API（注意未授权调用的速率限制）。

有需要我可以直接为你在仓库里创建分支并发起 PR，帮你把模板落地和替换基础文案。