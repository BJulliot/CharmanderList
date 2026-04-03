"use client";

import { Stats, LANG_FLAGS } from "@/lib/types";

const LANG_COLORS: Record<string, string> = {
  ENG: "bg-blue-900/60 border-blue-700/50 text-blue-200",
  FRE: "bg-indigo-900/60 border-indigo-700/50 text-indigo-200",
  GER: "bg-yellow-900/60 border-yellow-700/50 text-yellow-200",
  JPN: "bg-red-900/60 border-red-700/50 text-red-200",
  ITA: "bg-green-900/60 border-green-700/50 text-green-200",
  SPA: "bg-orange-900/60 border-orange-700/50 text-orange-200",
  POR: "bg-teal-900/60 border-teal-700/50 text-teal-200",
  KOR: "bg-violet-900/60 border-violet-700/50 text-violet-200",
  TCHI: "bg-pink-900/60 border-pink-700/50 text-pink-200",
  IND: "bg-rose-900/60 border-rose-700/50 text-rose-200",
  THA: "bg-cyan-900/60 border-cyan-700/50 text-cyan-200",
  SCHI: "bg-amber-900/60 border-amber-700/50 text-amber-200",
  LAT: "bg-lime-900/60 border-lime-700/50 text-lime-200",
  DUT: "bg-sky-900/60 border-sky-700/50 text-sky-200",
};

export function StatsBar({ stats }: { stats: Stats }) {
  const pct = stats.total > 0 ? (stats.owned / stats.total) * 100 : 0;

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      {/* Main counters + progress */}
      <div className="flex flex-wrap items-center gap-8 mb-4">
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-widest">Total</span>
          <div className="text-3xl font-bold text-white tabular-nums">{stats.total}</div>
        </div>
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-widest">Possédées</span>
          <div className="text-3xl font-bold text-green-400 tabular-nums">
            {stats.owned}
            <span className="text-sm font-normal text-gray-500 ml-2">({pct.toFixed(1)}%)</span>
          </div>
        </div>
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-widest">Manquantes</span>
          <div className="text-3xl font-bold tabular-nums" style={{ color: "#E3350D" }}>
            {stats.total - stats.owned}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 min-w-48">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Progression collection</span>
            <span className="font-medium text-gray-300">{pct.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #E3350D, #FF6B35)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Language breakdown */}
      <div className="flex flex-wrap gap-1.5">
        {stats.byLang.map((ls) => {
          const langPct = ls.total > 0 ? (ls.owned / ls.total) * 100 : 0;
          const colorClass = LANG_COLORS[ls.lang] ?? "bg-gray-800 border-gray-700 text-gray-300";
          return (
            <div
              key={ls.lang}
              className={`flex items-center gap-1.5 border rounded px-2 py-1 text-xs ${colorClass}`}
            >
              <span>{LANG_FLAGS[ls.lang] ?? "🌐"}</span>
              <span className="font-semibold">{ls.lang}</span>
              <span className="opacity-70">{ls.owned}/{ls.total}</span>
              {ls.total > 0 && (
                <div className="w-10 h-1 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-current opacity-80 rounded-full"
                    style={{ width: `${langPct}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
