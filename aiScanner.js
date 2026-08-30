/**
 * Google Gemini Multimodal Vision API Integration
 * Uses direct fetch REST API for 100% reliable zero-dependency integration.
 */

export async function analyzeLabelWithGemini(imageBase64, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key is required for AI Multimodal Vision.');
  }

  const systemPrompt = `You are an expert Food Label Detective OCR and Nutrition Extraction System.
Analyze the provided food label image and extract all text, ingredients, nutrition facts, and front-of-package marketing claims.

Return ONLY a valid JSON object matching this exact schema:
{
  "productName": "Estimated product name or description",
  "ingredientsText": "Exact raw text of ingredient list as printed",
  "marketingClaimsDetected": ["NO ADDED SUGAR", "HIGH PROTEIN", "100% NATURAL"],
  "nutrition": {
    "servingSize": "e.g. 1 bar (45g)",
    "calories": 210,
    "fat": 8,
    "saturatedFat": 2.5,
    "transFat": 0,
    "cholesterol": 0,
    "sodium": 180,
    "carbs": 28,
    "fiber": 4,
    "sugar": 14,
    "addedSugar": 12,
    "protein": 10
  }
}
If any nutrition value is missing or unreadable, set it to 0 or null. Do not include markdown code fence formatting or extra text outside JSON.`;

  let base64Data = imageBase64;
  let mimeType = 'image/jpeg';

  if (imageBase64.includes(',')) {
    const parts = imageBase64.split(',');
    const match = parts[0].match(/:(.*?);/);
    if (match) mimeType = match[1];
    base64Data = parts[1];
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            { text: systemPrompt }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error('Failed to parse Gemini Vision JSON response:', rawText);
    throw new Error('Could not parse AI response into structured label data.');
  }
}
