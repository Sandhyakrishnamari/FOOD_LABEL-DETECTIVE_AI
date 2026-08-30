import React, { useState } from 'react';
import {
  Search, Sparkles, Scale, CheckCircle2, AlertTriangle, ArrowRight,
  ShieldCheck, RefreshCw, FileText, ChevronRight
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { SAMPLE_LABELS } from '../../services/sampleData';

export default function LandingPage({ onStartScanner, onTrySample }) {
  const { language, setLanguage, explainMode, setExplainMode, t } = useUser();
  const isTa = language === 'ta';

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      
      {/* ------------------- HERO SECTION ------------------- */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Subtle Glow Backdrop */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono tracking-wide mb-6">
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span>{isTa ? 'உணவு லேபிள் ஆய்வாளர்' : 'Food Label Detective AI'}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight mb-4">
          See Beyond the <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Label.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 font-medium">
          {isTa 
            ? 'உணவு லேபிளை ஸ்கேன் செய்து உள்ளே உண்மையில் என்ன இருக்கிறது என்பதை உடனடியாக புரிந்து கொள்ளுங்கள்.'
            : 'Scan a food label and instantly understand what’s really inside.'}
        </p>

        {/* Trust Statement */}
        <p className="text-xs sm:text-sm text-amber-400/90 font-mono max-w-xl mx-auto mb-8 bg-slate-900/80 py-1.5 px-4 rounded-full border border-slate-800 inline-block">
          🛡️ {isTa ? 'AI அடிப்படையிலான மூலப்பொருள், ஊட்டச்சத்து மற்றும் விளம்பர உண்மை ஆய்வு.' : 'AI-powered ingredient, nutrition and claim analysis.'}
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <button
            onClick={onStartScanner}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5 cursor-pointer"
          >
            <Search className="w-5 h-5 text-slate-950" />
            <span>{isTa ? 'உணவு லேபிளை ஸ்கேன் செய்க' : 'Scan a Food Label'}</span>
          </button>

          <button
            onClick={() => onTrySample(SAMPLE_LABELS[0])}
            className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isTa ? 'மாதிரி லேபிளை முயற்சிக்கவும்' : 'Try a Sample Label'}</span>
          </button>
        </div>

        {/* ------------------- VISUAL DEMO: PACKAGE FINE PRINT -> VERDICT ------------------- */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* LEFT: Raw Packet Fine Print */}
            <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800/90 space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                📷 {isTa ? 'அச்சிடப்பட்ட லேபிள்' : 'PACKAGE FINE PRINT'}
              </span>
              <h4 className="text-xs font-bold text-slate-200">
                Protein Crunch Bar
              </h4>
              <p className="text-xs text-slate-400 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                Ingredients: Soy Protein Isolate, Maltodextrin, Apple Juice Concentrate, Palm Oil, E211, E102...
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-amber-400 font-mono pt-1">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Reading fine print...</span>
              </div>
            </div>

            {/* CENTER: Detective Transform Arrow */}
            <div className="md:col-span-2 flex justify-center py-2 md:py-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shadow-md">
                ➔
              </div>
            </div>

            {/* RIGHT: Clean Instant Verdict */}
            <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                  {isTa ? 'உடனடி தீர்ப்பு' : 'QUICK VERDICT'}
                </span>
                <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  72 / 100
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center space-x-2 text-slate-200">
                  <span>🟠</span>
                  <span className="font-semibold">Added sugar detected (14g)</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-200">
                  <span>🌾</span>
                  <span className="font-semibold">Refined ingredient detected</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-300">
                  <span>🟢</span>
                  <span className="font-semibold">No major allergen detected</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-850 text-[11px] text-slate-400">
                <strong className="text-slate-300">What to do:</strong> Fine occasionally. Not ideal as a daily snack.
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ------------------- SECTION 2: EXACTLY 3 KEY BENEFITS ------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight mb-3">
            {isTa ? 'முக்கிய நன்மைகள்' : 'Simple by default. Detailed on demand.'}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {isTa 
              ? 'தொழில்நுட்ப சொற்கள் மற்றும் சிக்கலான அட்டவணைகளை எளிய முடிவாக மாற்றுகிறது.'
              : 'Turn complicated packaging jargon and numbers into simple, confident food decisions.'}
          </p>
        </div>

        {/* 3 Core Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* BENEFIT 1: Decode Ingredients */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
              🔎
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isTa ? 'மூலப்பொருட்களை அறிதல்' : 'Decode Ingredients'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTa 
                ? 'தெரியாத இரசாயனங்கள் மற்றும் E-எண்களை எளிய தமிழ் அல்லது ஆங்கிலத்தில் புரிந்து கொள்ளுங்கள்.'
                : 'Understand unfamiliar additives, preservatives, and E-numbers in plain English or Tamil.'}
            </p>
          </div>

          {/* BENEFIT 2: Detect Hidden Sugar */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-2xl">
              🍬
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isTa ? 'மறைக்கப்பட்ட சர்க்கரை கண்டறிதல்' : 'Detect Hidden Sugar'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTa
                ? 'பல்வேறு பெயர்களில் மறைந்திருக்கும் சர்க்கரை மூலங்களை உடனடியாக கண்டறியவும்.'
                : 'Find sugar sources hiding behind different names like maltodextrin, invert syrup, or fruit concentrates.'}
            </p>
          </div>

          {/* BENEFIT 3: Check Claims */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 space-y-3 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
              ⚖️
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {isTa ? 'விளம்பர கூற்று சோதனை' : 'Check Claims'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isTa
                ? 'பாக்கெட்டின் முன் வாக்குறுதியை உண்மையான ஊட்டச்சத்து அட்டவணையுடன் ஒப்பிட்டு சரிபார்க்கவும்.'
                : 'Compare what the package promises (“High Protein”, “Zero Sugar”) with what’s actually inside.'}
            </p>
          </div>

        </div>
      </section>

      {/* ------------------- SECTION 3: TRY A SAMPLE LABEL QUICK PICKER ------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 mb-2 inline-block">
            {isTa ? 'உடனடி சோதனை' : 'Try Interactive Demos'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            {isTa ? 'மாதிரி உணவு லேபிள்களை சோதிக்கவும்' : 'Explore with Sample Food Labels'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tap any sample to see how UnavuLens analyzes ingredients, claims, and nutritional value.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {SAMPLE_LABELS.slice(0, 3).map((sample) => (
            <div
              key={sample.id}
              onClick={() => onTrySample(sample)}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:bg-slate-850 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-2.5">
                  <img
                    src={sample.frontImage}
                    alt={sample.name}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-700 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block truncate">
                      {sample.brand}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 leading-snug truncate">
                      {sample.name}
                    </h4>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {sample.frontClaims.map((claim) => (
                    <span key={claim} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                      {claim}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">{sample.nutrition.calories} kcal</span>
                <span className="text-amber-400 font-bold group-hover:underline flex items-center space-x-1">
                  <span>Analyze Label</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------- SECTION 4: TRUST & ACCESSIBLE DISCLAIMER ------------------- */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-t border-slate-900">
        <div className="space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">
            {isTa ? 'தகவலுக்காக மட்டுமே. அச்சமூட்ட அல்ல.' : 'Built to Inform. Not Frighten.'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            UnavuLens gives balanced, evidence-based context. It is an educational tool to help you understand food labels and does not replace professional medical or clinical dietary advice.
          </p>
        </div>
      </section>

      {/* ------------------- FOOTER ------------------- */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-bold">🔍 UnavuLens AI</span>
            <span>•</span>
            <span>See Beyond the Label.</span>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={onStartScanner} className="hover:text-amber-400 transition-all">Scan</button>
            <button onClick={() => onTrySample(SAMPLE_LABELS[0])} className="hover:text-amber-400 transition-all">Samples</button>
          </div>

          <p>© 2026 UnavuLens AI</p>
        </div>
      </footer>

    </div>
  );
}

