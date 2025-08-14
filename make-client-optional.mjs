import fs from 'fs';

const filePath = 'server/index.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Make the client build directory optional
if (content.includes('Could not find the build directory')) {
  // Replace the error with a warning and bypass
  content = content.replace(
    /throw new Error\(\s*\n?\s*`Could not find the build directory[^`]*`[^)]*\);?/,
    `console.warn('Client not built yet - skipping static file serving');
    return (req, res, next) => next();`
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Successfully patched server to make client optional');
} else {
  console.log('Could not find the error pattern - checking file...');
  
  // Try a simpler search
  if (content.includes('dist/public')) {
    console.log('Found dist/public reference, attempting alternate patch...');
    content = content.replace(
      'throw new Error(',
      'console.warn("Client not built - continuing without static files"); if(false) throw new Error('
    );
    fs.writeFileSync(filePath, content);
    console.log('Applied alternate patch');
  }
}
