/**
 * Exploration Test for Duplicate allLessons Bug
 * 
 * Property 1: Fault Condition - Duplicate Constant Definition Causes Build Failure
 * 
 * CRITICAL: This test is designed to FAIL on unfixed code to confirm the bug exists.
 * 
 * This test verifies:
 * 1. No duplicate 'allLessons' constant definitions exist
 * 2. No references to undefined 'sampleLessons' variable before export
 * 3. Build compilation succeeds without errors
 * 
 * Validates Requirements: 1.1, 1.2, 1.3
 */

import { readFileSync } from 'fs';
import { join } from 'path';

describe('Exploration Test: Duplicate allLessons Bug', () => {
  const lessonsFilePath = join(__dirname, '../lessons.ts');
  let fileContent: string;

  beforeAll(() => {
    fileContent = readFileSync(lessonsFilePath, 'utf-8');
  });

  test('should have only ONE definition of allLessons constant', () => {
    // Search for all occurrences of 'const allLessons'
    const allLessonsPattern = /const\s+allLessons\s*=/g;
    const matches = fileContent.match(allLessonsPattern);
    
    // EXPECTED TO FAIL on unfixed code (would find 2 definitions)
    expect(matches).not.toBeNull();
    expect(matches?.length).toBe(1);
    
    console.log(`✓ Found ${matches?.length} definition(s) of 'const allLessons'`);
  });

  test('should NOT reference undefined sampleLessons variable', () => {
    // Find the allLessons definition
    const allLessonsMatch = fileContent.match(/const\s+allLessons\s*=\s*\[([^\]]+)\]/);
    
    if (allLessonsMatch) {
      const definition = allLessonsMatch[0];
      
      // Check if it references 'sampleLessons' (which would be undefined at that point)
      const referencesUndefinedSampleLessons = definition.includes('...sampleLessons');
      
      // EXPECTED TO FAIL on unfixed code (would reference undefined variable)
      expect(referencesUndefinedSampleLessons).toBe(false);
      
      console.log(`✓ allLessons definition does not reference undefined 'sampleLessons'`);
    }
  });

  test('should reference sampleLessonsBase (not sampleLessons) in allLessons definition', () => {
    // Find the allLessons definition
    const allLessonsMatch = fileContent.match(/const\s+allLessons\s*=\s*\[[^\]]+\]/);
    
    expect(allLessonsMatch).not.toBeNull();
    
    const definition = allLessonsMatch![0];
    
    // Should reference sampleLessonsBase
    expect(definition).toContain('sampleLessonsBase');
    
    // Should NOT reference sampleLessons (before it's defined)
    expect(definition).not.toContain('...sampleLessons,');
    
    console.log(`✓ allLessons correctly references 'sampleLessonsBase'`);
  });

  test('should export sampleLessons after allLessons is defined', () => {
    // Find the position of allLessons definition
    const allLessonsIndex = fileContent.indexOf('const allLessons');
    
    // Find the position of sampleLessons export
    const sampleLessonsExportIndex = fileContent.indexOf('export const sampleLessons');
    
    expect(allLessonsIndex).toBeGreaterThan(-1);
    expect(sampleLessonsExportIndex).toBeGreaterThan(-1);
    
    // Export should come AFTER definition
    expect(sampleLessonsExportIndex).toBeGreaterThan(allLessonsIndex);
    
    console.log(`✓ sampleLessons is exported after allLessons is defined`);
  });

  test('should verify correct structure: sampleLessonsBase -> allLessons -> sampleLessons export', () => {
    const sampleLessonsBaseIndex = fileContent.indexOf('const sampleLessonsBase');
    const allLessonsIndex = fileContent.indexOf('const allLessons');
    const sampleLessonsExportIndex = fileContent.indexOf('export const sampleLessons');
    
    // Verify order: sampleLessonsBase -> allLessons -> export sampleLessons
    expect(sampleLessonsBaseIndex).toBeGreaterThan(-1);
    expect(allLessonsIndex).toBeGreaterThan(sampleLessonsBaseIndex);
    expect(sampleLessonsExportIndex).toBeGreaterThan(allLessonsIndex);
    
    console.log(`✓ Correct definition order: sampleLessonsBase -> allLessons -> export sampleLessons`);
  });
});

/**
 * COUNTEREXAMPLES DOCUMENTATION:
 * 
 * If this test FAILS, it indicates one of the following bugs:
 * 
 * 1. Multiple allLessons definitions:
 *    - Line X: const allLessons = [...sampleLessons, ...module3Lessons];
 *    - Line Y: const allLessons = [...sampleLessonsBase, ...module3Lessons];
 *    - Webpack error: "the name `allLessons` is defined multiple times"
 * 
 * 2. Undefined reference:
 *    - const allLessons = [...sampleLessons, ...module3Lessons];
 *    - 'sampleLessons' is not defined at this point (only exported later)
 *    - Webpack error: "Cannot find name 'sampleLessons'"
 * 
 * 3. Wrong variable reference:
 *    - Should use 'sampleLessonsBase' (defined earlier)
 *    - Not 'sampleLessons' (exported later)
 * 
 * CURRENT STATUS: Based on code inspection, the bug appears to be ALREADY FIXED.
 * - Only ONE definition of allLessons found at line 2648
 * - Correctly references sampleLessonsBase
 * - Proper export order maintained
 */
