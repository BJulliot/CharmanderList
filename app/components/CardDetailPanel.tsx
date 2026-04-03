"use client";

import { useEffect } from "react";
import { Card, LANG_FLAGS } from "@/lib/types";

interface CardDetailPanelProps {
  card: Card | null;
  onClose: () => void;
  onToggleOwned: (id: number, owned: boolean) => void;
}

const DETAIL_ROWS: { label: string; key: keyof Card }[] = [
  { label: "Set", key: "set_name" },
  { label: "Numéro", key: "number" },
  { label: "Rareté", key: "rarity" },
  { label: "Langue", key: "lang" },
  { label: "Année", key: "year" },
  { label: "Version / Notes", key: "version_notes" },
  { label: "Type d'art", key: "art_type" },
  { label: "Artwork", key: "artwork" },
];

export function CardDetailPanel({ card, onClose, onToggleOwned }: CardDetailPanelProps) {
  useEffect(() => {
    if (!card) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [card, onClose]);

  useEffect(() => {
    document.body.style.overflow = card ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [card]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${card ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-gray-950 border-l border-gray-800 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${card ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {card && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 shrink-0">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white truncate">{card.card_name}</h2>
                {card.set_name && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{card.set_name}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="ml-3 shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image zone — larger */}
              <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 flex justify-center items-center py-6 px-4">
                {card.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image_url}
                    alt={card.card_name}
                    className="rounded-xl shadow-2xl max-h-80 object-contain drop-shadow-[0_4px_20px_rgba(227,53,13,0.3)]"
                  />
                ) : (
                  <div className="w-52 h-72 rounded-xl bg-gray-800 border border-gray-700 flex flex-col items-center justify-center gap-3 text-gray-600">
                    <span className="text-5xl">🔥</span>
                    <span className="text-xs">Image non disponible</span>
                  </div>
                )}

                {/* Owned badge overlaid on image zone */}
                {card.owned ? (
                  <div className="absolute top-3 right-4 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <span>✓</span> Possédée
                  </div>
                ) : (
                  <div className="absolute top-3 right-4 bg-gray-800 text-gray-400 text-xs px-2.5 py-1 rounded-full border border-gray-700">
                    Non possédée
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="px-5 py-4 flex flex-col gap-4">
                <div className="rounded-xl overflow-hidden border border-gray-800">
                  {DETAIL_ROWS.map(({ label, key }, i) => {
                    const raw = card[key];
                    let value: string;
                    if (raw == null || raw === "") {
                      value = "—";
                    } else if (key === "lang") {
                      const l = String(raw);
                      value = `${LANG_FLAGS[l] ?? "🌐"} ${l}`;
                    } else {
                      value = String(raw);
                    }
                    return (
                      <div
                        key={key}
                        className={`flex items-start gap-3 px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-900/50"}`}
                      >
                        <span className="text-gray-600 shrink-0 w-28 text-xs pt-0.5 uppercase tracking-wider">
                          {label}
                        </span>
                        <span className={`font-medium break-words ${value === "—" ? "text-gray-700" : "text-gray-100"}`}>
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Owned toggle button */}
                <button
                  onClick={() => onToggleOwned(card.id, !card.owned)}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
                    card.owned
                      ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/40"
                      : "border-2 border-dashed border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {card.owned ? "✓ Dans ma collection" : "+ Ajouter à ma collection"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
