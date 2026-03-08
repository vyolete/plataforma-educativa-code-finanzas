'use client';

import { Tutorial } from '@/components/tutorial/TutorialOverlay';
import { useTutorial } from '@/contexts/TutorialContext';

interface TutorialCardProps {
  tutorial: Tutorial;
}

export default function TutorialCard({ tutorial }: TutorialCardProps) {
  const { startTutorial, isTutorialCompleted } = useTutorial();
  const isCompleted = isTutorialCompleted(tutorial.id);

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
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-blue-500/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">{tutorial.title}</h3>
          <p className="text-sm text-gray-400">{tutorial.description}</p>
        </div>
        {isCompleted && (
          <div className="flex-shrink-0">
            <div className="bg-green-500/20 text-green-400 rounded-full p-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Difficulty badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(tutorial.difficulty)}`}>
          {getDifficultyLabel(tutorial.difficulty)}
        </span>
      </div>

      {/* What you will learn */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Qué Aprenderás:</h4>
        <ul className="space-y-1">
          {tutorial.whatYouWillLearn.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-gray-400">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What you will build */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Qué Construirás:</h4>
        <p className="text-xs text-gray-400">{tutorial.whatYouWillBuild}</p>
      </div>

      {/* Steps count */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span>{tutorial.steps.length} pasos</span>
      </div>

      {/* Start button */}
      <button
        onClick={() => startTutorial(tutorial)}
        className="w-full py-2.5 px-4 rounded font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        {isCompleted ? 'Repetir Tutorial' : 'Comenzar Tutorial'}
      </button>
    </div>
  );
}
