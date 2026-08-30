import React, { useState } from 'react';
import { Utensils, RefreshCw, AlertCircle } from 'lucide-react';

export default function PortionCalculator({ nutritionData }) {
  if (!nutritionData) return null;

  const { nutrition = {}, servingSize = '1 serving (30g)' } = nutritionData;

  // Extract base serving grams from string e.g. "30g" or fallback 30
  const matchGrams = servingSize.match(/(\d+)\s*g/i);
  const baseGrams = matchGrams ? parseInt(matchGrams[1], 10) : 30;

  // Base nutrition values per standard serving
  const baseCalories = nutrition.calories ?? 160;
  const baseSugar = nutrition.sugar ?? 14;
  const baseFat = nutrition.fat ?? 8;
  const baseSatFat = nutrition.saturatedFat ?? 3.5;
  const baseSodium = nutrition.sodium ?? 280;
  const baseProtein = nutrition.protein ?? 3;

  // State: custom grams entered by user
  const [eatingGrams, setEatingGrams] = useState(baseGrams * 2); // Default to realistic 2x (e.g. 60g)

  // Ratio multiplier
  const multiplier = baseGrams > 0 ? (eatingGrams / baseGrams) : 1;

  // Recalculated values
  const calcCalories = Math.round(baseCalories * multiplier);
  const calcSugar = (baseSugar * multiplier).toFixed(1);
  const calcFat = (baseFat * multiplier).toFixed(1);
  const calcSatFat = (baseSatFat * multiplier).toFixed(1);
  const calcSodium = Math.round(baseSodium * multiplier);
  const calcProtein = (baseProtein * multiplier).toFixed(1);

  const presets = [
    { label: '0.5x Half', grams: Math.round(baseGrams * 0.5) },
    { label: `1x Standard (${baseGrams}g)`, grams: baseGrams },
    { label: `2x Double (${baseGrams * 2}g)`, grams: baseGrams * 2 },
    { label: `3x Heavy (${baseGrams * 3}g)`, grams: baseGrams * 3 }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg">
            🍽️
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              🍽️ REALISTIC PORTION CALCULATOR
            </h3>
            <p className="text-[11px] text-slate-400">
              Labels often show unrealistic tiny servings. Adjust to what you actually eat:
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-center">
          Standard Label Serving: <strong className="text-slate-200">{servingSize}</strong>
        </span>
      </div>

      {/* Interactive Input Row */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-slate-200 flex items-center space-x-2">
            <span>I am actually eating:</span>
          </label>

          {/* Direct Numeric Input */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="number"
                min="5"
                max="1000"
                step="5"
                value={eatingGrams}
                onChange={(e) => setEatingGrams(Math.max(1, parseInt(e.target.value, 10) || 0))}
                className="w-24 bg-slate-900 border-2 border-amber-500/50 focus:border-amber-400 rounded-xl px-3 py-1.5 text-base font-black font-mono text-amber-300 text-center focus:outline-none"
              />
              <span className="text-xs font-mono text-slate-400 ml-1.5">grams (g)</span>
            </div>

            <button
              onClick={() => setEatingGrams(baseGrams)}
              className="text-[11px] text-slate-400 hover:text-amber-400 underline font-mono"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Quick Preset Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {presets.map((p) => {
            const isActive = eatingGrams === p.grams;
            return (
              <button
                key={p.grams}
                onClick={() => setEatingGrams(p.grams)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-black'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recalculated Nutrients 6-Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Calories */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Calories</span>
          <div className="text-lg font-black font-mono text-amber-300">{calcCalories}</div>
          <span className="text-[10px] text-slate-500 font-mono">kcal</span>
        </div>

        {/* Sugar */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sugar</span>
          <div className={`text-lg font-black font-mono ${parseFloat(calcSugar) > 15 ? 'text-rose-400' : 'text-amber-300'}`}>
            {calcSugar}g
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            parseFloat(calcSugar) > 15 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {parseFloat(calcSugar) > 15 ? '🔴 High' : '🟡 Moderate'}
          </span>
        </div>

        {/* Total Fat */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Fat</span>
          <div className="text-lg font-black font-mono text-slate-200">{calcFat}g</div>
          <span className="text-[9px] text-slate-500 font-mono">lipids</span>
        </div>

        {/* Sat Fat */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sat Fat</span>
          <div className={`text-lg font-black font-mono ${parseFloat(calcSatFat) >= 5 ? 'text-rose-400' : 'text-slate-200'}`}>
            {calcSatFat}g
          </div>
          <span className="text-[9px] text-slate-500 font-mono">saturated</span>
        </div>

        {/* Sodium */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Sodium</span>
          <div className={`text-lg font-black font-mono ${calcSodium > 500 ? 'text-rose-400' : 'text-slate-200'}`}>
            {calcSodium}mg
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
            calcSodium > 500 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
          }`}>
            {calcSodium > 500 ? '🔴 High' : '🟢 Safe'}
          </span>
        </div>

        {/* Protein */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-semibold block uppercase">Protein</span>
          <div className="text-lg font-black font-mono text-emerald-400">{calcProtein}g</div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
            🟢 {parseFloat(calcProtein) >= 8 ? 'Good' : 'Low'}
          </span>
        </div>
      </div>

      {multiplier > 1.5 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            Notice: At <strong>{eatingGrams}g</strong> ({multiplier.toFixed(1)}x label serving), you are consuming <strong>{calcSugar}g sugar</strong> and <strong>{calcCalories} calories</strong> in one sitting.
          </span>
        </div>
      )}
    </div>
  );
}
