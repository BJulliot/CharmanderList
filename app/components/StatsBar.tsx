"use client";

import { Stats, LANG_FLAGS } from "@/lib/types";

export function StatsBar({ stats }: { stats: Stats }) {
  const pct = stats.total > 0 ? (stats.owned / stats.total) * 100 : 0;

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      {/* Main counters */}
      <div className="flex flex-wrap items-center gap-6 mb-3">
        <div>
          <span className="text-gray-400 text-sm">Total cartes</span>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Possédées</span>
          <div className="text-2xl font-bold text-green-400">
            {stats.owned}{" "}
            <span className="text-base font-normal text-gray-400">
              ({pct.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Manquantes</span>
          <div className="text-2xl font-bold text-red-400">
            {stats.total - stats.owned}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden w-full max-w-xl">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              backgroundColor: "#E3350D",
            }}
          />
        </div>
      </div>

      {/* Language breakdown */}
      <div className="flex flex-wrap gap-2">
        {stats.byLang.map((ls) => (
          <div
            key={ls.lang}
            className="flex items-center gap-1 bg-gray-800 rounded-md px-2 py-1 text-xs"
          >
            <span>{LANG_FLAGS[ls.lang] ?? "🌐"}</span>
            <span className="font-medium text-gray-200">{ls.lang}</span>
            <span className="text-green-400">{ls.owned}</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-400">{ls.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
