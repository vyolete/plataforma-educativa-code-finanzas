'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tutorial } from '@/components/tutorial/TutorialOverlay';

interface TutorialProgress {
  tutorialId: string;
  currentStep: number;
  completed: boolean;
  timestamp: number;
}

interface TutorialContextType {
  activeTutorial: Tutorial | null;
  startTutorial: (tutorial: Tutorial) => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  getTutorialProgress: (tutorialId: string) => TutorialProgress | null;
  isTutorialCompleted: (tutorialId: string) => boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);

  const startTutorial = (tutorial: Tutorial) => {
    setActiveTutorial(tutorial);
  };

  const completeTutorial = () => {
    if (activeTutorial) {
      // Save completion to localStorage
      const progress: TutorialProgress = {
        tutorialId: activeTutorial.id,
        currentStep: activeTutorial.steps.length - 1,
        completed: true,
        timestamp: Date.now()
      };
      localStorage.setItem(`tutorial_progress_${activeTutorial.id}`, JSON.stringify(progress));
      
      // Clear active tutorial
      setActiveTutorial(null);
    }
  };

  const skipTutorial = () => {
    setActiveTutorial(null);
  };

  const getTutorialProgress = (tutorialId: string): TutorialProgress | null => {
    const stored = localStorage.getItem(`tutorial_progress_${tutorialId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const isTutorialCompleted = (tutorialId: string): boolean => {
    const progress = getTutorialProgress(tutorialId);
    return progress?.completed || false;
  };

  return (
    <TutorialContext.Provider
      value={{
        activeTutorial,
        startTutorial,
        completeTutorial,
        skipTutorial,
        getTutorialProgress,
        isTutorialCompleted
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
