import React, { useState, useEffect } from 'react';
import { Eye, FileText, AlertTriangle, CheckCircle2, Edit3, RefreshCw, Camera, Upload, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function PreprocessingPreview({
  cleanText,
  rawText,
  metadata = {},
  sectionConfidence = {},
  ocrConfidence = 92,
  originalUrl,
  processedUrl,
  onReparseText,
  onRetakePhoto,
  onUploadAnother
}) {
  const { language, t } = useUser();
  const isTa = language === 'ta';

  const [showAdvancedOcr, setShowAdvancedOcr] = useState(false);
  const [activeTab, setActiveTab] = useState('cleaned'); // 'cleaned' | 'raw'
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(cleanText || '');

  useEffect(() => {
    setEditableText(cleanText || '');
  }, [cleanText]);

  if (!cleanText && !rawText) return null;

  const conf = {
    ingredients: sectionConfidence.ingredients || (ocrConfidence > 80 ? 94 : 65),
    nutrition: sectionConfidence.nutrition || (ocrConfidence > 80 ? 90 : 60),
    expiry: sectionConfidence.expiry || 75,
    fssai: sectionConfidence.fssai || 88
  };

  const isLowConfidence = ocrConfidence < 75 || conf.ingredients < 70;
  const isPartiallyMissing = conf.nutrition < 60;

  const handleApplyEdit = () => {
    setIsEditing(false);
    if (onReparseText) {
      onReparseText(editableText);
    }
  };

  return (
    <div className="space-y-3 max-w-4xl mx-auto animate-fade-in">
      
      {/* 1. OCR STATUS BANNER (Good vs Poor) */}
      {!isLowConfidence ? (
        /* GOOD OCR QUALITY STATE */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xl flex-shrink-0">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <span>{isTa ? 'லேபிள் வெற்றிகரமாகப் பிடிக்கப்பட்டது' : 'Label captured successfully'}</span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  {Math.round(ocrConfidence)}% Quality
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {isTa ? 'இந்த லேபிளின் பெரும்பாலான தகவல்களை படிக்க முடிகிறது.' : 'We can read most of the information on this label.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdvancedOcr(!showAdvancedOcr)}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 self-end sm:self-center py-1.5 px-3 rounded-lg hover:bg-slate-800 transition-all font-mono"
          >
            <span>{showAdvancedOcr ? 'Hide Advanced OCR' : 'Advanced OCR Details ↓'}</span>
            {showAdvancedOcr ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      ) : (
        /* POOR / LOW CONFIDENCE OCR QUALITY STATE */
        <div className="bg-amber-500/10 border-2 border-amber-500/40 p-5 rounded-2xl space-y-3.5 shadow-lg">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-black text-amber-300">
                {isTa ? '⚠️ எங்களால் அனைத்தையும் தெளிவாகப் படிக்க முடியவில்லை' : '⚠️ We couldn’t read everything'}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isTa 
                  ? 'இந்த லேபிளின் சில பகுதிகள் மங்கலாக உள்ளன. முடிவுகள் முழுமையடையாமல் போகலாம்.'
                  : 'Some parts of this label are unclear. Your results may be incomplete.'}
              </p>
            </div>
          </div>

          {/* Action Buttons for Poor OCR */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {onRetakePhoto && (
              <button
                onClick={onRetakePhoto}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Retake Photo</span>
              </button>
            )}

            {onUploadAnother && (
              <button
                onClick={onUploadAnother}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Another</span>
              </button>
            )}

            <button
              onClick={() => setShowAdvancedOcr(!showAdvancedOcr)}
              className="px-3.5 py-2 bg-slate-950 text-amber-300 border border-slate-800 hover:bg-slate-900 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all font-mono"
            >
              <span>{showAdvancedOcr ? 'Hide Details' : 'Continue Anyway & View OCR ↓'}</span>
              {showAdvancedOcr ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* 2. COLLAPSIBLE ADVANCED OCR DETAILS (Level 3 - Detailed on demand) */}
      {showAdvancedOcr && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 animate-fade-in">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider font-mono">
                Advanced OCR Extraction Details
              </h3>
            </div>

            {/* View Toggles & Photo Preview Drawer */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('cleaned')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    activeTab === 'cleaned' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Cleaned
                </button>
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    activeTab === 'raw' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Raw OCR
                </button>
              </div>

              {processedUrl && (
                <button
                  onClick={() => setShowImagePreview(!showImagePreview)}
                  className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-xl bg-slate-950 text-slate-300 hover:bg-slate-850 border border-slate-800"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showImagePreview ? 'Hide Image' : 'View Image'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Section-by-Section Confidence Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-[10px] uppercase">Ingredients:</span>
              <strong className="text-emerald-400 font-bold">{conf.ingredients}%</strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-[10px] uppercase">Nutrition Table:</span>
              <strong className={conf.nutrition < 70 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                {conf.nutrition}%
              </strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-[10px] uppercase">Expiry Dates:</span>
              <strong className={conf.expiry < 70 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                {conf.expiry}%
              </strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <span className="text-slate-400 block text-[10px] uppercase">FSSAI License:</span>
              <strong className="text-emerald-400 font-bold">{conf.fssai}%</strong>
            </div>
          </div>

          {/* Optional Image Preview */}
          {showImagePreview && processedUrl && (
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 flex justify-center animate-fade-in">
              <img src={processedUrl} alt="Processed OCR" className="max-h-56 object-contain rounded-xl border border-slate-800" />
            </div>
          )}

          {/* Cleaned vs Raw Text Viewer & Manual Editor */}
          {activeTab === 'cleaned' ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-mono font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Parsed & Normalized Ingredients Text</span>
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel Edit' : '✏️ Edit Text'}</span>
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editableText}
                    onChange={(e) => setEditableText(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={handleApplyEdit}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>🔄 Re-analyze Edited Text</span>
                  </button>
                </div>
              ) : (
                <p className="whitespace-pre-wrap font-mono text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {cleanText || 'No clean text extracted'}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-xs text-slate-400 leading-relaxed">
              <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                Raw Extracted OCR Output:
              </span>
              <p className="whitespace-pre-wrap bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                {rawText || 'No raw text extracted'}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
