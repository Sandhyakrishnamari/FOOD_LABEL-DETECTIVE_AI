import React, { useState } from 'react';
import { Search, TestTube, LayoutGrid, Table as TableIcon, ChevronDown, ChevronUp } from 'lucide-react';
import IngredientCard from './IngredientCard';
import { useUser } from '../../context/UserContext';

export default function IngredientDetective({ parsedIngredients }) {
  const { t } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards');
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  if (!parsedIngredients || parsedIngredients.length === 0) return null;

  const filtered = parsedIngredients.filter(ing => {
    const matchesSearch = ing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ing.eNumber && ing.eNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ing.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'enumbers') return Boolean(ing.eNumber);
    if (activeFilter === 'additives') return ing.isAdditive || ing.category.includes('Additive');
    if (activeFilter === 'flags') return ing.riskStatus === 'flag' || ing.riskStatus === 'watch';
    return true;
  });

  const displayList = showAllIngredients ? filtered : filtered.slice(0, 4);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 space-y-4">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
            <TestTube className="w-6 h-6 text-amber-400" />
            <span>🧪 INGREDIENTS ({parsedIngredients.length} detected)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('ingredientDetective.subtitle')} — Top 4 key ingredients previewed below
          </p>
        </div>

        {/* View Switcher & Category Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'cards' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                viewMode === 'table' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Filter Badges */}
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            {t('ingredientDetective.all')} ({parsedIngredients.length})
          </button>
          <button
            onClick={() => setActiveFilter('enumbers')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeFilter === 'enumbers' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            {t('ingredientDetective.enumbers')}
          </button>
          <button
            onClick={() => setActiveFilter('flags')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeFilter === 'flags' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
            }`}
          >
            {t('ingredientDetective.flags')}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('ingredientDetective.searchPlaceholder')}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* PRIMARY VIEW: EASY-TO-READ INVESTIGATION CARDS */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayList.map((ing) => (
            <IngredientCard key={ing.id} ingredient={ing} />
          ))}
        </div>
      ) : (
        /* TABLE VIEW FALLBACK */
        <div className="overflow-x-auto my-2">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3">Order</th>
                <th className="py-2.5 px-3">Ingredient Name</th>
                <th className="py-2.5 px-3">Technical / E-Number</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayList.map((ing) => (
                <tr key={ing.id} className="hover:bg-slate-850 transition-all">
                  <td className="py-3 px-3 font-mono text-slate-500">#{ing.order}</td>
                  <td className="py-3 px-3 font-bold text-slate-200">
                    {ing.name} {ing.taName && <span className="text-amber-400 text-[11px] font-normal">({ing.taName})</span>}
                  </td>
                  <td className="py-3 px-3">
                    {ing.eNumber ? (
                      <span className="font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-bold">
                        {ing.eNumber}
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">{ing.category}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      ing.riskStatus === 'flag' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : ing.riskStatus === 'watch' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {ing.riskStatus === 'flag' ? '🔴 Flag' : ing.riskStatus === 'watch' ? '🟡 Watch' : '🟢 Good'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW ALL INGREDIENTS TOGGLE BUTTON */}
      {filtered.length > 4 && (
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setShowAllIngredients(!showAllIngredients)}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center space-x-1.5"
          >
            <span>{showAllIngredients ? 'Show Top 4 Only' : `[ VIEW ALL ${filtered.length} INGREDIENTS ]`}</span>
            {showAllIngredients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}

    </div>
  );
}
