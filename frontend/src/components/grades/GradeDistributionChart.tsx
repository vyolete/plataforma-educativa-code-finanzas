'use client';

import { useMemo } from 'react';

interface GradeDistributionChartProps {
  grades: number[];
}

export default function GradeDistributionChart({ grades }: GradeDistributionChartProps) {
  const distribution = useMemo(() => {
    // Create bins: 0-1, 1-2, 2-3, 3-4, 4-5
    const bins = [
      { range: '0.0 - 1.0', min: 0, max: 1, count: 0, color: 'bg-red-500' },
      { range: '1.0 - 2.0', min: 1, max: 2, count: 0, color: 'bg-orange-500' },
      { range: '2.0 - 3.0', min: 2, max: 3, count: 0, color: 'bg-yellow-500' },
      { range: '3.0 - 4.0', min: 3, max: 4, count: 0, color: 'bg-blue-500' },
      { range: '4.0 - 5.0', min: 4, max: 5, count: 0, color: 'bg-green-500' },
    ];

    grades.forEach(grade => {
      const bin = bins.find(b => grade >= b.min && grade < b.max) || bins[bins.length - 1];
      bin.count++;
    });

    const maxCount = Math.max(...bins.map(b => b.count));

    return bins.map(bin => ({
      ...bin,
      percentage: maxCount > 0 ? (bin.count / maxCount) * 100 : 0,
    }));
  }, [grades]);

  if (grades.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Calificaciones</h3>
        <p className="text-gray-500 text-center py-8">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribución de Calificaciones</h3>
      
      <div className="space-y-4">
        {distribution.map((bin) => (
          <div key={bin.range}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{bin.range}</span>
              <span className="text-sm text-gray-600">{bin.count} estudiantes</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`${bin.color} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                style={{ width: `${bin.percentage}%` }}
              >
                {bin.count > 0 && (
                  <span className="text-xs font-medium text-white">
                    {((bin.count / grades.length) * 100).toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Promedio</p>
            <p className="text-xl font-bold text-gray-900">
              {(grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mediana</p>
            <p className="text-xl font-bold text-gray-900">
              {grades.sort((a, b) => a - b)[Math.floor(grades.length / 2)].toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Desv. Est.</p>
            <p className="text-xl font-bold text-gray-900">
              {(() => {
                const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
                const variance = grades.reduce((sum, grade) => sum + Math.pow(grade - avg, 2), 0) / grades.length;
                return Math.sqrt(variance).toFixed(2);
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
