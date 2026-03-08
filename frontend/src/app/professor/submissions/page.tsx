'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { submissionsApi, ProjectSubmission } from '@/lib/api/submissions';

export default function ProfessorSubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradingSubmissionId, setGradingSubmissionId] = useState<number | null>(null);
  const [gradeValue, setGradeValue] = useState('');
  const [feedbackValue, setFeedbackValue] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const submissionTypeLabels = {
    trabajo_1: 'Trabajo 1',
    trabajo_2: 'Trabajo 2',
    concurso: 'Concurso',
    examen: 'Examen Final',
  };

  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    graded: 'Calificada',
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    graded: 'bg-green-100 text-green-800',
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      // In production, get semester_id from user context
      const semesterId = user?.semester_id || 1;
      const data = await submissionsApi.getSemesterSubmissions(semesterId);
      setSubmissions(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar las entregas');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async (submissionId: number) => {
    const grade = parseFloat(gradeValue);

    if (isNaN(grade) || grade < 0 || grade > 5) {
      alert('La calificación debe ser un número entre 0 y 5');
      return;
    }

    try {
      await submissionsApi.gradeSubmission(submissionId, grade, feedbackValue);
      setGradingSubmissionId(null);
      setGradeValue('');
      setFeedbackValue('');
      await loadSubmissions();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al calificar la entrega');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (filterStatus !== 'all' && submission.status !== filterStatus) {
      return false;
    }
    if (filterType !== 'all' && submission.submission_type !== filterType) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Entregas de Estudiantes</h1>
        <p className="mt-2 text-gray-600">
          Revisa y califica las entregas de los equipos
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="graded">Calificada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="trabajo_1">Trabajo 1</option>
              <option value="trabajo_2">Trabajo 2</option>
              <option value="concurso">Concurso</option>
              <option value="examen">Examen Final</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadSubmissions}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">
            {submissions.filter((s) => s.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Confirmadas</p>
          <p className="text-2xl font-bold text-blue-600">
            {submissions.filter((s) => s.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Calificadas</p>
          <p className="text-2xl font-bold text-green-600">
            {submissions.filter((s) => s.status === 'graded').length}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submissions list */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">No hay entregas que coincidan con los filtros</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {submissionTypeLabels[submission.submission_type]}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        statusColors[submission.status]
                      }`}
                    >
                      {statusLabels[submission.status]}
                    </span>
                    {submission.is_late && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Tardía
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Equipo ID:</span> {submission.team_id}
                    </p>
                    <p>
                      <span className="font-medium">Subida:</span>{' '}
                      {formatDate(submission.submitted_at)}
                    </p>
                    <p>
                      <span className="font-medium">Fecha límite:</span>{' '}
                      {formatDate(submission.due_date)}
                    </p>
                  </div>

                  {submission.status === 'graded' && submission.grade !== null && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm font-medium text-green-900">
                        Calificación: {submission.grade} / 5.0
                      </p>
                      {submission.feedback && (
                        <p className="mt-1 text-sm text-green-800">
                          {submission.feedback}
                        </p>
                      )}
                    </div>
                  )}

                  {gradingSubmissionId === submission.id && (
                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Calificar entrega
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Calificación (0-5)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={gradeValue}
                            onChange={(e) => setGradeValue(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="Ej: 4.5"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Retroalimentación (opcional)
                          </label>
                          <textarea
                            value={feedbackValue}
                            onChange={(e) => setFeedbackValue(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="Comentarios sobre la entrega..."
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleGradeSubmit(submission.id)}
                            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                          >
                            Guardar Calificación
                          </button>
                          <button
                            onClick={() => {
                              setGradingSubmissionId(null);
                              setGradeValue('');
                              setFeedbackValue('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <a
                    href={submission.notebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 text-center"
                  >
                    Ver Notebook
                  </a>

                  {submission.status === 'confirmed' &&
                    gradingSubmissionId !== submission.id && (
                      <button
                        onClick={() => {
                          setGradingSubmissionId(submission.id);
                          setGradeValue(submission.grade?.toString() || '');
                          setFeedbackValue(submission.feedback || '');
                        }}
                        className="px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                      >
                        Calificar
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
