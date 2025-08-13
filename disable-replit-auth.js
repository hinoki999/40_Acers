// This patches the server to skip Replit auth when not on Replit
const fs = require('fs');
const path = 'server/replitAuth.ts';
const content = fs.readFileSync(path, 'utf8');
const patched = content.replace(
  'export async function setupAuth',
  'export async function setupAuth(app) { if (!process.env.REPL_ID) { console.log("Skipping Replit auth - not on Replit"); return; } return setupAuthOriginal(app); } async function setupAuthOriginal'
);
fs.writeFileSync(path, patched);
console.log('Patched Replit auth to be optional');
