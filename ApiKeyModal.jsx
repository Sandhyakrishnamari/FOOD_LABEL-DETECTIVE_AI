import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function ApiKeyModal({ isOpen, onClose }) {
  const { apiKey, setApiKey } = useUser();
  const [keyInput, setKeyInput] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(keyInput.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Gemini Vision AI Key (Optional)
            </h3>
            <p className="text-xs text-slate-400">
              Enhance OCR with Google Gemini 2.5 Flash Vision Multimodal AI
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Google AI Studio API Key
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              💡 <strong>Offline Mode Default</strong>: If no API key is provided, the app uses client-side Tesseract.js OCR and deterministic intelligence knowledge bases.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition-all"
            >
              Save Key
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={() => { setApiKey(''); setKeyInput(''); onClose(); }}
                className="px-4 py-2.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold rounded-xl hover:bg-rose-500/30"
              >
                Remove
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
