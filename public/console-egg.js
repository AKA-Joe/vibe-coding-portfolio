/**
 * 🎮 控制台彩蛋 — 按 F12 即可看到
 * 完全独立模块，不依赖任何 DOM 元素，零影响
 */
(function initConsoleEgg() {
  // 只在控制台打印 ASCII art + 快捷键提示
  const gl = [
    'color: #d4a547; font-size: 14px; font-weight: bold;',
    'color: #8a8a8a; font-size: 11px;',
    'color: #00ff41; font-size: 11px;',
  ];
  console.log('%c╔══════════════════════════════════════╗',   gl[0]);
  console.log('%c║    🥷 武林秘籍 · 绝世神功           ║',   gl[0]);
  console.log('%c╠══════════════════════════════════════╣',   gl[0]);
  console.log('%c║                                      ║',   gl[1]);
  console.log('%c║  以键盘为剑，以代码为招               ║',   gl[2]);
  console.log('%c║  独行数字江湖，笑傲代码世界           ║',   gl[2]);
  console.log('%c║                                      ║',   gl[1]);
  console.log('%c║  隐藏秘技：                            ║',   gl[0]);
  console.log('%c║  按 Q 键 → 召唤江湖名言               ║',   gl[2]);
  console.log('%c║  按 M 键 → 开启武林秘籍               ║',   gl[2]);
  console.log('%c║  页面双击 → 触发奇遇                  ║',   gl[2]);
  console.log('%c║  页脚印章悬停 → 神功自现              ║',   gl[2]);
  console.log('%c║                                      ║',   gl[1]);
  console.log('%c╚══════════════════════════════════════╝',   gl[0]);
})();
