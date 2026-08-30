import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Eye, Tag } from 'lucide-react';
import { countAliasesAndSplitting } from '../../services/aliasCounter';
import { calculateGreenwashingScore } from '../../services/greenwashingEngine';

export default function GreenwashingScoreCard({ scanResult }) {
  if (!scanResult) return null;

  const { rawIngredients = '', parsedIngredients = [], marketingEvaluation = {}, nutritionData = {} } = scanResult;
  const { nutrition = {} } = nutritionData;

  const aliasData = countAliasesAndSplitting(rawIngredients, parsedIngredients);
  const greenwashData = calculateGreenwashingScore({ ingredientsText: rawIngredients, nutrition }, marketingEvaluation, aliasData);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-rose-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
              🔥 NOVEL METRIC
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Greenwashing & Packaging Deception Meter
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-amber-400" />
            <span>Packaging Truth vs Contents Deception</span>
          </h3>
        </div>

        {/* Greenwashing Gauge Pill */}
        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Greenwashing Score</div>
          <div className="text-2xl font-black font-mono text-rose-400">
            {greenwashData.score} <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Sugar & Fat Alias Counter + Ingredient Splitting Alert */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Tag className="w-4 h-4 text-amber-400" />
            <span>Sugar & Fat Alias Counter</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block">Disguised Sugar Aliases</span>
              <span className="text-lg font-black font-mono text-amber-300">{aliasData.sugarAliasCount}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-[10px] text-slate-400 block">Disguised Fat Aliases</span>
              <span className="text-lg font-black font-mono text-amber-300">{aliasData.fatAliasCount}</span>
            </div>
          </div>

          {aliasData.isIngredientSplittingDetected && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium leading-relaxed">
              {aliasData.splittingExplanation}
            </div>
          )}
        </div>

        {/* Claim-vs-Ingredient Contradiction Detector */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Claim-vs-Ingredient Contradictions</span>
          </h4>

          {greenwashData.bustedClaimsCount > 0 ? (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 font-medium space-y-1">
              <div className="font-bold text-rose-300">🚨 {greenwashData.bustedClaimsCount} Front-of-Package Contradiction(s) Caught!</div>
              <p className="text-[11px] text-slate-300">
                Front packaging promises do not match the fine-print ingredient list & nutrition table.
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 font-medium">
              ✓ No direct marketing claim contradictions detected on this label.
            </div>
          )}

          <div className="text-[11px] text-slate-400 font-mono">
            Rating: <strong className="text-amber-300">{greenwashData.badge}</strong>
          </div>
        </div>

      </div>

    </div>
  );
}
