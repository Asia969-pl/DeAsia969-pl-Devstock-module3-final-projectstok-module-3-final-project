import { NextResponse } from "next/server";
import { prisma } from "@/library/prisma";

export async function GET() {
  try {
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
      },
    });

    return NextResponse.json(orderItems);
  } catch (error) {
    console.error("Błąd podczas pobierania orderItems:", error);
    return NextResponse.json(
      { message: "Nie udało się pobrać pozycji zamówień" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, productId, quantity, price } = body;

    // 🔍 Walidacja
    if (!orderId || !productId || !quantity || !price) {
      return NextResponse.json(
        { message: "Brakuje wymaganych pól" },
        { status: 400 }
      );
    }

    const newOrderItem = await prisma.orderItem.create({
      data: {
        orderId: Number(orderId),
        productId: Number(productId),
        quantity: Number(quantity),
        price: Number(price),
      },
    });

    return NextResponse.json(newOrderItem, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas tworzenia orderItem:", error);
    return NextResponse.json(
      { message: "Nie udało się utworzyć pozycji zamówienia" },
      { status: 500 }
    );
  }
}
