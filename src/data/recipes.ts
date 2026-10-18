import type { Recipe } from '../types'

// ing: [nombre, cantidad (para 2 personas), unidad, sección]
// k: kcal aproximadas por persona, estimadas a partir de los ingredientes (orientativas).
export const BASE_RECIPES: readonly Recipe[] = [
  { id: 1, n: 'Tortilla de patatas', e: '🥔', t: 40, tg: ['v'], m: 'ld', k: 540, ing: [['Huevos', 6, 'ud', 'Lácteos y huevos'], ['Patatas', 500, 'g', 'Verdura y fruta'], ['Cebolla', 1, 'ud', 'Verdura y fruta'], ['Aceite de oliva', 100, 'ml', 'Despensa']] },
  { id: 2, n: 'Tostada de aguacate y huevo', e: '🥑', t: 10, tg: ['v'], m: 'ba', k: 380, ing: [['Pan', 4, 'rebanadas', 'Panadería'], ['Aguacate', 1, 'ud', 'Verdura y fruta'], ['Huevos', 2, 'ud', 'Lácteos y huevos']] },
  { id: 3, n: 'Porridge de avena y plátano', e: '🥣', t: 8, tg: ['v'], m: 'ba', k: 360, ing: [['Avena', 80, 'g', 'Despensa'], ['Leche', 400, 'ml', 'Lácteos y huevos'], ['Plátano', 2, 'ud', 'Verdura y fruta']] },
  { id: 4, n: 'Ensalada de garbanzos', e: '🥗', t: 15, tg: ['vg'], m: 'ld', k: 360, ing: [['Garbanzos cocidos', 400, 'g', 'Despensa'], ['Tomate', 2, 'ud', 'Verdura y fruta'], ['Pepino', 1, 'ud', 'Verdura y fruta'], ['Cebolla', 0.5, 'ud', 'Verdura y fruta']] },
  { id: 5, n: 'Pasta al pesto con tomatitos', e: '🍝', t: 20, tg: ['v'], m: 'ld', k: 590, ing: [['Pasta', 200, 'g', 'Despensa'], ['Pesto', 4, 'cucharadas', 'Despensa'], ['Tomates cherry', 150, 'g', 'Verdura y fruta'], ['Parmesano', 40, 'g', 'Lácteos y huevos']] },
  { id: 6, n: 'Pollo al horno con verduras', e: '🍗', t: 50, tg: [], m: 'ld', k: 620, ing: [['Muslos de pollo', 4, 'ud', 'Carne y pescado'], ['Patatas', 400, 'g', 'Verdura y fruta'], ['Zanahoria', 2, 'ud', 'Verdura y fruta'], ['Cebolla', 1, 'ud', 'Verdura y fruta']] },
  { id: 7, n: 'Salmón con arroz y brócoli', e: '🐟', t: 25, tg: [], m: 'ld', k: 650, ing: [['Filetes de salmón', 2, 'ud', 'Carne y pescado'], ['Arroz', 150, 'g', 'Despensa'], ['Brócoli', 200, 'g', 'Verdura y fruta']] },
  { id: 8, n: 'Curry de lentejas', e: '🍛', t: 35, tg: ['vg'], m: 'ld', k: 560, ing: [['Lentejas', 200, 'g', 'Despensa'], ['Leche de coco', 400, 'ml', 'Despensa'], ['Cebolla', 1, 'ud', 'Verdura y fruta'], ['Tomate triturado', 200, 'g', 'Despensa']] },
  { id: 9, n: 'Crema de calabacín', e: '🥬', t: 25, tg: ['vg'], m: 'd', k: 190, ing: [['Calabacín', 600, 'g', 'Verdura y fruta'], ['Patatas', 200, 'g', 'Verdura y fruta'], ['Cebolla', 1, 'ud', 'Verdura y fruta']] },
  { id: 10, n: 'Tacos de verduras', e: '🌮', t: 20, tg: ['vg'], m: 'ld', k: 380, ing: [['Tortillas de maíz', 6, 'ud', 'Panadería'], ['Pimiento', 2, 'ud', 'Verdura y fruta'], ['Cebolla', 1, 'ud', 'Verdura y fruta'], ['Aguacate', 1, 'ud', 'Verdura y fruta']] },
  { id: 11, n: 'Yogur con fresas y nueces', e: '🍓', t: 5, tg: ['v'], m: 'bam', k: 210, ing: [['Yogur natural', 2, 'ud', 'Lácteos y huevos'], ['Fresas', 150, 'g', 'Verdura y fruta'], ['Nueces', 30, 'g', 'Despensa']] },
  { id: 12, n: 'Hamburguesa casera', e: '🍔', t: 30, tg: [], m: 'ld', k: 480, ing: [['Carne picada', 300, 'g', 'Carne y pescado'], ['Pan de hamburguesa', 2, 'ud', 'Panadería'], ['Tomate', 1, 'ud', 'Verdura y fruta'], ['Lechuga', 1, 'ud', 'Verdura y fruta']] },
  // Ligeras para almuerzo y merienda
  { id: 13, n: 'Fruta con frutos secos', e: '🍎', t: 5, tg: ['vg'], m: 'am', k: 220, ing: [['Manzana', 2, 'ud', 'Verdura y fruta'], ['Almendras', 40, 'g', 'Despensa']] },
  { id: 14, n: 'Hummus con crudités', e: '🥕', t: 10, tg: ['vg'], m: 'am', k: 240, ing: [['Hummus', 200, 'g', 'Despensa'], ['Zanahoria', 2, 'ud', 'Verdura y fruta'], ['Pepino', 1, 'ud', 'Verdura y fruta']] },
  { id: 15, n: 'Batido de plátano y avena', e: '🥤', t: 5, tg: ['v'], m: 'bam', k: 280, ing: [['Plátano', 2, 'ud', 'Verdura y fruta'], ['Avena', 40, 'g', 'Despensa'], ['Leche', 400, 'ml', 'Lácteos y huevos']] },
  { id: 16, n: 'Tostada con tomate', e: '🍅', t: 5, tg: ['vg'], m: 'bam', k: 190, ing: [['Pan', 4, 'rebanadas', 'Panadería'], ['Tomate', 2, 'ud', 'Verdura y fruta'], ['Aceite de oliva', 20, 'ml', 'Despensa']] },
]
