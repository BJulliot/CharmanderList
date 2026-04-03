import { getDb } from "@/lib/db";
import { CollectionClient } from "./components/CollectionClient";

export const dynamic = "force-dynamic";

function getMeta() {
  const db = getDb();

  const sets = (
    db
      .prepare(
        "SELECT DISTINCT set_name FROM cards WHERE set_name IS NOT NULL ORDER BY set_name"
      )
      .all() as { set_name: string }[]
  ).map((r) => r.set_name);

  const rarities = (
    db
      .prepare(
        "SELECT DISTINCT rarity FROM cards WHERE rarity IS NOT NULL ORDER BY rarity"
      )
      .all() as { rarity: string }[]
  ).map((r) => r.rarity);

  const artTypes = (
    db
      .prepare(
        "SELECT DISTINCT art_type FROM cards WHERE art_type IS NOT NULL ORDER BY art_type"
      )
      .all() as { art_type: string }[]
  ).map((r) => r.art_type);

  const langs = (
    db
      .prepare(
        "SELECT DISTINCT lang FROM cards WHERE lang IS NOT NULL ORDER BY lang"
      )
      .all() as { lang: string }[]
  ).map((r) => r.lang);

  const noImageCount = (
    db
      .prepare(
        "SELECT COUNT(*) as n FROM cards WHERE image_url IS NULL"
      )
      .get() as { n: number }
  ).n;

  return { sets, rarities, artTypes, langs, hasCardsWithoutImages: noImageCount > 0 };
}

export default function Home() {
  const meta = getMeta();
  return <CollectionClient meta={meta} />;
}
