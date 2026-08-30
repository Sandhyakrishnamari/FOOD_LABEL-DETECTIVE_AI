/**
 * Preset Sample Food Labels Dataset
 * Provides rich, realistic packaged food labels for instant testing and demonstration.
 */

export const SAMPLE_LABELS = [
  {
    id: 'sample_protein_bar',
    name: 'Protein Crunch Granola Bar',
    brand: 'FitLife Snacks',
    frontImage: 'https://images.unsplash.com/photo-1622484210800-885107928926?auto=format&fit=crop&w=600&q=80',
    frontClaims: ['NO ADDED SUGAR', 'HIGH PROTEIN'],
    rawIngredients: 'Soy Protein Isolate, Maltodextrin, Apple Juice Concentrate, Palm Kernel Oil, Whole Grain Oats, Milk Whey Solids, Soy Lecithin, E211 (Sodium Benzoate), E102 (Tartrazine Yellow 5), Natural Flavors, Salt.',
    nutrition: {
      servingSize: '1 Bar (50g)',
      calories: 220,
      fat: 8.5,
      saturatedFat: 3.5,
      transFat: 0,
      cholesterol: 5,
      sodium: 210,
      carbs: 26,
      fiber: 2.5,
      sugar: 14,
      addedSugar: 11,
      protein: 12
    }
  },
  {
    id: 'sample_citrus_soda',
    name: 'Zero Sugar Citrus Blast Soda',
    brand: 'Vibe Drinks',
    frontImage: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    frontClaims: ['ZERO SUGAR', '100% NATURAL'],
    rawIngredients: 'Carbonated Water, Citric Acid, E951 (Aspartame), E955 (Sucralose), E211 (Sodium Benzoate), E102 (Tartrazine), Caffeine, Natural & Artificial Flavors, E321 (BHT).',
    nutrition: {
      servingSize: '1 Can (355ml)',
      calories: 5,
      fat: 0,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 0,
      sodium: 45,
      carbs: 1,
      fiber: 0,
      sugar: 0,
      addedSugar: 0,
      protein: 0
    }
  },
  {
    id: 'sample_fruit_chews',
    name: 'Super Berry Gummy Fruit Chews',
    brand: 'SweetBites',
    frontImage: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=600&q=80',
    frontClaims: ['MADE WITH REAL FRUIT', 'FAT FREE'],
    rawIngredients: 'High Fructose Corn Syrup, Sugar, Apple Juice Concentrate, Modified Corn Starch, Citric Acid, E129 (Red 40), E133 (Blue 1), Mineral Oil, Carnauba Wax, Artificial Flavors.',
    nutrition: {
      servingSize: '1 Pouch (40g)',
      calories: 140,
      fat: 0,
      saturatedFat: 0,
      transFat: 0,
      cholesterol: 0,
      sodium: 35,
      carbs: 34,
      fiber: 0,
      sugar: 26,
      addedSugar: 24,
      protein: 0
    }
  },
  {
    id: 'sample_almond_butter',
    name: 'Organic Roasted Almond & Chia Butter',
    brand: 'Pure Earth Nutritives',
    frontImage: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    frontClaims: ['100% NATURAL', 'KETO FRIENDLY', 'NO ADDED SUGAR'],
    rawIngredients: 'Organic Dry Roasted Almonds, Organic Chia Seeds, Sea Salt.',
    nutrition: {
      servingSize: '2 tbsp (32g)',
      calories: 190,
      fat: 16,
      saturatedFat: 1.5,
      transFat: 0,
      cholesterol: 0,
      sodium: 65,
      carbs: 6,
      fiber: 4,
      sugar: 1,
      addedSugar: 0,
      protein: 8
    }
  },
  {
    id: 'sample_spicy_chips',
    name: 'Fiery Chili Flavored Potato Chips',
    brand: 'CrunchMaster',
    frontImage: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    frontClaims: ['MADE WITH REAL SPICES'],
    rawIngredients: 'Potatoes, Hydrogenated Palm Oil, Maltodextrin, Salt, E621 (Monosodium Glutamate), Chili Powder, E129 (Allura Red 40), E320 (BHA Preservative), E450 (Diphosphates), Citric Acid.',
    nutrition: {
      servingSize: '1 Bag (50g)',
      calories: 270,
      fat: 17,
      saturatedFat: 7,
      transFat: 0.5,
      cholesterol: 0,
      sodium: 680,
      carbs: 26,
      fiber: 2,
      sugar: 2,
      addedSugar: 0,
      protein: 3
    }
  }
];
