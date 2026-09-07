import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  isUpdateAvailable: boolean;
  onUpdate?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ 
  isOnline, 
  isUpdateAvailable,
  onUpdate 
}) => {
  if (isOnline && !isUpdateAvailable) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!isOnline && (
        <div className="bg-orange-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span>You're offline. Some features may be limited.</span>
        </div>
      )}

      {isOnline && isUpdateAvailable && (
        <div className="bg-cyan-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-3">
          <RefreshCw className="w-4 h-4" />
          <span>A new version is available!</span>
          {onUpdate && (
            <button
              onClick={onUpdate}
              className="bg-white text-cyan-500 px-3 py-1 rounded font-bold hover:bg-cyan-50 transition-colors text-xs"
            >
              Update Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};
