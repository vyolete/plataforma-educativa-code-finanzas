# Pyodide Web Worker

This directory contains the Web Worker implementation for running Python code in the browser using Pyodide.

## Overview

The Pyodide worker runs Python code in a separate thread to avoid blocking the main UI thread. It loads Pyodide from CDN, configures matplotlib for base64 output, and handles code execution with proper error handling.

## Files

- `pyodide.worker.ts` - Main worker implementation
- `__tests__/pyodide.worker.test.ts` - Basic structural tests

## Usage

### Instantiating the Worker

```typescript
const worker = new Worker(
  new URL('./pyodide.worker.ts', import.meta.url)
);
```

### Initializing Pyodide

```typescript
// Send init message
worker.postMessage({ 
  type: 'init', 
  id: 'init-1' 
});

// Listen for ready response
worker.onmessage = (event) => {
  if (event.data.type === 'ready') {
    console.log('Pyodide is ready!');
  }
};
```

### Executing Python Code

```typescript
// Send execute message
worker.postMessage({
  type: 'execute',
  code: 'print("Hello, World!")',
  id: 'exec-1'
});

// Listen for result
worker.onmessage = (event) => {
  if (event.data.type === 'result') {
    const { output, value, plots, error } = event.data.result;
    
    if (error) {
      console.error('Execution error:', error);
    } else {
      console.log('Output:', output);
      console.log('Return value:', value);
      console.log('Plots:', plots); // Array of base64 images
    }
  }
};
```

## Message Types

### Init Message

```typescript
{
  type: 'init',
  id: string
}
```

Response:
```typescript
{
  type: 'ready' | 'error',
  id: string,
  error?: string
}
```

### Execute Message

```typescript
{
  type: 'execute',
  code: string,
  id: string
}
```

Response:
```typescript
{
  type: 'result',
  id: string,
  result: {
    output: string,      // stdout + stderr
    value: any,          // Return value of last expression
    plots: string[],     // Base64 encoded PNG images
    error: string | null // Error message if execution failed
  }
}
```

## Features

### Loaded Packages

The worker automatically loads these Python packages:
- `numpy` - Numerical computing
- `pandas` - Data manipulation
- `matplotlib` - Plotting and visualization

### Matplotlib Configuration

Matplotlib is configured to use the 'AGG' backend, which allows generating plots as base64-encoded PNG images without requiring a display.

### Output Capture

The worker captures:
- **stdout** - Standard output from `print()` statements
- **stderr** - Error messages and warnings
- **matplotlib plots** - All figures created during execution

### Error Handling

The worker handles:
- Syntax errors in Python code
- Runtime errors during execution
- Pyodide initialization failures
- Missing packages or imports

## Performance Considerations

- **Initial Load Time**: ~5-10 seconds to load Pyodide and packages
- **Execution Timeout**: No built-in timeout (implement in calling code if needed)
- **Memory**: Runs in separate thread, doesn't block UI
- **Caching**: Pyodide runtime is cached by the browser

## Example: Complete Integration

```typescript
import { useEffect, useRef, useState } from 'react';

function usePyodide() {
  const [ready, setReady] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  
  useEffect(() => {
    // Create worker
    workerRef.current = new Worker(
      new URL('./workers/pyodide.worker.ts', import.meta.url)
    );
    
    // Handle messages
    workerRef.current.onmessage = (event) => {
      if (event.data.type === 'ready') {
        setReady(true);
      }
    };
    
    // Initialize
    workerRef.current.postMessage({ type: 'init', id: 'init' });
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);
  
  const executeCode = (code: string): Promise<any> => {
    return new Promise((resolve) => {
      const id = Math.random().toString(36);
      
      const handler = (event: MessageEvent) => {
        if (event.data.id === id && event.data.type === 'result') {
          workerRef.current?.removeEventListener('message', handler);
          resolve(event.data.result);
        }
      };
      
      workerRef.current?.addEventListener('message', handler);
      workerRef.current?.postMessage({ type: 'execute', code, id });
    });
  };
  
  return { ready, executeCode };
}
```

## Troubleshooting

### Worker not loading
- Check that the CDN URL is accessible
- Verify browser supports WebAssembly
- Check browser console for CORS errors

### Packages not found
- Ensure packages are in Pyodide's package list
- Check package names are spelled correctly
- Some packages may not be available in Pyodide

### Plots not appearing
- Verify matplotlib is using 'AGG' backend
- Check that `plt.figure()` or `plt.plot()` was called
- Ensure figures weren't closed before capture

## References

- [Pyodide Documentation](https://pyodide.org/)
- [Pyodide Package List](https://pyodide.org/en/stable/usage/packages-in-pyodide.html)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
