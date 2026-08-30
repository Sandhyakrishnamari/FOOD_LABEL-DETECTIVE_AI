/**
 * Nutrition Parser & Traffic Light Classifier
 * Extracts numeric nutrition values from OCR text or validates structured nutrition data.
 * Computes % Daily Value (%DV) and UK Traffic Light badges.
 */

import { DAILY_VALUES, getTrafficLightStatus } from '../data/nutrition';

export function parseNutritionData(rawText = '', existingNutrition = {}) {
  const nutrition = {
    servingSize: existingNutrition.servingSize || '1 serving',
    calories: existingNutrition.calories ?? 0,
    fat: existingNutrition.fat ?? 0,
    saturatedFat: existingNutrition.saturatedFat ?? 0,
    transFat: existingNutrition.transFat ?? 0,
    cholesterol: existingNutrition.cholesterol ?? 0,
    sodium: existingNutrition.sodium ?? 0,
    carbs: existingNutrition.carbs ?? 0,
    fiber: existingNutrition.fiber ?? 0,
    sugar: existingNutrition.sugar ?? 0,
    addedSugar: existingNutrition.addedSugar ?? 0,
    protein: existingNutrition.protein ?? 0
  };

  // If existing values are empty, attempt OCR regex parsing
  if (rawText && (!nutrition.calories || !nutrition.protein)) {
    const calMatch = rawText.match(/calories\s*[:\s]?\s*(\d+)/i);
    if (calMatch) nutrition.calories = parseInt(calMatch[1], 10);

    const fatMatch = rawText.match(/(?:total\s+)?fat\s*[:\s]?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (fatMatch) nutrition.fat = parseFloat(fatMatch[1]);

    const satFatMatch = rawText.match(/sat(?:urated)?\s+fat\s*[:\s]?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (satFatMatch) nutrition.saturatedFat = parseFloat(satFatMatch[1]);

    const sodiumMatch = rawText.match(/sodium\s*[:\s]?\s*(\d+(?:\.\d+)?)\s*mg/i);
    if (sodiumMatch) nutrition.sodium = parseFloat(sodiumMatch[1]);

    const carbMatch = rawText.match(/(?:total\s+)?carb(?:ohydrate)?s?\s*[:\s]?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (carbMatch) nutrition.carbs = parseFloat(carbMatch[1]);

    const fiberMatch = rawText.match(/(?:dietary\s+)?fiber\s*[:\s]?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (fiberMatch) nutrition.fiber = parseFloat(fiberMatch[1]);

    const sugarMatch = rawText.match(/sugars?\s*[:\s]?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (sugarMatch) nutrition.sugar = parseFloat(sugarMatch[1]);

    const addedSugarMatch = rawText.match(/added\s+sugars?\s*[:\s]?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (addedSugarMatch) nutrition.addedSugar = parseFloat(addedSugarMatch[1]);

    const proteinMatch = rawText.match(/protein\s*[:\s]?\s*(\d+(?:\.\d+)?)\s*g/i);
    if (proteinMatch) nutrition.protein = parseFloat(proteinMatch[1]);
  }

  // Calculate % Daily Values (%DV)
  const percentDV = {
    fat: Math.round((nutrition.fat / DAILY_VALUES.fat) * 100),
    saturatedFat: Math.round((nutrition.saturatedFat / DAILY_VALUES.saturatedFat) * 100),
    sodium: Math.round((nutrition.sodium / DAILY_VALUES.sodium) * 100),
    carbs: Math.round((nutrition.carbs / DAILY_VALUES.carbs) * 100),
    fiber: Math.round((nutrition.fiber / DAILY_VALUES.fiber) * 100),
    sugar: Math.round((nutrition.sugar / DAILY_VALUES.totalSugar) * 100),
    protein: Math.round((nutrition.protein / DAILY_VALUES.protein) * 100)
  };

  // Calculate Traffic Light Statuses (estimating per 100g if serving is ~40g)
  // Standard serving estimated multiplier ~ 2.5 for 100g view
  const approxPer100gMultiplier = 2.5;

  const trafficLights = {
    fat: getTrafficLightStatus('fat', nutrition.fat * approxPer100gMultiplier),
    saturatedFat: getTrafficLightStatus('saturatedFat', nutrition.saturatedFat * approxPer100gMultiplier),
    sugar: getTrafficLightStatus('sugar', nutrition.sugar * approxPer100gMultiplier),
    sodium: getTrafficLightStatus('sodium', nutrition.sodium * approxPer100gMultiplier)
  };

  return {
    nutrition,
    percentDV,
    trafficLights
  };
}
