// Dev harness: replicate searchTools scoring to debug romanized queries.
const path = require("path");
function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const prev = new Array(n + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= m; i++) {
    let carry = prev[0];
    prev[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = Math.min(prev[j] + 1, prev[j - 1] + 1, carry + (a[i - 1] === b[j - 1] ? 0 : 1));
      carry = prev[j];
      prev[j] = tmp;
    }
  }
  return prev[n];
}
const hay = "Gold Price Nepal Gold Price in Nepal Today (आजको सुनको भाउ) — Fine & Tejabi per Tola आजको सुनको भाउ gold price in nepal today gold rate nepal sutno bhau aajako fine gold price nepal per tola silver rate nepal today";
const q = "sun ko bhau";
const tokens = q.split(" ").filter(Boolean);
const words = hay.toLowerCase().split(/\s+/);
let s = 0;
for (const token of tokens) {
  const dist = token.length >= 5 ? 2 : 1;
  for (const w of words) {
    const d = lev(w, token);
    if (d <= dist) { console.log(`token "${token}" ~ word "${w}" lev=${d} (<=${dist})`); s += 3; }
  }
}
console.log("score:", s);

// check the real keyword string as written in content-b
const fs = require("fs");
const src = fs.readFileSync(path.join(__dirname, "../src/data/tools/content-b.ts"), "utf8");
const i = src.indexOf('slug: "gold-price-in-nepal"');
console.log("keyword line:", /keywords:\s*\[[\s\S]*?\]/.exec(src.slice(i, i + 600))[0].replace(/\s+/g, " "));
