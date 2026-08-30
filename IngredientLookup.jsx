import React, { useState } from 'react';
import { Search, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { ADDITIVES_DATABASE } from '../../data/additives';
import { speakText } from '../../services/textToSpeech';
import { useUser } from '../../context/UserContext';

export default function IngredientLookup() {
  const { language } = useUser();
  const isTa = language === 'ta';

  const [query, setQuery] = useState('Sodium Benzoate');

  const filtered = ADDITIVES_DATABASE.filter(a => 
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    (a.eNumber && a.eNumber.toLowerCase().includes(query.toLowerCase())) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const activeAdditive = filtered[0] || ADDITIVES_DATABASE[0];

  const voiceText = `${activeAdditive.name}. ${isTa ? activeAdditive.simpleExplanationTa : activeAdditive.simpleExplanationEn}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-2xl mx-auto">
          🧪
        </div>
        <h2 className="text-2xl font-black text-slate-100">
          Ingredient Lens — Search Any Chemical Additive
        </h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Don't have a product packet nearby? Type any food additive or E-number to investigate what it is and why manufacturers use it.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Sodium Benzoate, E211, Maltodextrin, Tartrazine..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Result Card */}
      {activeAdditive && (
        <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400">{activeAdditive.eNumber || 'FOOD ADDITIVE'}</span>
              <h3 className="text-2xl font-black text-slate-100 mt-0.5">{activeAdditive.name}</h3>
              <p className="text-xs font-semibold text-amber-300 mt-0.5 font-sans">🇮🇳 {activeAdditive.nameTa || activeAdditive.name}</p>
            </div>

            <button
              onClick={() => speakText(voiceText, language)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-400 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span>🔊 Explain Aloud</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <strong className="text-slate-400 block mb-1">🧪 What is it?</strong>
              <p className="text-slate-200">{activeAdditive.category} — {activeAdditive.function}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <strong className="text-slate-400 block mb-1">🎯 Why is it used?</strong>
              <p className="text-slate-200">{activeAdditive.function}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 sm:col-span-2">
              <strong className="text-amber-400 block mb-1">⚡ Does it provide nutrition?</strong>
              <div className="grid grid-cols-3 gap-2 text-slate-300 font-mono text-[11px]">
                <div>Protein: <span className="text-slate-500">❌ No</span></div>
                <div>Sugar: <span className="text-slate-500">❌ No</span></div>
                <div>Fat: <span className="text-slate-500">❌ No</span></div>
              </div>
            </div>
          </div>

          {/* Easy Explanation Box */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl space-y-2">
            <span className="text-xs font-bold text-amber-300 uppercase block">🧒 Easy Explanation</span>
            <p className="text-slate-100 italic text-sm leading-relaxed">
              “{isTa ? activeAdditive.simpleExplanationTa : activeAdditive.simpleExplanationEn}”
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
