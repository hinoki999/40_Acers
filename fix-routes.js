import fs from 'fs';

const content = fs.readFileSync('server/routes.ts', 'utf8');
const lines = content.split('\n');
const cleanLines = [];
let skipUntilCloseBrace = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Skip E0G related imports that are wrong
  if (line.includes("import { e0gAnalytics }")) {
    continue;
  }
  
  // Skip registerE0GRoutes function
  if (line.includes("export function registerE0GRoutes")) {
    skipUntilCloseBrace = true;
    continue;
  }
  
  if (skipUntilCloseBrace) {
    if (line === '}') {
      skipUntilCloseBrace = false;
    }
    continue;
  }
  
  // Skip the function call
  if (line.includes("registerE0GRoutes(app)")) {
    continue;
  }
  
  cleanLines.push(line);
}

fs.writeFileSync('server/routes.ts', cleanLines.join('\n'));
console.log('✅ Routes cleaned');
