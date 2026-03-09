'use client';

import { useMemo, useState, useEffect } from 'react';
import { getExercisesByModule, type Exercise } from '@/lib/api/exercises';
import { useExercise } from '@/contexts/ExerciseContext';
import ExerciseView from './ExerciseView';

interface ExercisesPanelProps {
  moduleId?: string;
}

export default function ExercisesPanel({ moduleId = '1' }: ExercisesPanelProps) {
  const { 
    selectedExercise, 
    setSelectedExercise, 
    isExerciseComplete 
  } = useExercise();
  const [showExerciseView, setShowExerciseView] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch exercises for the current module
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Uncomment when API is ready
        // const data = await getExercisesByModule(moduleId);
        // setExercises(data);
        
        // Temporary: Use empty array until API is connected
        setExercises([]);
      } catch (err) {
        console.error('Error loading exercises:', err);
        setError('Error al cargar los ejercicios');
        setExercises([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [moduleId]);

  // Calculate completion stats
  const completedCount = useMemo(() => {
    return exercises.filter(ex => isExerciseComplete(ex.id)).length;
  }, [exercises, isExerciseComplete]);

  const completionPercentage = useMemo(() => {
    if (exercises.length === 0) return 0;
    return Math.round((completedCount / exercises.length) * 100);
  }, [completedCount, exercises.length]);

  const handleExerciseSelect = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setShowExerciseView(true);
    }
  };

  const handleBackToList = () => {
    setShowExerciseView(false);
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Get difficulty label
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

  // Show exercise view if an exercise is selected
  if (showExerciseView && selectedExercise) {
    return (
      <div className="h-full flex flex-col bg-gray-800">
        {/* Back button */}
        <div className="px-4 py-3 border-b border-gray-700">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a ejercicios
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <ExerciseView />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-blue-400">Ejercicios</h2>
        <p className="text-sm text-gray-400 mt-1">Módulo {moduleId}</p>
      </div>

      {/* Exercises List */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <p className="text-sm">Cargando ejercicios...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-400">
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs mt-2 text-blue-400 hover:text-blue-300"
            >
              Reintentar
            </button>
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No hay ejercicios disponibles</p>
            <p className="text-xs mt-1">para este módulo</p>
          </div>
        ) : (
          <div className="space-y-2">
            {exercises.map((exercise) => {
              const isCompleted = isExerciseComplete(exercise.id);
              const isSelected = selectedExercise?.id === exercise.id;

              return (
                <button
                  key={exercise.id}
                  onClick={() => handleExerciseSelect(exercise.id)}
                  className={`w-full text-left px-3 py-2.5 rounded transition-colors ${
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-400'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Completion indicator */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-500'
                      }`}
                    >
                      {isCompleted && (
                        <svg
                          className="w-full h-full text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Exercise info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium truncate">
                          {exercise.title}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-blue-300">●</span>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-400 line-clamp-2 mb-1.5">
                        {exercise.description}
                      </p>

                      <div className="flex items-center gap-2">
                        {/* Difficulty badge */}
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded border ${getDifficultyColor(
                            exercise.difficulty
                          )}`}
                        >
                          {getDifficultyLabel(exercise.difficulty)}
                        </span>

                        {/* Points */}
                        <span className="text-xs text-gray-400">
                          {exercise.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer with progress */}
      <div className="px-4 py-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
          <span>
            {completedCount} / {exercises.length} completados
          </span>
          <span className="text-blue-400 font-medium">
            {completionPercentage}%
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-500 h-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
