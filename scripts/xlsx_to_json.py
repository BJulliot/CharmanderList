#!/usr/bin/env python3
"""Read the Salamèche xlsx and output cards_seed.json"""

import json
import sys
import openpyxl

XLSX_PATH = "/mnt/d/Bordel/Salamèche_Master_List_Complète.xlsx"
OUT_PATH = "/home/workspace/salameche-tracker/data/cards_seed.json"


def normalize(val):
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return val
    return str(val).strip() or None


def main():
    wb = openpyxl.load_workbook(XLSX_PATH, read_only=True, data_only=True)
    ws = wb.active

    rows = list(ws.iter_rows(values_only=True))
    # Print first 3 rows to understand structure
    print("First 3 rows:", file=sys.stderr)
    for r in rows[:3]:
        print(r, file=sys.stderr)

    # Row 0 is header; data starts at row 1
    # Columns (0-indexed):
    # 0: Card Name, 1: Set, 2: empty, 3: #, 4: Rarity, 5: Lang,
    # 6: Year, 7: Version/Notes, 8: Art Type, 9: Artwork,
    # 10: Owned (X = owned), 11: empty
    cards = []
    for i, row in enumerate(rows[1:], start=2):
        card_name = normalize(row[0])
        if not card_name:
            continue  # skip empty rows

        set_name = normalize(row[1])
        number = normalize(row[3])
        rarity = normalize(row[4])
        lang = normalize(row[5])
        year_raw = row[6]
        year = int(year_raw) if isinstance(year_raw, (int, float)) and year_raw else (int(str(year_raw).strip()) if year_raw and str(year_raw).strip().isdigit() else None)
        version_notes = normalize(row[7])
        art_type = normalize(row[8])
        artwork = normalize(row[9])
        owned_raw = normalize(row[10])
        owned = 1 if owned_raw and owned_raw.upper() == "X" else 0

        cards.append({
            "card_name": card_name,
            "set_name": set_name,
            "number": number,
            "rarity": rarity,
            "lang": lang,
            "year": year,
            "version_notes": version_notes,
            "art_type": art_type,
            "artwork": artwork,
            "owned": owned,
        })

    print(f"Total cards: {len(cards)}", file=sys.stderr)
    print(f"Owned: {sum(c['owned'] for c in cards)}", file=sys.stderr)

    # Print unique langs
    langs = sorted(set(c["lang"] for c in cards if c["lang"]))
    print(f"Languages: {langs}", file=sys.stderr)

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)

    print(f"Written {len(cards)} cards to {OUT_PATH}", file=sys.stderr)


if __name__ == "__main__":
    main()
