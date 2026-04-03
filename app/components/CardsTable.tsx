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
  { key: "number", label: "#", className: "w-16" },
  { key: "rarity", label: "Rareté", className: "w-20" },
  { key: "lang", label: "Langue", className: "w-24" },
  { key: "year", label: "Année", className: "w-20" },
  { key: "version_notes", label: "Version / Notes" },
  { key: "art_type", label: "Type d'art" },
  { key: "artwork", label: "Artwork" },
  { key: "owned", label: "Possédée", className: "w-24 text-center" },
];

export function CardsTable({
  cards,
  filters,
  onSort,
  onToggleOwned,
  onDelete,
  onCardClick,
}: CardsTableProps) {
  const SortIcon = ({ col }: { col: string }) => {
    if (filters.sort !== col)
      return <span className="ml-1 text-gray-600">↕</span>;
    return (
      <span className="ml-1 text-red-400">
        {filters.dir === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
        Aucune carte trouvée.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-900 border-b border-gray-700 sticky top-0">
            {/* Thumbnail col header */}
            <th className="px-2 py-2.5 w-10" />
            {COLS.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer select-none hover:text-gray-200 transition-colors ${col.className ?? ""}`}
                onClick={() => onSort(col.key)}
              >
                {col.label}
                <SortIcon col={col.key} />
              </th>
            ))}
            <th className="px-3 py-2.5 w-12" />
          </tr>
        </thead>
        <tbody>
          {cards.map((card, idx) => (
            <tr
              key={card.id}
              className={`border-b border-gray-800 transition-colors cursor-pointer ${
                card.owned
                  ? "bg-green-950/30 hover:bg-green-950/50"
                  : idx % 2 === 0
                  ? "bg-gray-900/50 hover:bg-gray-800/50"
                  : "bg-gray-950 hover:bg-gray-800/50"
              }`}
              onClick={() => onCardClick(card)}
            >
              {/* Thumbnail */}
              <td
                className="px-2 py-1"
                onClick={(e) => e.stopPropagation()}
              >
                {card.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image_url}
                    alt={card.card_name}
                    width={20}
                    height={28}
                    className="w-5 h-7 object-cover rounded cursor-pointer hover:scale-150 transition-transform origin-left"
                    onClick={() => onCardClick(card)}
                    title={card.card_name}
                  />
                ) : (
                  <div className="w-5 h-7 bg-gray-800 rounded flex items-center justify-center text-gray-600 text-[8px]">
                    🔥
                  </div>
                )}
              </td>

              <td className="px-3 py-2 font-medium text-gray-100 max-w-48 truncate">
                {card.card_name}
              </td>
              <td className="px-3 py-2 text-gray-300 max-w-44 truncate">
                {card.set_name ?? "—"}
              </td>
              <td className="px-3 py-2 text-gray-400 font-mono text-xs">
                {card.number ?? "—"}
              </td>
              <td className="px-3 py-2 text-gray-400">
                {card.rarity ?? "—"}
              </td>
              <td className="px-3 py-2">
                {card.lang ? (
                  <span className="inline-flex items-center gap-1 bg-gray-800 rounded px-1.5 py-0.5 text-xs font-medium text-gray-200">
                    {LANG_FLAGS[card.lang] ?? "🌐"} {card.lang}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="px-3 py-2 text-gray-400">
                {card.year ?? "—"}
              </td>
              <td className="px-3 py-2 text-gray-400 max-w-36 truncate">
                {card.version_notes ?? "—"}
              </td>
              <td className="px-3 py-2 text-gray-400 max-w-32 truncate">
                {card.art_type ?? "—"}
              </td>
              <td className="px-3 py-2 text-gray-400 max-w-36 truncate">
                {card.artwork ?? "—"}
              </td>
              <td
                className="px-3 py-2 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onToggleOwned(card.id, !card.owned)}
                  title={card.owned ? "Marquer comme non possédée" : "Marquer comme possédée"}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center mx-auto transition-all ${
                    card.owned
                      ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                      : "border-gray-600 text-transparent hover:border-gray-400"
                  }`}
                >
                  ✓
                </button>
              </td>
              <td
                className="px-3 py-2 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onDelete(card.id)}
                  title="Supprimer"
                  className="text-gray-600 hover:text-red-400 transition-colors text-xs"
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
