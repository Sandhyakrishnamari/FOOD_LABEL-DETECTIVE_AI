import React from 'react';
import { Package, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function PackagingInspector({ packagingData }) {
  const { language } = useUser();

  if (!packagingData) return null;

  const { checks = [], hasWarning, warningTitle, warningDetails } = packagingData;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-slate-100">
            📦 Package Inspector & Physical Condition
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
          Package Condition: Good
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {checks.map((c, idx) => (
          <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">{c.name}</span>
            <span className="font-bold text-slate-200 block text-xs">{c.text}</span>
          </div>
        ))}
      </div>

      {hasWarning && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
          <div className="font-bold flex items-center space-x-1.5 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{warningTitle}</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
            {warningDetails.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
