import fs from 'fs';

const filePath = 'server/vite.ts';

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Replace the error throwing with a warning
if (content.includes('Could not find the build directory')) {
  content = content.replace(
    /throw new Error\([^)]*Could not find the build directory[^)]*\);?/,
    `console.warn('Build directory not found - running in API-only mode');
    return (req, res, next) => next();`
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Successfully patched vite.ts to make static serving optional');
} else {
  console.log('Error pattern not found, trying alternate approach...');
  
  // Try to find and replace the whole serveStatic function
  const serveStaticRegex = /export\s+function\s+serveStatic[^{]*{[\s\S]*?^}/m;
  
  if (serveStaticRegex.test(content)) {
    content = content.replace(serveStaticRegex, 
      `export function serveStatic(app: Express) {
  console.log("Static serving disabled - API only mode");
  return app;
}`);
    fs.writeFileSync(filePath, content);
    console.log('Replaced entire serveStatic function');
  }
}
