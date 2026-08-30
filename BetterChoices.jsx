import React from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2, Scale } from 'lucide-react';
import { INDIAN_HEALTHIER_SWAPS } from '../../data/indianStandards';

export default function BetterChoices({ scanResult, onCompareWithAlternative }) {
  if (!scanResult) return null;

  const { productName = '', nutritionData = {} } = scanResult;
  const { nutrition = {} } = nutritionData;

  const sugar = nutrition.sugar ?? 14;
  const protein = nutrition.protein ?? 3;

  // Determine category
  const lowerName = productName.toLowerCase();
  let categoryKey = 'biscuits';
  if (lowerName.includes('soda') || lowerName.includes('drink') || lowerName.includes('beverage') || lowerName.includes('cola')) {
    categoryKey = 'beverages';
  } else if (lowerName.includes('gummy') || lowerName.includes('chew') || lowerName.includes('berry') || lowerName.includes('candy')) {
    categoryKey = 'candies';
  } else if (lowerName.includes('butter') || lowerName.includes('spread') || lowerName.includes('jam')) {
    categoryKey = 'spreads';
  } else if (lowerName.includes('chip') || lowerName.includes('crisp') || lowerName.includes('snack') || lowerName.includes('puff')) {
    categoryKey = 'chips';
  }

  const categorySwaps = INDIAN_HEALTHIER_SWAPS[categoryKey] || INDIAN_HEALTHIER_SWAPS.biscuits;

  // Build the 3 distinct better alternatives:
  // 1. Lower Sugar
  // 2. Higher Protein
  // 3. Fewer Additives / Clean formulation
  const alternatives = [
    {
      label: 'Alternative 1',
      tag: '🍬 Lower Sugar',
      name: categorySwaps[0]?.name || 'Roasted Seed & Millet Crunch',
      score: categorySwaps[0]?.healthScore || 88,
      whyBetter: `Contains only 2–4g of natural sugars (vs ${sugar}g in this product). Zero high-fructose corn syrup or maltodextrin.`,
      keyBenefit: 'Prevents insulin spikes & sugar crashes'
    },
    {
      label: 'Alternative 2',
      tag: '💪 Higher Protein',
      name: categorySwaps[1]?.name || 'Sprouted Moong & Nut Crisp',
      score: categorySwaps[1]?.healthScore || 85,
      whyBetter: `Delivers 10–14g plant protein per serving (vs ${protein}g in this product) to keep you full and energized for hours.`,
      keyBenefit: 'Sustained satiety & active muscle recovery'
    },
    {
      label: 'Alternative 3',
      tag: '🌿 Fewer Additives',
      name: 'Unsweetened Whole Nut Butter & Sliced Apple',
      score: 94,
      whyBetter: 'Made with 100% whole food ingredients. Free from emulsifiers, artificial flavors, and synthetic food colorings.',
      keyBenefit: 'Zero ultra-processed additives'
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg">
            🛒
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              🛒 BETTER CHOICES
            </h3>
            <p className="text-[11px] text-slate-400">
              Healthier alternatives instead of this product, tailored to what you want to optimize:
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-center font-bold">
          Clean Food Swaps
        </span>
      </div>

      {/* 3 Clear Alternatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {alt.label}
                </span>
                <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {alt.score}/100
                </span>
              </div>

              <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                {alt.tag}
              </span>

              <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-300 transition-colors leading-snug">
                {alt.name}
              </h4>

              {/* Clear "WHY it is better" explanation */}
              <div className="space-y-1 text-xs pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
                  Why is it better?
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {alt.whyBetter}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-medium">✓ {alt.keyBenefit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
