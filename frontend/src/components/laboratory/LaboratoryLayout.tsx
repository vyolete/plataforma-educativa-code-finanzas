'use client';

import { useState, useEffect } from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';
import { ExecutionProvider } from '@/contexts/ExecutionContext';
import { ExerciseProvider } from '@/contexts/ExerciseContext';
import ContentPanel from './ContentPanel';
import CodePanel from './CodePanel';
import ResultsPanel from './ResultsPanel';
import ExercisesPanel from './ExercisesPanel';

interface LaboratoryLayoutProps {
  moduleId?: string;
  lessonId?: string;
}

interface PanelSizes {
  content: number;
  code: number;
  results: number;
  exercises: number;
}

const DEFAULT_SIZES: PanelSizes = {
  content: 25,
  code: 35,
  results: 25,
  exercises: 15,
};

const STORAGE_KEY = 'laboratory-panel-sizes';

export default function LaboratoryLayout({ moduleId, lessonId }: LaboratoryLayoutProps) {
  const [panelSizes, setPanelSizes] = useState<PanelSizes>(DEFAULT_SIZES);

  // Load panel sizes from localStorage on mount
  useEffect(() => {
    const savedSizes = localStorage.getItem(STORAGE_KEY);
    if (savedSizes) {
      try {
        const parsed = JSON.parse(savedSizes);
        setPanelSizes(parsed);
      } catch (error) {
        console.error('Failed to parse saved panel sizes:', error);
      }
    }
  }, []);

  // Save panel sizes to localStorage when they change
  const handlePanelResize = (layout: { [panelId: string]: number }) => {
    // Extract sizes from layout object (values are percentages)
    const sizes = Object.values(layout);
    const newSizes: PanelSizes = {
      content: sizes[0] || DEFAULT_SIZES.content,
      code: sizes[1] || DEFAULT_SIZES.code,
      results: sizes[2] || DEFAULT_SIZES.results,
      exercises: sizes[3] || DEFAULT_SIZES.exercises,
    };
    setPanelSizes(newSizes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSizes));
  };

  return (
    <ExecutionProvider>
      <ExerciseProvider>
        <div className="h-screen w-full bg-gray-900">
          <Group
            orientation="horizontal"
            onLayoutChanged={handlePanelResize}
            className="h-full"
          >
            {/* Content Panel - 25% initial width */}
            <Panel
              defaultSize={panelSizes.content}
              minSize={15}
              maxSize={40}
              className="bg-gray-800"
            >
              <ContentPanel moduleId={moduleId} lessonId={lessonId} />
            </Panel>

            <Separator className="w-1 bg-gray-700 hover:bg-blue-500 transition-colors cursor-col-resize" />

            {/* Code Panel - 35% initial width */}
            <Panel
              defaultSize={panelSizes.code}
              minSize={20}
              maxSize={60}
              className="bg-gray-900"
            >
              <CodePanel />
            </Panel>

            <Separator className="w-1 bg-gray-700 hover:bg-blue-500 transition-colors cursor-col-resize" />

            {/* Results Panel - 25% initial width */}
            <Panel
              defaultSize={panelSizes.results}
              minSize={15}
              maxSize={50}
              className="bg-gray-800"
            >
              <ResultsPanel />
            </Panel>

            <Separator className="w-1 bg-gray-700 hover:bg-blue-500 transition-colors cursor-col-resize" />

            {/* Exercises Panel - 15% initial width */}
            <Panel
              defaultSize={panelSizes.exercises}
              minSize={10}
              maxSize={30}
              className="bg-gray-800"
            >
              <ExercisesPanel moduleId={moduleId} />
            </Panel>
          </Group>
        </div>
      </ExerciseProvider>
    </ExecutionProvider>
  );
}
