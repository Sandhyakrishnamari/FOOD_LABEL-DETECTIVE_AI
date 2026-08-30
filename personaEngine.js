/**
 * Persona-Switch Verdict Engine
 * Dynamically re-scores and updates warning indicators per medical/health condition:
 * - Diabetic 🩺
 * - PCOS 🥚
 * - Hypertension / High BP 🫀
 * - Kid-Friendly 👶
 * - Fitness / Muscle 🏋️
 * - General Health 🛡️
 */

export function calculatePersonaScore(scanResult, selectedPersona = 'general') {
  if (!scanResult) return null;

  const { parsedIngredients = [], nutritionData = {}, allergensDetected = [], marketingTruthIndex = 85 } = scanResult;
  const { nutrition = {} } = nutritionData;

  const sugar = nutrition.sugar || 0;
  const addedSugar = nutrition.addedSugar || 0;
  const carbs = nutrition.carbs || 0;
  const fiber = nutrition.fiber || 0;
  const satFat = nutrition.saturatedFat || 0;
  const transFat = nutrition.transFat || 0;
  const sodium = nutrition.sodium || 0;
  const protein = nutrition.protein || 0;

  const lowerIngText = parsedIngredients.map(i => i.name.toLowerCase()).join(' ');

  let personaScore = scanResult.scoreData ? scanResult.scoreData.score : 75;
  const personaFlags = [];
  const personaGood = [];
  let verdictStatus = 'good'; // good, watch, red_flag

  switch (selectedPersona) {
    case 'diabetic': {
      // High GI sugar penalty
      const highGiIngs = parsedIngredients.filter(i => 
        ['maltodextrin', 'sugar', 'high fructose corn syrup', 'dextrose', 'apple juice concentrate'].some(h => i.name.toLowerCase().includes(h))
      );

      if (sugar > 5 || highGiIngs.length > 0) {
        personaScore -= (sugar * 3) + (highGiIngs.length * 12);
        verdictStatus = 'red_flag';
        personaFlags.push(`🔴 Diabetic Alert: High Glycemic Index spike risk from ${sugar}g sugar and ${highGiIngs.map(i => i.name).join(', ')}.`);
      } else {
        personaGood.push(`🟢 Diabetic Friendly: Low sugar (${sugar}g) and minimal high-GI carbohydrates.`);
      }
      break;
    }

    case 'pcos': {
      // PCOS: High carbs/sugar, dairy, and refined seed oils
      const dairyIngs = parsedIngredients.filter(i => ['milk', 'whey', 'casein', 'cheese', 'butter'].some(d => i.name.toLowerCase().includes(d)));
      const seedOils = parsedIngredients.filter(i => ['palm oil', 'soybean oil', 'sunflower oil', 'canola oil'].some(s => i.name.toLowerCase().includes(s)));

      if (sugar > 8 || dairyIngs.length > 0 || seedOils.length > 0) {
        personaScore -= 25;
        verdictStatus = 'red_flag';
        if (sugar > 8) personaFlags.push(`🔴 PCOS Alert: ${sugar}g sugar triggers insulin resistance spikes.`);
        if (dairyIngs.length > 0) personaFlags.push(`🔴 PCOS Alert: Contains dairy (${dairyIngs.map(i => i.name).join(', ')}) which can trigger androgen inflammation.`);
        if (seedOils.length > 0) personaFlags.push(`🟡 PCOS Watch: Contains refined seed oils (${seedOils.map(i => i.name).join(', ')}).`);
      } else {
        personaGood.push(`🟢 PCOS Friendly: Anti-inflammatory profile with zero dairy and low glycemic sugar.`);
      }
      break;
    }

    case 'hypertension': {
      // High BP: Sodium threshold > 250mg per serving or inorganic polyphosphates E450
      const phosphateIngs = parsedIngredients.filter(i => i.name.toLowerCase().includes('phosphate') || i.eNumber === 'E450');

      if (sodium > 250 || phosphateIngs.length > 0) {
        personaScore -= Math.round(sodium / 25) + (phosphateIngs.length * 10);
        verdictStatus = sodium > 500 ? 'red_flag' : 'watch';
        personaFlags.push(`🔴 Hypertension Alert: Sodium is ${sodium}mg (>10% Daily Limit). Preservative phosphates raise arterial pressure.`);
      } else {
        personaGood.push(`🟢 Heart & BP Friendly: Low sodium (${sodium}mg) supports healthy blood pressure.`);
      }
      break;
    }

    case 'kidFriendly': {
      // Kids: Synthetic dyes (Red 40, Yellow 5), artificial sweeteners (Aspartame, Sucralose), BHA/BHT
      const kidDyes = parsedIngredients.filter(i => 
        ['red 40', 'yellow 5', 'blue 1', 'tartrazine', 'allura red', 'bha', 'bht', 'aspartame', 'sucralose'].some(k => i.name.toLowerCase().includes(k))
      );

      if (kidDyes.length > 0 || sugar > 10) {
        personaScore -= (kidDyes.length * 15) + (sugar > 10 ? 15 : 0);
        verdictStatus = 'red_flag';
        personaFlags.push(`🔴 Kids Warning: Contains synthetic food dyes/preservatives (${kidDyes.map(i => i.name).join(', ')}) linked to child hyperactivity.`);
      } else {
        personaGood.push(`🟢 Kid Safe: Free from artificial azo dyes, synthetic preservatives, and intense sweeteners.`);
      }
      break;
    }

    case 'fitness': {
      // Fitness: Protein density and low sugar-to-protein ratio
      const proteinCalories = protein * 4;
      const totalCalories = nutrition.calories || 1;
      const proteinRatio = (proteinCalories / totalCalories) * 100;

      if (protein >= 10 && sugar <= 6) {
        personaScore += 15;
        personaGood.push(`🟢 Fitness Ideal: ${protein}g protein (${Math.round(proteinRatio)}% calories) with low sugar (${sugar}g).`);
      } else if (sugar > protein * 1.5) {
        personaScore -= 18;
        verdictStatus = 'watch';
        personaFlags.push(`🟡 Fitness Penalty: High sugar (${sugar}g) outweighs protein content (${protein}g). Reconstructs as a candy bar.`);
      }
      break;
    }

    default: {
      if (transFat > 0 || sugar > 15) verdictStatus = 'red_flag';
      else if (sugar > 8 || satFat > 3) verdictStatus = 'watch';
    }
  }

  const finalPersonaScore = Math.max(10, Math.min(99, Math.round(personaScore)));

  return {
    persona: selectedPersona,
    score: finalPersonaScore,
    status: verdictStatus,
    flags: personaFlags,
    good: personaGood
  };
}
