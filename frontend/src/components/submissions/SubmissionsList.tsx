'use client';

import { useState, useEffect } from 'react';
import { submissionsApi, ProjectSubmissionWithConfirmations } from '@/lib/api/submissions';

interface SubmissionsListProps {
  teamId: number;
  currentUserId: number;
  onRefresh?: number; // Trigger to refresh the list
}

export default function SubmissionsList({
  teamId,
  currentUserId,
  onRefresh,
}: SubmissionsListProps) {
  const [submissions, setSubmissions] = useState<ProjectSubmissionWithConfirmations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const submissionTypeLabels = {
    trabajo_1: 'Trabajo 1',
    trabajo_2: 'Trabajo 2',
    concurso: 'Concurso',
    examen: 'Examen Final',
  };

  const statusLabels = {
    pending: 'Pendiente de confirmación',
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
  }, [teamId, onRefresh]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await submissionsApi.getTeamSubmissions(teamId);
      setSubmissions(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al cargar las entregas');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (submissionId: number) => {
    try {
      setConfirmingId(submissionId);
      await submissionsApi.confirmSubmission(submissionId);
      await loadSubmissions(); // Reload to get updated data
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error al confirmar la entrega');
    } finally {
      setConfirmingId(null);
    }
  };

  const hasUserConfirmed = (submission: ProjectSubmissionWithConfirmations) => {
    return submission.confirmations.some(c => c.user_id === currentUserId);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay entregas</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza subiendo tu primera entrega de proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const userConfirmed = hasUserConfirmed(submission);
        const canConfirm = submission.status === 'pending' && !userConfirmed;

        return (
          <div
            key={submission.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
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

                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Subida:</span>{' '}
                    {formatDate(submission.submitted_at)}
                  </p>
                  <p>
                    <span className="font-medium">Fecha límite:</span>{' '}
                    {formatDate(submission.due_date)}
                  </p>
                </div>

                {/* Confirmation progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">
                      Confirmaciones
                    </span>
                    <span className="text-gray-600">
                      {submission.total_confirmations} / {submission.required_confirmations}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        submission.is_fully_confirmed
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${
                          (submission.total_confirmations /
                            submission.required_confirmations) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  {userConfirmed && (
                    <p className="mt-1 text-xs text-green-600">
                      ✓ Ya confirmaste esta entrega
                    </p>
                  )}
                </div>

                {/* Grade display */}
                {submission.status === 'graded' && submission.grade !== null && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm font-medium text-green-900">
                      Calificación: {submission.grade.toFixed(2)} / 5.0
                    </p>
                    {submission.feedback && (
                      <p className="mt-1 text-sm text-green-800">
                        {submission.feedback}
                      </p>
                    )}
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

                {canConfirm && (
                  <button
                    onClick={() => handleConfirm(submission.id)}
                    disabled={confirmingId === submission.id}
                    className="px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {confirmingId === submission.id
                      ? 'Confirmando...'
                      : 'Confirmar'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
