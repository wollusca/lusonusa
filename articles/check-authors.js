#!/usr/bin/env node
/* Checks that static article pages agree with authors.js and articles-data.js.
   Usage: node articles/check-authors.js  (exits 1 on mismatch) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = __dirname;
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'authors.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'articles-data.js'), 'utf8'), ctx);
const authors = ctx.window.LUSONUSA_AUTHORS;
const articles = ctx.window.LUSONUSA_ARTICLES;

let problems = 0;
const fail = (msg) => { problems++; console.error('✗ ' + msg); };

for (const art of articles) {
  for (const key of ['author', 'updatedBy', 'reviewedBy']) {
    if (art[key] && !authors[art[key]]) fail(`${art.id}: ${key} "${art[key]}" is not in authors.js`);
  }
  const file = path.join(dir, art.file);
  if (!fs.existsSync(file)) { fail(`${art.id}: missing ${art.file}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const a = authors[art.author];
  if (!a) continue;

  const ids = [...html.matchAll(/data-author-id="([^"]+)"/g)].map(m => m[1]);
  if (!ids.length || ids.some(id => id !== art.author)) fail(`${art.file}: header data-author-id ${JSON.stringify(ids)} != "${art.author}"`);
  if (!html.includes(`"@id": "https://www.lusonusa.agency/#${art.author}"`)) fail(`${art.file}: JSON-LD Person @id for ${art.author} missing`);
  if (!html.includes(`"name": "${a.name}"`)) fail(`${art.file}: JSON-LD name "${a.name}" missing`);
  if (!html.includes(`"jobTitle": "${a.role}, ${a.title}"`)) fail(`${art.file}: JSON-LD jobTitle should be "${a.role}, ${a.title}"`);
  if (!html.includes(`${a.role} · ${a.title}`.replace(/&/g, '&amp;'))) fail(`${art.file}: header role should read "${a.role} · ${a.title}"`);
  if (art.dateModified && !html.includes(`"dateModified": "${art.dateModified}"`)) fail(`${art.file}: JSON-LD dateModified != ${art.dateModified}`);
  for (const key of ['updatedBy', 'reviewedBy']) {
    if (art[key] && authors[art[key]] && !html.includes(authors[art[key]].name)) fail(`${art.file}: ${key} ${authors[art[key]].name} not shown on page`);
  }
}

if (problems) { console.error(`${problems} problem(s)`); process.exit(1); }
console.log(`✓ ${articles.length} articles consistent with ${Object.keys(authors).length} authors`);
