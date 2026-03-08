import { Tutorial } from '@/components/tutorial/TutorialOverlay';

export const sampleTutorials: Tutorial[] = [
  {
    id: 'tutorial-1-intro',
    title: 'Introducción a la Plataforma',
    description: 'Aprende a navegar por la interfaz de laboratorio y ejecutar tu primer código Python',
    difficulty: 'beginner',
    whatYouWillLearn: [
      'Cómo usar el editor de código',
      'Cómo ejecutar código Python',
      'Cómo ver los resultados',
      'Cómo resolver ejercicios'
    ],
    whatYouWillBuild: 'Tu primer programa Python que imprime un mensaje',
    steps: [
      {
        id: 'step-1',
        title: '¡Bienvenido a la Plataforma!',
        content: 'Esta es tu interfaz de laboratorio. Aquí aprenderás Python de forma interactiva.\n\nLa interfaz está dividida en 4 paneles:\n• Panel de Contenido (izquierda)\n• Panel de Código (centro)\n• Panel de Resultados (derecha)\n• Panel de Ejercicios (abajo)',
        position: 'bottom'
      },
      {
        id: 'step-2',
        title: 'Panel de Código',
        content: 'Este es el editor de código donde escribirás tus programas Python.\n\nPuedes escribir código directamente aquí y ejecutarlo.',
        targetElement: '[data-tutorial="code-panel"]',
        position: 'right',
        action: 'observe'
      },
      {
        id: 'step-3',
        title: 'Escribe tu Primer Código',
        content: 'Escribe el siguiente código en el editor:\n\nprint("¡Hola, Python!")\n\nEste código imprimirá un mensaje en la consola.',
        targetElement: '[data-tutorial="code-editor"]',
        position: 'right',
        action: 'type'
      },
      {
        id: 'step-4',
        title: 'Ejecutar el Código',
        content: 'Ahora haz clic en el botón "Ejecutar" o presiona Ctrl+Enter para ejecutar tu código.\n\nEl resultado aparecerá en el Panel de Resultados.',
        targetElement: '[data-tutorial="execute-button"]',
        position: 'bottom',
        action: 'click'
      },
      {
        id: 'step-5',
        title: 'Panel de Resultados',
        content: 'Aquí verás la salida de tu código.\n\nSi hay errores, también aparecerán aquí con explicaciones.',
        targetElement: '[data-tutorial="results-panel"]',
        position: 'left',
        action: 'observe'
      },
      {
        id: 'step-6',
        title: 'Panel de Ejercicios',
        content: 'Aquí encontrarás ejercicios prácticos para reforzar lo que aprendes.\n\nCada ejercicio tiene casos de prueba que validan tu solución automáticamente.',
        targetElement: '[data-tutorial="exercise-panel"]',
        position: 'top',
        action: 'observe'
      },
      {
        id: 'step-7',
        title: '¡Felicitaciones!',
        content: 'Has completado el tutorial de introducción.\n\nAhora estás listo para comenzar a aprender Python.\n\n¡Buena suerte!',
        position: 'bottom'
      }
    ]
  },
  {
    id: 'tutorial-1-1-variables',
    title: 'Variables en Python',
    description: 'Aprende a crear y usar variables para almacenar información',
    difficulty: 'beginner',
    whatYouWillLearn: [
      'Qué son las variables',
      'Cómo crear variables',
      'Tipos de datos básicos',
      'Cómo usar variables en cálculos'
    ],
    whatYouWillBuild: 'Un programa que calcula el valor de una inversión',
    steps: [
      {
        id: 'step-1',
        title: '¿Qué es una Variable?',
        content: 'Una variable es como una caja donde guardas información.\n\nEn Python, puedes crear una variable simplemente asignándole un valor:\n\nnombre = "Juan"\nedad = 25',
        position: 'bottom'
      },
      {
        id: 'step-2',
        title: 'Crear tu Primera Variable',
        content: 'Vamos a crear una variable para el precio de una acción.\n\nEscribe en el editor:\n\nprecio = 150.50\nprint(precio)',
        targetElement: '[data-tutorial="code-editor"]',
        position: 'right',
        action: 'type'
      },
      {
        id: 'step-3',
        title: 'Ejecuta el Código',
        content: 'Haz clic en "Ejecutar" para ver el valor de la variable.',
        targetElement: '[data-tutorial="execute-button"]',
        position: 'bottom',
        action: 'click'
      },
      {
        id: 'step-4',
        title: 'Múltiples Variables',
        content: 'Puedes crear varias variables y usarlas juntas.\n\nAhora agrega:\n\ncantidad = 10\nvalor_total = precio * cantidad\nprint(f"Valor total: ${valor_total}")',
        targetElement: '[data-tutorial="code-editor"]',
        position: 'right',
        action: 'type'
      },
      {
        id: 'step-5',
        title: 'Checkpoint: Variables',
        content: '¿Entiendes cómo funcionan las variables?\n\nRecuerda:\n• Las variables almacenan valores\n• Puedes usar variables en cálculos\n• Python infiere el tipo automáticamente',
        position: 'bottom'
      },
      {
        id: 'step-6',
        title: 'Practica con Ejercicios',
        content: 'Ahora intenta resolver el ejercicio "Variables básicas" en el Panel de Ejercicios.\n\nAplica lo que aprendiste sobre variables.',
        targetElement: '[data-tutorial="exercise-panel"]',
        position: 'top',
        action: 'observe'
      }
    ]
  },
  {
    id: 'tutorial-2-1-lists',
    title: 'Listas en Python',
    description: 'Aprende a trabajar con listas para almacenar múltiples valores',
    difficulty: 'beginner',
    whatYouWillLearn: [
      'Qué son las listas',
      'Cómo crear listas',
      'Cómo acceder a elementos',
      'Operaciones básicas con listas'
    ],
    whatYouWillBuild: 'Un programa que analiza precios históricos de acciones',
    steps: [
      {
        id: 'step-1',
        title: 'Introducción a las Listas',
        content: 'Las listas son colecciones ordenadas de elementos.\n\nPuedes almacenar múltiples valores en una sola variable:\n\nprecios = [100, 105, 102, 108]',
        position: 'bottom'
      },
      {
        id: 'step-2',
        title: 'Crear una Lista',
        content: 'Crea una lista de precios históricos:\n\nprecios = [100, 105, 102, 108, 110]\nprint(precios)',
        targetElement: '[data-tutorial="code-editor"]',
        position: 'right',
        action: 'type'
      },
      {
        id: 'step-3',
        title: 'Acceder a Elementos',
        content: 'Puedes acceder a elementos usando índices (empiezan en 0):\n\nprimer_precio = precios[0]\nultimo_precio = precios[-1]\nprint(f"Primero: {primer_precio}, Último: {ultimo_precio}")',
        targetElement: '[data-tutorial="code-editor"]',
        position: 'right',
        action: 'type'
      },
      {
        id: 'step-4',
        title: 'Operaciones con Listas',
        content: 'Python tiene funciones útiles para listas:\n\npromedio = sum(precios) / len(precios)\nmaximo = max(precios)\nminimo = min(precios)\nprint(f"Promedio: {promedio}")',
        targetElement: '[data-tutorial="code-editor"]',
        position: 'right',
        action: 'type'
      },
      {
        id: 'step-5',
        title: 'Checkpoint: Listas',
        content: '¿Entiendes cómo funcionan las listas?\n\nRecuerda:\n• Las listas almacenan múltiples valores\n• Los índices empiezan en 0\n• Puedes usar funciones como sum(), len(), max(), min()',
        position: 'bottom'
      }
    ]
  }
];

export function getTutorialById(tutorialId: string): Tutorial | undefined {
  return sampleTutorials.find(tutorial => tutorial.id === tutorialId);
}

export function getTutorialsByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Tutorial[] {
  return sampleTutorials.filter(tutorial => tutorial.difficulty === difficulty);
}
