import fs from 'fs';

const filePath = 'server/vite.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Find the serveStatic function and modify it to handle missing client gracefully
const oldPattern = /throw new Error\(\s*`Could not find the build directory[^`]*`[^)]*\);?/;
const newCode = `
    console.log('Client build directory not found at:', clientBuildPath);
    console.log('Running in API-only mode. To enable client:');
    console.log('1. Build the client: cd client && npm run build');
    console.log('2. Or deploy frontend separately');
    
    // Return a middleware that just passes through
    app.use((req, res, next) => {
      if (req.path === '/' || req.path.startsWith('/api/')) {
        next();
      } else {
        res.status(404).json({ 
          error: 'Client not built', 
          message: 'This is an API-only deployment. Frontend coming soon.',
          api_endpoints: {
            e0g: '/api/e0g/*',
            health: '/api/health'
          }
        });
      }
    });
    return;`;

if (content.includes('Could not find the build directory')) {
  content = content.replace(oldPattern, newCode);
  fs.writeFileSync(filePath, content);
  console.log('Successfully modified vite.ts to handle missing client properly');
} else {
  console.log('Pattern not found in vite.ts');
}
