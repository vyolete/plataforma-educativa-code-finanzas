'use client';

import { useState, useEffect } from 'react';
import { useExecution } from '@/contexts/ExecutionContext';
import { generateSuccessFeedback, generateErrorFeedback, generateQualitySuggestions } from '@/lib/feedback/feedbackGenerator';
import type { FeedbackMessage } from '@/lib/feedback/feedbackGenerator';
import Image from 'next/image';

type TabType = 'output' | 'visualizations' | 'errors' | 'feedback';

export default function ResultsPanel() {
  const { result, code } = useExecution();
  const [activeTab, setActiveTab] = useState<TabType>('feedback');
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [qualitySuggestions, setQualitySuggestions] = useState<string[]>([]);

  // Determine which tabs should be active based on available data
  const hasOutput = result && (result.output || result.value !== null);
  const hasPlots = result && result.plots && result.plots.length > 0;
  const hasError = result && result.error;

  // Generate feedback when result changes
  useEffect(() => {
    if (!result) {
      setFeedback(null);
      setQualitySuggestions([]);
      return;
    }

    if (result.error) {
      setFeedback(generateErrorFeedback(result.error));
      setActiveTab('feedback');
    } else {
      setFeedback(generateSuccessFeedback(result.output || '', hasPlots || false));
      setQualitySuggestions(generateQualitySuggestions(code));
      setActiveTab('feedback');
    }
  }, [result, code, hasPlots]);

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white" data-tutorial="results-panel">
      {/* Header with Tabs */}
      <div className="border-b border-gray-700">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-blue-400 mb-3">Resultados</h2>
          
          {/* Tabs */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('feedback')}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                activeTab === 'feedback'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Retroalimentación
              {feedback && (
                <span className="ml-2">{feedback.icon}</span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('output')}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                activeTab === 'output'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Salida
              {hasOutput && !hasError && (
                <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('visualizations')}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                activeTab === 'visualizations'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Visualizaciones
              {hasPlots && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-500 text-white rounded-full">
                  {result.plots.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('errors')}
              className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                activeTab === 'errors'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              Errores
              {hasError && (
                <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="p-4">
            {!feedback ? (
              <div className="text-gray-500 italic text-sm">
                Ejecuta tu código para recibir retroalimentación...
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main Feedback Message */}
                <div className={`rounded-lg p-4 border-2 ${
                  feedback.type === 'success' 
                    ? 'bg-green-900/20 border-green-500/50' 
                    : feedback.type === 'error'
                    ? 'bg-red-900/20 border-red-500/50'
                    : feedback.type === 'warning'
                    ? 'bg-yellow-900/20 border-yellow-500/50'
                    : 'bg-blue-900/20 border-blue-500/50'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className="text-3xl flex-shrink-0">
                      {feedback.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        feedback.type === 'success' 
                          ? 'text-green-400' 
                          : feedback.type === 'error'
                          ? 'text-red-400'
                          : feedback.type === 'warning'
                          ? 'text-yellow-400'
                          : 'text-blue-400'
                      }`}>
                        {feedback.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3">
                        {feedback.message}
                      </p>
                      
                      {/* Suggestions */}
                      {feedback.suggestions && feedback.suggestions.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {feedback.suggestions.map((suggestion, index) => (
                            <div key={index} className="text-sm text-gray-400">
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Code Quality Suggestions */}
                {feedback.type === 'success' && qualitySuggestions.length > 0 && (
                  <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                      Sugerencias de Mejora
                    </h4>
                    <div className="space-y-1">
                      {qualitySuggestions.map((suggestion, index) => (
                        <div key={index} className="text-sm text-gray-300">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {feedback.type === 'success' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('output')}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                    >
                      Ver Salida
                    </button>
                    {hasPlots && (
                      <button
                        onClick={() => setActiveTab('visualizations')}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                      >
                        Ver Gráficos
                      </button>
                    )}
                  </div>
                )}

                {feedback.type === 'error' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('errors')}
                      className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-sm transition-colors"
                    >
                      Ver Error Completo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Output Tab */}
        {activeTab === 'output' && (
          <div className="p-4">
            {!result ? (
              <div className="text-gray-500 italic text-sm">
                La salida de tu código aparecerá aquí...
              </div>
            ) : (
              <div className="space-y-4">
                {/* Standard Output */}
                {result.output && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Salida del Programa</h3>
                    <pre className="bg-gray-800 rounded p-3 font-mono text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                      {result.output}
                    </pre>
                  </div>
                )}

                {/* Return Value */}
                {result.value !== null && result.value !== undefined && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Valor de Retorno</h3>
                    <pre className="bg-gray-800 rounded p-3 font-mono text-sm text-green-400 whitespace-pre-wrap overflow-x-auto">
                      {typeof result.value === 'object' 
                        ? JSON.stringify(result.value, null, 2)
                        : String(result.value)}
                    </pre>
                  </div>
                )}

                {/* Empty state */}
                {!result.output && result.value === null && !result.error && (
                  <div className="text-gray-500 italic text-sm">
                    El código se ejecutó correctamente pero no produjo ninguna salida.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Visualizations Tab */}
        {activeTab === 'visualizations' && (
          <div className="p-4">
            {!result || !hasPlots ? (
              <div className="text-gray-500 italic text-sm">
                Los gráficos matplotlib aparecerán aquí...
              </div>
            ) : (
              <div className="space-y-4">
                {result.plots.map((plot, index) => (
                  <div key={index} className="bg-gray-800 rounded p-3">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">
                      Gráfico {index + 1}
                    </h3>
                    <div className="flex justify-center">
                      <Image
                        src={plot}
                        alt={`Gráfico ${index + 1}`}
                        width={800}
                        height={600}
                        className="max-w-full h-auto rounded"
                        unoptimized
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <div className="p-4">
            {!result || !hasError ? (
              <div className="text-gray-500 italic text-sm">
                Los errores de ejecución aparecerán aquí...
              </div>
            ) : (
              <div className="bg-red-900/20 border border-red-500/50 rounded p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-red-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-400 mb-2">
                      Error de Ejecución
                    </h3>
                    <pre className="font-mono text-sm text-red-300 whitespace-pre-wrap overflow-x-auto">
                      {result.error}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
