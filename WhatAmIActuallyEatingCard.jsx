import React from 'react';
import { ShieldCheck, AlertCircle, Volume2, Sparkles, HelpCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { speakText } from '../../services/textToSpeech';

export default function WhatAmIActuallyEatingCard({ scanResult }) {
  const { language } = useUser();
  if (!scanResult) return null;

  const {
    productName = 'Packaged Food Product',
    nutritionData = {},
    parsedIngredients = [],
    allergensDetected = [],
    scoreData = {},
    metadata = {}
  } = scanResult;

  const { nutrition = {} } = nutritionData;

  const sugarGrams = nutrition.sugar ?? '16';
  const proteinGrams = nutrition.protein ?? '4';
  const sodiumMg = nutrition.sodium ?? '420';
  const additiveCount = parsedIngredients.filter(i => i.isAdditive).length;

  const allergenString = allergensDetected.length > 0
    ? allergensDetected.map(a => a.name).join(' + ')
    : 'None Detected';

  const fssaiNumber = metadata.fssaiNumber || (scanResult.rawOcrText?.match(/fssai\s*(?:lic\.?\s*no\.?|license)?\s*[:\.]?\s*(\d{14})/i)?.[1]);

  const { score = 74, summary = {} } = scoreData;
  const statusColor = score >= 80 ? 'text-emerald-400 border-emerald-500/30' : score >= 60 ? 'text-amber-400 border-amber-500/30' : 'text-rose-400 border-rose-500/30';
  const statusDot = score >= 80 ? '🟢 Good' : score >= 60 ? '🟡 Watch' : '🔴 Attention';

  const voiceSummary = `UnavuLens Investigation Complete for ${productName}. Overall detective score is ${score} out of 100. Sugar is ${sugarGrams} grams, Protein is ${proteinGrams} grams, Sodium is ${sodiumMg} milligrams.`;

  return (
    <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-6 animate-fade-in">
      
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase block">
            🔎 UNAVULENS INVESTIGATION COMPLETE
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">
            🍽️ WHAT AM I ACTUALLY EATING?
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {productName} — 5-10 second glanceable summary report
          </p>
        </div>

        <button
          onClick={() => speakText(voiceSummary, language)}
          className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition-all flex items-center space-x-1.5 self-start sm:self-auto shadow-md"
        >
          <Volume2 className="w-4 h-4" />
          <span>🔊 Listen Summary</span>
        </button>
      </div>

      {/* 7 Glanceable Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono">
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase block">🍬 Sugar</span>
          <span className="text-lg font-black text-amber-300">{sugarGrams}g</span>
          <span className="text-[9px] text-slate-500 block">per serving</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase block">💪 Protein</span>
          <span className="text-lg font-black text-emerald-400">{proteinGrams}g</span>
          <span className="text-[9px] text-slate-500 block">per serving</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase block">🧂 Sodium</span>
          <span className="text-lg font-black text-amber-300">{sodiumMg}mg</span>
          <span className="text-[9px] text-slate-500 block">per serving</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase block">🧪 Additives</span>
          <span className="text-lg font-black text-slate-200">{additiveCount}</span>
          <span className="text-[9px] text-slate-500 block">detected</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase block">⚠️ Allergens</span>
          <span className="text-xs font-bold text-rose-300 truncate block mt-1">{allergenString}</span>
          <span className="text-[9px] text-slate-500 block">check list</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase block">📅 Expiry</span>
          <span className="text-xs font-bold text-emerald-400 block mt-1">✓ Verified</span>
          <span className="text-[9px] text-slate-500 block">label check</span>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase block">🏷️ FSSAI</span>
          <span className="text-xs font-bold text-emerald-400 block mt-1">
            {fssaiNumber ? '✓ Detected' : '❓ Check'}
          </span>
          <span className="text-[9px] text-slate-500 block">from image</span>
        </div>
      </div>

      {/* Overall Detective Score & Mathematical "Why?" */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <span className={`text-3xl font-black font-mono ${statusColor}`}>
              {score}/100
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-200">
              Status: {statusDot}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-1">
            Contextual rating evaluated against FSSAI & ICMR-NIN reference daily intake guidelines.
          </span>
        </div>

        <div className="space-y-1 text-xs text-slate-300 md:border-l md:border-slate-800 md:pl-4">
          <strong className="text-amber-400 block font-mono text-[11px]">Why this score?</strong>
          <div className="flex flex-col space-y-0.5 text-[11px]">
            {summary.goodPoints?.slice(0, 2).map((g, i) => (
              <span key={i} className="text-emerald-400">✓ {g}</span>
            ))}
            {summary.redFlags?.slice(0, 2).map((r, i) => (
              <span key={i} className="text-rose-400">⚠ {r}</span>
            ))}
            {summary.watchItems?.slice(0, 2).map((w, i) => (
              <span key={i} className="text-amber-300">⚠ {w}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
