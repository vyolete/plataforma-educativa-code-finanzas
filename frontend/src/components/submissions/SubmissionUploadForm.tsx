'use client';

import { useState } from 'react';
import { submissionsApi, CreateSubmissionData } from '@/lib/api/submissions';

interface SubmissionUploadFormProps {
  teamId: number;
  semesterId: number;
  submissionType: 'trabajo_1' | 'trabajo_2' | 'concurso' | 'examen';
  dueDate: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SubmissionUploadForm({
  teamId,
  semesterId,
  submissionType,
  dueDate,
  onSuccess,
  onCancel,
}: SubmissionUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const submissionTypeLabels = {
    trabajo_1: 'Trabajo 1',
    trabajo_2: 'Trabajo 2',
    concurso: 'Concurso de Análisis Financiero',
    examen: 'Examen Final',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // Validate file extension
    if (!selectedFile.name.endsWith('.ipynb')) {
      setError('Solo se permiten archivos .ipynb (Jupyter Notebook)');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError(`El archivo es demasiado grande. Tamaño máximo: 10MB. Tamaño actual: ${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const data: CreateSubmissionData = {
        team_id: teamId,
        semester_id: semesterId,
        submission_type: submissionType,
        due_date: dueDate,
        file,
      };

      await submissionsApi.createSubmission(data);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Error al subir el archivo';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isLate = new Date() > new Date(dueDate);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        Subir {submissionTypeLabels[submissionType]}
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Fecha límite: <span className={`font-semibold ${isLate ? 'text-red-600' : 'text-gray-900'}`}>
            {formatDate(dueDate)}
          </span>
        </p>
        {isLate && (
          <p className="text-sm text-red-600 mt-1">
            ⚠️ La fecha límite ha pasado. Esta entrega se marcará como tardía.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Drag and drop area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept=".ipynb"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />

          {!file ? (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Arrastra tu notebook aquí o{' '}
                <label
                  htmlFor="file-upload"
                  className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium"
                >
                  selecciona un archivo
                </label>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Solo archivos .ipynb, máximo 10MB
              </p>
            </>
          ) : (
            <div className="flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="ml-4 text-red-600 hover:text-red-500"
                disabled={uploading}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={uploading}
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!file || uploading}
          >
            {uploading ? 'Subiendo...' : 'Subir Entrega'}
          </button>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          ℹ️ Importante
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Todos los miembros del equipo deben confirmar la entrega</li>
          <li>El notebook debe incluir análisis financiero y visualizaciones</li>
          <li>Una vez confirmada por todos, no se puede modificar</li>
        </ul>
      </div>
    </div>
  );
}
