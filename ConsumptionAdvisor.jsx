import React from 'react';
import { Utensils, Info } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function ConsumptionAdvisor({ consumptionData }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!consumptionData) return null;

  const { titleEn, titleTa, highlights = [], adviceEn, adviceTa } = consumptionData;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Utensils className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-slate-100">
            🍽️ Consumption Frequency Advisor
          </h3>
        </div>
        <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold">
          {isTa ? titleTa : titleEn}
        </span>
      </div>

      {highlights.length > 0 && (
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Key Nutritional Drivers:</span>
          <ul className="space-y-1">
            {highlights.map((h, idx) => (
              <li key={idx} className="text-amber-300 font-medium">{h.text}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-200 leading-relaxed font-semibold">
        💡 {isTa ? adviceTa : adviceEn}
      </div>
    </div>
  );
}
