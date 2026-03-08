import { render, screen, fireEvent } from '@testing-library/react';
import ResultsPanel from './ResultsPanel';
import { ExecutionProvider } from '@/contexts/ExecutionContext';
import { useExecution } from '@/contexts/ExecutionContext';
import type { ExecutionResult } from '@/lib/pyodide/types';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Helper component to set execution result
function TestWrapper({ result, children }: { result: ExecutionResult | null; children: React.ReactNode }) {
  return (
    <ExecutionProvider>
      <TestResultSetter result={result} />
      {children}
    </ExecutionProvider>
  );
}

function TestResultSetter({ result }: { result: ExecutionResult | null }) {
  const { setResult } = useExecution();
  React.useEffect(() => {
    setResult(result);
  }, [result, setResult]);
  return null;
}

// Import React for useEffect
import React from 'react';

describe('ResultsPanel', () => {
  it('renders empty state when no result', () => {
    render(
      <TestWrapper result={null}>
        <ResultsPanel />
      </TestWrapper>
    );

    expect(screen.getByText(/La salida de tu código aparecerá aquí/i)).toBeInTheDocument();
  });

  it('displays text output correctly', () => {
    const result: ExecutionResult = {
      output: 'Hello, World!\nThis is a test',
      value: null,
      plots: [],
      error: null,
    };

    render(
      <TestWrapper result={result}>
        <ResultsPanel />
      </TestWrapper>
    );

    expect(screen.getByText(/Hello, World!/)).toBeInTheDocument();
    expect(screen.getByText(/This is a test/)).toBeInTheDocument();
  });

  it('displays return value correctly', () => {
    const result: ExecutionResult = {
      output: '',
      value: 42,
      plots: [],
      error: null,
    };

    render(
      <TestWrapper result={result}>
        <ResultsPanel />
      </TestWrapper>
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText(/Valor de Retorno/i)).toBeInTheDocument();
  });

  it('displays errors in errors tab', () => {
    const result: ExecutionResult = {
      output: '',
      value: null,
      plots: [],
      error: 'NameError: name "x" is not defined',
    };

    render(
      <TestWrapper result={result}>
        <ResultsPanel />
      </TestWrapper>
    );

    // Should auto-switch to errors tab
    expect(screen.getByText(/NameError: name "x" is not defined/)).toBeInTheDocument();
    expect(screen.getByText(/Error de Ejecución/i)).toBeInTheDocument();
  });

  it('displays matplotlib plots', () => {
    const result: ExecutionResult = {
      output: '',
      value: null,
      plots: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='],
      error: null,
    };

    render(
      <TestWrapper result={result}>
        <ResultsPanel />
      </TestWrapper>
    );

    // Switch to visualizations tab
    fireEvent.click(screen.getByText(/Visualizaciones/i));

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('shows plot count badge when plots exist', () => {
    const result: ExecutionResult = {
      output: '',
      value: null,
      plots: ['plot1', 'plot2', 'plot3'],
      error: null,
    };

    render(
      <TestWrapper result={result}>
        <ResultsPanel />
      </TestWrapper>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('allows switching between tabs', () => {
    const result: ExecutionResult = {
      output: 'Test output',
      value: null,
      plots: [],
      error: null,
    };

    render(
      <TestWrapper result={result}>
        <ResultsPanel />
      </TestWrapper>
    );

    // Initially on output tab
    expect(screen.getByText('Test output')).toBeInTheDocument();

    // Switch to visualizations tab
    fireEvent.click(screen.getByText(/Visualizaciones/i));
    expect(screen.getByText(/Los gráficos matplotlib aparecerán aquí/i)).toBeInTheDocument();

    // Switch to errors tab
    fireEvent.click(screen.getByText(/Errores/i));
    expect(screen.getByText(/Los errores de ejecución aparecerán aquí/i)).toBeInTheDocument();

    // Switch back to output tab
    fireEvent.click(screen.getByText(/Salida/i));
    expect(screen.getByText('Test output')).toBeInTheDocument();
  });

  it('displays empty state message when code runs without output', () => {
    const result: ExecutionResult = {
      output: '',
      value: null,
      plots: [],
      error: null,
    };

    render(
      <TestWrapper result={result}>
        <ResultsPanel />
      </TestWrapper>
    );

    expect(screen.getByText(/El código se ejecutó correctamente pero no produjo ninguna salida/i)).toBeInTheDocument();
  });

  it('formats object return values as JSON', () => {
    const result: ExecutionResult = {
      output: '',
      value: { name: 'test', count: 42 },
      plots: [],
      error: null,
    };

    render(
      <TestWrapper result={result}>
        <ResultsPanel />
      </TestWrapper>
    );

    expect(screen.getByText(/"name"/)).toBeInTheDocument();
    expect(screen.getByText(/"test"/)).toBeInTheDocument();
  });
});
