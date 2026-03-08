/**
 * Python Syntax Validator
 * Provides real-time syntax validation for Python code in the Monaco editor
 */

export interface ValidationMarker {
  severity: 'error' | 'warning' | 'info';
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
}

export interface ValidationResult {
  markers: ValidationMarker[];
  hasErrors: boolean;
  hasWarnings: boolean;
}

/**
 * Validates Python code and returns markers for the Monaco editor
 */
export function validatePythonCode(code: string): ValidationResult {
  const markers: ValidationMarker[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    // 1. Detect print without parentheses (Python 2 style)
    if (/print\s+[^(]/.test(line) && !trimmedLine.startsWith('#')) {
      markers.push({
        severity: 'error',
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: '❌ En Python 3, print requiere paréntesis: print(...)\nEjemplo: print("Hola mundo")'
      });
    }

    // 2. Detect missing colon after if/for/while/def/class
    if (/^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\s+.*[^:]$/.test(line)) {
      const match = line.match(/^\s*(if|elif|else|for|while|def|class|try|except|finally|with)/);
      if (match && !line.includes(':')) {
        markers.push({
          severity: 'error',
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: line.length + 1,
          message: `❌ Falta dos puntos (:) al final de la declaración ${match[1]}\nEjemplo: ${match[1]} condición:`
        });
      }
    }

    // 3. Detect unmatched parentheses
    const openParens = (line.match(/\(/g) || []).length;
    const closeParens = (line.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      markers.push({
        severity: 'error',
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: '❌ Paréntesis no balanceados en esta línea\nVerifica que cada "(" tenga su correspondiente ")"'
      });
    }

    // 4. Detect unmatched brackets
    const openBrackets = (line.match(/\[/g) || []).length;
    const closeBrackets = (line.match(/\]/g) || []).length;
    if (openBrackets !== closeBrackets) {
      markers.push({
        severity: 'error',
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: '❌ Corchetes no balanceados en esta línea\nVerifica que cada "[" tenga su correspondiente "]"'
      });
    }

    // 5. Detect unmatched braces
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      markers.push({
        severity: 'error',
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: '❌ Llaves no balanceadas en esta línea\nVerifica que cada "{" tenga su correspondiente "}"'
      });
    }

    // 6. Detect common typos in imports
    const importTypos = [
      { wrong: 'yfinace', correct: 'yfinance' },
      { wrong: 'padas', correct: 'pandas' },
      { wrong: 'numpay', correct: 'numpy' },
      { wrong: 'matplotlb', correct: 'matplotlib' },
      { wrong: 'matplot', correct: 'matplotlib' }
    ];

    importTypos.forEach(({ wrong, correct }) => {
      if (line.includes(wrong)) {
        const match = line.indexOf(wrong);
        markers.push({
          severity: 'error',
          startLineNumber: lineNumber,
          startColumn: match + 1,
          endLineNumber: lineNumber,
          endColumn: match + wrong.length + 1,
          message: `❌ Error de ortografía: "${wrong}" debería ser "${correct}"`
        });
      }
    });

    // 7. Detect invalid variable names
    const invalidVarMatch = line.match(/^\s*(\d+\w+)\s*=/);
    if (invalidVarMatch) {
      markers.push({
        severity: 'error',
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: `❌ Nombre de variable inválido: "${invalidVarMatch[1]}"\nLas variables no pueden empezar con números`
      });
    }

    // 8. Detect common pandas/numpy typos
    const methodTypos = [
      { wrong: 'haed', correct: 'head' },
      { wrong: 'tail', correct: 'tail' },
      { wrong: 'desribe', correct: 'describe' },
      { wrong: 'groupy', correct: 'groupby' },
      { wrong: 'droppna', correct: 'dropna' },
      { wrong: 'fillna', correct: 'fillna' }
    ];

    methodTypos.forEach(({ wrong, correct }) => {
      const regex = new RegExp(`\\.${wrong}\\(`, 'g');
      if (regex.test(line)) {
        const match = line.indexOf(`.${wrong}(`);
        markers.push({
          severity: 'error',
          startLineNumber: lineNumber,
          startColumn: match + 1,
          endLineNumber: lineNumber,
          endColumn: match + wrong.length + 2,
          message: `❌ Método incorrecto: ".${wrong}()" debería ser ".${correct}()"`
        });
      }
    });

    // 9. Detect indentation issues (basic check)
    if (index > 0) {
      const prevLine = lines[index - 1].trim();
      const prevEndsWithColon = prevLine.endsWith(':');
      const currentIndent = line.match(/^\s*/)?.[0].length || 0;
      const prevIndent = lines[index - 1].match(/^\s*/)?.[0].length || 0;

      if (prevEndsWithColon && currentIndent <= prevIndent && trimmedLine) {
        markers.push({
          severity: 'error',
          startLineNumber: lineNumber,
          startColumn: 1,
          endLineNumber: lineNumber,
          endColumn: currentIndent + 1,
          message: '❌ Error de indentación: se esperaba un bloque indentado\nDespués de ":" debes indentar el código (4 espacios o 1 tab)'
        });
      }
    }
  });

  return {
    markers,
    hasErrors: markers.some(m => m.severity === 'error'),
    hasWarnings: markers.some(m => m.severity === 'warning')
  };
}

/**
 * Checks if a variable is used in the code
 */
export function isVariableUsed(varName: string, code: string, definitionLine: number): boolean {
  const lines = code.split('\n');
  
  // Check if variable is used after its definition
  for (let i = definitionLine; i < lines.length; i++) {
    const line = lines[i];
    // Skip the definition line itself
    if (i === definitionLine) continue;
    
    // Check if variable appears in the line (not in comments)
    const codeOnly = line.split('#')[0];
    const regex = new RegExp(`\\b${varName}\\b`);
    if (regex.test(codeOnly)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks if an import is used in the code
 */
export function isImportUsed(importName: string, code: string): boolean {
  const lines = code.split('\n');
  
  for (const line of lines) {
    // Skip import lines and comments
    if (line.trim().startsWith('import') || line.trim().startsWith('from') || line.trim().startsWith('#')) {
      continue;
    }
    
    // Check if import is used
    const regex = new RegExp(`\\b${importName}\\b`);
    if (regex.test(line)) {
      return true;
    }
  }
  
  return false;
}
