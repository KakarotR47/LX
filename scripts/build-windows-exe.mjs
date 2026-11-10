import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('===> [1/4] Building Vite frontend production assets...');
execSync('npm run build', { stdio: 'inherit' });

console.log('===> [2/4] Bundling server with esbuild...');
execSync(
  'npx esbuild server.ts --bundle --platform=node --target=node22 --format=cjs --outfile=server-prod.cjs --external:vite --define:process.env.NODE_ENV=\'"production"\'',
  { stdio: 'inherit' }
);

// Create temporary package.json snippet for pkg assets inclusion
const pkgConfig = {
  name: 'sa-brothers-vendors-pos-exe',
  version: '1.0.0',
  main: 'server-prod.cjs',
  bin: 'server-prod.cjs',
  pkg: {
    assets: [
      'dist/**/*',
      'public/**/*',
      'local_database/**/*'
    ]
  }
};
fs.writeFileSync('package-exe.json', JSON.stringify(pkgConfig, null, 2), 'utf8');

console.log('===> [3/4] Compiling native Windows .exe using pkg (node22-win-x64)...');
execSync(
  'npx @yao-pkg/pkg -c package-exe.json -t node22-win-x64 server-prod.cjs -o SA_Brothers_Vendors_POS.exe',
  { stdio: 'inherit' }
);

console.log('===> [4/4] Placing Windows executable in public download directory...');
const downloadDir = path.resolve('./public/download');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

if (fs.existsSync('SA_Brothers_Vendors_POS.exe')) {
  // Sync to public download folder
  fs.copyFileSync('SA_Brothers_Vendors_POS.exe', path.resolve(downloadDir, 'SA_Brothers_Vendors_POS.exe'));
  // Sync to public root
  fs.copyFileSync('SA_Brothers_Vendors_POS.exe', path.resolve('./public', 'SA_Brothers_Vendors_POS.exe'));
  // Sync to dist
  const distDir = path.resolve('./dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync('SA_Brothers_Vendors_POS.exe', path.resolve(distDir, 'SA_Brothers_Vendors_POS.exe'));
  }
  // Sync to build
  const buildDir = path.resolve('./build');
  if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
  fs.copyFileSync('SA_Brothers_Vendors_POS.exe', path.resolve(buildDir, 'SA_Brothers_Vendors_POS.exe'));
  console.log('[SUCCESS] SA_Brothers_Vendors_POS.exe placed in root, dist/, build/, and public/download/');
}

// Clean up intermediate build artifacts
if (fs.existsSync('package-exe.json')) fs.unlinkSync('package-exe.json');
if (fs.existsSync('server-prod.cjs')) fs.unlinkSync('server-prod.cjs');

const stats = fs.statSync(path.resolve(downloadDir, 'SA_Brothers_Vendors_POS.exe'));
console.log(`[SUCCESS] SA_Brothers_Vendors_POS.exe created! Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
