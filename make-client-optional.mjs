import fs from 'fs';

const filePath = 'server/index.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find the serveStatic function and make it optional
const searchPattern = 'throw new Error(';
const replacePattern = `console.warn('Client not built yet - skipping static file serving');
    return (req, res, next) => next();
    // throw new Error(`;

if (content.includes('Could not find the build directory')) {
  content = content.replace(
    'throw new Error(',
    replacePattern
  );
  fs.writeFileSync(filePath, content);
  console.log('Patched server to make client optional');
} else {
  console.log('Already patched or pattern not found');
}
