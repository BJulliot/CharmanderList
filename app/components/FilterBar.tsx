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
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
      <div className="flex flex-wrap gap-3 items-end">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-48">
          <label className="text-xs text-gray-400">Recherche</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
            placeholder="Nom ou set..."
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Number */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Numéro</label>
          <input
            type="text"
            value={filters.number}
            onChange={(e) => onChange({ number: e.target.value, page: 1 })}
            placeholder="ex: 13/102"
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 w-28"
          />
        </div>

        {/* Lang */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Langue</label>
          <select
            value={filters.lang}
            onChange={(e) => onChange({ lang: e.target.value, page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500"
          >
            <option value="">Toutes</option>
            {langs.map((l) => (
              <option key={l} value={l}>
                {LANG_FLAGS[l] ?? "🌐"} {l}
              </option>
            ))}
          </select>
        </div>

        {/* Set */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Set</label>
          <select
            value={filters.set}
            onChange={(e) => onChange({ set: e.target.value, page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500 max-w-52"
          >
            <option value="">Tous</option>
            {sets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Rarity */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Rareté</label>
          <select
            value={filters.rarity}
            onChange={(e) => onChange({ rarity: e.target.value, page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500"
          >
            <option value="">Toutes</option>
            {rarities.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Art Type */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Type d&apos;art</label>
          <select
            value={filters.art_type}
            onChange={(e) => onChange({ art_type: e.target.value, page: 1 })}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500"
          >
            <option value="">Tous</option>
            {artTypes.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Owned toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Possession</label>
          <select
            value={filters.owned}
            onChange={(e) =>
              onChange({ owned: e.target.value as Filters["owned"], page: 1 })
            }
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-red-500"
          >
            <option value="all">Toutes</option>
            <option value="1">Possédées</option>
            <option value="0">Non possédées</option>
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={() =>
            onChange({
              search: "",
              number: "",
              lang: "",
              set: "",
              rarity: "",
              art_type: "",
              owned: "all",
              page: 1,
            })
          }
          className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors self-end"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
