# Progress Visualization Components

This directory contains components for displaying student progress tracking.

## Components

### 1. ModuleProgressBar

A progress bar component for displaying individual module completion status.

**Props:**
- `moduleId` (number): Module identifier (1-8)
- `moduleName` (string): Display name of the module
- `exercisesCompleted` (number): Number of exercises completed
- `exercisesTotal` (number): Total number of exercises in the module
- `completionPercentage` (number): Completion percentage (0-100)

**Features:**
- Color-coded progress bar:
  - Red (<30%): Low completion
  - Yellow (30-70%): Medium completion
  - Green (>70%): High completion
- Shows "X/Y exercises completed"
- Hover effect with shadow transition

**Usage:**
```tsx
<ModuleProgressBar
  moduleId={1}
  moduleName="Introducción a Python"
  exercisesCompleted={7}
  exercisesTotal={10}
  completionPercentage={70}
/>
```

### 2. ProgressDashboard

A comprehensive dashboard showing overall student progress across all modules.

**Props:** None (fetches data automatically)

**Features:**
- Fetches data using `getMyProgress()` API
- Large overall completion percentage display
- Total exercises completed counter
- Total code executions counter
- Grid of ModuleProgressBar components for all 8 modules
- Recent activity section showing last 10 code executions with timestamps
- Loading state with spinner
- Error state with error message
- Responsive grid layout (1-4 columns based on screen size)

**Usage:**
```tsx
import ProgressDashboard from '@/components/progress/ProgressDashboard';

export default function ProgressPage() {
  return (
    <div className="container mx-auto p-6">
      <ProgressDashboard />
    </div>
  );
}
```

### 3. ExerciseCompletionIndicator

A compact indicator showing whether an exercise has been completed.

**Props:**
- `completed` (boolean): Whether the exercise is completed
- `exerciseTitle` (string): Title of the exercise (shown in tooltip)

**Features:**
- Green checkmark icon if completed
- Empty circle if not completed
- Tooltip on hover showing exercise title
- Compact design suitable for lists

**Usage:**
```tsx
<ExerciseCompletionIndicator
  completed={true}
  exerciseTitle="Variables y Tipos de Datos"
/>
```

## API Integration

The components use the progress API client located at `@/lib/api/progress.ts`:

```typescript
import { getMyProgress } from '@/lib/api/progress';

// Fetch overall progress
const progress = await getMyProgress();
```

## Styling

All components use Tailwind CSS for styling and follow the existing design patterns from the codebase:
- Consistent color scheme (blue primary, red/yellow/green for status)
- Shadow effects on hover
- Responsive design
- Smooth transitions

## Example Integration

Here's a complete example of using the ProgressDashboard in a student dashboard page:

```tsx
// app/(student)/progress/page.tsx
import ProgressDashboard from '@/components/progress/ProgressDashboard';

export default function StudentProgressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Mi Progreso
        </h1>
        <ProgressDashboard />
      </div>
    </div>
  );
}
```

## Data Flow

1. **ProgressDashboard** fetches data from `/progress/me` endpoint
2. Backend returns:
   - Total exercises completed/total
   - Module-by-module progress (8 modules)
   - Recent code activity (last 10 executions)
   - Total code execution count
3. **ModuleProgressBar** components render for each module
4. Recent activity section displays code snippets with timestamps

## Color Coding

Progress bars use a traffic light system:
- **Red** (<30%): Needs attention
- **Yellow** (30-70%): Making progress
- **Green** (>70%): Good progress

This provides quick visual feedback on student performance.
