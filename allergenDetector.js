/**
 * Allergen Detection Engine
 * Scans raw ingredient text and parsed ingredients against the 11 Major Allergens database.
 * Returns precise allergen flags with exact ingredient trigger matching.
 */

import { ALLERGENS_DATABASE } from '../data/allergens';

export function detectAllergens(ingredientsText, parsedIngredients = []) {
  if (!ingredientsText) return [];

  const lowerText = ingredientsText.toLowerCase();
  const detectedAllergens = [];

  for (const allergen of ALLERGENS_DATABASE) {
    const matchedTriggers = [];

    // Search keywords
    for (const keyword of allergen.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        // Find exact ingredient string in parsed list containing keyword
        const matchingIng = parsedIngredients.find(ing => ing.name.toLowerCase().includes(keyword.toLowerCase()));
        const exactTrigger = matchingIng ? matchingIng.name : keyword;
        
        if (!matchedTriggers.includes(exactTrigger)) {
          matchedTriggers.push(exactTrigger);
        }
      }
    }

    if (matchedTriggers.length > 0) {
      detectedAllergens.push({
        id: allergen.id,
        name: allergen.name,
        icon: allergen.icon,
        severity: allergen.severity,
        explanation: allergen.explanation,
        exactTriggers: matchedTriggers
      });
    }
  }

  return detectedAllergens;
}
