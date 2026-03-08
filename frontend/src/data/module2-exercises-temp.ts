// Module 2 exercises to be appended to exercises.ts

  // ============================================
  // LECCIÓN 2.1: Listas y Tuplas (ejercicios adicionales)
  // ============================================
  {
    id: 'ex-2-1-4',
    moduleId: '2',
    lessonId: '2-1',
    title: 'Métodos de listas',
    description: 'Usa métodos de listas para manipular una lista de precios.',
    difficulty: 'beginner',
    starterCode: String.raw`# Ejercicio: Métodos de listas
# Manipula una lista de precios usando métodos

precios = [150.0, 155.0, 148.0, 160.0]

# Tu código aquí:
# 1. Agrega un nuevo precio al final (165.0)


# 2. Inserta un precio en la posición 1 (152.0)


# 3. Ordena la lista de menor a mayor


# 4. Imprime la lista ordenada
print(precios)
`,
    testCases: [
      {
        input: '',
        expectedOutput: '[148.0, 150.0, 152.0, 155.0, 160.0, 165.0]',
        description: 'Debe manipular la lista correctamente'
      }
    ],
    hints: [
      {
        level: 1,
        type: 'conceptual',
        content: 'Métodos principales de listas:\n- append(x): agrega al final\n- insert(i, x): inserta en posición i\n- sort(): ordena la lista\n- remove(x): elimina el primer x\n- pop(): elimina y retorna el último'
      },
      {
        level: 2,
        type: 'example',
        content: 'Ejemplo:\n\nnumeros = [3, 1, 4]\nnumeros.append(2)  # [3, 1, 4, 2]\nnumeros.insert(0, 5)  # [5, 3, 1, 4, 2]\nnumeros.sort()  # [1, 2, 3, 4, 5]'
      },
      {
        level: 3,
        type: 'structure',
        content: 'Solución:\n\nprecios.append(165.0)\nprecios.insert(1, 152.0)\nprecios.sort()\nprint(precios)'
      }
    ],
    points: 10,
    orderIndex: 4
  },
