# ContentPanel Component

## Overview

The ContentPanel component displays lesson content in Markdown format with syntax highlighting for code blocks. It's part of the 4-panel laboratory interface and provides navigation between lessons within a module.

## Features

### 1. Markdown Rendering
- Renders lesson content using `react-markdown`
- Supports GitHub Flavored Markdown (GFM) via `remark-gfm`
- Includes syntax highlighting for code blocks via `rehype-highlight`

### 2. Syntax Highlighting
- Uses `highlight.js` with the GitHub Dark theme
- Automatically detects programming language in code blocks
- Custom styling for inline code vs code blocks

### 3. Navigation
- Previous/Next buttons to navigate between lessons
- Buttons are disabled at module boundaries
- Shows current lesson position (e.g., "Lección 1 de 3")

### 4. Custom Styling
- Dark theme consistent with the laboratory interface
- Custom components for headings, paragraphs, lists, links
- Responsive typography with proper spacing
- Blue accent colors for headings and links

## Props

```typescript
interface ContentPanelProps {
  moduleId?: string;  // Module ID (default: '1')
  lessonId?: string;  // Lesson ID (default: '1-1')
}
```

## Usage

```tsx
import ContentPanel from '@/components/laboratory/ContentPanel';

function LaboratoryPage() {
  return (
    <ContentPanel moduleId="1" lessonId="1-1" />
  );
}
```

## Sample Lessons

The component includes sample lesson data in `frontend/src/data/lessons.ts`:

- **Lesson 1-1**: Variables y Tipos de Datos
- **Lesson 1-2**: Operadores y Expresiones  
- **Lesson 2-1**: Listas y Tuplas

Each lesson includes:
- Markdown-formatted content
- Code examples with syntax highlighting
- Financial analysis examples
- Key concepts and best practices

## Markdown Features Supported

- **Headings**: H1, H2, H3 with custom styling
- **Paragraphs**: Proper spacing and line height
- **Code blocks**: Syntax highlighted with language detection
- **Inline code**: Distinct styling with background
- **Lists**: Ordered and unordered with proper indentation
- **Links**: Blue accent color with hover effects
- **Blockquotes**: Left border with italic text
- **Bold/Italic**: Standard markdown emphasis

## Future Enhancements

In production, lessons will be:
1. Fetched from the backend API
2. Stored in the PostgreSQL database
3. Editable by professors through an admin interface
4. Include embedded videos and interactive elements

## Dependencies

- `react-markdown`: Markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support
- `rehype-highlight`: Syntax highlighting
- `highlight.js`: Code highlighting library

## Testing

Run tests with:
```bash
npm test ContentPanel.test.tsx
```

Tests cover:
- Markdown rendering
- Navigation functionality
- Button states
- Error handling for missing lessons
