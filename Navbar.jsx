import React, { useState } from 'react';
import { Search, Scale, History, Settings, Home, X, Menu, Shield, Sparkles, ChevronDown } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings }) {
  const { userGoals, savedScans, comparisonBuffer, language, setLanguage, explainMode, setExplainMode, t } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isTa = language === 'ta';

  const activeGoalCount = Object.entries(userGoals || {}).filter(([k, v]) => {
    if (k === 'allergensAvoided') return Array.isArray(v) && v.length > 0;
    return v === true;
  }).length;

  return (
    <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50 h-20 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* LEFT: UnavuLens AI Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0"
            onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-2xl shadow-lg shadow-amber-500/5 group-hover:scale-105 transition-all">
              🔍
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-100">
                  UnavuLens <span className="text-amber-400">AI</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                  உணவுLens
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {isTa ? 'லேபிளுக்கு அப்பால் பாருங்கள்' : 'See Beyond the Label.'}
              </span>
            </div>
          </div>

          {/* CENTER: Main Navigation: Home | Scan | My Scans | Compare */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('landing')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'landing'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{isTa ? 'முகப்பு' : 'Home'}</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'scanner'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isTa ? 'ஸ்கேன்' : 'Scan'}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`relative flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>{isTa ? 'என் ஸ்கேன்கள்' : 'My Scans'}</span>
              {savedScans && savedScans.length > 0 && (
                <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  activeTab === 'history' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {savedScans.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`relative flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'comparison'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>{isTa ? 'ஒப்பீடு' : 'Compare'}</span>
              {comparisonBuffer && comparisonBuffer.length > 0 && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full font-black">
                  {comparisonBuffer.length}
                </span>
              )}
            </button>
          </nav>

          {/* RIGHT: Controls (Language + Easy/Detailed + Settings + Scan Food CTA) */}
          <div className="hidden lg:flex items-center space-x-2.5">
            
            {/* Language Switcher: தமிழ் / EN */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  language === 'en' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <span className="text-slate-700 px-0.5 font-mono">/</span>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  language === 'ta' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Mode Switcher: Easy / Detailed */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setExplainMode('easy')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                  explainMode === 'easy' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Simple by default: Shows key verdict and plain explanations"
              >
                <span>🧒</span>
                <span>{isTa ? 'எளிய' : 'Easy'}</span>
              </button>
              <span className="text-slate-700 px-0.5 font-mono">/</span>
              <button
                onClick={() => setExplainMode('normal')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                  explainMode === 'normal' ? 'bg-slate-800 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Detailed on demand: Exposes complete chemistry, calculations & evidence"
              >
                <span>🔬</span>
                <span>{isTa ? 'விவரமான' : 'Detailed'}</span>
              </button>
            </div>

            {/* Profile Settings Icon */}
            <button
              onClick={onOpenSettings}
              className="relative w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center justify-center transition-all group"
              title="Health Goals & Settings"
            >
              <Settings className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-all" />
              {activeGoalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 rounded-full font-black text-[9px] flex items-center justify-center">
                  {activeGoalCount}
                </span>
              )}
            </button>

            {/* Primary Action Button: Scan Food */}
            <button
              onClick={() => setActiveTab('scanner')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center space-x-1.5 flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isTa ? 'உணவை ஸ்கேன் செய்' : 'Scan Food'}</span>
            </button>

          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 flex items-center justify-center"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-slate-950/98 border-b border-slate-800 p-4 space-y-4 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl font-bold text-xs flex items-center space-x-2 ${
                activeTab === 'landing' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button
              onClick={() => { setActiveTab('scanner'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl font-bold text-xs flex items-center space-x-2 ${
                activeTab === 'scanner' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Scan Food</span>
            </button>
            <button
              onClick={() => { setActiveTab('history'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl font-bold text-xs flex items-center space-x-2 ${
                activeTab === 'history' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
              }`}
            >
              <History className="w-4 h-4" />
              <span>My Scans ({savedScans?.length || 0})</span>
            </button>
            <button
              onClick={() => { setActiveTab('comparison'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl font-bold text-xs flex items-center space-x-2 ${
                activeTab === 'comparison' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-200'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>Compare</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-850">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Language:</span>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded font-bold ${language === 'en' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ta')}
                  className={`px-2.5 py-1 rounded font-bold ${language === 'ta' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  தமிழ்
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Mode:</span>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setExplainMode('easy')}
                  className={`px-2.5 py-1 rounded font-bold ${explainMode === 'easy' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Easy
                </button>
                <button
                  onClick={() => setExplainMode('normal')}
                  className={`px-2.5 py-1 rounded font-bold ${explainMode === 'normal' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'}`}
                >
                  Detailed
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => { setActiveTab('scanner'); setMobileMenuOpen(false); }}
            className="w-full py-3 bg-amber-500 text-slate-950 font-black rounded-xl text-center text-xs shadow-lg flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Scan Food Label Now</span>
          </button>

        </div>
      )}
    </header>
  );
}
