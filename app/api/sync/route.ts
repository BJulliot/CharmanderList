import { getDb } from "@/lib/db";
import { fetchAllCharmanderCards, deriveArtType } from "@/lib/tcgApi";

export const dynamic = "force-dynamic";

export async function POST() {
  const db = getDb();

  const tcgCards = await fetchAllCharmanderCards();

  const insertStmt = db.prepare(`
    INSERT INTO cards (card_name, set_name, number, rarity, lang, year, version_notes, art_type, artwork, owned, image_url)
    VALUES (@card_name, @set_name, @number, @rarity, @lang, @year, @version_notes, @art_type, @artwork, 0, @image_url)
  `);

  // Dedup key: set_name + number + lang + version_notes + art_type + artwork
  const existingRows = db
    .prepare(
      "SELECT set_name, number, lang, version_notes, art_type, artwork FROM cards"
    )
    .all() as {
    set_name: string | null;
    number: string | null;
    lang: string | null;
    version_notes: string | null;
    art_type: string | null;
    artwork: string | null;
  }[];

  const existingKeys = new Set(
    existingRows.map((r) =>
      dedupKey(
        r.set_name,
        r.number,
        "ENG",
        r.version_notes,
        r.art_type,
        r.artwork
      )
    )
  );

  let added = 0;
  let already_exists = 0;

  const insertMany = db.transaction(() => {
    for (const card of tcgCards) {
      const art_type = deriveArtType(card.subtypes, card.rarity);
      const artwork = card.name;
      const year = card.set.releaseDate
        ? new Date(card.set.releaseDate).getFullYear()
        : null;

      const key = dedupKey(
        card.set.name,
        card.number,
        "ENG",
        null,
        art_type,
        artwork
      );

      if (existingKeys.has(key)) {
        already_exists++;
        continue;
      }

      insertStmt.run({
        card_name: card.name,
        set_name: card.set.name,
        number: card.number,
        rarity: card.rarity ?? null,
        lang: "ENG",
        year: year ?? null,
        version_notes: null,
        art_type,
        artwork,
        image_url: card.images.small,
      });

      existingKeys.add(key);
      added++;
    }
  });

  insertMany();

  return Response.json({
    added,
    already_exists,
    total_fetched: tcgCards.length,
  });
}

function dedupKey(
  set_name: string | null,
  number: string | null,
  lang: string | null,
  version_notes: string | null,
  art_type: string | null,
  artwork: string | null
): string {
  return [set_name, number, lang, version_notes, art_type, artwork]
    .map((v) => (v ?? "").toLowerCase().trim())
    .join("|");
}
