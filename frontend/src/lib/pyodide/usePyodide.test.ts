/**
 * Unit tests for usePyodide hook
 * 
 * Tests cover:
 * - Hook initialization
 * - Code execution
 * - Timeout handling (30 seconds)
 * - Error handling
 * - Cleanup
 */

import { renderHook, waitFor } from '@testing-library/react';
import { usePyodide } from './usePyodide';
import type { ExecutionResult } from './types';

// Mock Worker
class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((error: ErrorEvent) => void) | null = null;
  
  postMessage(message: any) {
    // Simulate async worker response
    setTimeout(() => {
      if (message.type === 'init') {
        this.onmessage?.({
          data: { type: 'ready', id: message.id }
        } as MessageEvent);
      } else if (message.type === 'execute') {
        // Simulate successful execution
        this.onmessage?.({
          data: {
            type: 'result',
            id: message.id,
            result: {
              output: 'Hello, World!\n',
              value: null,
              plots: [],
              error: null
            }
          }
        } as MessageEvent);
      }
    }, 10);
  }
  
  terminate() {
    // Mock terminate
  }
}

// Mock Worker constructor
global.Worker = MockWorker as any;

describe('usePyodide', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  
  it('should initialize with ready=false and executing=false', () => {
    const { result } = renderHook(() => usePyodide());
    
    expect(result.current.ready).toBe(false);
    expect(result.current.executing).toBe(false);
    expect(typeof result.current.executeCode).toBe('function');
  });
  
  it('should set ready=true after worker initialization', async () => {
    const { result } = renderHook(() => usePyodide());
    
    // Fast-forward timers to trigger worker response
    jest.advanceTimersByTime(20);
    
    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });
  });
  
  it('should execute code successfully', async () => {
    const { result } = renderHook(() => usePyodide());
    
    // Wait for ready
    jest.advanceTimersByTime(20);
    await waitFor(() => expect(result.current.ready).toBe(true));
    
    // Execute code
    const executePromise = result.current.executeCode('print("Hello, World!")');
    
    // Fast-forward to get result
    jest.advanceTimersByTime(20);
    
    const executionResult = await executePromise;
    
    expect(executionResult).toEqual({
      output: 'Hello, World!\n',
      value: null,
      plots: [],
      error: null
    });
  });
  
  it('should set executing=true during execution', async () => {
    const { result } = renderHook(() => usePyodide());
    
    // Wait for ready
    jest.advanceTimersByTime(20);
    await waitFor(() => expect(result.current.ready).toBe(true));
    
    // Start execution
    const executePromise = result.current.executeCode('print("test")');
    
    // Check executing state
    await waitFor(() => {
      expect(result.current.executing).toBe(true);
    });
    
    // Complete execution
    jest.advanceTimersByTime(20);
    await executePromise;
    
    // Check executing is false after completion
    expect(result.current.executing).toBe(false);
  });
  
  it('should throw error if executeCode called before ready', async () => {
    const { result } = renderHook(() => usePyodide());
    
    // Try to execute before ready
    await expect(result.current.executeCode('print("test")')).rejects.toThrow(
      'Pyodide not ready'
    );
  });
  
  it('should timeout after 30 seconds', async () => {
    const { result } = renderHook(() => usePyodide());
    
    // Wait for ready
    jest.advanceTimersByTime(20);
    await waitFor(() => expect(result.current.ready).toBe(true));
    
    // Mock worker that never responds
    const mockWorker = new MockWorker();
    mockWorker.postMessage = jest.fn(); // Don't send response
    (result.current as any).workerRef = { current: mockWorker };
    
    // Start execution
    const executePromise = result.current.executeCode('while True: pass');
    
    // Fast-forward 30 seconds
    jest.advanceTimersByTime(30000);
    
    const executionResult = await executePromise;
    
    expect(executionResult.error).toContain('timeout');
    expect(executionResult.error).toContain('30 seconds');
  });
  
  it('should handle worker errors', async () => {
    const { result } = renderHook(() => usePyodide());
    
    // Wait for ready
    jest.advanceTimersByTime(20);
    await waitFor(() => expect(result.current.ready).toBe(true));
    
    // Mock worker that returns error
    const mockWorker = new MockWorker();
    mockWorker.postMessage = function(message: any) {
      setTimeout(() => {
        this.onmessage?.({
          data: {
            type: 'error',
            id: message.id,
            error: 'SyntaxError: invalid syntax'
          }
        } as MessageEvent);
      }, 10);
    };
    
    // Replace worker
    (result.current as any).workerRef = { current: mockWorker };
    
    // Execute code with error
    const executePromise = result.current.executeCode('print(');
    
    jest.advanceTimersByTime(20);
    
    const executionResult = await executePromise;
    
    expect(executionResult.error).toBe('SyntaxError: invalid syntax');
    expect(executionResult.output).toBe('');
    expect(executionResult.plots).toEqual([]);
  });
  
  it('should cleanup worker on unmount', () => {
    const { unmount } = renderHook(() => usePyodide());
    
    const terminateSpy = jest.spyOn(MockWorker.prototype, 'terminate');
    
    unmount();
    
    expect(terminateSpy).toHaveBeenCalled();
  });
  
  it('should handle multiple concurrent executions', async () => {
    const { result } = renderHook(() => usePyodide());
    
    // Wait for ready
    jest.advanceTimersByTime(20);
    await waitFor(() => expect(result.current.ready).toBe(true));
    
    // Start multiple executions
    const promise1 = result.current.executeCode('print("First")');
    const promise2 = result.current.executeCode('print("Second")');
    
    jest.advanceTimersByTime(20);
    
    const [result1, result2] = await Promise.all([promise1, promise2]);
    
    expect(result1.output).toBe('Hello, World!\n');
    expect(result2.output).toBe('Hello, World!\n');
  });
});
