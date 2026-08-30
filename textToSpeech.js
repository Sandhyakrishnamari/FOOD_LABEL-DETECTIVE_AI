/**
 * 🔊 Text-To-Speech (Web Speech API) Service
 * Provides audio voice explanations in English and Tamil for non-technical users and accessibility.
 */

export function speakText(text = '', language = 'en') {
  if (!('speechSynthesis' in window)) {
    alert('Voice explanation is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.92; // Slightly natural pace
  utterance.pitch = 1.0;

  if (language === 'ta') {
    utterance.lang = 'ta-IN';
  } else {
    utterance.lang = 'en-US';
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
