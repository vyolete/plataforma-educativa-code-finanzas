'use client';

interface ExerciseCompletionIndicatorProps {
  completed: boolean;
  exerciseTitle: string;
}

export default function ExerciseCompletionIndicator({
  completed,
  exerciseTitle
}: ExerciseCompletionIndicatorProps) {
  return (
    <div className="inline-flex items-center group relative">
      {completed ? (
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        {exerciseTitle}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  );
}
