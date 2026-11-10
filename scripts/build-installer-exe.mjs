import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('===> Packaging single-file Windows installer executable...');

const installerSrc = path.resolve('installer-runner.cjs');
const code = `const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('========================================================================');
console.log('      SA BROTHERS VENDORS - POINT OF SALE (NATIVE WINDOWS APP)          ');
console.log('========================================================================');
console.log('');
console.log('Initializing desktop application on your Windows PC...');

const userProfile = process.env.USERPROFILE || 'C:\\\\Users\\\\Default';
const localAppData = process.env.LOCALAPPDATA || path.join(userProfile, 'AppData', 'Local');
const targetDir = path.join(localAppData, 'SABrothersVendorsPOS');
const exePath = path.join(targetDir, 'SA_Brothers_Vendors_POS.exe');

const zipSource = path.join(__dirname, 'SA_Brothers_Vendors_POS_Windows.zip');

if (!fs.existsSync(exePath)) {
  console.log('[1/3] Extracting native desktop software to: ' + targetDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Extract embedded zip via Windows built-in tar or PowerShell
  let extracted = false;
  try {
    execSync('tar -xf "' + zipSource + '" -C "' + targetDir + '"', { stdio: 'inherit' });
    extracted = true;
  } catch (e1) {
    try {
      execSync('powershell -NoProfile -Command "Expand-Archive -LiteralPath \\'' + zipSource + '\\' -DestinationPath \\'' + targetDir + '\\' -Force"', { stdio: 'inherit' });
      extracted = true;
    } catch (e2) {
      console.error('Failed to extract:', e2);
    }
  }
} else {
  console.log('[OK] Application already installed in: ' + targetDir);
}

// Place Desktop Shortcut
try {
  console.log('[2/3] Verifying Windows Desktop shortcut...');
  const desktop = path.join(userProfile, 'Desktop');
  const lnk = path.join(desktop, 'SA Brothers Vendors POS.lnk');
  const tempDir = process.env.TEMP || 'C:\\\\Temp';
  const vbsPath = path.join(tempDir, 'create_pos_shortcut.vbs');
  
  const vbs = 'Set oWS = WScript.CreateObject("WScript.Shell")\\n' +
    'sLinkFile = "' + lnk.replace(/\\\\/g, '\\\\\\\\') + '"\\n' +
    'Set oLink = oWS.CreateShortcut(sLinkFile)\\n' +
    'oLink.TargetPath = "' + exePath.replace(/\\\\/g, '\\\\\\\\') + '"\\n' +
    'oLink.WorkingDirectory = "' + targetDir.replace(/\\\\/g, '\\\\\\\\') + '"\\n' +
    'oLink.Description = "SA Brothers Vendors POS"\\n' +
    'oLink.Save';
  
  fs.writeFileSync(vbsPath, vbs, 'utf8');
  execSync('cscript //nologo "' + vbsPath + '"');
  try { fs.unlinkSync(vbsPath); } catch {}
  console.log('[OK] Desktop shortcut placed!');
} catch (err) {
  // Shortcut is optional
}

console.log('[3/3] Opening native desktop window...');
if (fs.existsSync(exePath)) {
  const child = spawn(exePath, [], {
    detached: true,
    stdio: 'ignore',
    cwd: targetDir
  });
  child.unref();
  console.log('========================================================================');
  console.log(' [SUCCESS] SA Brothers Vendors POS is now running natively on Windows!  ');
  console.log('========================================================================');
  setTimeout(() => process.exit(0), 1200);
} else {
  console.error('[ERROR] Could not find ' + exePath);
  process.exit(1);
}
`;

fs.writeFileSync(installerSrc, code, 'utf8');

// Copy zip to current dir for pkg asset inclusion
if (fs.existsSync('release/SA_Brothers_Vendors_POS_Windows.zip')) {
  fs.copyFileSync('release/SA_Brothers_Vendors_POS_Windows.zip', 'SA_Brothers_Vendors_POS_Windows.zip');
}

const pkgConfig = {
  name: 'sa-brothers-pos-setup',
  version: '1.0.0',
  bin: 'installer-runner.cjs',
  pkg: {
    assets: [
      'SA_Brothers_Vendors_POS_Windows.zip'
    ]
  }
};
fs.writeFileSync('package-installer.json', JSON.stringify(pkgConfig, null, 2), 'utf8');

console.log('Compiling single-file native installer executable with pkg...');
execSync(
  'npx @yao-pkg/pkg -c package-installer.json -t node22-win-x64 installer-runner.cjs -o SA_Brothers_Vendors_POS_Setup.exe',
  { stdio: 'inherit' }
);

if (fs.existsSync('SA_Brothers_Vendors_POS_Setup.exe')) {
  const publicDir = path.resolve('public/download');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  
  fs.copyFileSync('SA_Brothers_Vendors_POS_Setup.exe', path.resolve(publicDir, 'SA_Brothers_Vendors_POS_Setup.exe'));
  fs.copyFileSync('SA_Brothers_Vendors_POS_Setup.exe', path.resolve('public', 'SA_Brothers_Vendors_POS_Setup.exe'));
  fs.copyFileSync('SA_Brothers_Vendors_POS_Setup.exe', path.resolve('dist', 'SA_Brothers_Vendors_POS_Setup.exe'));
  
  // Also provide as SA_Brothers_Vendors_POS.exe in root and public
  fs.copyFileSync('SA_Brothers_Vendors_POS_Setup.exe', path.resolve('SA_Brothers_Vendors_POS.exe'));
  fs.copyFileSync('SA_Brothers_Vendors_POS_Setup.exe', path.resolve(publicDir, 'SA_Brothers_Vendors_POS.exe'));
  fs.copyFileSync('SA_Brothers_Vendors_POS_Setup.exe', path.resolve('public', 'SA_Brothers_Vendors_POS.exe'));
  fs.copyFileSync('SA_Brothers_Vendors_POS_Setup.exe', path.resolve('dist', 'SA_Brothers_Vendors_POS.exe'));
  
  const stats = fs.statSync('SA_Brothers_Vendors_POS_Setup.exe');
  console.log(`[SUCCESS] SA_Brothers_Vendors_POS_Setup.exe created! Size: ${(stats.size / 1024 / 1024).toFixed(1)} MB`);
}

// Clean up temporary build files
if (fs.existsSync('installer-runner.cjs')) fs.unlinkSync('installer-runner.cjs');
if (fs.existsSync('package-installer.json')) fs.unlinkSync('package-installer.json');
