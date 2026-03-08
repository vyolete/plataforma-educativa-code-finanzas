'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextualTooltipProps {
  term: string;
  definition: string;
  example?: string;
  children: React.ReactNode;
}

export default function ContextualTooltip({ term, definition, example, children }: ContextualTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Calculate position (prefer bottom, but adjust if off-screen)
      let top = triggerRect.bottom + 8;
      let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

      // Adjust if tooltip goes off right edge
      if (left + tooltipRect.width > window.innerWidth - 16) {
        left = window.innerWidth - tooltipRect.width - 16;
      }

      // Adjust if tooltip goes off left edge
      if (left < 16) {
        left = 16;
      }

      // If tooltip goes off bottom, show above instead
      if (top + tooltipRect.height > window.innerHeight - 16) {
        top = triggerRect.top - tooltipRect.height - 8;
      }

      setPosition({ top, left });
    }
  }, [isVisible]);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="relative inline-block border-b border-dotted border-blue-400 text-blue-400 cursor-help"
      >
        {children}
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-xs"
            style={{ top: position.top, left: position.left }}
          >
            <div className="p-4">
              {/* Term */}
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-bold text-white">{term}</h4>
              </div>

              {/* Definition */}
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                {definition}
              </p>

              {/* Example */}
              {example && (
                <div className="bg-gray-800 rounded p-2 border border-gray-700">
                  <p className="text-xs text-gray-400 mb-1">Ejemplo:</p>
                  <code className="text-xs text-green-400 font-mono">
                    {example}
                  </code>
                </div>
              )}
            </div>

            {/* Arrow pointer */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 border-l border-t border-gray-700 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
