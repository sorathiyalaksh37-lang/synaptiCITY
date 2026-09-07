import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  registration: ServiceWorkerRegistration | null;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  isInstalled: boolean;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    registration: null,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    isInstalled: false
  });

  useEffect(() => {
    // Check if running as installed PWA
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    setState(prev => ({ ...prev, isInstalled }));

    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Online/offline listeners
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service worker registered:', registration.scope);
      setState(prev => ({ ...prev, registration }));

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New service worker available');
            setState(prev => ({ ...prev, isUpdateAvailable: true }));
          }
        });
      });

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute

    } catch (error) {
      console.error('[PWA] Service worker registration failed:', error);
    }
  };

  const updateServiceWorker = () => {
    if (!state.registration || !state.registration.waiting) return;

    state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload once the new service worker takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  };

  const unregisterServiceWorker = async () => {
    if (!state.registration) return;

    const success = await state.registration.unregister();
    if (success) {
      console.log('[PWA] Service worker unregistered');
      setState(prev => ({ ...prev, registration: null }));
    }
  };

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker
  };
};
