/**
 * API client for Google Colab integration
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ExportRequest {
  code: string;
  metadata?: {
    exercise_id?: number;
    module_id?: number;
    lesson_id?: number;
    user_id?: number;
    [key: string]: any;
  };
}

export interface ExportResponse {
  success: boolean;
  notebook: any;
  message: string;
}

export interface ImportRequest {
  url?: string;
  notebook?: any;
}

export interface ImportResponse {
  success: boolean;
  code: string;
  metadata: Record<string, any>;
  validation: {
    valid: boolean;
    error?: string;
    line?: number;
    offset?: number;
  };
  message: string;
}

/**
 * Export code to Jupyter notebook format
 */
export async function exportToColab(
  code: string,
  metadata?: ExportRequest['metadata']
): Promise<ExportResponse> {
  const response = await fetch(`${API_URL}/api/colab/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, metadata }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al exportar notebook');
  }

  return response.json();
}

/**
 * Import code from Colab notebook
 */
export async function importFromColab(
  request: ImportRequest
): Promise<ImportResponse> {
  const response = await fetch(`${API_URL}/api/colab/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al importar notebook');
  }

  return response.json();
}

/**
 * Import code from uploaded .ipynb file
 */
export async function importFromFile(file: File): Promise<ImportResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/colab/import/file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al importar archivo');
  }

  return response.json();
}

/**
 * Validate a Google Colab URL
 */
export async function validateColabUrl(url: string): Promise<{ valid: boolean; message: string }> {
  const response = await fetch(`${API_URL}/api/colab/validate-url?url=${encodeURIComponent(url)}`, {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Error al validar URL');
  }

  return response.json();
}

/**
 * Download notebook as .ipynb file
 */
export function downloadNotebook(notebook: any, filename: string = 'notebook.ipynb') {
  const blob = new Blob([JSON.stringify(notebook, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open notebook in Google Colab
 * This creates a temporary file and opens it in Colab
 */
export function openInColab(notebook: any) {
  // Convert notebook to JSON string
  const notebookJson = JSON.stringify(notebook, null, 2);
  
  // Create a blob and download it
  const blob = new Blob([notebookJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create temporary download link
  const link = document.createElement('a');
  link.href = url;
  link.download = 'plataforma_educativa_notebook.ipynb';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Open Colab in new tab with instructions
  const colabUrl = 'https://colab.research.google.com/';
  window.open(colabUrl, '_blank');
  
  // Show instructions to user
  return {
    success: true,
    message: 'Notebook descargado. Por favor, sube el archivo en Google Colab usando "Archivo > Subir notebook"'
  };
}
