'use client';

import { useEffect, useState } from 'react';
import { getMyGrades, Grade } from '@/lib/api/grades';

export default function StudentGradesPage() {
  const [grade, setGrade] = useState<Grade | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const data = await getMyGrades();
      setGrade(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar calificaciones');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando calificaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!grade) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">No hay calificaciones disponibles</p>
        </div>
      </div>
    );
  }

  const components = [
    { name: 'Trabajo 1', value: grade.trabajo_1, weight: 20 },
    { name: 'Trabajo 2', value: grade.trabajo_2, weight: 20 },
    { name: 'Concurso', value: grade.concurso, weight: 20 },
    { name: 'Examen Final', value: grade.examen, weight: 20 },
    { name: 'Seguimiento', value: grade.seguimiento, weight: 20 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Calificaciones</h1>

      {/* Final Grade Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 mb-8 text-white">
        <div className="text-center">
          <p className="text-blue-100 text-sm uppercase tracking-wide mb-2">Nota Final</p>
          <p className="text-6xl font-bold">{grade.final_grade.toFixed(2)}</p>
          <p className="text-blue-100 mt-2">sobre 5.0</p>
        </div>
      </div>

      {/* Components Breakdown */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Desglose de Calificaciones</h2>
          <p className="text-sm text-gray-600 mt-1">Cada componente vale 20% de la nota final</p>
        </div>

        <div className="divide-y divide-gray-200">
          {components.map((component) => (
            <div key={component.name} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{component.name}</h3>
                  <p className="text-sm text-gray-500">Ponderación: {component.weight}%</p>
                </div>
                <div className="text-right">
                  {component.value !== null ? (
                    <>
                      <p className="text-2xl font-bold text-gray-900">
                        {component.value.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Contribución: {(component.value * 0.20).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-400 italic">Pendiente</p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {component.value !== null && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(component.value / 5.0) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Sobre el Seguimiento</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>El seguimiento se calcula automáticamente basado en:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Ejercicios completados (40%)</li>
                <li>Actividad de código (30%)</li>
                <li>Participación en tutoriales y quizzes (20%)</li>
                <li>Progreso en módulos (10%)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Última actualización: {new Date(grade.updated_at).toLocaleString('es-CO')}
      </div>
    </div>
  );
}
