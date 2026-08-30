import React, { useState } from 'react';
import { RefreshCw, Scale, Calculator } from 'lucide-react';
import { recalculatePortionNutrition } from '../../services/portionRecalculator';

export default function PortionRecalculator({ nutritionData }) {
  const [portionMultiplier, setPortionMultiplier] = useState(1.0);
  const [customServingInput, setCustomServingInput] = useState('');

  if (!nutritionData || !nutritionData.nutrition) return null;

  const rawNutrition = nutritionData.nutrition;
  const labelServingGrams = parseFloat(nutritionData.servingSize) || 30;
  
  const currentMultiplier = customServingInput ? (parseFloat(customServingInput) / labelServingGrams || 1.0) : portionMultiplier;
  const recalculated = recalculatePortionNutrition(rawNutrition, currentMultiplier);

  const presets = [
    { label: '[1 serving]', val: 1.0, desc: `${labelServingGrams}g (1 serving)` },
    { label: '[2 servings]', val: 2.0, desc: `${labelServingGrams * 2}g (2 servings)` },
    { label: '[3 servings]', val: 3.0, desc: `${labelServingGrams * 3}g (3 servings)` }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
              🍽️ SERVING REALITY CALCULATOR
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <span>Calculate Actual Consumption Reality</span>
          </h3>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Label Serving Size: <strong className="text-amber-300 font-bold">{labelServingGrams}g</strong>
        </span>
      </div>

      {/* Quick Buttons: [1 serving] [2 servings] [3 servings] [Custom] */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {presets.map((p) => {
          const isActive = !customServingInput && portionMultiplier === p.val;
          return (
            <button
              key={p.val}
              onClick={() => { setCustomServingInput(''); setPortionMultiplier(p.val); }}
              className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md scale-105'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <span className="block">{p.label}</span>
              <span className={`text-[10px] block mt-0.5 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                {p.desc}
              </span>
            </button>
          );
        })}

        {/* Custom Input */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Custom (g):</span>
          <input
            type="number"
            placeholder="e.g. 90"
            value={customServingInput}
            onChange={(e) => setCustomServingInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-xs text-slate-200 font-mono text-center focus:border-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Explicit Math Explanation */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-amber-300 font-mono flex items-center justify-between">
        <span>
          💡 You are consuming approximately <strong className="text-amber-400 font-bold text-sm">{currentMultiplier.toFixed(1)} servings</strong> ({Math.round(labelServingGrams * currentMultiplier)}g total).
        </span>
      </div>

      {/* Recalculated Actual Output Cards */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Actual Calories</span>
          <span className="text-xl font-black font-mono text-slate-100">{recalculated.calories} kcal</span>
        </div>

        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Actual Sugar</span>
          <span className={`text-xl font-black font-mono ${recalculated.sugar > 15 ? 'text-rose-400' : 'text-amber-300'}`}>
            {recalculated.sugar}g
          </span>
          <span className="text-[9px] text-amber-300/80 block mt-0.5">≈ {recalculated.sugarTeaspoons} tsp sugar</span>
        </div>

        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Actual Sodium</span>
          <span className={`text-xl font-black font-mono ${recalculated.sodium > 500 ? 'text-rose-400' : 'text-slate-200'}`}>
            {recalculated.sodium}mg
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">≈ {recalculated.sodiumSaltGrams}g salt</span>
        </div>

        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Actual Protein</span>
          <span className="text-xl font-black font-mono text-emerald-400">{recalculated.protein}g</span>
        </div>
      </div>

    </div>
  );
}
