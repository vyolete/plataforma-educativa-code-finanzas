'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { ExecutionResult } from '@/lib/pyodide/types';

interface ExecutionContextType {
  result: ExecutionResult | null;
  setResult: (result: ExecutionResult | null) => void;
  code: string;
  setCode: (code: string) => void;
}

const ExecutionContext = createContext<ExecutionContextType | undefined>(undefined);

export function ExecutionProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [code, setCode] = useState('# Escribe tu código Python aquí\nimport yfinance as yf\nimport pandas as pd\n\nprint("Hola, mundo!")');

  return (
    <ExecutionContext.Provider value={{ result, setResult, code, setCode }}>
      {children}
    </ExecutionContext.Provider>
  );
}

export function useExecution() {
  const context = useContext(ExecutionContext);
  if (context === undefined) {
    throw new Error('useExecution must be used within an ExecutionProvider');
  }
  return context;
}
