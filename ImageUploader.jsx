import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, FileText, CheckCircle2, RefreshCw, X, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { SAMPLE_LABELS } from '../../services/sampleData';
import { useUser } from '../../context/UserContext';

export default function ImageUploader({ onScanStart, isLoading, onOpenCameraTips }) {
  const { language, t } = useUser();
  const isTa = language === 'ta';

  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'sample' | 'paste'
  const [dragOver, setDragOver] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedClaims, setSelectedClaims] = useState(['NO ADDED SUGAR', 'HIGH PROTEIN']);

  // Camera capture state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Manual text paste state
  const [pastedIngredients, setPastedIngredients] = useState('');
  const [pastedNutrition, setPastedNutrition] = useState({
    calories: '', sugar: '', protein: '', fat: '', satFat: '', sodium: ''
  });

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      readFile(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      readFile(file);
    }
  };

  const readFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Could not access camera. Please allow camera permissions or upload an image.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    stopCamera();
    setSelectedImage(dataUrl);
  };

  const handleAnalyzeSelectedImage = () => {
    if (!selectedImage) return;
    onScanStart({
      type: 'file',
      primaryImage: selectedImage,
      imageDataUrl: selectedImage,
      selectedClaims
    });
  };

  const handleSampleClick = (sample) => {
    onScanStart({
      type: 'sample',
      sampleData: sample,
      selectedClaims: sample.frontClaims || selectedClaims
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!pastedIngredients.trim()) {
      alert('Please enter an ingredient list to analyze.');
      return;
    }
    onScanStart({
      type: 'manual',
      rawIngredients: pastedIngredients,
      nutrition: {
        calories: parseFloat(pastedNutrition.calories) || 0,
        sugar: parseFloat(pastedNutrition.sugar) || 0,
        protein: parseFloat(pastedNutrition.protein) || 0,
        fat: parseFloat(pastedNutrition.fat) || 0,
        saturatedFat: parseFloat(pastedNutrition.satFat) || 0,
        sodium: parseFloat(pastedNutrition.sodium) || 0
      },
      selectedClaims
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-4xl mx-auto space-y-6">
      
      {/* 1. Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            {isTa ? 'உணவு லேபிளை ஸ்கேன் செய்க' : 'Scan a food label'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {isTa 
              ? 'மூலப்பொருட்கள் மற்றும் ஊட்டச்சத்து அட்டவணையின் தெளிவான புகைப்படத்தை எடுக்கவும்.'
              : 'Take a clear photo of the ingredients and nutrition panel.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-center text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('scan'); stopCamera(); }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'scan' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isTa ? 'புகைப்படம்' : 'Scan / Upload'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('sample'); stopCamera(); }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'sample' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTa ? 'மாதிரிகள்' : 'Samples'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('paste'); stopCamera(); }}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === 'paste' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isTa ? 'உரை' : 'Paste Text'}</span>
          </button>
        </div>
      </div>

      {/* 2. Photo Guidance Strip */}
      {activeTab === 'scan' && !selectedImage && !isCameraActive && (
        <div className="bg-slate-950/80 border border-slate-850 p-3.5 rounded-2xl">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-2">
            💡 Photo Guidance for Best Results:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Keep the label flat</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Make the text readable</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Avoid glare</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Include ingredients + nutrition</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: SCAN / UPLOAD VIEW */}
      {activeTab === 'scan' && (
        <div className="space-y-4">
          
          {/* CAMERA STREAM ACTIVE */}
          {isCameraActive ? (
            <div className="relative bg-black rounded-2xl overflow-hidden border border-slate-800 max-w-lg mx-auto aspect-[4/3] flex items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              
              {/* Camera Action Overlay */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center space-x-3 z-10">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xl flex items-center space-x-2 cursor-pointer transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Label Photo</span>
                </button>

                <button
                  onClick={stopCamera}
                  className="px-4 py-3 bg-slate-900/90 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-800 border border-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedImage ? (
            /* IMAGE PREVIEW READY FOR ANALYSIS */
            <div className="bg-slate-950 p-6 rounded-2xl border-2 border-amber-500/40 text-center space-y-4 animate-fade-in">
              <div className="relative inline-block max-w-xs mx-auto">
                <img
                  src={selectedImage}
                  alt="Scanned Food Label"
                  className="max-h-64 object-contain rounded-xl border border-slate-800 mx-auto shadow-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-md"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-100 flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Label photo captured</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Ready to analyze ingredients, nutrition panel, and claims.
                </p>
              </div>

              {/* Primary Analyze CTA Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleAnalyzeSelectedImage}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Label ➔</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 transition-all"
                >
                  Choose Another Image
                </button>
              </div>
            </div>
          ) : (
            /* DRAG AND DROP / UPLOAD / CAMERA DROPZONE */
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
                dragOver
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="food-label-file-input"
              />

              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4 text-3xl shadow-lg">
                📷
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-slate-100 mb-1">
                {isTa ? 'புகைப்படத்தை இழுத்து விடவும் அல்லது பதிவேற்றவும்' : 'Drag & drop food label image here'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Supports JPG, PNG, WEBP. Front, ingredients or nutrition panel.
              </p>

              {/* Main 2 Scan Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take Photo</span>
                </button>

                <label
                  htmlFor="food-label-file-input"
                  className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-850 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: PRESET SAMPLE LABELS */}
      {activeTab === 'sample' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Select any real-world sample packaged food label to test instant analysis:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SAMPLE_LABELS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => handleSampleClick(sample)}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 cursor-pointer transition-all hover:bg-slate-850 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-2.5">
                    <img
                      src={sample.frontImage}
                      alt={sample.name}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block truncate">
                        {sample.brand}
                      </span>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 leading-snug truncate">
                        {sample.name}
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {sample.frontClaims.map((claim) => (
                      <span key={claim} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                        {claim}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{sample.nutrition.calories} kcal</span>
                  <span className="text-amber-400 font-bold group-hover:underline flex items-center space-x-1">
                    <span>Test Label ➔</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MANUAL INGREDIENT TEXT PASTE */}
      {activeTab === 'paste' && (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Paste Ingredient List Printed on Food Label
            </label>
            <textarea
              value={pastedIngredients}
              onChange={(e) => setPastedIngredients(e.target.value)}
              rows={4}
              placeholder="e.g. Refined Wheat Flour, Sugar, Palm Oil, Cocoa Solids, Maltodextrin, Soy Lecithin, Sodium Benzoate..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Nutrition Values (Optional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Calories (kcal)</span>
                <input
                  type="number"
                  placeholder="220"
                  value={pastedNutrition.calories}
                  onChange={(e) => setPastedNutrition({ ...pastedNutrition, calories: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Sugar (g)</span>
                <input
                  type="number"
                  placeholder="14"
                  value={pastedNutrition.sugar}
                  onChange={(e) => setPastedNutrition({ ...pastedNutrition, sugar: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Protein (g)</span>
                <input
                  type="number"
                  placeholder="12"
                  value={pastedNutrition.protein}
                  onChange={(e) => setPastedNutrition({ ...pastedNutrition, protein: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Fat (g)</span>
                <input
                  type="number"
                  placeholder="8.5"
                  value={pastedNutrition.fat}
                  onChange={(e) => setPastedNutrition({ ...pastedNutrition, fat: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Sat Fat (g)</span>
                <input
                  type="number"
                  placeholder="3.5"
                  value={pastedNutrition.satFat}
                  onChange={(e) => setPastedNutrition({ ...pastedNutrition, satFat: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Sodium (mg)</span>
                <input
                  type="number"
                  placeholder="210"
                  value={pastedNutrition.sodium}
                  onChange={(e) => setPastedNutrition({ ...pastedNutrition, sodium: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Pasted Ingredients ➔</span>
          </button>
        </form>
      )}

      {/* Investigation Pipeline Loader */}
      {isLoading && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center space-x-3 text-amber-300 text-xs font-semibold animate-pulse">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-400 flex-shrink-0" />
          <span>Analyzing food label with deterministic intelligence engine...</span>
        </div>
      )}

    </div>
  );
}

