/**
 * Export utilities for saving visualizations and data
 */

import html2canvas from 'html2canvas';

export interface ExportOptions {
  filename?: string;
  quality?: number;
  backgroundColor?: string;
}

/**
 * Export element as PNG image
 */
export const exportAsPNG = async (
  element: HTMLElement,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    filename = `synapticity-export-${Date.now()}.png`,
    quality = 1,
    backgroundColor = '#10131c',
  } = options;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor,
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
    });

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      },
      'image/png',
      quality
    );
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw error;
  }
};

/**
 * Export data as formatted text report
 */
export const exportAsTextReport = (
  weights: number[][],
  vocabulary: string[],
  metrics: any
): void => {
  const lines: string[] = [];
  
  lines.push('synaptiCITY Network Report');
  lines.push('='.repeat(50));
  lines.push('');
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push('');
  
  // Network structure
  lines.push('NETWORK STRUCTURE');
  lines.push('-'.repeat(50));
  lines.push(`Nodes: ${vocabulary.length}`);
  lines.push(`Vocabulary: ${vocabulary.join(', ')}`);
  lines.push('');
  
  // Weight matrix
  lines.push('WEIGHT MATRIX');
  lines.push('-'.repeat(50));
  lines.push('     ' + vocabulary.map(w => w.padEnd(10)).join(''));
  weights.forEach((row, i) => {
    const rowStr = vocabulary[i].padEnd(5) + row.map(w => w.toFixed(3).padEnd(10)).join('');
    lines.push(rowStr);
  });
  lines.push('');
  
  // Metrics
  if (metrics) {
    lines.push('PERFORMANCE METRICS');
    lines.push('-'.repeat(50));
    lines.push(`Total Connections: ${metrics.totalConnections}`);
    lines.push(`Network Density: ${(metrics.networkDensity * 100).toFixed(2)}%`);
    lines.push(`Average Weight: ${metrics.averageWeight.toFixed(4)}`);
    lines.push(`Max Weight: ${metrics.maxWeight.toFixed(4)}`);
    lines.push(`Min Weight: ${metrics.minWeight.toFixed(4)}`);
    lines.push(`Teaching Events: ${metrics.teachingEvents}`);
    lines.push(`Recall Accuracy: ${(metrics.recallAccuracy * 100).toFixed(2)}%`);
  }
  
  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `synapticity-report-${Date.now()}.txt`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Copy data to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Generate shareable URL with network state
 */
export const generateShareableURL = (state: any): string => {
  const compressed = btoa(JSON.stringify(state));
  const baseURL = window.location.origin + window.location.pathname;
  return `${baseURL}?state=${encodeURIComponent(compressed)}`;
};

/**
 * Load state from URL
 */
export const loadStateFromURL = (): any | null => {
  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get('state');
  
  if (!stateParam) return null;
  
  try {
    const decoded = atob(decodeURIComponent(stateParam));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to load state from URL:', error);
    return null;
  }
};
