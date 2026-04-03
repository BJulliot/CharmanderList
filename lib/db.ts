import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "salameche.db");
  _db = new Database(dbPath);

  _db.exec(`
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

  // Safe migration: add image_url if it doesn't exist yet
  const cols = _db.prepare("PRAGMA table_info(cards)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "image_url")) {
    _db.exec("ALTER TABLE cards ADD COLUMN image_url TEXT");
  }

  return _db;
}

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

export interface CardInput {
  card_name: string;
  set_name?: string | null;
  number?: string | null;
  rarity?: string | null;
  lang?: string | null;
  year?: number | null;
  version_notes?: string | null;
  art_type?: string | null;
  artwork?: string | null;
  owned?: number;
  image_url?: string | null;
}
