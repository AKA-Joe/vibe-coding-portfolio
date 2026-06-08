const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

// 1. Remove tools section entirely
const toolsStart = c.indexOf('<!-- ========== 工具 ==========');
const toolsEnd = c.indexOf('<!-- ========== 🥷 彩蛋元素', toolsStart);
if (toolsStart > -1 && toolsEnd > -1) {
  c = c.slice(0, toolsStart) + c.slice(toolsEnd);
  console.log('Removed tools section');
}

// 2. Remove nav links to tools and notes (the <li> with #tools and #notes)
c = c.replace(/<li><a href="#tools".*?<\/li>\n?/s, '');
c = c.replace(/<li><a href="#notes".*?<\/li>\n?/s, '');
console.log('Removed nav links');

// 3. Remove convertMarkdown, clearMarkdown functions
c = c.replace(/function convertMarkdown\(\) \{[\s\S]*?^    \}/gm, 'function convertMarkdown() { showToast("📦 离线版本"); }');
c = c.replace(/function clearMarkdown\(\) \{[\s\S]*?^    \}/gm, 'function clearMarkdown() {}');
// 4. Remove loadNotes, createNote, deleteNote
c = c.replace(/function loadNotes\(\) \{[\s\S]*?^    \}/gm, 'function loadNotes() {}');
c = c.replace(/function createNote\(\) \{[\s\S]*?^    \}/gm, 'function createNote() {}');
c = c.replace(/function deleteNote\([\s\S]*?^    \}/gm, 'function deleteNote(id) {}');
// 5. Remove runRoundtable, runPrivacy
c = c.replace(/function runRoundtable\(\) \{[\s\S]*?^    \}/gm, 'function runRoundtable() {}');
c = c.replace(/function runPrivacy\(\) \{[\s\S]*?^    \}/gm, 'function runPrivacy() {}');

// 6. Add console easter egg about the meme
const consoleTag = '// 🥷 Console 彩蛋';
if (c.includes(consoleTag)) {
  const memeMsg = `
  console.log('%c╔══════════════════════════════════════════════╗', 'color: #d4a547');
  console.log('%c║  你为什么直接 commit 到我的 master 分支！！！║', 'color: #ff5f57; font-weight: bold');
  console.log('%c╠══════════════════════════════════════════════╣', 'color: #d4a547');
  console.log('%c║  开个玩笑，这只是个离线预览版                ║', 'color: #8a8a8a');
  console.log('%c║  来都来了，按 Q 键领一句江湖名言再走吧        ║', 'color: #8a8a8a');
  console.log('%c╚══════════════════════════════════════════════╝', 'color: #d4a547');
`;
  c = c.replace(consoleTag, memeMsg + '\n    ' + consoleTag);
}

fs.writeFileSync('public/index.html', c, 'utf8');
console.log('Done');
