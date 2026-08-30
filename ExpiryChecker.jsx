import React from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function ExpiryChecker({ expiryData }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!expiryData) return null;

  const { mfgDate, expiryDate, daysRemaining, isExpired, statusTextEn, statusTextTa } = expiryData;

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      isExpired ? 'bg-rose-950/40 border-rose-500/50' : 'bg-slate-900 border-slate-800'
    }`}>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-slate-100">
            📅 Freshness Check & Expiry Investigation
          </h3>
        </div>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
          isExpired ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
        }`}>
          {isTa ? statusTextTa : statusTextEn}
        </span>
      </div>

      {isExpired ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs space-y-2">
          <div className="font-black text-sm flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>🚨 Expired Product Warning</span>
          </div>
          <p>This product has crossed its expiry date ({expiryDate}). Avoid purchasing or consuming.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">Manufactured Date</span>
            <strong className="text-slate-200 font-mono text-sm">{mfgDate}</strong>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">Best Before / Expiry</span>
            <strong className="text-amber-300 font-mono text-sm">{expiryDate}</strong>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">Status</span>
            <strong className="text-emerald-400 font-mono text-xs block mt-0.5">🟢 Fresh & Valid</strong>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block font-mono">Remaining Shelf Life</span>
            <strong className="text-emerald-400 font-mono text-sm">{daysRemaining} Days</strong>
          </div>
        </div>
      )}
    </div>
  );
}
