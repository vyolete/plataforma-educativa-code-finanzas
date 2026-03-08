/**
 * Example component showing how to use ExerciseCompletionIndicator in a list
 * This is a reference implementation - not used in production
 */

'use client';

import ExerciseCompletionIndicator from './ExerciseCompletionIndicator';

interface Exercise {
  id: number;
  title: string;
  completed: boolean;
}

export default function ExerciseListExample() {
  const exercises: Exercise[] = [
    { id: 1, title: 'Variables y Tipos de Datos', completed: true },
    { id: 2, title: 'Operadores Aritméticos', completed: true },
    { id: 3, title: 'Strings y Formateo', completed: false },
    { id: 4, title: 'Listas y Tuplas', completed: false },
    { id: 5, title: 'Diccionarios', completed: false },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ejercicios del Módulo
      </h3>
      
      <div className="space-y-3">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExerciseCompletionIndicator
              completed={exercise.completed}
              exerciseTitle={exercise.title}
            />
            <span className={`flex-1 ${exercise.completed ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
              {exercise.title}
            </span>
            {exercise.completed && (
              <span className="text-xs text-green-600 font-medium">
                Completado
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
