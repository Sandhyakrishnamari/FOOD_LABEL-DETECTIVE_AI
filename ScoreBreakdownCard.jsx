import React from 'react';
import { Scale } from 'lucide-react';

export default function ScoreBreakdownCard({ scanResult }) {
  if (!scanResult || !scanResult.scoreData) return null;

  const { scoreData } = scanResult;
  const { scoreBreakdown = {} } = scoreData;

  const positiveItems = scoreBreakdown.positiveItems || [
    { text: 'Protein Content', val: '+12', desc: 'Protein density' }
  ];

  const negativeItems = scoreBreakdown.negativeItems || [
    { text: 'Added Sugar', val: '-15', desc: 'Substantial added sugar' },
    { text: 'Sodium Content', val: '-8', desc: 'Sodium level' }
  ];

  return (
    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Transparent Score Math Breakdown</span>
        </span>
        <span className="font-mono text-slate-400 text-[10px]">
          Base Score: 75
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase block">Positive Adjustments:</span>
          {positiveItems.length > 0 ? (
            positiveItems.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <div>
                  <span className="font-bold block text-xs">{p.text}</span>
                  <span className="text-[9px] text-slate-400 font-sans block">{p.desc}</span>
                </div>
                <span className="font-black text-sm">{p.val}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic text-[11px]">No positive bonuses applied</div>
          )}
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-rose-400 uppercase block">Deductions & Penalties:</span>
          {negativeItems.length > 0 ? (
            negativeItems.map((n, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                <div>
                  <span className="font-bold block text-xs">{n.text}</span>
                  <span className="text-[9px] text-slate-400 font-sans block">{n.desc}</span>
                </div>
                <span className="font-black text-sm">{n.val}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic text-[11px]">No deductions applied</div>
          )}
        </div>
      </div>
    </div>
  );
}
