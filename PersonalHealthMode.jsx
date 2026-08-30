import React from 'react';
import { User, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const HEALTH_PERSONAS = [
  { id: 'general', label: 'General', icon: '👤', desc: 'Standard adult RDA benchmarks' },
  { id: 'diabetic', label: 'Diabetes', icon: '🩸', desc: 'Glycemic index & fast-absorbing sugar sensitivity' },
  { id: 'hypertension', label: 'Heart Health', icon: '💗', desc: 'Sodium, saturated fat & arterial pressure limits' },
  { id: 'kidFriendly', label: 'Kids', icon: '👶', desc: 'Synthetic food dyes, artificial sweeteners & additives' },
  { id: 'fitness', label: 'Fitness', icon: '🏋️', desc: 'High protein density & sugar-to-protein ratio' }
];

export default function PersonalHealthMode({
  scanResult,
  selectedPersona,
  onSelectPersona,
  personaResult
}) {
  if (!scanResult) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5 transition-all">
      {/* Header & Descriptor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 flex items-center space-x-1.5">
              <span>ANALYZE FOR YOUR HEALTH PROFILE</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-normal">
              The same food produces a different verdict based on your personal health needs.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 self-start sm:self-center font-bold">
          ⚡ Dynamic Live Re-score
        </span>
      </div>

      {/* 5 Prominent Profile Pill Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {HEALTH_PERSONAS.map((p) => {
          const isActive = selectedPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPersona(p.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-0.5 border text-center ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-black ring-2 ring-amber-500/30 scale-[1.02]'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
              }`}
            >
              <span className="text-base">{p.icon}</span>
              <span className="tracking-tight">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Active Impact Notice */}
      {personaResult && (
        <div className={`p-3 rounded-xl text-xs border transition-all flex items-start space-x-2.5 ${
          personaResult.flags.length > 0
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
        }`}>
          {personaResult.flags.length > 0 ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <div className="font-bold text-[11px] uppercase font-mono">
              {personaResult.flags.length > 0
                ? `⚠️ Specific Considerations for ${HEALTH_PERSONAS.find(p => p.id === selectedPersona)?.label}:`
                : `🟢 Favorable Match for ${HEALTH_PERSONAS.find(p => p.id === selectedPersona)?.label}:`}
            </div>

            {personaResult.flags.length > 0 ? (
              <div className="space-y-0.5">
                {personaResult.flags.map((f, i) => (
                  <p key={i} className="text-slate-200 text-[11px] leading-relaxed">
                    {f}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-slate-200 text-[11px] leading-relaxed">
                {personaResult.good?.[0] || 'This product complies with standard guidelines for this profile.'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
