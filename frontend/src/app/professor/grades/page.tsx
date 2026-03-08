'use client';

import { useEffect, useState } from 'react';
import { 
  getSemesterGrades, 
  updateUserGrades, 
  recalculateSemesterSeguimiento,
  exportSemesterGrades,
  GradeWithUser,
  GradeUpdate 
} from '@/lib/api/grades';
import GradeDistributionChart from '@/components/grades/GradeDistributionChart';

export default function ProfessorGradesPage() {
  const [grades, setGrades] = useState<GradeWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [semesterId, setSemesterId] = useState<number>(1); // TODO: Get from context or selection
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<GradeUpdate>({});
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    loadGrades();
  }, [semesterId]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      const data = await getSemesterGrades(semesterId);
      setGrades(data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar calificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId: number, grade: GradeWithUser) => {
    setEditingUserId(userId);
    setEditValues({
      trabajo_1: grade.trabajo_1 ?? undefined,
      trabajo_2: grade.trabajo_2 ?? undefined,
      concurso: grade.concurso ?? undefined,
      examen: grade.examen ?? undefined,
      seguimiento: grade.seguimiento ?? undefined,
    });
  };

  const handleSave = async (userId: number) => {
    try {
      await updateUserGrades(userId, editValues);
      setEditingUserId(null);
      setEditValues({});
      await loadGrades();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al actualizar calificaciones');
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditValues({});
  };

  const handleRecalculateSeguimiento = async () => {
    if (!confirm('¿Recalcular seguimiento para todos los estudiantes?')) return;
    
    try {
      setRecalculating(true);
      await recalculateSemesterSeguimiento(semesterId);
      await loadGrades();
      alert('Seguimiento recalculado exitosamente');
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al recalcular seguimiento');
    } finally {
      setRecalculating(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportSemesterGrades(semesterId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calificaciones_semestre_${semesterId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al exportar calificaciones');
    }
  };

  const calculateStats = () => {
    if (grades.length === 0) return { avg: 0, min: 0, max: 0 };
    
    const finalGrades = grades.map(g => g.final_grade);
    const avg = finalGrades.reduce((a, b) => a + b, 0) / finalGrades.length;
    const min = Math.min(...finalGrades);
    const max = Math.max(...finalGrades);
    
    return { avg, min, max };
  };

  const stats = calculateStats();

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Calificaciones</h1>
        <div className="flex gap-3">
          <button
            onClick={handleRecalculateSeguimiento}
            disabled={recalculating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {recalculating ? 'Recalculando...' : 'Recalcular Seguimiento'}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total Estudiantes</p>
          <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Promedio</p>
          <p className="text-2xl font-bold text-blue-600">{stats.avg.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Nota Mínima</p>
          <p className="text-2xl font-bold text-red-600">{stats.min.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Nota Máxima</p>
          <p className="text-2xl font-bold text-green-600">{stats.max.toFixed(2)}</p>
        </div>
      </div>

      {/* Grade Distribution Chart */}
      <div className="mb-6">
        <GradeDistributionChart grades={grades.map(g => g.final_grade)} />
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trabajo 1<br/>(20%)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trabajo 2<br/>(20%)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concurso<br/>(20%)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Examen<br/>(20%)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seguimiento<br/>(20%)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nota Final
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grades.map((grade) => (
                <tr key={grade.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{grade.user_name}</div>
                      <div className="text-sm text-gray-500">{grade.user_email}</div>
                    </div>
                  </td>
                  {editingUserId === grade.user_id ? (
                    <>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editValues.trabajo_1 ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, trabajo_1: parseFloat(e.target.value) || undefined })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editValues.trabajo_2 ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, trabajo_2: parseFloat(e.target.value) || undefined })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editValues.concurso ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, concurso: parseFloat(e.target.value) || undefined })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editValues.examen ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, examen: parseFloat(e.target.value) || undefined })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editValues.seguimiento ?? ''}
                          onChange={(e) => setEditValues({ ...editValues, seguimiento: parseFloat(e.target.value) || undefined })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-500">Auto</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleSave(grade.user_id)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {grade.trabajo_1?.toFixed(2) ?? '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {grade.trabajo_2?.toFixed(2) ?? '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {grade.concurso?.toFixed(2) ?? '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {grade.examen?.toFixed(2) ?? '-'}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">
                        {grade.seguimiento?.toFixed(2) ?? '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-blue-600">
                          {grade.final_grade.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleEdit(grade.user_id, grade)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Editar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
