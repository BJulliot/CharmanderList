"use client";

import { Pagination as PaginationType } from "@/lib/types";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-t border-gray-800">
      <span className="text-xs text-gray-500">
        {from}–{to} sur {total} cartes
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-700 hover:text-gray-200 transition-colors"
        >
          ‹ Préc
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-600 text-xs">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                p === page
                  ? "text-white font-bold"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
              }`}
              style={p === page ? { backgroundColor: "#E3350D" } : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-2 py-1 text-xs rounded bg-gray-800 text-gray-400 disabled:opacity-30 hover:bg-gray-700 hover:text-gray-200 transition-colors"
        >
          Suiv ›
        </button>
      </div>
    </div>
  );
}
