import React from 'react';
import { Tag, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function CertificationChecker({ certData }) {
  const { language } = useUser();
  const isTa = language === 'ta';

  if (!certData) return null;

  const { certifications = [], hasFssai, statusTextEn, statusTextTa } = certData;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-extrabold text-slate-100">
            🏷️ Trust Mark Scanner & Certifications
          </h3>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">
          {isTa ? statusTextTa : statusTextEn}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-slate-100">{cert.name}</h4>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                {cert.country}
              </span>
            </div>

            {cert.licenseNumber && (
              <div className="text-xs font-mono text-slate-300">
                License No: <strong className="text-amber-300">{cert.licenseNumber}</strong>
              </div>
            )}

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {cert.details}
            </p>
          </div>
        ))}
      </div>

      {!hasFssai && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>⚠️ Certification Not Found on Label text segment. Check manufacturer details before purchase.</span>
        </div>
      )}
    </div>
  );
}
