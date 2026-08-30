/**
 * Personalized Detective Health Scoring Engine
 * Computes food rating (0-100) and letter grade tailored to the user's active dietary profile goals.
 * Computes explicit, transparent point adjustments (+15 Protein, -12 Added Sugar, etc.)
 */

export function calculatePersonalizedScore(data, userGoals = {}) {
  const {
    parsedIngredients = [],
    nutritionData = {},
    allergensDetected = [],
    marketingEvaluation = {}
  } = data;

  const { nutrition = {} } = nutritionData;

  let baseScore = 75;
  const goodPoints = [];
  const watchItems = [];
  const redFlags = [];
  const allergenAlerts = [];

  const positiveItems = [];
  const negativeItems = [];

  // 1. NUTRITION EVALUATION
  const sugar = nutrition.sugar || 0;
  const addedSugar = nutrition.addedSugar || 0;
  const satFat = nutrition.saturatedFat || 0;
  const transFat = nutrition.transFat || 0;
  const sodium = nutrition.sodium || 0;
  const protein = nutrition.protein || 0;
  const fiber = nutrition.fiber || 0;

  // Positive nutrient bonuses
  if (protein >= 10) {
    baseScore += 12;
    positiveItems.push({ text: 'High Protein Content', val: '+12', desc: `${protein}g protein per serving` });
    goodPoints.push(`High Protein (${protein}g per serving) supports satiety & muscle maintenance.`);
  } else if (protein >= 5) {
    baseScore += 6;
    positiveItems.push({ text: 'Decent Protein', val: '+6', desc: `${protein}g protein per serving` });
    goodPoints.push(`Decent Protein content (${protein}g).`);
  }

  if (fiber >= 5) {
    baseScore += 10;
    positiveItems.push({ text: 'High Dietary Fiber', val: '+10', desc: `${fiber}g fiber per serving` });
    goodPoints.push(`High Fiber (${fiber}g per serving) supports digestive health.`);
  }

  // Sugar penalties
  if (sugar > 15 || addedSugar > 10) {
    let penalty = Math.min(25, Math.round(sugar * 1.2));
    baseScore -= penalty;
    negativeItems.push({ text: 'Added / High Sugar', val: `-${penalty}`, desc: `${sugar}g sugar per serving` });
    redFlags.push(`High Sugar (${sugar}g total / ${addedSugar}g added sugar per serving).`);
  } else if (sugar > 8) {
    baseScore -= 6;
    negativeItems.push({ text: 'Moderate Sugar', val: '-6', desc: `${sugar}g sugar per serving` });
    watchItems.push(`Moderate Sugar (${sugar}g per serving).`);
  } else {
    positiveItems.push({ text: 'Low Sugar Profile', val: '+5', desc: `${sugar}g sugar per serving` });
    goodPoints.push(`Low Sugar (${sugar}g per serving).`);
  }

  // Saturated & Trans fat penalties
  if (transFat > 0) {
    baseScore -= 20;
    negativeItems.push({ text: 'Contains Trans Fat', val: '-20', desc: `${transFat}g trans fat per serving` });
    redFlags.push(`Contains Trans Fat (${transFat}g per serving). Highly detrimental to heart health.`);
  }

  if (satFat >= 5) {
    baseScore -= 10;
    negativeItems.push({ text: 'High Saturated Fat', val: '-10', desc: `${satFat}g saturated fat per serving` });
    redFlags.push(`High Saturated Fat (${satFat}g per serving).`);
  }

  // Sodium penalties
  if (sodium >= 600) {
    baseScore -= 12;
    negativeItems.push({ text: 'High Sodium Level', val: '-12', desc: `${sodium}mg sodium per serving` });
    redFlags.push(`High Sodium (${sodium}mg per serving — >25% Daily Value).`);
  } else if (sodium >= 300) {
    baseScore -= 5;
    negativeItems.push({ text: 'Moderate Sodium', val: '-5', desc: `${sodium}mg sodium per serving` });
    watchItems.push(`Moderate Sodium (${sodium}mg per serving).`);
  }

  // 2. INGREDIENT & ADDITIVE EVALUATION
  const flaggedAdditives = parsedIngredients.filter(ing => ing.riskStatus === 'flag');
  const moderateAdditives = parsedIngredients.filter(ing => ing.riskStatus === 'moderate');

  if (flaggedAdditives.length > 0) {
    let penalty = flaggedAdditives.length * 8;
    baseScore -= penalty;
    negativeItems.push({ text: 'Flagged Additives', val: `-${penalty}`, desc: `${flaggedAdditives.length} flagged additive(s)` });
    flaggedAdditives.forEach(a => {
      redFlags.push(`Flagged Additive: ${a.name} — ${a.potentialConcern || a.function}`);
    });
  }

  if (moderateAdditives.length > 0) {
    let penalty = moderateAdditives.length * 3;
    baseScore -= penalty;
    negativeItems.push({ text: 'Additive Watch', val: `-${penalty}`, desc: `${moderateAdditives.length} additive(s) in watch list` });
    moderateAdditives.forEach(a => {
      watchItems.push(`Additive Watch: ${a.name} (${a.category})`);
    });
  }

  // 3. ALLERGEN EVALUATION
  const userAvoidedAllergens = userGoals.allergensAvoided || [];

  for (const allergen of allergensDetected) {
    const isUserConflict = userAvoidedAllergens.includes(allergen.id);
    if (isUserConflict) {
      baseScore -= 25;
      negativeItems.push({ text: `Critical Allergen: ${allergen.name}`, val: '-25', desc: 'Matches active profile filter' });
      allergenAlerts.push(`CRITICAL ALLERGEN MATCH: Contains ${allergen.name} (${allergen.exactTriggers.join(', ')}) matching your personal filter!`);
    } else {
      negativeItems.push({ text: `Allergen Present: ${allergen.name}`, val: '-5', desc: 'Check ingredients' });
      allergenAlerts.push(`Allergen Detected: ${allergen.name} (${allergen.exactTriggers.join(', ')})`);
    }
  }

  // Final Clamp
  const finalScore = Math.max(10, Math.min(99, Math.round(baseScore)));

  let grade = 'C';
  if (finalScore >= 90) grade = 'A+';
  else if (finalScore >= 80) grade = 'A';
  else if (finalScore >= 70) grade = 'B';
  else if (finalScore >= 60) grade = 'C';
  else if (finalScore >= 50) grade = 'D';
  else grade = 'F';

  return {
    score: finalScore,
    grade,
    summary: {
      goodPoints,
      watchItems,
      redFlags,
      allergenAlerts
    },
    scoreBreakdown: {
      positiveItems,
      negativeItems
    }
  };
}
