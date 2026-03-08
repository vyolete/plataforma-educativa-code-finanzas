import { render, screen, fireEvent } from '@testing-library/react';
import ContentPanel from './ContentPanel';

// Mock the lessons data
jest.mock('@/data/lessons', () => ({
  getLessonById: jest.fn((id: string) => {
    if (id === '1-1') {
      return {
        id: '1-1',
        moduleId: '1',
        title: 'Variables y Tipos de Datos',
        orderIndex: 1,
        content: '# Test Lesson\n\nThis is a test lesson with **bold** text.\n\n```python\nprint("Hello")\n```'
      };
    }
    return undefined;
  }),
  getLessonsByModule: jest.fn((moduleId: string) => {
    if (moduleId === '1') {
      return [
        {
          id: '1-1',
          moduleId: '1',
          title: 'Variables y Tipos de Datos',
          orderIndex: 1,
          content: '# Test Lesson 1'
        },
        {
          id: '1-2',
          moduleId: '1',
          title: 'Operadores',
          orderIndex: 2,
          content: '# Test Lesson 2'
        }
      ];
    }
    return [];
  })
}));

describe('ContentPanel', () => {
  it('renders the content panel with lesson title', () => {
    render(<ContentPanel moduleId="1" lessonId="1-1" />);
    
    expect(screen.getByText('Contenido')).toBeInTheDocument();
    expect(screen.getByText(/Módulo 1 - Variables y Tipos de Datos/)).toBeInTheDocument();
  });

  it('renders markdown content', () => {
    render(<ContentPanel moduleId="1" lessonId="1-1" />);
    
    expect(screen.getByText('Test Lesson')).toBeInTheDocument();
    expect(screen.getByText(/This is a test lesson with/)).toBeInTheDocument();
  });

  it('shows navigation buttons', () => {
    render(<ContentPanel moduleId="1" lessonId="1-1" />);
    
    const previousButton = screen.getByText('Anterior');
    const nextButton = screen.getByText('Siguiente');
    
    expect(previousButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('disables previous button on first lesson', () => {
    render(<ContentPanel moduleId="1" lessonId="1-1" />);
    
    const previousButton = screen.getByText('Anterior');
    expect(previousButton).toBeDisabled();
  });

  it('shows lesson progress indicator', () => {
    render(<ContentPanel moduleId="1" lessonId="1-1" />);
    
    expect(screen.getByText(/Lección 1 de 2/)).toBeInTheDocument();
  });

  it('handles missing lesson gracefully', () => {
    render(<ContentPanel moduleId="1" lessonId="999" />);
    
    expect(screen.getByText('No se encontró la lección.')).toBeInTheDocument();
  });
});
