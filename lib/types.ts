export interface Card {
  id: number;
  card_name: string;
  set_name: string | null;
  number: string | null;
  rarity: string | null;
  lang: string | null;
  year: number | null;
  version_notes: string | null;
  art_type: string | null;
  artwork: string | null;
  owned: number;
  image_url: string | null;
}

export interface LangStat {
  lang: string;
  total: number;
  owned: number;
}

export interface Stats {
  total: number;
  owned: number;
  byLang: LangStat[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse {
  cards: Card[];
  pagination: Pagination;
  stats: Stats;
}

export interface Filters {
  search: string;
  number: string;
  lang: string;
  set: string;
  rarity: string;
  art_type: string;
  owned: "all" | "1" | "0";
  page: number;
  sort: string;
  dir: "asc" | "desc";
}

export const LANG_FLAGS: Record<string, string> = {
  ENG: "🇬🇧",
  FRE: "🇫🇷",
  GER: "🇩🇪",
  JPN: "🇯🇵",
  ITA: "🇮🇹",
  SPA: "🇪🇸",
  POR: "🇵🇹",
  KOR: "🇰🇷",
  TCHI: "🇹🇼",
  IND: "🇮🇩",
  THA: "🇹🇭",
  SCHI: "🇨🇳",
  LAT: "🌎",
  DUT: "🇳🇱",
};
