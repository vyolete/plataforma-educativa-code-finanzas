'use client';

import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { usePyodide } from '@/lib/pyodide/usePyodide';
import { useExecution } from '@/contexts/ExecutionContext';
import { useExercise } from '@/contexts/ExerciseContext';
import { validatePythonCode } from '@/lib/validators/pythonValidator';
import { checkPEP8Style } from '@/lib/validators/pep8Checker';
import ColabExportButton from '@/components/colab/ColabExportButton';
import ColabImportButton from '@/components/colab/ColabImportButton';
import type { editor } from 'monaco-editor';

export default function CodePanel() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { ready, executing, executeCode } = usePyodide();
  const { setResult, code, setCode } = useExecution();
  const { selectedExercise } = useExercise();

  // Load starter code when an exercise is selected
  useEffect(() => {
    if (selectedExercise && selectedExercise.starterCode) {
      setCode(selectedExercise.starterCode);
      // Update editor value if it's already mounted
      if (editorRef.current) {
        editorRef.current.setValue(selectedExercise.starterCode);
      }
    }
  }, [selectedExercise]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: any) => {
    editorRef.current = editor;
    
    // Configurar autocompletado Python con snippets financieros
    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions = [
          // yfinance snippets
          {
            label: 'yf.download',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'yf.download("${1:AAPL}", start="${2:2020-01-01}", end="${3:2023-12-31}")',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Descargar datos históricos de precios de acciones'
          },
          {
            label: 'yf.Ticker',
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: 'yf.Ticker("${1:AAPL}")',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Crear objeto Ticker para obtener información de una acción'
          },
          // pandas snippets
          {
            label: 'df.head',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'head(${1:5})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Mostrar primeras filas del DataFrame'
          },
          {
            label: 'df.describe',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'describe()',
            documentation: 'Estadísticas descriptivas del DataFrame'
          },
          {
            label: 'df.plot',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'plot(kind="${1:line}", title="${2:Gráfico}")',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Crear gráfico del DataFrame'
          },
          // matplotlib snippets
          {
            label: 'plt.plot',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'plt.plot(${1:x}, ${2:y})\nplt.xlabel("${3:X}")\nplt.ylabel("${4:Y}")\nplt.title("${5:Título}")\nplt.show()',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Crear gráfico de líneas con matplotlib'
          },
          {
            label: 'plt.figure',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'plt.figure(figsize=(${1:10}, ${2:6}))',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Crear nueva figura con tamaño personalizado'
          },
          // Financial analysis snippets
          {
            label: 'calcular_retornos',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '# Calcular retornos\nretornos = ${1:df}["Close"].pct_change()\nprint(retornos.describe())',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Calcular retornos porcentuales de precios de cierre'
          },
          {
            label: 'media_movil',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: '# Media móvil\n${1:df}["MA_${2:20}"] = ${1:df}["Close"].rolling(window=${2:20}).mean()',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Calcular media móvil de precios'
          }
        ];
        
        return { suggestions };
      }
    });
    
    // Atajo de teclado Ctrl+Enter para ejecutar código
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      handleExecute
    );
    
    // Validación de sintaxis en tiempo real
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
      validateSyntax(value, monaco, editor);
    });
  };

  const validateSyntax = (code: string, monaco: any, editor: editor.IStandaloneCodeEditor) => {
    const model = editor.getModel();
    if (!model) return;
    
    // Run Python syntax validation
    const syntaxResult = validatePythonCode(code);
    
    // Run PEP 8 style checking
    const styleResult = checkPEP8Style(code);
    
    // Combine all markers
    const allMarkers = [...syntaxResult.markers, ...styleResult.markers];
    
    // Convert our markers to Monaco markers
    const monacoMarkers = allMarkers.map(marker => ({
      severity: marker.severity === 'error' 
        ? monaco.MarkerSeverity.Error 
        : marker.severity === 'warning'
        ? monaco.MarkerSeverity.Warning
        : monaco.MarkerSeverity.Info,
      startLineNumber: marker.startLineNumber,
      startColumn: marker.startColumn,
      endLineNumber: marker.endLineNumber,
      endColumn: marker.endColumn,
      message: marker.message
    }));
    
    monaco.editor.setModelMarkers(model, 'python', monacoMarkers);
  };

  const handleExecute = async () => {
    if (!ready || executing) return;
    
    try {
      const result = await executeCode(code);
      
      // Set result in context for ResultsPanel to display
      setResult(result);
      
      // Log for debugging
      if (result.error) {
        console.error('Execution error:', result.error);
      } else {
        console.log('Execution successful');
      }
    } catch (error) {
      console.error('Failed to execute code:', error);
      // Set error result
      setResult({
        output: '',
        value: null,
        plots: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  const handleImport = (importedCode: string, metadata?: Record<string, any>) => {
    setCode(importedCode);
    if (editorRef.current) {
      editorRef.current.setValue(importedCode);
    }
    console.log('Imported code from Colab:', { metadata });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white" data-tutorial="code-panel">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-blue-400">Editor de Código</h2>
          {selectedExercise && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              Ejercicio: {selectedExercise.title}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ColabImportButton onImport={handleImport} />
          <ColabExportButton 
            code={code}
            metadata={{
              exercise_id: selectedExercise?.id !== undefined ? Number(selectedExercise.id) : undefined,
              module_id: selectedExercise?.moduleId
            }}
          />
          <button
            data-tutorial="execute-button"
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              ready && !executing
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 cursor-not-allowed'
            }`}
            onClick={handleExecute}
            disabled={!ready || executing}
          >
            {executing ? 'Ejecutando...' : ready ? 'Ejecutar (Ctrl+Enter)' : 'Cargando Pyodide...'}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden" data-tutorial="code-editor">
        <Editor
          height="100%"
          language="python"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 4,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            },
            parameterHints: {
              enabled: true
            },
            acceptSuggestionOnEnter: 'on',
            snippetSuggestions: 'top'
          }}
        />
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
        <span>Python 3.11 | Pyodide</span>
        <span className={ready ? 'text-green-400' : 'text-yellow-400'}>
          {ready ? '● Listo' : '● Inicializando...'}
        </span>
      </div>
    </div>
  );
}
