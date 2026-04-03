import { getDb } from "@/lib/db";
import {
  fetchAllCharmanderCards,
  buildImageLookup,
  findImage,
} from "@/lib/tcgApi";

export const dynamic = "force-dynamic";

export async function POST() {
  const db = getDb();

  const tcgCards = await fetchAllCharmanderCards();
  const lookup = buildImageLookup(tcgCards);

  const dbCards = db
    .prepare(
      "SELECT id, set_name, number FROM cards WHERE set_name IS NOT NULL AND number IS NOT NULL"
    )
    .all() as { id: number; set_name: string; number: string }[];

  const updateStmt = db.prepare("UPDATE cards SET image_url = ? WHERE id = ?");

  let matched = 0;
  const updateMany = db.transaction(() => {
    for (const card of dbCards) {
      const imageUrl = findImage(lookup, card.set_name, card.number);
      if (imageUrl) {
        updateStmt.run(imageUrl, card.id);
        matched++;
      }
    }
  });
  updateMany();

  return Response.json({ matched, total: dbCards.length });
}
