'use client';

import { useState, useEffect } from 'react';
import { getMyProgress, type OverallProgress } from '@/lib/api/progress';
import ModuleProgressBar from './ModuleProgressBar';

export default function ProgressDashboard() {
  const [progress, setProgress] = useState<OverallProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyProgress();
        setProgress(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el progreso');
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-red-600 mr-3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-red-800 font-semibold">Error al cargar el progreso</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">No hay datos de progreso disponibles</p>
      </div>
    );
  }

  const overallPercentage = progress.total_exercises > 0
    ? (progress.total_exercises_completed / progress.total_exercises) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Tu Progreso General</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-6xl font-bold mb-2">
              {overallPercentage.toFixed(0)}%
            </div>
            <p className="text-blue-100 text-lg">
              {progress.total_exercises_completed} de {progress.total_exercises} ejercicios completados
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold mb-1">
              {progress.total_code_executions}
            </div>
            <p className="text-blue-100">
              ejecuciones de código
            </p>
          </div>
        </div>
      </div>

      {/* Module Progress Grid */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Progreso por Módulo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {progress.modules_progress.map((module) => {
            const completionPercentage = module.exercises_total > 0
              ? (module.exercises_completed / module.exercises_total) * 100
              : 0;

            return (
              <ModuleProgressBar
                key={module.module_id}
                moduleId={module.module_id}
                moduleName={module.module_name}
                exercisesCompleted={module.exercises_completed}
                exercisesTotal={module.exercises_total}
                completionPercentage={completionPercentage}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      {progress.recent_activity.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {progress.recent_activity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto text-gray-800 font-mono">
                    {activity.code_snippet.length > 100
                      ? `${activity.code_snippet.substring(0, 100)}...`
                      : activity.code_snippet}
                  </pre>
                  <p className="text-xs text-gray-500 mt-1">
                    Ejecutado {activity.execution_count} {activity.execution_count === 1 ? 'vez' : 'veces'}
                  </p>
                </div>
                <div className="ml-4 text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">
                    {new Date(activity.last_executed).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
