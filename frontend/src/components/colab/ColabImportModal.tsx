'use client';

import { useState, useRef } from 'react';
import { importFromColab, importFromFile, validateColabUrl } from '@/lib/api/colab';

interface ColabImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (code: string, metadata?: Record<string, any>) => void;
}

type ImportMethod = 'url' | 'file';

export default function ColabImportModal({ isOpen, onClose, onImport }: ColabImportModalProps) {
  const [method, setMethod] = useState<ImportMethod>('file');
  const [url, setUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setUrl('');
    setError(null);
    setSuccess(null);
    setMethod('file');
    onClose();
  };

  const handleFileImport = async (file: File) => {
    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await importFromFile(file);

      if (!response.success) {
        setError(response.message);
        return;
      }

      if (!response.validation.valid) {
        setError(`Error de sintaxis: ${response.validation.error}`);
        return;
      }

      setSuccess('Código importado exitosamente');
      onImport(response.code, response.metadata);
      
      // Close modal after short delay
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Error al importar archivo');
    } finally {
      setIsImporting(false);
    }
  };

  const handleUrlImport = async () => {
    if (!url.trim()) {
      setError('Por favor ingresa una URL de Google Colab');
      return;
    }

    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      // First validate the URL
      const validation = await validateColabUrl(url);
      
      if (!validation.valid) {
        setError(validation.message);
        setIsImporting(false);
        return;
      }

      // Show instructions for downloading the notebook
      setError(
        'Por favor descarga el notebook desde Google Colab (Archivo > Descargar > Descargar .ipynb) y súbelo usando la opción "Subir archivo"'
      );
      setMethod('file');
    } catch (err) {
      console.error('URL validation error:', err);
      setError(err instanceof Error ? err.message : 'Error al validar URL');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.ipynb')) {
        setError('Por favor selecciona un archivo .ipynb');
        return;
      }
      handleFileImport(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Importar desde Google Colab</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Method selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMethod('file')}
              className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
                method === 'file'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Subir archivo
            </button>
            <button
              onClick={() => setMethod('url')}
              className={`flex-1 px-4 py-2 rounded text-sm font-medium transition-colors ${
                method === 'url'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              URL de Colab
            </button>
          </div>

          {/* File upload */}
          {method === 'file' && (
            <div>
              <p className="text-sm text-gray-300 mb-3">
                Sube un archivo .ipynb descargado desde Google Colab
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".ipynb"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className={`w-full px-4 py-3 border-2 border-dashed rounded-lg text-sm font-medium transition-colors ${
                  isImporting
                    ? 'border-gray-600 text-gray-500 cursor-not-allowed'
                    : 'border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-400'
                }`}
              >
                {isImporting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Importando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Seleccionar archivo .ipynb
                  </span>
                )}
              </button>
            </div>
          )}

          {/* URL input */}
          {method === 'url' && (
            <div>
              <p className="text-sm text-gray-300 mb-3">
                Ingresa la URL de tu notebook en Google Colab
              </p>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://colab.research.google.com/drive/..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 mb-3"
              />
              <button
                onClick={handleUrlImport}
                disabled={isImporting || !url.trim()}
                className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
                  isImporting || !url.trim()
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isImporting ? 'Validando...' : 'Validar URL'}
              </button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mt-4 p-3 bg-green-900 bg-opacity-50 border border-green-700 rounded text-sm text-green-200">
              {success}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 p-3 bg-gray-700 bg-opacity-50 rounded text-xs text-gray-300">
            <p className="font-semibold mb-1">Instrucciones:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Abre tu notebook en Google Colab</li>
              <li>Ve a Archivo → Descargar → Descargar .ipynb</li>
              <li>Sube el archivo descargado aquí</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded text-sm font-medium bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
