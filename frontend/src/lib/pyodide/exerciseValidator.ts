/**
 * Exercise Validator
 * 
 * Validates student code against test cases using Pyodide.
 * Runs test cases and compares expected vs actual output.
 */

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface ValidationResult {
  status: 'correct' | 'incorrect' | 'error';
  passedTests: number;
  totalTests: number;
  failedTests: Array<{
    testIndex: number;
    description: string;
    expected: string;
    actual: string;
    error?: string;
  }>;
  output: string;
  executionTimeMs: number;
}

/**
 * Validates student code against test cases
 * 
 * @param code - Student's code to validate
 * @param testCases - Array of test cases to run
 * @param pyodide - Pyodide instance
 * @returns Validation result with pass/fail status
 */
export async function validateExercise(
  code: string,
  testCases: TestCase[],
  pyodide: any
): Promise<ValidationResult> {
  const startTime = performance.now();
  const failedTests: ValidationResult['failedTests'] = [];
  let passedTests = 0;
  let fullOutput = '';

  try {
    // Setup stdout capture
    await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
    `);

    // Run each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        // Clear stdout for this test
        await pyodide.runPythonAsync(`
sys.stdout = StringIO()
        `);

        // Prepare test code
        let testCode = code;
        
        // If test has input, inject it
        if (testCase.input) {
          // Replace input() calls with predefined values
          const inputValues = testCase.input.split('\n');
          const inputSetup = `
_test_inputs = ${JSON.stringify(inputValues)}
_test_input_index = 0

def input(prompt=''):
    global _test_input_index
    if _test_input_index < len(_test_inputs):
        value = _test_inputs[_test_input_index]
        _test_input_index += 1
        print(prompt + value)
        return value
    return ''
`;
          testCode = inputSetup + '\n' + testCode;
        }

        // Execute the code
        await pyodide.runPythonAsync(testCode);

        // Get output
        const output = await pyodide.runPythonAsync(`
sys.stdout.getvalue()
        `);

        // Normalize output for comparison
        const actualOutput = normalizeOutput(output);
        const expectedOutput = normalizeOutput(testCase.expectedOutput);

        fullOutput += `Test ${i + 1}: ${testCase.description}\n`;
        fullOutput += `Output: ${actualOutput}\n\n`;

        // Compare outputs
        if (actualOutput === expectedOutput) {
          passedTests++;
        } else {
          failedTests.push({
            testIndex: i + 1,
            description: testCase.description,
            expected: expectedOutput,
            actual: actualOutput
          });
        }
      } catch (error: any) {
        // Test execution error
        failedTests.push({
          testIndex: i + 1,
          description: testCase.description,
          expected: testCase.expectedOutput,
          actual: '',
          error: error.message || 'Execution error'
        });
        
        fullOutput += `Test ${i + 1}: ${testCase.description}\n`;
        fullOutput += `Error: ${error.message}\n\n`;
      }
    }

    const executionTimeMs = Math.round(performance.now() - startTime);

    // Determine overall status
    const status = passedTests === testCases.length ? 'correct' : 'incorrect';

    return {
      status,
      passedTests,
      totalTests: testCases.length,
      failedTests,
      output: fullOutput,
      executionTimeMs
    };

  } catch (error: any) {
    // Global execution error
    const executionTimeMs = Math.round(performance.now() - startTime);
    
    return {
      status: 'error',
      passedTests: 0,
      totalTests: testCases.length,
      failedTests: testCases.map((tc, i) => ({
        testIndex: i + 1,
        description: tc.description,
        expected: tc.expectedOutput,
        actual: '',
        error: error.message || 'Execution error'
      })),
      output: `Error: ${error.message}`,
      executionTimeMs
    };
  }
}

/**
 * Normalizes output for comparison
 * - Trims whitespace
 * - Normalizes line endings
 * - Removes trailing newlines
 */
function normalizeOutput(output: string): string {
  return output
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n+$/, '');
}

/**
 * Formats validation result for display
 */
export function formatValidationResult(result: ValidationResult): string {
  let message = '';

  if (result.status === 'correct') {
    message = `✅ ¡Excelente! Todos los tests pasaron (${result.passedTests}/${result.totalTests})\n\n`;
  } else if (result.status === 'incorrect') {
    message = `❌ Algunos tests fallaron (${result.passedTests}/${result.totalTests} pasaron)\n\n`;
    
    result.failedTests.forEach(test => {
      message += `Test ${test.testIndex}: ${test.description}\n`;
      if (test.error) {
        message += `  Error: ${test.error}\n`;
      } else {
        message += `  Esperado: ${test.expected}\n`;
        message += `  Obtenido: ${test.actual}\n`;
      }
      message += '\n';
    });
  } else {
    message = `⚠️ Error al ejecutar el código\n\n`;
    message += result.output;
  }

  message += `\nTiempo de ejecución: ${result.executionTimeMs}ms`;

  return message;
}
