import React from 'react';
import { BookOpen, Sparkles, Volume2 } from 'lucide-react';
import { speakText } from '../../services/textToSpeech';
import { useUser } from '../../context/UserContext';

export default function FoodStoryMode({ parsedIngredients = [] }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!parsedIngredients || parsedIngredients.length === 0) return null;

  // Build story items
  const storyItems = parsedIngredients.slice(0, 6).map((ing) => {
    let roleIcon = '🌾';
    let roleDescEn = 'Provides the main structure and energy base.';
    let roleDescTa = 'முக்கிய அமைப்பு மற்றும் ஆற்றல் காரணியை வழங்குகிறது.';

    const lower = ing.name.toLowerCase();
    if (lower.includes('milk') || lower.includes('dairy') || lower.includes('whey')) {
      roleIcon = '🥛';
      roleDescEn = 'Adds rich taste, creamy texture, and dairy flavor.';
      roleDescTa = 'சுவை, கிரீமி அமைப்பு மற்றும் பால் சுவையை சேர்க்கிறது.';
    } else if (lower.includes('sugar') || lower.includes('syrup') || lower.includes('dextrose')) {
      roleIcon = '🍬';
      roleDescEn = 'Provides sweet flavor and caloric energy density.';
      roleDescTa = 'இனிப்பு சுவை மற்றும் கலோரி ஆற்றலை வழங்குகிறது.';
    } else if (lower.includes('preservative') || ing.eNumber || lower.includes('benzoate')) {
      roleIcon = '🧪';
      roleDescEn = 'Increases shelf life and prevents microbial spoilage.';
      roleDescTa = 'ஆயுளை அதிகரிக்கிறது மற்றும் கெட்டுப்போவதை தடுக்கிறது.';
    } else if (lower.includes('oil') || lower.includes('fat')) {
      roleIcon = '🧈';
      roleDescEn = 'Binds ingredients and gives crisp mouthfeel.';
      roleDescTa = 'பொருட்களை இணைத்து மொறுமொறுப்பான தன்மையை தருகிறது.';
    }

    return {
      name: ing.name,
      nameTa: ing.nameTa || ing.name,
      icon: roleIcon,
      descEn: roleDescEn,
      descTa: roleDescTa
    };
  });

  const fullStoryText = storyItems.map(s => `${s.name}: ${isTa ? s.descTa : s.descEn}`).join('. ');

  return (
    <div className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 shadow-xl mb-8 space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold mb-1 inline-block">
            ⭐ UNIQUE FEATURE
          </span>
          <h3 className="text-lg font-extrabold text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>🥪 Your Food Story Mode</span>
          </h3>
        </div>

        <button
          onClick={() => speakText(fullStoryText, language)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span>🔊 Read Story Aloud</span>
        </button>
      </div>

      <p className="text-xs text-slate-300">
        How every ingredient works together inside this packaged food item:
      </p>

      {/* Story Timeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {storyItems.map((item, idx) => (
          <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{item.icon}</span>
              <h4 className="text-xs font-bold text-slate-100 font-mono truncate">{item.name}</h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {isTa ? item.descTa : item.descEn}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
