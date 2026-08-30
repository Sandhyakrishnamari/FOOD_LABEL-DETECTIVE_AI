/**
 * Nutrition Daily Values (%DV based on FDA 2000 kcal diet) and UK Traffic Light thresholds
 */

export const DAILY_VALUES = {
  calories: 2000,
  fat: 78,           // grams
  saturatedFat: 20,  // grams
  transFat: 0,       // grams (ideal)
  cholesterol: 300,  // mg
  sodium: 2300,      // mg
  carbs: 275,        // grams
  fiber: 28,         // grams
  totalSugar: 50,    // grams
  addedSugar: 50,    // grams
  protein: 50        // grams
};

/**
 * UK Traffic Light System Thresholds (per 100g)
 */
export const TRAFFIC_LIGHT_THRESHOLDS = {
  fat: { low: 3.0, high: 17.5 },          // g/100g
  saturatedFat: { low: 1.5, high: 5.0 },  // g/100g
  sugar: { low: 5.0, high: 22.5 },        // g/100g
  sodium: { low: 120, high: 600 }         // mg/100g (0.3g to 1.5g salt)
};

export function getTrafficLightStatus(nutrient, amountPer100g) {
  if (amountPer100g == null || isNaN(amountPer100g)) return 'unknown';
  const bounds = TRAFFIC_LIGHT_THRESHOLDS[nutrient];
  if (!bounds) return 'unknown';
  
  if (amountPer100g <= bounds.low) return 'low';
  if (amountPer100g >= bounds.high) return 'high';
  return 'medium';
}
