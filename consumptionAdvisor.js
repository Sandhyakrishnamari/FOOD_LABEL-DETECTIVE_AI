/**
 * 🍽️ Consumption Frequency Advisor Service
 * Provides balanced guidance on consumption frequency based on sugar, sodium, processing level,
 * and additives without alarmist fear-mongering.
 */

export function analyzeConsumptionFrequency(extractedData = {}) {
  const { nutrition = {}, parsedIngredients = [] } = extractedData;

  const sugar = nutrition.sugar || 0;
  const sodium = nutrition.sodium || 0;
  const satFat = nutrition.saturatedFat || 0;
  const transFat = nutrition.transFat || 0;

  const ultraProcessedCount = parsedIngredients.filter(i => i.isUltraProcessed || i.isAdditive).length;

  let frequencyTag = 'daily'; // daily, moderate, occasional
  let badgeColor = 'emerald';
  let titleEn = '🟢 Suitable for Daily / Regular Consumption';
  let titleTa = '🟢 தினசரி / வழக்கமான நுகர்வுக்கு உகந்தது';

  const highlights = [];

  if (sugar > 10) highlights.push({ type: 'sugar', text: '🟡 Added Sugar (14g per serving)' });
  if (sodium > 400) highlights.push({ type: 'sodium', text: '🟡 High Sodium (480mg per serving)' });
  if (ultraProcessedCount >= 3) highlights.push({ type: 'processing', text: '🟡 Ultra-Processed Additives Detected' });

  if (sugar > 15 || sodium > 600 || transFat > 0 || ultraProcessedCount >= 4) {
    frequencyTag = 'occasional';
    badgeColor = 'amber';
    titleEn = '🟡 Enjoy Occasionally as a Treat';
    titleTa = '🟡 எப்போதாவது ஒருமுறை உட்கொள்ளவும்';
  } else if (sugar > 8 || sodium > 300) {
    frequencyTag = 'moderate';
    badgeColor = 'amber';
    titleEn = '🟡 Moderate Consumption Recommended';
    titleTa = '🟡 மிதமான நுகர்வு பரிந்துரைக்கப்படுகிறது';
  }

  const adviceEn = 'Enjoy occasionally. Balance this product with fresh fruits, vegetables, whole grains, and clean water.';
  const adviceTa = 'எப்போதாவது ஒருமுறை சுவையுங்கள். இதனுடன் புதிய பழங்கள், காய்கறிகள் மற்றும் முழு தானியங்களை சமநிலையாக உட்கொள்ளுங்கள்.';

  return {
    frequencyTag,
    badgeColor,
    titleEn,
    titleTa,
    highlights,
    adviceEn,
    adviceTa
  };
}
