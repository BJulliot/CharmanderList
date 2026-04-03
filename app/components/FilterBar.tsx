"use client";

import { Filters, LANG_FLAGS } from "@/lib/types";

interface FilterBarProps {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  sets: string[];
  rarities: string[];
  artTypes: string[];
  langs: string[];
}

export function FilterBar({
  filters,
  onChange,
  sets,
  rarities,
  artTypes,
  langs,
}: FilterBarProps) {
  const activeCount = [
    filters.search,
    filters.number,
    filters.lang,
    filters.set,
    filters.rarity,
    filters.art_type,
    filters.owned !== "all" ? filters.owned : "",
  ].filter(Boolean).length;

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
      <div className="flex flex-wrap gap-2 items-end">

        {/* Search + number group */}
        <div className="flex gap-2 flex-1 min-w-72">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Recherche</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value, page: 1 })}
              placeholder="Nom ou set…"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 uppercase tracking-wider">N°</label>
            <input
              type="text"
              value={filters.number}
              onChange={(e) => onChange({ number: e.target.value, page: 1 })}
              placeholder="13/102"
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors w-24 font-mono"
            />
          </div>
        </div>

        {/* Lang */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Langue</label>
          <select
            value={filters.lang}
            onChange={(e) => onChange({ lang: e.target.value, page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500 transition-colors"
          >
            <option value="">Toutes</option>
            {langs.map((l) => (
              <option key={l} value={l}>{LANG_FLAGS[l] ?? "🌐"} {l}</option>
            ))}
          </select>
        </div>

        {/* Set */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Set</label>
          <select
            value={filters.set}
            onChange={(e) => onChange({ set: e.target.value, page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500 transition-colors max-w-48"
          >
            <option value="">Tous</option>
            {sets.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Rarity */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Rareté</label>
          <select
            value={filters.rarity}
            onChange={(e) => onChange({ rarity: e.target.value, page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500 transition-colors"
          >
            <option value="">Toutes</option>
            {rarities.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Art type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Type d&apos;art</label>
          <select
            value={filters.art_type}
            onChange={(e) => onChange({ art_type: e.target.value, page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500 transition-colors"
          >
            <option value="">Tous</option>
            {artTypes.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Owned */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 uppercase tracking-wider">Possession</label>
          <select
            value={filters.owned}
            onChange={(e) => onChange({ owned: e.target.value as Filters["owned"], page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500 transition-colors"
          >
            <option value="all">Toutes</option>
            <option value="1">✓ Possédées</option>
            <option value="0">✗ Non possédées</option>
          </select>
        </div>

        {/* Reset — only shown when filters are active */}
        {activeCount > 0 && (
          <button
            onClick={() => onChange({ search: "", number: "", lang: "", set: "", rarity: "", art_type: "", owned: "all", page: 1 })}
            className="self-end px-3 py-1.5 text-xs bg-red-900/40 hover:bg-red-900/70 border border-red-800/50 rounded-lg text-red-300 transition-colors flex items-center gap-1"
          >
            ✕ Réinitialiser
            <span className="bg-red-700 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
              {activeCount}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
