/**
 * ICMR-NIN (Indian Council of Medical Research - National Institute of Nutrition)
 * & FSSAI (Food Safety Standards Authority of India) Standards Database.
 * Includes Sugar & Fat disguised aliases list and healthier Indian food swaps.
 */

// ICMR-NIN Recommended Daily Allowances for Indian Adults & Children
export const ICMR_NIN_STANDARDS = {
  dailyCaloricIntake: 2110, // kcal for Indian adult male / 1900 for female
  addedSugarMaxGrams: 25,    // ICMR max daily added sugar = 25g (5 teaspoons)
  sodiumMaxMg: 2000,         // ICMR max daily sodium = 2000mg (5g salt)
  satFatMaxGrams: 15,        // ICMR max saturated fat = 15g
  transFatMaxGrams: 0,       // FSSAI limit = <0.2g per 100g (virtually 0)
  proteinTargetGrams: 54     // ICMR RDA protein = 0.83g/kg body weight (~54g/day)
};

// 50+ Disguised Sugar Aliases used in food processing for "Ingredient Splitting"
export const SUGAR_ALIASES = [
  'sugar', 'cane sugar', 'invert sugar', 'high fructose corn syrup', 'hfcs',
  'corn syrup', 'maltodextrin', 'dextrose', 'fructose', 'glucose', 'glucose syrup',
  'apple juice concentrate', 'grape juice concentrate', 'pear juice concentrate',
  'agave nectar', 'tapioca syrup', 'date syrup', 'date paste', 'malt extract',
  'barley malt', 'rice syrup', 'brown rice syrup', 'sucrose', 'caramel', 'molasses',
  'golden syrup', 'isoglucose', 'crystalline fructose', 'treacle', 'ethyl maltol'
];

// Disguised Fat & Refined Oil Aliases
export const FAT_ALIASES = [
  'vanaspati', 'hydrogenated vegetable oil', 'partially hydrogenated oil',
  'palm oil', 'palm kernel oil', 'fractionated palm oil', 'interesterified fat',
  'margarine', 'shortening', 'refined cottonseed oil', 'refined soybean oil',
  'refined sunflower oil', 'refined canola oil'
];

// Healthier Indian Swaps Database mapped by category
export const INDIAN_HEALTHIER_SWAPS = {
  biscuits: [
    {
      name: 'Ragi & Oats Jaggery Cookies',
      brand: 'NutriChoice / Local Organic',
      whyBetter: 'Uses whole millet ragi, oats, and natural jaggery instead of refined maida and white sugar. Zero palm oil.',
      healthScore: 88,
      sugar: 4,
      protein: 4.5
    },
    {
      name: 'Roasted Chana & Flaxseed Crackers',
      brand: 'Desi Snacks',
      whyBetter: 'High protein chickpea base with fiber-rich flaxseeds. Low glycemic index for diabetics.',
      healthScore: 92,
      sugar: 1,
      protein: 7
    }
  ],
  beverages: [
    {
      name: 'Spiced Buttermilk (Chaas / Majjiga)',
      brand: 'Amul / Fresh Homemade',
      whyBetter: 'Natural probiotic fermented dairy rich in calcium and electrolyte potassium. Zero artificial sweeteners or E211.',
      healthScore: 95,
      sugar: 2,
      protein: 3.5
    },
    {
      name: 'Unsweetened Coconut Water',
      brand: 'Raw Pressery / Fresh Coconut',
      whyBetter: 'Pure hydration with bioavailable magnesium and potassium. Natural electrolytes without added syrups.',
      healthScore: 94,
      sugar: 4,
      protein: 1
    }
  ],
  candies: [
    {
      name: 'Organic Amla Candy (Jaggery Coated)',
      brand: 'Patanjali / Organic India',
      whyBetter: 'Packed with natural Vitamin C from Indian gooseberry (Amla) sweetened with iron-rich jaggery instead of Red 40 dye and HFCS.',
      healthScore: 86,
      sugar: 6,
      protein: 1
    }
  ],
  spreads: [
    {
      name: 'Single-Ingredient Roasted Peanut Butter',
      brand: 'Pintola / Whole Truth',
      whyBetter: 'Contains 100% roasted peanuts. Zero added sugar, zero palm oil, zero hydrogenated fat.',
      healthScore: 92,
      sugar: 1.5,
      protein: 9.5
    }
  ],
  chips: [
    {
      name: 'Air-Roasted Makhana (Foxnuts) with Sea Salt',
      brand: 'Farmley / Taali',
      whyBetter: 'Low calorie roasted lotus seeds packed with antioxidants. 70% less fat than fried potato chips and zero MSG.',
      healthScore: 89,
      sugar: 0,
      protein: 3.5
    }
  ]
};
