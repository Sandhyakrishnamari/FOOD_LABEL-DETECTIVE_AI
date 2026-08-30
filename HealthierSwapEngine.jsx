import React from 'react';
import { Award, CheckCircle2, ShoppingCart } from 'lucide-react';
import { INDIAN_HEALTHIER_SWAPS } from '../../data/indianStandards';

export default function HealthierSwapEngine({ scanResult }) {
  if (!scanResult) return null;

  const { productName = '', nutritionData = {} } = scanResult;
  const { nutrition = {} } = nutritionData;

  const sugarGrams = nutrition.sugar ?? 16;
  const proteinGrams = nutrition.protein ?? 4;
  const sodiumMg = nutrition.sodium ?? 420;

  const lowerName = productName.toLowerCase();

  let categoryKey = 'biscuits';
  if (lowerName.includes('soda') || lowerName.includes('drink') || lowerName.includes('beverage')) {
    categoryKey = 'beverages';
  } else if (lowerName.includes('gummy') || lowerName.includes('chew') || lowerName.includes('berry')) {
    categoryKey = 'candies';
  } else if (lowerName.includes('butter') || lowerName.includes('spread')) {
    categoryKey = 'spreads';
  } else if (lowerName.includes('chip') || lowerName.includes('crisp') || lowerName.includes('snack')) {
    categoryKey = 'chips';
  }

  const suggestedSwaps = INDIAN_HEALTHIER_SWAPS[categoryKey] || INDIAN_HEALTHIER_SWAPS.biscuits;

  return (
    <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-2xl p-6 shadow-xl mb-8 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
              🛒 BETTER CHOICE ENGINE
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Shopping Criteria & Options
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <span>Want a Better Option?</span>
          </h3>
        </div>
      </div>

      {/* Current vs Criteria Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Current Product Stats */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
            Current Product Metrics:
          </span>
          <div className="space-y-1 font-mono text-slate-300">
            <div>Sugar: <strong className="text-amber-300">{sugarGrams}g per serving</strong></div>
            <div>Protein: <strong className="text-slate-200">{proteinGrams}g per serving</strong></div>
            <div>Sodium: <strong className="text-slate-200">{sodiumMg}mg per serving</strong></div>
          </div>
        </div>

        {/* Criteria to Look For */}
        <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30 space-y-2 text-xs">
          <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
            Try looking for products with:
          </span>
          <div className="space-y-1.5 text-slate-200 font-semibold">
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Lower sugar (&lt; 6g per serving)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Higher protein (&gt; 8g per serving)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Lower sodium (&lt; 200mg per serving)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero trans fat & no hydrogenated oils</span>
            </div>
          </div>
        </div>

      </div>

      {/* Verified Indian Category Swaps */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Verified Indian Category Swaps:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestedSwaps.map((swap, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-emerald-500/20 rounded-xl p-3.5 space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <strong className="text-slate-100 font-bold">{swap.name}</strong>
                <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Score: {swap.healthScore}/100
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">{swap.whyBetter}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
