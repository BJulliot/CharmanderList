import { type NextRequest } from "next/server";
import { getDb, type CardInput } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const db = getDb();
  const sp = request.nextUrl.searchParams;

  const search = sp.get("search") ?? "";
  const number = sp.get("number") ?? "";
  const lang = sp.get("lang") ?? "";
  const set = sp.get("set") ?? "";
  const rarity = sp.get("rarity") ?? "";
  const art_type = sp.get("art_type") ?? "";
  const owned = sp.get("owned") ?? "all";
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit = parseInt(sp.get("limit") ?? "50", 10);
  const sortCol = sp.get("sort") ?? "id";
  const sortDir = sp.get("dir") === "desc" ? "DESC" : "ASC";

  const allowedSorts = new Set([
    "id", "card_name", "set_name", "number", "rarity",
    "lang", "year", "version_notes", "art_type", "artwork", "owned",
  ]);
  const safeSort = allowedSorts.has(sortCol) ? sortCol : "id";

  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (search) {
    conditions.push("(card_name LIKE ? OR set_name LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (number) {
    conditions.push("number LIKE ?");
    params.push(`%${number}%`);
  }
  if (lang) {
    conditions.push("lang = ?");
    params.push(lang);
  }
  if (set) {
    conditions.push("set_name = ?");
    params.push(set);
  }
  if (rarity) {
    conditions.push("rarity = ?");
    params.push(rarity);
  }
  if (art_type) {
    conditions.push("art_type = ?");
    params.push(art_type);
  }
  if (owned === "1") {
    conditions.push("owned = 1");
  } else if (owned === "0") {
    conditions.push("owned = 0");
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const offset = (page - 1) * limit;

  const countRow = db
    .prepare(`SELECT COUNT(*) as n FROM cards ${where}`)
    .get(...params) as { n: number };
  const total = countRow.n;

  const cards = db
    .prepare(
      `SELECT * FROM cards ${where} ORDER BY ${safeSort} ${sortDir} LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset);

  // Stats
  const statsTotal = (db.prepare("SELECT COUNT(*) as n FROM cards").get() as { n: number }).n;
  const statsOwned = (db.prepare("SELECT COUNT(*) as n FROM cards WHERE owned = 1").get() as { n: number }).n;

  const langStats = db
    .prepare(
      "SELECT lang, COUNT(*) as total, SUM(owned) as owned FROM cards WHERE lang IS NOT NULL GROUP BY lang ORDER BY lang"
    )
    .all() as { lang: string; total: number; owned: number }[];

  return Response.json({
    cards,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    stats: { total: statsTotal, owned: statsOwned, byLang: langStats },
  });
}

export async function POST(request: Request) {
  const db = getDb();
  const body: CardInput = await request.json();

  if (!body.card_name?.trim()) {
    return Response.json({ error: "card_name is required" }, { status: 400 });
  }

  const stmt = db.prepare(`
    INSERT INTO cards (card_name, set_name, number, rarity, lang, year, version_notes, art_type, artwork, owned)
    VALUES (@card_name, @set_name, @number, @rarity, @lang, @year, @version_notes, @art_type, @artwork, @owned)
  `);

  const info = stmt.run({
    card_name: body.card_name.trim(),
    set_name: body.set_name ?? null,
    number: body.number ?? null,
    rarity: body.rarity ?? null,
    lang: body.lang ?? null,
    year: body.year ?? null,
    version_notes: body.version_notes ?? null,
    art_type: body.art_type ?? null,
    artwork: body.artwork ?? null,
    owned: body.owned ?? 0,
  });

  const card = db.prepare("SELECT * FROM cards WHERE id = ?").get(info.lastInsertRowid);
  return Response.json(card, { status: 201 });
}
