import React from 'react';
import { AlertOctagon, ShieldAlert } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function AllergenSafety({ allergensDetected = [] }) {
  const { language } = useUser();

  if (!allergensDetected || allergensDetected.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertOctagon className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-extrabold text-slate-100">
            ⚠️ Allergen Safety Scanner
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
          🟢 No Major Allergens Detected
        </span>
      </div>
    );
  }

  return (
    <div className="bg-purple-950/30 border-2 border-purple-500/40 p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-purple-500/30">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-extrabold text-slate-100">
            ⚠️ Allergen Alert ({allergensDetected.length} Detected)
          </h3>
        </div>
        <span className="text-xs font-mono text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/30 font-bold">
          🔴 High Priority Warning
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allergensDetected.map((item, idx) => (
          <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="text-sm font-extrabold text-purple-200">{item.name} Detected</h4>
                <p className="text-[10px] text-slate-400">Biological allergen trigger</p>
              </div>
            </div>

            <div className="text-xs space-y-1 pt-2 border-t border-slate-900">
              <div><strong className="text-slate-400">Found in:</strong> <span className="text-amber-300 font-mono">{item.triggers ? item.triggers.join(', ') : item.name}</span></div>
              <div><strong className="text-slate-400">Why flagged:</strong> <span className="text-slate-300">{item.description}</span></div>
              <div><strong className="text-slate-400">Who should pay attention:</strong> <span className="text-rose-300 font-semibold">{item.affectedGroup}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
