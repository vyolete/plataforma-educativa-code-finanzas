'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Hint {
  level: 1 | 2 | 3;
  content: string;
  type: 'conceptual' | 'example' | 'structure';
}

interface HintSystemProps {
  hints: Hint[];
  exerciseId: string;
  onHintUsed?: (level: number) => void;
}

export default function HintSystem({ hints, exerciseId, onHintUsed }: HintSystemProps) {
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [lastHintTime, setLastHintTime] = useState<number>(0);
  const [timeUntilNextHint, setTimeUntilNextHint] = useState<number>(0);
  
  const HINT_COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes in milliseconds

  // Load revealed hints from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`hints_revealed_${exerciseId}`);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setRevealedHints(data.revealed || []);
        setLastHintTime(data.lastTime || 0);
      } catch {
        // Ignore parse errors
      }
    }
  }, [exerciseId]);

  // Update cooldown timer
  useEffect(() => {
    if (lastHintTime === 0) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastHintTime;
      const remaining = Math.max(0, HINT_COOLDOWN_MS - elapsed);
      setTimeUntilNextHint(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastHintTime]);

  const canRevealNextHint = () => {
    const nextLevel = revealedHints.length + 1;
    if (nextLevel > hints.length) return false;
    
    const elapsed = Date.now() - lastHintTime;
    return lastHintTime === 0 || elapsed >= HINT_COOLDOWN_MS;
  };

  const handleRevealHint = () => {
    if (!canRevealNextHint()) return;

    const nextLevel = revealedHints.length + 1;
    const newRevealed = [...revealedHints, nextLevel];
    const now = Date.now();

    setRevealedHints(newRevealed);
    setLastHintTime(now);

    // Save to localStorage
    localStorage.setItem(`hints_revealed_${exerciseId}`, JSON.stringify({
      revealed: newRevealed,
      lastTime: now
    }));

    // Notify parent
    if (onHintUsed) {
      onHintUsed(nextLevel);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getHintIcon = (type: string) => {
    switch (type) {
      case 'conceptual':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'example':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'structure':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getHintLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'border-blue-500/30 bg-blue-500/10';
      case 2:
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 3:
        return 'border-orange-500/30 bg-orange-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const getHintLevelLabel = (level: number) => {
    switch (level) {
      case 1:
        return 'Pista Conceptual';
      case 2:
        return 'Ejemplo Similar';
      case 3:
        return 'Estructura de Solución';
      default:
        return 'Pista';
    }
  };

  if (hints.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Sistema de Pistas ({revealedHints.length}/{hints.length})
        </h4>
      </div>

      {/* Revealed hints */}
      <AnimatePresence>
        {revealedHints.map((level) => {
          const hint = hints[level - 1];
          if (!hint) return null;

          return (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`border rounded-lg p-4 ${getHintLevelColor(level)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 text-yellow-400 mt-0.5">
                  {getHintIcon(hint.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-yellow-400">
                      Nivel {level}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">
                      {getHintLevelLabel(level)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 whitespace-pre-line">
                    {hint.content}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Next hint button */}
      {revealedHints.length < hints.length && (
        <div>
          <button
            onClick={handleRevealHint}
            disabled={!canRevealNextHint()}
            className={`w-full py-2.5 px-4 rounded font-medium transition-colors ${
              canRevealNextHint()
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canRevealNextHint() ? (
              <>
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Mostrar siguiente pista (Nivel {revealedHints.length + 1})
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Espera {formatTime(timeUntilNextHint)} para la siguiente pista
                </span>
              </>
            )}
          </button>
          
          {!canRevealNextHint() && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Las pistas están limitadas para fomentar el pensamiento independiente
            </p>
          )}
        </div>
      )}

      {/* All hints revealed message */}
      {revealedHints.length === hints.length && (
        <div className="bg-gray-700/50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">
            Has usado todas las pistas disponibles. ¡Intenta resolver el ejercicio!
          </p>
        </div>
      )}
    </div>
  );
}
