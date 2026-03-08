/**
 * Type definitions for Pyodide execution
 */

/**
 * Result of Python code execution
 */
export interface ExecutionResult {
  /** Standard output from the Python code */
  output: string;
  /** Return value of the last expression */
  value: any;
  /** Base64-encoded matplotlib plots */
  plots: string[];
  /** Error message if execution failed, null otherwise */
  error: string | null;
}

/**
 * Message types for worker communication
 */
export interface InitMessage {
  type: 'init';
  id: string;
}

export interface ExecuteMessage {
  type: 'execute';
  code: string;
  id: string;
}

export type WorkerMessage = InitMessage | ExecuteMessage;

/**
 * Response types from worker
 */
export interface ReadyResponse {
  type: 'ready';
  id: string;
}

export interface ResultResponse {
  type: 'result';
  result: ExecutionResult;
  id: string;
}

export interface ErrorResponse {
  type: 'error';
  error: string;
  id: string;
}

export type WorkerResponse = ReadyResponse | ResultResponse | ErrorResponse;
