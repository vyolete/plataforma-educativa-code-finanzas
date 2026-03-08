/**
 * Feedback Generator
 * Generates educational feedback messages for code execution results
 */

export interface FeedbackMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  suggestions?: string[];
  icon: string;
}

/**
 * Generates feedback for successful code execution
 */
export function generateSuccessFeedback(output: string, hasPlots: boolean): FeedbackMessage {
  const messages = [
    '¡Excelente trabajo! Tu código se ejecutó correctamente.',
    '¡Muy bien! El código funcionó sin errores.',
    '¡Perfecto! Tu código se ejecutó exitosamente.',
    '¡Genial! El código corrió sin problemas.',
    '¡Fantástico! Tu código funcionó a la perfección.'
  ];

  const suggestions: string[] = [];

  if (hasPlots) {
    suggestions.push('✓ Generaste visualizaciones correctamente');
  }

  if (output.length > 0) {
    suggestions.push('✓ Tu código produjo salida en consola');
  }

  return {
    type: 'success',
    title: messages[Math.floor(Math.random() * messages.length)],
    message: 'El código se ejecutó sin errores. Revisa los resultados en las pestañas correspondientes.',
    suggestions,
    icon: '🎉'
  };
}

/**
 * Generates feedback for code execution errors
 */
export function generateErrorFeedback(error: string): FeedbackMessage {
  const errorType = detectErrorType(error);
  
  let title = 'Error en la ejecución';
  let message = error;
  const suggestions: string[] = [];

  switch (errorType) {
    case 'SyntaxError':
      title = 'Error de Sintaxis';
      suggestions.push('💡 Revisa que todas las líneas terminen correctamente');
      suggestions.push('💡 Verifica que los paréntesis, corchetes y llaves estén balanceados');
      suggestions.push('💡 Asegúrate de que las declaraciones if/for/while/def terminen con dos puntos (:)');
      break;

    case 'NameError':
      title = 'Variable o Función No Definida';
      suggestions.push('💡 Verifica que hayas definido la variable antes de usarla');
      suggestions.push('💡 Revisa la ortografía del nombre de la variable');
      suggestions.push('💡 Asegúrate de haber importado las bibliotecas necesarias');
      break;

    case 'TypeError':
      title = 'Error de Tipo de Datos';
      suggestions.push('💡 Verifica que estés usando el tipo de datos correcto');
      suggestions.push('💡 Revisa que los argumentos de la función sean del tipo esperado');
      suggestions.push('💡 Asegúrate de convertir tipos cuando sea necesario (int(), str(), float())');
      break;

    case 'IndexError':
      title = 'Índice Fuera de Rango';
      suggestions.push('💡 Verifica que el índice esté dentro del rango de la lista');
      suggestions.push('💡 Recuerda que los índices en Python empiezan en 0');
      suggestions.push('💡 Usa len() para verificar el tamaño de la lista');
      break;

    case 'KeyError':
      title = 'Clave No Encontrada';
      suggestions.push('💡 Verifica que la clave existe en el diccionario');
      suggestions.push('💡 Usa .get() para evitar errores: dict.get("clave", valor_default)');
      suggestions.push('💡 Revisa la ortografía de la clave');
      break;

    case 'ValueError':
      title = 'Valor Inválido';
      suggestions.push('💡 Verifica que el valor sea válido para la operación');
      suggestions.push('💡 Revisa que los datos de entrada tengan el formato correcto');
      suggestions.push('💡 Asegúrate de manejar casos especiales (valores vacíos, None, etc.)');
      break;

    case 'AttributeError':
      title = 'Atributo o Método No Encontrado';
      suggestions.push('💡 Verifica que el objeto tenga el método o atributo que intentas usar');
      suggestions.push('💡 Revisa la ortografía del método');
      suggestions.push('💡 Asegúrate de que el objeto sea del tipo correcto');
      break;

    case 'ImportError':
      title = 'Error de Importación';
      suggestions.push('💡 Verifica que el nombre del módulo esté escrito correctamente');
      suggestions.push('💡 Asegúrate de que la biblioteca esté disponible en Pyodide');
      suggestions.push('💡 Bibliotecas disponibles: numpy, pandas, matplotlib, yfinance');
      break;

    case 'ZeroDivisionError':
      title = 'División por Cero';
      suggestions.push('💡 Verifica que el divisor no sea cero');
      suggestions.push('💡 Agrega una validación antes de dividir');
      suggestions.push('💡 Considera usar try/except para manejar este caso');
      break;

    case 'IndentationError':
      title = 'Error de Indentación';
      suggestions.push('💡 Verifica que la indentación sea consistente (4 espacios o 1 tab)');
      suggestions.push('💡 Asegúrate de indentar después de if/for/while/def/class');
      suggestions.push('💡 No mezcles espacios y tabs');
      break;

    default:
      suggestions.push('💡 Lee el mensaje de error cuidadosamente');
      suggestions.push('💡 Revisa la línea indicada en el error');
      suggestions.push('💡 Intenta ejecutar el código paso a paso para identificar el problema');
  }

  return {
    type: 'error',
    title,
    message,
    suggestions,
    icon: '❌'
  };
}

/**
 * Generates feedback for exercise validation
 */
export function generateExerciseFeedback(
  passed: number,
  total: number,
  failedTests?: Array<{ name: string; expected: any; actual: any }>
): FeedbackMessage {
  if (passed === total) {
    return {
      type: 'success',
      title: '¡Ejercicio Completado! 🎉',
      message: `Pasaste todos los ${total} casos de prueba. ¡Excelente trabajo!`,
      suggestions: [
        '✓ Todos los tests pasaron correctamente',
        '✓ Tu solución es correcta',
        '✓ Puedes continuar con el siguiente ejercicio'
      ],
      icon: '🏆'
    };
  }

  const suggestions: string[] = [];
  suggestions.push(`✓ ${passed} de ${total} tests pasaron`);
  suggestions.push(`✗ ${total - passed} tests fallaron`);

  if (failedTests && failedTests.length > 0) {
    suggestions.push('');
    suggestions.push('Tests que fallaron:');
    failedTests.slice(0, 3).forEach(test => {
      suggestions.push(`  • ${test.name}`);
      suggestions.push(`    Esperado: ${formatValue(test.expected)}`);
      suggestions.push(`    Obtenido: ${formatValue(test.actual)}`);
    });
  }

  return {
    type: 'warning',
    title: 'Algunos Tests Fallaron',
    message: `${passed} de ${total} casos de prueba pasaron. Revisa los tests que fallaron e intenta nuevamente.`,
    suggestions,
    icon: '⚠️'
  };
}

/**
 * Generates code quality suggestions
 */
export function generateQualitySuggestions(code: string): string[] {
  const suggestions: string[] = [];

  // Check code length
  const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  if (lines.length > 50) {
    suggestions.push('💡 Considera dividir tu código en funciones más pequeñas');
  }

  // Check for comments
  const commentLines = code.split('\n').filter(line => line.trim().startsWith('#'));
  if (commentLines.length === 0 && lines.length > 10) {
    suggestions.push('💡 Agrega comentarios para explicar tu código');
  }

  // Check for magic numbers
  const hasNumbers = /\b\d{3,}\b/.test(code);
  if (hasNumbers) {
    suggestions.push('💡 Considera usar constantes con nombres descriptivos en lugar de números directos');
  }

  // Check for good practices
  if (code.includes('import pandas') && !code.includes('import pandas as pd')) {
    suggestions.push('💡 Convención: importa pandas como "pd" (import pandas as pd)');
  }

  if (code.includes('import numpy') && !code.includes('import numpy as np')) {
    suggestions.push('💡 Convención: importa numpy como "np" (import numpy as np)');
  }

  if (code.includes('import matplotlib.pyplot') && !code.includes('import matplotlib.pyplot as plt')) {
    suggestions.push('💡 Convención: importa matplotlib.pyplot como "plt"');
  }

  return suggestions;
}

/**
 * Detects the type of error from error message
 */
function detectErrorType(error: string): string {
  const errorTypes = [
    'SyntaxError',
    'NameError',
    'TypeError',
    'IndexError',
    'KeyError',
    'ValueError',
    'AttributeError',
    'ImportError',
    'ZeroDivisionError',
    'IndentationError'
  ];

  for (const type of errorTypes) {
    if (error.includes(type)) {
      return type;
    }
  }

  return 'Unknown';
}

/**
 * Formats a value for display
 */
function formatValue(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
