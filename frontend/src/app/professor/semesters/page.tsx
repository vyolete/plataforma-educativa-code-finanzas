'use client';

import { useState, useEffect } from 'react';
import { semestersApi, Semester, DueDates } from '@/lib/api/semesters';
import { useRouter } from 'next/navigation';

export default function SemestersPage() {
  const router = useRouter();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [dueDates, setDueDates] = useState<DueDates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadSemesters();
  }, []);

  const loadSemesters = async () => {
    try {
      setLoading(true);
      const data = await semestersApi.getAll();
      setSemesters(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load semesters');
    } finally {
      setLoading(false);
    }
  };

  const loadDueDates = async (semesterId: number) => {
    try {
      const dates = await semestersApi.getDueDates(semesterId);
      setDueDates(dates);
    } catch (err: any) {
      console.error('Failed to load due dates:', err);
    }
  };

  const handleSelectSemester = async (semester: Semester) => {
    setSelectedSemester(semester);
    await loadDueDates(semester.id);
  };

  const handleArchive = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas archivar este semestre?')) {
      return;
    }

    try {
      await semestersApi.archive(id);
      await loadSemesters();
      if (selectedSemester?.id === id) {
        setSelectedSemester(null);
        setDueDates(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to archive semester');
    }
  };

  const handleActivate = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas activar este semestre? Esto desactivará todos los demás semestres.')) {
      return;
    }

    try {
      await semestersApi.activate(id);
      await loadSemesters();
    } catch (err: any) {
      alert(err.message || 'Failed to activate semester');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando semestres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Semestres</h1>
          <p className="mt-2 text-gray-600">
            Administra los periodos académicos y sus fechas de entrega
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Crear Nuevo Semestre
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <CreateSemesterForm
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              loadSemesters();
            }}
          />
        )}

        {/* Semesters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Semesters List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Semestres</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {semesters.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No hay semestres creados
                </div>
              ) : (
                semesters.map((semester) => (
                  <div
                    key={semester.id}
                    className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedSemester?.id === semester.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelectSemester(semester)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {semester.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(semester.start_date)} - {formatDate(semester.end_date)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Duración: {semester.duration_weeks} semanas
                        </p>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            semester.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {semester.status === 'active' ? 'Activo' : 'Archivado'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {semester.status === 'archived' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivate(semester.id);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Activar
                        </button>
                      )}
                      {semester.status === 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchive(semester.id);
                          }}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Archivar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Semester Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalles del Semestre
              </h2>
            </div>
            {selectedSemester ? (
              <div className="px-6 py-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {selectedSemester.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Estado:</span>{' '}
                      <span
                        className={
                          selectedSemester.status === 'active'
                            ? 'text-green-600'
                            : 'text-gray-600'
                        }
                      >
                        {selectedSemester.status === 'active' ? 'Activo' : 'Archivado'}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Fecha de inicio:</span>{' '}
                      {formatDate(selectedSemester.start_date)}
                    </p>
                    <p>
                      <span className="font-medium">Fecha de fin:</span>{' '}
                      {formatDate(selectedSemester.end_date)}
                    </p>
                    <p>
                      <span className="font-medium">Duración:</span>{' '}
                      {selectedSemester.duration_weeks} semanas
                    </p>
                  </div>
                </div>

                {dueDates && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Fechas de Entrega
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="font-medium text-gray-700">Trabajo 1 (20%)</span>
                        <span className="text-gray-900">{formatDate(dueDates.trabajo_1)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="font-medium text-gray-700">Trabajo 2 (20%)</span>
                        <span className="text-gray-900">{formatDate(dueDates.trabajo_2)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="font-medium text-gray-700">Concurso (20%)</span>
                        <span className="text-gray-900">{formatDate(dueDates.concurso)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                        <span className="font-medium text-gray-700">Examen Final (20%)</span>
                        <span className="text-gray-900">
                          {formatDate(dueDates.examen_final)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-500">
                      Las fechas se calculan automáticamente basadas en la duración del semestre
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Selecciona un semestre para ver sus detalles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateSemesterForm({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate <= startDate) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    const durationWeeks = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    if (durationWeeks < 15 || durationWeeks > 20) {
      setError(`La duración debe ser entre 15 y 20 semanas. Duración actual: ${durationWeeks} semanas`);
      return;
    }

    try {
      setLoading(true);
      await semestersApi.create(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al crear el semestre');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Semestre</h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Semestre
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 2024-1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin
              </label>
              <input
                type="date"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> La duración del semestre debe ser entre 15 y 20 semanas.
                Las fechas de entrega se calcularán automáticamente.
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Semestre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
