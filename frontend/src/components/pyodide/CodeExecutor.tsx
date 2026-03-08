/**
 * CodeExecutor Component
 * 
 * Example component demonstrating usePyodide hook usage.
 * This component provides a simple interface for executing Python code.
 * 
 * Features:
 * - Code input textarea
 * - Execute button with loading state
 * - Output display (stdout/stderr)
 * - Error display
 * - Matplotlib plot display
 * - Ready state indicator
 */

'use client';

import { useState } from 'react';
import { usePyodide, type ExecutionResult } from '@/lib/pyodide';

export function CodeExecutor() {
  const { ready, executing, executeCode } = usePyodide();
  const [code, setCode] = useState('print("Hello, World!")');
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const handleExecute = async () => {
    try {
      const output = await executeCode(code);
      setResult(output);
    } catch (error) {
      console.error('Execution failed:', error);
      setResult({
        output: '',
        value: null,
        plots: [],
        error: error instanceof Error ? error.message : String(error)
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter or Cmd+Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (ready && !executing) {
        handleExecute();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Status indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            ready ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
          }`}
        />
        <span className="text-sm text-gray-600">
          {ready ? 'Python Ready' : 'Loading Python...'}
        </span>
      </div>

      {/* Code input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="code-input" className="text-sm font-medium text-gray-700">
          Python Code
        </label>
        <textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!ready}
          className="w-full h-48 p-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          placeholder="Enter Python code here..."
        />
        <p className="text-xs text-gray-500">
          Press Ctrl+Enter (Cmd+Enter on Mac) to execute
        </p>
      </div>

      {/* Execute button */}
      <button
        onClick={handleExecute}
        disabled={!ready || executing}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {executing ? 'Running...' : 'Run Code'}
      </button>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4">
          {/* Error display */}
          {result.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-sm font-semibold text-red-800 mb-2">Error</h3>
              <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
                {result.error}
              </pre>
            </div>
          )}

          {/* Output display */}
          {!result.error && result.output && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Output</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {result.output}
              </pre>
            </div>
          )}

          {/* Plots display */}
          {!result.error && result.plots.length > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Plots ({result.plots.length})
              </h3>
              <div className="flex flex-col gap-4">
                {result.plots.map((plot, index) => (
                  <img
                    key={index}
                    src={`data:image/png;base64,${plot}`}
                    alt={`Plot ${index + 1}`}
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          {/* No output message */}
          {!result.error && !result.output && result.plots.length === 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">Code executed successfully (no output)</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
