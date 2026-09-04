/**
 * React hook for neural network state management
 * 
 * Main hook that provides complete neural network functionality
 * with state management, memoization, and undo/redo capabilities.
 * 
 * @module useNeuralNetwork
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import {
  NetworkState,
  RecallResult,
  TeachOptions,
  RecallOptions,
  DecayOptions,
  DebugData,
  NetworkStats,
  UseNeuralNetworkReturn,
} from '../types/network.types';

import {
  handleTeach,
  handleRecall,
  handleInterference,
  handleReset,
  handleDecay,
  handleUpdateParameters,
} from './useStateHandlers';

import { getDebugData } from '../utils/debug';
import { getNetworkStats } from '../utils/networkState';

/**
 * Configuration for useNeuralNetwork hook
 */
interface UseNeuralNetworkConfig {
  /** Number of nodes in network */
  numNodes?: number;
  /** Initial learning rate */
  learningRate?: number;
  /** Initial memory decay rate */
  memoryDecay?: number;
  /** Maximum undo history size */
  maxHistory?: number;
}

/**
 * Neural network React hook
 * 
 * Provides complete neural network functionality with state management,
 * undo/redo, and performance optimization through memoization.
 * 
 * @param config - Configuration options
 * @returns Network state and control functions
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const {
 *     state,
 *     teach,
 *     recall,
 *     addInterference,
 *     reset,
 *     applyDecay,
 *     getDebugData,
 *     undo,
 *     redo,
 *     canUndo,
 *     canRedo
 *   } = useNeuralNetwork({ numNodes: 6 });
 * 
 *   const handleTeachClick = () => {
 *     teach(0, 1); // DOG → ANIMAL
 *   };
 * 
 *   const handleRecallClick = () => {
 *     const result = recall(0);
 *     console.log('Predicted:', result.outputIndex);
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={handleTeachClick}>Teach</button>
 *       <button onClick={handleRecallClick}>Recall</button>
 *       <button onClick={undo} disabled={!canUndo}>Undo</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNeuralNetwork(
  config: UseNeuralNetworkConfig = {}
): UseNeuralNetworkReturn {
  const {
    numNodes = 6,
    learningRate = 0.1,
    memoryDecay = 0.01,
    maxHistory = 50,
  } = config;

  // Initialize state
  const [state, setState] = useState<NetworkState>(() =>
    handleReset(numNodes, learningRate, memoryDecay)
  );

  // Undo/redo stacks
  const [undoStack, setUndoStack] = useState<NetworkState[]>([]);
  const [redoStack, setRedoStack] = useState<NetworkState[]>([]);

  // Track if we're currently in an undo/redo operation
  const isUndoRedoRef = useRef(false);

  /**
   * Save current state to undo stack
   */
  const saveToUndoStack = useCallback((currentState: NetworkState) => {
    if (isUndoRedoRef.current) return; // Don't save during undo/redo

    setUndoStack((prev) => {
      const newStack = [...prev, currentState];
      // Limit stack size
      if (newStack.length > maxHistory) {
        return newStack.slice(-maxHistory);
      }
      return newStack;
    });
    // Clear redo stack when new action is taken
    setRedoStack([]);
  }, [maxHistory]);

  /**
   * Update state with undo tracking
   */
  const updateState = useCallback((newState: NetworkState) => {
    setState((prev) => {
      saveToUndoStack(prev);
      return newState;
    });
  }, [saveToUndoStack]);

  /**
   * Teach an association
   * 
   * Strengthens the connection between input and output nodes.
   * 
   * @param inputIndex - Input node index
   * @param outputIndex - Output node index
   * @param options - Teaching options
   */
  const teach = useCallback((
    inputIndex: number,
    outputIndex: number,
    options?: TeachOptions
  ) => {
    try {
      const newState = handleTeach(state, inputIndex, outputIndex, options);
      updateState(newState);
    } catch (error) {
      console.error('Teaching failed:', error);
      throw error;
    }
  }, [state, updateState]);

  /**
   * Recall (predict) from an input
   * 
   * Activates the input node and returns the predicted output.
   * 
   * @param inputIndex - Input node index
   * @param options - Recall options
   * @returns Recall result with prediction and confidence
   */
  const recall = useCallback((
    inputIndex: number,
    options?: RecallOptions
  ): RecallResult => {
    try {
      return handleRecall(state, inputIndex, options);
    } catch (error) {
      console.error('Recall failed:', error);
      throw error;
    }
  }, [state]);

  /**
   * Add interference
   * 
   * Teaches a competing association that interferes with existing memories.
   * 
   * @param inputIndex - Input node index
   * @param outputIndex - Competing output node index
   */
  const addInterference = useCallback((
    inputIndex: number,
    outputIndex: number
  ) => {
    try {
      const newState = handleInterference(state, inputIndex, outputIndex);
      updateState(newState);
    } catch (error) {
      console.error('Adding interference failed:', error);
      throw error;
    }
  }, [state, updateState]);

  /**
   * Reset the network
   * 
   * Creates a fresh network with random weights.
   * Clears undo/redo stacks.
   */
  const reset = useCallback(() => {
    try {
      const newState = handleReset(numNodes, learningRate, memoryDecay);
      setState(newState);
      setUndoStack([]);
      setRedoStack([]);
    } catch (error) {
      console.error('Reset failed:', error);
      throw error;
    }
  }, [numNodes, learningRate, memoryDecay]);

  /**
   * Apply memory decay
   * 
   * Reduces all connection weights to simulate forgetting.
   * 
   * @param rate - Decay rate (uses state default if not provided)
   */
  const applyDecay = useCallback((rate?: number) => {
    try {
      const options: DecayOptions = rate !== undefined ? { rate } : {};
      const newState = handleDecay(state, options);
      updateState(newState);
    } catch (error) {
      console.error('Applying decay failed:', error);
      throw error;
    }
  }, [state, updateState]);

  /**
   * Get debug data
   * 
   * Returns comprehensive debug information about the network state.
   * 
   * @returns Debug data object
   */
  const getDebug = useCallback((): DebugData => {
    return getDebugData(state);
  }, [state]);

  /**
   * Get network statistics
   * 
   * Returns statistical summary of the network.
   * 
   * @returns Network statistics
   */
  const getStats = useCallback((): NetworkStats => {
    return getNetworkStats(state);
  }, [state]);

  /**
   * Undo last action
   * 
   * Reverts to the previous state.
   */
  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    isUndoRedoRef.current = true;
    
    const previousState = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    setRedoStack((prev) => [...prev, state]);
    setUndoStack(newUndoStack);
    setState(previousState);

    // Reset flag after state update
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 0);
  }, [undoStack, state]);

  /**
   * Redo last undone action
   * 
   * Re-applies the previously undone state.
   */
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    isUndoRedoRef.current = true;

    const nextState = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    setUndoStack((prev) => [...prev, state]);
    setRedoStack(newRedoStack);
    setState(nextState);

    // Reset flag after state update
    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 0);
  }, [redoStack, state]);

  /**
   * Update network parameters
   * 
   * Safely updates learning rate and/or decay rate.
   * 
   * @param newLearningRate - New learning rate
   * @param newMemoryDecay - New memory decay rate
   */
  const updateParameters = useCallback((
    newLearningRate?: number,
    newMemoryDecay?: number
  ) => {
    try {
      const newState = handleUpdateParameters(
        state,
        newLearningRate,
        newMemoryDecay
      );
      updateState(newState);
    } catch (error) {
      console.error('Updating parameters failed:', error);
      throw error;
    }
  }, [state, updateState]);

  // Memoized values
  const canUndo = useMemo(() => undoStack.length > 0, [undoStack.length]);
  const canRedo = useMemo(() => redoStack.length > 0, [redoStack.length]);

  // Return hook interface
  return {
    state,
    teach,
    recall,
    addInterference,
    reset,
    applyDecay,
    getDebugData: getDebug,
    getStats,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}

/**
 * Hook for controlled network state
 * 
 * Use this when you want to manage the network state externally.
 * Similar to controlled components in React.
 * 
 * @param state - Externally managed network state
 * @param setState - State setter function
 * @returns Network control functions
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [networkState, setNetworkState] = useState(
 *     () => handleReset(6)
 *   );
 * 
 *   const { teach, recall } = useControlledNeuralNetwork(
 *     networkState,
 *     setNetworkState
 *   );
 * 
 *   // ... use teach and recall
 * }
 * ```
 */
export function useControlledNeuralNetwork(
  state: NetworkState,
  setState: (state: NetworkState) => void
) {
  const teach = useCallback((
    inputIndex: number,
    outputIndex: number,
    options?: TeachOptions
  ) => {
    const newState = handleTeach(state, inputIndex, outputIndex, options);
    setState(newState);
  }, [state, setState]);

  const recall = useCallback((
    inputIndex: number,
    options?: RecallOptions
  ): RecallResult => {
    return handleRecall(state, inputIndex, options);
  }, [state]);

  const addInterference = useCallback((
    inputIndex: number,
    outputIndex: number
  ) => {
    const newState = handleInterference(state, inputIndex, outputIndex);
    setState(newState);
  }, [state, setState]);

  const applyDecay = useCallback((rate?: number) => {
    const options: DecayOptions = rate !== undefined ? { rate } : {};
    const newState = handleDecay(state, options);
    setState(newState);
  }, [state, setState]);

  const getDebug = useCallback((): DebugData => {
    return getDebugData(state);
  }, [state]);

  const getStats = useCallback((): NetworkStats => {
    return getNetworkStats(state);
  }, [state]);

  return {
    teach,
    recall,
    addInterference,
    applyDecay,
    getDebugData: getDebug,
    getStats,
  };
}

export default useNeuralNetwork;
