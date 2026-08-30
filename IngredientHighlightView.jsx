import React, { useState } from 'react';
import { TestTube, Info, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import IngredientDetailModal from './IngredientDetailModal';

export default function IngredientHighlightView({ parsedIngredients = [] }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [filterConcern, setFilterConcern] = useState('all'); // all, high, moderate, good

  if (!parsedIngredients || parsedIngredients.length === 0) return null;

  // Classify each ingredient by concern level
  const categorized = parsedIngredients.map(ing => {
    let concernLevel = 'neutral';
    let dot = '⚪';
    let badgeClass = 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700';

    if (ing.riskStatus === 'flag' || ['palm oil', 'high fructose corn syrup', 'red 40', 'yellow 5', 'blue 1', 'bha', 'bht', 'tartrazine', 'monosodium glutamate'].some(h => ing.name.toLowerCase().includes(h))) {
      concernLevel = 'high';
      dot = '🔴';
      badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30';
    } else if (ing.riskStatus === 'watch' || ing.isAdditive || ['sugar', 'syrup', 'maltodextrin', 'emulsifier', 'preservative', 'sodium benzoate', 'salt'].some(m => ing.name.toLowerCase().includes(m))) {
      concernLevel = 'moderate';
      dot = '🟠';
      badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
    } else if (ing.riskStatus === 'good' || ['cocoa', 'oats', 'wheat', 'almond', 'chia', 'protein', 'water', 'milk', 'soy', 'peanut'].some(g => ing.name.toLowerCase().includes(g))) {
      concernLevel = 'good';
      dot = '🟢';
      badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
    }

    return {
      ...ing,
      concernLevel,
      dot,
      badgeClass
    };
  });

  const filtered = categorized.filter(item => {
    if (filterConcern === 'high') return item.concernLevel === 'high';
    if (filterConcern === 'moderate') return item.concernLevel === 'moderate';
    if (filterConcern === 'good') return item.concernLevel === 'good';
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-lg">
            🧪
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
              🧪 INGREDIENT CONCERN BREAKDOWN
            </h3>
            <p className="text-[11px] text-slate-400">
              Tap any ingredient to view its purpose, concern level, and why it matters:
            </p>
          </div>
        </div>

        {/* Concern Filter Badges */}
        <div className="flex items-center space-x-1.5 self-start sm:self-center text-xs">
          <button
            onClick={() => setFilterConcern('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              filterConcern === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            All ({parsedIngredients.length})
          </button>
          <button
            onClick={() => setFilterConcern('high')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              filterConcern === 'high' ? 'bg-rose-500 text-slate-950 font-black' : 'bg-slate-950 text-rose-300 border border-rose-500/30'
            }`}
          >
            🔴 High
          </button>
          <button
            onClick={() => setFilterConcern('moderate')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              filterConcern === 'moderate' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950 text-amber-300 border border-amber-500/30'
            }`}
          >
            🟠 Moderate
          </button>
          <button
            onClick={() => setFilterConcern('good')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              filterConcern === 'good' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-950 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            🟢 Okay
          </button>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Legend:</span>
        <span className="flex items-center space-x-1">
          <span>🔴</span>
          <span className="text-rose-300 font-semibold">High concern</span>
        </span>
        <span className="flex items-center space-x-1">
          <span>🟠</span>
          <span className="text-amber-300 font-semibold">Moderate concern</span>
        </span>
        <span className="flex items-center space-x-1">
          <span>🟢</span>
          <span className="text-emerald-300 font-semibold">Generally okay</span>
        </span>
        <span className="flex items-center space-x-1">
          <span>⚪</span>
          <span className="text-slate-400">Neutral</span>
        </span>
      </div>

      {/* Highlighted Visual Cloud */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-wrap gap-2 items-center leading-relaxed">
        {filtered.map((ing, idx) => (
          <button
            key={ing.id || idx}
            onClick={() => setSelectedIngredient(ing)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-sm ${ing.badgeClass}`}
            title={`Click to inspect ${ing.name}`}
          >
            <span>{ing.name}</span>
            {ing.eNumber && <span className="font-mono text-[10px] opacity-75">({ing.eNumber})</span>}
            <span className="text-xs">{ing.dot}</span>
          </button>
        ))}
      </div>

      {/* Ingredient Detail Modal */}
      {selectedIngredient && (
        <IngredientDetailModal
          ingredient={selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
        />
      )}
    </div>
  );
}
