/**
 * 🛡️ Food Safety Score & Smart Purchase Decision Engine
 * Combines Expiry, Certification, Packaging Integrity, Storage Advice, Allergen Status, and Nutrition
 * into a single unified Food Safety Score (0-100/100) and Purchase Decision card.
 */

import { analyzeExpiry } from './expiryAnalyzer';
import { detectCertifications } from './certificationDetector';
import { analyzePackagingIntegrity } from './packagingVision';
import { analyzeStorageInstructions } from './storageAnalyzer';
import { analyzeConsumptionFrequency } from './consumptionAdvisor';

export function calculateSafetyScore(scanResult) {
  if (!scanResult) return null;

  const { rawIngredients = '', rawOcrText = '', parsedIngredients = [], allergensDetected = [], nutritionData = {} } = scanResult;

  const expiry = analyzeExpiry(rawOcrText || rawIngredients);
  const certs = detectCertifications(rawOcrText || rawIngredients);
  const packaging = analyzePackagingIntegrity(scanResult.frontImage);
  const storage = analyzeStorageInstructions(rawOcrText || rawIngredients);
  const consumption = analyzeConsumptionFrequency({ nutrition: nutritionData.nutrition, parsedIngredients });

  let safetyScore = 90; // Default high safety baseline

  const positiveChecklist = [];
  const warningChecklist = [];

  // Expiry check
  if (expiry.isExpired) {
    safetyScore -= 50;
    warningChecklist.push('🚨 Expired product! Do not purchase or consume.');
  } else {
    positiveChecklist.push('✅ Expiry verified (Product is fresh & within expiry)');
  }

  // Packaging check
  if (packaging.sealIntact && packaging.noLeakage) {
    positiveChecklist.push('✅ Packaging condition good (Seal intact, no leakage)');
  } else {
    safetyScore -= 20;
    warningChecklist.push('⚠️ Packaging integrity issue detected');
  }

  // Certification check
  if (certs.hasFssai) {
    positiveChecklist.push('✅ Certification detected (FSSAI compliance verified)');
  } else {
    safetyScore -= 10;
    warningChecklist.push('⚠️ FSSAI certification mark missing on label');
  }

  // Storage check
  if (storage.recommendedLocationEn) {
    positiveChecklist.push('✅ Storage instructions available');
  }

  // Allergen check
  if (allergensDetected.length > 0) {
    safetyScore -= (allergensDetected.length * 5);
    warningChecklist.push(`⚠️ Contains ${allergensDetected.length} major allergen(s) (${allergensDetected.map(a => a.name).join(', ')})`);
  }

  // Nutrition check
  const sugar = (nutritionData.nutrition && nutritionData.nutrition.sugar) || 0;
  if (sugar > 12) {
    warningChecklist.push(`⚠️ High sugar content (${sugar}g per serving)`);
  }

  const finalSafetyScore = Math.max(10, Math.min(99, Math.round(safetyScore)));

  let purchaseRecommendationEn = '🟢 Buy with Confidence';
  let purchaseRecommendationTa = '🟢 நம்பிக்கையுடன் வாங்கலாம்';
  let isRecommended = true;

  if (finalSafetyScore < 60 || expiry.isExpired) {
    purchaseRecommendationEn = '🔴 Avoid Purchasing (Safety Risk)';
    purchaseRecommendationTa = '🔴 வாங்குவதை தவிர்க்கவும் (பாதுகாப்பு அபாயம்)';
    isRecommended = false;
  } else if (finalSafetyScore < 75) {
    purchaseRecommendationEn = '🟡 Check Context Before Buying';
    purchaseRecommendationTa = '🟡 வாங்குவதற்கு முன் விவரங்களை சரிபார்க்கவும்';
  }

  return {
    safetyScore: finalSafetyScore,
    purchaseRecommendationEn,
    purchaseRecommendationTa,
    isRecommended,
    positiveChecklist,
    warningChecklist,
    expiry,
    certs,
    packaging,
    storage,
    consumption
  };
}
