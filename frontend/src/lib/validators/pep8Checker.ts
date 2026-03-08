/**
 * PEP 8 Style Checker
 * Provides code quality suggestions based on PEP 8 Python style guide
 */

import { ValidationMarker } from './pythonValidator';
import { isVariableUsed, isImportUsed } from './pythonValidator';

export interface StyleCheckResult {
  markers: ValidationMarker[];
  suggestions: string[];
}

/**
 * Checks Python code for PEP 8 style violations
 */
export function checkPEP8Style(code: string): StyleCheckResult {
  const markers: ValidationMarker[] = [];
  const suggestions: string[] = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return;
    }

    // 1. Line length check (PEP 8: max 79 characters)
    if (line.length > 79) {
      markers.push({
        severity: 'warning',
        startLineNumber: lineNumber,
        startColumn: 80,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: `⚠️ Línea demasiado larga (${line.length} caracteres)\nPEP 8 recomienda máximo 79 caracteres por línea`
      });
    }

    // 2. Multiple statements on one line
    if (line.includes(';') && !trimmedLine.startsWith('#')) {
      markers.push({
        severity: 'warning',
        startLineNumber: lineNumber,
        startColumn: line.indexOf(';') + 1,
        endLineNumber: lineNumber,
        endColumn: line.indexOf(';') + 2,
        message: '⚠️ Múltiples declaraciones en una línea\nPEP 8 recomienda una declaración por línea'
      });
    }

    // 3. Trailing whitespace
    if (line.endsWith(' ') || line.endsWith('\t')) {
      markers.push({
        severity: 'info',
        startLineNumber: lineNumber,
        startColumn: line.trimEnd().length + 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: 'ℹ️ Espacios en blanco al final de la línea\nPEP 8 recomienda eliminar espacios al final'
      });
    }

    // 4. Naming conventions - variables should be snake_case
    const varMatch = line.match(/^\s*([a-z][a-zA-Z0-9]*)\s*=/);
    if (varMatch) {
      const varName = varMatch[1];
      if (/[A-Z]/.test(varName) && !varName.startsWith('_')) {
        markers.push({
          severity: 'info',
          startLineNumber: lineNumber,
          startColumn: line.indexOf(varName) + 1,
          endLineNumber: lineNumber,
          endColumn: line.indexOf(varName) + varName.length + 1,
          message: `ℹ️ Convención de nombres: "${varName}"\nPEP 8 recomienda snake_case para variables (ej: ${toSnakeCase(varName)})`
        });
      }
    }

    // 5. Function names should be snake_case
    const funcMatch = line.match(/^\s*def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (funcMatch) {
      const funcName = funcMatch[1];
      if (/[A-Z]/.test(funcName) && !funcName.startsWith('_')) {
        markers.push({
          severity: 'info',
          startLineNumber: lineNumber,
          startColumn: line.indexOf(funcName) + 1,
          endLineNumber: lineNumber,
          endColumn: line.indexOf(funcName) + funcName.length + 1,
          message: `ℹ️ Convención de nombres: "${funcName}"\nPEP 8 recomienda snake_case para funciones (ej: ${toSnakeCase(funcName)})`
        });
      }
    }

    // 6. Class names should be PascalCase
    const classMatch = line.match(/^\s*class\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (classMatch) {
      const className = classMatch[1];
      if (!/^[A-Z]/.test(className)) {
        markers.push({
          severity: 'info',
          startLineNumber: lineNumber,
          startColumn: line.indexOf(className) + 1,
          endLineNumber: lineNumber,
          endColumn: line.indexOf(className) + className.length + 1,
          message: `ℹ️ Convención de nombres: "${className}"\nPEP 8 recomienda PascalCase para clases (ej: ${toPascalCase(className)})`
        });
      }
    }

    // 7. Whitespace around operators
    const operatorMatch = line.match(/(\w+)([+\-*/%]|==|!=|<=|>=)(\w+)/);
    if (operatorMatch && !trimmedLine.startsWith('#')) {
      markers.push({
        severity: 'info',
        startLineNumber: lineNumber,
        startColumn: line.indexOf(operatorMatch[0]) + 1,
        endLineNumber: lineNumber,
        endColumn: line.indexOf(operatorMatch[0]) + operatorMatch[0].length + 1,
        message: 'ℹ️ Espacios alrededor de operadores\nPEP 8 recomienda: a + b en lugar de a+b'
      });
    }

    // 8. Whitespace after comma
    if (/,\w/.test(line) && !trimmedLine.startsWith('#')) {
      const match = line.match(/,\w/);
      if (match) {
        markers.push({
          severity: 'info',
          startLineNumber: lineNumber,
          startColumn: line.indexOf(match[0]) + 1,
          endLineNumber: lineNumber,
          endColumn: line.indexOf(match[0]) + 3,
          message: 'ℹ️ Espacio después de coma\nPEP 8 recomienda: [1, 2, 3] en lugar de [1,2,3]'
        });
      }
    }

    // 9. Comparison to None should use 'is' or 'is not'
    if (/==\s*None|None\s*==/.test(line)) {
      markers.push({
        severity: 'warning',
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: '⚠️ Comparación con None\nPEP 8 recomienda usar "is None" en lugar de "== None"'
      });
    }

    // 10. Comparison to True/False should use 'if var:' or 'if not var:'
    if (/==\s*(True|False)|(True|False)\s*==/.test(line)) {
      markers.push({
        severity: 'info',
        startLineNumber: lineNumber,
        startColumn: 1,
        endLineNumber: lineNumber,
        endColumn: line.length + 1,
        message: 'ℹ️ Comparación con booleanos\nPEP 8 recomienda "if var:" en lugar de "if var == True:"'
      });
    }
  });

  // 11. Check for unused variables
  const unusedVars = findUnusedVariables(code);
  unusedVars.forEach(({ name, line }) => {
    markers.push({
      severity: 'warning',
      startLineNumber: line,
      startColumn: 1,
      endLineNumber: line,
      endColumn: 100,
      message: `⚠️ Variable no utilizada: "${name}"\nConsidera eliminar esta variable o usarla en tu código`
    });
  });

  // 12. Check for unused imports
  const unusedImports = findUnusedImports(code);
  unusedImports.forEach(({ name, line }) => {
    markers.push({
      severity: 'warning',
      startLineNumber: line,
      startColumn: 1,
      endLineNumber: line,
      endColumn: 100,
      message: `⚠️ Importación no utilizada: "${name}"\nConsidera eliminar esta importación`
    });
  });

  // Generate suggestions summary
  if (markers.length > 0) {
    const errorCount = markers.filter(m => m.severity === 'error').length;
    const warningCount = markers.filter(m => m.severity === 'warning').length;
    const infoCount = markers.filter(m => m.severity === 'info').length;

    if (warningCount > 0) {
      suggestions.push(`${warningCount} advertencia(s) de estilo encontrada(s)`);
    }
    if (infoCount > 0) {
      suggestions.push(`${infoCount} sugerencia(s) de mejora disponible(s)`);
    }
  } else {
    suggestions.push('¡Excelente! Tu código sigue las convenciones de PEP 8');
  }

  return { markers, suggestions };
}

/**
 * Finds unused variables in the code
 */
function findUnusedVariables(code: string): Array<{ name: string; line: number }> {
  const unused: Array<{ name: string; line: number }> = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    // Match variable assignments
    const match = line.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=/);
    if (match) {
      const varName = match[1];
      // Skip common loop variables and special names
      if (['i', 'j', 'k', 'x', 'y', 'z', '_'].includes(varName)) {
        return;
      }
      
      if (!isVariableUsed(varName, code, index)) {
        unused.push({ name: varName, line: index + 1 });
      }
    }
  });

  return unused;
}

/**
 * Finds unused imports in the code
 */
function findUnusedImports(code: string): Array<{ name: string; line: number }> {
  const unused: Array<{ name: string; line: number }> = [];
  const lines = code.split('\n');

  lines.forEach((line, index) => {
    // Match 'import module' statements
    const importMatch = line.match(/^\s*import\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (importMatch) {
      const moduleName = importMatch[1];
      if (!isImportUsed(moduleName, code)) {
        unused.push({ name: moduleName, line: index + 1 });
      }
    }

    // Match 'from module import name' statements
    const fromMatch = line.match(/^\s*from\s+[a-zA-Z_][a-zA-Z0-9_.]*\s+import\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (fromMatch) {
      const importName = fromMatch[1];
      if (!isImportUsed(importName, code)) {
        unused.push({ name: importName, line: index + 1 });
      }
    }

    // Match 'import module as alias' statements
    const aliasMatch = line.match(/^\s*import\s+[a-zA-Z_][a-zA-Z0-9_.]*\s+as\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
    if (aliasMatch) {
      const alias = aliasMatch[1];
      if (!isImportUsed(alias, code)) {
        unused.push({ name: alias, line: index + 1 });
      }
    }
  });

  return unused;
}

/**
 * Converts a string to snake_case
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * Converts a string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
