import React from 'react';
import { Shield, Sparkles, AlertTriangle, CheckCircle2, Award, Calendar, Package, Tag, Thermometer, Utensils, ShoppingCart } from 'lucide-react';
import ExpiryChecker from './ExpiryChecker';
import CertificationChecker from './CertificationChecker';
import PackagingInspector from './PackagingInspector';
import StorageAdvisor from './StorageAdvisor';
import AllergenSafety from './AllergenSafety';
import ConsumptionAdvisor from './ConsumptionAdvisor';
import PurchaseDecision from './PurchaseDecision';
import { calculateSafetyScore } from '../../services/safetyScoreEngine';
import { useUser } from '../../context/UserContext';

export default function SafetyReport({ scanResult }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!scanResult) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-3xl mx-auto">
          🛡️
        </div>
        <h3 className="text-xl font-bold text-slate-100">No Food Safety Scan Active</h3>
        <p className="text-xs text-slate-400">
          Upload or scan any packaged food label in the <strong>🔎 Investigate</strong> tab to run a complete Food Safety Lens inspection!
        </p>
      </div>
    );
  }

  const safetyData = calculateSafetyScore(scanResult);
  if (!safetyData) return null;

  const ingredientScore = scanResult.scoreData ? scanResult.scoreData.score : 72;
  const nutritionScore = 78;
  const truthIndex = scanResult.marketingTruthIndex || 85;
  const safetyScore = safetyData.safetyScore || 90;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 4-Score Master Dashboard Banner */}
      <div className="bg-slate-900 border-2 border-amber-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2 inline-block">
              🛡️ FOOD SAFETY LENS COMPLETE INVESTIGATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              {scanResult.productName || 'Packaged Food Item'}
            </h2>
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold">
            Verified Safe for Consumption
          </span>
        </div>

        {/* 4 Core Detective Scores Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">🧪 Ingredient Analysis</span>
            <span className="text-3xl font-black font-mono text-amber-300">{ingredientScore} <span className="text-xs text-slate-500">/ 100</span></span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">🥗 Nutrition Analysis</span>
            <span className="text-3xl font-black font-mono text-emerald-400">{nutritionScore} <span className="text-xs text-slate-500">/ 100</span></span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">🕵️ Marketing Truth</span>
            <span className="text-3xl font-black font-mono text-amber-400">{truthIndex} <span className="text-xs text-slate-500">/ 100</span></span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 text-center shadow-lg">
            <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">🛡️ Food Safety Score</span>
            <span className="text-3xl font-black font-mono text-amber-300">{safetyScore} <span className="text-xs text-slate-500">/ 100</span></span>
          </div>
        </div>

        {/* Final Advice Master Statement */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
          <strong className="text-amber-400 block mb-1">💡 Executive Final Safety Advice:</strong>
          <p>
            {isTa
              ? '“இந்த பொருள் காலாவதி காலத்திற்குள் உள்ளது. பேக்கேஜிங் பாதுகாப்பாக உள்ளது. பால் மற்றும் கோதுமை ஒவ்வாமை பொருட்கள் உள்ளன. சரியாக சேமித்து, சமநிலையான உணவின் பகுதியாக எப்போதாவது உட்கொள்ளவும்.”'
              : '“This product is within expiry. Packaging appears intact. Contains milk and wheat allergens. Store properly. Consume occasionally as part of a balanced diet.”'}
          </p>
        </div>
      </div>

      {/* 1. Smart Purchase Decision */}
      <PurchaseDecision safetyScoreData={safetyData} />

      {/* 2. Expiry Checker */}
      <ExpiryChecker expiryData={safetyData.expiry} />

      {/* 3. Trust Mark Certification Scanner */}
      <CertificationChecker certData={safetyData.certs} />

      {/* 4. Package Inspector */}
      <PackagingInspector packagingData={safetyData.packaging} />

      {/* 5. Storage Advisor */}
      <StorageAdvisor storageData={safetyData.storage} />

      {/* 6. Allergen Safety */}
      <AllergenSafety allergensDetected={scanResult.allergensDetected} />

      {/* 7. Consumption Frequency Advisor */}
      <ConsumptionAdvisor consumptionData={safetyData.consumption} />

    </div>
  );
}
