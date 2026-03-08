'use client';

import { useState, useRef } from 'react';
import ColabImportModal from './ColabImportModal';

interface ColabImportButtonProps {
  onImport: (code: string, metadata?: Record<string, any>) => void;
  className?: string;
}

export default function ColabImportButton({ onImport, className = '' }: ColabImportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 ${className}`}
        title="Importar código desde Google Colab"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16.9414 4.9757a7.033 7.033 0 0 0-4.9308 2.0646 7.033 7.033 0 0 0-.1232 9.8068l2.395-2.395a3.6455 3.6455 0 0 1 5.1497-5.1478l2.397-2.3989a7.033 7.033 0 0 0-4.8877-1.9297zM7.07 4.9855a7.033 7.033 0 0 0-4.8878 1.9316l2.3911 2.3911a3.6434 3.6434 0 0 1 5.0227.1271l1.7341-1.7341a7.033 7.033 0 0 0-4.2601-2.6157zm15.0093 2.1721l-2.3911 2.3911a3.6455 3.6455 0 0 1-5.1497 5.1497l-2.4067 2.4068a7.0362 7.0362 0 0 0 9.9475-9.9476zM1.932 7.1674a7.033 7.033 0 0 0-.002 9.6816l2.397-2.397a3.6434 3.6434 0 0 1-.004-4.8916zm7.664 7.4235c-1.38 1.3816-3.5863 1.411-5.0168.1134l-2.397 2.395c2.4693 2.3328 6.263 2.5753 9.0072.5455l-1.5934-1.5934z" />
        </svg>
        Importar desde Colab
      </button>

      <ColabImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={onImport}
      />
    </>
  );
}
