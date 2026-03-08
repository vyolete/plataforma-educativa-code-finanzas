'use client';

import { useState } from 'react';
import { exportToColab, openInColab } from '@/lib/api/colab';

interface ColabExportButtonProps {
  code: string;
  metadata?: {
    exercise_id?: number;
    module_id?: number;
    lesson_id?: number;
    [key: string]: any;
  };
  className?: string;
}

export default function ColabExportButton({ code, metadata, className = '' }: ColabExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!code.trim()) {
      setError('No hay código para exportar');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // Export code to notebook format
      const response = await exportToColab(code, metadata);
      
      if (response.success) {
        // Open in Colab (downloads file and opens Colab)
        const result = openInColab(response.notebook);
        
        // Show success message
        alert(result.message);
      } else {
        setError('Error al exportar notebook');
      }
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Error al exportar notebook');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
          isExporting
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700'
        } ${className}`}
        title="Exportar código a Google Colab"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.9414 4.9757a7.033 7.033 0 0 0-4.9308 2.0646 7.033 7.033 0 0 0-.1232 9.8068l2.395-2.395a3.6455 3.6455 0 0 1 5.1497-5.1478l2.397-2.3989a7.033 7.033 0 0 0-4.8877-1.9297zM7.07 4.9855a7.033 7.033 0 0 0-4.8878 1.9316l2.3911 2.3911a3.6434 3.6434 0 0 1 5.0227.1271l1.7341-1.7341a7.033 7.033 0 0 0-4.2601-2.6157zm15.0093 2.1721l-2.3911 2.3911a3.6455 3.6455 0 0 1-5.1497 5.1497l-2.4067 2.4068a7.0362 7.0362 0 0 0 9.9475-9.9476zM1.932 7.1674a7.033 7.033 0 0 0-.002 9.6816l2.397-2.397a3.6434 3.6434 0 0 1-.004-4.8916zm7.664 7.4235c-1.38 1.3816-3.5863 1.411-5.0168.1134l-2.397 2.395c2.4693 2.3328 6.263 2.5753 9.0072.5455l-1.5934-1.5934z" />
        </svg>
        {isExporting ? 'Exportando...' : 'Abrir en Colab'}
      </button>
      
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-600 text-white text-xs px-3 py-2 rounded shadow-lg z-10">
          {error}
        </div>
      )}
    </div>
  );
}
