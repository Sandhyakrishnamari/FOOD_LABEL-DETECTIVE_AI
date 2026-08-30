/**
 * Signature Marketing Buster Engine
 * Scans front-of-package marketing claims, cross-examines against parsed ingredients & nutrition,
 * and generates Truth Index (0-100) case file reports.
 */

import { MARKETING_CLAIMS } from '../data/marketingClaims';

export function evaluateMarketingClaims(extractedData, userSelectedClaims = []) {
  const { ingredientsText = '', marketingClaimsDetected = [] } = extractedData;
  const lowerText = (ingredientsText + ' ' + marketingClaimsDetected.join(' ')).toLowerCase();

  // Determine claims to evaluate: user selected + auto-detected from label
  const claimsToEvaluate = new Set([...userSelectedClaims, ...marketingClaimsDetected]);

  // Auto-detect claims from text if none specified
  if (claimsToEvaluate.size === 0) {
    for (const claimRule of MARKETING_CLAIMS) {
      if (claimRule.aliases.some(alias => lowerText.includes(alias.toLowerCase()))) {
        claimsToEvaluate.add(claimRule.claimText);
      }
    }
  }

  // Fallback: If still no claims detected, evaluate top 2 standard claims for detective review
  if (claimsToEvaluate.size === 0) {
    claimsToEvaluate.add('NO ADDED SUGAR');
    claimsToEvaluate.add('100% NATURAL');
  }

  const results = [];

  for (const claimName of claimsToEvaluate) {
    const rule = MARKETING_CLAIMS.find(c => 
      c.claimText.toLowerCase() === claimName.toLowerCase() ||
      c.aliases.some(a => a.toLowerCase() === claimName.toLowerCase())
    );

    if (rule) {
      const evaluation = rule.verify(extractedData);
      results.push(evaluation);
    }
  }

  // Overall Marketing Truth Index (average of evaluated claims)
  const averageTruthIndex = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + r.truthIndex, 0) / results.length)
    : 85;

  return {
    claimsEvaluated: results,
    overallTruthIndex: averageTruthIndex
  };
}
