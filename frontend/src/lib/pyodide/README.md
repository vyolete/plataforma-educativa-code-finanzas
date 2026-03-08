# Pyodide Integration

This module provides React hooks for executing Python code in the browser using Pyodide (WebAssembly).

## Features

- **In-browser Python execution**: No server required, runs entirely in the browser
- **Stdout/stderr capture**: Captures all console output from Python code
- **Matplotlib support**: Captures plots as base64-encoded PNG images
- **30-second timeout**: Automatically terminates long-running code (Requirement 5.3)
- **Error handling**: Provides detailed error messages with line numbers
- **Web Worker**: Runs in a separate thread to avoid blocking the UI

## Usage

### Basic Example

```tsx
import { usePyodide } from '@/lib/pyodide';

function CodeEditor() {
  const { ready, executing, executeCode } = usePyodide();
  const [code, setCode] = useState('print("Hello, World!")');
  const [result, setResult] = useState(null);
  
  const handleRun = async () => {
    try {
      const output = await executeCode(code);
      setResult(output);
    } catch (error) {
      console.error('Execution failed:', error);
    }
  };
  
  return (
    <div>
      <textarea 
        value={code} 
        onChange={(e) => setCode(e.target.value)}
        disabled={!ready}
      />
      <button 
        onClick={handleRun} 
        disabled={!ready || executing}
      >
        {executing ? 'Running...' : 'Run Code'}
      </button>
      
      {result && (
        <div>
          {result.error ? (
            <pre style={{ color: 'red' }}>{result.error}</pre>
          ) : (
            <>
              <pre>{result.output}</pre>
              {result.plots.map((plot, i) => (
                <img key={i} src={`data:image/png;base64,${plot}`} alt={`Plot ${i + 1}`} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

### With Financial Data (yfinance)

```tsx
const code = `
import yfinance as yf
import pandas as pd

# Download stock data
ticker = yf.Ticker("JPM")
data = ticker.history(period="1mo")

print(data.head())
print(f"\\nAverage closing price: ${data['Close'].mean():.2f}")
`;

const result = await executeCode(code);
console.log(result.output);
```

### With Matplotlib Plots

```tsx
const code = `
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)

plt.figure(figsize=(10, 6))
plt.plot(x, y)
plt.title('Sine Wave')
plt.xlabel('X')
plt.ylabel('Y')
plt.grid(True)
plt.show()
`;

const result = await executeCode(code);
// result.plots will contain base64-encoded PNG images
result.plots.forEach((plot, i) => {
  console.log(`Plot ${i + 1}:`, plot);
});
```

## API Reference

### `usePyodide()`

React hook that manages Pyodide execution.

**Returns:**
- `ready` (boolean): Whether Pyodide is loaded and ready to execute code
- `executing` (boolean): Whether code is currently being executed
- `executeCode(code: string)`: Function to execute Python code

### `executeCode(code: string): Promise<ExecutionResult>`

Executes Python code and returns the result.

**Parameters:**
- `code` (string): Python code to execute

**Returns:** Promise that resolves to `ExecutionResult`:
```typescript
interface ExecutionResult {
  output: string;        // Stdout/stderr output
  value: any;           // Return value of last expression
  plots: string[];      // Base64-encoded matplotlib plots
  error: string | null; // Error message if execution failed
}
```

**Throws:**
- Error if Pyodide is not ready

**Timeout:**
- Code execution is limited to 30 seconds (Requirement 5.3)
- If exceeded, returns an error: "Execution timeout: Code execution exceeded 30 seconds and was terminated."

## Requirements Mapping

This implementation satisfies the following requirements from the specification:

- **Requirement 5.1**: Permitir ejecutar código mediante botón o atajo de teclado
  - The `executeCode` function can be called from button clicks or keyboard shortcuts
  
- **Requirement 5.2**: Mostrar salida en Panel_Resultados dentro de 5 segundos
  - Execution typically completes in <5 seconds for normal code
  - Results include stdout, stderr, and plots
  
- **Requirement 5.3**: Limitar tiempo de ejecución a 30 segundos
  - Implemented via `setTimeout` with 30-second timeout
  - Returns error message if timeout is exceeded

## Architecture

```
┌─────────────────┐
│  React Component│
│   (usePyodide)  │
└────────┬────────┘
         │
         │ postMessage
         ▼
┌─────────────────┐
│  Web Worker     │
│ pyodide.worker  │
└────────┬────────┘
         │
         │ loadPyodide
         ▼
┌─────────────────┐
│    Pyodide      │
│  (WebAssembly)  │
└─────────────────┘
```

1. **React Component**: Uses `usePyodide` hook to manage state
2. **Web Worker**: Runs Pyodide in a separate thread to avoid blocking UI
3. **Pyodide**: Python interpreter compiled to WebAssembly

## Performance

- **Initial load time**: ~5-10 seconds (loads Pyodide + packages from CDN)
- **Execution time**: <5 seconds for typical exercises
- **Timeout**: 30 seconds maximum
- **Memory**: Runs in browser memory, no server resources used

## Limitations

- **yfinance**: Requires backend proxy to avoid CORS (see `/api/proxy/yfinance`)
- **Package availability**: Limited to packages available in Pyodide
- **Browser support**: Requires WebAssembly support (modern browsers only)
- **Memory**: Large datasets may cause browser memory issues

## Testing

Run tests with:

```bash
npm test src/lib/pyodide/usePyodide.test.ts
```

Tests cover:
- Hook initialization
- Code execution
- Timeout handling (30 seconds)
- Error handling
- Worker cleanup

## Files

- `usePyodide.ts`: Main React hook
- `types.ts`: TypeScript type definitions
- `index.ts`: Public API exports
- `usePyodide.test.ts`: Unit tests
- `README.md`: This file

## Related Files

- `frontend/src/workers/pyodide.worker.ts`: Web Worker implementation
- `frontend/src/workers/__tests__/pyodide.worker.test.ts`: Worker tests
