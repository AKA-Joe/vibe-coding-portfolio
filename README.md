<div align="center">

```
  ╔══════════════════════════════════════════╗
  ║     ⚔️  剑客·码者 · 个人官网  ⚔️        ║
  ║     Vibe Coding 实战项目                ║
  ╚══════════════════════════════════════════╝
```

**以键盘为剑 · 以代码为招**

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express)
![Dify](https://img.shields.io/badge/Dify-Cloud-1E90FF?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTIiIGZpbGw9IiMxRTkwRkYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjQwIiBmb250LXdlaWdodD0iYm9sZCI+RDwvdGV4dD48L3N2Zz4=)
![Python](https://img.shields.io/badge/Python-3.7%2B-3776AB?logo=python)
![Railway](https://img.shields.io/badge/Railway-Deployed-0B0D0E?logo=railway)
![License](https://img.shields.io/badge/License-MIT-c43a31)

**🌐 [线上演示](https://vibe-coding-portfolio-production-fc72.up.railway.app) · 📖 [完整教程](TUTORIAL.md) · ⬇️ [离线包](portfolio-offline.zip)**

</div>

---

## 📋 项目概览

一个用 **Vibe Coding**（AI 辅助开发）方式构建的个人官网 + 在线工具集。集成 **Dify Agent** 工作流（AI 圆桌派投票决策 + 用户信息脱敏加密），附带独立 Python 安全工具。

<table>
<tr>
<td width="50%">

### 🎨 前端
- **双主题** — 暗夜墨黑 / 宣纸米白
- **🗡️ 飞剑光标** — SVG 内联，40° 旋转
- **🌧️ 代码雨** — Canvas 粒子，双主题自适应
- **⌨️ 打字机** — 逐字动画，9 句程序员梗
- **📱 响应式** — 移动端汉堡菜单 + 底部导航
- **🥷 彩蛋** — 控制台秘籍、名言、快捷键

</td>
<td width="50%">

### ⚙️ 后端 & AI
- **🤖 AI 圆桌派** — 三位 AI 嘉宾投票决策
- **🔐 隐私脱敏** — 姓名/手机号/身份证审查
- **📊 API 压测** — P50/P95/P99 延迟统计
- **📝 笔记系统** — Markdown + CRUD 持久化
- **⚔️ 端口扫描** — Python 多线程 TCP 扫描
- **☁️ Dify 云** — 直接 API 调用，CORS 全开

</td>
</tr>
</table>

---

## 🚀 快速启动

```bash
# 1. 克隆项目
git clone https://github.com/AKA-Joe/vibe-coding-portfolio.git
cd vibe-coding-portfolio

# 2. 安装依赖（仅需 Express）
npm install

# 3. 启动开发服务器（--watch 支持热重启）
npm run dev

# 4. 浏览器打开
open http://localhost:3000
```

> 生产启动：`npm start` · 端口：`3000`（通过 `$PORT` 环境变量覆盖）

---

## 🖼️ 功能预览

<details open>
<summary><b>🎨 前端交互</b></summary>

<br>

| 功能 | 预览 | 实现方式 |
|------|------|---------|
| **飞剑光标** | 移入页面 → 鼠标变成 🗡️ 斜剑 | SVG Data URI `cursor: url(...) 28 6, auto` |
| **打字机动画** | `$> 这需求做不了... 除非加钱 🗡️` | 逐字增删循环 + 小剑飞行动画 |
| **代码雨** | 混合编程符号 `< > / #` + 汉字「剑码侠道」 | Canvas 60fps，双主题自适应颜色 |
| **双主题** | 🌙 暗夜墨黑 / ☀️ 宣纸米白，一键切换 | CSS 变量 `data-theme` + `localStorage` |
| **Toast 通知** | 📢 信息 / ✅ 成功 / ⚠️ 错误，右滑弹出 | CSS transition + JS 动态创建 |
| **滚动动画** | 滚动到区块 → 渐入上浮 | `IntersectionObserver` + `.reveal.visible` |
</details>

<details open>
<summary><b>🤖 Dify AI 工具</b></summary>

<br>

<table>
<tr>
<th width="50%">🎙️ AI 圆桌派</th>
<th width="50%">🔐 脱敏加密审查</th>
</tr>
<tr>
<td>

```
三位 AI 嘉宾 → PM 视角
            → 技术视角  → 投票 → 综合建议
            → 风险视角
```

输入问题 → 三位嘉宾并行讨论 → 输出投票结果

</td>
<td>

```
输入: 张三  13800138000  110101199001011234
                    ↓
脱敏: 张*  138****8000  ************1234
                    ↓
输出: 脱敏结果 + 格式审查报告
```

姓名/手机号/身份证 → 脱敏 → 审查 → 加密输出

</td>
</tr>
</table>
</details>

<details open>
<summary><b>⚔️ 端口扫描器（终端 UI）</b></summary>

```text
┏━━━ Scan Starting ━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Target   45.33.32.156                         ┃
┃  Ports    3                                    ┃
┃  Workers  200     Timeout  2.0s                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━ 📊 扫描统计 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🟢 开放  2  (66.7%)  ████████████████        ┃
┃  🟡 过滤  0  ( 0.0%)                          ┃
┃  🔴 关闭  1  (33.3%)  ████████░               ┃
┃  ⏱️ 用时  2.0 秒   OS: Linux  75%             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

`pip install rich` → `python tools/scanner.py scanme.nmap.org 22,80,443`

</details>

---

## 🔌 API 端点一览

```text
  GET  /api/profile           →  个人资料
  GET  /api/visits            →  访问计数
  POST /api/tools/md-to-html  →  Markdown → HTML
  POST /api/tools/roundtable  →  🤖 Dify AI 圆桌派
  POST /api/tools/privacy     →  🔐 Dify 脱敏审查
  POST /api/tools/stability-test → 📊 API 压测
  GET  /api/tools/timeline    →  学习时间线
  GET/POST/DELETE /api/notes  →  📝 笔记 CRUD
  GET  /api/secret/quote      →  随机江湖名言
  GET  /api/secret/sword      →  随机武林秘籍
```

---

## 🔧 Dify 集成

```javascript
// 后端代理（server.js）—— 推荐方式
POST /api/tools/roundtable  →  DIFY_API: POST /v1/workflows/run
POST /api/tools/privacy     →  DIFY_API: POST /v1/workflows/run

// 离线版直调（offline-dify 分支）
// Dify 云 API 支持 CORS，浏览器可直接调用
fetch('https://api.dify.ai/v1/workflows/run', {
  headers: { Authorization: 'Bearer app-xxx' }
})
```

| 环境变量 | 默认值 | 说明 |
|----------|--------|------|
| `DIFY_API_KEY_RT` | `app-t40DHSq7nyad6bVkx1r1Sjyn` | 圆桌派 API Key |
| `DIFY_API_KEY_PRIV` | `app-6jpOqIRzijnXDHs7UGIXEDP6` | 脱敏加密 API Key |
| `DIFY_BASE_URL` | `https://api.dify.ai/v1` | Dify 云 API 地址 |

---

## 📦 Python 工具

| 工具 | 功能 | 用法 |
|------|------|------|
| `scripts/roundtable.py` | 🎙️ AI 圆桌派 CLI | `python scripts/roundtable.py "我的问题"` |
| `scripts/privacy_tool.py` | 🔐 脱敏加密 CLI | `python scripts/privacy_tool.py 姓名 手机号` |
| `scripts/stability_monitor.py` | 📊 API 压测 | `python scripts/stability_monitor.py --url ...` |
| `tools/scanner.py` | ⚔️ 端口扫描器 | `python tools/scanner.py target 22,80,443` |

> 依赖：`pip install rich requests`

---

## 🌐 部署（Railway）

```bash
# 推送到 GitHub → Railway 自动部署
git push origin main
```

| 步骤 | 说明 |
|------|------|
| **1.** 在 [Railway](https://railway.app) 新建项目 | 选择「Deploy from GitHub repo」 |
| **2.** 授权 GitHub 仓库 | 选择 `AKA-Joe/vibe-coding-portfolio` |
| **3.** 添加环境变量（可选） | `DIFY_API_KEY_RT`, `DIFY_API_KEY_PRIV` |
| **4.** 点击 Deploy | 等待构建完成 ✅ |

> Railway 自动监听 `main` 分支，每次 `git push` 自动重新部署。

---

## 🏷️ 版本谱

```
v1-basic    😠 你为什么直接commit到我的master分支！！！
v2-dify     😰 这次我创feature分支了！
v3-full     😎 算了直接merge回main吧
offline     🏝️ 离线纯展示版（双击 HTML 可用）
offline-dify 🤯 离线版都能调Dify——vibe coding恐怖如斯
```

```bash
# 导出离线包（别人直接双击就能用）
git checkout offline
zip -r portfolio-offline.zip public/
```

---

## 🥷 隐藏彩蛋

| 操作 | 效果 |
|------|------|
| 按 <kbd>Q</kbd> | 随机江湖名言（金庸/古龙/数字江湖魔改版） |
| 按 <kbd>M</kbd> | 武林秘籍（独孤九剑·破Bug式等） |
| 按 <kbd>?</kbd> | 查看所有快捷键 |
| 按 <kbd>T</kbd> | 切换暗夜/宣纸主题 |
| 按 <kbd>Esc</kbd> | 关闭所有弹层 |
| **F12** 开控制台 | 🥷 发现隐藏秘籍 |
| 双击页面 | 触发奇遇！ |
| 悬停页脚印章 | 神功自现 |

---

## 🗂️ 项目结构

```
vibe-coding-portfolio/
├── server.js                # Express 后端（10 个 API 端点）
├── package.json             # 依赖：仅 express
├── TUTORIAL.md              # 完整开发教程（11 阶段）
├── README.md                # ← 你正在看这里
├── public/
│   ├── index.html           # SPA 前端（CSS + JS 全部内联）
│   ├── hero-bg.jpg          # Hero 背景图
│   ├── logo-small.png       # Favicon 48×48
│   ├── logo-watermark.png   # 水印 200×200
│   └── console-egg.js       # F12 控制台彩蛋
├── scripts/                 # Python CLI 工具
│   ├── roundtable.py        #   圆桌派
│   ├── privacy_tool.py      #   脱敏加密
│   └── stability_monitor.py #   API 压测
├── tools/                   # 安全工具
│   ├── scanner.py           #   ⚔️ 端口扫描器
│   └── README.md            #   使用说明
├── data/                    # JSON 持久化
│   ├── notes.json           #   笔记数据
│   └── visits.json          #   访问计数
└── portfolio-offline.zip    # 离线包
```

---

## 📚 学习资源

| 资源 | 说明 |
|------|------|
| 📖 [完整开发教程](TUTORIAL.md) | 从零搭建到部署上线，11 个阶段 |
| 🔧 [Dify 官方文档](https://docs.dify.ai) | 工作流编排 + API 调用指南 |
| 🟢 [Express.js 中文文档](https://expressjs.com/zh-cn/) | Node.js 框架参考 |
| 🎨 [Rich 文档](https://rich.readthedocs.io) | Python 终端 UI 库 |
| 🚂 [Railway 部署文档](https://docs.railway.app) | 云部署平台指南 |
| 🤖 [Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code) | Vibe Coding 工具 |

---

## ⚠️ 法律声明

本项目中端口扫描工具 `tools/scanner.py` 仅可用于：
- **授权的安全测试**
- **CTF 竞赛**
- **本地网络排查**

请遵守当地法律法规，**不要**扫描未经授权的目标。

---

<div align="center">
  <br>
  
  ```
  ╔══════════════════════════════════════════╗
  ║   Built with ❤️ using Vibe Coding        ║
  ║   Claude Code · Express · Dify · Python  ║
  ║   ⚔️  剑客·码者 · 2025-2026              ║
  ╚══════════════════════════════════════════╝
  ```
  
  <br>
  <sub><a href="https://github.com/AKA-Joe/vibe-coding-portfolio">GitHub</a> · 
  <a href="https://vibe-coding-portfolio-production-fc72.up.railway.app">Demo</a> · 
  <a href="TUTORIAL.md">教程</a></sub>
</div>
