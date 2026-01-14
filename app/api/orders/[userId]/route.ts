import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

// Funkcja wyciągająca userId z URL
function getUserIdFromUrl(req: NextRequest): number | null {
  const url = new URL(req.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const idPart = parts.pop();
  const userId = Number(idPart);
  return isNaN(userId) ? null : userId;
}

// GET /api/orders/[userId]
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromUrl(req);

    if (!userId) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        address: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/orders/[userId] error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// POST /api/orders/[userId]
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromUrl(req);

    if (!userId) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const body = await req.json();

    const {
      addressId,
      items,
      shippingCost,
      serviceFee,
    } = body;

    if (!addressId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "addressId and items are required" },
        { status: 400 }
      );
    }

    // Walidacja items
    for (const item of items) {
      if (
        typeof item.productId !== "number" ||
        typeof item.quantity !== "number" ||
        typeof item.price !== "number"
      ) {
        return NextResponse.json(
          { message: "Invalid item structure" },
          { status: 400 }
        );
      }
    }

    const productTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const protectionTotal = items.reduce(
      (sum, item) => sum + (item.protectionFee || 0),
      0
    );

    const shipping = typeof shippingCost === "number" ? shippingCost : 0;
    const service = typeof serviceFee === "number" ? serviceFee : 0;

    const totalAmount =
      productTotal + protectionTotal + shipping + service;

    const newOrder = await prisma.order.create({
      data: {
        userId,
        addressId,
        productTotal,
        protectionTotal,
        shippingCost: shipping,
        serviceFee: service,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            protectionFee: item.protectionFee || 0,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/orders/[userId] error:", err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
