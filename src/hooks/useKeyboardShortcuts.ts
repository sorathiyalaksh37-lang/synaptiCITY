import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[], enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

// Predefined shortcuts for the app
export const APP_SHORTCUTS = {
  TEACH: { key: 't', description: 'Teach association' },
  RECALL: { key: 'r', description: 'Test recall' },
  RESET: { key: 'r', shift: true, description: 'Reset network' },
  THEME: { key: 'd', description: 'Toggle theme' },
  HELP: { key: '?', shift: true, description: 'Show keyboard shortcuts' },
  EXPORT: { key: 's', ctrl: true, description: 'Export network state' },
  IMPORT: { key: 'o', ctrl: true, description: 'Import network state' },
  GRAPH_VIEW: { key: 'g', description: 'Switch to graph view' },
  HEATMAP_VIEW: { key: 'h', description: 'Switch to heatmap view' },
  NEXT_TAB: { key: ']', ctrl: true, description: 'Next tab' },
  PREV_TAB: { key: '[', ctrl: true, description: 'Previous tab' },
};
