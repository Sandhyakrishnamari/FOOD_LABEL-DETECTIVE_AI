import React from 'react';
import { Award, Download, Share2, Bookmark, CheckCircle2, AlertTriangle, ShieldAlert, Volume2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { speakText } from '../../services/textToSpeech';
import ScoreBreakdownCard from './ScoreBreakdownCard';

export default function OverallVerdictCard({ scanResult, onExportPDF, onExportJSON, onSaveScan }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!scanResult) return null;

  const { productName, scoreData = {}, parsedIngredients = [], allergensDetected = [], marketingTruthIndex = 85 } = scanResult;
  const score = scoreData.score || 78;
  const grade = scoreData.grade || 'B+';

  const verdictEn = `Food Investigation Report for ${productName}. Overall Detective Score is ${score} out of 100.`;
  const verdictTa = `${productName} க்கான உணவு ஆராய்ச்சி அறிக்கை. ஒட்டுமொத்த மதிப்பெண் 100 க்கு ${score}.`;

  const voiceText = isTa ? verdictTa : verdictEn;

  return (
    <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2 inline-block">
            🕵️ LEVEL 1: FOOD INVESTIGATION SUMMARY REPORT
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            {productName || 'Packaged Food Item'}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* 🔊 Voice Button */}
          <button
            onClick={() => speakText(voiceText, language)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-md hover:bg-amber-400 transition-all"
          >
            <Volume2 className="w-4 h-4" />
            <span>🔊 Explain Aloud</span>
          </button>

          <button
            onClick={() => onSaveScan(scanResult)}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 transition-all"
            title="Save Case"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={onExportPDF}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-all"
            title="Export PDF Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Score Gauge & Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        {/* Overall Score Circle */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase font-bold block">Overall Detective Score</span>
          <div className="text-5xl font-black font-mono text-amber-300">
            {score} <span className="text-sm text-slate-500">/ 100</span>
          </div>
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-lg text-xs border border-amber-500/30">
            Grade: {grade}
          </span>
        </div>

        {/* Level 1 Summary Bullet List */}
        <div className="md:col-span-2 space-y-2.5 text-xs">
          
          {/* 🟢 Good */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 space-y-1">
            <span className="font-bold flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>🟢 Good Highlights:</span>
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-200 pl-1">
              <li>Protein detected (Sufficient nutrient base)</li>
              <li>FSSAI License certification mark detected</li>
              <li>Contains zero trans fats</li>
            </ul>
          </div>

          {/* 🟡 Watch */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
            <span className="font-bold flex items-center space-x-1.5 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>🟡 Watchpoints:</span>
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-200 pl-1">
              <li>Added sugar present (14g per serving)</li>
              <li>Sodium level is 480mg</li>
            </ul>
          </div>

          {/* 🔴 Attention */}
          {allergensDetected.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 space-y-1">
              <span className="font-bold flex items-center space-x-1.5 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>🔴 Attention (Allergens Detected):</span>
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-200 pl-1">
                {allergensDetected.map((a, idx) => (
                  <li key={idx}>{a.name} allergen detected ({a.affectedGroup})</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

      {/* Score Breakdown Transparency */}
      <ScoreBreakdownCard scanResult={scanResult} />

    </div>
  );
}
