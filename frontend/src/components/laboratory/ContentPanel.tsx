'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getLessonById, getLessonsByModule } from '@/lib/api/lessons';
import type { Lesson, LessonDetail } from '@/types/lesson';
import 'highlight.js/styles/github-dark.css';

interface ContentPanelProps {
  moduleId?: string;
  lessonId?: string;
}

export default function ContentPanel({ moduleId = '1', lessonId = '1' }: ContentPanelProps) {
  const [currentLesson, setCurrentLesson] = useState<LessonDetail | undefined>();
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Uncomment when API is ready
        // const lessonData = await getLessonById(Number(lessonId));
        // setCurrentLesson(lessonData);
        // if (moduleId) {
        //   const lessonsData = await getLessonsByModule(Number(moduleId));
        //   setModuleLessons(lessonsData);
        // }
        
        // Temporary: Show placeholder until API is connected
        setCurrentLesson({
          id: Number(lessonId),
          module_id: Number(moduleId),
          title: 'Lección de ejemplo',
          content: '# Bienvenido\n\nEsta es una lección de ejemplo. La API se conectará pronto.',
          code_template: null,
          order_index: 1,
          created_at: new Date().toISOString(),
          content_blocks: [],
          objectives: []
        });
        setModuleLessons([]);
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError('Error al cargar la lección');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonData();
  }, [moduleId, lessonId]);

  const handlePreviousLesson = async () => {
    if (!currentLesson) return;
    const currentIndex = moduleLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      const prevLesson = moduleLessons[currentIndex - 1];
      try {
        const lessonData = await getLessonById(prevLesson.id);
        setCurrentLesson(lessonData);
      } catch (err) {
        console.error('Error loading previous lesson:', err);
      }
    }
  };

  const handleNextLesson = async () => {
    if (!currentLesson) return;
    const currentIndex = moduleLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < moduleLessons.length - 1) {
      const nextLesson = moduleLessons[currentIndex + 1];
      try {
        const lessonData = await getLessonById(nextLesson.id);
        setCurrentLesson(lessonData);
      } catch (err) {
        console.error('Error loading next lesson:', err);
      }
    }
  };

  const currentIndex = currentLesson 
    ? moduleLessons.findIndex(l => l.id === currentLesson.id)
    : -1;
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < moduleLessons.length - 1;

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white" data-tutorial="content-panel">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-blue-400">Contenido</h2>
        {currentLesson && (
          <p className="text-sm text-gray-400 mt-1">
            Módulo {currentLesson.module_id} - {currentLesson.title}
          </p>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="text-center text-gray-400 mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <p>Cargando lección...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 mt-8">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm mt-2 text-blue-400 hover:text-blue-300"
            >
              Reintentar
            </button>
          </div>
        ) : currentLesson ? (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom styling for code blocks
                code: ({ node, className, children, ...props }) => {
                  const isInline = !className?.startsWith('language-');
                  return isInline ? (
                    <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm text-blue-300" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                // Custom styling for headings
                h1: ({ node, children, ...props }) => (
                  <h1 className="text-3xl font-bold text-white mb-4 mt-6" {...props}>
                    {children}
                  </h1>
                ),
                h2: ({ node, children, ...props }) => (
                  <h2 className="text-2xl font-semibold text-blue-300 mb-3 mt-5" {...props}>
                    {children}
                  </h2>
                ),
                h3: ({ node, children, ...props }) => (
                  <h3 className="text-xl font-semibold text-blue-400 mb-2 mt-4" {...props}>
                    {children}
                  </h3>
                ),
                // Custom styling for paragraphs
                p: ({ node, children, ...props }) => (
                  <p className="text-gray-300 mb-4 leading-relaxed" {...props}>
                    {children}
                  </p>
                ),
                // Custom styling for lists
                ul: ({ node, children, ...props }) => (
                  <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props}>
                    {children}
                  </ul>
                ),
                ol: ({ node, children, ...props }) => (
                  <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props}>
                    {children}
                  </ol>
                ),
                // Custom styling for links
                a: ({ node, children, ...props }) => (
                  <a className="text-blue-400 hover:text-blue-300 underline" {...props}>
                    {children}
                  </a>
                ),
                // Custom styling for blockquotes
                blockquote: ({ node, children, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4" {...props}>
                    {children}
                  </blockquote>
                ),
                // Custom styling for pre (code blocks)
                pre: ({ node, children, ...props }) => (
                  <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto mb-4" {...props}>
                    {children}
                  </pre>
                ),
              }}
            >
              {currentLesson.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-8">
            <p>No se encontró la lección.</p>
            <p className="text-sm mt-2">Selecciona una lección del módulo.</p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="px-4 py-3 border-t border-gray-700 flex justify-between items-center">
        <button
          onClick={handlePreviousLesson}
          disabled={!hasPrevious}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            hasPrevious
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Anterior
        </button>

        <div className="text-sm text-gray-400">
          {currentIndex >= 0 && (
            <span>
              Lección {currentIndex + 1} de {moduleLessons.length}
            </span>
          )}
        </div>

        <button
          onClick={handleNextLesson}
          disabled={!hasNext}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            hasNext
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Siguiente
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
