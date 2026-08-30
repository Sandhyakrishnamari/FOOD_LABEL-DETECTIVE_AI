import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function AllergenAlertBanner({ allergensDetected }) {
  const { language, t } = useUser();
  const isTa = language === 'ta';

  if (!allergensDetected || allergensDetected.length === 0) return null;

  return (
    <div className="bg-purple-950/50 border-2 border-purple-500/50 rounded-2xl p-6 shadow-2xl mb-8">
      
      {/* Allergen Header */}
      <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-purple-500/30">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-black tracking-wide text-purple-200 uppercase">
            {t('allergens.detected')} ({allergensDetected.length})
          </h3>
          <p className="text-xs text-purple-300/80">
            {isTa ? 'கீழே குறிப்பிடப்பட்டுள்ள மூலப்பொருட்களால் எச்சரிக்கை விடுக்கப்பட்டுள்ளது:' : 'Exact allergen trigger ingredients identified on the package label:'}
          </p>
        </div>
      </div>

      {/* List of Triggered Allergens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allergensDetected.map((allergen) => (
          <div
            key={allergen.id}
            className="bg-slate-950 border border-purple-500/40 rounded-xl p-4 space-y-2 text-xs"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{allergen.icon}</span>
              <div>
                <h4 className="text-sm font-bold text-purple-200">
                  {allergen.name} {isTa ? 'கண்டறியப்பட்டது' : 'Detected'}
                </h4>
                <span className="text-[10px] font-bold uppercase text-purple-400">
                  {allergen.severity} Priority
                </span>
              </div>
            </div>

            {/* Found In: */}
            <div className="bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20 space-y-1">
              <div className="flex items-start space-x-1.5">
                <strong className="text-amber-300 font-bold text-[11px] flex-shrink-0">
                  📍 {t('allergens.foundIn')}
                </strong>
                <span className="font-mono font-bold text-slate-100 underline decoration-amber-400">
                  {allergen.exactTriggers.join(', ')}
                </span>
              </div>

              <div className="flex items-start space-x-1.5 text-slate-300">
                <strong className="text-purple-300 font-bold text-[11px] flex-shrink-0">
                  💡 {t('allergens.whyFlagged')}
                </strong>
                <span>{allergen.explanation}</span>
              </div>

              <div className="flex items-start space-x-1.5 text-slate-300">
                <strong className="text-rose-300 font-bold text-[11px] flex-shrink-0">
                  👤 {t('allergens.whoAttention')}
                </strong>
                <span>{isTa ? `${allergen.name} ஒவ்வாமை உள்ள நபர்கள் கவனமாக இருக்க வேண்டும்.` : `People with ${allergen.name.toLowerCase()} allergy or intolerance.`}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
