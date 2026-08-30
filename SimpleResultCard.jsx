import React from 'react';
import { Volume2, Sparkles, Scale, HelpCircle, CheckCircle2, AlertTriangle, AlertCircle, RefreshCw, Share2, ArrowRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { speakText } from '../../services/textToSpeech';

export default function SimpleResultCard({
  scanResult,
  selectedPersona = 'general',
  personaResult,
  explainSimply = false,
  onToggleExplainSimply,
  onToggleWhyRating,
  showWhyRating,
  onSwitchToComparison,
  onExploreDetailed,
  onFindAlternatives
}) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!scanResult) return null;

  const {
    productName = 'Packaged Food Item',
    frontImage = null,
    nutritionData = {},
    parsedIngredients = [],
    allergensDetected = [],
    scoreData = {}
  } = scanResult;

  const { nutrition = {}, servingSize = '1 serving (30g)' } = nutritionData;

  const sugar = nutrition.sugar ?? 14;
  const sodium = nutrition.sodium ?? 280;
  const satFat = nutrition.saturatedFat ?? 3.5;
  const protein = nutrition.protein ?? 3;
  const calories = nutrition.calories ?? 220;

  // Active dynamic score
  const activeScore = personaResult ? personaResult.score : (scoreData.score || 75);

  // Verdict style determination
  let verdictStyle = {
    badge: isTa ? '🟡 மிதமாக உட்கொள்ளவும்' : '🟡 Consume in Moderation',
    color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-amber-500/30',
    ringColor: '#f59e0b',
    summaryStandard: `This product contains ${protein}g protein, but has ${sugar}g sugar and refined ingredients per serving.`,
    summarySimple: '“It’s okay as an occasional treat, but eating it every day is not ideal for your health.”',
    goodPoints: [
      protein >= 5 ? `Contains ${protein}g protein per serving` : 'Standard calorie density',
      allergensDetected.length === 0 ? 'No major allergens flagged' : 'Clear allergen labeling'
    ],
    watchPoints: [
      sugar > 8 ? `Contains ${sugar}g added/total sugar` : 'Contains processed fats',
      satFat >= 3 ? `${satFat}g saturated fat per serving` : 'Contains industrial additives'
    ],
    whatToDo: isTa 
      ? 'எப்போதாவது சிற்றுண்டியாக சாப்பிடலாம். தினசரி உணவாக மாற்றுவதைத் தவிர்க்கவும்.'
      : 'Fine as an occasional treat. For daily snacking, consider whole-food or lower-sugar alternatives.'
  };

  if (activeScore >= 80) {
    verdictStyle = {
      badge: isTa ? '🟢 சிறந்த தேர்வு' : '🟢 Good Choice',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-emerald-500/30',
      ringColor: '#10b981',
      summaryStandard: 'Nutrient-dense formulation with clean ingredients suitable for regular balanced intake.',
      summarySimple: '“Great pick! It has clean ingredients and great nutrients to support your health.”',
      goodPoints: [
        `High nutritional balance (${protein}g protein, low added sugar)`,
        'No harmful synthetic additives or artificial dyes'
      ],
      watchPoints: [
        'Watch portion sizes to stay within daily caloric goals'
      ],
      whatToDo: isTa
        ? 'தினசரி சீரான உணவின் ஒரு பகுதியாக தாராளமாக உட்கொள்ளலாம்.'
        : 'Safe and healthy to include regularly as part of a balanced diet.'
    };
  } else if (activeScore < 65) {
    verdictStyle = {
      badge: isTa ? '🔴 அதிக எச்சரிக்கை' : '🔴 High Caution',
      color: 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-rose-500/30',
      ringColor: '#f43f5e',
      summaryStandard: 'Heavily processed with high sugar, saturated fat, or multiple additives. Limit intake.',
      summarySimple: '“Better to skip or have very rarely! It is heavily processed with high sugar or additives.”',
      goodPoints: [
        'Quick convenience food'
      ],
      watchPoints: [
        sugar > 10 ? `High sugar content (${sugar}g per serving)` : 'Excessive sodium or saturated fat',
        'Multiple ultra-processed additives or refined base'
      ],
      whatToDo: isTa
        ? 'அடிக்கடி சாப்பிடுவதைத் தவிர்க்கவும். ஆரோக்கியமான மாற்று உணவுகளைத் தேர்ந்தெடுக்கவும்.'
        : 'Limit to rare occasions. Swap for less processed or lower-sugar alternatives.'
    };
  }

  // 3 Things You Must Know
  const threeThings = [
    {
      icon: sugar > 8 ? '🟠' : '🟢',
      text: sugar > 8 ? `Added sugar detected (${sugar}g)` : `Low sugar (${sugar}g per serving)`
    },
    {
      icon: parsedIngredients.some(i => i.name.toLowerCase().includes('flour') || i.name.toLowerCase().includes('maida') || i.isUltraProcessed) ? '🌾' : '🥜',
      text: parsedIngredients.some(i => i.name.toLowerCase().includes('maida')) ? 'Refined wheat flour (Maida) base' : 'Whole food & protein components'
    },
    {
      icon: allergensDetected.length > 0 ? '⚠️' : '🟢',
      text: allergensDetected.length > 0 ? `Allergens: ${allergensDetected.join(', ')}` : 'No major allergen detected'
    }
  ];

  const activeExplanation = explainSimply ? verdictStyle.summarySimple : verdictStyle.summaryStandard;
  const audioVoiceText = `${productName}. ${verdictStyle.badge}. Score ${activeScore} out of 100. ${activeExplanation}`;

  // SVG Circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (activeScore / 100) * circumference;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 max-w-4xl mx-auto transition-all">
      
      {/* Product Title Bar + Quick Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3.5">
          {frontImage ? (
            <img
              src={frontImage}
              alt={productName}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-2xl flex-shrink-0">
              🏷️
            </div>
          )}

          <div>
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
              🔎 {isTa ? 'உணவு ஆய்வு முடிவு' : 'FOOD INVESTIGATION RESULT'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 leading-tight">
              {productName}
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Serving: <strong className="text-slate-300">{servingSize}</strong> • {calories} kcal
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-end">
          {/* Explain Simply Button */}
          <button
            onClick={onToggleExplainSimply}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center space-x-1.5 cursor-pointer ${
              explainSimply
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-black'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
            }`}
            title="Convert to simple, child-friendly explanation"
          >
            <span>🧒</span>
            <span>{explainSimply ? 'Easy Mode: ON' : 'Easy Mode'}</span>
          </button>

          {/* Voice Read Aloud */}
          <button
            onClick={() => speakText(audioVoiceText, language)}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-amber-400 border border-slate-800 transition-all flex items-center space-x-1 text-xs font-bold cursor-pointer"
            title="Read verdict aloud"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Read</span>
          </button>
        </div>
      </div>

      {/* ------------------- LEVEL 1: DOMINANT SCORE & VERDICT SUMMARY ------------------- */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800/90 text-center space-y-6 shadow-inner relative overflow-hidden">
        
        {/* Score & Verdict Ring */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke="#1e293b"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke={verdictStyle.ringColor}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-4xl font-black font-mono text-slate-100 tracking-tight">
                {activeScore}
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">/ 100</span>
            </div>
          </div>

          {/* Prominent Verdict Badge */}
          <div className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full border text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg ${verdictStyle.color}`}>
            <span>{verdictStyle.badge}</span>
          </div>

          {/* 1-Sentence Plain Explanation */}
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
            {activeExplanation}
          </p>
        </div>

        {/* ------------------- 3 THINGS YOU MUST KNOW ------------------- */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2.5 max-w-xl mx-auto text-left">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
            💡 {isTa ? 'நீங்கள் தெரிந்து கொள்ள வேண்டிய 3 விஷயங்கள்:' : '3 Things You Must Know:'}
          </span>
          <div className="space-y-1.5 text-xs font-semibold text-slate-200">
            {threeThings.map((thing, idx) => (
              <div key={idx} className="flex items-center space-x-2 bg-slate-950/80 p-2 rounded-xl border border-slate-850">
                <span>{thing.icon}</span>
                <span>{thing.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ------------------- QUICK VERDICT: GOOD VS WATCH OUT FOR ------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left text-xs">
          {/* Good Points */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1 font-mono">
              <ThumbsUp className="w-3 h-3" />
              <span>{isTa ? 'நல்லது' : 'Good'}</span>
            </span>
            <ul className="space-y-1 text-emerald-200 font-medium">
              {verdictStyle.goodPoints.map((pt, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Watch Out For Points */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1 font-mono">
              <ThumbsDown className="w-3 h-3" />
              <span>{isTa ? 'கவனிக்க வேண்டியவை' : 'Watch out for'}</span>
            </span>
            <ul className="space-y-1 text-amber-200 font-medium">
              {verdictStyle.watchPoints.map((pt, i) => (
                <li key={i} className="flex items-start space-x-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ------------------- WHAT SHOULD I DO? & HEALTHIER ALTERNATIVE CTA ------------------- */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl max-w-2xl mx-auto text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
              🎯 {isTa ? 'நான் என்ன செய்ய வேண்டும்?' : 'What should I do?'}
            </span>
            <p className="text-xs text-slate-300">
              {verdictStyle.whatToDo}
            </p>
          </div>

          <button
            onClick={onFindAlternatives || onExploreDetailed}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 self-stretch sm:self-auto justify-center cursor-pointer flex-shrink-0"
          >
            <span>Find Healthier Alternative</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ------------------- LEVEL 2 & 3 NAVIGATION SHORTCUTS ------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <button
          onClick={onToggleWhyRating}
          className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
            showWhyRating
              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-black'
              : 'bg-slate-950 text-amber-300 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>{showWhyRating ? 'Hide "Why This Score?"' : '❓ Why This Score?'}</span>
        </button>

        <button
          onClick={onSwitchToComparison}
          className="py-3 px-4 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850 hover:text-white font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>⚖️ Compare Product</span>
        </button>

        <button
          onClick={onExploreDetailed}
          className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-xs border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>🔬 Explore Evidence & Claims ↓</span>
        </button>
      </div>

    </div>
  );
}

