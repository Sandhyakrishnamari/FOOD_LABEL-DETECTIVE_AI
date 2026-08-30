import React from 'react';
import { ShoppingCart, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function PurchaseDecision({ safetyScoreData }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!safetyScoreData) return null;

  const { safetyScore, purchaseRecommendationEn, purchaseRecommendationTa, positiveChecklist = [], warningChecklist = [] } = safetyScoreData;

  return (
    <div className="bg-slate-900 border-2 border-amber-500/40 p-6 rounded-3xl shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold mb-1 inline-block">
            SMART PURCHASE DECISION
          </span>
          <h3 className="text-xl font-black text-slate-100 flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <span>Should I Buy This Product?</span>
          </h3>
        </div>

        <div className="bg-slate-950 px-5 py-2.5 rounded-2xl border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">🛡️ Food Safety Score</span>
          <span className="text-3xl font-black font-mono text-amber-300">{safetyScore} <span className="text-xs text-slate-500">/ 100</span></span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
        <span className="text-lg font-black text-amber-300">
          {isTa ? purchaseRecommendationTa : purchaseRecommendationEn}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        
        {/* Positives */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Verified Safety Pros</h4>
          <ul className="space-y-1.5 text-slate-200">
            {positiveChecklist.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Warnings */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Safety Watchpoints</h4>
          <ul className="space-y-1.5 text-slate-300">
            {warningChecklist.map((item, idx) => (
              <li key={idx} className="flex items-center space-x-1.5 text-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
