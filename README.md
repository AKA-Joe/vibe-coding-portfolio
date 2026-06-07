# Vibe Coding 实战 - 个人官网

一个使用 **Vibe Coding** 方式（AI 辅助开发）构建的个人官网 + 在线工具集。

## 🚀 快速启动

```bash
# 安装依赖
npm install

# 启动开发服务器（支持热重启）
npm run dev

# 或普通启动
npm start
```

浏览器打开 http://localhost:3000

## 📁 项目结构

```
vibe-coding-portfolio/
├── server.js          # Express 服务器 + API 路由
├── package.json       # 项目配置
├── public/
│   └── index.html     # 前端页面（含 CSS + JS）
└── .gitignore
```

## ✨ 功能特性

- 🌐 响应式个人官网（适配手机/平板/桌面）
- 🌙 深色/浅色主题切换（自动保存偏好）
- 🛠 Markdown → HTML 在线转换工具
- ⚡ API 接口（资料、工具、时间线）
- 🎬 滚动入场动画
- 📱 移动端汉堡菜单

## 🎵 Vibe Coding 工作流

这个项目是用 Claude Code 以 Vibe Coding 方式开发的：

1. **描述需求** → 用自然语言告诉 AI 想要什么
2. **审查代码** → AI 生成后检查是否符合预期
3. **迭代优化** → 指出不足，让 AI 修改
4. **验证运行** → 启动服务器验证功能

## 🛠 自定义指南

修改个人资料：
- 编辑 `public/index.html` 中的 `SKILLS`、`PROJECTS`、`TIMELINE` 数组
- 或调用 `/api/profile` 接口动态更新

添加新工具：
- 后端：在 `server.js` 添加新的路由
- 前端：在 `index.html` 中添加对应 UI
