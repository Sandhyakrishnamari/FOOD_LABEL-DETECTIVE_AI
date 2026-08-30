import React, { useState } from 'react';
import { Activity, ShieldCheck, Heart, User, Sparkles } from 'lucide-react';
import { calculatePersonaScore } from '../../services/personaEngine';
import { useUser } from '../../context/UserContext';

export default function PersonaSwitchVerdict({ scanResult }) {
  const { language } = useUser();
  const [selectedPersona, setSelectedPersona] = useState('general');

  if (!scanResult) return null;

  const personas = [
    { id: 'general', label: '🛡️ General Health', desc: 'Standard ICMR/FDA health score' },
    { id: 'diabetic', label: '🩺 Diabetic', desc: 'Penalizes high-GI sugars & maltodextrin' },
    { id: 'pcos', label: '🥚 PCOS', desc: 'Flags insulin spikes, dairy & seed oils' },
    { id: 'hypertension', label: '🫀 High BP / Heart', desc: 'Strict sodium & phosphate limits' },
    { id: 'kidFriendly', label: '👶 Kid-Friendly', desc: 'Flags artificial dyes, BHA/BHT & MSG' },
    { id: 'fitness', label: '🏋️ Fitness / Muscle', desc: 'Rewards protein density & low sugar' }
  ];

  const personaResult = calculatePersonaScore(scanResult, selectedPersona);

  return (
    <div className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 shadow-2xl mb-8 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
              🔥 KILLER FEATURE
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Persona-Switch Verdict Engine
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span>Select Health Profile to Re-Score Live</span>
          </h3>
        </div>

        <span className="text-xs text-slate-400">
          Watch indicators & score recalculate live per health condition
        </span>
      </div>

      {/* Persona Chips Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {personas.map((p) => {
          const isActive = selectedPersona === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPersona(p.id)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg scale-105'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <span>{p.label}</span>
              <span className={`text-[9px] font-normal block mt-1 ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                {p.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Persona Verdict Output Panel */}
      {personaResult && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase text-slate-400">Active Profile:</span>
              <span className="text-xs font-black text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 uppercase">
                {personas.find(p => p.id === selectedPersona)?.label}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400">Persona Score:</span>
              <span className="text-2xl font-black font-mono text-amber-300">
                {personaResult.score} <span className="text-xs text-slate-500">/ 100</span>
              </span>
            </div>
          </div>

          {/* Flags & Good Points Output */}
          <div className="space-y-2 text-xs">
            {personaResult.flags.map((flag, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium">
                {flag}
              </div>
            ))}

            {personaResult.good.map((good, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-medium">
                {good}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
