/**
 * Pyodide integration for Python execution in the browser
 * 
 * This module provides a React hook for executing Python code using Pyodide (WebAssembly).
 * 
 * Features:
 * - In-browser Python execution (no server required)
 * - Stdout/stderr capture
 * - Matplotlib plot capture as base64 images
 * - 30-second execution timeout
 * - Error handling with line numbers
 * 
 * @example
 * ```tsx
 * import { usePyodide } from '@/lib/pyodide';
 * 
 * function CodeEditor() {
 *   const { ready, executing, executeCode } = usePyodide();
 *   const [code, setCode] = useState('print("Hello")');
 *   const [result, setResult] = useState(null);
 *   
 *   const handleRun = async () => {
 *     const output = await executeCode(code);
 *     setResult(output);
 *   };
 *   
 *   return (
 *     <div>
 *       <textarea value={code} onChange={(e) => setCode(e.target.value)} />
 *       <button onClick={handleRun} disabled={!ready || executing}>
 *         Run
 *       </button>
 *       {result && <pre>{result.output}</pre>}
 *     </div>
 *   );
 * }
 * ```
 */

export { usePyodide } from './usePyodide';
export type { ExecutionResult } from './types';
