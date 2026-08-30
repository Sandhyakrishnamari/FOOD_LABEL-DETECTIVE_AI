/**
 * Marketing Claim Buster Rules & Verification Patterns
 * Signature Feature: Cross-examines front-of-pack claims against actual ingredients & nutrition
 */

export const MARKETING_CLAIMS = [
  {
    id: 'no_added_sugar',
    claimText: 'NO ADDED SUGAR',
    aliases: ['no added sugar', 'without added sugar', '0% added sugar', 'no sugar added'],
    category: 'Sugar Claim',
    description: 'Promises no refined sugars or caloric syrups were added during manufacturing.',
    suspiciousIngredients: [
      'apple juice concentrate', 'grape juice concentrate', 'pear juice concentrate',
      'maltodextrin', 'high fructose corn syrup', 'corn syrup', 'agave nectar',
      'date paste', 'invert sugar', 'dextrose', 'malt extract', 'tapioca syrup', 'honey', 'maple syrup'
    ],
    verify: (extractedData) => {
      const { ingredientsText = '', nutrition = {} } = extractedData;
      const lowerIng = ingredientsText.toLowerCase();
      
      const foundSuspicious = [];
      const suspicious = [
        'apple juice concentrate', 'grape juice concentrate', 'pear juice concentrate',
        'maltodextrin', 'high fructose corn syrup', 'corn syrup', 'agave nectar',
        'date paste', 'invert sugar', 'dextrose', 'malt extract', 'tapioca syrup', 'honey'
      ];

      for (const s of suspicious) {
        if (lowerIng.includes(s)) {
          foundSuspicious.push(s);
        }
      }

      const addedSugar = nutrition.addedSugar || 0;
      const totalSugar = nutrition.sugar || 0;

      if (foundSuspicious.length > 0 || addedSugar > 2) {
        let penalty = 30 + (foundSuspicious.length * 20) + (addedSugar > 5 ? 20 : 0);
        let truthIndex = Math.max(15, 100 - penalty);
        return {
          claim: 'NO ADDED SUGAR',
          status: truthIndex > 70 ? 'mostly_accurate' : truthIndex > 40 ? 'misleading' : 'busted',
          truthIndex,
          finding: `Claim is misleading. Contains ${foundSuspicious.length > 0 ? foundSuspicious.join(', ') : `${addedSugar}g added sugar equivalents`}. Concentrated fruit juices and maltodextrin function biologically as high-glycemic sugars.`,
          evidence: [
            foundSuspicious.length > 0 ? `Detected hidden caloric sweetener / high-GI bulking agent: ${foundSuspicious.join(', ')}` : null,
            totalSugar > 10 ? `Total sugar is high (${totalSugar}g per serving)` : null
          ].filter(Boolean)
        };
      }

      return {
        claim: 'NO ADDED SUGAR',
        status: 'verified_true',
        truthIndex: 95,
        finding: 'Investigation confirmed: No refined sugars, corn syrups, or concentrated fruit juices detected in the ingredient list.',
        evidence: ['Ingredient list is free of added syrups, maltodextrin, and fruit concentrates.']
      };
    }
  },
  {
    id: 'high_protein',
    claimText: 'HIGH PROTEIN',
    aliases: ['high protein', 'protein rich', 'packed with protein', '20g protein', 'protein snack'],
    category: 'Macronutrient Claim',
    description: 'Promotes high protein content for muscle building, satiety, or fitness.',
    verify: (extractedData) => {
      const { nutrition = {}, ingredientsText = '' } = extractedData;
      const protein = nutrition.protein || 0;
      const calories = nutrition.calories || 1;
      const sugar = nutrition.sugar || 0;
      const satFat = nutrition.saturatedFat || 0;

      // Calculate protein density: % of calories from protein (1g protein = 4 kcal)
      const proteinCalories = protein * 4;
      const proteinRatio = (proteinCalories / calories) * 100;

      if (protein < 5) {
        return {
          claim: 'HIGH PROTEIN',
          status: 'busted',
          truthIndex: 25,
          finding: `Claim busted! Contains only ${protein}g of protein per serving, which does not qualify as a high-protein source (FDA requires >= 10g per serving for a "high" claim).`,
          evidence: [`Only ${protein}g protein per serving.`, `Provides less than 10% Daily Value.`]
        };
      }

      if (sugar > 12 || satFat > 4) {
        const truthIndex = Math.max(45, 85 - Math.round(sugar * 2 + satFat * 3));
        return {
          claim: 'HIGH PROTEIN',
          status: 'misleading',
          truthIndex,
          finding: `Protein content is good (${protein}g), BUT comes with high sugar (${sugar}g) and saturated fat (${satFat}g). The product is calorically dense and resembles a candy bar nutritionally.`,
          evidence: [
            `Protein: ${protein}g per serving`,
            `Sugar penalty: ${sugar}g of sugar counteracts health benefits`,
            `Saturated fat: ${satFat}g`
          ]
        };
      }

      return {
        claim: 'HIGH PROTEIN',
        status: 'verified_true',
        truthIndex: 92,
        finding: `Verified! Provides ${protein}g of clean protein per serving with low sugar (${sugar}g) and low saturated fat.`,
        evidence: [`Protein accounts for ${Math.round(proteinRatio)}% of total calories.`, `Low sugar and balanced nutritional profile.`]
      };
    }
  },
  {
    id: 'all_natural',
    claimText: '100% NATURAL',
    aliases: ['100% natural', 'all natural', 'natural ingredients', 'natural recipe', 'made with natural ingredients'],
    category: 'Purity Claim',
    description: 'Implies the food is unrefined and free from synthetic chemicals, artificial dyes, or industrial additives.',
    verify: (extractedData) => {
      const { ingredientsText = '' } = extractedData;
      const lowerIng = ingredientsText.toLowerCase();

      const syntheticAdditives = [
        'e211', 'sodium benzoate', 'e250', 'sodium nitrite', 'e320', 'bha', 'e321', 'bht',
        'red 40', 'yellow 5', 'blue 1', 'caramel color', 'maltodextrin', 'carboxymethyl cellulose',
        'polysorbate 80', 'artificial flavor', 'hydrogenated'
      ];

      const foundSynthetic = syntheticAdditives.filter(s => lowerIng.includes(s));

      if (foundSynthetic.length > 0) {
        return {
          claim: '100% NATURAL',
          status: 'busted',
          truthIndex: 30,
          finding: `Claim busted! Contradicted by the presence of ultra-processed or synthetic ingredients: ${foundSynthetic.join(', ')}.`,
          evidence: [
            `FDA/USDA guidance notes natural products should not contain artificial colors, synthetic flavors, or chemical preservatives.`,
            `Detected ultra-processed component(s): ${foundSynthetic.join(', ')}`
          ]
        };
      }

      return {
        claim: '100% NATURAL',
        status: 'verified_true',
        truthIndex: 90,
        finding: 'Verified! No synthetic dyes, chemical preservatives, or artificial flavorings detected in the ingredient list.',
        evidence: ['Ingredient list contains whole foods and natural extracts only.']
      };
    }
  },
  {
    id: 'keto_friendly',
    claimText: 'KETO FRIENDLY',
    aliases: ['keto friendly', 'keto', 'low carb', 'keto certified'],
    category: 'Dietary Claim',
    description: 'Claims compatibility with low-carbohydrate ketogenic diets (typically <5g net carbs per serving).',
    verify: (extractedData) => {
      const { nutrition = {}, ingredientsText = '' } = extractedData;
      const carbs = nutrition.carbs || 0;
      const fiber = nutrition.fiber || 0;
      const sugar = nutrition.sugar || 0;
      const netCarbs = Math.max(0, carbs - fiber);

      const lowerIng = ingredientsText.toLowerCase();
      const hiddenCarbs = ['maltodextrin', 'sugar', 'high fructose corn syrup', 'wheat flour', 'tapioca starch', 'rice flour'].filter(h => lowerIng.includes(h));

      if (netCarbs > 7 || hiddenCarbs.length > 0) {
        const truthIndex = Math.max(20, 90 - (netCarbs * 5 + hiddenCarbs.length * 15));
        return {
          claim: 'KETO FRIENDLY',
          status: truthIndex > 50 ? 'misleading' : 'busted',
          truthIndex,
          finding: `Product has ${netCarbs}g net carbs per serving${hiddenCarbs.length > 0 ? ` and contains high-GI ingredients: ${hiddenCarbs.join(', ')}` : ''}, which will disrupt ketosis.`,
          evidence: [
            `Total Carbohydrates: ${carbs}g`,
            `Dietary Fiber: ${fiber}g`,
            `Net Carbs: ${netCarbs}g (Keto limit is < 3-5g net carbs per serving)`,
            hiddenCarbs.length > 0 ? `Contains ketosis-disrupting ingredient(s): ${hiddenCarbs.join(', ')}` : null
          ].filter(Boolean)
        };
      }

      return {
        claim: 'KETO FRIENDLY',
        status: 'verified_true',
        truthIndex: 94,
        finding: `Verified! Net carbs are low (${netCarbs}g) and ingredients are free of high-GI refined grains or sugars.`,
        evidence: [`Net carbs: ${netCarbs}g per serving. High fat and fiber balance.`]
      };
    }
  },
  {
    id: 'real_fruit',
    claimText: 'MADE WITH REAL FRUIT',
    aliases: ['made with real fruit', 'real fruit', 'real fruit ingredients', 'contains real fruit juice'],
    category: 'Ingredient Quality Claim',
    description: 'Suggests the product contains whole fruit content rather than artificial flavorings or sugary syrups.',
    verify: (extractedData) => {
      const { ingredientsText = '', nutrition = {} } = extractedData;
      const lowerIng = ingredientsText.toLowerCase();

      // Check position of fruit in ingredient list
      const ingredients = lowerIng.split(/[,;\(\)]/).map(s => s.trim());
      const fruitIndex = ingredients.findIndex(i => i.includes('apple') || i.includes('strawberry') || i.includes('orange') || i.includes('fruit') || i.includes('berry'));

      const isConcentrateOnly = lowerIng.includes('concentrate') && !lowerIng.includes('whole fruit') && !lowerIng.includes('puree');

      if (fruitIndex > 3 || fruitIndex === -1 || isConcentrateOnly) {
        return {
          claim: 'MADE WITH REAL FRUIT',
          status: 'misleading',
          truthIndex: 40,
          finding: 'Misleading marketing trick! "Real Fruit" is either concentrated juice (stripped of natural fiber) or appears late in the ingredient list after sugars and corn syrup.',
          evidence: [
            fruitIndex > 3 ? `Fruit appears at position #${fruitIndex + 1} in ingredient list after refined sugars/oils.` : null,
            isConcentrateOnly ? `Fruit is in the form of concentrated juice syrup, which acts like added sugar without whole fruit pectin/fiber.` : null
          ].filter(Boolean)
        };
      }

      return {
        claim: 'MADE WITH REAL FRUIT',
        status: 'verified_true',
        truthIndex: 88,
        finding: 'Verified! Whole fruit or fruit puree appears among the top primary ingredients.',
        evidence: [`Fruit component found at position #${fruitIndex + 1} of ingredient list.`]
      };
    }
  }
];
