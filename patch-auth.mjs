import fs from 'fs';

const filePath = 'server/replitAuth.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Check if already patched
if (!content.includes('BYPASS_REPLIT_AUTH')) {
  // Find the setupAuth function and add bypass logic
  content = content.replace(
    'export async function setupAuth(app: Express) {',
    `export async function setupAuth(app: Express) {
  // BYPASS_REPLIT_AUTH - Allow running outside Replit
  if (!process.env.REPL_ID || process.env.BYPASS_REPLIT_AUTH === 'true') {
    console.log("Bypassing Replit auth - running outside Replit");
    return;
  }
`
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Successfully patched replitAuth.ts');
} else {
  console.log('File already patched');
}
