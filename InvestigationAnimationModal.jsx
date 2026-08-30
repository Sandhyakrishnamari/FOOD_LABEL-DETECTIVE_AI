import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function InvestigationAnimationModal({ isScanning, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const { language } = useUser();
  const isTa = language === 'ta';

  const stages = [
    { label: 'Reading label', ta: 'லேபிள் படிக்கப்படுகிறது', icon: '📄' },
    { label: 'Identifying ingredients', ta: 'மூலப்பொருட்கள் அடையாளம் காணப்படுகின்றன', icon: '🧪' },
    { label: 'Analyzing nutrition', ta: 'ஊட்டச்சத்து பகுப்பாய்வு செய்யப்படுகிறது', icon: '🥗' },
    { label: 'Checking marketing claims', ta: 'விளம்பர கூற்றுகள் சரிபார்க்கப்படுகின்றன', icon: '🚨' },
    { label: 'Evaluating food profile', ta: 'உணவு சுயவிவரம் மதிப்பீடு செய்யப்படுகிறது', icon: '⚖️' },
    { label: 'Preparing your verdict', ta: 'உங்கள் தீர்ப்பு தயாரிக்கப்படுகிறது', icon: '✨' }
  ];

  useEffect(() => {
    if (!isScanning) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) onComplete();
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isScanning]);

  if (!isScanning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        
        {/* Animated Brand Pulse Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-3xl mx-auto shadow-xl animate-pulse">
          🔎
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-100">
            {isTa ? 'UnavuLens உங்கள் லேபிளை பகுப்பாய்வு செய்கிறது...' : 'Analyzing Food Label...'}
          </h3>
          <p className="text-xs text-amber-300 font-mono mt-1">
            {isTa ? 'உணவு பாதுகாப்பு மற்றும் ஊட்டச்சத்து சோதனை' : 'Running deterministic intelligence pipeline'}
          </p>
        </div>

        {/* Realistic Multi-Stage Progress Ticks */}
        <div className="space-y-2 text-xs text-left max-w-sm mx-auto font-mono">
          {stages.map((s, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : isCurrent
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-md font-bold'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-sm">{s.icon}</span>
                  <span className="text-xs">{isTa ? s.ta : s.label}</span>
                </div>

                {isDone ? (
                  <span className="text-emerald-400 font-black flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-[10px]">✓</span>
                  </span>
                ) : isCurrent ? (
                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span className="text-[10px]">◉</span>
                  </span>
                ) : (
                  <span className="text-slate-600 text-[10px]">○</span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
