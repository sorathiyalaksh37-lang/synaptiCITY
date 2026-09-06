/**
 * LocalStorage utility for persisting network state
 */

export interface NetworkState {
  weights: number[][];
  vocabulary: string[];
  learningRate: number;
  history: Array<{
    input: string;
    output: string;
    previousWeight: number;
    newWeight: number;
    deltaWeight: number;
    repetitions: number;
  }>;
  timestamp: number;
}

const STORAGE_KEY = 'synapticity_network_state';
const STORAGE_VERSION = '1.0';

export const saveNetworkState = (state: NetworkState): boolean => {
  try {
    const data = {
      version: STORAGE_VERSION,
      state,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save network state:', error);
    return false;
  }
};

export const loadNetworkState = (): NetworkState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    if (data.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, clearing old data');
      clearNetworkState();
      return null;
    }

    return data.state;
  } catch (error) {
    console.error('Failed to load network state:', error);
    return null;
  }
};

export const clearNetworkState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear network state:', error);
  }
};

export const hasStoredState = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

export const exportNetworkState = (state: NetworkState): void => {
  const dataStr = JSON.stringify(state, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `synapticity_export_${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importNetworkState = (file: File): Promise<NetworkState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const state = JSON.parse(content) as NetworkState;
        resolve(state);
      } catch (error) {
        reject(new Error('Invalid file format'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
