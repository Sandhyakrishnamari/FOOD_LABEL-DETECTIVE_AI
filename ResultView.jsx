import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Scale,
  ShoppingBag,
  TestTube,
  Salad,
  Search,
  Shield,
  Lightbulb,
  FileText,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { calculatePersonaScore } from '../../services/personaEngine';

import SimpleResultCard from './SimpleResultCard';
import WhyThisRatingCard from './WhyThisRatingCard';
import PersonalHealthMode from './PersonalHealthMode';
import HiddenSugarDetective from './HiddenSugarDetective';
import WhatShouldIDo from './WhatShouldIDo';
import AskUnavuLens from './AskUnavuLens';
import MarketingClaimCheck from '../MarketingBuster/MarketingClaimCheck';
import IngredientHighlightView from '../IngredientDetective/IngredientHighlightView';
import IngredientDetective from '../IngredientDetective/IngredientDetective';
import IngredientAliasDetector from '../IngredientDetective/IngredientAliasDetector';
import NutritionAnalysis from '../NutritionAnalysis/NutritionAnalysis';
import PortionCalculator from '../NutritionAnalysis/PortionCalculator';
import BetterChoices from '../Swaps/BetterChoices';
import HealthierSwapEngine from '../Swaps/HealthierSwapEngine';
import IndianLabelBadges from '../FoodSafetyLens/IndianLabelBadges';
import AllergenAlertBanner from '../Allergens/AllergenAlertBanner';
import TrustLayer from '../Trust/TrustLayer';

export default function ResultView({
  scanResult,
  onScanAnother,
  onSwitchToComparison,
  onSelectAlternative
}) {
  const { userGoals, explainMode, setExplainMode } = useUser();

  // Active Health Profile state
  const [selectedPersona, setSelectedPersona] = useState('general');

  // Explain Simply toggle state
  const [explainSimply, setExplainSimply] = useState(explainMode === 'easy');

  // "Why This Score?" factor breakdown accordion state
  const [showWhyRating, setShowWhyRating] = useState(false);

  // Active Tab state for Level 3 Detailed Analysis
  // Tabs: overview | ingredients | nutrition | claims | health | alternatives
  const [activeTab, setActiveTab] = useState('overview');

  // Expand all sections state
  const [expandAllDetailed, setExpandAllDetailed] = useState(false);

  if (!scanResult) return null;

  // Calculate persona score
  const personaResult = calculatePersonaScore(scanResult, selectedPersona);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'ingredients', label: 'Ingredients', icon: '🧪' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'claims', label: 'Claims', icon: '🚨' },
    { id: 'health', label: 'Health & Safety', icon: '🛡️' },
    { id: 'alternatives', label: 'Alternatives', icon: '🛒' }
  ];

  const handleGoToAlternatives = () => {
    setActiveTab('alternatives');
    setExpandAllDetailed(false);
    const el = document.getElementById('detailed-section-tabs');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in pb-12">
      
      {/* 🔴 LEVEL 1: DOMINANT VERDICT CARD (5-second answer: "Should I eat this?") */}
      <SimpleResultCard
        scanResult={scanResult}
        selectedPersona={selectedPersona}
        personaResult={personaResult}
        explainSimply={explainSimply}
        onToggleExplainSimply={() => setExplainSimply(!explainSimply)}
        onToggleWhyRating={() => setShowWhyRating(!showWhyRating)}
        showWhyRating={showWhyRating}
        onSwitchToComparison={onSwitchToComparison}
        onFindAlternatives={handleGoToAlternatives}
        onExploreDetailed={() => {
          setActiveTab('claims');
          const el = document.getElementById('detailed-section-tabs');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 🔴 LEVEL 2: "WHY THIS SCORE?" FACTOR BREAKDOWN (15-second answer) */}
      {showWhyRating && (
        <WhyThisRatingCard
          scanResult={scanResult}
          onExploreDetailed={() => {
            setActiveTab('nutrition');
            const el = document.getElementById('detailed-section-tabs');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* 🔴 5. PERSONAL HEALTH MODE (Analyze for: General | Diabetes | Heart Health | Kids | Fitness) */}
      <PersonalHealthMode
        scanResult={scanResult}
        selectedPersona={selectedPersona}
        onSelectPersona={setSelectedPersona}
        personaResult={personaResult}
      />

      {/* 🕵️ CONTEXTUAL AI ASSISTANT ("Ask UnavuLens") */}
      <AskUnavuLens scanResult={scanResult} />

      {/* 🔴 LEVEL 3: DETAILED ANALYSIS TABS CONTAINER */}
      <div id="detailed-section-tabs" className="space-y-6 pt-2">
        
        {/* Navigation Tabs Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          {/* Tabs Bar */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((t) => {
              const isActive = activeTab === t.id && !expandAllDetailed;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id);
                    setExpandAllDetailed(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Expand All / Collapse Toggle */}
          <button
            onClick={() => setExpandAllDetailed(!expandAllDetailed)}
            className="text-[11px] font-mono font-bold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-1 self-end sm:self-auto transition-all"
          >
            <span>{expandAllDetailed ? 'Show Tabs View' : 'Expand All Sections'}</span>
            {expandAllDetailed ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {(activeTab === 'overview' || expandAllDetailed) && (
          <div className="space-y-6 animate-fade-in">
            {/* 🍬 Hidden Sugar Detective */}
            <HiddenSugarDetective scanResult={scanResult} />

            {/* 🍽️ Realistic Portion Calculator */}
            <PortionCalculator nutritionData={scanResult.nutritionData} />

            {/* 🧪 Highlighted Ingredients preview */}
            <IngredientHighlightView parsedIngredients={scanResult.parsedIngredients} />

            {/* 🛒 Better Choices preview */}
            <BetterChoices
              scanResult={scanResult}
              onCompareWithAlternative={onSwitchToComparison}
            />
          </div>
        )}

        {/* TAB 2: INGREDIENTS */}
        {(activeTab === 'ingredients' || expandAllDetailed) && (
          <div className="space-y-6 animate-fade-in">
            {/* Highlighted Concern Cloud */}
            <IngredientHighlightView parsedIngredients={scanResult.parsedIngredients} />

            {/* Disguised Aliases */}
            <IngredientAliasDetector
              rawIngredients={scanResult.rawIngredients}
              parsedIngredients={scanResult.parsedIngredients}
            />

            {/* Full Card / Table Explorer */}
            <IngredientDetective parsedIngredients={scanResult.parsedIngredients} />
          </div>
        )}

        {/* TAB 3: NUTRITION */}
        {(activeTab === 'nutrition' || expandAllDetailed) && (
          <div className="space-y-6 animate-fade-in">
            {/* 🍽️ Realistic Portion Calculator */}
            <PortionCalculator nutritionData={scanResult.nutritionData} />

            {/* Standard Nutrition Analysis & Calorie Split */}
            <NutritionAnalysis nutritionData={scanResult.nutritionData} />
          </div>
        )}

        {/* TAB 4: MARKETING CLAIMS */}
        {(activeTab === 'claims' || expandAllDetailed) && (
          <div className="space-y-6 animate-fade-in">
            {/* 🚨 Marketing Claim Check (Claim -> Evidence -> Verdict) */}
            <MarketingClaimCheck
              evaluationData={scanResult.marketingEvaluation}
              scanResult={scanResult}
            />
          </div>
        )}

        {/* TAB 5: HEALTH & SAFETY */}
        {(activeTab === 'health' || expandAllDetailed) && (
          <div className="space-y-6 animate-fade-in">
            {/* Allergen Alerts */}
            <AllergenAlertBanner allergensDetected={scanResult.allergensDetected} />

            {/* Indian Regulatory & Safety Standards */}
            <IndianLabelBadges scanResult={scanResult} />

            {/* Evidence Trust Layer */}
            <TrustLayer />
          </div>
        )}

        {/* TAB 6: ALTERNATIVES & FOOD SWAPS */}
        {(activeTab === 'alternatives' || expandAllDetailed) && (
          <div className="space-y-6 animate-fade-in">
            {/* 🛒 Better Choices */}
            <BetterChoices
              scanResult={scanResult}
              onCompareWithAlternative={onSwitchToComparison}
            />

            {/* Extended Category Swaps */}
            <HealthierSwapEngine scanResult={scanResult} />
          </div>
        )}

        {/* 🔴 11. "WHAT SHOULD I DO?" ACTIONABLE TAKEAWAY (Always accessible at bottom of analysis) */}
        <WhatShouldIDo
          scanResult={scanResult}
          onScanAnother={onScanAnother}
          onSwitchToComparison={onSwitchToComparison}
        />

      </div>

    </div>
  );
}
