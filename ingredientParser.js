/**
 * Ingredient Parser & Recognition Engine
 * Tokenizes raw text into individual ingredients, matches E-numbers, identifies additives/oils/sweeteners,
 * and attaches scientifically defensible context + bilingual Tamil/English Easy Explanations.
 */

import { lookupAdditive } from '../data/additives';
import { COMMON_INGREDIENTS, INGREDIENT_CATEGORIES } from '../data/ingredients';
import { getTamilIngredientInfo } from './translationService';

export function parseIngredientsText(rawText) {
  if (!rawText) return [];

  let cleaned = rawText
    .replace(/INGREDIENTS\s*:/i, '')
    .replace(/CONTAINS\s+LESS\s+THAN\s+\d+%\s+OF\s*:/i, '')
    .replace(/CONTAINS\s+2%\s+OR\s+LESS\s+OF\s*:/i, '')
    .replace(/\[|\]/g, '')
    .trim();

  const rawTokens = splitIngredientString(cleaned);

  const parsedIngredients = rawTokens.map((token, index) => {
    const trimmed = token.trim();
    if (!trimmed) return null;

    const lower = trimmed.toLowerCase();
    const additiveMatch = lookupAdditive(trimmed);
    const tamilInfo = getTamilIngredientInfo(trimmed);

    let commonName = trimmed;
    let technicalName = additiveMatch ? additiveMatch.name : null;
    let eNumber = additiveMatch ? additiveMatch.eNumber : null;
    let category = additiveMatch ? additiveMatch.category : INGREDIENT_CATEGORIES.WHOLE_FOOD;
    let riskStatus = additiveMatch ? additiveMatch.riskLevel : 'good';

    let whatIsIt = additiveMatch ? additiveMatch.category : 'A basic food ingredient';
    let whyUsed = additiveMatch ? additiveMatch.function : 'Provides food substance and recipe volume';
    let whyInProduct = additiveMatch ? `Maintains product quality and ${additiveMatch.category.toLowerCase()} properties` : 'Core ingredient used in preparation';

    let whoShouldPayAttention = 'People seeking a balanced diet.';
    let shouldIBeConcerned = additiveMatch ? additiveMatch.potentialConcern || 'Its presence alone does not mean the food is unsafe. Consider the amount and overall product context.' : 'Common food ingredient. Enjoy as part of a balanced diet.';
    let evidenceContext = additiveMatch ? additiveMatch.evidenceContext : 'Amount and overall diet matter.';

    let easyExplanationEn = additiveMatch?.easyExplainEn || `“It's a food component used to make this product.”`;
    let easyExplanationTa = tamilInfo?.easyExplain || `“இது இந்த உணவை தயாரிக்க பயன்படும் ஒரு பொருள்.”`;

    // Nutritional Contribution Breakdown ("Does This Ingredient Provide Nutrition?")
    const nutritionContribution = {
      protein: { gives: false, textEn: '❌ No meaningful protein', textTa: '❌ குறிப்பிடத்தக்க புரதம் இல்லை' },
      sugar: { gives: false, textEn: '❌ No meaningful sugar', textTa: '❌ குறிப்பிடத்தக்க சர்க்கரை இல்லை' },
      fat: { gives: false, textEn: '❌ No meaningful fat', textTa: '❌ குறிப்பிடத்தக்க கொழுப்பு இல்லை' },
      carbs: { gives: false, textEn: '❌ No meaningful carbs', textTa: '❌ குறிப்பிடத்தக்க கார்போஹைட்ரேட் இல்லை' },
      vitamins: { gives: false, textEn: '❌ No vitamins/minerals', textTa: '❌ வைட்டமின்கள்/தாதுக்கள் இல்லை' }
    };

    // Heuristics for Nutritional Contributions
    if (lower.includes('protein') || lower.includes('almond') || lower.includes('soy protein') || lower.includes('whey') || lower.includes('peanut')) {
      nutritionContribution.protein = { gives: true, textEn: '✅ Contributes Protein', textTa: '✅ புரதம் வழங்குகிறது' };
      whyUsed = 'Provides dietary protein for muscle growth and satiety.';
      whoShouldPayAttention = 'People monitoring protein intake or nut/dairy allergies.';
      easyExplanationEn = `“It's a protein source that helps build muscles and keep you full.”`;
      easyExplanationTa = `“இது உடலுக்கு புரதச்சத்து மற்றும் பலம் தரும் ஒரு பொருள்.”`;
    }

    if (lower.includes('sugar') || lower.includes('syrup') || lower.includes('juice concentrate') || lower.includes('dextrose') || lower.includes('honey') || lower.includes('fructose')) {
      nutritionContribution.sugar = { gives: true, textEn: '✅ Contributes Caloric Sugar', textTa: '✅ சர்க்கரை வழங்குகிறது' };
      nutritionContribution.carbs = { gives: true, textEn: '✅ Contributes Carbohydrates', textTa: '✅ கார்போஹைட்ரேட் வழங்குகிறது' };
      category = INGREDIENT_CATEGORIES.PROCESSED_SUGAR;
      riskStatus = 'watch';
      whatIsIt = 'A caloric sweetener / sugar source';
      whyUsed = 'Adds sweet flavor and moisture to food';
      whoShouldPayAttention = 'Diabetics, people monitoring glycemic response, and overall added sugar intake.';
      shouldIBeConcerned = 'Consuming high amounts of added sugars can spike blood glucose levels.';
      easyExplanationEn = `“It's a sweetener used to make the food taste sweet.”`;
      easyExplanationTa = `“இது உணவிற்கு இனிப்பு சுவை கொடுக்கும் சர்க்கரை பொருள்.”`;
    }

    if (lower.includes('oil') || lower.includes('fat') || lower.includes('butter') || lower.includes('shortening')) {
      nutritionContribution.fat = { gives: true, textEn: '✅ Contributes Fats', textTa: '✅ கொழுப்பு வழங்குகிறது' };
      category = INGREDIENT_CATEGORIES.INDUSTRIAL_OIL;
      riskStatus = lower.includes('hydrogenated') ? 'flag' : 'watch';
      whatIsIt = 'A cooking fat or plant oil';
      whyUsed = 'Improves texture, moisture, and cooking medium';
      whoShouldPayAttention = 'People monitoring cardiovascular health or saturated fat intake.';
      shouldIBeConcerned = lower.includes('hydrogenated') 
        ? 'Source of industrial trans fatty acids linked to heart health risks.'
        : 'Fats provide energy but should be consumed in moderation.';
      easyExplanationEn = lower.includes('hydrogenated')
        ? `“It's a chemically processed fat used to keep food crispy.”`
        : `“It's an oil used to give food texture and moisture.”`;
      easyExplanationTa = `“இது உணவிற்கு கெட்டித்தன்மையும் சுவையும் தரும் எண்ணெய்.”`;
    }

    if (lower.includes('oats') || lower.includes('wheat') || lower.includes('rice') || lower.includes('flour')) {
      nutritionContribution.carbs = { gives: true, textEn: '✅ Contributes Carbohydrates & Fiber', textTa: '✅ மாவுச்சத்து & நார்ச்சத்து வழங்குகிறது' };
      category = INGREDIENT_CATEGORIES.WHOLE_FOOD;
      whatIsIt = 'A grain base ingredient';
      whyUsed = 'Provides food volume and energy carbohydrates';
      whoShouldPayAttention = 'Gluten-sensitive individuals or people with celiac disease (if wheat/barley/rye).';
      easyExplanationEn = `“It's a grain ingredient that gives your body energy.”`;
      easyExplanationTa = `“இது உடலுக்கு ஆற்றல் தரும் தானிய உணவுப் பொருள்.”`;
    }

    if (lower.includes('maltodextrin')) {
      whoShouldPayAttention = 'Diabetics and people monitoring rapid glucose spikes due to its high Glycemic Index.';
      easyExplanationEn = `“It's a type of carbohydrate made from starch. Food companies use it to add texture or bulk.”`;
      easyExplanationTa = `“இது மாவுச்சத்திலிருந்து தயாரிக்கப்படும் ஒரு வகை கார்போஹைட்ரேட். உணவிற்கு texture அல்லது அளவு கொடுக்க இது பயன்படுத்தப்படுகிறது.”`;
    }

    if (lower.includes('benzoate') || lower.includes('e211')) {
      whoShouldPayAttention = 'People monitoring overall intake of processed foods or specific preservative concerns.';
    }

    return {
      id: `ing_${index}`,
      name: trimmed,
      taName: tamilInfo?.taName || null,
      technicalName,
      eNumber,
      category,
      riskStatus,
      order: index + 1,
      isAdditive: Boolean(additiveMatch),

      // 8 Detective Fields
      whatIsIt: tamilInfo?.whatIsIt || whatIsIt,
      whyUsed: tamilInfo?.whyUsed || whyUsed,
      whyInProduct,
      nutritionContribution,
      whoShouldPayAttention,
      shouldIBeConcerned,
      evidenceContext,

      // Easy Explain Strings
      easyExplanationEn,
      easyExplanationTa
    };
  }).filter(Boolean);

  return parsedIngredients;
}

function splitIngredientString(str) {
  const result = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(' || char === '{') {
      parenDepth++;
      current += char;
    } else if (char === ')' || char === '}') {
      parenDepth = Math.max(0, parenDepth - 1);
      current += char;
    } else if ((char === ',' || char === ';') && parenDepth === 0) {
      if (current.trim()) result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) result.push(current.trim());
  return result;
}
