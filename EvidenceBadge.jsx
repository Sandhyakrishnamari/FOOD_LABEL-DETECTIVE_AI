import React from 'react';
import { MapPin, FileText, CheckCircle2 } from 'lucide-react';

export default function EvidenceBadge({ sourceSlot = 'Ingredients Photo', textSnippet = '', confidence = 94 }) {
  if (!sourceSlot && !textSnippet) return null;

  return (
    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1 my-2">
      <div className="flex items-center justify-between text-amber-400 font-bold">
        <span className="flex items-center space-x-1">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>📍 Source: {sourceSlot}</span>
        </span>
        {confidence > 0 && (
          <span className="text-emerald-400 flex items-center space-x-0.5 text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            <span>✓ OCR Confidence: {confidence}%</span>
          </span>
        )}
      </div>
      {textSnippet && (
        <div className="text-slate-300 flex items-start space-x-1 italic bg-slate-900/60 p-1.5 rounded border border-slate-800/60 text-[10px]">
          <FileText className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
          <span>📄 Text Snippet: “{textSnippet}”</span>
        </div>
      )}
    </div>
  );
}
