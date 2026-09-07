import React, { useState, useRef } from 'react';

interface BatchAssociation {
  input: string;
  output: string;
  repetitions: number;
}

interface BatchTeachingPanelProps {
  vocabulary: string[];
  onBatchTeach: (associations: BatchAssociation[]) => void;
  disabled?: boolean;
}

export const BatchTeachingPanel: React.FC<BatchTeachingPanelProps> = ({
  vocabulary,
  onBatchTeach,
  disabled = false,
}) => {
  const [associations, setAssociations] = useState<BatchAssociation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setAssociations(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const parseCSV = (text: string): BatchAssociation[] => {
    const lines = text.trim().split('\n');
    const associations: BatchAssociation[] = [];

    // Skip header if present
    const startIndex = lines[0].toLowerCase().includes('input') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map((p) => p.trim().toUpperCase());

      if (parts.length < 2) {
        throw new Error(`Line ${i + 1}: Invalid format. Expected: input,output[,repetitions]`);
      }

      const input = parts[0];
      const output = parts[1];
      const repetitions = parts[2] ? parseInt(parts[2], 10) : 1;

      if (!vocabulary.includes(input)) {
        throw new Error(`Line ${i + 1}: Input "${input}" not in vocabulary`);
      }

      if (!vocabulary.includes(output)) {
        throw new Error(`Line ${i + 1}: Output "${output}" not in vocabulary`);
      }

      if (isNaN(repetitions) || repetitions < 1) {
        throw new Error(`Line ${i + 1}: Invalid repetitions value`);
      }

      associations.push({ input, output, repetitions });
    }

    if (associations.length === 0) {
      throw new Error('No valid associations found in CSV');
    }

    return associations;
  };

  const handleExecute = () => {
    if (associations.length === 0) return;
    setIsProcessing(true);
    onBatchTeach(associations);
    setTimeout(() => {
      setIsProcessing(false);
      setAssociations([]);
    }, 100);
  };

  const handleClear = () => {
    setAssociations([]);
    setError(null);
  };

  const handleDownloadTemplate = () => {
    const csv = 'input,output,repetitions\nDOG,ANIMAL,3\nCAT,PET,2\nBIRD,SKY,1';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_teaching_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="batch-teaching-panel">
      <div className="panel-header">
        <h4>Batch Teaching</h4>
        <p className="panel-subtitle">Upload CSV file to teach multiple associations at once</p>
      </div>

      <div className="upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          disabled={disabled || isProcessing}
        />

        <button
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isProcessing}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 12V4M9 4L6 7M9 4L12 7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 11V14C3 15.1046 3.89543 16 5 16H13C14.1046 16 15 15.1046 15 14V11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Upload CSV</span>
        </button>

        <button className="template-btn" onClick={handleDownloadTemplate}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2V10M8 10L5 7M8 10L11 7"
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
          <span>Download Template</span>
        </button>
      </div>

      {error && (
        <div className="batch-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4V8M8 11V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      )}

      {associations.length > 0 && (
        <div className="associations-preview">
          <div className="preview-header">
            <span className="preview-title">
              {associations.length} association{associations.length !== 1 ? 's' : ''} loaded
            </span>
            <button className="clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>

          <div className="associations-list">
            {associations.slice(0, 10).map((assoc, idx) => (
              <div key={idx} className="association-item">
                <span className="assoc-input">{assoc.input}</span>
                <span className="assoc-arrow">→</span>
                <span className="assoc-output">{assoc.output}</span>
                <span className="assoc-reps">×{assoc.repetitions}</span>
              </div>
            ))}
            {associations.length > 10 && (
              <div className="more-indicator">
                +{associations.length - 10} more...
              </div>
            )}
          </div>

          <button
            className="execute-btn"
            onClick={handleExecute}
            disabled={disabled || isProcessing}
          >
            {isProcessing ? (
              <>
                <span className="spinner" />
                Processing...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 8L7 11L12 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Execute Batch Teaching
              </>
            )}
          </button>
        </div>
      )}

      <div className="format-note">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M6 8V6M6 4V3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <div>
          <strong>CSV Format:</strong> input,output,repetitions
          <br />
          Example: DOG,ANIMAL,3
        </div>
      </div>
    </div>
  );
};
