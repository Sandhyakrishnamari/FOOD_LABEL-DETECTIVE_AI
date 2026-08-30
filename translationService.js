/**
 * Translation & Easy Explain Service
 * Manages i18n dictionaries for English (en) and Tamil (ta),
 * as well as non-technical "🧒 Easy Explain" child-friendly translations.
 */

import enDict from '../i18n/en.json';
import taDict from '../i18n/ta.json';

export const dictionaries = {
  en: enDict,
  ta: taDict
};

/**
 * Get translated UI string by dot-notation key (e.g. "scanner.title")
 */
export function t(lang = 'en', keyPath = '') {
  const dict = dictionaries[lang] || dictionaries.en;
  const parts = keyPath.split('.');
  let current = dict;

  for (const p of parts) {
    if (current && current[p] !== undefined) {
      current = current[p];
    } else {
      // Fallback to English if translation key missing in Tamil
      let fallback = dictionaries.en;
      for (const fp of parts) {
        if (fallback && fallback[fp] !== undefined) fallback = fallback[fp];
        else return keyPath;
      }
      return typeof fallback === 'string' ? fallback : keyPath;
    }
  }

  return typeof current === 'string' ? current : keyPath;
}

/**
 * Tamil Translation Dictionary for Common Additives & E-numbers
 */
export const TAMIL_ADDITIVE_TRANSLATIONS = {
  'Sodium Benzoate': {
    taName: 'சோடியம் பென்சோயேட்',
    whatIsIt: 'ஒரு உணவுப் பாதுகாப்புப் பொருள் (Preservative).',
    whyUsed: 'உணவு விரைவில் கெட்டுப்போகாமல் நீண்ட நாட்கள் புதியதாக இருக்க உதவுகிறது.',
    easyExplain: '“இது உணவை சீக்கிரமாக கெட்டுப் போகாமல் பாதுகாக்கும் ஒரு உதவிப் பொருள்.”'
  },
  'Sodium Nitrite': {
    taName: 'சோடியம் நைட்ரைட்',
    whatIsIt: 'இறைச்சி பாதுகாப்பு மற்றும் நிறமூட்டும் பொருள்.',
    whyUsed: 'பாக்டீரியா வளர்ச்சியைத் தடுத்து இளஞ்சிவப்பு நிறத்தைத் தக்கவைக்கிறது.',
    easyExplain: '“இது இறைச்சி உணவுகளில் பாக்டீரியா வளராமல் தடுக்க பயன்படும் வேதிப்பொருள்.”'
  },
  'Tartrazine (Yellow 5)': {
    taName: 'டார்ட்ரசின் (மஞ்சள் நிறமூட்டி 5)',
    whatIsIt: 'செயற்கை மஞ்சள் நிறமூட்டி.',
    whyUsed: 'உணவிற்கு பிரகாசமான மஞ்சள் நிறத்தைக் கொடுக்கிறது.',
    easyExplain: '“இது உணவிற்கு அழகான மஞ்சள் நிறம் தரும் செயற்கை சாயம்.”'
  },
  'Allura Red AC (Red 40)': {
    taName: 'அல்லுரா ரெட் (சிவப்பு நிறமூட்டி 40)',
    whatIsIt: 'செயற்கை சிவப்பு நிறமூட்டி.',
    whyUsed: 'மிட்டாய்கள் மற்றும் பானங்களுக்கு அடர் சிவப்பு நிறம் தருகிறது.',
    easyExplain: '“இது மிட்டாய் மற்றும் பானங்களுக்கு சிவப்பு நிறம் கொடுக்கும் செயற்கை நிறம்.”'
  },
  'Maltodextrin': {
    taName: 'மால்டோடெக்ஸ்ட்ரின்',
    whatIsIt: 'மாவுச்சத்திலிருந்து பெறப்பட்ட கார்போஹைட்ரேட்.',
    whyUsed: 'உணவின் அளவை அதிகரிக்கவும், கெட்டித்தன்மை தரவும் பயன்படுகிறது.',
    easyExplain: '“இது மாவுச்சத்திலிருந்து தயாரிக்கப்படும் ஒரு வகை கார்போஹைட்ரேட். உணவிற்கு texture அல்லது அளவு கொடுக்க இது பயன்படுத்தப்படுகிறது.”'
  },
  'High Fructose Corn Syrup (HFCS)': {
    taName: 'ஹை பிரக்டோஸ் கார்ன் சிரப்',
    whatIsIt: 'சோளத்திலிருந்து தயாரிக்கப்படும் அதி-இனிப்பு திரவம்.',
    whyUsed: 'குறைந்த செலவில் அதிக இனிப்பு சுவையைத் தருகிறது.',
    easyExplain: '“இது சோளத்திலிருந்து செய்யப்படும் மிகவும் இனிப்பான திரவ சர்க்கரை.”'
  },
  'Aspartame': {
    taName: 'அஸ்பார்டேம்',
    whatIsIt: 'செயற்கை இனிப்புப் பொருள்.',
    whyUsed: 'சர்க்கரை இல்லாமலேயே அதிக இனிப்பு சுவையைத் தருகிறது.',
    easyExplain: '“இது கலோரி இல்லாத செயற்கை இனிப்புப் பொடி.”'
  },
  'Sucralose': {
    taName: 'சுக்ரலோஸ்',
    whatIsIt: 'செயற்கை இனிப்புப் பொருள்.',
    whyUsed: 'கலோரி இல்லாமல் சர்க்கரையை விட 600 மடங்கு அதிக இனிப்பு தருகிறது.',
    easyExplain: '“இது சர்க்கரை போன்ற சுவை தரும் ஆனால் கலோரி இல்லாத ஒரு செயற்கை இனிப்பு.”'
  },
  'Monosodium Glutamate (MSG)': {
    taName: 'அஜினோமோட்டோ / MSG',
    whatIsIt: 'சுவை கூட்டும் பொருள் (Umami flavor enhancer).',
    whyUsed: 'உணவின் சுவையை நாவில் அதிகப்படுத்தி சுவையாக மாற்றுகிறது.',
    easyExplain: '“இது உணவின் சுவையை கூட்டி நாவில் சுவையை அதிகப்படுத்தும் பொருள்.”'
  },
  'Palm Oil / Palm Kernel Oil': {
    taName: 'பாம் எண்ணெய் (பாமாயில்)',
    whatIsIt: 'சுத்திகரிக்கப்பட்ட தாவர எண்ணெய்.',
    whyUsed: 'குறைந்த செலவில் உணவிற்கு கெட்டித்தன்மையும் சுவையும் தருகிறது.',
    easyExplain: '“இது உணவை மொறுமொறுப்பாக மாற்ற பயன்படும் ஒரு வகை தாவர எண்ணெய்.”'
  }
};

/**
 * Get Tamil translation info for an ingredient
 */
export function getTamilIngredientInfo(ingredientName) {
  if (!ingredientName) return null;
  const match = Object.keys(TAMIL_ADDITIVE_TRANSLATIONS).find(k => 
    ingredientName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(ingredientName.toLowerCase())
  );
  return match ? TAMIL_ADDITIVE_TRANSLATIONS[match] : null;
}
