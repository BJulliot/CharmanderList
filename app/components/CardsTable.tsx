"use client";

import { Card, Filters, LANG_FLAGS } from "@/lib/types";

interface CardsTableProps {
  cards: Card[];
  filters: Filters;
  onSort: (col: string) => void;
  onToggleOwned: (id: number, owned: boolean) => void;
  onDelete: (id: number) => void;
  onCardClick: (card: Card) => void;
}

const COLS: { key: string; label: string; className?: string }[] = [
  { key: "card_name", label: "Nom" },
  { key: "set_name", label: "Set" },
  { key: "number", label: "#", className: "w-20" },
  { key: "rarity", label: "Rareté", className: "w-24" },
  { key: "lang", label: "Langue", className: "w-28" },
  { key: "year", label: "Année", className: "w-16" },
  { key: "version_notes", label: "Notes" },
  { key: "art_type", label: "Type d'art", className: "w-32" },
  { key: "owned", label: "Possédée", className: "w-24 text-center" },
];

const LANG_COLORS: Record<string, string> = {
  ENG: "bg-blue-900/50 text-blue-200 border-blue-700/40",
  FRE: "bg-indigo-900/50 text-indigo-200 border-indigo-700/40",
  GER: "bg-yellow-900/50 text-yellow-200 border-yellow-700/40",
  JPN: "bg-red-900/50 text-red-200 border-red-700/40",
  ITA: "bg-green-900/50 text-green-200 border-green-700/40",
  SPA: "bg-orange-900/50 text-orange-200 border-orange-700/40",
  POR: "bg-teal-900/50 text-teal-200 border-teal-700/40",
  KOR: "bg-violet-900/50 text-violet-200 border-violet-700/40",
  TCHI: "bg-pink-900/50 text-pink-200 border-pink-700/40",
  IND: "bg-rose-900/50 text-rose-200 border-rose-700/40",
  THA: "bg-cyan-900/50 text-cyan-200 border-cyan-700/40",
  SCHI: "bg-amber-900/50 text-amber-200 border-amber-700/40",
  LAT: "bg-lime-900/50 text-lime-200 border-lime-700/40",
  DUT: "bg-sky-900/50 text-sky-200 border-sky-700/40",
};

// Rarity badge colour
function RarityBadge({ rarity }: { rarity: string | null }) {
  if (!rarity || rarity === "—") return <span className="text-gray-600">—</span>;
  const r = rarity.trim();
  let cls = "text-gray-400 bg-gray-800/60";
  if (r === "C") cls = "text-gray-300 bg-gray-700/60";
  else if (r === "U") cls = "text-green-300 bg-green-900/40 border border-green-800/40";
  else if (r === "R") cls = "text-blue-300 bg-blue-900/40 border border-blue-800/40";
  else if (r === "RR" || r === "SR") cls = "text-purple-300 bg-purple-900/40 border border-purple-800/40";
  else if (r === "HR" || r === "UR") cls = "text-yellow-300 bg-yellow-900/40 border border-yellow-800/40";
  else if (r === "AR" || r === "SAR") cls = "text-pink-300 bg-pink-900/40 border border-pink-800/40";
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold ${cls}`}>
      {r}
    </span>
  );
}

export function CardsTable({
  cards,
  filters,
  onSort,
  onToggleOwned,
  onDelete,
  onCardClick,
}: CardsTableProps) {
  const SortIcon = ({ col }: { col: string }) => {
    if (filters.sort !== col) return <span className="ml-1 text-gray-700">↕</span>;
    return <span className="ml-1 text-red-400">{filters.dir === "asc" ? "↑" : "↓"}</span>;
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-600 gap-2">
        <span className="text-4xl">🔍</span>
        <span className="text-sm">Aucune carte trouvée.</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-900 border-b border-gray-700 sticky top-0 z-10">
            {/* Thumbnail col header */}
            <th className="px-3 py-2.5 w-14" />
            {COLS.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-widest cursor-pointer select-none hover:text-gray-200 transition-colors ${col.className ?? ""}`}
                onClick={() => onSort(col.key)}
              >
                {col.label}
                <SortIcon col={col.key} />
              </th>
            ))}
            <th className="px-3 py-2.5 w-10" />
          </tr>
        </thead>
        <tbody>
          {cards.map((card, idx) => (
            <tr
              key={card.id}
              className={`border-b transition-colors cursor-pointer group ${
                card.owned
                  ? "border-green-900/40 bg-green-950/25 hover:bg-green-950/40"
                  : idx % 2 === 0
                  ? "border-gray-800/60 bg-gray-900/40 hover:bg-gray-800/60"
                  : "border-gray-800/60 bg-gray-950/60 hover:bg-gray-800/60"
              }`}
              onClick={() => onCardClick(card)}
            >
              {/* Thumbnail — larger & more visible */}
              <td className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                {card.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image_url}
                    alt={card.card_name}
                    width={32}
                    height={44}
                    className="w-8 h-11 object-cover rounded shadow-md cursor-pointer hover:scale-[2.5] hover:shadow-xl transition-transform duration-200 origin-left z-20 relative"
                    onClick={() => onCardClick(card)}
                    title={card.card_name}
                  />
                ) : (
                  <div className="w-8 h-11 bg-gray-800/80 rounded border border-gray-700/40 flex items-center justify-center text-gray-600 text-xs">
                    🔥
                  </div>
                )}
              </td>

              <td className="px-3 py-2 font-medium text-gray-100 max-w-44 truncate">
                {card.card_name}
              </td>
              <td className="px-3 py-2 text-gray-400 max-w-40 truncate text-xs">
                {card.set_name ?? "—"}
              </td>
              <td className="px-3 py-2 text-gray-400 font-mono text-xs">
                {card.number ?? "—"}
              </td>
              <td className="px-3 py-2">
                <RarityBadge rarity={card.rarity} />
              </td>
              <td className="px-3 py-2">
                {card.lang ? (
                  <span className={`inline-flex items-center gap-1 border rounded px-1.5 py-0.5 text-[11px] font-medium ${LANG_COLORS[card.lang] ?? "bg-gray-800 text-gray-300 border-gray-700"}`}>
                    {LANG_FLAGS[card.lang] ?? "🌐"} {card.lang}
                  </span>
                ) : "—"}
              </td>
              <td className="px-3 py-2 text-gray-500 text-xs tabular-nums">
                {card.year ?? "—"}
              </td>
              <td className="px-3 py-2 text-gray-500 max-w-36 truncate text-xs">
                {card.version_notes ?? "—"}
              </td>
              <td className="px-3 py-2 text-gray-400 text-xs">
                {card.art_type ?? "—"}
              </td>

              {/* Owned toggle */}
              <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onToggleOwned(card.id, !card.owned)}
                  title={card.owned ? "Retirer de ma collection" : "Ajouter à ma collection"}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all active:scale-90 ${
                    card.owned
                      ? "bg-green-500 text-white shadow-md shadow-green-900/50 hover:bg-green-400"
                      : "border-2 border-gray-700 text-transparent hover:border-gray-500 group-hover:border-gray-500"
                  }`}
                >
                  <span className={card.owned ? "text-white" : "text-gray-600"}>✓</span>
                </button>
              </td>

              {/* Delete */}
              <td className="px-2 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onDelete(card.id)}
                  title="Supprimer"
                  className="text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
