import React from 'react';
import { Camera, CheckCircle2, X } from 'lucide-react';

export default function CameraGuidanceModal({ isOpen, onClose, onProceed }) {
  if (!isOpen) return null;

  const tips = [
    { text: 'Capture the full ingredients section clearly', note: 'Fine print is enhanced automatically' },
    { text: 'Avoid harsh lighting glare and reflections', note: 'Position label under indirect light' },
    { text: 'Keep camera straight and text horizontal', note: 'Prevents perspective distortion' },
    { text: 'Include the nutrition table if available', note: 'Unlocks Traffic Light badges & DV%' },
    { text: 'Include manufacturing & expiry dates', note: 'Unlocks Freshness Check report' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">
              📷 Photo Capture Tips
            </h3>
            <p className="text-xs text-slate-400">Follow these tips for 99% OCR accuracy</p>
          </div>
        </div>

        <ul className="space-y-2.5 text-xs">
          {tips.map((tip, idx) => (
            <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-200 block">{tip.text}</span>
                <span className="text-[10px] text-slate-400 block">{tip.note}</span>
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={() => { onProceed(); onClose(); }}
          className="w-full py-3 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl hover:bg-amber-400 shadow-lg transition-all"
        >
          Proceed to Photo Capture →
        </button>

      </div>
    </div>
  );
}
