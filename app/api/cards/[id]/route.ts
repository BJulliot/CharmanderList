import { type NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb();
  const { id } = await params;
  const cardId = parseInt(id, 10);

  if (isNaN(cardId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const body: { owned: boolean } = await request.json();
  const ownedVal = body.owned ? 1 : 0;

  const info = db
    .prepare("UPDATE cards SET owned = ? WHERE id = ?")
    .run(ownedVal, cardId);

  if (info.changes === 0) {
    return Response.json({ error: "Card not found" }, { status: 404 });
  }

  const card = db.prepare("SELECT * FROM cards WHERE id = ?").get(cardId);
  return Response.json(card);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb();
  const { id } = await params;
  const cardId = parseInt(id, 10);

  if (isNaN(cardId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const info = db.prepare("DELETE FROM cards WHERE id = ?").run(cardId);

  if (info.changes === 0) {
    return Response.json({ error: "Card not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
