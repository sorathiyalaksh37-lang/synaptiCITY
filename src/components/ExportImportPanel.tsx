import React, { useRef, useState } from 'react';
import { exportNetworkState, importNetworkState, type NetworkState } from '../utils/storage';

interface ExportImportPanelProps {
  currentState: NetworkState;
  onImport: (state: NetworkState) => void;
}

export const ExportImportPanel: React.FC<ExportImportPanelProps> = ({
  currentState,
  onImport,
}) => {
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportNetworkState(currentState);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(false);

    try {
      const state = await importNetworkState(file);
      onImport(state);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import file');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(currentState, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapticity-state-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const { weights, vocabulary } = currentState;
    
    // Create CSV header
    let csv = ',' + vocabulary.join(',') + '\n';
    
    // Add rows
    weights.forEach((row, i) => {
      csv += vocabulary[i] + ',' + row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synapticity-weights-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-import-panel">
      <div className="panel-header">
        <h3>Export & Import</h3>
        <span className="panel-subtitle">Save or load network states</span>
      </div>

      <div className="panel-section">
        <h4 className="section-title">Export</h4>
        <div className="button-group">
          <button className="export-btn" onClick={handleExportJSON} title="Export as JSON file">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1V10M8 10L5 7M8 10L11 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 11V13C2 14.1046 2.89543 15 4 15H12C13.1046 15 14 14.1046 14 13V11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Export JSON</span>
          </button>

          <button className="export-btn" onClick={handleExportCSV} title="Export weights as CSV">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4H14M2 8H14M2 12H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="panel-section">
        <h4 className="section-title">Import</h4>
        <button className="import-btn" onClick={handleImportClick}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 15V6M8 6L5 9M8 6L11 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 5V3C2 1.89543 2.89543 1 4 1H12C13.1046 1 14 1.89543 14 3V5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Import JSON</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {importError && (
        <div className="import-feedback import-error">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4V7M7 10V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {importError}
        </div>
      )}

      {importSuccess && (
        <div className="import-feedback import-success">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7L5.5 10.5L12 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Network state imported successfully!
        </div>
      )}

      <div className="panel-note">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 8V6M6 4V3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span>JSON files contain full state. CSV exports only the weight matrix.</span>
      </div>
    </div>
  );
};
