# 📚 从零搭建 Vibe Coding 个人官网 + Dify Agent 集成实战教程

> **适用读者：** 有基础编程概念但想系统性学习如何用 AI 辅助（Vibe Coding）开发完整项目的开发者  
> **项目源码：** https://github.com/AKA-Joe/vibe-coding-portfolio  
> **线上演示：** https://vibe-coding-portfolio-production-fc72.up.railway.app  
> **难度：** 🌟🌟（入门→进阶）  
> **耗时预估：** 4-8 小时（按阅读 + 动手节奏）

---

## 📖 教程目录

| 阶段 | 内容 | 难度 |
|------|------|:----:|
| [一、Vibe Coding 概念与准备工作](#阶段一vibe-coding-概念与准备工作) | 环境搭建、项目初始化 | 🌟 |
| [二、搭建 Express 服务器骨架](#阶段二搭建-express-服务器骨架) | Node.js 后端，API 路由设计 | 🌟🌟 |
| [三、构建前端页面 — Hero 区](#阶段三构建前端页面--hero-区) | 书法标题、打字机、飞剑光标、代码雨 | 🌟🌟 |
| [四、技能/项目/时间线模块](#阶段四技能项目时间线模块) | 数据驱动渲染、滚动动画 | 🌟🌟 |
| [五、Telegram 风格工具面板](#阶段五telegram-风格工具面板) | 终端风格 UI，Markdown 转换器 | 🌟🌟🌟 |
| [六、接入 Dify Agent](#阶段六接入-dify-agent) | 创建 Dify 工作流、前后端打通 | 🌟🌟🌟 |
| [七、高级工具开发](#阶段七高级工具开发) | API 压测、笔记管理、Python 工具 | 🌟🌟🌟 |
| [八、主题系统与特效](#阶段八主题系统与特效) | 深色/宣纸双主题、代码雨粒子 | 🌟🌟 |
| [九、部署上线](#阶段九部署上线) | GitHub + Railway 自动部署 | 🌟🌟 |
| [十、版本管理与离线包](#阶段十版本管理与离线包) | Git 标签、分支策略、离线导出 | 🌟🌟 |
| [十一、彩蛋系统](#阶段十一彩蛋系统) | 控制台惊喜、快捷键、名言秘籍 | 🌟 |

---

## 阶段一：Vibe Coding 概念与准备工作

### 1.1 什么是 Vibe Coding？

**Vibe Coding** 是由 Anthropic 提出的 AI 辅助开发理念——**用自然语言「描述需求」，让 AI 生成代码，你负责审阅和迭代**。不再是逐行手写，而是像指挥家一样引导 AI 完成开发。

核心工作流：

```
你描述需求 → AI 生成代码 → 你审查 → 提出修改 → AI 迭代 → 验证运行
```

### 1.2 环境准备

你需要以下工具：

| 工具 | 用途 | 获取方式 |
|------|------|---------|
| **Node.js 18+** | 运行后端服务器 | [nodejs.org](https://nodejs.org) |
| **Claude Code** | Vibe Coding 核心工具 | Anthropic 官网 / IDE 插件 |
| **Git** | 版本控制 | [git-scm.com](https://git-scm.com) |
| **GitHub 账号** | 代码托管 + 部署 | [github.com](https://github.com) |
| **Railway 账号** | 一键部署上线 | [railway.app](https://railway.app) |
| **Dify 账号** | 搭建 AI 工作流 | [cloud.dify.ai](https://cloud.dify.ai) |

### 1.3 初始化项目

```bash
# 创建项目文件夹
mkdir vibe-coding-portfolio
cd vibe-coding-portfolio

# 初始化 Node.js 项目
npm init -y

# 安装 Express 框架
npm install express

# 初始化 Git 仓库
git init

# 创建 .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
```

### 1.4 Claude Code 入门

安装 Claude Code（VS Code 插件或命令行工具）后，你可以像这样开始对话：

```
🤖 用户: "帮我创建一个 Express 服务器，端口 3000，提供静态文件服务"
```

Claude 生成代码，你审查后确认，进入「描述 → 生成 → 审查 → 迭代」循环。

---

## 阶段二：搭建 Express 服务器骨架

### 2.1 创建服务器入口

创建 [server.js](server.js)，这是整个项目的后端核心：

```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());                          // 解析 JSON 请求体
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件

// API 路由将在这里添加...

// SPA 回退 — 所有非 API 请求返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 服务器启动: http://localhost:${PORT}`);
});
```

### 2.2 添加配置脚本

[package.json](package.json):

```json
{
  "name": "vibe-coding-portfolio",
  "description": "个人官网 - Vibe Coding 实战项目",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"   // 文件变动自动重启
  },
  "dependencies": {
    "express": "^4.21.0"
  }
}
```

### 2.3 项目目录结构

```
vibe-coding-portfolio/
├── server.js              # Express 服务器 + 全部 API 路由
├── package.json           # 项目配置与依赖
├── public/                # 前端静态文件
│   ├── index.html         # 单页面应用（含 CSS + JS）
│   ├── hero-bg.jpg        # Hero 区背景图
│   ├── logo-small.png     # 浏览器标签图标（48×48）
│   ├── logo-watermark.png # 页脚水印图（200×200）
│   └── console-egg.js     # 控制台彩蛋
├── scripts/               # Python 辅助工具
│   ├── roundtable.py      # Dify 圆桌派客户端
│   ├── privacy_tool.py    # Dify 脱敏加密客户端
│   └── stability_monitor.py # API 压测脚本
├── tools/                 # 安全工具
│   ├── scanner.py         # 端口扫描器
│   └── README.md          # 工具说明
├── data/                  # JSON 数据持久化
│   ├── notes.json         # 学习笔记
│   └── visits.json        # 访问计数
└── .gitignore
```

### 2.4 第一个 API：访问计数器

[server.js](server.js) 中写入 JSON 文件实现持久化：

```javascript
const VISITS_FILE = path.join(__dirname, 'data', 'visits.json');

function readVisits() {
  try {
    return JSON.parse(require('fs').readFileSync(VISITS_FILE, 'utf-8'));
  } catch { return { count: 0 }; }
}

function saveVisits(v) {
  require('fs').writeFileSync(VISITS_FILE, JSON.stringify(v), 'utf-8');
}

app.get('/api/visits', (req, res) => {
  const v = readVisits();
  v.count += 1;
  saveVisits(v);
  res.json({ count: v.count });
});
```

> 💡 **设计要点：** 使用 JSON 文件而非数据库，是为了零依赖部署。Railway 重启后数据会重置，但做演示站完全够用。

### 2.5 个人资料 API

```javascript
app.get('/api/profile', (req, res) => {
  res.json({
    name: '空栈工程师',
    title: '造轮子专业户 / Stack Overflow 高级检索师',
    bio: '一只喜欢造轮子的🐒，江湖人称「空栈工程师」。',
    skills: ['复制粘贴（带微调）', 'Stack Overflow 检索', '重启大法'],
    social: {
      github: 'https://github.com/yourname',
      email: 'yourname@example.com'
    }
  });
});
```

---

## 阶段三：构建前端页面 — Hero 区

### 3.1 HTML 骨架

所有前端代码集中在 [public/index.html](public/index.html) 中。HTML 结构遵循 SPA 风格 + 锚点导航：

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>剑客·码者 | 个人官网</title>
  <!-- Google Fonts: 书法体 Ma Shan Zheng + 等宽体 JetBrains Mono -->
  <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" sizes="48x48" href="/logo-small.png">
</head>
<body>
  <!-- 导航栏 -->
  <!-- Hero 区 -->
  <!-- 技能 / 项目 / 时间线 -->
  <!-- 工具面板 -->
  <!-- 页脚 -->
</body>
</html>
```

### 3.2 导航栏 — Telegram 风格

顶部导航带汉堡菜单 + 底部导航栏（移动端）：

```html
<nav class="tg-nav">
  <div class="tg-nav-inner">
    <span class="tg-nav-brand">🐒 空栈</span>
    <div class="tg-nav-links" id="tgNavLinks">
      <a href="#skills">技能</a>
      <a href="#projects">项目</a>
      <a href="#timeline">时间线</a>
      <a href="#tools">工具</a>
      <a href="#notes">笔记</a>
    </div>
    <div class="tg-nav-actions">
      <button id="themeToggle" class="tg-theme-btn">☀️</button>
      <button class="tg-hamburger" id="tgHamburger">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</nav>
```

### 3.3 Hero 区布局

Hero 区是用户的第一印象，包含：状态指示器、书法标题、打字机动画、个人简介、行动按钮：

```html
<section class="hero">
  <div class="hero-bg">
    <canvas id="codeRainCanvas"></canvas>  <!-- 背景代码雨 -->
  </div>
  <div class="hero-content">
    <!-- 印章 -->
    <div class="hero-seal"><span class="hero-seal-inner">码</span></div>
    
    <!-- 在线状态 -->
    <div class="hero-status">
      <span class="dot"></span>
      Online · 剑气充盈
    </div>
    
    <!-- 书法标题 -->
    <h1 class="hero-calligraphy">
      剑客<span class="highlight">·</span>码者
    </h1>
    
    <!-- 打字机 -->
    <div class="hero-typewriter-area">
      <span class="prefix">$> </span>
      <span class="hero-typewriter-text" id="heroTyper"></span>
      <span class="sword-cursor">🗡️</span>
    </div>
    
    <p class="hero-bio">
      一只喜欢造轮子的🐒，江湖人称「空栈工程师」...
    </p>
    
    <div class="hero-actions">
      <a href="#projects" class="tg-btn tg-btn-primary">查看项目 →</a>
      <a href="#tools" class="tg-btn tg-btn-outline">体验工具</a>
    </div>
  </div>
  
  <div class="scroll-indicator">
    <span class="arrow">⌄</span>
    SCROLL
  </div>
</section>
```

### 3.4 打字机效果

JavaScript 实现逐字打字和删字循环：

```javascript
// 打字机文本列表
const TYPING_LINES = [
  '这需求做不了... 除非加钱',
  '等等我 git push --force 一下',
  '在我电脑上是好的，要不你来我家看？',
  '能跑就别动，动了就别提 MR',
];

function initTypewriter() {
  const el = document.getElementById('heroTyper');
  let lineIdx = 0, charIdx = 0, isDeleting = false;

  function tick() {
    const line = TYPING_LINES[lineIdx];
    if (!isDeleting) {
      el.textContent = line.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === line.length) {
        setTimeout(() => { isDeleting = true; tick(); }, 2000);
        return;
      }
      setTimeout(tick, 80 + Math.random() * 40);
    } else {
      el.textContent = line.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        lineIdx = (lineIdx + 1) % TYPING_LINES.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 30 + Math.random() * 20);
    }
  }
  tick();
}
```

### 3.5 🗡️ 飞剑光标

把默认鼠标指针替换为 SVG 小剑，旋转 40° 匹配打字机风格：

```css
html {
  cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cg transform='rotate(40, 16, 20)'%3E%3C!-- 剑刃 --%3E%3Cpolygon points='16,2 19,16 16,14 13,16' fill='%23CBD5E1'/%3E%3Cpolygon points='16,2 18,16 16,14' fill='%23F8FAFC'/%3E%3C!-- 剑格 --%3E%3Crect x='7' y='16' width='18' height='3' fill='%23F59E0B'/%3E%3C!-- 剑柄 --%3E%3Crect x='12' y='19' width='8' height='8' fill='%23451A03'/%3E%3C!-- 剑穗 --%3E%3Ccircle cx='16' cy='28' r='2.5' fill='%23F59E0B'/%3E%3C/g%3E%3C/svg%3E") 28 6, auto;
}
```

> ⚡ **技巧：** 使用 `data:image/svg+xml` 内联 SVG，无需外部图片文件，减少 HTTP 请求。`28 6` 是光标热点（hotspot）坐标。

同时打字机尾部的小剑动画：

```css
.sword-cursor {
  display: inline-block;
  animation: sword-fly 1.2s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(0,255,65,0.5));
}
@keyframes sword-fly {
  0%, 100% { transform: translateY(0) rotate(-15deg); }
  35% { transform: translateY(-3px) rotate(-8deg); }
  50% { opacity: 0.35; transform: translateY(1px) rotate(-22deg); }
}
```

### 3.6 代码雨 Canvas 粒子

借鉴《黑客帝国》风格，混合编程符号和汉字：

```javascript
function initCodeRain() {
  const canvas = document.getElementById('codeRainCanvas');
  const ctx = canvas.getContext('2d');

  const CHARS = [
    '剑','码','侠','道','令','境',
    '<','>','/','#','@','*','&','%',
    'const','fn','=>','let','var',
    '江湖','乾坤','无极',
    '0','1','0','1',
  ];

  // 每列一个 drop 对象
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const theme = document.documentElement.getAttribute('data-theme');

    for (const d of drops) {
      d.y += d.speed;
      // 到达底部后重置到顶部
      if (d.y > canvas.height) { d.y = -20; }

      // 根据字符类型和主题着色
      const isCoding = /[<>\/#@*&%]/.test(d.char);
      const isChinese = /[一-鿿]/.test(d.char);

      let color;
      if (isCoding) {
        color = theme === 'light'
          ? `rgba(0, 130, 60, ${alpha})`    // 浅色模式用深绿
          : `rgba(0, 255, 65, ${alpha})`;    // 深色模式用荧光绿
      } else if (isChinese) {
        color = theme === 'light'
          ? `rgba(100, 70, 35, ${alpha * 1.6})`  // 浅色用茶褐
          : `rgba(212, 165, 71, ${alpha * 1.5})`; // 深色用金色
      }
      ctx.fillStyle = color;
      ctx.fillText(d.char, d.x, d.y);
    }
    requestAnimationFrame(draw);
  }
  draw();
}
```

> 🔑 **关键设计：** 代码雨自动适应深浅主题。浅色（宣纸）模式下，代码雨变深色不透明，保证在浅色背景上清晰可见。

---

## 阶段四：技能/项目/时间线模块

### 4.1 数据驱动渲染

所有展示数据定义为 JavaScript 数组，用 `innerHTML` 动态渲染：

```javascript
const SKILLS = [
  { name: '复制粘贴（带微调）', level: 95 },
  { name: 'Stack Overflow 高级检索师', level: 92 },
  { name: '重启大法（物理+魔法）', level: 90 },
  { name: 'Ctrl+Z 救世主', level: 88 },
  { name: '造轮子（多边形、椭圆形、不规则形）', level: 85 },
  { name: 'Git --force 专业户', level: 80 },
  { name: 'console.log 驱动的调试艺术', level: 78 },
  { name: '代码屎山建筑师（国家一级）', level: 75 },
];

const PROJECTS = [
  { emoji: '🏗️', title: '公司内部脚手架系统', desc: '又造了一个轮子，这次是三角形的', tags: ['造轮子', '自嗨', '三角形'] },
  { emoji: '🪹', title: '空栈优化计划', desc: '写了个脚本递归调用自己，把服务器栈撑爆', tags: ['递归', '栈溢出'] },
  { emoji: '🥚', title: 'Bug 孵化器', desc: '每次提交都能触发同事的 CodeReview 表情包', tags: ['bug', '表情包'] },
  { emoji: '🎯', title: '自动化甩锅系统', desc: '用 if-else 自动判断故障责任方，准确率 0%', tags: ['甩锅', 'AI'] },
  { emoji: '🎭', title: '生产环境降级演练', desc: '自信上线 → 光速回滚 → 假装无事发生', tags: ['回滚', '影帝'] },
];

// 渲染函数
function renderSkills() {
  document.getElementById('skillsList').innerHTML = SKILLS.map(s => `
    <div class="skill-item reveal">
      <div class="skill-info">
        <span class="skill-name">${s.name}</span>
        <span class="skill-level">${s.level}%</span>
      </div>
      <div class="skill-bar"><div class="skill-fill" style="width:${s.level}%"></div></div>
    </div>
  `).join('');
}
```

### 4.2 滚动入场动画（IntersectionObserver）

```javascript
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target); // 只触发一次
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
```

CSS 配合：

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### 4.3 时间线

```html
<div class="timeline" id="timelineList">
  <!-- JS 渲染：年 → 事件 → 描述 -->
</div>
```

---

## 阶段五：Telegram 风格工具面板

### 5.1 终端风格 UI

五个工具卡片统一使用「终端模拟器」风格：

```html
<div class="terminal-box reveal">
  <div class="terminal-header">
    <div class="terminal-dots">
      <span class="terminal-dot red"></span>
      <span class="terminal-dot yellow"></span>
      <span class="terminal-dot green"></span>
    </div>
    <span class="terminal-title">📄 md-to-html.sh — 80×24</span>
  </div>
  <div class="terminal-desc">
    将 Markdown 快速渲染为 HTML 预览。
    支持 <code>#</code> 标题、<code>**粗体**</code>、<code>- 列表</code> 等语法。
  </div>
  <div class="terminal-body">
    <div class="terminal-prompt">$ cat > input.md << EOF</div>
    <textarea id="mdInput" placeholder="# 在此输入 Markdown"></textarea>
    <div class="terminal-btns">
      <button class="term-btn term-btn-blue" onclick="convertMarkdown()">▶ 转换</button>
      <button class="term-btn" onclick="clearMarkdown()">✕ 清屏</button>
    </div>
    <div class="terminal-prompt">$ node render.js — 输出:</div>
    <div class="term-output" id="mdOutput"></div>
  </div>
</div>
```

### 5.2 Markdown 转换 — 纯前端

无需后端请求，完全在浏览器端处理：

```javascript
function convertMarkdown() {
  const input = document.getElementById('mdInput').value;
  const html = input
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (m) => m.startsWith('<') ? m : `<p>${m}</p>`);

  document.getElementById('mdOutput').innerHTML = html;
  showToast('🗡️ 剑气化形 · 转换成功', 'success');
}
```

### 5.3 Toast 通知系统

Telegram 风格的右滑弹出通知：

```javascript
function showToast(message, type = 'info', duration = 2600) {
  const container = document.getElementById('toastContainer');
  const icons = { info: '📢', success: '✅', error: '⚠️' };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span>${message}`;
  container.appendChild(toast);

  // 触发过渡动画
  requestAnimationFrame(() => toast.classList.add('show'));

  // 自动移除
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}
```

---

## 阶段六：接入 Dify Agent

### 6.1 什么是 Dify？

[Dify](https://cloud.dify.ai) 是一个开源的 LLM 应用开发平台，可以：

- **创建工作流（Workflow）** — 可视化编排多个 LLM 调用
- **集成多种模型** — GPT、Claude、DeepSeek 等
- **提供 API** — 将 AI 能力嵌入你的应用

### 6.2 创建第一个工作流：AI 圆桌派

**设计思路：** 用户提问 → 三位 AI 嘉宾（PM视角、技术视角、风险视角）独立讨论 → 综合投票 → 输出决策建议

**Dify 工作流节点：**
1. **开始** — 接收 `user_question`
2. **LLM 节点 × 3** — 分别扮演 PM/技术/风险角色，并行回答
3. **代码节点** — 汇总三个回答，提取共识和分歧
4. **结束** — 输出 `result` 字段

> 💡 Dify 操作步骤：登录 cloud.dify.ai → 工作室 → 新建空白应用 → 选择「工作流」→ 拖拽节点编排 → 发布 → API 访问 → 获取 API Key

### 6.3 创建第二个工作流：脱敏加密审查

**设计思路：** 接收敏感信息 → 脱敏处理（替换中间位） → 加密（AES） → 格式审查 → 输出

**输入参数：** `name`, `phone`, `id_card`, `remark`

### 6.4 后端代理 API

前端不能直接调用 Dify API（跨域和密钥安全问题），通过在 `server.js` 中做代理转发：

```javascript
const DIFY_API_KEY_RT = process.env.DIFY_API_KEY_RT || 'app-xxx';
const DIFY_BASE_URL = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1';

app.post('/api/tools/roundtable', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: '问题不能为空' });

  try {
    const resp = await fetch(`${DIFY_BASE_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY_RT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { user_question: question },
        response_mode: 'blocking',    // 阻塞模式：等全部执行完再返回
        user: 'roundtable-web',
      }),
      signal: AbortSignal.timeout(120000), // 2 分钟超时
    });

    const data = await resp.json();
    res.json({ result: data.data.outputs });
  } catch (err) {
    res.status(500).json({ error: '圆桌派调用失败', detail: err.message });
  }
});
```

> ⚠️ **注意：** Dify API 路径是 `POST /v1/workflows/run`，但基地址已含 `/v1`，所以代理 URL 拼接成 `https://api.dify.ai/v1/workflows/run`——不要重复写 `/v1`。

### 6.5 前端对接

```javascript
async function runRoundtable() {
  const question = document.getElementById('rtInput').value.trim();
  if (!question) return;
  
  document.getElementById('rtOutput').innerHTML = '<span style="color:var(--gold)">⏳ 讨论中 ...</span>';

  const res = await fetch('/api/tools/roundtable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  
  const data = await res.json();
  const result = data.result?.result || JSON.stringify(data.result);
  document.getElementById('rtOutput').innerHTML = `<pre>${escapeHtml(result)}</pre>`;
  showToast('🎙️ 讨论结束', 'success');
}
```

### 6.6 离线版直接调用 Dify API

在[离线版分支](https://github.com/AKA-Joe/vibe-coding-portfolio/tree/offline-dify)中，由于没有后端代理，前端直接调用 Dify API（Dify 云版支持 CORS）：

```javascript
async function runRoundtable() {
  const DIFY_URL = 'https://api.dify.ai/v1/workflows/run';
  const DIFY_KEY = 'app-t40DHSq7nyad6bVkx1r1Sjyn';

  const res = await fetch(DIFY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DIFY_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: { user_question: question },
      response_mode: 'blocking',
      user: 'roundtable-web',
    }),
    signal: AbortSignal.timeout(60000),
  });

  const data = await res.json();
  return data.data.outputs.result;
}
```

> 🔑 **关键发现：** `api.dify.ai` 的 CORS 头 `Access-Control-Allow-Origin: *` 允许任意来源跨域调用，这是离线版能直接调用的前提。

---

## 阶段七：高级工具开发

### 7.1 API 稳定性压力测试

多模型并发压测，统计 P50/P95/P99 延迟：

**后端逻辑（[server.js](server.js#L173)）：**

```javascript
app.post('/api/tools/stability-test', async (req, res) => {
  const { url, key, models, requests = 10, concurrency = 3 } = req.body;
  const modelList = models.split(/[,，、]/).filter(Boolean);
  
  const results = {};
  
  for (const model of modelList) {
    // 用 Worker Pool 模式控制并发
    const allResults = [];
    const pool = Array.from({ length: Math.min(requests, 200) }, (_, i) => i);
    
    async function runWorker() {
      while (pool.length) {
        const id = pool.shift();
        // 发送请求，记录延迟和状态
        const start = performance.now();
        try {
          const resp = await fetch(url, { /* ... */ });
          allResults.push({ success: resp.ok, latency: (performance.now()-start)/1000 });
        } catch (e) {
          allResults.push({ success: false, error: e.name });
        }
      }
    }
    
    // 启动 N 个并发 worker
    await Promise.all(Array.from({ length: Math.min(concurrency, 50) }, () => runWorker()));
    
    // 计算统计指标
    results[model] = {
      total, successCount, successRate,
      avgLatency, p50, p95, p99, minLatency, maxLatency,
      errors: errMap,
    };
  }
  res.json({ models: results });
});
```

### 7.2 笔记管理（CRUD）

文件存储的增删查：

```javascript
// GET /api/notes — 读取所有笔记
// POST /api/notes — 创建笔记 { title, content, tags }
// DELETE /api/notes/:id — 删除笔记
```

数据格式 ([data/notes.json](data/notes.json))：

```json
[
  {
    "id": "1710000000000",
    "title": "Vibe Coding 学习笔记",
    "content": "今天学了如何用 Claude Code...",
    "tags": ["VibeCoding", "AI"],
    "createdAt": "2025-03-10T...",
    "updatedAt": "2025-03-10T..."
  }
]
```

### 7.3 Python 辅助工具

项目附带 3 个 Python CLI 工具：

| 工具 | 功能 | 命令 |
|------|------|------|
| [scripts/roundtable.py](scripts/roundtable.py) | 🎙️ AI 圆桌派 CLI | `python scripts/roundtable.py "你的问题"` |
| [scripts/privacy_tool.py](scripts/privacy_tool.py) | 🔐 脱敏加密 CLI | `python scripts/privacy_tool.py 姓名 手机号` |
| [tools/scanner.py](tools/scanner.py) | ⚔️ 端口扫描器 | `python tools/scanner.py example.com 22,80` |

这些工具直接调用 Dify API，可在服务器外独立使用。

---

## 阶段八：主题系统与特效

### 8.1 CSS 变量驱动双主题

通过 `data-theme` 属性切换，所有颜色使用 CSS 自定义属性：

```css
/* 深色主题（默认） */
:root {
  --bg: #0a0a0a;
  --bg-card: #141414;
  --text: #e8e4d8;
  --text-secondary: #8a8a8a;
  --tg-green: #00ff41;
  --gold: #d4a547;
  --vermillion: #c43a31;
}

/* 浅色主题 — 宣纸米白 */
[data-theme="light"] {
  --bg: #f5f0e8;
  --bg-card: #faf6ee;
  --text: #2c2416;
  --text-secondary: #6b5d4a;
  --tg-green: #15994b;
  --gold: #b8942e;
}
```

切换逻辑：

```javascript
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);  // 记住偏好
}
```

### 8.2 Hero 背景 — 径向聚光灯

```css
.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 55% at 50% 45%,
    rgba(10,10,10,0.15) 0%,
    rgba(10,10,10,0.50) 40%,
    rgba(10,10,10,0.88) 75%,
    rgba(5,5,5,1) 100%
  );
  z-index: 1;
}
```

这样在背景图上方形成一个椭圆形渐变遮罩，文字区域最亮，边缘渐暗，类似舞台聚光灯效果。

---

## 阶段九：部署上线

### 9.1 GitHub 托管代码

```bash
# 关联远程仓库
git remote add origin git@github.com:你的用户名/vibe-coding-portfolio.git

# 推送到 GitHub
git push -u origin main
```

### 9.2 Railway 一键部署

[Railway](https://railway.app) 是一个 PaaS 平台，支持 GitHub 自动部署：

1. 登录 Railway，点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 授权选择你的仓库
4. 添加环境变量：
   - `PORT=3000`（Railway 会自动分配，这条通常不需要）
5. 点击 Deploy

> ✅ **自动部署：** 后续每次 `git push origin main`，Railway 会自动拉取最新代码并重启服务。

### 9.3 部署后的检查清单

- [ ] 访问公网 URL，页面正常渲染
- [ ] 主题切换正常
- [ ] API 接口可访问（`/api/profile`, `/api/visits`）
- [ ] Dify 工具正常调用（圆桌派 / 脱敏加密）
- [ ] 移动端适配正常
- [ ] 飞剑光标显示

---

## 阶段十：版本管理与离线包

### 10.1 Git 标签策略

```bash
# 创建带梗的标签
git tag -a v1-basic -m "😠 你为什么直接commit到我的master分支！！！——v1-basic：仅个人官网"
git tag -a v2-dify -m "😰 这次我创feature分支了！——v2-dify：个人官网 + Dify功能"
git tag -a v3-full -m "😎 算了直接merge回main吧——v3-full：完全版"

# 推送标签
git push origin --tags
```

### 10.2 分支策略

```
main ─── 完全版（带 Express 服务器 + Dify 代理）
offline ─── 纯前端离线版（双击 HTML 可用，无后端、无工具）
offline-dify ─── 离线版 + 直调 Dify API
```

### 10.3 导出离线包

```bash
# 切换到离线分支
git checkout offline

# 导出 public/ 目录
zip -r portfolio-offline.zip public/
```

别人双击 `public/index.html` 就能浏览，不需要装任何东西。

**离线版在线演示：** 参考 [portfolio-offline.zip](portfolio-offline.zip)（已导出到项目根目录）。

### 10.4 版本回退

```bash
# 回退到 v1-basic（纯官网版）
git checkout v1-basic

# 或者创建新分支基于旧版本
git checkout -b my-legacy-version v1-basic
```

---

## 阶段十一：彩蛋系统

### 11.1 控制台彩蛋

F12 打开开发者工具即可看到：

```javascript
console.log('%c╔══════════════════════════════════════╗', consoleStyle);
console.log('%c║   🥷  发现隐藏秘籍！                 ║', consoleGreen);
console.log('%c║  按 Q 键 → 随机江湖名言              ║', consoleGreen);
console.log('%c║  按 M 键 → 武林秘籍                  ║', consoleGreen);
console.log('%c║  页面双击 → 触发奇遇                  ║', consoleGreen);
console.log('%c║  页脚印章悬停 → 神功自现              ║', consoleGreen);
console.log('%c╚══════════════════════════════════════╝', consoleStyle);
```

### 11.2 快捷键系统

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === '?') toggleShortcuts();   // 查看所有快捷键
  if (e.key === 'q' || e.key === 'Q') showRandomQuote();  // 名言
  if (e.key === 'm' || e.key === 'M') showSecretManual(); // 秘籍
  if (e.key === 'Escape') closeAllModals();
  if (e.key === 't' || e.key === 'T') toggleTheme();      // 主题切换
});
```

### 11.3 武林秘籍 API

```javascript
// 随机名言
app.get('/api/secret/quote', (req, res) => {
  const quotes = [
    { quote: '侠之大者，为国为民', source: '金庸《神雕侠侣》郭靖' },
    { quote: '手中无剑，心中有剑', source: '金庸《神雕侠侣》独孤求败' },
    // ... 修改版程序员江湖名言
    { quote: '他Bug由他Bug，我自一行行', source: '数字江湖·九阳神功改' },
    { quote: '人在职场，CRUD不由己', source: '数字江湖·古龙风' },
    { quote: '天下代码，无坚不摧，唯快不破 — 敏捷开发真谛', source: '数字江湖·古龙风' },
  ];
  res.json(quotes[Math.floor(Math.random() * quotes.length)]);
});
```

### 11.4 页脚彩蛋 — 版本梗

在 `offline` 分支中，Console 直接用 `console.log` 输出 meme 文字。在 `main` 分支中，页脚有个版本的 Toast 通知：

```html
<div class="footer-meme" onclick="showToast('😠 你为啥直接 commit 到我的 master 分支啊！！！\n\n📜 版本沿革：\nv1-basic 😠 ...\nv2-dify  😰 ...\nv3-full  😎 ...','info',5000)">
  <span class="meme-trigger">🔖 版本谱</span>
</div>
```

---

## 🎯 进阶挑战

如果你已完成以上所有内容，可以尝试以下进阶方向：

| 挑战 | 难度 | 内容 |
|------|:----:|------|
| **加数据库** | 🌟🌟🌟 | 用 SQLite 替代 JSON 文件存储笔记和访问数 |
| **SSE 实时推送** | 🌟🌟🌟 | Dify 支持流式输出（`response_mode: streaming`），实现逐字显示 |
| **多语言** | 🌟🌟 | 添加英文/日文切换，用 `data-lang` 属性控制 |
| **WebSocket 聊天** | 🌟🌟🌟🌟 | 接入真实的 LLM Chatbot（参考 `/api/tools/roundtable` 的模式） |
| **Dify Chatbot 嵌入** | 🌟🌟 | 用 Dify 的「嵌入模式」直接插入对话式 AI 助手 |
| **PWA 离线支持** | 🌟🌟 | 添加 Service Worker，让官网支持离线缓存 |
| **GitHub Actions CI** | 🌟🌟 | 每次推送自动跑测试、构建、部署 |

---

## 🛟 常见问题

### Q: Dify 调用返回 404？

检查 API URL 是否重复了 `/v1`：

```
❌ https://api.dify.ai/v1/v1/workflows/run
✅ https://api.dify.ai/v1/workflows/run
```

### Q: API 请求超时？

Dify 工作流执行可能较慢（尤其多 LLM 节点并行时），建议将超时设为 120 秒以上：

```javascript
signal: AbortSignal.timeout(120000)
```

### Q: 离线版双击 HTML 不能调 Dify？

确认 CORS 支持：
- 浏览器 F12 → Network 标签 → 检查是否有跨域错误
- Dify 云版 `api.dify.ai` 已配置 `Access-Control-Allow-Origin: *`

### Q: 部署到 Railway 后图片不显示？

检查：
1. 文件名是否含中文（Railway 可能 URL 编码异常）→ 建议用英文名
2. 静态文件路径区分大小写（`hero-bg.jpg` vs `hero-BG.jpg`）

---

## 📚 参考资源

- [Dify 官方文档](https://docs.dify.ai) — 工作流编排指南
- [Express.js 中文文档](https://expressjs.com/zh-cn/) — Node.js 框架
- [Railway 部署文档](https://docs.railway.app) — 云部署平台
- [Claude Code 文档](https://docs.anthropic.com/en/docs/claude-code) — Vibe Coding 工具
- [项目 GitHub 仓库](https://github.com/AKA-Joe/vibe-coding-portfolio) — 完整源码参考

---

> **最后更新：** 2026 年 6 月  
> **作者寄语：** Vibe Coding 的核心不是让 AI 替你做一切，而是让你从「怎么写代码」解放出来，专注于「写什么代码」。  
> 用这个教程搭建你的第一个 AI 辅助项目，然后不断迭代——**能跑就别动，动了就推上线！** 🚀