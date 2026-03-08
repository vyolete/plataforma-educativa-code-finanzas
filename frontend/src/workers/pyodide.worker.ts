/**
 * Pyodide Web Worker
 * 
 * This worker handles Python code execution in the browser using Pyodide (WebAssembly).
 * It runs in a separate thread to avoid blocking the main UI thread.
 * 
 * Features:
 * - Loads Pyodide from CDN
 * - Loads required packages: numpy, pandas, matplotlib
 * - Configures matplotlib for base64 image output
 * - Captures stdout, stderr, and matplotlib plots
 * - Handles code execution with error handling
 */

// Type definitions for messages
interface InitMessage {
  type: 'init';
  id: string;
}

interface ExecuteMessage {
  type: 'execute';
  code: string;
  id: string;
}

type WorkerMessage = InitMessage | ExecuteMessage;

interface ExecutionResult {
  output: string;
  value: any;
  plots: string[];
  error: string | null;
}

// Pyodide instance and state
let pyodide: any = null;
let pyodideReady = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Load Pyodide and required packages
 */
async function loadPyodide(): Promise<void> {
  if (pyodide) return;
  
  if (loadingPromise) {
    await loadingPromise;
    return;
  }
  
  loadingPromise = (async () => {
    try {
      // Load Pyodide from CDN
      // @ts-ignore
      self.importScripts('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
      // @ts-ignore
      pyodide = await self.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });

      // Load required packages
      await pyodide.loadPackage(['numpy', 'pandas', 'matplotlib']);
      
      // Configure matplotlib for AGG backend (non-interactive, for base64 output)
      await pyodide.runPythonAsync(`
        import matplotlib
        matplotlib.use('AGG')
        import matplotlib.pyplot as plt
        import io
        import base64
        import sys
        from io import StringIO
      `);
      
      pyodideReady = true;
    } catch (error) {
      pyodideReady = false;
      throw error;
    }
  })();
  
  await loadingPromise;
}

/**
 * Execute Python code and capture output
 */
async function executeCode(code: string): Promise<ExecutionResult> {
  if (!pyodide || !pyodideReady) {
    throw new Error('Pyodide not ready');
  }
  
  try {
    // Reset stdout to capture new output
    await pyodide.runPythonAsync(`
      import sys
      from io import StringIO
      sys.stdout = StringIO()
      sys.stderr = StringIO()
    `);
    
    // Execute user code
    const result = await pyodide.runPythonAsync(code);
    
    // Get stdout output
    const stdout = await pyodide.runPythonAsync(`
      sys.stdout.getvalue()
    `);
    
    // Get stderr output
    const stderr = await pyodide.runPythonAsync(`
      sys.stderr.getvalue()
    `);
    
    // Capture matplotlib plots as base64 images
    const plots = await pyodide.runPythonAsync(`
      import matplotlib.pyplot as plt
      import io
      import base64
      
      figures = []
      for i in plt.get_fignums():
          fig = plt.figure(i)
          buf = io.BytesIO()
          fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
          buf.seek(0)
          img_str = base64.b64encode(buf.read()).decode()
          figures.append(img_str)
          plt.close(fig)
      
      figures
    `);
    
    // Combine stdout and stderr
    const output = stdout + (stderr ? '\n' + stderr : '');
    
    return {
      output: output,
      value: result,
      plots: plots.toJs ? plots.toJs() : [],
      error: null
    };
  } catch (error: any) {
    // Get any stderr output that might have been captured before the error
    let stderr = '';
    try {
      stderr = await pyodide.runPythonAsync(`sys.stderr.getvalue()`);
    } catch (e) {
      // Ignore if we can't get stderr
    }
    
    return {
      output: stderr,
      value: null,
      plots: [],
      error: error.message || String(error)
    };
  }
}

/**
 * Message handler for the worker
 */
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, id } = event.data;
  
  if (type === 'init') {
    try {
      await loadPyodide();
      self.postMessage({ 
        type: 'ready', 
        id 
      });
    } catch (error: any) {
      self.postMessage({ 
        type: 'error', 
        error: error.message || String(error),
        id 
      });
    }
  }
  
  if (type === 'execute') {
    if (!pyodideReady) {
      self.postMessage({ 
        type: 'error', 
        error: 'Pyodide not ready. Please wait for initialization to complete.',
        id 
      });
      return;
    }
    
    try {
      const { code } = event.data as ExecuteMessage;
      const result = await executeCode(code);
      
      self.postMessage({
        type: 'result',
        result,
        id
      });
    } catch (error: any) {
      self.postMessage({
        type: 'result',
        result: {
          output: '',
          value: null,
          plots: [],
          error: error.message || String(error)
        },
        id
      });
    }
  }
};

// Export empty object to make this a module
export {};
