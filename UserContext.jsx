import React, { createContext, useContext, useState, useEffect } from 'react';
import { t as translateHelper } from '../services/translationService';

const UserContext = createContext();

const DEFAULT_GOALS = {
  lowSugar: false,
  highProtein: false,
  vegan: false,
  vegetarian: false,
  glutenFree: false,
  keto: false,
  heartHealthy: false,
  kidsFocused: false,
  allergensAvoided: []
};

export function UserProvider({ children }) {
  // Language State: 'en' | 'ta'
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('fld_language') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  // Explain Mode State: 'normal' | 'easy'
  const [explainMode, setExplainMode] = useState(() => {
    try {
      return localStorage.getItem('fld_explain_mode') || 'easy';
    } catch (e) {
      return 'easy';
    }
  });

  // User Profile Goals
  const [userGoals, setUserGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('fld_user_goals');
      return saved ? JSON.parse(saved) : DEFAULT_GOALS;
    } catch (e) {
      return DEFAULT_GOALS;
    }
  });

  // Gemini API Key
  const [apiKey, setApiKey] = useState(() => {
    try {
      return localStorage.getItem('fld_gemini_api_key') || '';
    } catch (e) {
      return '';
    }
  });

  // Saved Scan History
  const [savedScans, setSavedScans] = useState(() => {
    try {
      const saved = localStorage.getItem('fld_scan_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Comparison Buffer (up to 2 scans)
  const [comparisonBuffer, setComparisonBuffer] = useState([]);

  // Persistence Effects
  useEffect(() => {
    try { localStorage.setItem('fld_language', language); } catch (e) {}
  }, [language]);

  useEffect(() => {
    try { localStorage.setItem('fld_explain_mode', explainMode); } catch (e) {}
  }, [explainMode]);

  useEffect(() => {
    try { localStorage.setItem('fld_user_goals', JSON.stringify(userGoals)); } catch (e) {}
  }, [userGoals]);

  useEffect(() => {
    try { localStorage.setItem('fld_gemini_api_key', apiKey); } catch (e) {}
  }, [apiKey]);

  useEffect(() => {
    try { localStorage.setItem('fld_scan_history', JSON.stringify(savedScans)); } catch (e) {}
  }, [savedScans]);

  const t = (keyPath) => translateHelper(language, keyPath);

  const toggleGoal = (goalKey) => {
    setUserGoals(prev => ({ ...prev, [goalKey]: !prev[goalKey] }));
  };

  const toggleAvoidedAllergen = (allergenId) => {
    setUserGoals(prev => {
      const current = prev.allergensAvoided || [];
      const updated = current.includes(allergenId)
        ? current.filter(id => id !== allergenId)
        : [...current, allergenId];
      return { ...prev, allergensAvoided: updated };
    });
  };

  const saveScan = (scanResult) => {
    setSavedScans(prev => {
      const exists = prev.some(s => s.id === scanResult.id);
      if (exists) return prev.map(s => s.id === scanResult.id ? scanResult : s);
      return [scanResult, ...prev];
    });
  };

  const deleteScan = (scanId) => {
    setSavedScans(prev => prev.filter(s => s.id !== scanId));
    setComparisonBuffer(prev => prev.filter(s => s.id !== scanId));
  };

  const clearHistory = () => {
    setSavedScans([]);
    setComparisonBuffer([]);
  };

  const toggleCompareScan = (scan) => {
    setComparisonBuffer(prev => {
      const exists = prev.some(s => s.id === scan.id);
      if (exists) return prev.filter(s => s.id !== scan.id);
      if (prev.length >= 2) return [prev[1], scan];
      return [...prev, scan];
    });
  };

  return (
    <UserContext.Provider value={{
      language,
      setLanguage,
      explainMode,
      setExplainMode,
      t,
      userGoals,
      setUserGoals,
      toggleGoal,
      toggleAvoidedAllergen,
      apiKey,
      setApiKey,
      savedScans,
      saveScan,
      deleteScan,
      clearHistory,
      comparisonBuffer,
      setComparisonBuffer,
      toggleCompareScan
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
