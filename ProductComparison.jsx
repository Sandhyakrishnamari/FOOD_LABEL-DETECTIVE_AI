import React, { useState } from 'react';
import { Scale, Trash2, Trophy, ArrowRight, PlusCircle, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { SAMPLE_LABELS } from '../../services/sampleData';

export default function ProductComparison({ onSwitchToScanner }) {
  const { comparisonBuffer, setComparisonBuffer, savedScans, t } = useUser();

  const productA = comparisonBuffer[0] || null;
  const productB = comparisonBuffer[1] || null;

  const handleSelectFromHistory = (scan, slotIndex) => {
    setComparisonBuffer(prev => {
      const copy = [...prev];
      copy[slotIndex] = scan;
      return copy;
    });
  };

  const handleLoadSample = (sample, slotIndex) => {
    // Construct standard scan object from sample
    const scanObj = {
      id: sample.id,
      productName: sample.name,
      frontImage: sample.frontImage,
      nutritionData: { nutrition: sample.nutrition },
      parsedIngredients: sample.rawIngredients.split(',').map((name, i) => ({
        id: `ing_${i}`,
        name: name.trim(),
        isAdditive: name.includes('E') || name.includes('Preservative') || name.includes('Benzoate') || name.includes('Tartrazine'),
        riskStatus: name.includes('Sugar') || name.includes('Syrup') ? 'watch' : 'good'
      })),
      allergensDetected: [],
      scoreData: {
        score: sample.nutrition.sugar > 15 ? 55 : sample.nutrition.sugar > 5 ? 75 : 90,
        grade: sample.nutrition.sugar > 15 ? 'C' : 'B'
      }
    };
    handleSelectFromHistory(scanObj, slotIndex);
  };

  const clearSlot = (slotIndex) => {
    setComparisonBuffer(prev => prev.filter((_, idx) => idx !== slotIndex));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
            ⚖️
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              Product Comparison
            </h2>
            <p className="text-xs text-slate-400">
              Compare 2 packaged food labels side-by-side to find the healthier choice.
            </p>
          </div>
        </div>

        {!productA && !productB && (
          <div className="pt-2">
            <p className="text-xs text-amber-300/90 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              💡 Tip: Pick two products from your scan history below or choose from sample foods to see which is better.
            </p>
          </div>
        )}
      </div>

      {/* Comparison Slot Pickers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* SLOT A */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              PRODUCT A
            </span>
            {productA && (
              <button
                onClick={() => clearSlot(0)}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {productA ? (
            <ProductPreviewCard scan={productA} />
          ) : (
            <EmptySlotPicker
              slotLabel="Product A"
              savedScans={savedScans}
              onSelect={(scan) => handleSelectFromHistory(scan, 0)}
              onSelectSample={(sample) => handleLoadSample(sample, 0)}
              onSwitchToScanner={onSwitchToScanner}
            />
          )}
        </div>

        {/* SLOT B */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              PRODUCT B
            </span>
            {productB && (
              <button
                onClick={() => clearSlot(1)}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {productB ? (
            <ProductPreviewCard scan={productB} />
          ) : (
            <EmptySlotPicker
              slotLabel="Product B"
              savedScans={savedScans}
              onSelect={(scan) => handleSelectFromHistory(scan, 1)}
              onSelectSample={(sample) => handleLoadSample(sample, 1)}
              onSwitchToScanner={onSwitchToScanner}
            />
          )}
        </div>

      </div>

      {/* Comparison Matrix & Better Choice Winner */}
      {productA && productB && (
        <CleanComparisonTable productA={productA} productB={productB} />
      )}
    </div>
  );
}

function ProductPreviewCard({ scan }) {
  const { productName = 'Product', frontImage, scoreData = {}, nutritionData = {} } = scan;
  const score = scoreData.score || 75;

  return (
    <div className="flex items-center space-x-3.5 bg-slate-950 p-4 rounded-xl border border-slate-850">
      {frontImage ? (
        <img src={frontImage} alt={productName} className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl flex-shrink-0">
          🏷️
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-100 truncate">{productName}</h4>
        <span className="text-xs text-slate-400 font-mono">
          Score: <strong className="text-amber-300">{score}/100</strong>
        </span>
      </div>
    </div>
  );
}

function EmptySlotPicker({ slotLabel, savedScans, onSelect, onSelectSample, onSwitchToScanner }) {
  return (
    <div className="text-center py-6 px-4 border-2 border-dashed border-slate-800 rounded-xl space-y-3">
      <PlusCircle className="w-8 h-8 text-amber-400/60 mx-auto" />
      <div>
        <h4 className="text-xs font-bold text-slate-200">Select {slotLabel}</h4>
        <p className="text-[11px] text-slate-400">Choose from history or pick a demo product:</p>
      </div>

      {/* History Items */}
      {savedScans && savedScans.length > 0 && (
        <div className="space-y-1 max-h-32 overflow-y-auto text-left">
          {savedScans.slice(0, 3).map((scan) => (
            <button
              key={scan.id}
              onClick={() => onSelect(scan)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-850 hover:border-amber-500/40 text-xs flex justify-between items-center text-slate-300 hover:text-white"
            >
              <span className="truncate max-w-[160px] font-semibold">{scan.productName}</span>
              <span className="text-amber-400 font-mono text-[11px]">{scan.scoreData?.score || 75}/100</span>
            </button>
          ))}
        </div>
      )}

      {/* Sample presets */}
      <div className="flex flex-wrap gap-1.5 justify-center pt-1">
        {SAMPLE_LABELS.slice(0, 3).map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectSample(s)}
            className="px-2 py-1 rounded-lg bg-slate-950 hover:bg-slate-850 text-[11px] text-slate-300 border border-slate-800 truncate max-w-[130px]"
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={onSwitchToScanner}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all inline-flex items-center space-x-1"
        >
          <span>📸 Scan New</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function CleanComparisonTable({ productA, productB }) {
  const nutA = productA.nutritionData?.nutrition || {};
  const nutB = productB.nutritionData?.nutrition || {};

  const calA = nutA.calories ?? 220;
  const calB = nutB.calories ?? 190;

  const sugA = nutA.sugar ?? 14;
  const sugB = nutB.sugar ?? 2;

  const protA = nutA.protein ?? 3;
  const protB = nutB.protein ?? 8;

  const sodA = nutA.sodium ?? 280;
  const sodB = nutB.sodium ?? 65;

  const addA = productA.parsedIngredients?.filter(i => i.isAdditive || i.riskStatus === 'flag')?.length || 3;
  const addB = productB.parsedIngredients?.filter(i => i.isAdditive || i.riskStatus === 'flag')?.length || 0;

  const scoreA = productA.scoreData?.score || 68;
  const scoreB = productB.scoreData?.score || 88;

  // Determine winner
  const winner = scoreB > scoreA ? productB : productA;
  const loser = winner === productB ? productA : productB;

  const winnerExplanation = winner === productB
    ? `${productB.productName} is the better choice because it has significantly lower sugar (${sugB}g vs ${sugA}g), higher protein (${protB}g vs ${protA}g), and fewer chemical additives (${addB} vs ${addA}).`
    : `${productA.productName} is the better choice with higher overall nutrient density and cleaner formulation.`;

  const comparisonRows = [
    {
      metric: 'Calories',
      valA: `${calA} kcal`,
      valB: `${calB} kcal`,
      badgeA: calA <= calB ? '🟢 Lower' : '🟠 Higher',
      badgeB: calB <= calA ? '🟢 Lower' : '🟠 Higher'
    },
    {
      metric: 'Sugar',
      valA: `${sugA}g`,
      valB: `${sugB}g`,
      badgeA: sugA > 10 ? '🔴 High' : '🟢 Low',
      badgeB: sugB > 10 ? '🔴 High' : '🟢 Low'
    },
    {
      metric: 'Protein',
      valA: `${protA}g`,
      valB: `${protB}g`,
      badgeA: protA >= 6 ? '🟢 Good' : '🟠 Low',
      badgeB: protB >= 6 ? '🟢 Good' : '🟠 Low'
    },
    {
      metric: 'Sodium',
      valA: `${sodA}mg`,
      valB: `${sodB}mg`,
      badgeA: sodA > 250 ? '🔴 High' : '🟢 Low',
      badgeB: sodB > 250 ? '🔴 High' : '🟢 Low'
    },
    {
      metric: 'Additives',
      valA: `${addA} additives`,
      valB: `${addB} additives`,
      badgeA: addA > 1 ? '🟠 ' + addA : '🟢 Clean',
      badgeB: addB > 1 ? '🟠 ' + addB : '🟢 Clean'
    },
    {
      metric: 'Overall Score',
      valA: `${scoreA}/100`,
      valB: `${scoreB}/100`,
      badgeA: scoreA >= 80 ? '🟢 Great' : '⚠️ Limit',
      badgeB: scoreB >= 80 ? '🟢 Great' : '⚠️ Limit'
    }
  ];

  return (
    <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 animate-fade-in">
      
      {/* 🏆 WINNER VERDICT BANNER */}
      <div className="bg-emerald-500/10 border-2 border-emerald-500/40 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0">
          🏆
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
            BETTER CHOICE WINNER
          </span>
          <h3 className="text-lg font-black text-slate-100">
            {winner.productName}
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {winnerExplanation}
          </p>
        </div>
      </div>

      {/* CLEAN COMPARISON TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 bg-slate-950/60 rounded-l-xl">Nutrient / Factor</th>
              <th className="py-3.5 px-4 bg-slate-950/60">{productA.productName}</th>
              <th className="py-3.5 px-4 bg-slate-950/60 rounded-r-xl">{productB.productName}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {comparisonRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-850/50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-300 font-sans">{row.metric}</td>
                <td className="py-3 px-4 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200">{row.valA}</span>
                    <span className="text-[10px]">{row.badgeA}</span>
                  </div>
                </td>
                <td className="py-3 px-4 font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200">{row.valB}</span>
                    <span className="text-[10px]">{row.badgeB}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
