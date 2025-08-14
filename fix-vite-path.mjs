import fs from 'fs';

const filePath = 'server/vite.ts';
let content = fs.readFileSync(filePath, 'utf8');

// The function is looking for public in the wrong place
// It should look for ../dist/public not ./public
const oldPath = 'path.resolve(import.meta.dirname, "public")';
const newPath = 'path.resolve(import.meta.dirname, "../dist/public")';

if (content.includes(oldPath)) {
  content = content.replace(oldPath, newPath);
  fs.writeFileSync(filePath, content);
  console.log('Fixed path to look for ../dist/public instead of ./public');
} else {
  console.log('Checking current path setup...');
  // Let's see what the current path actually is
  const match = content.match(/path\.resolve\([^,]+,\s*"([^"]+)"\)/);
  if (match) {
    console.log('Current path is looking for:', match[1]);
  }
}
