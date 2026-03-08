'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Exercise } from '@/data/exercises';

interface ExerciseContextType {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
  completedExercises: Set<string>;
  markExerciseComplete: (exerciseId: string) => void;
  markExerciseIncomplete: (exerciseId: string) => void;
  isExerciseComplete: (exerciseId: string) => boolean;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const markExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => new Set(prev).add(exerciseId));
  };

  const markExerciseIncomplete = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });
  };

  const isExerciseComplete = (exerciseId: string): boolean => {
    return completedExercises.has(exerciseId);
  };

  return (
    <ExerciseContext.Provider
      value={{
        selectedExercise,
        setSelectedExercise,
        completedExercises,
        markExerciseComplete,
        markExerciseIncomplete,
        isExerciseComplete
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercise() {
  const context = useContext(ExerciseContext);
  if (context === undefined) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
}
