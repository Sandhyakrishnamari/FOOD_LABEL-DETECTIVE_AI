import React from 'react';
import { Lightbulb, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function WhatShouldIDo({ scanResult, onScanAnother, onSwitchToComparison }) {
  if (!scanResult) return null;

  const { scoreData = {}, nutritionData = {}, parsedIngredients = [] } = scanResult;
  const { nutrition = {} } = nutritionData;
  const score = scoreData.score || 75;

  const sugar = nutrition.sugar ?? 14;
  const sodium = nutrition.sodium ?? 280;

  let guidanceText = 'This product is okay occasionally, but avoid making it a daily snack.';
  let actions = [
    'Keep the portion strictly to 1 standard serving (30g).',
    'Avoid combining this with other sugary drinks or sweet snacks today.',
    'Pair with a whole-protein source (nuts, plain Greek yogurt) to slow glucose absorption.'
  ];

  if (score >= 80) {
    guidanceText = 'This product has a clean nutritional profile and can be enjoyed regularly as part of a balanced diet.';
    actions = [
      'Great for regular snacking or post-workout fuel.',
      'Stay mindful of portion size to align with your daily caloric goals.',
      'Store in a cool, dry place to maintain ingredient freshness.'
    ];
  } else if (score < 60) {
    guidanceText = 'Due to high levels of sugar, sodium, or industrial additives, this product is not recommended for frequent consumption.';
    actions = [
      'Reserve this for rare special occasions rather than daily snacking.',
      'Swap to a whole-food alternative (fruit with nut butter or roasted seeds).',
      'If consuming, drink plenty of water to help flush excess sodium and additives.'
    ];
  }

  return (
    <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Lightbulb className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">
            💡 WHAT SHOULD I DO?
          </h3>
          <p className="text-[11px] text-slate-300">
            Actionable next steps to make smart food decisions:
          </p>
        </div>
      </div>

      {/* Main Guidance Text Box */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
        <p className="text-slate-100 font-bold text-sm sm:text-base leading-snug">
          👉 {guidanceText}
        </p>

        <div className="pt-2 border-t border-slate-850 space-y-2">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
            Recommended Actions:
          </span>

          <div className="space-y-1.5">
            {actions.map((act, i) => (
              <div key={i} className="flex items-start space-x-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <button
          onClick={onSwitchToComparison}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
        >
          <span>⚖️ Compare with Another Brand</span>
        </button>

        <button
          onClick={onScanAnother}
          className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>📸 Scan Another Food Label ➔</span>
        </button>
      </div>
    </div>
  );
}
