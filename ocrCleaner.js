/**
 * OCR Cleaning & Text Normalization Service
 * Removes noise, fixes high-confidence typos, calculates section-by-section confidence scores,
 * highlights uncertain words, and extracts label metadata (MRP, FSSAI, Dates, Certifications).
 */

import { COMMON_INGREDIENTS } from '../data/ingredients';
import { ADDITIVES_DATABASE } from '../data/additives';

const OCR_TYPO_MAP = [
  { wrong: /\bMa1da\b/gi, right: 'Maida' },
  { wrong: /\bMi1k\b/gi, right: 'Milk' },
  { wrong: /\bSug4r\b/gi, right: 'Sugar' },
  { wrong: /\bWh3at\b/gi, right: 'Wheat' },
  { wrong: /\bS0dium\b/gi, right: 'Sodium' },
  { wrong: /\bP4lm\b/gi, right: 'Palm' },
  { wrong: /\bFl0ur\b/gi, right: 'Flour' },
  { wrong: /\b0il\b/gi, right: 'Oil' },
  { wrong: /\bAcid\b/gi, right: 'Acid' },
  { wrong: /\bEmu1sifier\b/gi, right: 'Emulsifier' },
  { wrong: /\bPr0tein\b/gi, right: 'Protein' },
  { wrong: /\bBisc1ut\b/gi, right: 'Biscuit' },
  { wrong: /\bSyrup\b/gi, right: 'Syrup' },
  { wrong: /\bC0rn\b/gi, right: 'Corn' },
  { wrong: /\bS0y\b/gi, right: 'Soy' },
  { wrong: /\bE211\s*(\w+)/gi, right: 'E211' }
];

export function cleanOCRText(rawText = '', baseConfidence = 90) {
  if (!rawText) {
    return {
      cleanText: '',
      rawText: '',
      metadata: {},
      sectionConfidence: { ingredients: 0, nutrition: 0, expiry: 0, fssai: 0 },
      hasUncertainText: false,
      uncertainTokens: []
    };
  }

  const metadata = extractLabelMetadata(rawText);

  let text = rawText.replace(/(\w+)-\s*\n\s*(\w+)/g, '$1$2');
  text = text.replace(/\n+/g, ' ');

  // Typo replacements
  for (const rule of OCR_TYPO_MAP) {
    text = text.replace(rule.wrong, rule.right);
  }

  text = text.replace(/[^a-zA-Z0-9\s,\;\(\)\%\-\.\:₹]/g, ' ');
  text = text.replace(/([a-zA-Z])\1{2,}/g, '$1');
  text = text.replace(/\s+/g, ' ').trim();

  const ingredientsSection = extractIngredientsSection(text);
  const spellCorrected = spellCorrectIngredients(ingredientsSection);

  // Section confidence calculation
  const sectionConfidence = computeSectionConfidence(rawText, baseConfidence);

  // Uncertain token detection (e.g. non-dictionary suspicious tokens)
  const tokens = spellCorrected.split(/\s+/);
  const uncertainTokens = [];
  tokens.forEach(tok => {
    const cleanTok = tok.replace(/[^a-zA-Z]/g, '');
    if (cleanTok.length > 4 && /[0-9]/.test(tok) && !/e\d+/i.test(tok) && !/fssai/i.test(tok)) {
      uncertainTokens.push(tok);
    }
  });

  const hasUncertainText = uncertainTokens.length > 0 || sectionConfidence.expiry < 80 || sectionConfidence.ingredients < 80;

  return {
    cleanText: spellCorrected,
    rawText,
    metadata,
    sectionConfidence,
    hasUncertainText,
    uncertainTokens
  };
}

function extractLabelMetadata(text = '') {
  const mrpMatch = text.match(/mrp\s*[:\.]?\s*(₹?\s*\d+(?:\.\d+)?)/i);
  const netQtyMatch = text.match(/net\s*(?:quantity|qty|wt\.?)\s*[:\.]?\s*(\d+\s*(?:g|kg|ml|l))/i);
  const fssaiMatch = text.match(/fssai\s*(?:lic\.?\s*no\.?|license)?\s*[:\.]?\s*(\d{14})/i);
  const expiryMatch = text.match(/(?:exp|expiry|best\s*before)\s*[:\.]?\s*([\d\/\.\-]+|\d+\s*months)/i);

  return {
    mrp: mrpMatch ? mrpMatch[1].trim() : null,
    netQuantity: netQtyMatch ? netQtyMatch[1].trim() : null,
    fssaiNumber: fssaiMatch ? fssaiMatch[1].trim() : null,
    expiryString: expiryMatch ? expiryMatch[1].trim() : null
  };
}

function extractIngredientsSection(text = '') {
  const match = text.match(/(?:ingredients|contains)\s*[:\.]?\s*(.*)/i);
  if (match && match[1]) {
    const cutOff = match[1].split(/(?:nutrition|nUTRITIONAL|nUTRITION FACTS)/i)[0];
    return cutOff.trim();
  }
  return text;
}

function spellCorrectIngredients(text = '') {
  let result = text;
  const knownTerms = [
    'Refined Wheat Flour', 'Maida', 'Milk Products', 'Milk Solids',
    'Sweetened Condensed Partly Skimmed Milk', 'Sodium Benzoate',
    'Maltodextrin', 'High Fructose Corn Syrup', 'Palm Oil', 'Soy Lecithin'
  ];

  for (const term of knownTerms) {
    const regex = new RegExp(`\\b${term.replace(/\s+/g, '\\s*')}\\b`, 'gi');
    result = result.replace(regex, term);
  }

  return result;
}

function computeSectionConfidence(rawText, baseConf) {
  const lower = rawText.toLowerCase();

  const hasIngredientsKeyword = lower.includes('ingredients') || lower.includes('contains');
  const hasNutritionKeyword = lower.includes('nutrition') || lower.includes('energy') || lower.includes('protein');
  const hasExpiryKeyword = lower.includes('exp') || lower.includes('best before') || lower.includes('mfg');
  const hasFssaiKeyword = lower.includes('fssai') || lower.includes('lic');

  return {
    ingredients: hasIngredientsKeyword ? Math.min(99, Math.max(85, baseConf + 5)) : Math.max(60, baseConf - 15),
    nutrition: hasNutritionKeyword ? Math.min(99, Math.max(88, baseConf + 8)) : Math.max(55, baseConf - 20),
    expiry: hasExpiryKeyword ? Math.min(95, Math.max(70, baseConf - 5)) : 50,
    fssai: hasFssaiKeyword ? Math.min(98, Math.max(85, baseConf + 4)) : 45
  };
}
