'use client';

import { useState, useEffect } from 'react';
import { useExercise } from '@/contexts/ExerciseContext';
import { usePyodide } from '@/lib/pyodide/usePyodide';
import { validateExercise, formatValidationResult, ValidationResult } from '@/lib/pyodide/exerciseValidator';
import { submitExercise, updateSubmissionResult, trackHintUsage } from '@/lib/api/exercises';
import { useExecution } from '@/contexts/ExecutionContext';
import HintSystem from '@/components/hints/HintSystem';

export default function ExerciseView() {
  const { selectedExercise, markExerciseComplete } = useExercise();
  const { code } = useExecution();
  const { pyodide, ready: pyodideReady } = usePyodide();
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Reset validation result when exercise changes
  useEffect(() => {
    setValidationResult(null);
  }, [selectedExercise?.id]);

  if (!selectedExercise) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800 text-gray-400">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm">Selecciona un ejercicio para comenzar</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!pyodideReady || !pyodide) {
      alert('Pyodide no está listo. Por favor espera un momento.');
      return;
    }

    if (!code || code.trim() === '') {
      alert('Por favor escribe código antes de enviar.');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      // Validate exercise
      const result = await validateExercise(
        code,
        selectedExercise.testCases,
        pyodide
      );

      setValidationResult(result);

      // Submit to backend
      try {
        const submission = await submitExercise(Number(selectedExercise.id), { code });

        // Update submission with result
        await updateSubmissionResult(
          Number(selectedExercise.id),
          submission.id,
          {
            status: result.status === 'correct' ? 'correct' : 'incorrect',
            output: result.output,
            executionTimeMs: result.executionTimeMs
          }
        );
      } catch (apiError) {
        console.error('Error submitting to backend:', apiError);
        // Continue even if backend submission fails
      }

      // If correct, mark as complete and show celebration
      if (result.status === 'correct') {
        markExerciseComplete(selectedExercise.id);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

    } catch (error: any) {
      console.error('Error validating exercise:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsValidating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-400';
      case 'intermediate':
        return 'text-yellow-400';
      case 'advanced':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return difficulty;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white relative" data-tutorial="exercise-panel">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-lg p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2">¡Excelente!</h3>
            <p className="text-lg">Ejercicio completado correctamente</p>
            <p className="text-sm mt-2 opacity-90">+{selectedExercise.points} puntos</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-400 mb-1">
              {selectedExercise.title}
            </h3>
            <div className="flex items-center gap-3 text-xs">
              <span className={getDifficultyColor(selectedExercise.difficulty)}>
                {getDifficultyLabel(selectedExercise.difficulty)}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{selectedExercise.points} puntos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Description */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Descripción</h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            {selectedExercise.description}
          </p>
        </div>

        {/* Test cases */}
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">
            Casos de prueba ({selectedExercise.testCases.length})
          </h4>
          <div className="space-y-2">
            {selectedExercise.testCases.map((testCase, index) => (
              <div
                key={index}
                className="bg-gray-700/50 rounded p-3 text-xs"
              >
                <p className="text-gray-300 mb-1">{testCase.description}</p>
                {testCase.input && (
                  <div className="mb-1">
                    <span className="text-gray-500">Entrada: </span>
                    <code className="text-blue-400">{testCase.input}</code>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Salida esperada: </span>
                  <code className="text-green-400">{testCase.expectedOutput}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation result */}
        {validationResult && (
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Resultado</h4>
            <div
              className={`rounded p-3 text-xs font-mono whitespace-pre-wrap ${
                validationResult.status === 'correct'
                  ? 'bg-green-900/30 border border-green-500/30 text-green-300'
                  : 'bg-red-900/30 border border-red-500/30 text-red-300'
              }`}
            >
              {formatValidationResult(validationResult)}
            </div>
          </div>
        )}

        {/* Hints */}
        {selectedExercise.hints && selectedExercise.hints.length > 0 && (
          <div>
            <HintSystem
              hints={selectedExercise.hints}
              exerciseId={selectedExercise.id}
              onHintUsed={async (level) => {
                console.log(`Hint level ${level} used for exercise ${selectedExercise.id}`);
                // Track hint usage in backend
                await trackHintUsage(Number(selectedExercise.id), level);
              }}
            />
          </div>
        )}
      </div>

      {/* Footer with submit button */}
      <div className="px-4 py-3 border-t border-gray-700">
        <button
          onClick={handleSubmit}
          disabled={isValidating || !pyodideReady}
          className={`w-full py-2.5 px-4 rounded font-medium transition-colors ${
            isValidating || !pyodideReady
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isValidating ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Validando...
            </span>
          ) : !pyodideReady ? (
            'Cargando Python...'
          ) : (
            'Enviar solución'
          )}
        </button>
        
        <p className="text-xs text-gray-500 text-center mt-2">
          Tu código será validado automáticamente
        </p>
      </div>
    </div>
  );
}
