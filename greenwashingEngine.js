/**
 * Greenwashing & Packaging Deception Score Engine
 * Standalone novel metric (0-100) quantifying front packaging deception relative to contents.
 * High Greenwashing Score (e.g. 85/100 Greenwashed!) = Heavy front-of-package deception.
 */

export function calculateGreenwashingScore(extractedData, marketingEvaluation, aliasData) {
  const { ingredientsText = '', nutrition = {} } = extractedData;
  const { claimsEvaluated = [], overallTruthIndex = 85 } = marketingEvaluation || {};
  const { sugarAliasCount = 0, isIngredientSplittingDetected = false } = aliasData || {};

  let greenwashPoints = 100 - overallTruthIndex; // Base on inverted truth index

  // Penalty for ingredient splitting
  if (isIngredientSplittingDetected) {
    greenwashPoints += 25;
  } else if (sugarAliasCount >= 2) {
    greenwashPoints += 15;
  }

  // Penalty for contradictory claims
  const bustedClaims = claimsEvaluated.filter(c => c.status === 'busted' || c.status === 'misleading');
  if (bustedClaims.length > 0) {
    greenwashPoints += bustedClaims.length * 20;
  }

  // High greenwash score if sugar is high (>12g) but front claims "Natural", "Fit", "Keto", or "Protein"
  const lowerIng = ingredientsText.toLowerCase();
  const hasNaturalClaim = claimsEvaluated.some(c => c.claim.toLowerCase().includes('natural'));
  const hasSynthetic = ['e211', 'e102', 'red 40', 'bha', 'bht', 'hydrogenated'].some(s => lowerIng.includes(s));

  if (hasNaturalClaim && hasSynthetic) {
    greenwashPoints += 20;
  }

  const finalGreenwashScore = Math.max(5, Math.min(99, Math.round(greenwashPoints)));

  let ratingBadge = '🟢 Low Greenwashing (Honest Label)';
  if (finalGreenwashScore >= 75) {
    ratingBadge = '🔴 Severe Greenwashing! Highly Deceptive Label';
  } else if (finalGreenwashScore >= 50) {
    ratingBadge = '🟠 Moderate Greenwashing (Misleading Claims)';
  } else if (finalGreenwashScore >= 30) {
    ratingBadge = '🟡 Minor Greenwashing (Needs Context)';
  }

  return {
    score: finalGreenwashScore,
    badge: ratingBadge,
    bustedClaimsCount: bustedClaims.length,
    isHighDeception: finalGreenwashScore >= 50
  };
}
