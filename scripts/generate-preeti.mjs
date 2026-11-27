import fs from "node:fs";

const j = JSON.parse(fs.readFileSync("preeti_raw.json", "utf8"));

function ast(s) {
  // escape for single-quoted JS string literal
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

const mapRepl = Object.entries(j["char-map"])
  .map(([k, v]) => `  '${ast(k)}': '${ast(v)}',`)
  .join("\n");

const rulesRepl = j["post-rules"]
  .map(([pat, rep]) => {
    let escaped = "";
    // escape for regex literal: backslashes stay, forward slash must be escaped
    for (let i = 0; i < pat.length; i++) {
      const ch = pat[i];
      if (ch === "/") escaped += "\\/";
      else escaped += ch;
    }
    let repEsc = "";
    for (const ch of ast(rep)) {
      if (ch === "$") repEsc += "\\$";
      else repEsc += ch;
    }
    return `  [/${escaped}/g, '${repEsc}'],`;
  })
  .join("\n");

const code = `// AUTO-GENERATED Preeti → Unicode mapping. Source: battle-tested open-source
// converter (github.com/Shuvayatra/preeti, MIT) — 135-char map + reorder rules.
// Regenerate with scripts/generate-preeti.mjs if you refresh the source JSON.

export const PREETI_CHAR_MAP: Record<string, string> = {
${mapRepl}
};

export const PREETI_POST_RULES: Array<[RegExp, string]> = [
${rulesRepl}
];

export function preetiToUnicode(input: string): string {
  let text = input;
  // Character map: longest keys first so multi-char conjuncts win.
  const pairs = Object.entries(PREETI_CHAR_MAP).sort((a, b) => b[0].length - a[0].length);
  let out = "";
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const [k, v] of pairs) {
      if (k.length === 1 || text.startsWith(k, i)) {
        if ((k.length === 1 && text.startsWith(k, i)) || (k.length > 1 && text.startsWith(k, i))) {
          out += v;
          i += k.length;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      out += text[i];
      i += 1;
    }
  }
  text = out;
  for (const [re, rep] of PREETI_POST_RULES) text = text.replace(re, rep);
  return text;
}
`;

fs.writeFileSync("src/lib/preeti.ts", code);
console.log("Written", code.length, "bytes;", j["post-rules"].length, "rules;", Object.keys(j["char-map"]).length, "chars");
