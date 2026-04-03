import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "salameche.db");
const SEED_PATH = path.join(process.cwd(), "data", "cards_seed.json");

function main() {
  // Ensure data dir exists
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = new Database(DB_PATH);

  // Create table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_name TEXT NOT NULL,
      set_name TEXT,
      number TEXT,
      rarity TEXT,
      lang TEXT,
      year INTEGER,
      version_notes TEXT,
      art_type TEXT,
      artwork TEXT,
      owned INTEGER DEFAULT 0
    );
  `);

  // Check if already seeded
  const count = (db.prepare("SELECT COUNT(*) as n FROM cards").get() as { n: number }).n;
  if (count > 0) {
    console.log(`DB already has ${count} cards. Skipping seed.`);
    db.close();
    return;
  }

  // Read JSON seed
  const cards = JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));

  const insert = db.prepare(`
    INSERT INTO cards (card_name, set_name, number, rarity, lang, year, version_notes, art_type, artwork, owned)
    VALUES (@card_name, @set_name, @number, @rarity, @lang, @year, @version_notes, @art_type, @artwork, @owned)
  `);

  const insertMany = db.transaction((rows: typeof cards) => {
    for (const row of rows) {
      insert.run(row);
    }
  });

  insertMany(cards);

  const finalCount = (db.prepare("SELECT COUNT(*) as n FROM cards").get() as { n: number }).n;
  const ownedCount = (db.prepare("SELECT COUNT(*) as n FROM cards WHERE owned = 1").get() as { n: number }).n;
  console.log(`Seeded ${finalCount} cards (${ownedCount} owned) into ${DB_PATH}`);

  db.close();
}

main();
