import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

function getUserIdFromUrl(req: NextRequest) {
  const url = new URL(req.url);
  const idParam = url.pathname.split("/").pop();
  const userId = Number(idParam);
  return isNaN(userId) ? null : userId;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromUrl(req);
    if (!userId)
      return NextResponse.json({ message: "Nieprawidłowe userId" }, { status: 400 });

    const card = await prisma.card.findFirst({
      where: { userId },
      include: {
        cardItems: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      card || { message: "The basket is empty", cardItems: [] },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/card/[userId] error:", error);
    return NextResponse.json(
      { message: "Failed to download basket", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromUrl(req);
    if (!userId)
      return NextResponse.json({ message: "Incorrect userId" }, { status: 400 });

    const { productId, quantity } = await req.json();
    if (!productId || !quantity)
      return NextResponse.json({ message: "No product data available" }, { status: 400 });

    const product = await prisma.product.findUnique({
      where: { id: Number(productId) },
    });
    if (!product)
      return NextResponse.json({ message: "The product does not exist" }, { status: 404 });

    let card = await prisma.card.findFirst({ where: { userId } });
    if (!card) {
      card = await prisma.card.create({ data: { userId } });
    }

    const existingItem = await prisma.cardItem.findFirst({
      where: { cardId: card.id, productId: Number(productId) },
    });

    let cardItem;

    if (existingItem) {
      cardItem = await prisma.cardItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + Number(quantity) },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    } else {
      cardItem = await prisma.cardItem.create({
        data: {
          cardId: card.id,
          productId: Number(productId),
          quantity: Number(quantity),
          price: product.price,
        },
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      });
    }

    return NextResponse.json(cardItem, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/card/[userId] error:", error);
    return NextResponse.json(
      { message: "Could not add product to cart", error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/card/[userId]
export async function PUT(req: NextRequest) {
  try {
    const userId = getUserIdFromUrl(req);
    if (!userId)
      return NextResponse.json({ message: "Incorrect userId" }, { status: 400 });

    const { cardItemId, quantity } = await req.json();
    if (!cardItemId || quantity === undefined)
      return NextResponse.json(
        { message: "No data to update" },
        { status: 400 }
      );

    const updatedItem = await prisma.cardItem.update({
      where: { id: Number(cardItemId) },
      data: { quantity: Number(quantity) },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/card/[userId] error:", error);
    return NextResponse.json(
      { message: "Failed to update cart", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/card/[userId]
export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserIdFromUrl(req);
    if (!userId)
      return NextResponse.json({ message: "Incorrect userId" }, { status: 400 });

    const { cardItemId } = await req.json();
    if (!cardItemId)
      return NextResponse.json(
        { message: "No product ID to remove" },
        { status: 400 }
      );

    await prisma.cardItem.delete({
      where: { id: Number(cardItemId) },
    });

    return NextResponse.json(
      { message: "Product removed from cart" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/card/[userId] error:", error);
    return NextResponse.json(
      { message: "Could not remove product from cart", error: error.message },
      { status: 500 }
    );
  }
}
