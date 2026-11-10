import fs from 'fs';
import path from 'path';

const candidateSources = [
  'public/download/SA_Brothers_Vendors_POS.exe',
  'public/SA_Brothers_Vendors_POS.exe',
  'SA_Brothers_Vendors_POS.exe',
  'dist/download/SA_Brothers_Vendors_POS.exe',
];

const foundSource = candidateSources.find((src) => fs.existsSync(src));

if (foundSource) {
  console.log(`[postbuild] Found Windows binary at ${foundSource}`);
  const targetDirs = ['dist', 'build', 'public', 'public/download'];
  targetDirs.forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const dest = path.resolve(dir, 'SA_Brothers_Vendors_POS.exe');
    if (path.resolve(foundSource) !== dest) {
      try {
        fs.copyFileSync(foundSource, dest);
        console.log(`[postbuild] Synced to ${dest}`);
      } catch (err) {
        console.warn(`[postbuild] Could not copy to ${dest}:`, err.message);
      }
    }
  });

  const rootDest = path.resolve('SA_Brothers_Vendors_POS.exe');
  if (path.resolve(foundSource) !== rootDest) {
    try {
      fs.copyFileSync(foundSource, rootDest);
      console.log(`[postbuild] Synced to root ${rootDest}`);
    } catch {}
  }
} else {
  console.log('[postbuild] Note: Windows executable not found yet. Run "npm run build:exe" to compile it.');
}
