import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  Download,
  Monitor,
  CheckCircle2,
  X,
  ExternalLink,
  Laptop,
  Terminal,
  Printer,
  Sparkles,
} from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'topbar' | 'settings' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'topbar' }) => {
  const { isInstallable, isInstalled, isWindows, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

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
        {isInstallable ? (
          <button
            onClick={install}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 animate-pulse"
            title="Click to install as standalone Windows Desktop Software"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Install Windows App</span>
          </button>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Windows Desktop Setup & EXE Guide"
          >
            <Laptop className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden lg:inline">Windows Software (.exe)</span>
          </button>
        )}

        {/* Windows Software Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-2xl border border-sky-200 dark:border-sky-800">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Windows Software &amp; Desktop App Setup</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Run SA Brothers Vendors as a native Windows desktop software (.exe)
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
                {/* Method 1: Edge/Chrome Native PWA App */}
                <div className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900 dark:text-sky-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">1</span>
                      Direct 1-Click Browser App Installation (Recommended)
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                      Native Windows PWA
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
                      className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Monitor className="w-4 h-4" />
                      <span>Install on Windows Now</span>
                    </button>
                  ) : (
                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      💡 In Microsoft Edge or Google Chrome on Windows, click the <strong>App icon</strong> in the URL address bar or select <strong>Menu (⋯) &gt; Apps &gt; Install this site as an app</strong>.
                    </div>
                  )}
                </div>

                {/* Method 2: Download Windows Batch / Standalone Launcher */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">2</span>
                      Windows Double-Click Desktop Launcher (.bat)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Download our ready-made launcher script. Double-clicking it automatically creates a desktop shortcut icon and launches the POS full screen in application mode.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadLauncher}
                      className="flex-1 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadSuccess ? 'Downloaded!' : 'Download Launcher (.bat)'}</span>
                    </button>
                    <button
                      onClick={handleDownloadGuide}
                      className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Download text instructions on converting to .exe"
                    >
                      <span>.EXE Guide</span>
                    </button>
                  </div>
                </div>

                {/* Method 3: Convert to single .exe via Windows IExpress */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 space-y-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px]">3</span>
                    How to Convert to a Single-File .EXE (Built-in Windows Tool)
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
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Windows Software &amp; Desktop App Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run this POS as an offline-capable, standalone Windows application or single-file .exe
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => {
            if (isInstallable) {
              install();
            } else {
              setShowModal(true);
            }
          }}
          className="p-3 bg-white dark:bg-slate-800 border border-sky-300 dark:border-sky-800 hover:bg-sky-50/50 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-sky-900 dark:text-sky-200">
              {isInstallable ? 'Install as Windows App' : 'View Installation Setup'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Adds Desktop icon &amp; runs in full app window
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-sky-600 shrink-0 ml-2" />
        </button>

        <button
          type="button"
          onClick={handleDownloadLauncher}
          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer"
        >
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {downloadSuccess ? 'Downloaded!' : 'Download Windows Launcher (.bat)'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Includes auto shortcut generator &amp; app runner
            </div>
          </div>
          <Download className="w-4 h-4 text-slate-600 shrink-0 ml-2" />
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
