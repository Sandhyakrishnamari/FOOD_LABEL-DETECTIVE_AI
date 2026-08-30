/**
 * 🌡️ Storage Guide & Environment Advisor Service
 * Extracts storage instructions from package text and provides environmental advice.
 */

export function analyzeStorageInstructions(rawText = '') {
  const text = rawText.toLowerCase();

  const isRefrigerated = text.includes('refrigerat') || text.includes('chill') || text.includes('keep cold') || text.includes('store between 2-8');
  const isFreeze = text.includes('freeze') || text.includes('frozen');

  const avoidList = [];
  if (!isRefrigerated) {
    avoidList.push({ icon: '☀️', name: 'Direct Sunlight', desc: 'Avoid exposure to direct sun rays' });
    avoidList.push({ icon: '💧', name: 'Moisture & Humidity', desc: 'Keep container tightly closed' });
    avoidList.push({ icon: '🔥', name: 'Direct Heat', desc: 'Store away from stoves or radiators' });
  }

  let storageAdviceEn = 'Store in a cool, dry place away from direct sunlight and moisture.';
  let storageAdviceTa = 'நேரடி சூரிய ஒளி மற்றும் ஈரப்பதம் இல்லாத குளிர்ந்த, உலர் இடத்தில் சேமிக்கவும்.';

  if (isRefrigerated) {
    storageAdviceEn = '❄️ Refrigeration Required: Keep chilled between 2°C – 8°C. Consume within 3 days of opening.';
    storageAdviceTa = '❄️ குளிரூட்டப்பட வேண்டும்: 2°C - 8°C வெப்பநிலையில் வைக்கவும். திறந்த 3 நாட்களுக்குள் உட்கொள்ளவும்.';
  }

  return {
    isRefrigerated,
    isFreeze,
    recommendedLocationEn: isRefrigerated ? 'Refrigerated Storage (2°C – 8°C)' : 'Cool, Dry Pantry / Cupboard',
    recommendedLocationTa: isRefrigerated ? 'குளிரூட்டப்பட்ட சேமிப்பு (2°C - 8°C)' : 'குளிர்ந்த, உலர் அலமாரி',
    avoidList,
    storageAdviceEn,
    storageAdviceTa
  };
}
