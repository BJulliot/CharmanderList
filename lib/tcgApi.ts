// PokémonTCG API utilities for Charmander (nationalPokedexNumber: 4)

const TCG_API_BASE = "https://api.pokemontcg.io/v2";

export interface TcgCard {
  id: string;
  name: string;
  number: string;
  rarity: string | null;
  subtypes: string[] | null;
  images: { small: string; large: string };
  set: { id: string; name: string; releaseDate: string };
}

interface TcgApiResponse {
  data: TcgCard[];
  page: number;
  pageSize: number;
  count: number;
  totalCount: number;
}

/** Fetch all Charmander cards from pokemontcg.io (handles pagination). */
export async function fetchAllCharmanderCards(): Promise<TcgCard[]> {
  const all: TcgCard[] = [];
  let page = 1;
  const pageSize = 250;

  while (true) {
    const url = `${TCG_API_BASE}/cards?q=nationalPokedexNumbers:4&pageSize=${pageSize}&page=${page}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`TCG API error: ${res.status}`);
    const json: TcgApiResponse = await res.json();
    all.push(...json.data);
    if (all.length >= json.totalCount || json.data.length < pageSize) break;
    page++;
  }

  return all;
}

/**
 * Comprehensive set name mapping: DB name (lowercase) → API name (lowercase).
 *
 * Covers:
 * - EX-era sets (our DB has "EX X", API drops the "EX " prefix)
 * - Original Base Set (API uses "Base", not "Base Set")
 * - Japanese regional set names → their English equivalents
 * - Korean/Chinese/Indonesian/Thai regional names → English equivalents
 * - Misc spelling/capitalisation differences
 */
const SET_MAP: Record<string, string> = {
  // ── English set name fixes ──────────────────────────────────────────────
  "base set": "base",
  "ex crystal guardians": "crystal guardians",
  "ex firered & leafgreen": "firered & leafgreen",
  "ex power keepers": "power keepers",
  "ex dragon": "dragon",
  "ex trainer kit: minun half deck": "ex trainer kit 2 minun",
  "ex delta species": "delta species",          // probably not in API but try
  "obsidian flame": "obsidian flames",           // singular vs plural
  "pokémon go": "pokémon go",                   // same but keep for normalisation
  "sword & shield promotional cards": "swsh black star promos",
  "svp promotional cards": "scarlet & violet black star promos",
  "sv-p promotional cards": "scarlet & violet black star promos",
  "mcdonald's collection 2021": "mcdonald's collection 2021",

  // ── Japanese set names → English equivalents ───────────────────────────
  "expansion pack": "base",                      // JPN 1996 base set
  "rocket gang": "team rocket",
  "challenge from the darkness": "gym challenge",
  "guren town Gym": "gym challenge",
  "guren town gym": "gym challenge",
  "amazing volt tackle": "vivid voltage",
  "dragon storm": "dragon majesty",
  "advent of arceus": "arceus",
  "freeze bolt": "boundaries crossed",
  "gx ultra shiny": "hidden fates",
  "tag bolt": "team up",
  "pokémon card 151": "151",
  "collect 151 journey": "151",
  "ruler of the black flame": "obsidian flames",
  "shiny treasure ex": "paldean fates",
  "phantasmal flames": "phantasmal flames",
  "great detective pikachu": "detective pikachu",
  "void blast": "ascended heroes",
  "expansion pack 20th anniversary": "evolutions",
  "inferno x": "burning shadows",                // JPN name for Burning Shadows
  "shining darkness": "stormfront",              // JPN name for Stormfront
  "intense fight in the destroyed sky": "stormfront",
  "miracle crystal": "secret wonders",           // rough equivalent
  "world champions pack": "legendary treasures",
  "to have seen the battle rainbow": "burning shadows",
  "tag team gx power up box": "team up",
  "shining synergy set c": "vivid voltage",
  "vivid portrayals set a": "vivid voltage",
  "ardent obsidian": "obsidian flames",
  "battle master deck terastal charizard ex": "obsidian flames",
  "charizard special deck set ex": "obsidian flames",
  "charizard ex starter deck": "obsidian flames",
  "charizard ex master strategy deck": "obsidian flames",
  "tactics deck terastal charizard ex": "obsidian flames",
  "start deck 100 battle collection": "vivid voltage",
  "vmax climax": "shining fates",                // JPN equivalent of Shining Fates
  "shiny vmax collection set a": "shining fates",
  "pokemon card game classic": "legendary collection",
  "pokemon trading card game classic": "legendary collection",
  "pokékyun collection": "generations",
  "all stars collection set a": "hidden fates",
  "all stars collection gx starter deck": "hidden fates",
  "storming emergence set a": "lost thunder",
  "storming emergence gx starter deck": "lost thunder",
  "hidden shadow set a": "lost thunder",
  "hidden shadow gx starter deck": "lost thunder",
  "double burst set b": "team up",
  "double burst gx starter deck": "team up",
  "first impact set a": "sun & moon",
  "first impact gx starter deck": "sun & moon",
  "black shine": "lost thunder",
  "blue blaze": "burning shadows",
  "my first battle": "vivid voltage",
  "family pokémon card game": "vivid voltage",
  "random half deck": "base",
  "quick starter gift set": "base",
  "pokémon-e starter deck": "expedition base set",
  "gift box: latias half deck": "ex firered & leafgreen",  // era
  "ex compact deck": "ex power keepers",
  "earth's groudon ex constructed starter deck": "ex emerald",
  "charizard random constructed starter deck": "ex firered & leafgreen",
  "kanto first partners pack": "evolutions",
  "fire charizard-gx starter deck": "burning shadows",
  "tag team collection gx starter deck": "team up",
  "dreams come true collection set b": "vivid voltage",

  // ── Korean / Chinese / Indonesian / Thai specifics ─────────────────────
  // Many use the same JPN names above — additional ones:
  "guardians of ancient times": "boundaries crossed",   // KOR era
  "amazing volt tackle": "vivid voltage",               // duplicate for KOR
  "brave stars set a": "vivid voltage",
  "battle party dream": "vivid voltage",
  "battle party set deck b": "vivid voltage",
  "adventure special pack": "paldean fates",
  "ardent obsidian": "obsidian flames",
};

/** Normalise a set name for lookup: lowercase + trim. */
function normSet(s: string): string {
  return s.toLowerCase().trim();
}

/** Normalise a card number: strip "/total" suffix, strip leading zeros. */
function normNumber(n: string): string {
  const base = n.split("/")[0].trim().replace(/^0+(\d)/, "$1");
  return base;
}

/**
 * Build TWO lookups from the TCG API cards:
 *  1. `exact`:  "api_set_norm|number_norm" → image_url   (number-level match)
 *  2. `bySet`:  "api_set_norm" → image_url[]             (any image from that set)
 */
export interface ImageLookup {
  exact: Map<string, string>;
  bySet: Map<string, string[]>;
}

export function buildImageLookup(cards: TcgCard[]): ImageLookup {
  const exact = new Map<string, string>();
  const bySet = new Map<string, string[]>();

  for (const card of cards) {
    const sn = normSet(card.set.name);
    const nn = normNumber(card.number);
    const img = card.images.small;

    const exactKey = `${sn}|${nn}`;
    if (!exact.has(exactKey)) exact.set(exactKey, img);

    if (!bySet.has(sn)) bySet.set(sn, []);
    bySet.get(sn)!.push(img);
  }

  return { exact, bySet };
}

/**
 * Find image URL for a DB card.
 * Strategy (in order):
 *  1. Exact match  (api_set_norm | number_norm)
 *  2. Exact match via SET_MAP alias
 *  3. Single-card fallback: if the set has exactly 1 Charmander in the API, use it
 *  4. Multi-card fallback: if set has multiple and number partially matches index, use first
 */
export function findImage(
  lookup: ImageLookup,
  setName: string,
  number: string
): string | undefined {
  const { exact, bySet } = lookup;
  const sn = normSet(setName);
  const nn = normNumber(number);

  // 1. Direct exact match
  const directKey = `${sn}|${nn}`;
  if (exact.has(directKey)) return exact.get(directKey)!;

  // 2. Via SET_MAP alias
  const mappedSet = SET_MAP[sn];
  if (mappedSet) {
    const aliasKey = `${mappedSet}|${nn}`;
    if (exact.has(aliasKey)) return exact.get(aliasKey)!;
  }

  // 3. Single-card fallback: the set has exactly 1 Charmander → use it
  const resolvedSet = mappedSet ?? sn;
  const setImages = bySet.get(resolvedSet);
  if (setImages && setImages.length === 1) return setImages[0];

  // 4. Multi-card fallback: use first image (better than nothing)
  if (setImages && setImages.length > 1) return setImages[0];

  return undefined;
}

/** Derive art_type from TCG API subtypes + rarity. */
export function deriveArtType(
  subtypes: string[] | null,
  rarity: string | null
): string {
  const s = subtypes ?? [];
  const r = rarity ?? "";
  if (s.some((t) => t === "Full Art")) return "Full Art";
  if (s.some((t) => t === "Radiant")) return "Shiny Holo";
  if (r.toLowerCase().includes("holo rare")) return "Holo";
  return "Non-Holo";
}
