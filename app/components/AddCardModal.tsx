"use client";

import { useState, useRef, useEffect } from "react";
import { CardInput } from "@/lib/db";
import { LANG_FLAGS } from "@/lib/types";

interface AddCardModalProps {
  onClose: () => void;
  onAdded: () => void;
  sets: string[];
  rarities: string[];
  artTypes: string[];
  langs: string[];
}

const EMPTY: CardInput = {
  card_name: "",
  set_name: "",
  number: "",
  rarity: "",
  lang: "",
  year: undefined,
  version_notes: "",
  art_type: "",
  artwork: "",
  owned: 0,
};

export function AddCardModal({
  onClose,
  onAdded,
  sets,
  rarities,
  artTypes,
  langs,
}: AddCardModalProps) {
  const [form, setForm] = useState<CardInput>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (field: keyof CardInput, value: string | number | null | undefined) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.card_name?.trim()) {
      setError("Le nom de la carte est obligatoire.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          set_name: form.set_name || null,
          number: form.number || null,
          rarity: form.rarity || null,
          lang: form.lang || null,
          year: form.year || null,
          version_notes: form.version_notes || null,
          art_type: form.art_type || null,
          artwork: form.artwork || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur inconnue");
        return;
      }
      onAdded();
      onClose();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-red-500 w-full";
  const labelClass = "text-xs text-gray-400 mb-1 block";

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Ajouter une carte</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 grid grid-cols-2 gap-4">
          {/* Card Name */}
          <div className="col-span-2">
            <label className={labelClass}>Nom de la carte *</label>
            <input
              ref={firstInputRef}
              type="text"
              value={form.card_name}
              onChange={(e) => set("card_name", e.target.value)}
              placeholder="ex: ヒトカゲ"
              className={inputClass}
              required
            />
          </div>

          {/* Set */}
          <div>
            <label className={labelClass}>Set</label>
            <input
              type="text"
              value={form.set_name ?? ""}
              onChange={(e) => set("set_name", e.target.value)}
              list="sets-list"
              placeholder="ex: Base Set"
              className={inputClass}
            />
            <datalist id="sets-list">
              {sets.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>

          {/* Number */}
          <div>
            <label className={labelClass}>#</label>
            <input
              type="text"
              value={form.number ?? ""}
              onChange={(e) => set("number", e.target.value)}
              placeholder="ex: 004"
              className={inputClass}
            />
          </div>

          {/* Rarity */}
          <div>
            <label className={labelClass}>Rareté</label>
            <input
              type="text"
              value={form.rarity ?? ""}
              onChange={(e) => set("rarity", e.target.value)}
              list="rarities-list"
              placeholder="ex: C"
              className={inputClass}
            />
            <datalist id="rarities-list">
              {rarities.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          {/* Lang */}
          <div>
            <label className={labelClass}>Langue</label>
            <select
              value={form.lang ?? ""}
              onChange={(e) => set("lang", e.target.value)}
              className={inputClass}
            >
              <option value="">— Sélectionner —</option>
              {langs.map((l) => (
                <option key={l} value={l}>
                  {LANG_FLAGS[l] ?? "🌐"} {l}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className={labelClass}>Année</label>
            <input
              type="number"
              value={form.year ?? ""}
              onChange={(e) =>
                set("year", e.target.value ? parseInt(e.target.value, 10) : null)
              }
              placeholder="ex: 1996"
              min={1996}
              max={2100}
              className={inputClass}
            />
          </div>

          {/* Version / Notes */}
          <div>
            <label className={labelClass}>Version / Notes</label>
            <input
              type="text"
              value={form.version_notes ?? ""}
              onChange={(e) => set("version_notes", e.target.value)}
              placeholder="ex: 1st Edition"
              className={inputClass}
            />
          </div>

          {/* Art Type */}
          <div>
            <label className={labelClass}>Type d&apos;art</label>
            <input
              type="text"
              value={form.art_type ?? ""}
              onChange={(e) => set("art_type", e.target.value)}
              list="art-types-list"
              placeholder="ex: Non-Holo"
              className={inputClass}
            />
            <datalist id="art-types-list">
              {artTypes.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>

          {/* Artwork */}
          <div>
            <label className={labelClass}>Artwork</label>
            <input
              type="text"
              value={form.artwork ?? ""}
              onChange={(e) => set("artwork", e.target.value)}
              placeholder="ex: Base Set"
              className={inputClass}
            />
          </div>

          {/* Owned */}
          <div className="col-span-2 flex items-center gap-3">
            <input
              id="owned-checkbox"
              type="checkbox"
              checked={!!form.owned}
              onChange={(e) => set("owned", e.target.checked ? 1 : 0)}
              className="w-4 h-4 accent-red-500"
            />
            <label htmlFor="owned-checkbox" className="text-sm text-gray-300 cursor-pointer">
              Je possède cette carte
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="col-span-2 text-red-400 text-sm bg-red-950/30 border border-red-800/50 rounded px-3 py-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white rounded font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: "#E3350D" }}
            >
              {loading ? "Ajout en cours..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
