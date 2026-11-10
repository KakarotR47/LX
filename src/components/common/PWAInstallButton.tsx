import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Monitor,
  CheckCircle2,
  X,
  ExternalLink,
  Laptop,
  Check,
  FileCode,
  ShieldCheck,
  HardDrive,
} from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'topbar' | 'settings' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'topbar' }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [exeDownloading, setExeDownloading] = useState<boolean>(false);
  const [exeDownloaded, setExeDownloaded] = useState<boolean>(false);

  const handleDownloadExe = () => {
    setExeDownloading(true);
    const link = document.createElement('a');
    link.href = '/download/SA_Brothers_Vendors_POS.exe';
    link.download = 'SA_Brothers_Vendors_POS.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setExeDownloading(false);
      setExeDownloaded(true);
      setTimeout(() => setExeDownloaded(false), 5000);
    }, 1200);
  };

  const handleDownloadLauncher = () => {
    const link = document.createElement('a');
    link.href = '/windows-launcher/launch_sa_brothers_pos.bat';
    link.download = 'launch_sa_brothers_pos.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDownloadGuide = () => {
    const link = document.createElement('a');
    link.href = '/windows-launcher/HOW_TO_MAKE_WINDOWS_EXE.txt';
    link.download = 'HOW_TO_MAKE_WINDOWS_EXE.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render for TopBar
  if (variant === 'topbar') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          title="Download Windows Native Executable (.exe) or Install App"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Windows .EXE App</span>
        </button>

        {/* Windows Software Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl border border-sky-200 dark:border-sky-800">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Windows Software &amp; Executable (.exe)</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                        x64 Windows Ready
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Run SA Brothers Vendors as a native, self-contained Windows desktop software on Windows 10 &amp; 11
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Method 1: DIRECT DOWNLOAD STANDALONE .EXE (PRIMARY) */}
                <div className="p-5 rounded-2xl border-2 border-sky-500/80 dark:border-sky-500/60 bg-gradient-to-br from-sky-50/80 to-indigo-50/40 dark:from-sky-950/40 dark:to-indigo-950/20 space-y-3 relative overflow-hidden shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-950 dark:text-sky-100 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                      Standalone Native Windows Software (.EXE) — Direct Download
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-white/80 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                      ~72 MB • No Setup Needed
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Pre-compiled standalone Windows x64 binary. Double-click to run on any Windows 10/11 shop computer. It automatically initializes the hard-drive database (<code className="text-xs font-mono font-bold bg-white/70 dark:bg-slate-800 px-1 py-0.5 rounded text-sky-600 dark:text-sky-400">local_database/</code>) and opens in an isolated native application window.
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>100% Offline &amp; Safe</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Auto Saves to Hard Disk</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleDownloadExe}
                      disabled={exeDownloading}
                      className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      {exeDownloaded ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Downloaded! Check Your Downloads Folder</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{exeDownloading ? 'Starting Download...' : 'Download SA_Brothers_Vendors_POS.exe (72 MB)'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Method 2: Edge/Chrome Native PWA App */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">2</span>
                      Browser Native App Installation (PWA)
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      Zero Download Size
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Installs the POS into your Windows Start Menu, Desktop, and Taskbar. Opens in an isolated native window without browser address bars.
                  </p>
                  {isInstallable ? (
                    <button
                      onClick={() => {
                        install();
                        setShowModal(false);
                      }}
                      className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 dark:hover:bg-slate-100"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>Install as Desktop App Now</span>
                    </button>
                  ) : (
                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      💡 In Microsoft Edge or Google Chrome on Windows, click the <strong>App icon</strong> in the URL address bar or select <strong>Menu (⋯) &gt; Apps &gt; Install this site as an app</strong>.
                    </div>
                  )}
                </div>

                {/* Method 3: Download Windows Batch / Standalone Launcher */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">3</span>
                      Windows Double-Click Desktop Launcher (.bat)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Download our ready-made launcher script. Double-clicking it automatically creates a desktop shortcut icon and launches the POS full screen in application mode.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadLauncher}
                      className="flex-1 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadSuccess ? 'Downloaded!' : 'Download Launcher (.bat)'}</span>
                    </button>
                    <button
                      onClick={handleDownloadGuide}
                      className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Download text instructions on converting to .exe"
                    >
                      <FileCode className="w-3.5 h-3.5 text-slate-500" />
                      <span>.EXE Guide</span>
                    </button>
                  </div>
                </div>

                {/* Method 4: Convert to single .exe via Windows IExpress */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">4</span>
                    How to Package into a Custom .EXE via Windows IExpress (Built-in)
                  </div>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside space-y-1 pl-1 leading-relaxed">
                    <li>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px]">Win + R</kbd>, type <code className="text-sky-600 font-mono font-bold">iexpress</code> and press Enter.</li>
                    <li>Choose <em>Create new Self Extraction Directive</em> &gt; <em>Extract files and run command</em>.</li>
                    <li>Add <code className="text-sky-600 font-mono">launch_sa_brothers_pos.bat</code> as the package file.</li>
                    <li>Set Install Program to: <code className="text-sky-600 font-mono">cmd /c launch_sa_brothers_pos.bat</code>.</li>
                    <li>Save output as <code className="text-emerald-600 font-mono font-bold">SA_Brothers_POS.exe</code> on your Desktop!</li>
                  </ol>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Render for StoreSettings
  return (
    <div className="p-5 rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-500 text-white rounded-xl shadow-xs">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Windows Software &amp; Desktop App Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run this POS as an offline-capable, standalone Windows application (.exe) or desktop app
            </p>
          </div>
        </div>

        {isInstalled && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Installed as App
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* Direct .EXE download card */}
        <button
          type="button"
          onClick={handleDownloadExe}
          disabled={exeDownloading}
          className="p-3.5 bg-gradient-to-br from-sky-600 to-indigo-600 text-white rounded-xl text-left transition-all shadow-xs hover:shadow-md flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">
                {exeDownloaded ? '✓ Downloaded!' : 'Download Windows .EXE'}
              </span>
              <Download className="w-4 h-4 shrink-0" />
            </div>
            <div className="text-[11px] text-sky-100 mt-1 leading-snug">
              Standalone 64-bit executable (72 MB). Double-click to run on Windows 10/11.
            </div>
          </div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded w-fit">
            Native Offline EXE
          </div>
        </button>

        {/* PWA App Install card */}
        <button
          type="button"
          onClick={() => {
            if (isInstallable) {
              install();
            } else {
              setShowModal(true);
            }
          }}
          className="p-3.5 bg-white dark:bg-slate-800 border border-sky-300 dark:border-sky-800 hover:bg-sky-50/50 rounded-xl text-left transition-colors flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-900 dark:text-sky-200">
                {isInstallable ? 'Install Browser App' : 'Desktop App Setup'}
              </span>
              <ExternalLink className="w-4 h-4 text-sky-600 shrink-0" />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Adds Desktop icon &amp; runs in full app window without browser bars.
            </div>
          </div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded w-fit">
            Browser PWA
          </div>
        </button>

        {/* Launcher script download */}
        <button
          type="button"
          onClick={handleDownloadLauncher}
          className="p-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl text-left transition-colors flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {downloadSuccess ? 'Downloaded!' : 'Download Launcher (.bat)'}
              </span>
              <Download className="w-4 h-4 text-slate-600 shrink-0" />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Batch script to auto-generate desktop shortcut &amp; launch kiosk.
            </div>
          </div>
          <div className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded w-fit">
            Batch Script
          </div>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                How to Install on Windows
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              In Microsoft Edge or Chrome on Windows, click the <strong>App icon</strong> in the address bar (or Menu ⋯ &gt; Apps &gt; Install SA Brothers POS) to pin it to your Windows Desktop and Taskbar.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
