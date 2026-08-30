import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SUGAR_KEYWORDS = [
  'sugar', 'glucose', 'fructose', 'sucrose', 'maltose', 'dextrose', 'maltodextrin',
  'syrup', 'corn syrup', 'high fructose corn syrup', 'invert sugar', 'cane sugar',
  'brown sugar', 'apple juice concentrate', 'fruit juice concentrate', 'honey',
  'molasses', 'agave', 'caramel', 'dextrin', 'isomaltulose', 'trehalose'
];

export default function HiddenSugarDetective({ scanResult }) {
  if (!scanResult) return null;

  const { parsedIngredients = [], nutritionData = {} } = scanResult;
  const { nutrition = {} } = nutritionData;

  const totalSugar = nutrition.sugar ?? 14;
  const addedSugar = nutrition.addedSugar ?? (totalSugar > 2 ? Math.round(totalSugar * 0.85) : 0);

  // Detect all sugar-related ingredients from the parsed list
  const detectedSugarSources = parsedIngredients.filter(ing => {
    const lower = ing.name.toLowerCase();
    return SUGAR_KEYWORDS.some(kw => lower.includes(kw));
  });

  const count = detectedSugarSources.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-lg">
            🍬
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              🍬 HIDDEN SUGAR DETECTIVE
            </h3>
            <p className="text-[11px] text-slate-400">
              Uncovers all disguised sweetening sources in fine-print ingredients.
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border self-start sm:self-center ${
          count >= 3
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            : count >= 1
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          {count > 0 ? `${count} Sugar ${count === 1 ? 'Source' : 'Sources'} Detected` : 'No Added Sugar Detected'}
        </span>
      </div>

      {/* Main Grid: Detected Sources + Estimated Added Sugar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Detected Ingredients List */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2.5">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            📋 Detected Sweetening Ingredients:
          </span>

          {detectedSugarSources.length > 0 ? (
            <div className="space-y-1.5">
              {detectedSugarSources.map((s, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold"
                >
                  <span className="text-slate-200 flex items-center space-x-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{s.name}</span>
                  </span>
                  <span className="text-[10px] font-mono bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                    Fast Glycemic Spike
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-xs text-emerald-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>No disguised sugar aliases found in the ingredients!</span>
            </div>
          )}
        </div>

        {/* Sugar Measurement & Gauge */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              📊 Estimated Sugar Contribution:
            </span>

            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-black font-mono text-rose-400">
                {totalSugar}g
              </span>
              <span className="text-xs text-slate-400">total sugar / serving</span>
            </div>

            <div className="text-xs text-slate-300 mt-1 font-medium">
              Estimated Added Sugar: <strong className="text-rose-300 font-mono">{addedSugar}g</strong>
              <span className="text-slate-400 text-[11px] ml-1">
                (~{(addedSugar / 4).toFixed(1)} teaspoons of pure sugar)
              </span>
            </div>
          </div>

          {/* Progress Bar of Daily Allowance (25g recommended max) */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Daily Sugar Budget</span>
              <span className={totalSugar > 15 ? 'text-rose-400 font-bold' : 'text-amber-400'}>
                {Math.min(100, Math.round((totalSugar / 25) * 100))}% of max daily limit
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalSugar > 15 ? 'bg-rose-500' : totalSugar > 8 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (totalSugar / 25) * 100)}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
