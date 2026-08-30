import React, { useState } from 'react';
import { X, Target, Shield, Check, Settings as SettingsIcon, Key, Globe, Eye } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ALLERGENS_DATABASE } from '../data/allergens';

export default function UserProfileModal({ isOpen, onClose }) {
  const { userGoals, toggleGoal, toggleAvoidedAllergen, apiKey, setApiKey, language, setLanguage, explainMode, setExplainMode } = useUser();
  const [activeTab, setActiveTab] = useState('goals'); // goals, allergens, api
  const [keyInput, setKeyInput] = useState(apiKey);

  if (!isOpen) return null;

  const goalProfiles = [
    { key: 'lowSugar', label: '🚫 Low Sugar / Sugar Reduction', desc: 'Penalizes products with >8g sugar or added liquid corn syrups.' },
    { key: 'highProtein', label: '💪 High Protein / Fitness', desc: 'Prioritizes products with >= 10g protein and high protein calorie density.' },
    { key: 'vegan', label: '🌱 Vegan', desc: 'Flags any animal-derived ingredients (dairy, whey, gelatin, honey, eggs).' },
    { key: 'vegetarian', label: '🌿 Vegetarian', desc: 'Flags animal slaughter byproducts (gelatin, carmine dye, rennet).' },
    { key: 'glutenFree', label: '🌾 Gluten-Free', desc: 'Flags wheat, barley, rye, spelt, and malt derivatives.' },
    { key: 'keto', label: '🥑 Keto / Low Carb', desc: 'Flags net carbs > 5g and high-GI carbohydrate additives (maltodextrin, starch).' },
    { key: 'heartHealthy', label: '❤️ Heart Healthy', desc: 'Enforces strict limits on saturated fat, trans fats, and high sodium (>300mg).' },
    { key: 'kidsFocused', label: '👶 Kids Safe', desc: 'Flags synthetic azo dyes (Red 40, Yellow 5), BHA/BHT preservatives, and MSG.' }
  ];

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    setApiKey(keyInput.trim());
    alert('API Key updated successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              ⚙️ Settings & UnavuLens AI Preferences
            </h3>
            <p className="text-xs text-slate-400">
              Configure health profiles, allergen filters, language, and Gemini Vision AI key.
            </p>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'goals' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Health Goals</span>
          </button>

          <button
            onClick={() => setActiveTab('allergens')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'allergens' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Allergen Avoidance</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-1.5 ${
              activeTab === 'api' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Gemini AI Key</span>
          </button>
        </div>

        {/* TAB 1: HEALTH GOALS */}
        {activeTab === 'goals' && (
          <div className="mb-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              🎯 Primary Dietary Goals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goalProfiles.map((goal) => {
                const isActive = userGoals[goal.key];
                return (
                  <div
                    key={goal.key}
                    onClick={() => toggleGoal(goal.key)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/50 text-slate-100'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${
                      isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 border border-slate-700'
                    }`}>
                      {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{goal.label}</div>
                      <div className="text-[11px] text-slate-400 leading-snug mt-0.5">{goal.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ALLERGEN FILTERS */}
        {activeTab === 'allergens' && (
          <div className="mb-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center space-x-1">
              <Shield className="w-4 h-4" />
              <span>⚠️ Personal Allergen Filters (Highlight & Heavy Penalty)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALLERGENS_DATABASE.map((allergen) => {
                const isAvoided = (userGoals.allergensAvoided || []).includes(allergen.id);
                return (
                  <button
                    key={allergen.id}
                    type="button"
                    onClick={() => toggleAvoidedAllergen(allergen.id)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 transition-all ${
                      isAvoided
                        ? 'bg-purple-500/20 text-purple-200 border-purple-500/50'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <span>{allergen.icon}</span>
                    <span className="truncate">{allergen.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: GEMINI AI API KEY */}
        {activeTab === 'api' && (
          <form onSubmit={handleSaveApiKey} className="mb-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center space-x-1">
              <Key className="w-4 h-4" />
              <span>Google Gemini Vision API Key (Optional)</span>
            </h4>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Enter Gemini API Key</label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                💡 <strong>Offline Mode Default</strong>: If no API key is set, UnavuLens AI uses high-resolution canvas preprocessing and offline Tesseract OCR.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400"
              >
                Save Key
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => { setApiKey(''); setKeyInput(''); }}
                  className="px-4 py-2 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl hover:bg-rose-500/30"
                >
                  Remove Key
                </button>
              )}
            </div>
          </form>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-all"
        >
          Save & Apply Settings
        </button>

      </div>
    </div>
  );
}
