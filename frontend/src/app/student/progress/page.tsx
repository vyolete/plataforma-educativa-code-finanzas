import ProgressDashboard from '@/components/progress/ProgressDashboard';

export default function StudentProgressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mi Progreso</h1>
          <p className="text-gray-600 mt-2">
            Visualiza tu avance en el curso de Lenguajes de Programación
          </p>
        </div>
        
        <ProgressDashboard />
      </div>
    </div>
  );
}
