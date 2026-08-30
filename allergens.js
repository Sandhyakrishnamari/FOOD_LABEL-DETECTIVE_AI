/**
 * 11 Major Food Allergens Rules & Pattern Matcher
 * Maps common allergen synonyms and derivative ingredients to allergen classifications.
 */

export const ALLERGENS_DATABASE = [
  {
    id: 'milk',
    name: 'Milk & Dairy',
    icon: '🥛',
    severity: 'high',
    keywords: [
      'milk', 'dairy', 'whey', 'casein', 'caseinate', 'lactose', 'butter',
      'cream', 'cheese', 'yogurt', 'curd', 'ghee', 'skimmed milk', 'milk powder',
      'milk solids', 'condensed milk', 'lactoglobulin', 'lactalbumin'
    ],
    explanation: 'Contains milk proteins (casein or whey) or lactose. Can trigger mild to severe IgE-mediated anaphylaxis or lactose intolerance symptoms.'
  },
  {
    id: 'egg',
    name: 'Egg',
    icon: '🥚',
    severity: 'high',
    keywords: [
      'egg', 'eggs', 'egg white', 'egg yolk', 'ovalbumin', 'ovomucoid',
      'mayonnaise', 'meringue', 'albumin', 'lysozyme', 'lecithin (egg)'
    ],
    explanation: 'Contains egg proteins (ovalbumin/ovomucoid). Common cause of childhood food allergies and potential severe allergic reaction.'
  },
  {
    id: 'peanut',
    name: 'Peanut',
    icon: '🥜',
    severity: 'critical',
    keywords: [
      'peanut', 'peanuts', 'groundnut', 'arachis oil', 'peanut butter',
      'peanut flour', 'mixed nuts (contains peanut)', 'monkey nut'
    ],
    explanation: 'Contains potent peanut proteins (Ara h 1-8). High risk of severe life-threatening anaphylaxis even from trace cross-contamination.'
  },
  {
    id: 'tree_nut',
    name: 'Tree Nuts',
    icon: '🌰',
    severity: 'critical',
    keywords: [
      'almond', 'almonds', 'walnut', 'walnuts', 'cashew', 'cashews',
      'pistachio', 'pistachios', 'pecan', 'pecans', 'hazelnut', 'hazelnuts',
      'macadamia', 'brazil nut', 'chestnut', 'praline', 'gianduja', 'marzipan', 'nut butter'
    ],
    explanation: 'Contains tree nut proteins. Can cause rapid systemic allergic reactions including airway constriction and anaphylactic shock.'
  },
  {
    id: 'soy',
    name: 'Soy / Soybean',
    icon: '🫘',
    severity: 'high',
    keywords: [
      'soy', 'soya', 'soybean', 'soybeans', 'soy lecithin', 'tofu', 'tempeh',
      'edamame', 'soy protein', 'soy sauce', 'hydrolyzed soy protein', 'tamari', 'miso'
    ],
    explanation: 'Contains soybean proteins. A major allergen requiring strict avoidance for sensitized children and adults.'
  },
  {
    id: 'gluten',
    name: 'Wheat & Gluten',
    icon: '🌾',
    severity: 'high',
    keywords: [
      'wheat', 'gluten', 'barley', 'rye', 'spelt', 'durum', 'semolina',
      'farina', 'kamut', 'bulgur', 'wheat flour', 'enriched flour', 'wheat starch',
      'wheat gluten', 'malt', 'malt extract', 'triticale'
    ],
    explanation: 'Contains gluten proteins (gliadin/glutenin). Triggers autoimmune intestinal damage in Celiac Disease and wheat allergies.'
  },
  {
    id: 'fish',
    name: 'Fish',
    icon: '🐟',
    severity: 'high',
    keywords: [
      'fish', 'salmon', 'tuna', 'cod', 'anchovy', 'anchovies', 'fish sauce',
      'gelatin (fish)', 'haddock', 'trout', 'halibut', 'sardine', 'tilapia', 'isinglass'
    ],
    explanation: 'Contains fish parvalbumin proteins. Usually persists lifelong and can cause severe systemic reactions.'
  },
  {
    id: 'shellfish',
    name: 'Crustacean Shellfish',
    icon: '🦐',
    severity: 'high',
    keywords: [
      'shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'shellfish',
      'krill', 'glucosamine (shellfish)'
    ],
    explanation: 'Contains tropomyosin proteins from crustaceans. Frequently causes severe adult-onset anaphylaxis.'
  },
  {
    id: 'sesame',
    name: 'Sesame',
    icon: '🪙',
    severity: 'high',
    keywords: [
      'sesame', 'sesame seed', 'tahini', 'sesame oil', 'gingelly oil',
      'simsim', 'benne'
    ],
    explanation: 'Recognized as a major allergen globally (FDA FASTER Act 2023). High risk of severe reactions.'
  },
  {
    id: 'sulfites',
    name: 'Sulfites / Sulphites',
    icon: '🧪',
    severity: 'moderate',
    keywords: [
      'sulfite', 'sulfites', 'sulphite', 'sulphites', 'sodium metabisulfite',
      'sulfur dioxide', 'e220', 'e221', 'e222', 'e223', 'e224', 'e225', 'e226', 'e227', 'e228'
    ],
    explanation: 'Inorganic preservative chemical. Triggers bronchospasm and asthmatic attacks in sensitive asthmatics.'
  },
  {
    id: 'mustard',
    name: 'Mustard',
    icon: '🟡',
    severity: 'moderate',
    keywords: [
      'mustard', 'mustard seed', 'mustard powder', 'mustard oil', 'dijon'
    ],
    explanation: 'Contains heat-stable mustard proteins. Required allergen labeling in EU, Canada, and UK.'
  }
];
