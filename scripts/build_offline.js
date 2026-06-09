#!/usr/bin/env node
/**
 * 构建离线版 index.html
 * 以 main 分支为基础，只剔除工具/笔记/Dify，保留全部 UI 特效
 *
 * 用法: node scripts/build_offline.js
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'public', 'index.html');
const OUTPUT = path.join(__dirname, '..', 'public', 'index.html');

let html = fs.readFileSync(INPUT, 'utf-8');
const origLen = html.length;

// ==================== 1. 移除工具 section HTML ====================
// 从 tools section 开始到下一个平级 section
const toolSectionMatch = html.match(
  /<!-- ========== 工具 ========== -->[\s\S]*?(?=<!-- ========== 笔记 ========== -->|<!-- ========== 页脚 ========== -->)/
);
if (toolSectionMatch) {
  html = html.replace(toolSectionMatch[0], '');
  console.log(`✅ 移除工具 section (${toolSectionMatch[0].length} chars)`);
} else {
  console.log('⚠️ 未找到工具 section');
}

// ==================== 2. 移除笔记 section HTML ====================
const noteSectionMatch = html.match(
  /<!-- ========== 笔记 ========== -->[\s\S]*?(?=<!-- ========== 页脚 ========== -->|<!-- 回到顶部 -->)/
);
if (noteSectionMatch) {
  html = html.replace(noteSectionMatch[0], '');
  console.log(`✅ 移除笔记 section (${noteSectionMatch[0].length} chars)`);
} else {
  console.log('⚠️ 未找到笔记 section');
}

// ==================== 3. 移除导航的 tools / notes 链接 ====================
html = html.replace(/<li>\s*<a href="#tools".*?\/a>\s*<\/li>/g, '');
html = html.replace(/<li>\s*<a href="#notes".*?\/a>\s*<\/li>/g, '');

// ==================== 4. 移除 JS 中的工具函数 ====================
// 策略: 用行号精确匹配函数边界
const lines = html.split('\n');
const TO_REMOVE = [
  // 要移除的函数的起始行关键词
  'async function loadNotes()',
  'async function createNote()',
  'async function deleteNote(id)',
  'function convertMarkdown()',
  'function clearMarkdown()',
  'async function runRoundtable()',
  'async function runPrivacy()',
  'async function runStabilityTest()',
];

// 找到这些函数并移除（从定义行到下一个同缩进函数定义或同级注释）
const removeRanges = [];
for (const fnName of TO_REMOVE) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(fnName)) {
      const indent = lines[i].match(/^(\s*)/)[1];
      const startLine = i;
      // 查找函数结束: 下一个同缩进的函数定义 OR function OR 同级的 // === 注释
      let endLine = startLine + 1;
      while (endLine < lines.length) {
        const line = lines[endLine];
        const lineIndent = line.match(/^(\s*)/)[1];
        // 遇到下一个同缩进的函数或 function 定义就停
        if (
          endLine > startLine + 1 &&
          lineIndent.length <= indent.length &&
          !line.trim().startsWith('//') &&
          !line.trim().startsWith('*') &&
          line.trim() !== '' &&
          (line.trim().startsWith('async function') || line.trim().startsWith('function ') || line.trim().startsWith('}')) &&
          line.trim() === '}'
        ) {
          // 如果是单独的 }，且缩进同级别
          if (line.trim() === '}' && lineIndent.length === indent.length) {
            endLine = endLine + 1;
            break;
          }
        }
        endLine++;
      }
      removeRanges.push({ start: startLine, end: endLine, name: fnName });
      break;
    }
  }
}

// 从后往前删除，避免行号偏移
removeRanges.sort((a, b) => b.start - a.start);
for (const r of removeRanges) {
  const removed = lines.splice(r.start, r.end - r.start);
  const placeholder = `  // [离线版移除] ${r.name.match(/(\w+)\(/)?.[1] || r.name}`;
  lines.splice(r.start, 0, placeholder);
  console.log(`✅ 移除函数 ${r.name} (${removed.length} lines)`);
}

html = lines.join('\n');

// ==================== 5. 移除 loadNotes() 调用 ====================
html = html.replace(/^\s*loadNotes\(\);/gm, '  // loadNotes() [离线版移除]');

// ==================== 6. 移除体验工具按钮的 tools 跳转 ====================
html = html.replace(/<a href="#tools".*?体验工具.*?<\/a>/g, '');

// ==================== 7. 添加离线版标记 ====================
html = html.replace(
  '<html lang="zh-CN" data-theme="dark">',
  '<html lang="zh-CN" data-theme="dark">\n<!-- 离线版（已移除工具/Dify/笔记），双击即可浏览 -->'
);

html = html.replace(
  '<title>剑客·码者 | 个人官网</title>',
  '<title>剑客·码者（离线版）</title>'
);

// ==================== 写入 ====================
fs.writeFileSync(OUTPUT, html, 'utf-8');
const shrunk = origLen - html.length;
console.log(`\n📦 离线版构建完成！`);
console.log(`   原始大小: ${(origLen / 1024).toFixed(0)}KB`);
console.log(`   离线大小: ${(html.length / 1024).toFixed(0)}KB`);
console.log(`   缩减: ${(shrunk / 1024).toFixed(0)}KB (${(shrunk / origLen * 100).toFixed(1)}%)`);