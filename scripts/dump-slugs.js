// Dev helper: list unique tool slugs from src/data/tools (not shipped to app).
const fs = require("fs");
const dir = __dirname + "/../src/data/tools";
const slugs = new Set();
for (const f of fs.readdirSync(dir)) {
  const c = fs.readFileSync(dir + "/" + f, "utf8");
  for (const m of c.matchAll(/slug:\s*"([^"]+)"/g)) slugs.add(m[1]);
}
console.log([...slugs].sort().join("\n"));
