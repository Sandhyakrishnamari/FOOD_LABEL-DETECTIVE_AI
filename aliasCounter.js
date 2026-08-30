/**
 * Sugar & Fat Alias Counter + Ingredient Splitting Detector
 * Detects hidden disguised names for sugars and industrial fats used by food manufacturers
 * to split ingredients and manipulate label order.
 */

import { SUGAR_ALIASES, FAT_ALIASES } from '../data/indianStandards';

export function countAliasesAndSplitting(ingredientsText = '', parsedIngredients = []) {
  const lowerText = ingredientsText.toLowerCase();

  const detectedSugarAliases = [];
  const detectedFatAliases = [];

  // Check Sugar Aliases
  for (const alias of SUGAR_ALIASES) {
    if (lowerText.includes(alias.toLowerCase())) {
      const matchInParsed = parsedIngredients.find(i => i.name.toLowerCase().includes(alias.toLowerCase()));
      const aliasName = matchInParsed ? matchInParsed.name : alias;
      if (!detectedSugarAliases.includes(aliasName)) {
        detectedSugarAliases.push(aliasName);
      }
    }
  }

  // Check Fat Aliases
  for (const alias of FAT_ALIASES) {
    if (lowerText.includes(alias.toLowerCase())) {
      const matchInParsed = parsedIngredients.find(i => i.name.toLowerCase().includes(alias.toLowerCase()));
      const aliasName = matchInParsed ? matchInParsed.name : alias;
      if (!detectedFatAliases.includes(aliasName)) {
        detectedFatAliases.push(aliasName);
      }
    }
  }

  // Ingredient Splitting Warning: When 3 or more sugar aliases are present
  const isIngredientSplittingDetected = detectedSugarAliases.length >= 3;

  let splittingExplanation = null;
  if (isIngredientSplittingDetected) {
    splittingExplanation = `⚠️ Ingredient Splitting Trick Caught! The manufacturer split sugar into ${detectedSugarAliases.length} different disguised names (${detectedSugarAliases.join(', ')}) to push sugar lower on the ingredients list.`;
  }

  return {
    sugarAliasCount: detectedSugarAliases.length,
    sugarAliases: detectedSugarAliases,
    fatAliasCount: detectedFatAliases.length,
    fatAliases: detectedFatAliases,
    isIngredientSplittingDetected,
    splittingExplanation
  };
}
