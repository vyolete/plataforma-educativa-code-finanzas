'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetElement?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'type' | 'observe';
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  whatYouWillLearn: string[];
  whatYouWillBuild: string;
  steps: TutorialStep[];
}

interface TutorialOverlayProps {
  tutorial: Tutorial;
  onComplete: () => void;
  onSkip: () => void;
}

export default function TutorialOverlay({ tutorial, onComplete, onSkip }: TutorialOverlayProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const currentStep = tutorial.steps[currentStepIndex];
  const isLastStep = currentStepIndex === tutorial.steps.length - 1;
  const progress = ((currentStepIndex + 1) / tutorial.steps.length) * 100;

  // Update highlight position when step changes
  useEffect(() => {
    if (currentStep.targetElement) {
      const element = document.querySelector(currentStep.targetElement);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightRect(rect);
      } else {
        setHighlightRect(null);
      }
    } else {
      setHighlightRect(null);
    }
  }, [currentStep]);

  // Save progress to localStorage
  useEffect(() => {
    const progress = {
      tutorialId: tutorial.id,
      currentStep: currentStepIndex,
      timestamp: Date.now()
    };
    localStorage.setItem(`tutorial_progress_${tutorial.id}`, JSON.stringify(progress));
  }, [tutorial.id, currentStepIndex]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const getTooltipPosition = () => {
    if (!highlightRect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const position = currentStep.position || 'bottom';
    const padding = 20;

    switch (position) {
      case 'top':
        return {
          top: `${highlightRect.top - padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: `${highlightRect.bottom + padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          left: `${highlightRect.left - padding}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          left: `${highlightRect.right + padding}px`,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: `${highlightRect.bottom + padding}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
    }
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50">
      {/* Dark overlay with cutout for highlighted element */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Highlight box */}
      {highlightRect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute border-4 border-blue-500 rounded-lg shadow-lg shadow-blue-500/50 pointer-events-none"
          style={{
            top: highlightRect.top - 4,
            left: highlightRect.left - 4,
            width: highlightRect.width + 8,
            height: highlightRect.height + 8
          }}
        />
      )}

      {/* Tutorial card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-gray-800 rounded-lg shadow-2xl max-w-md w-full"
          style={getTooltipPosition()}
        >
          {/* Progress bar */}
          <div className="h-1 bg-gray-700 rounded-t-lg overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="p-6">
            {/* Step counter */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-blue-400">
                Paso {currentStepIndex + 1} de {tutorial.steps.length}
              </span>
              <button
                onClick={onSkip}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Saltar tutorial
              </button>
            </div>

            {/* Step title */}
            <h3 className="text-lg font-bold text-white mb-3">
              {currentStep.title}
            </h3>

            {/* Step content */}
            <div className="text-sm text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
              {currentStep.content}
            </div>

            {/* Action indicator */}
            {currentStep.action && (
              <div className="flex items-center gap-2 mb-6 text-xs text-yellow-400 bg-yellow-400/10 rounded px-3 py-2">
                {currentStep.action === 'click' && (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span>Haz clic en el elemento resaltado</span>
                  </>
                )}
                {currentStep.action === 'type' && (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Escribe en el elemento resaltado</span>
                  </>
                )}
                {currentStep.action === 'observe' && (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Observa el elemento resaltado</span>
                  </>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  currentStepIndex === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                Anterior
              </button>
              
              <button
                onClick={handleNext}
                className="flex-1 px-4 py-2 rounded font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                {isLastStep ? 'Completar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
