import React from 'react';
import { Thermometer, Sun, Droplets, Flame, Snowflake } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function StorageAdvisor({ storageData }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!storageData) return null;

  const { isRefrigerated, avoidList = [], recommendedLocationEn, recommendedLocationTa, storageAdviceEn, storageAdviceTa } = storageData;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-slate-100">
            🌡️ Storage Condition Advisor
          </h3>
        </div>
        <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold">
          {isTa ? recommendedLocationTa : recommendedLocationEn}
        </span>
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono">
        <span className="text-[10px] text-amber-400 uppercase font-bold block mb-1">Recommended Environmental Care:</span>
        <p>{isTa ? storageAdviceTa : storageAdviceEn}</p>
      </div>

      {avoidList.length > 0 && (
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Keep Away From:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {avoidList.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
