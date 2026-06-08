const fs = require('fs');
let c = fs.readFileSync('public/index.html', 'utf8');

// Replace showRandomQuote
c = c.replace(
  "async function showRandomQuote() {\n      try {\n        const res = await fetch('/api/secret/quote');\n        const data = await res.json();",
  "function showRandomQuote() {\n      const data = _Q[Math.floor(Math.random() * _Q.length)];"
);
c = c.replace(
  "async function showSecretManual() {\n      try {\n        const res = await fetch('/api/secret/sword');\n        const data = await res.json();",
  "function showSecretManual() {\n      const data = _T[Math.floor(Math.random() * _T.length)];"
);

fs.writeFileSync('public/index.html', c, 'utf8');
console.log('Done.');
