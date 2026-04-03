"use client";

import { useEffect } from "react";
import { Card, LANG_FLAGS } from "@/lib/types";

interface CardDetailPanelProps {
  card: Card | null;
  onClose: () => void;
  onToggleOwned: (id: number, owned: boolean) => void;
}

const DETAIL_ROWS: { label: string; key: keyof Card }[] = [
  { label: "Nom", key: "card_name" },
  { label: "Set", key: "set_name" },
  { label: "#", key: "number" },
  { label: "Rareté", key: "rarity" },
  { label: "Langue", key: "lang" },
  { label: "Année", key: "year" },
  { label: "Version / Notes", key: "version_notes" },
  { label: "Type d'art", key: "art_type" },
  { label: "Artwork", key: "artwork" },
];

export function CardDetailPanel({
  card,
  onClose,
  onToggleOwned,
}: CardDetailPanelProps) {
  // Close on Escape key
  useEffect(() => {
    if (!card) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [card, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (card) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [card]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          card ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] max-w-full bg-gray-900 border-l border-gray-700 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          card ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Détail de la carte"
      >
        {card && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 shrink-0">
              <h2 className="text-base font-semibold text-white truncate pr-2">
                {card.card_name}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-xl leading-none shrink-0"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">
              {/* Card image */}
              <div className="flex justify-center">
                {card.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={card.image_url}
                    alt={card.card_name}
                    className="rounded-lg shadow-lg max-h-64 object-contain"
                  />
                ) : (
                  <div className="w-44 h-60 rounded-lg bg-gray-800 border border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-500">
                    <span className="text-4xl">🔥</span>
                    <span className="text-xs">Pas d&apos;image</span>
                  </div>
                )}
              </div>

              {/* Details grid */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
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
                      className={`flex items-start gap-2 px-3 py-2 text-sm ${
                        i % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                      }`}
                      style={
                        i % 2 !== 0
                          ? { backgroundColor: "rgba(55,65,81,0.6)" }
                          : undefined
                      }
                    >
                      <span className="text-gray-400 shrink-0 w-32 text-xs pt-0.5">
                        {label}
                      </span>
                      <span className="text-gray-100 font-medium break-words">
                        {value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Owned toggle */}
              <button
                onClick={() => onToggleOwned(card.id, !card.owned)}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
                  card.owned
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600"
                }`}
              >
                {card.owned ? "✓ Possédée" : "Marquer comme possédée"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
