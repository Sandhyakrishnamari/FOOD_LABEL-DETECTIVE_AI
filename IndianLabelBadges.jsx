import React from 'react';
import { ShieldCheck, Calendar, IndianRupee, Thermometer, AlertCircle, HelpCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function IndianLabelBadges({ scanResult }) {
  const { language } = useUser();
  if (!scanResult) return null;

  const { metadata = {}, rawOcrText = '', parsedIngredients = [] } = scanResult;

  // 1. FSSAI License Check
  const fssaiNumber = metadata.fssaiNumber || (rawOcrText.match(/fssai\s*(?:lic\.?\s*no\.?|license)?\s*[:\.]?\s*(\d{14})/i)?.[1]);
  const fssaiStatus = fssaiNumber ? 'detected' : 'notFound';

  // 2. Veg / Non-Veg Detection
  const lowerText = (rawOcrText + ' ' + parsedIngredients.map(i => i.name).join(' ')).toLowerCase();
  const nonVegKeywords = ['chicken', 'mutton', 'beef', 'pork', 'fish', 'egg', 'gelatin', 'carmine', 'cochineal', 'shrimp', 'crab'];
  const hasNonVegKeywords = nonVegKeywords.some(k => lowerText.includes(k));
  const hasGreenDotText = lowerText.includes('100% veg') || lowerText.includes('pure veg') || lowerText.includes('vegetarian');

  let vegStatus = 'cannotDetermine';
  if (hasNonVegKeywords) {
    vegStatus = 'nonVeg';
  } else if (hasGreenDotText) {
    vegStatus = 'veg';
  }

  // 3. Expiry / Best Before Check
  const expiryMatch = metadata.expiryString || rawOcrText.match(/(?:exp|expiry|best\s*before)\s*[:\.]?\s*([\d\/\.\-]+|\d+\s*months)/i)?.[1];
  const expiryStatus = expiryMatch ? 'detected' : 'notFound';

  // 4. MRP Price Check
  const mrpPrice = metadata.mrp || rawOcrText.match(/mrp\s*[:\.]?\s*(₹?\s*\d+(?:\.\d+)?)/i)?.[1];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-extrabold text-slate-100 flex items-center space-x-2">
          <span>🇮🇳 Indian Food Label Verification</span>
        </h3>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          FSSAI & Standards
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        
        {/* FSSAI License */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">FSSAI License:</span>
          {fssaiStatus === 'detected' ? (
            <div>
              <div className="text-emerald-400 font-bold font-mono flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Detected: {fssaiNumber}</span>
              </div>
              <p className="text-[9px] text-slate-500 italic mt-0.5">
                (Detected from image text. Not official government registry verification.)
              </p>
            </div>
          ) : (
            <div className="text-amber-400 font-bold font-mono flex items-center space-x-1">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>❓ Cannot Determine / Not Found</span>
            </div>
          )}
        </div>

        {/* Veg / Non-Veg Symbol */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Dietary Symbol:</span>
          {vegStatus === 'veg' && (
            <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
              <div className="w-4 h-4 border-2 border-emerald-500 flex items-center justify-center p-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <span>🟢 Vegetarian</span>
            </div>
          )}
          {vegStatus === 'nonVeg' && (
            <div className="text-rose-400 font-bold flex items-center space-x-1.5">
              <div className="w-4 h-4 border-2 border-rose-600 flex items-center justify-center p-0.5">
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent border-b-rose-600"></div>
              </div>
              <span>🟤 Non-Vegetarian</span>
            </div>
          )}
          {vegStatus === 'cannotDetermine' && (
            <div className="text-amber-400 font-bold flex items-center space-x-1 text-[11px]">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>⚠️ Cannot determine symbol</span>
            </div>
          )}
        </div>

        {/* Expiry / Best Before */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">Expiry / Shelf Life:</span>
          {expiryStatus === 'detected' ? (
            <div className="text-emerald-400 font-bold font-mono flex items-center space-x-1">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{expiryMatch}</span>
            </div>
          ) : (
            <div className="text-amber-400 font-bold font-mono flex items-center space-x-1 text-[11px]">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>❓ Cannot determine from image</span>
            </div>
          )}
        </div>

        {/* MRP Price */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] uppercase font-bold block">MRP Price:</span>
          {mrpPrice ? (
            <div className="text-amber-300 font-bold font-mono flex items-center space-x-1">
              <IndianRupee className="w-4 h-4 text-amber-400" />
              <span>₹{mrpPrice}</span>
            </div>
          ) : (
            <div className="text-slate-500 font-mono text-[11px]">
              ❓ Not Found on Label
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
