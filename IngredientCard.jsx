import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Volume2, Info } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { speakText } from '../../services/textToSpeech';
import IngredientDetailModal from './IngredientDetailModal';
import EvidenceBadge from '../Trust/EvidenceBadge';

export default function IngredientCard({ ingredient }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language, explainMode } = useUser();
  const isTa = language === 'ta';

  if (!ingredient) return null;

  const {
    name,
    taName,
    eNumber,
    category,
    whatIsIt,
    whyUsed,
    whyInProduct,
    nutritionContribution,
    whoShouldPayAttention,
    shouldIBeConcerned,
    evidenceContext,
    easyExplanationEn,
    easyExplanationTa,
    riskStatus
  } = ingredient;

  const simpleExpl = isTa ? (easyExplanationTa || easyExplanationEn) : (easyExplanationEn || easyExplanationTa);
  const voiceText = `${name}. ${simpleExpl}`;

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-750 transition-all">
        
        {/* Top Title Bar */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              {eNumber && (
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  {eNumber}
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-mono uppercase">{category}</span>
            </div>

            <h4
              onClick={() => setIsModalOpen(true)}
              className="text-base sm:text-lg font-black text-slate-100 mt-1 hover:text-amber-400 cursor-pointer flex items-center space-x-2"
            >
              <span>{name}</span>
              <Info className="w-4 h-4 text-slate-500 hover:text-amber-400" />
            </h4>

            {taName && (
              <p className="text-xs text-amber-300 font-bold font-sans mt-0.5">
                🇮🇳 {taName}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* 🔊 Voice Button */}
            <button
              onClick={() => speakText(voiceText, language)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-all"
              title="🔊 Listen to Voice Explanation"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Easy Mode vs Detailed View */}
        {explainMode === 'easy' ? (
          /* EASY MODE: Structured Simple View */
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">WHAT?</span>
                <span className="text-slate-200 text-xs">{whatIsIt || category}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">WHY?</span>
                <span className="text-slate-200 text-xs">{whyUsed || whyInProduct}</span>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-300 uppercase">🧒 Easy Explanation</span>
                <span className="text-[10px] text-slate-400 font-mono">{isTa ? '🇮🇳 தமிழ்' : '🇬🇧 English'}</span>
              </div>
              <p className="text-slate-100 italic text-xs leading-relaxed">
                “{simpleExpl}”
              </p>
            </div>
          </div>
        ) : (
          /* DETAILED MODE: 8-Part Breakdown */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-400 block mb-1">🧪 What is it?</strong>
              <p className="text-slate-200">{whatIsIt || category}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <strong className="text-slate-400 block mb-1">🎯 Why is it used?</strong>
              <p className="text-slate-200">{whyInProduct || whyUsed}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 sm:col-span-2">
              <strong className="text-amber-400 block mb-1">💪 Does this ingredient provide nutrition?</strong>
              <div className="grid grid-cols-3 gap-2 text-slate-300 font-mono text-[11px]">
                <div>Protein: <span className={nutritionContribution?.protein?.gives ? 'text-emerald-400 font-bold' : 'text-slate-500'}>{nutritionContribution?.protein?.gives ? '✅ Yes' : '❌ No'}</span></div>
                <div>Sugar: <span className={nutritionContribution?.sugar?.gives ? 'text-amber-400 font-bold' : 'text-slate-500'}>{nutritionContribution?.sugar?.gives ? '⚠️ Yes' : '❌ No'}</span></div>
                <div>Fat: <span className={nutritionContribution?.fat?.gives ? 'text-amber-400 font-bold' : 'text-slate-500'}>{nutritionContribution?.fat?.gives ? '⚠️ Yes' : '❌ No'}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Evidence Traceability */}
        <EvidenceBadge sourceSlot="Ingredients Photo" textSnippet={name} confidence={96} />

        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-3 border-t border-slate-800 text-xs space-y-2 text-slate-300 animate-fade-in">
            <div><strong className="text-amber-400">👤 Who should pay attention?</strong> {whoShouldPayAttention || 'People monitoring overall processed food intake.'}</div>
            <div><strong className="text-amber-400">⚠️ Scientific Context:</strong> {shouldIBeConcerned || evidenceContext || 'Its presence alone does not mean the food is unsafe. Context and amount matter.'}</div>
          </div>
        )}

      </div>

      {/* Ingredient Learning Modal */}
      {isModalOpen && (
        <IngredientDetailModal
          ingredient={ingredient}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
