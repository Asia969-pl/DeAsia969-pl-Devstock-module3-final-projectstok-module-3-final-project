import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

// Funkcja do wydobycia userId i cardItemId z URL
function getIdsFromUrl(req: NextRequest) {
  const segments = new URL(req.url).pathname.split("/").filter(Boolean); // usuwa puste segmenty
  const length = segments.length;

  if (length < 3) return { userId: null, cardItemId: null }; // oczekujemy /api/card/[userId]/[cardItemId]

  const userId = Number(segments[length - 2]);
  const cardItemId = Number(segments[length - 1]);

  return {
    userId: isNaN(userId) ? null : userId,
    cardItemId: isNaN(cardItemId) ? null : cardItemId,
  };
}

// GET /api/card/[userId]/[cardItemId]
export async function GET(req: NextRequest) {
  const { userId, cardItemId } = getIdsFromUrl(req);

  if (!userId || !cardItemId) {
    return NextResponse.json({ message: "Nieprawidłowe ID" }, { status: 400 });
  }

  try {
    const cardItem = await prisma.cardItem.findFirst({
      where: { id: cardItemId, card: { userId } },
      include: { 
        product: { 
          include: { category: true }  // <- dodaj category
        } 
      },
    });

    if (!cardItem) {
      return NextResponse.json({ message: "Nie znaleziono pozycji w koszyku" }, { status: 404 });
    }

    return NextResponse.json(cardItem);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Błąd serwera", error: error.message }, { status: 500 });
  }
}

// PUT /api/card/[userId]/[cardItemId]
export async function PUT(req: NextRequest) {
  const { userId, cardItemId } = getIdsFromUrl(req);

  if (!userId || !cardItemId) {
    return NextResponse.json({ message: "Nieprawidłowe ID" }, { status: 400 });
  }

  try {
    const { quantity } = await req.json();
    if (quantity === undefined) return NextResponse.json({ message: "Brak ilości" }, { status: 400 });

    const cardItem = await prisma.cardItem.findFirst({
      where: { id: cardItemId, card: { userId } },
    });
    if (!cardItem) return NextResponse.json({ message: "Nie znaleziono pozycji w koszyku" }, { status: 404 });

    const updatedItem = await prisma.cardItem.update({
      where: { id: cardItemId },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Nie udało się zaktualizować koszyka", error: error.message }, { status: 500 });
  }
}

// DELETE /api/card/[userId]/[cardItemId]
export async function DELETE(req: NextRequest) {
  const { userId, cardItemId } = getIdsFromUrl(req);

  if (!userId || !cardItemId) {
    return NextResponse.json({ message: "Nieprawidłowe ID" }, { status: 400 });
  }

  try {
    const cardItem = await prisma.cardItem.findFirst({
      where: { id: cardItemId, card: { userId } },
    });

    if (!cardItem) return NextResponse.json({ message: "Nie znaleziono pozycji w koszyku" }, { status: 404 });

    await prisma.cardItem.delete({ where: { id: cardItemId } });

    return NextResponse.json({ message: "Produkt usunięty z koszyka" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Nie udało się usunąć produktu z koszyka", error: error.message }, { status: 500 });
  }
}
