/**
 * Realistic Portion Recalculator Engine
 * Flips unrealistic label "per serving" stats (e.g. 2 cookies / 15g) to "what you'd actually eat"
 * (e.g. 1 whole pack = 45g or 1 full bowl = 50g).
 */

export function recalculatePortionNutrition(nutrition = {}, portionMultiplier = 1.0) {
  const mult = parseFloat(portionMultiplier) || 1.0;

  const calories = Math.round((nutrition.calories || 0) * mult);
  const sugar = Math.round(((nutrition.sugar || 0) * mult) * 10) / 10;
  const addedSugar = Math.round(((nutrition.addedSugar || 0) * mult) * 10) / 10;
  const protein = Math.round(((nutrition.protein || 0) * mult) * 10) / 10;
  const fat = Math.round(((nutrition.fat || 0) * mult) * 10) / 10;
  const satFat = Math.round(((nutrition.saturatedFat || 0) * mult) * 10) / 10;
  const sodium = Math.round((nutrition.sodium || 0) * mult);
  const carbs = Math.round(((nutrition.carbs || 0) * mult) * 10) / 10;

  return {
    multiplier: mult,
    calories,
    sugar,
    addedSugar,
    protein,
    fat,
    satFat,
    sodium,
    carbs,
    sugarTeaspoons: Math.round((sugar / 4.8) * 10) / 10, // 1 tsp sugar = ~4.8g
    sodiumSaltGrams: Math.round(((sodium * 2.54) / 1000) * 10) / 10 // Salt = Sodium x 2.54 / 1000
  };
}
