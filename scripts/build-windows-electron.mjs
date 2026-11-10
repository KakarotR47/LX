import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('===> [1/6] Building frontend Vite production assets...');
execSync('npm run build', { stdio: 'inherit' });

console.log('===> [2/6] Bundling server with esbuild for Electron embedded runtime...');
execSync(
  'npx esbuild server.ts --bundle --platform=node --target=node20 --format=cjs --outfile=server-electron.cjs --external:vite --define:process.env.NODE_ENV=\'"production"\'',
  { stdio: 'inherit' }
);

console.log('===> [3/6] Extracting official Electron Windows x64 binary...');
const releaseDir = path.resolve('release');
const appOutDir = path.resolve(releaseDir, 'SA_Brothers_Vendors_POS-win32-x64');
if (fs.existsSync(appOutDir)) {
  fs.rmSync(appOutDir, { recursive: true, force: true });
}
fs.mkdirSync(appOutDir, { recursive: true });

execSync(`unzip -q .cache/electron-win32-x64.zip -d "${appOutDir}"`, { stdio: 'inherit' });

// Rename electron.exe to SA_Brothers_Vendors_POS.exe
const defaultExe = path.join(appOutDir, 'electron.exe');
const targetExe = path.join(appOutDir, 'SA_Brothers_Vendors_POS.exe');
if (fs.existsSync(defaultExe)) {
  fs.renameSync(defaultExe, targetExe);
}

// Remove default_app.asar
const defaultAppAsar = path.join(appOutDir, 'resources', 'default_app.asar');
if (fs.existsSync(defaultAppAsar)) {
  fs.unlinkSync(defaultAppAsar);
}

console.log('===> [4/6] Creating Electron app package in resources/app/...');
const appDir = path.join(appOutDir, 'resources', 'app');
fs.mkdirSync(appDir, { recursive: true });

// Copy server bundle
fs.copyFileSync('server-electron.cjs', path.join(appDir, 'server-electron.cjs'));
fs.unlinkSync('server-electron.cjs');

// Copy dist, local_database, public
execSync(`cp -r dist "${appDir}/dist"`, { stdio: 'inherit' });
execSync(`cp -r local_database "${appDir}/local_database"`, { stdio: 'inherit' });
execSync(`cp -r public "${appDir}/public"`, { stdio: 'inherit' });

// Create package.json for Electron
const electronPkg = {
  name: 'sa-brothers-vendors-pos',
  version: '1.0.0',
  description: 'SA Brothers Vendors Point of Sale & Inventory Manager',
  main: 'main.cjs',
  author: 'SA Brothers Vendors'
};
fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify(electronPkg, null, 2), 'utf8');

// Create main.cjs for Electron
const mainCjsContent = `const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

app.setAppUserModelId('com.sabrothers.pos');

let mainWindow = null;

// Determine persistent database folder next to SA_Brothers_Vendors_POS.exe
const APP_DIR = path.dirname(process.execPath);
const LOCAL_DB_DIR = path.join(APP_DIR, 'local_database');

if (!fs.existsSync(LOCAL_DB_DIR)) {
  fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
}

// Seed initial database tables if missing
const SEED_DB_DIR = path.join(__dirname, 'local_database');
if (fs.existsSync(SEED_DB_DIR)) {
  const defaultFiles = ['products.json', 'transactions.json', 'expenses.json', 'movements.json', 'settings.json', 'profiles.json', 'device_lock.json'];
  defaultFiles.forEach((file) => {
    const dest = path.join(LOCAL_DB_DIR, file);
    const src = path.join(SEED_DB_DIR, file);
    if (!fs.existsSync(dest) && fs.existsSync(src)) {
      try { fs.copyFileSync(src, dest); } catch {}
    }
  });
}

process.env.APP_DATA_DIR = LOCAL_DB_DIR;
process.env.NODE_ENV = 'production';
process.env.ELECTRON_RUN = 'true';
process.env.PORT = '3000';

// Start embedded server
try {
  require('./server-electron.cjs');
} catch (err) {
  console.error('Failed to initialize internal server:', err);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'SA Brothers Vendors - Point of Sale & Inventory Manager',
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);

  // Poll until embedded server is ready, then load native window
  let loaded = false;
  const tryLoad = () => {
    if (loaded) return;
    const http = require('http');
    const req = http.get('http://127.0.0.1:3000/api/health', (res) => {
      if (res.statusCode === 200 && !loaded) {
        loaded = true;
        mainWindow.loadURL('http://127.0.0.1:3000');
      } else {
        setTimeout(tryLoad, 200);
      }
    });
    req.on('error', () => {
      setTimeout(tryLoad, 200);
    });
    req.end();
  };

  setTimeout(tryLoad, 300);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
`;
fs.writeFileSync(path.join(appDir, 'main.cjs'), mainCjsContent, 'utf8');

// Also create a convenient launcher batch file inside the release folder
const batContent = `@echo off
title SA Brothers Vendors POS
cd /d "%~dp0"
start "" "SA_Brothers_Vendors_POS.exe"
exit
`;
fs.writeFileSync(path.join(appOutDir, 'Launch_POS.bat'), batContent, 'utf8');

console.log('===> [5/6] Zipping native Windows application package...');
const zipOut = path.resolve('public/download/SA_Brothers_Vendors_POS_Windows.zip');
const publicDir = path.resolve('public/download');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

execSync(`cd "${releaseDir}" && python3 -c "
import shutil
shutil.make_archive('SA_Brothers_Vendors_POS_Windows', 'zip', 'SA_Brothers_Vendors_POS-win32-x64')
"`, { stdio: 'inherit' });

fs.renameSync(
  path.resolve(releaseDir, 'SA_Brothers_Vendors_POS_Windows.zip'),
  zipOut
);

// Copy zip to public, dist, and root
fs.copyFileSync(zipOut, path.resolve('public', 'SA_Brothers_Vendors_POS_Windows.zip'));
fs.copyFileSync(zipOut, path.resolve('dist', 'SA_Brothers_Vendors_POS_Windows.zip'));
fs.copyFileSync(zipOut, path.resolve('SA_Brothers_Vendors_POS_Windows.zip'));

// Copy native SA_Brothers_Vendors_POS.exe from the release folder into root, dist, and build
fs.copyFileSync(targetExe, path.resolve('SA_Brothers_Vendors_POS.exe'));
fs.copyFileSync(targetExe, path.resolve('dist', 'SA_Brothers_Vendors_POS.exe'));
fs.copyFileSync(targetExe, path.resolve('build', 'SA_Brothers_Vendors_POS.exe'));
fs.copyFileSync(targetExe, path.resolve('public/download', 'SA_Brothers_Vendors_POS.exe'));
fs.copyFileSync(targetExe, path.resolve('public', 'SA_Brothers_Vendors_POS.exe'));

const zipStats = fs.statSync(zipOut);
console.log(`===> [6/6] [SUCCESS] Native Windows Desktop App packaged!`);
console.log(`- Zip Package: ${(zipStats.size / 1024 / 1024).toFixed(1)} MB (${zipOut})`);
console.log(`- Native Executable: SA_Brothers_Vendors_POS.exe placed in root, dist/, and public/download/`);
