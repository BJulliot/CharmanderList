"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { StatsBar } from "./StatsBar";
import { FilterBar } from "./FilterBar";
import { CardsTable } from "./CardsTable";
import { Pagination } from "./Pagination";
import { AddCardModal } from "./AddCardModal";
import { CardDetailPanel } from "./CardDetailPanel";
import { Toast, useToast } from "./Toast";
import {
  type ApiResponse,
  type Filters,
  type Stats,
  type Card,
} from "@/lib/types";

interface MetaOptions {
  sets: string[];
  rarities: string[];
  artTypes: string[];
  langs: string[];
  hasCardsWithoutImages: boolean;
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  number: "",
  lang: "",
  set: "",
  rarity: "",
  art_type: "",
  owned: "all",
  page: 1,
  sort: "id",
  dir: "asc",
};

const DEFAULT_STATS: Stats = { total: 0, owned: 0, byLang: [] };

export function CollectionClient({ meta }: { meta: MetaOptions }) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [syncing, setSyncing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { toasts, addToast, dismissToast } = useToast();

  const fetchCards = useCallback(async (f: Filters) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(f.search && { search: f.search }),
        ...(f.number && { number: f.number }),
        ...(f.lang && { lang: f.lang }),
        ...(f.set && { set: f.set }),
        ...(f.rarity && { rarity: f.rarity }),
        ...(f.art_type && { art_type: f.art_type }),
        ...(f.owned !== "all" && { owned: f.owned }),
        page: String(f.page),
        limit: "50",
        sort: f.sort,
        dir: f.dir,
      });
      const res = await fetch(`/api/cards?${params}`, {
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error("Fetch failed");
      const json: ApiResponse = await res.json();
      setData(json);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCards(filters);
  }, [filters, fetchCards]);

  // Auto-populate images on first load if needed
  useEffect(() => {
    if (meta.hasCardsWithoutImages) {
      fetch("/api/images/populate", { method: "POST" }).catch(() => {
        // Silent background operation — no need to surface errors
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount

  const updateFilters = useCallback((partial: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleSort = useCallback(
    (col: string) => {
      setFilters((prev) => ({
        ...prev,
        sort: col,
        dir: prev.sort === col && prev.dir === "asc" ? "desc" : "asc",
        page: 1,
      }));
    },
    []
  );

  const handleToggleOwned = useCallback(async (id: number, owned: boolean) => {
    // Optimistic update in list
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        cards: prev.cards.map((c) =>
          c.id === id ? { ...c, owned: owned ? 1 : 0 } : c
        ),
        stats: {
          ...prev.stats,
          owned: prev.stats.owned + (owned ? 1 : -1),
          byLang: prev.stats.byLang.map((ls) => {
            const card = prev.cards.find((c) => c.id === id);
            if (!card || card.lang !== ls.lang) return ls;
            return { ...ls, owned: ls.owned + (owned ? 1 : -1) };
          }),
        },
      };
    });

    // Optimistic update in detail panel
    setSelectedCard((prev) =>
      prev?.id === id ? { ...prev, owned: owned ? 1 : 0 } : prev
    );

    try {
      await fetch(`/api/cards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owned }),
      });
    } catch {
      fetchCards(filters);
    }
  }, [filters, fetchCards]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!confirm("Supprimer cette carte ?")) return;
      try {
        await fetch(`/api/cards/${id}`, { method: "DELETE" });
        setSelectedCard((prev) => (prev?.id === id ? null : prev));
        fetchCards(filters);
      } catch {
        console.error("Delete failed");
      }
    },
    [filters, fetchCards]
  );

  const handleSync = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      const json: { added: number; already_exists: number; total_fetched: number } =
        await res.json();

      // Also trigger image population for any new cards
      fetch("/api/images/populate", { method: "POST" }).catch(() => {});

      if (json.added > 0) {
        addToast(`${json.added} nouvelle${json.added > 1 ? "s" : ""} carte${json.added > 1 ? "s" : ""} ajoutée${json.added > 1 ? "s" : ""}`, "success");
        fetchCards(filters);
      } else {
        addToast("Aucune nouvelle carte", "neutral");
      }
    } catch {
      addToast("Erreur lors de la synchronisation", "neutral");
    } finally {
      setSyncing(false);
    }
  }, [addToast, fetchCards, filters]);

  const stats = data?.stats ?? DEFAULT_STATS;
  const cards: Card[] = data?.cards ?? [];
  const pagination = data?.pagination ?? {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800" style={{ background: "linear-gradient(180deg, #111827 0%, #0f172a 100%)" }}>
        <div className="px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "linear-gradient(135deg, #E3350D, #FF6B35)" }}>
              🔥
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight" style={{ background: "linear-gradient(90deg, #fff 0%, #f87171 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Salamèche Tracker
              </h1>
              <p className="text-[11px] text-gray-600 tracking-wide">Pokémon TCG Collection</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-3.5 py-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {syncing ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="text-sm">🔄</span>
              )}
              Sync
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm text-white rounded-lg font-medium transition-all hover:brightness-110 active:scale-95 shadow-lg"
              style={{ background: "linear-gradient(135deg, #E3350D, #c62a0a)" }}
            >
              <span className="text-base leading-none font-light">+</span>
              Ajouter
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={updateFilters}
        sets={meta.sets}
        rarities={meta.rarities}
        artTypes={meta.artTypes}
        langs={meta.langs}
      />

      {/* Table area */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-950/60 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span
                className="inline-block w-4 h-4 border-2 border-gray-600 border-t-red-500 rounded-full animate-spin"
              />
              Chargement...
            </div>
          </div>
        )}
        <CardsTable
          cards={cards}
          filters={filters}
          onSort={handleSort}
          onToggleOwned={handleToggleOwned}
          onDelete={handleDelete}
          onCardClick={setSelectedCard}
        />
      </div>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={(page) => updateFilters({ page })}
      />

      {/* Add Modal */}
      {showAdd && (
        <AddCardModal
          onClose={() => setShowAdd(false)}
          onAdded={() => fetchCards(filters)}
          sets={meta.sets}
          rarities={meta.rarities}
          artTypes={meta.artTypes}
          langs={meta.langs}
        />
      )}

      {/* Card Detail Panel */}
      <CardDetailPanel
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        onToggleOwned={handleToggleOwned}
      />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
