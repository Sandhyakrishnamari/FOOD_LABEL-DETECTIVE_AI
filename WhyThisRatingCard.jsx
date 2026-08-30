import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Info, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function WhyThisRatingCard({ scanResult, onExploreDetailed }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  const [expandedFactor, setExpandedFactor] = useState(null);

  if (!scanResult) return null;

  const {
    nutritionData = {},
    parsedIngredients = [],
    scoreData = {},
    allergensDetected = []
  } = scanResult;

  const { nutrition = {} } = nutritionData;
  const activeScore = scoreData.score || 75;

  const sugar = nutrition.sugar ?? 14;
  const sodium = nutrition.sodium ?? 280;
  const satFat = nutrition.saturatedFat ?? 3.5;
  const protein = nutrition.protein ?? 3;
  const fiber = nutrition.fiber ?? 2;

  const flaggedAdditives = parsedIngredients.filter(i => i.riskStatus === 'flag' || i.isAdditive);

  // Factor Impact Matrix with plain-language explanations
  const factors = [
    {
      id: 'sugar',
      name: 'Sugar',
      value: `${sugar}g / serving`,
      status: sugar > 12 ? 'high' : sugar > 6 ? 'moderate' : 'good',
      badge: sugar > 12 ? '🔴 High' : sugar > 6 ? '🟠 Moderate' : '🟢 Good',
      color: sugar > 12 ? 'text-rose-400' : sugar > 6 ? 'text-amber-400' : 'text-emerald-400',
      bgColor: sugar > 12 ? 'bg-rose-500/10 border-rose-500/30' : sugar > 6 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30',
      title: 'Sugar Content & Glycemic Impact',
      explanation: sugar > 12
        ? `Contains ${sugar}g of sugar per serving, which accounts for a substantial percentage of your recommended maximum daily intake (25g). Rapid absorption can lead to energy crashes and metabolic strain.`
        : sugar > 6
        ? `Contains ${sugar}g of sugar per serving. Moderate amount — best enjoyed in controlled portions.`
        : `Contains only ${sugar}g of sugar per serving. Low glycemic impact and safe for regular consumption.`
    },
    {
      id: 'sodium',
      name: 'Sodium',
      value: `${sodium}mg / serving`,
      status: sodium > 400 ? 'high' : sodium > 200 ? 'moderate' : 'good',
      badge: sodium > 400 ? '🔴 High' : sodium > 200 ? '🟠 Moderate' : '🟢 Good',
      color: sodium > 400 ? 'text-rose-400' : sodium > 200 ? 'text-amber-400' : 'text-emerald-400',
      bgColor: sodium > 400 ? 'bg-rose-500/10 border-rose-500/30' : sodium > 200 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30',
      title: 'Sodium & Salt Balance',
      explanation: sodium > 400
        ? `At ${sodium}mg per serving, sodium exceeds 20% of your daily limit. High sodium intake elevates arterial blood pressure and causes water retention.`
        : sodium > 200
        ? `At ${sodium}mg per serving, sodium is in the moderate range. Keep total daily sodium under 2,000mg.`
        : `Low sodium content (${sodium}mg). Excellent for cardiovascular wellness.`
    },
    {
      id: 'satFat',
      name: 'Saturated Fat',
      value: `${satFat}g / serving`,
      status: satFat >= 4 ? 'high' : satFat >= 2 ? 'moderate' : 'good',
      badge: satFat >= 4 ? '🔴 High' : satFat >= 2 ? '🟠 Moderate' : '🟢 Good',
      color: satFat >= 4 ? 'text-rose-400' : satFat >= 2 ? 'text-amber-400' : 'text-emerald-400',
      bgColor: satFat >= 4 ? 'bg-rose-500/10 border-rose-500/30' : satFat >= 2 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30',
      title: 'Saturated Fat Quality',
      explanation: satFat >= 4
        ? `Contains ${satFat}g saturated fat. Often derived from palm kernel oil or hydrogenated fats which can increase LDL cholesterol.`
        : satFat >= 2
        ? `Contains ${satFat}g saturated fat. Moderate level for a snack.`
        : `Low saturated fat (${satFat}g). Clean lipid profile.`
    },
    {
      id: 'protein',
      name: 'Protein',
      value: `${protein}g / serving`,
      status: protein >= 8 ? 'good' : protein >= 4 ? 'moderate' : 'low',
      badge: protein >= 8 ? '🟢 Excellent' : protein >= 4 ? '🟢 Good' : '🟠 Low',
      color: protein >= 4 ? 'text-emerald-400' : 'text-amber-400',
      bgColor: protein >= 4 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30',
      title: 'Protein Contribution',
      explanation: protein >= 8
        ? `High protein content (${protein}g). Promotes satiety, muscle maintenance, and steady energy release.`
        : protein >= 4
        ? `Provides ${protein}g protein. A decent supporting nutrient contribution.`
        : `Low in protein (${protein}g). Offers minimal satiety compared to its caloric density.`
    },
    {
      id: 'fiber',
      name: 'Fiber',
      value: `${fiber}g / serving`,
      status: fiber >= 4 ? 'good' : fiber >= 2 ? 'good' : 'low',
      badge: fiber >= 4 ? '🟢 Excellent' : fiber >= 2 ? '🟢 Good' : '🟠 Low',
      color: fiber >= 2 ? 'text-emerald-400' : 'text-amber-400',
      bgColor: fiber >= 2 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30',
      title: 'Dietary Fiber & Gut Health',
      explanation: fiber >= 4
        ? `Excellent dietary fiber source (${fiber}g). Slows sugar absorption, supports healthy digestion and microbiome.`
        : fiber >= 2
        ? `Contains ${fiber}g dietary fiber, assisting standard digestion.`
        : `Low in dietary fiber (${fiber}g). Refined carbohydrate base.`
    },
    {
      id: 'additives',
      name: 'Additives',
      value: `${flaggedAdditives.length} detected`,
      status: flaggedAdditives.length >= 3 ? 'high' : flaggedAdditives.length >= 1 ? 'moderate' : 'good',
      badge: flaggedAdditives.length >= 3 ? '🔴 3+ Concerns' : flaggedAdditives.length >= 1 ? '🟠 Moderate' : '🟢 Clean',
      color: flaggedAdditives.length >= 3 ? 'text-rose-400' : flaggedAdditives.length >= 1 ? 'text-amber-400' : 'text-emerald-400',
      bgColor: flaggedAdditives.length >= 3 ? 'bg-rose-500/10 border-rose-500/30' : flaggedAdditives.length >= 1 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30',
      title: 'Industrial Additives & Preservatives',
      explanation: flaggedAdditives.length > 0
        ? `Detected ${flaggedAdditives.length} additives of interest (such as emulsifiers, artificial colorings, or synthetic preservatives). Review ingredient list for individual flags.`
        : `Zero high-concern industrial additives detected. Clean formulation.`
    }
  ];

  const toggleFactor = (id) => {
    setExpandedFactor(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider">
              <span>WHY THIS SCORE? ({activeScore} / 100)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Tap any factor below to see why it influenced the score.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 hidden sm:inline-block">
          Interactive Factor Breakdown
        </span>
      </div>

      {/* Factor Grid / Interactive Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {factors.map((f) => {
          const isExpanded = expandedFactor === f.id;
          return (
            <div
              key={f.id}
              className={`rounded-xl border transition-all cursor-pointer ${
                isExpanded
                  ? 'bg-slate-950 border-amber-500/50 shadow-md'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
              }`}
              onClick={() => toggleFactor(f.id)}
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-200">{f.name}</span>
                  <span className="text-[11px] font-mono text-slate-400">({f.value})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-black ${f.color}`}>
                    {f.badge}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Click-to-Expand Explanation Card */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-850 animate-fade-in space-y-1.5 text-xs">
                  <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-[11px]">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>{f.title}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {f.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Allergen Alert Notice if any */}
      {allergensDetected && allergensDetected.length > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl flex items-start space-x-2.5 text-xs text-purple-200">
          <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[11px] uppercase font-mono block text-purple-300">
              🚨 Important Allergen Notice:
            </span>
            <p className="text-slate-300 text-[11px] mt-0.5">
              Contains allergen triggers: <strong className="text-purple-200">{allergensDetected.map(a => a.name).join(', ')}</strong>.
            </p>
          </div>
        </div>
      )}

      {onExploreDetailed && (
        <div className="pt-1 flex justify-center">
          <button
            onClick={onExploreDetailed}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 py-1 px-3 rounded-lg hover:bg-slate-800 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore Complete Ingredient & Nutrition Breakdown ➔</span>
          </button>
        </div>
      )}
    </div>
  );
}
