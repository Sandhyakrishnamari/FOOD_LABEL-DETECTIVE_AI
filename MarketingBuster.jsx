import React from 'react';
import { Search, CheckCircle2, AlertTriangle, XCircle, FileSearch, Scale } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function MarketingBuster({ evaluationData }) {
  const { language, t } = useUser();
  const isTa = language === 'ta';

  if (!evaluationData || !evaluationData.claimsEvaluated || evaluationData.claimsEvaluated.length === 0) {
    return null;
  }

  const { claimsEvaluated, overallTruthIndex } = evaluationData;

  const getStatusBadge = (status, truthIndex) => {
    if (status === 'verified_true' || truthIndex >= 90) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>🟢 {isTa ? 'உறுதிசெய்யப்பட்டது' : 'Confirmed'}</span>
        </span>
      );
    }
    if (status === 'mostly_accurate' || truthIndex >= 75) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>🟢 {isTa ? 'பெரும்பாலானவை உண்மை' : 'Mostly Accurate'}</span>
        </span>
      );
    }
    if (truthIndex >= 60) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>🟡 {isTa ? 'கூடுதல் விளக்கம் தேவை' : 'Needs Context'}</span>
        </span>
      );
    }
    if (status === 'misleading' || truthIndex >= 40) {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-500/10 text-orange-300 border border-orange-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>🟠 {isTa ? 'தவறாக வழிநடத்துகிறது' : 'Misleading'}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30">
        <XCircle className="w-3.5 h-3.5" />
        <span>🔴 {isTa ? 'பொய்யான விளம்பரம்' : 'Busted'}</span>
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 shadow-2xl mb-8 relative overflow-hidden">
      
      {/* Background Decorative Detective Badge */}
      <div className="absolute -right-8 -bottom-8 opacity-5 text-amber-400 pointer-events-none">
        <FileSearch className="w-64 h-64" />
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded shadow">
              ⭐ SIGNATURE FEATURE
            </span>
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              {t('marketingBuster.title')}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
            <Search className="w-5 h-5 text-amber-400" />
            <span>Marketing Buster & Truth Index</span>
          </h3>
        </div>

        {/* Overall Truth Gauge Pill */}
        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <Scale className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t('marketingBuster.truthIndex')}</div>
            <div className="text-lg font-mono font-extrabold text-amber-300">
              {overallTruthIndex} <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 my-4 leading-relaxed">
        {isTa 
          ? 'பாக்கெட்டின் முன்பக்கம் என்ன விளம்பரம் செய்தாலும், எங்களின் டிடெக்டிவ் சிஸ்டம் மூலப்பொருள் பட்டியல் மற்றும் ஊட்டச்சத்து அளவுகளுடன் அதை ஒப்பிட்டு உண்மையைக் கண்டறியும்:'
          : 'Front-of-package marketing claims lure consumers into believing ultra-processed foods are healthy. Our detective engine cross-examines front promises against the fine-print ingredient list and nutrition table:'}
      </p>

      {/* Case Investigation Files per Claim */}
      <div className="space-y-4">
        {claimsEvaluated.map((item, index) => (
          <div
            key={index}
            className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 transition-all hover:border-amber-500/40"
          >
            {/* Header: Front Claim vs Truth Score */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-850">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-slate-400 font-mono">
                  CLAIM #{index + 1}:
                </span>
                <span className="text-sm font-black tracking-wide text-amber-300 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                  “{item.claim}”
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {getStatusBadge(item.status, item.truthIndex)}
                <span className="text-xs font-mono font-extrabold text-slate-200">
                  Truth Index: <span className={item.truthIndex >= 70 ? 'text-emerald-400' : 'text-amber-400'}>{item.truthIndex}</span>/100
                </span>
              </div>
            </div>

            {/* Investigation Finding */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex-shrink-0 mt-0.5">
                  🔎 {t('marketingBuster.investigation')}
                </span>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {item.finding}
                </p>
              </div>

              {/* Evidence Points */}
              {item.evidence && item.evidence.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-900 bg-slate-900/40 p-2.5 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    📋 {t('marketingBuster.evidence')}
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {item.evidence.map((ev, i) => (
                      <li key={i} className="flex items-start space-x-1.5 font-mono">
                        <span className="text-amber-400">└─</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
