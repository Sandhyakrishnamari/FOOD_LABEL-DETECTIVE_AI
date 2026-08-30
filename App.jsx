import React, { useState, useEffect } from 'react';
import { Home, Search, History, Scale } from 'lucide-react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import ImageUploader from './components/Scanner/ImageUploader';
import PreprocessingPreview from './components/Scanner/PreprocessingPreview';
import ResultView from './components/Verdict/ResultView';
import IngredientLookup from './components/IngredientDetective/IngredientLookup';
import SafetyReport from './components/FoodSafetyLens/SafetyReport';
import UserProfileModal from './components/UserProfileModal';
import ProductComparison from './components/Comparison/ProductComparison';
import ScanHistory from './components/History/ScanHistory';

import FirstTimeWelcomeModal from './components/Welcome/FirstTimeWelcomeModal';
import CameraGuidanceModal from './components/Scanner/CameraGuidanceModal';
import InvestigationAnimationModal from './components/Scanner/InvestigationAnimationModal';

import { useUser } from './context/UserContext';
import { preprocessImage } from './services/imagePreprocessor';
import { performOfflineOCR } from './services/ocrService';
import { cleanOCRText } from './services/ocrCleaner';
import { analyzeLabelWithGemini } from './services/aiScanner';
import { parseIngredientsText } from './services/ingredientParser';
import { detectAllergens } from './services/allergenDetector';
import { parseNutritionData } from './services/nutritionParser';
import { evaluateMarketingClaims } from './services/marketingRules';
import { calculatePersonalizedScore } from './services/scoringEngine';
import { SAMPLE_LABELS } from './services/sampleData';
import { exportReportToPDF, exportScanToJSON } from './utils/exportHelper';

export default function App() {
  const { userGoals, apiKey, saveScan, savedScans, comparisonBuffer, t } = useUser();

  const [activeTab, setActiveTab] = useState('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningAnimation, setIsScanningAnimation] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isCameraTipsOpen, setIsCameraTipsOpen] = useState(false);

  // Show welcome modal once on initial load
  useEffect(() => {
    const hasVisited = localStorage.getItem('unavulens_visited');
    if (!hasVisited) {
      setIsWelcomeOpen(true);
      localStorage.setItem('unavulens_visited', 'true');
    }
  }, []);

  // Active Scan State
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [ocrConfidence, setOcrConfidence] = useState(92);
  const [sectionConfidence, setSectionConfidence] = useState({});

  const [cleanTextResult, setCleanTextResult] = useState('');
  const [rawTextResult, setRawTextResult] = useState('');
  const [metadataResult, setMetadataResult] = useState({});

  const [currentScanResult, setCurrentScanResult] = useState(null);

  // Main Pipeline Execution Handler
  const handleScanStart = async (options) => {
    setIsLoading(true);
    setIsScanningAnimation(true);
    setActiveTab('scanner');
    setOriginalImage(null);
    setProcessedImage(null);
    setOcrConfidence(92);
    setCleanTextResult('');
    setRawTextResult('');
    setMetadataResult({});

    try {
      let rawTextOutput = '';
      let rawNutrition = {};
      let productName = 'Packaged Food Item';
      let selectedClaims = options.selectedClaims || [];

      // BRANCH 1: PRESET SAMPLE LABEL
      if (options.type === 'sample') {
        const sample = options.sampleData;
        productName = sample.name;
        rawTextOutput = sample.rawIngredients;
        rawNutrition = sample.nutrition;
        setOriginalImage(sample.frontImage);
        setProcessedImage(sample.frontImage);
      }
      // BRANCH 2: MANUAL TEXT PASTE
      else if (options.type === 'manual') {
        rawTextOutput = options.rawIngredients;
        rawNutrition = options.nutrition;
        productName = 'Manual Label Input';
      }
      // BRANCH 3: MULTI-FILE CASE / SINGLE FILE / CAMERA
      else if (options.type === 'multiFile' || options.type === 'file' || options.type === 'camera') {
        const primaryUrl = options.primaryImage || options.imageDataUrl || (options.photos && options.photos[0]?.url);
        setOriginalImage(primaryUrl);

        const preprocessed = await preprocessImage(primaryUrl);
        setProcessedImage(preprocessed.processedDataUrl);

        if (apiKey) {
          try {
            const aiData = await analyzeLabelWithGemini(preprocessed.processedDataUrl, apiKey);
            productName = aiData.productName || 'Analyzed Packaged Label';
            rawTextOutput = aiData.ingredientsText || '';
            rawNutrition = aiData.nutrition || {};
            if (aiData.marketingClaimsDetected) {
              selectedClaims = Array.from(new Set([...selectedClaims, ...aiData.marketingClaimsDetected]));
            }
          } catch (geminiErr) {
            console.warn('Gemini Vision failed, falling back to offline OCR:', geminiErr);
            const ocrResult = await performOfflineOCR(preprocessed.processedDataUrl);
            rawTextOutput = ocrResult.text;
            setOcrConfidence(ocrResult.confidence);
          }
        } else {
          const ocrResult = await performOfflineOCR(preprocessed.processedDataUrl);
          rawTextOutput = ocrResult.text;
          setOcrConfidence(ocrResult.confidence);
        }
      }

      // Step 3: OCR Text Cleaning
      const cleanedObj = cleanOCRText(rawTextOutput, ocrConfidence);
      const cleanIngredientsText = cleanedObj.cleanText || rawTextOutput;

      setCleanTextResult(cleanIngredientsText);
      setRawTextResult(cleanedObj.rawText || rawTextOutput);
      setMetadataResult(cleanedObj.metadata || {});
      setSectionConfidence(cleanedObj.sectionConfidence || {});

      // DETERMINISTIC INTELLIGENCE PIPELINE
      runAnalysisPipeline(
        productName,
        cleanIngredientsText,
        cleanedObj.rawText || rawTextOutput,
        cleanedObj.metadata,
        rawNutrition,
        selectedClaims,
        originalImage || options.primaryImage
      );
    } catch (err) {
      console.error('Scan pipeline error:', err);
      alert(`Scan failed: ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runAnalysisPipeline = (productName, cleanIngredientsText, rawOcrText, metadata, rawNutrition, selectedClaims, frontImg) => {
    const parsedIngredients = parseIngredientsText(cleanIngredientsText);
    const allergensDetected = detectAllergens(cleanIngredientsText, parsedIngredients);
    const parsedNutrition = parseNutritionData(cleanIngredientsText, rawNutrition);

    const marketingEvaluation = evaluateMarketingClaims({
      ingredientsText: cleanIngredientsText,
      nutrition: parsedNutrition.nutrition,
      marketingClaimsDetected: selectedClaims
    }, selectedClaims);

    const scoreData = calculatePersonalizedScore({
      parsedIngredients,
      nutritionData: parsedNutrition,
      allergensDetected,
      marketingEvaluation
    }, userGoals);

    const finalScanResult = {
      id: `scan_${Date.now()}`,
      timestamp: new Date().toISOString(),
      productName,
      frontImage: frontImg || null,
      rawIngredients: cleanIngredientsText,
      rawOcrText: rawOcrText || cleanIngredientsText,
      metadata: metadata || {},
      parsedIngredients,
      allergensDetected,
      nutritionData: parsedNutrition,
      marketingEvaluation,
      marketingTruthIndex: marketingEvaluation.overallTruthIndex,
      scoreData
    };

    setCurrentScanResult(finalScanResult);
    saveScan(finalScanResult);
  };

  const handleReparseEditedText = (editedText) => {
    if (!currentScanResult) return;
    setCleanTextResult(editedText);
    runAnalysisPipeline(
      currentScanResult.productName,
      editedText,
      currentScanResult.rawOcrText,
      currentScanResult.metadata,
      currentScanResult.nutritionData?.nutrition || {},
      [],
      currentScanResult.frontImage
    );
  };

  const handleLoadScan = (scan) => {
    setCurrentScanResult(scan);
    setCleanTextResult(scan.rawIngredients || '');
    setRawTextResult(scan.rawOcrText || scan.rawIngredients || '');
    setMetadataResult(scan.metadata || {});
    setOriginalImage(scan.frontImage);
    setProcessedImage(scan.frontImage);
    setActiveTab('scanner');
  };

  const handleTrySampleFromLanding = (sampleItem) => {
    const sample = sampleItem || SAMPLE_LABELS[0];
    handleScanStart({
      type: 'sample',
      sampleData: sample,
      selectedClaims: sample.frontClaims
    });
  };

  const handleResetForNewScan = () => {
    setCurrentScanResult(null);
    setCleanTextResult('');
    setRawTextResult('');
    setOriginalImage(null);
    setProcessedImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 pb-20 md:pb-0">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main App Body */}
      <main className="flex-1 w-full">
        
        {/* TAB 0: LANDING PAGE */}
        {activeTab === 'landing' && (
          <LandingPage
            onStartScanner={() => {
              handleResetForNewScan();
              setActiveTab('scanner');
            }}
            onTrySample={handleTrySampleFromLanding}
          />
        )}

        {/* TAB 1: SCANNER & RESULT EXPERIENCE */}
        {activeTab === 'scanner' && (
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* If no scan yet, show ImageUploader */}
            {!currentScanResult && (
              <ImageUploader
                onScanStart={handleScanStart}
                isLoading={isLoading}
                onOpenCameraTips={() => setIsCameraTipsOpen(true)}
              />
            )}

            {/* OCR Quality and Raw text inspector with low-confidence alert & retake actions */}
            {(cleanTextResult || rawTextResult) && (
              <PreprocessingPreview
                cleanText={cleanTextResult}
                rawText={rawTextResult}
                metadata={metadataResult}
                sectionConfidence={sectionConfidence}
                ocrConfidence={ocrConfidence}
                originalUrl={originalImage}
                processedUrl={processedImage}
                onReparseText={handleReparseEditedText}
                onRetakePhoto={handleResetForNewScan}
                onUploadAnother={handleResetForNewScan}
              />
            )}

            {/* 🔴 REDESIGNED UNAVULENS RESULT EXPERIENCE (Level 1, Level 2, Level 3) */}
            {currentScanResult && (
              <ResultView
                scanResult={currentScanResult}
                onScanAnother={handleResetForNewScan}
                onSwitchToComparison={() => setActiveTab('comparison')}
                onSelectAlternative={() => setActiveTab('comparison')}
              />
            )}

          </div>
        )}

        {/* TAB 2: INGREDIENT LENS (Search Database Without Scanning) */}
        {activeTab === 'ingredientLens' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <IngredientLookup />
          </div>
        )}

        {/* TAB 3: FOOD SAFETY LENS DASHBOARD */}
        {activeTab === 'safetyLens' && (
          <SafetyReport scanResult={currentScanResult} />
        )}

        {/* TAB 4: SIDE-BY-SIDE PRODUCT COMPARISON */}
        {activeTab === 'comparison' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ProductComparison onSwitchToScanner={() => {
              handleResetForNewScan();
              setActiveTab('scanner');
            }} />
          </div>
        )}

        {/* TAB 5: SAVED CASE HISTORY (MY SCANS) */}
        {activeTab === 'history' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ScanHistory
              onLoadScan={handleLoadScan}
              onSwitchToComparison={() => setActiveTab('comparison')}
              onSwitchToScanner={() => {
                handleResetForNewScan();
                setActiveTab('scanner');
              }}
            />
          </div>
        )}

      </main>

      {/* 📱 Sticky Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('landing')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'landing' ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => {
            if (activeTab !== 'scanner' || currentScanResult) {
              handleResetForNewScan();
            }
            setActiveTab('scanner');
          }}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
            activeTab === 'scanner' ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center -mt-3 shadow-lg shadow-amber-500/30">
            <Search className="w-4 h-4 font-black" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Scan</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'history' ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">My Scans</span>
          {savedScans && savedScans.length > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-slate-800 text-amber-300 text-[9px] font-mono font-black rounded-full flex items-center justify-center border border-slate-700">
              {savedScans.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            activeTab === 'comparison' ? 'text-amber-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Scale className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Compare</span>
          {comparisonBuffer && comparisonBuffer.length > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-amber-400 text-slate-950 text-[9px] font-mono font-black rounded-full flex items-center justify-center">
              {comparisonBuffer.length}
            </span>
          )}
        </button>
      </div>

      {/* Global Modals & Overlays */}
      <FirstTimeWelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        onSelectAction={(tab) => {
          setActiveTab(tab);
          if (tab === 'scanner') handleResetForNewScan();
        }}
      />

      <CameraGuidanceModal
        isOpen={isCameraTipsOpen}
        onClose={() => setIsCameraTipsOpen(false)}
        onProceed={() => {}}
      />

      {/* Realistic 6-stage investigation animation */}
      <InvestigationAnimationModal
        isScanning={isScanningAnimation}
        onComplete={() => setIsScanningAnimation(false)}
      />

      <UserProfileModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

    </div>
  );
}
