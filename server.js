const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 中间件
// ============================================

// 解析 JSON 请求体
app.use(express.json());

// 静态文件服务（CSS、JS、图片等）
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// 👁️ 访问计数器（持久化到 data/visits.json）
// ============================================

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

// ============================================
// API 路由
// ============================================

// 获取个人资料信息（模拟数据，后续可连接数据库）
app.get('/api/profile', (req, res) => {
  res.json({
    name: '空栈工程师',
    title: '造轮子专业户 / Stack Overflow 高级检索师',
    bio: '一只喜欢造轮子的🐒，江湖人称「空栈工程师」。信奉「能跑就别动」，口头禅包括「在我电脑上明明是好的」「重启试试」。曾获「年度最多 bug 产出奖」。',
    skills: ['复制粘贴（带微调）', 'Stack Overflow 检索', '重启大法', 'Ctrl+Z', 'console.log 调试', '造轮子'],
    social: {
      github: 'https://github.com/yourname',
      email: 'yourname@example.com'
    }
  });
});

// ============================================
// 工具：Markdown 笔记转 HTML
// ============================================

app.post('/api/tools/md-to-html', (req, res) => {
  const { markdown } = req.body;
  if (!markdown) {
    return res.status(400).json({ error: '请提供 Markdown 内容' });
  }

  // 极简 Markdown 解析（后续可引入 marked 库）
  const html = markdown
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (m) => {
      if (m.startsWith('<')) return m;
      return `<p>${m}</p>`;
    });

  res.json({ html, raw: markdown });
});

// ============================================
// 🎙️ 工具：Dify — AI 圆桌派（投票决策）
// ============================================

const DIFY_API_KEY_RT = process.env.DIFY_API_KEY_RT || 'app-t40DHSq7nyad6bVkx1r1Sjyn';
const DIFY_API_KEY_PRIV = process.env.DIFY_API_KEY_PRIV || 'app-6jpOqIRzijnXDHs7UGIXEDP6';
const DIFY_BASE_URL = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1';

app.post('/api/tools/roundtable', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: '问题不能为空' });

    const resp = await fetch(`${DIFY_BASE_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY_RT}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { user_question: question },
        response_mode: 'blocking',
        user: 'roundtable-web',
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error(`Dify roundtable error (${resp.status}):`, text);
      return res.status(502).json({ error: `Dify 请求失败 (${resp.status})`, detail: text });
    }

    const data = await resp.json();
    if (data?.data?.status === 'failed') {
      return res.status(502).json({ error: '工作流执行失败', detail: data.data.error });
    }

    res.json({ result: data.data.outputs });
  } catch (err) {
    console.error('Roundtable error:', err);
    res.status(500).json({ error: '圆桌派调用失败', detail: err.message });
  }
});

// ============================================
// 🔐 工具：Dify — 用户信息脱敏加密审查
// ============================================

app.post('/api/tools/privacy', async (req, res) => {
  try {
    const { name, phone, id_card, remark } = req.body;
    if (!name || !phone) return res.status(400).json({ error: '姓名和手机号不能为空' });

    const resp = await fetch(`${DIFY_BASE_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY_PRIV}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: { name, phone, id_card: id_card || '', remark: remark || '' },
        response_mode: 'blocking',
        user: 'privacy-web',
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error(`Dify privacy error (${resp.status}):`, text);
      return res.status(502).json({ error: `Dify 请求失败 (${resp.status})`, detail: text });
    }

    const data = await resp.json();
    if (data?.data?.status === 'failed') {
      return res.status(502).json({ error: '工作流执行失败', detail: data.data.error });
    }

    res.json({ result: data.data.outputs?.output || JSON.stringify(data.data.outputs) });
  } catch (err) {
    res.status(500).json({ error: '脱敏审查调用失败', detail: err.message });
  }
});

// ============================================
// 📊 工具：API 稳定性压力测试
// ============================================

app.post('/api/tools/stability-test', async (req, res) => {
  try {
    const { url, key, models, requests = 10, concurrency = 3, timeout = 30 } = req.body;
    if (!url || !key || !models) return res.status(400).json({ error: 'API地址、Key和模型不能为空' });

    const modelList = models.split(',').map(m => m.trim()).filter(Boolean);
    if (!modelList.length) return res.status(400).json({ error: '至少指定一个模型' });

    const maxR = Math.min(requests, 30);
    const maxC = Math.min(concurrency, 10);
    const results = {};

    async function sendOne(model, id) {
      const start = performance.now();
      let success = false, statusCode = null, errorType = null;
      try {
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: 'Reply with OK.' }],
            max_tokens: 10,
            temperature: 0
          }),
          signal: AbortSignal.timeout(timeout * 1000)
        });
        statusCode = resp.status;
        success = resp.status === 200;
        if (!success) errorType = `HTTP ${resp.status}`;
      } catch (e) {
        errorType = e.name === 'TimeoutError' ? 'Timeout' : e.name || 'Error';
      }
      const latency = (performance.now() - start) / 1000;
      return { id, model, success, latency: +latency.toFixed(3), statusCode, errorType };
    }

    for (const model of modelList) {
      const allResults = [];
      const pool = [];
      let nextId = 0;
      for (let i = 0; i < maxR; i++) {
        pool.push(async () => sendOne(model, nextId++));
      }
      const workers = [];
      for (let w = 0; w < maxC; w++) workers.push(runWorker(pool, allResults));
      await Promise.all(workers);

      const latencies = allResults.filter(r => r.success).map(r => r.latency).sort((a, b) => a - b);
      const total = allResults.length;
      const successCount = allResults.filter(r => r.success).length;
      const rate = total > 0 ? (successCount / total * 100) : 0;
      const errMap = {};
      allResults.filter(r => !r.success).forEach(r => { errMap[r.errorType] = (errMap[r.errorType] || 0) + 1; });
      const avg = latencies.length ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
      const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
      const p95 = latencies[Math.floor(latencies.length * 0.95)] || latencies[latencies.length - 1] || 0;
      const p99 = latencies[Math.floor(latencies.length * 0.99)] || latencies[latencies.length - 1] || 0;

      results[model] = {
        total, successCount, failedCount: total - successCount,
        successRate: +rate.toFixed(1),
        avgLatency: +avg.toFixed(3),
        p50: +p50.toFixed(3), p95: +p95.toFixed(3), p99: +p99.toFixed(3),
        minLatency: +((latencies[0] || 0).toFixed(3)),
        maxLatency: +((latencies[latencies.length - 1] || 0).toFixed(3)),
        errors: errMap,
        details: allResults
      };
    }
    res.json({ models: results });

    async function runWorker(pool, results) {
      while (pool.length) {
        const task = pool.shift();
        const r = await task();
        results.push(r);
      }
    }
  } catch (err) {
    res.status(500).json({ error: '压测执行失败', detail: err.message });
  }
});

// ============================================
// 工具：学习时间线生成
// ============================================

app.get('/api/tools/timeline', (req, res) => {
  const timeline = [
    { year: '2025', event: '参加 AI 青年特训营', desc: '系统学习 Vibe Coding 与 AI 开发工具' },
    { year: '2025', event: '完成首个 Vibe Coding 项目', desc: '从零到一构建个人官网与实用工具' },
    { year: '2026', event: '持续精进', desc: '探索更多 AI 辅助开发的可能性' },
  ];
  res.json(timeline);
});

// ============================================
// 工具：学习笔记管理（文件存储版）
// ============================================

const NOTES_FILE = path.join(__dirname, 'data', 'notes.json');

// 确保数据目录存在
function ensureDataDir() {
  const dir = path.join(__dirname, 'data');
  if (!require('fs').existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true });
  }
  if (!require('fs').existsSync(NOTES_FILE)) {
    require('fs').writeFileSync(NOTES_FILE, '[]', 'utf-8');
  }
}

// 读取所有笔记
function readNotes() {
  ensureDataDir();
  const raw = require('fs').readFileSync(NOTES_FILE, 'utf-8');
  return JSON.parse(raw);
}

// 保存笔记
function saveNotes(notes) {
  ensureDataDir();
  require('fs').writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2), 'utf-8');
}

// 获取所有笔记
app.get('/api/notes', (req, res) => {
  try {
    const notes = readNotes();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: '读取笔记失败', detail: err.message });
  }
});

// 创建笔记
app.post('/api/notes', (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: '标题和内容不能为空' });
    }
    const notes = readNotes();
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.unshift(newNote);
    saveNotes(notes);
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ error: '创建笔记失败', detail: err.message });
  }
});

// 删除笔记
app.delete('/api/notes/:id', (req, res) => {
  try {
    let notes = readNotes();
    const len = notes.length;
    notes = notes.filter(n => n.id !== req.params.id);
    if (notes.length === len) {
      return res.status(404).json({ error: '笔记不存在' });
    }
    saveNotes(notes);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '删除笔记失败', detail: err.message });
  }
});

// ============================================
// 🥷 隐藏彩蛋 — 武林秘籍 API
// ============================================

const WUXIA_QUOTES = [
  { quote: '侠之大者，为国为民', source: '金庸《神雕侠侣》郭靖' },
  { quote: '他强由他强，清风拂山岗；他横由他横，明月照大江', source: '金庸《倚天屠龙记》九阳神功' },
  { quote: '手中无剑，心中有剑', source: '金庸《神雕侠侣》独孤求败' },
  { quote: '问世间，情是何物，直教生死相许', source: '金庸《神雕侠侣》李莫愁' },
  { quote: '人在江湖，身不由己', source: '古龙《三少爷的剑》' },
  { quote: '天下武功，无坚不摧，唯快不破', source: '古龙《小李飞刀》' },
  { quote: '小李飞刀，例不虚发', source: '古龙《多情剑客无情剑》' },
  { quote: '真正的敌人，永远是你自己', source: '古龙' },
  { quote: '剑是冷的，人心更冷', source: '古龙' },
  { quote: '飞雪连天射白鹿，笑书神侠倚碧鸳', source: '金庸 十四字对联' },
  { quote: '侠之大者，为码为民', source: '数字江湖·佚名' },
  { quote: '手中无码，心中有码 — 此乃编程最高境界', source: '数字江湖·佚名' },
  { quote: '他Bug由他Bug，我自一行行', source: '数字江湖·九阳神功改' },
  { quote: '人在职场，CRUD不由己', source: '数字江湖·古龙风' },
  { quote: '天下代码，无坚不摧，唯快不破 — 敏捷开发真谛', source: '数字江湖·古龙风' },
];

app.get('/api/secret/quote', (req, res) => {
  const q = WUXIA_QUOTES[Math.floor(Math.random() * WUXIA_QUOTES.length)];
  res.json(q);
});

app.get('/api/secret/sword', (req, res) => {
  const techniques = [
    { name: '独孤九剑·破气式', desc: '以无招胜有招，破尽天下代码 Bug' },
    { name: '乾坤大挪移·第七层', desc: 'Git Rebase 秘技，移形换影于各分支之间' },
    { name: '六脉神剑·少商剑', desc: 'Vim 快捷键之神，手不离键盘而代码自出' },
    { name: '降龙十八掌·亢龙有悔', desc: '一次 Commit 顶十八次，力拔山兮气盖世' },
    { name: '凌波微步·逍遥游', desc: '在 Docker 容器间腾挪辗转，片叶不沾身' },
    { name: '北冥神功·吸星大法', desc: 'npm install 之理，天下模块尽归我用' },
  ];
  res.json(techniques[Math.floor(Math.random() * techniques.length)]);
});

// ============================================
// SPA 回退路由（所有非 API 请求返回 index.html）
// ============================================

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// 启动服务器
// ============================================

app.listen(PORT, () => {
  console.log(`🚀 个人官网已启动！`);
  console.log(`   本地地址: http://localhost:${PORT}`);
  console.log(`   按 Ctrl+C 停止服务器`);
});