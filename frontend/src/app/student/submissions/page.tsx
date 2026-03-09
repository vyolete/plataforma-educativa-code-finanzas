'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { teamsApi, Team } from '@/lib/api/teams';
import SubmissionUploadForm from '@/components/submissions/SubmissionUploadForm';
import SubmissionsList from '@/components/submissions/SubmissionsList';

export default function SubmissionsPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedSubmissionType, setSelectedSubmissionType] = useState<
    'trabajo_1' | 'trabajo_2' | 'concurso' | 'examen' | null
  >(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Due dates - these should come from semester configuration in production
  const dueDates = {
    trabajo_1: '2024-03-15T23:59:59',
    trabajo_2: '2024-04-30T23:59:59',
    concurso: '2024-05-30T23:59:59',
    examen: '2024-06-15T23:59:59',
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const team = await teamsApi.getMyTeam();
      if (team) {
        setTeam(team);
      }
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = (type: 'trabajo_1' | 'trabajo_2' | 'concurso' | 'examen') => {
    setSelectedSubmissionType(type);
    setShowUploadForm(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadForm(false);
    setSelectedSubmissionType(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh of submissions list
  };

  const handleUploadCancel = () => {
    setShowUploadForm(false);
    setSelectedSubmissionType(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">
            No estás en un equipo
          </h2>
          <p className="text-yellow-800">
            Debes unirte a un equipo antes de poder subir entregas de proyecto.
            Ve a la sección de Equipos para crear o unirte a uno.
          </p>
        </div>
      </div>
    );
  }

  const submissionTypes = [
    {
      type: 'trabajo_1' as const,
      label: 'Trabajo 1',
      description: 'Análisis con Pandas (Módulos 1-2)',
      dueDate: dueDates.trabajo_1,
      weight: '20%',
    },
    {
      type: 'trabajo_2' as const,
      label: 'Trabajo 2',
      description: 'Análisis financiero con yfinance (Módulos 4-6)',
      dueDate: dueDates.trabajo_2,
      weight: '20%',
    },
    {
      type: 'concurso' as const,
      label: 'Concurso',
      description: 'Análisis del sector bancario (Módulos 7-8)',
      dueDate: dueDates.concurso,
      weight: '20%',
    },
    {
      type: 'examen' as const,
      label: 'Examen Final',
      description: 'Evaluación final individual',
      dueDate: dueDates.examen,
      weight: '20%',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Entregas de Proyecto</h1>
        <p className="mt-2 text-gray-600">
          Equipo: <span className="font-semibold">{team.name}</span>
        </p>
      </div>

      {showUploadForm && selectedSubmissionType ? (
        <SubmissionUploadForm
          teamId={team.id}
          semesterId={user?.semester_id || 1}
          submissionType={selectedSubmissionType}
          dueDate={dueDates[selectedSubmissionType]}
          onSuccess={handleUploadSuccess}
          onCancel={handleUploadCancel}
        />
      ) : (
        <>
          {/* Submission types grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {submissionTypes.map((submission) => {
              const isLate = new Date() > new Date(submission.dueDate);
              const dueDate = new Date(submission.dueDate);

              return (
                <div
                  key={submission.type}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {submission.label}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {submission.description}
                      </p>
                      <div className="mt-3 space-y-1 text-sm">
                        <p className="text-gray-600">
                          <span className="font-medium">Ponderación:</span>{' '}
                          {submission.weight}
                        </p>
                        <p className={isLate ? 'text-red-600' : 'text-gray-600'}>
                          <span className="font-medium">Fecha límite:</span>{' '}
                          {dueDate.toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUploadClick(submission.type)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Subir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submissions list */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Entregas del Equipo
            </h2>
            <SubmissionsList
              teamId={team.id}
              currentUserId={user?.id || 0}
              onRefresh={refreshTrigger}
            />
          </div>
        </>
      )}
    </div>
  );
}
