import React, { useState, useEffect } from 'react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  { keys: ['T'], description: 'Teach association', category: 'Actions' },
  { keys: ['R'], description: 'Test recall', category: 'Actions' },
  { keys: ['Shift', 'R'], description: 'Reset network', category: 'Actions' },
  { keys: ['D'], description: 'Toggle dark/light theme', category: 'View' },
  { keys: ['G'], description: 'Switch to graph view', category: 'View' },
  { keys: ['H'], description: 'Switch to heatmap view', category: 'View' },
  { keys: ['Ctrl', 'S'], description: 'Export network state', category: 'File' },
  { keys: ['Ctrl', 'O'], description: 'Import network state', category: 'File' },
  { keys: ['Ctrl', '['], description: 'Previous tab', category: 'Navigation' },
  { keys: ['Ctrl', ']'], description: 'Next tab', category: 'Navigation' },
  { keys: ['?'], description: 'Show this help', category: 'Help' },
  { keys: ['Esc'], description: 'Close dialogs', category: 'Help' },
];

export const KeyboardShortcutsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const categories = Array.from(new Set(SHORTCUTS.map((s) => s.category)));

  return (
    <div className="keyboard-shortcuts-overlay">
      <div className="keyboard-shortcuts-backdrop" onClick={() => setIsOpen(false)} />
      
      <div className="keyboard-shortcuts-panel">
        <div className="shortcuts-header">
          <h2>Keyboard Shortcuts</h2>
          <button
            className="shortcuts-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="shortcuts-content">
          {categories.map((category) => (
            <div key={category} className="shortcuts-category">
              <h3 className="shortcuts-category-title">{category}</h3>
              <div className="shortcuts-list">
                {SHORTCUTS.filter((s) => s.category === category).map((shortcut, idx) => (
                  <div key={idx} className="shortcut-item">
                    <div className="shortcut-keys">
                      {shortcut.keys.map((key, i) => (
                        <React.Fragment key={i}>
                          <kbd className="shortcut-key">{key}</kbd>
                          {i < shortcut.keys.length - 1 && <span className="shortcut-plus">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="shortcut-description">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="shortcuts-footer">
          <span className="shortcuts-tip">
            Press <kbd>?</kbd> to toggle this panel · <kbd>Esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};
