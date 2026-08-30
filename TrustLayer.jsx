import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TrustLayer() {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center space-y-4 max-w-4xl mx-auto my-8">
      <div className="flex items-center justify-center space-x-2 text-amber-400">
        <ShieldCheck className="w-5 h-5" />
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">
          How UnavuLens Decides — Transparent Intelligence
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Scientific Food Databases</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>ICMR-NIN & FSSAI Guidelines</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Peer-Reviewed Literature</span>
        </div>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Transparent Reasoning Math</span>
        </div>
      </div>

      <p className="text-xs text-amber-300 font-bold italic">
        “We explain. You decide.”
      </p>
    </div>
  );
}
