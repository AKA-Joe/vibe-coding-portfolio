const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

// ===== 1. Insert tools section after timeline section (before easter egg) =====
const toolsSection = `
  <!-- ========== 工具 ========== -->
  <section class="section" id="tools">
    <div class="container">
      <h2 class="section-title reveal">· 法器炼丹 ·</h2>

      <!-- 🎙️ Dify — AI 圆桌派 -->
      <div class="terminal-box reveal">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
          </div>
          <span class="terminal-title">🎙️ ai-roundtable.sh — 圆桌派</span>
        </div>
        <div class="terminal-body">
          <div class="terminal-prompt">$ 三位嘉宾已就位，请提问：</div>
          <textarea id="rtInput" placeholder="例：2026年最值得学的编程语言是什么？" style="min-height:80px;"></textarea>
          <div class="terminal-btns">
            <button class="term-btn term-btn-blue" onclick="runRoundtable()">🎤 发起讨论</button>
          </div>
          <div class="terminal-prompt">$ 嘉宾讨论结果：</div>
          <div class="term-output" id="rtOutput">
            <span style="color:var(--text-dim)">_ 等待提问 ...</span>
          </div>
        </div>
      </div>

      <!-- 🔐 Dify — 脱敏加密审查 -->
      <div class="terminal-box reveal" style="margin-top:24px;">
        <div class="terminal-header">
          <div class="terminal-dots">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
          </div>
          <span class="terminal-title">🔐 privacy-mask.sh — 脱敏加密</span>
        </div>
        <div class="terminal-body">
          <div class="terminal-prompt">$ 输入敏感信息：</div>
          <input id="privName" placeholder="姓名" />
          <input id="privPhone" placeholder="手机号" />
          <input id="privIdcard" placeholder="身份证号（可选）" />
          <input id="privRemark" placeholder="备注（可选）" />
          <div class="terminal-btns">
            <button class="term-btn term-btn-blue" onclick="runPrivacy()">🔐 脱敏加密</button>
          </div>
          <div class="terminal-prompt">$ 处理结果：</div>
          <div class="term-output" id="privOutput">
            <span style="color:var(--text-dim)">_ 等待输入 ...</span>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const insertPoint = '  <!-- ========== 🥷 彩蛋元素 ========== -->';
c = c.replace(insertPoint, toolsSection + '\n  ' + insertPoint);
console.log('Tools section inserted');

// ===== 2. Add runRoundtable and runPrivacy functions that call Dify API directly =====
const difyFunctions = `

    // =============================================
    // 🎙️ AI 圆桌派 — 离线版直调 Dify API
    // =============================================
    const DIFY_RT_KEY = 'app-t40DHSq7nyad6bVkx1r1Sjyn';
    const DIFY_PRIV_KEY = 'app-6jpOqIRzijnXDHs7UGIXEDP6';
    const DIFY_URL = 'https://api.dify.ai/v1/workflows/run';

    async function runRoundtable() {
      const input = document.getElementById('rtInput');
      const out = document.getElementById('rtOutput');
      const question = input.value.trim();
      if (!question) { out.innerHTML = '<span style="color:var(--vermillion)">⚠️ 请先输入问题</span>'; return; }
      out.innerHTML = '<span style="color:var(--gold)">⏳ 三位嘉宾讨论中 ...</span>';
      try {
        const res = await fetch(DIFY_URL, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + DIFY_RT_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs: { user_question: question }, response_mode: 'blocking', user: 'roundtable-web' }),
          signal: AbortSignal.timeout(60000),
        });
        const data = await res.json();
        if (!res.ok || data?.data?.status === 'failed') throw new Error(data?.data?.error || '请求失败');
        const result = data.data?.outputs?.result || JSON.stringify(data.data?.outputs);
        out.innerHTML = '<div style="white-space:pre-wrap;color:var(--text);font-family:var(--font-mono);font-size:0.9rem;">' + escapeHtml(result) + '</div>';
      } catch (e) {
        out.innerHTML = '<span style="color:var(--vermillion)">⚠️ ' + escapeHtml(e.message) + '</span>';
      }
    }

    // =============================================
    // 🔐 脱敏加密 — 离线版直调 Dify API
    // =============================================
    async function runPrivacy() {
      const name = document.getElementById('privName').value.trim();
      const phone = document.getElementById('privPhone').value.trim();
      const id_card = document.getElementById('privIdcard').value.trim();
      const remark = document.getElementById('privRemark').value.trim();
      const out = document.getElementById('privOutput');
      if (!name || !phone) { out.innerHTML = '<span style="color:var(--vermillion)">⚠️ 姓名和手机号不能为空</span>'; return; }
      out.innerHTML = '<span style="color:var(--gold)">⏳ 脱敏加密审查中 ...</span>';
      try {
        const res = await fetch(DIFY_URL, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + DIFY_PRIV_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs: { name, phone, id_card, remark }, response_mode: 'blocking', user: 'privacy-web' }),
          signal: AbortSignal.timeout(60000),
        });
        const data = await res.json();
        if (!res.ok || data?.data?.status === 'failed') throw new Error(data?.data?.error || '请求失败');
        const result = data.data?.outputs?.output || JSON.stringify(data.data?.outputs);
        out.innerHTML = '<div style="white-space:pre-wrap;color:var(--text);font-family:var(--font-mono);font-size:0.9rem;">' + escapeHtml(result) + '</div>';
      } catch (e) {
        out.innerHTML = '<span style="color:var(--vermillion)">⚠️ ' + escapeHtml(e.message) + '</span>';
      }
    }
`;

// Insert before the easter egg section
const easterEggTag = '    // =============================================\n    // 🥷 彩蛋系统';
c = c.replace(easterEggTag, difyFunctions + '\n' + easterEggTag);
console.log('Dify functions inserted');

// ===== 3. Update HTML comment at top =====
c = c.replace(
  '如需完整功能（笔记、Dify 工具等），请启动服务端',
  '离线预览版 · Dify 工具直接调用云端 API，无需启动服务端'
);

fs.writeFileSync('public/index.html', c, 'utf8');
console.log('Done - offline-dify branch ready');
