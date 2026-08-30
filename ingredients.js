/**
 * Ingredient Classification & Categorization Database
 */

export const INGREDIENT_CATEGORIES = {
  WHOLE_FOOD: 'Whole / Minimally Processed Food',
  PROCESSED_SUGAR: 'Added Sugar & Caloric Sweetener',
  ARTIFICIAL_SWEETENER: 'Non-Caloric / Artificial Sweetener',
  INDUSTRIAL_OIL: 'Refined / Industrial Oil',
  ADDITIVE: 'Food Additive / E-Number',
  ARTIFICIAL_COLOR: 'Artificial Color / Dye',
  PRESERVATIVE: 'Preservative / Antioxidant',
  EMULSIFIER: 'Emulsifier & Texture Stabilizer',
  FLAVOR_ENHANCER: 'Flavoring & Flavor Enhancer',
  ALLERGEN_BASE: 'Primary Allergen Source'
};

export const COMMON_INGREDIENTS = [
  // Sugar variants
  { name: 'Sugar', category: INGREDIENT_CATEGORIES.PROCESSED_SUGAR, concern: 'Added sugar, spikes insulin', status: 'watch' },
  { name: 'Cane Sugar', category: INGREDIENT_CATEGORIES.PROCESSED_SUGAR, concern: 'Refined sugar', status: 'watch' },
  { name: 'Invert Sugar', category: INGREDIENT_CATEGORIES.PROCESSED_SUGAR, concern: 'Processed liquid sugar', status: 'watch' },
  { name: 'Apple Juice Concentrate', category: INGREDIENT_CATEGORIES.PROCESSED_SUGAR, concern: 'De-flavored liquid sugar used to disguise added sugar', status: 'watch' },
  { name: 'Honey', category: INGREDIENT_CATEGORIES.PROCESSED_SUGAR, concern: 'Natural caloric sweetener', status: 'watch' },

  // Industrial oils
  { name: 'Palm Oil', category: INGREDIENT_CATEGORIES.INDUSTRIAL_OIL, concern: 'High saturated fat', status: 'watch' },
  { name: 'Soybean Oil', category: INGREDIENT_CATEGORIES.INDUSTRIAL_OIL, concern: 'Refined seed oil high in Omega-6', status: 'watch' },
  { name: 'Canola Oil', category: INGREDIENT_CATEGORIES.INDUSTRIAL_OIL, concern: 'Highly refined vegetable oil', status: 'watch' },
  { name: 'Sunflower Oil', category: INGREDIENT_CATEGORIES.INDUSTRIAL_OIL, concern: 'Refined seed oil', status: 'watch' },
  { name: 'Hydrogenated Vegetable Oil', category: INGREDIENT_CATEGORIES.INDUSTRIAL_OIL, concern: 'Contains trans fats', status: 'flag' },

  // Whole foods
  { name: 'Whole Grain Oats', category: INGREDIENT_CATEGORIES.WHOLE_FOOD, concern: 'Rich in dietary beta-glucan fiber', status: 'good' },
  { name: 'Almonds', category: INGREDIENT_CATEGORIES.WHOLE_FOOD, concern: 'Healthy fats, protein, vitamin E', status: 'good' },
  { name: 'Organic Apples', category: INGREDIENT_CATEGORIES.WHOLE_FOOD, concern: 'Whole fruit fiber & vitamins', status: 'good' },
  { name: 'Sea Salt', category: INGREDIENT_CATEGORIES.WHOLE_FOOD, concern: 'Sodium content requires monitoring', status: 'watch' }
];
