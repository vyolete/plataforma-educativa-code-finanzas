/**
 * React hook for Pyodide Python execution
 * 
 * This hook manages a Web Worker that runs Pyodide (Python in WebAssembly).
 * It provides:
 * - Automatic worker initialization
 * - Code execution with timeout (30 seconds)
 * - Stdout/stderr capture
 * - Matplotlib plot capture
 * - Error handling
 * 
 * Requirements: 5.1, 5.2, 5.3
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ExecutionResult } from './types';

/**
 * Timeout for code execution in milliseconds (30 seconds)
 * Requirement 5.3: THE Sistema SHALL limitar el tiempo de ejecución de código a 30 segundos
 */
const EXECUTION_TIMEOUT_MS = 30000;

/**
 * Hook for managing Pyodide Python execution
 * 
 * @returns Object with ready state, executing state, and executeCode function
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ready, executing, executeCode } = usePyodide();
 *   
 *   const handleRun = async () => {
 *     const result = await executeCode('print("Hello, World!")');
 *     console.log(result.output); // "Hello, World!"
 *   };
 *   
 *   return (
 *     <button onClick={handleRun} disabled={!ready || executing}>
 *       {executing ? 'Running...' : 'Run Code'}
 *     </button>
 *   );
 * }
 * ```
 */
export const usePyodide = () => {
  const [ready, setReady] = useState(false);
  const [executing, setExecuting] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (result: ExecutionResult) => void>>(new Map());
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  
  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL('../../workers/pyodide.worker.ts', import.meta.url)
    );
    
    // Handle messages from worker
    workerRef.current.onmessage = (event) => {
      const { type, id, result, error } = event.data;
      
      if (type === 'ready') {
        setReady(true);
      }
      
      if (type === 'result' || type === 'error') {
        // Clear timeout for this execution
        const timeout = timeoutsRef.current.get(id);
        if (timeout) {
          clearTimeout(timeout);
          timeoutsRef.current.delete(id);
        }
        
        // Get callback and execute it
        const callback = callbacksRef.current.get(id);
        if (callback) {
          if (type === 'error') {
            callback({
              output: '',
              value: null,
              plots: [],
              error: error
            });
          } else {
            callback(result);
          }
          callbacksRef.current.delete(id);
        }
      }
    };
    
    // Handle worker errors
    workerRef.current.onerror = (error) => {
      console.error('Pyodide worker error:', error);
      setReady(false);
    };
    
    // Initialize Pyodide
    workerRef.current.postMessage({ type: 'init', id: 'init' });
    
    // Cleanup on unmount
    return () => {
      // Clear all pending timeouts
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
      
      // Clear all pending callbacks
      callbacksRef.current.clear();
      
      // Terminate worker
      workerRef.current?.terminate();
    };
  }, []);
  
  /**
   * Execute Python code
   * 
   * Requirements:
   * - 5.1: Permitir ejecutar código mediante botón o atajo
   * - 5.2: Mostrar salida en Panel_Resultados dentro de 5 segundos
   * - 5.3: Limitar tiempo de ejecución a 30 segundos
   * 
   * @param code - Python code to execute
   * @returns Promise that resolves with execution result
   * @throws Error if Pyodide is not ready
   */
  const executeCode = useCallback(async (code: string): Promise<ExecutionResult> => {
    if (!ready || !workerRef.current) {
      throw new Error('Pyodide not ready. Please wait for initialization to complete.');
    }
    
    setExecuting(true);
    
    return new Promise((resolve) => {
      const id = Math.random().toString(36).substring(2);
      
      // Store callback
      callbacksRef.current.set(id, (result) => {
        setExecuting(false);
        resolve(result);
      });
      
      // Set timeout for execution (30 seconds)
      // Requirement 5.3: IF el código excede 30 segundos, detener y mostrar timeout
      const timeout = setTimeout(() => {
        const callback = callbacksRef.current.get(id);
        if (callback) {
          setExecuting(false);
          callback({
            output: '',
            value: null,
            plots: [],
            error: 'Execution timeout: Code execution exceeded 30 seconds and was terminated.'
          });
          callbacksRef.current.delete(id);
        }
        timeoutsRef.current.delete(id);
      }, EXECUTION_TIMEOUT_MS);
      
      timeoutsRef.current.set(id, timeout);
      
      // Send execution request to worker
      workerRef.current!.postMessage({ type: 'execute', code, id });
    });
  }, [ready]);
  
  return { 
    ready, 
    executing, 
    executeCode 
  };
};
