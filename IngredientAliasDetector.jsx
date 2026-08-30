import React from 'react';
import { AlertCircle, Eye, Info } from 'lucide-react';
import { countAliasesAndSplitting } from '../../services/aliasCounter';

export default function IngredientAliasDetector({ rawIngredients = '', parsedIngredients = [] }) {
  const aliasData = countAliasesAndSplitting(rawIngredients, parsedIngredients);

  if (aliasData.sugarAliasCount < 2 && aliasData.fatAliasCount < 2) return null;

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl mb-6 space-y-3 animate-fade-in">
      <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-sm border-b border-slate-800 pb-2">
        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <span>🍬 Multiple Sweetening Ingredients Detected</span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        This product uses <strong className="text-amber-300 font-mono">{aliasData.sugarAliasCount} different sweetening ingredients</strong> in its preparation:
      </p>

      <div className="flex flex-wrap gap-2 py-1">
        {aliasData.sugarAliases.map((alias, idx) => (
          <span key={idx} className="text-xs font-mono font-bold bg-amber-500/10 text-amber-300 px-3 py-1 rounded-lg border border-amber-500/20 flex items-center space-x-1">
            <span>🍬 {alias}</span>
          </span>
        ))}
      </div>

      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
        <strong className="text-slate-300 block">Why is this important?</strong>
        <p>
          Manufacturers sometimes split sugar into multiple names (e.g., cane sugar, invert syrup, maltodextrin) so that no single sweetener appears as the #1 ingredient on the list.
        </p>
      </div>
    </div>
  );
}
