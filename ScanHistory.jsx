import React, { useState } from 'react';
import { History, Search, Trash2, ExternalLink, Scale, Download, Calendar, ArrowUpDown, Filter } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { exportScanToJSON } from '../../utils/exportHelper';

export default function ScanHistory({ onLoadScan, onSwitchToComparison }) {
  const { savedScans, deleteScan, clearHistory, toggleCompareScan, comparisonBuffer, t } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // newest, oldest, scoreHigh, scoreLow

  // Filter scans by search term
  const filtered = savedScans.filter(s => {
    return s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rawIngredients && s.rawIngredients.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Sort scans
  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
    if (sortOrder === 'oldest') return new Date(a.timestamp || 0) - new Date(b.timestamp || 0);
    if (sortOrder === 'scoreHigh') return (b.scoreData?.score || 0) - (a.scoreData?.score || 0);
    if (sortOrder === 'scoreLow') return (a.scoreData?.score || 0) - (b.scoreData?.score || 0);
    return 0;
  });

  // Group scans chronologically into Today, Yesterday, Older
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  const grouped = {
    today: [],
    yesterday: [],
    older: []
  };

  sorted.forEach(scan => {
    const scanTime = new Date(scan.timestamp || now).getTime();
    const diffDays = Math.floor((now - scanTime) / oneDayMs);

    if (diffDays === 0) {
      grouped.today.push(scan);
    } else if (diffDays === 1) {
      grouped.yesterday.push(scan);
    } else {
      grouped.older.push(scan);
    }
  });

  const getVerdictBadge = (score) => {
    if (score >= 80) return <span className="text-emerald-400 font-bold">🟢 {score}/100</span>;
    if (score >= 65) return <span className="text-amber-400 font-bold">⚠️ {score}/100</span>;
    return <span className="text-rose-400 font-bold">🔴 {score}/100</span>;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 max-w-5xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl">
            📜
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              My Scans
            </h2>
            <p className="text-xs text-slate-400">
              Review and compare your previously analyzed packaged food labels.
            </p>
          </div>
        </div>

        {savedScans.length > 0 && (
          <button
            onClick={() => { if (confirm('Clear all scan history?')) clearHistory(); }}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1.5 px-3 py-1.5 bg-rose-500/10 rounded-xl border border-rose-500/20 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Search & Sort Controls */}
      {savedScans.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search previous scans by product or ingredient name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-slate-500" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-amber-500 focus:outline-none font-mono"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="scoreHigh">Sort: Highest Score</option>
              <option value="scoreLow">Sort: Lowest Score</option>
            </select>
          </div>
        </div>
      )}

      {/* Chronologically Grouped Feed */}
      {sorted.length > 0 ? (
        <div className="space-y-6">
          {/* TODAY */}
          {grouped.today.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {grouped.today.map((scan) => (
                  <ScanHistoryCard
                    key={scan.id}
                    scan={scan}
                    onLoadScan={onLoadScan}
                    onDelete={deleteScan}
                    onToggleCompare={toggleCompareScan}
                    isCompared={comparisonBuffer.some(c => c.id === scan.id)}
                    onSwitchToComparison={onSwitchToComparison}
                  />
                ))}
              </div>
            </div>
          )}

          {/* YESTERDAY */}
          {grouped.yesterday.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Yesterday</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {grouped.yesterday.map((scan) => (
                  <ScanHistoryCard
                    key={scan.id}
                    scan={scan}
                    onLoadScan={onLoadScan}
                    onDelete={deleteScan}
                    onToggleCompare={toggleCompareScan}
                    isCompared={comparisonBuffer.some(c => c.id === scan.id)}
                    onSwitchToComparison={onSwitchToComparison}
                  />
                ))}
              </div>
            </div>
          )}

          {/* OLDER */}
          {grouped.older.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>Previous Days</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {grouped.older.map((scan) => (
                  <ScanHistoryCard
                    key={scan.id}
                    scan={scan}
                    onLoadScan={onLoadScan}
                    onDelete={deleteScan}
                    onToggleCompare={toggleCompareScan}
                    isCompared={comparisonBuffer.some(c => c.id === scan.id)}
                    onSwitchToComparison={onSwitchToComparison}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl mx-auto text-amber-400">
            🔍
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-200">
              Your food detective journey starts here.
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan your first food label to track ingredients, uncover hidden sugars, and compare products.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

function ScanHistoryCard({ scan, onLoadScan, onDelete, onToggleCompare, isCompared, onSwitchToComparison }) {
  const score = scan.scoreData?.score || 75;
  const nutrition = scan.nutritionData?.nutrition || {};
  const sugar = nutrition.sugar ?? 14;
  const protein = nutrition.protein ?? 3;

  return (
    <div className="bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-3">
          {scan.frontImage ? (
            <img src={scan.frontImage} alt={scan.productName} className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg flex-shrink-0">
              🏷️
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-100 leading-snug">
              {scan.productName}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                🍬 Sugar: {sugar}g
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                💪 Protein: {protein}g
              </span>
            </div>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className={`text-base font-black ${score >= 80 ? 'text-emerald-400' : score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-500 block">/ 100</span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
        <button
          onClick={() => onLoadScan(scan)}
          className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Analysis</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => { onToggleCompare(scan); if (onSwitchToComparison) onSwitchToComparison(); }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center space-x-1 cursor-pointer ${
              isCompared
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <Scale className="w-3 h-3" />
            <span>{isCompared ? 'Comparing' : '+ Compare'}</span>
          </button>

          <button
            onClick={() => onDelete(scan.id)}
            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete from history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
