import React, { useState } from 'react';
import { X, Volume2, BookOpen, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { speakText } from '../../services/textToSpeech';

export default function IngredientDetailModal({ ingredient, onClose }) {
  const { language } = useUser();
  const isTa = language === 'ta';
  const [showScientific, setShowScientific] = useState(false);

  if (!ingredient) return null;

  const {
    name,
    technicalName,
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
    riskStatus,
    concernLevel
  } = ingredient;

  const resolvedConcern = concernLevel === 'high' || riskStatus === 'flag'
    ? { level: 'High Concern', badge: '🔴 High', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' }
    : concernLevel === 'moderate' || riskStatus === 'watch'
    ? { level: 'Moderate Concern', badge: '🟠 Moderate', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' }
    : { level: 'Generally Okay', badge: '🟢 Generally Okay', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };

  // Plain language why-it-matters explanation
  const whyItMatters = isTa && easyExplanationTa
    ? easyExplanationTa
    : shouldIBeConcerned || easyExplanationEn ||
      (resolvedConcern.level.includes('High')
        ? 'Excessive consumption of this ingredient can contribute to metabolic strain, digestive disruption, or unnecessary additives.'
        : resolvedConcern.level.includes('Moderate')
        ? 'Safe in regulated quantities, but contributes to overall daily processed food intake.'
        : 'Commonly recognized as safe with standard nutritional or functional purpose.');

  const whyUsedText = whyUsed || whyInProduct || category || 'Functional ingredient used for texture, shelf-life, or taste.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ingredient Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase border ${resolvedConcern.color}`}>
              {resolvedConcern.badge}
            </span>
            {eNumber && (
              <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {eNumber}
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-slate-100">
            {name}
          </h3>
          {technicalName && (
            <p className="text-[11px] text-slate-400 italic">Scientific name: {technicalName}</p>
          )}
        </div>

        {/* 3 Clear Consumer Cards (Why is it used? Concern? Why it matters?) */}
        <div className="space-y-3 text-xs">
          
          {/* Card 1: Why is it used? */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono block">
              💡 Why is it used?
            </span>
            <p className="text-slate-200 font-medium">
              {whyUsedText}
            </p>
          </div>

          {/* Card 2: Concern Level */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              ⚠️ Concern Level:
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${resolvedConcern.color}`}>
              {resolvedConcern.level}
            </span>
          </div>

          {/* Card 3: Why it matters */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono block">
              🔍 Why it matters:
            </span>
            <p className="text-slate-200 leading-relaxed">
              {whyItMatters}
            </p>
          </div>

          {/* Optional Scientific Context Accordion */}
          <div className="pt-1">
            <button
              onClick={() => setShowScientific(!showScientific)}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] font-mono transition-all flex items-center justify-between"
            >
              <span>🔬 Scientific Context & Evidence</span>
              {showScientific ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showScientific && (
              <div className="mt-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5 animate-fade-in font-mono">
                <p>
                  {evidenceContext || 'Evaluated in accordance with FSSAI, Codex Alimentarius, and EFSA acceptable daily intake standards.'}
                </p>
                {whoShouldPayAttention && (
                  <p className="text-amber-300">
                    Target groups: {whoShouldPayAttention}
                  </p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
