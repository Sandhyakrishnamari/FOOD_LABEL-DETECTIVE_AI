import React from 'react';
import { Search, Scale, Shield, Sparkles, X, ChevronRight, BookOpen } from 'lucide-react';

export default function FirstTimeWelcomeModal({ isOpen, onClose, onSelectAction }) {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'scanner',
      title: '📸 Scan Food Label',
      desc: 'Upload or capture any food label photo to investigate ingredients, nutrition & marketing claims.',
      icon: '📸',
      color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300'
    },
    {
      id: 'ingredientLens',
      title: '🧪 Check an Ingredient',
      desc: 'Search any technical chemical additive or E-number (e.g. Sodium Benzoate E211) without scanning.',
      icon: '🧪',
      color: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-300'
    },
    {
      id: 'safetyLens',
      title: '🛡️ Check Food Safety',
      desc: 'Run a complete safety investigation on expiry dates, packaging integrity, and storage advice.',
      icon: '🛡️',
      color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300'
    },
    {
      id: 'comparison',
      title: '⚖️ Compare Products',
      desc: 'Compare two packaged foods side-by-side to find the healthiest option for your goal.',
      icon: '⚖️',
      color: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-300'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-3xl mx-auto shadow-lg">
            🔎
          </div>
          <h2 className="text-2xl font-black text-slate-100">
            Welcome to UnavuLens AI
          </h2>
          <p className="text-xs text-amber-300 font-bold">
            What do you want to investigate today?
          </p>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {actions.map((act) => (
            <div
              key={act.id}
              onClick={() => { onSelectAction(act.id); onClose(); }}
              className={`p-4 rounded-2xl border bg-gradient-to-br cursor-pointer transition-all hover:scale-[1.02] space-y-1.5 flex flex-col justify-between ${act.color}`}
            >
              <div>
                <div className="text-2xl mb-1">{act.icon}</div>
                <h3 className="text-sm font-extrabold text-slate-100 flex items-center justify-between">
                  <span>{act.title}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </h3>
                <p className="text-[11px] text-slate-300 leading-snug mt-1">
                  {act.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-750 transition-all text-center"
        >
          Explore All Features
        </button>

      </div>
    </div>
  );
}
