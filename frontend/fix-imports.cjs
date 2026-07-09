const fs = require('fs');
const path = require('path');
function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf8');
      if (c.includes("@/types")) {
        c = c.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@\/types['"]/g, "import type { $1 } from '@/types'");
        fs.writeFileSync(p, c);
      }
    }
  });
}
walk('c:/Users/MAYUR/Desktop/Akole Cafe/frontend/src');
