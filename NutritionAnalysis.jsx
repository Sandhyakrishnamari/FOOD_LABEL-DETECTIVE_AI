import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Salad, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function NutritionAnalysis({ nutritionData }) {
  const { language, t } = useUser();
  const isTa = language === 'ta';
  const [showFullNutrition, setShowFullNutrition] = useState(false);

  if (!nutritionData) return null;

  const { nutrition = {}, percentDV = {}, trafficLights = {} } = nutritionData;

  const macroData = [
    { name: isTa ? 'கார்போஹைட்ரேட்' : 'Carbs', value: (nutrition.carbs || 0) * 4, grams: nutrition.carbs || 0, color: '#38bdf8' },
    { name: isTa ? 'புரதம்' : 'Protein', value: (nutrition.protein || 0) * 4, grams: nutrition.protein || 0, color: '#34d399' },
    { name: isTa ? 'கொழுப்பு' : 'Fat', value: (nutrition.fat || 0) * 9, grams: nutrition.fat || 0, color: '#f59e0b' }
  ].filter(d => d.value > 0);

  const getSimpleBadge = (label, val, status) => {
    if (status === 'high' || (label === 'Sugar' && val > 12) || (label === 'Sodium' && val > 500)) {
      return <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-extrabold px-2 py-0.5 rounded">🔴 {t('nutrition.high')}</span>;
    }
    if (status === 'medium' || (label === 'Sugar' && val > 6) || (label === 'Sodium' && val > 200)) {
      return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold px-2 py-0.5 rounded">🟡 {t('nutrition.watch')}</span>;
    }
    return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold px-2 py-0.5 rounded">🟢 {t('nutrition.good')}</span>;
  };

  const keyCards = [
    { label: isTa ? 'சர்க்கரை (Sugar)' : 'Sugar', val: `${nutrition.sugar ?? 14} g`, badge: getSimpleBadge('Sugar', nutrition.sugar ?? 14, trafficLights.sugar) },
    { label: isTa ? 'புரதம் (Protein)' : 'Protein', val: `${nutrition.protein ?? 3} g`, badge: getSimpleBadge('Protein', nutrition.protein ?? 3, nutrition.protein >= 8 ? 'low' : 'medium') },
    { label: isTa ? 'சோடியம் (Sodium)' : 'Sodium', val: `${nutrition.sodium ?? 280} mg`, badge: getSimpleBadge('Sodium', nutrition.sodium ?? 280, trafficLights.sodium) },
    { label: isTa ? 'கலோரிகள் (Calories)' : 'Calories', val: `${nutrition.calories ?? 160} kcal`, badge: getSimpleBadge('Calories', nutrition.calories, 'medium') }
  ];

  const fullNutrientCards = [
    ...keyCards,
    { label: isTa ? 'கார்போஹைட்ரேட் (Carbs)' : 'Carbohydrates', val: `${nutrition.carbs || 0} g`, badge: getSimpleBadge('Carbs', nutrition.carbs, 'medium') },
    { label: isTa ? 'மொத்த கொழுப்பு (Total Fat)' : 'Total Fat', val: `${nutrition.fat || 0} g`, badge: getSimpleBadge('Fat', nutrition.fat, trafficLights.fat) },
    { label: isTa ? 'நிறைவுற்ற கொழுப்பு (Sat Fat)' : 'Saturated Fat', val: `${nutrition.saturatedFat || 0} g`, badge: getSimpleBadge('Sat Fat', nutrition.saturatedFat, trafficLights.saturatedFat) },
    { label: isTa ? 'டிரான்ஸ் கொழுப்பு (Trans Fat)' : 'Trans Fat', val: `${nutrition.transFat || 0} g`, badge: getSimpleBadge('Trans Fat', nutrition.transFat, nutrition.transFat > 0 ? 'high' : 'low') },
    { label: isTa ? 'நார்ச்சத்து (Dietary Fiber)' : 'Dietary Fiber', val: `${nutrition.fiber || 0} g`, badge: getSimpleBadge('Fiber', nutrition.fiber, nutrition.fiber >= 4 ? 'low' : 'medium') }
  ];

  const activeCards = showFullNutrition ? fullNutrientCards : keyCards;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
            <Salad className="w-6 h-6 text-amber-400" />
            <span>🥗 NUTRITION ANALYSIS</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('nutrition.servingSize')}: <span className="text-slate-200 font-semibold">{nutrition.servingSize || '1 serving (30g)'}</span> ({nutrition.calories || 160} kcal)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simple Visual Nutrition Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-3">
          {activeCards.map((card, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-2">
              <span className="text-xs text-slate-400 font-semibold">{card.label}</span>
              <div className="text-xl font-black font-mono text-slate-100">{card.val}</div>
              <div>{card.badge}</div>
            </div>
          ))}
        </div>

        {/* Macronutrient Caloric Split Chart */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1">
            <Activity className="w-4 h-4 text-amber-400" />
            <span>{t('nutrition.calorieSplit')}</span>
          </span>

          {macroData.length > 0 ? (
            <>
              <div className="w-full h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={macroData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={4} dataKey="value">
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name, item) => [`${item.payload.grams}g (${Math.round(val)} kcal)`, name]}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs">
                {macroData.map(m => (
                  <div key={m.name} className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <span className="text-slate-300 font-medium">{m.name}: <span className="font-mono text-slate-400">{m.grams}g</span></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-xs text-slate-500 py-8">
              No macronutrient data extracted
            </div>
          )}
        </div>

      </div>

      {/* VIEW FULL NUTRITION TABLE TOGGLE BUTTON */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={() => setShowFullNutrition(!showFullNutrition)}
          className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center space-x-1.5"
        >
          <span>{showFullNutrition ? 'Show Key 4 Only' : '[ VIEW FULL NUTRITION TABLE ]'}</span>
          {showFullNutrition ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}
