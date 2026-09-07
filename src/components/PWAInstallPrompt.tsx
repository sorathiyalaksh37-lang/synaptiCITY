import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show immediately - wait for user interaction
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const lastDismissed = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
      
      if (!dismissed || daysSinceDismissed > 7) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    setShowPrompt(false);
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleIOSDismiss = () => {
    setShowIOSInstructions(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || (!showPrompt && !showIOSInstructions)) {
    return null;
  }

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-cyan-500/30 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Smartphone className="w-6 h-6 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Install on iOS</h3>
            </div>
            <button
              onClick={handleIOSDismiss}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 text-slate-300 text-sm">
            <p>To install synaptiCITY on your iOS device:</p>
            
            <ol className="space-y-3 list-decimal list-inside">
              <li>
                Tap the <strong className="text-cyan-400">Share</strong> button
                <span className="inline-block ml-2 px-2 py-1 bg-slate-700 rounded text-xs">
                  □↑
                </span>
              </li>
              <li>
                Scroll down and tap <strong className="text-cyan-400">"Add to Home Screen"</strong>
              </li>
              <li>
                Tap <strong className="text-cyan-400">"Add"</strong> in the top right
              </li>
            </ol>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-3 mt-4">
              <p className="text-xs text-cyan-300">
                💡 Once installed, synaptiCITY will work offline and feel like a native app!
              </p>
            </div>
          </div>

          <button
            onClick={handleIOSDismiss}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  // Standard Install Prompt
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-cyan-500/30 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className="bg-cyan-500/20 p-3 rounded-lg">
              <Monitor className="w-6 h-6 text-cyan-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold mb-1">Install synaptiCITY</h3>
              <p className="text-slate-300 text-sm mb-3">
                Install our app for faster access and offline support. Works like a native app!
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 rounded transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-cyan-500/10 px-4 py-2 border-t border-cyan-500/20">
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
            Works offline • Fast loading • Native feel
          </div>
        </div>
      </div>
    </div>
  );
};
