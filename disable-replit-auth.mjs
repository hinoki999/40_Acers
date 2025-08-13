// This patches the server to skip Replit auth when not on Replit
import fs from 'fs';
const path = 'server/replitAuth.ts';
const content = fs.readFileSync(path, 'utf8');

// Check if already patched
if (content.includes('Skipping Replit auth')) {
  console.log('Already patched');
} else {
  // Add a check at the beginning of setupAuth function
  const patched = content.replace(
    'export async function setupAuth(app: Express) {',
    `export async function setupAuth(app: Express) {
  if (!process.env.REPL_ID) {
    console.log("Skipping Replit auth - not on Replit");
    return;
  }`
  );
  fs.writeFileSync(path, patched);
  console.log('Patched Replit auth to be optional');
}
