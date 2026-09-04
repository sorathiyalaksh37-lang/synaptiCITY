export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  activation: number;
}

export interface Connection {
  from: string;
  to: string;
  weight: number;
}

export interface Association {
  input: string;
  output: string;
}

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Re-export NetworkState from utils
export type { NetworkState, TeachingEvent } from '../utils/teach';
