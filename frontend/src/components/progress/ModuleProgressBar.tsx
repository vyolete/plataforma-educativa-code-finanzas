'use client';

interface ModuleProgressBarProps {
  moduleId: number;
  moduleName: string;
  exercisesCompleted: number;
  exercisesTotal: number;
  completionPercentage: number;
}

export default function ModuleProgressBar({
  moduleId,
  moduleName,
  exercisesCompleted,
  exercisesTotal,
  completionPercentage
}: ModuleProgressBarProps) {
  // Determine color based on completion percentage
  const getColorClass = () => {
    if (completionPercentage < 30) return 'bg-red-500';
    if (completionPercentage < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextColorClass = () => {
    if (completionPercentage < 30) return 'text-red-700';
    if (completionPercentage < 70) return 'text-yellow-700';
    return 'text-green-700';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900">
          Módulo {moduleId}: {moduleName}
        </h4>
        <span className={`text-sm font-bold ${getTextColorClass()}`}>
          {completionPercentage.toFixed(0)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2">
        <div
          className={`${getColorClass()} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-600">
        {exercisesCompleted} / {exercisesTotal} ejercicios completados
      </p>
    </div>
  );
}
